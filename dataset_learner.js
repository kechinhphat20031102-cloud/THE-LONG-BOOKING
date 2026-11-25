/**
 * dataset_learner.js – Học quy ước từ các mẫu đã kiểm tra (dataset form mới + mẫu bấm "Lưu mẫu đã sửa").
 * Không phải AI: tìm mẫu có cấu trúc tin giống nhất rồi mượn các trường "quy ước" (đại lý, tuyến,
 * loại xe, giờ hẹn, ghi chú, điểm trả mặc định) của mẫu đó. Thông tin khách luôn lấy từ tin mới.
 */
const DatasetLearner = {
  examples: [],          // [{raw, fields:{'Đại lý':..., ...}}]
  minScore: 0.3,         // độ giống tối thiểu để mượn quy ước (chọn bằng test_form_moi.js)
  // Trường nào mượn từ mẫu giống nhất; chọn theo kết quả đo trên dataset (xem test_form_moi.js).
  policy: {"Đại lý": "always", "Điểm đón": "fill", "Điểm trả": "fill", "agency:Ghi chú": 1, "route:Điểm trả": 1},

  strip(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); },
  norm(s) { return String(s ?? '').normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim(); },
  // Chữ trong tin, bỏ số; nhãn ("TÊN :", "CODE:", "Đón:") có trọng số gấp đôi vì thể hiện cấu trúc.
  shape(raw) {
    const s = this.strip(raw);
    const words = s.match(/[a-z]{2,}/g) || [];
    const labels = (s.match(/(?:^|\n|\/)\s*([a-z][a-z ]{1,25}?)\s*:/g) || []).map(x => 'L:' + x.replace(/[^a-z ]/g, '').trim());
    const bag = new Map();
    for (const w of [...words, ...labels, ...labels]) bag.set(w, (bag.get(w) || 0) + 1);
    return bag;
  },
  similarity(a, b) {
    let inter = 0, union = 0;
    for (const k of new Set([...a.keys(), ...b.keys()])) { const x = a.get(k) || 0, y = b.get(k) || 0; inter += Math.min(x, y); union += Math.max(x, y); }
    return union ? inter / union : 0;
  },
  literal(value, raw) { const v = this.norm(value); return !!v && this.norm(raw).includes(v); },
  nearest(raw, pool = this.examples) {
    const target = this.shape(raw);
    let best = null;
    for (const e of pool) {
      if (this.norm(e.raw) === this.norm(raw)) return { example: e, score: 1 };
      e._shape = e._shape || this.shape(e.raw);
      const score = this.similarity(target, e._shape);
      if (!best || score > best.score) best = { example: e, score };
    }
    return best;
  },
  // Mã số đại lý (BUFFALO 810, FAMILY HOME BUS 970...): tìm nhãn đứng trước số trong mẫu, lấy số cùng nhãn ở tin mới.
  adaptCodes(value, exRaw, raw) {
    return value.replace(/\d{3,}/g, num => {
      const m = new RegExp(`([\\p{L}#@]+)\\s*:?\\s*${num}`, 'iu').exec(exRaw);
      if (!m) return num;
      const n = new RegExp(`${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:?\\s*(\\d{3,})`, 'iu').exec(raw);
      return n ? n[1] : num;
    });
  },
  // Kho mẫu: 100 mẫu dataset + mẫu người dùng bấm "Lưu mẫu đã sửa để học" (mẫu đã lưu được ưu tiên vì nằm trước).
  pool() {
    const saved = [];
    try {
      const labels = {'Mã booking':1,'Đại lý':1,'Ngày đi':1,'Lịch trình':1,'Loại xe':1,'Số lượng khách':1,'Thông tin khách':1,'Giờ đón':1,'Điểm đón':1,'Điểm trả':1,'Giá dịch vụ':1,'Ghi chú':1};
      const old = {'Code':'Mã booking','Tên khách':'Thông tin khách','Giá vé':'Giá dịch vụ','Note':'Ghi chú'};
      for (const e of (typeof BookingMemory !== 'undefined' ? BookingMemory.list() : [])) {
        const fields = {};
        for (const line of String(e.form || '').split(/\r?\n/)) {
          const i = line.indexOf(':'); if (i < 0) continue;
          let k = line.slice(0, i).replace(/^[^\p{L}]+/u, '').trim(); k = old[k] || k;
          if (labels[k] && !(k in fields)) fields[k] = line.slice(i + 1).trim();
        }
        if (Object.keys(fields).length >= 6) saved.push({ raw: e.raw, fields });
      }
    } catch { /* bộ nhớ mẫu lỗi thì chỉ dùng dataset */ }
    return [...saved, ...(typeof DATASET_EXAMPLES !== 'undefined' ? DATASET_EXAMPLES : (typeof require === 'function' ? require('./dataset_examples') : []))];
  },
  apply(raw, result, pool = this.pool()) {
    const hit = this.nearest(raw, pool);
    if (!hit || hit.score < this.minScore) return { ...result, learnedFrom: null };
    const e = hit.example, f = e.fields, out = { ...result };
    const P = this.policy;
    const borrow = (field, key, cond = true) => {
      const mode = P[field];
      if (!mode || !cond || f[field] == null) return;
      if (mode === 'fill' && String(out[key] ?? '').trim()) return;
      // Điểm đón/trả có trong tin mẫu là địa chỉ riêng của booking đó: không chép sang khách khác.
      if (/Point$/.test(key) && this.literal(f[field], e.raw)) return;
      if (mode === 'convention' && this.literal(f[field], e.raw)) return; // giá trị có sẵn trong tin mẫu = thông tin riêng, không mượn
      out[key] = this.adaptCodes(f[field], e.raw, raw);
    };
    const sameTrip = (e._timeStr ?? (e._timeStr = (this.parser()?.parse(e.raw).timeStr || ''))) === (result.timeStr || '');
    borrow('Đại lý', 'agency');
    borrow('Lịch trình', 'route');
    borrow('Loại xe', 'vehicle');
    borrow('Giờ đón', 'pickupTime', sameTrip);
    borrow('Điểm đón', 'pickupPoint');
    borrow('Điểm trả', 'dropPoint');
    borrow('Giá dịch vụ', 'price', sameTrip && Number(result.pax) === Number(f['Số lượng khách']));
    borrow('Ghi chú', 'note');
    // Quy ước theo đại lý: giá trị gặp nhiều nhất trong các mẫu cùng đại lý (và cùng tuyến nếu có).
    const fam = a => this.strip(a).split(/\s+/)[0] || '';
    const peers = (pool || this.examples).filter(x => fam(x.fields['Đại lý']) === fam(out.agency) && this.norm(x.raw) !== this.norm(raw));
    const vote = (field, sameRoute) => {
      const c = new Map();
      for (const x of peers) { if (sameRoute && this.norm(x.fields['Lịch trình']) !== this.norm(out.route)) continue; const v = x.fields[field] ?? ''; c.set(v, (c.get(v) || 0) + 1); }
      const top = [...c].sort((a, b) => b[1] - a[1])[0];
      return top && top[1] >= 2 && top[1] / [...c.values()].reduce((a, b) => a + b, 0) >= 0.6 ? top[0] : null;
    };
    const byAgency = (field, key, sameRoute, onlyEmpty) => {
      if (!P['agency:' + field]) return;
      if (onlyEmpty && String(out[key] ?? '').trim()) return;
      const v = vote(field, sameRoute); if (v != null) out[key] = v;
    };
    // Điểm trả trống: lấy cách ghi phổ biến nhất của các mẫu cùng tuyến.
    if (P['route:Điểm trả'] && !String(out.dropPoint ?? '').trim()) {
      const c = new Map();
      for (const x of (pool || this.examples)) if (this.norm(x.fields['Lịch trình']).replace(/[\s-]/g, '') === this.norm(out.route).replace(/[\s-]/g, '') && x.fields['Điểm trả'] && !this.literal(x.fields['Điểm trả'], x.raw)) {
        const k = this.strip(x.fields['Điểm trả']); const cur = c.get(k) || { n: 0, v: x.fields['Điểm trả'] }; cur.n++; c.set(k, cur);
      }
      const top = [...c.values()].sort((a, b) => b.n - a.n)[0];
      if (top && top.n >= 2) out.dropPoint = top.v;
    }
    // Địa chỉ Google Maps dài: chỉ giữ tên điểm.
    for (const k of ['pickupPoint', 'dropPoint']) {
      const v = String(out[k] || '');
      const cut = v.search(/\s*(?:,|\s-\s)\s*(?=[^()]*(?:Việt Nam|Viet Nam|Viêt|Phú Thọ|Quảng Ninh|Tây Hoa Lư|@))/i);
      if (cut > 3) out[k] = v.slice(0, cut).trim();
      if (/^(?:cb|cat ba|cát bà)$/i.test(out[k] || '')) out[k] = 'Cát Bà';
    }
    byAgency('Ghi chú', 'note', false, false);
    byAgency('Điểm trả', 'dropPoint', true, true);
    byAgency('Loại xe', 'vehicle', true, false);
    byAgency('Lịch trình', 'route', false, false);
    const parser = this.parser();
    if (parser && parser.renderForm) {
      const c = parser.splitContact(out.customerString);
      if (out.customerString !== result.customerString || !out.customerInfo) out.customerInfo = c.phone ? (c.name ? `${c.name} – ${c.phone}` : c.phone) : c.name;
      out.code = out.code || result.code;
      out.zaloMsg = parser.renderForm(out);
      out.excel4Cols = `${out.pickupPoint || ''}\t${out.dropPoint || ''}\t${out.customerString || ''}\t${out.pax ?? ''}\t${out.agency || ''}`;
    }
    out.learnedFrom = { score: Math.round(hit.score * 100) / 100, raw: e.raw.slice(0, 80) };
    return out;
  },
  parser() { return typeof BookingParser !== 'undefined' ? BookingParser : (typeof require === 'function' ? require('./parser') : null); }
};
if (typeof module !== 'undefined') module.exports = DatasetLearner;
if (typeof window !== 'undefined') window.DatasetLearner = DatasetLearner;
