// Đo độ chính xác Form Zalo mới trên 100 mẫu DATA_SET_THE_LONG_TRAVEL_FORM_MOI.docx.
// node test_form_moi.js [--show]
// - "Chỉ parser": quy tắc cũ.  - "Parser + học mẫu": thêm dataset_learner.js.
// Đo công bằng: mỗi mẫu được phân tích khi KHÔNG có chính nó (và bản trùng) trong kho mẫu.
// Tập kiểm tra 30%: kho mẫu chỉ gồm 70% còn lại, các trường được chọn cách học chỉ dựa trên 70% đó.
const P = require('./parser'), L = require('./dataset_learner'), all = require('./dataset_examples');
const norm = s => String(s ?? '').normalize('NFC').toLowerCase().replace(/[–—-]/g, '-').replace(/\s+/g, '').replace(/\+/g, '');
const key = r => r.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
const groups = [...new Set(all.map(c => key(c.raw)))];
const isTest = c => groups.indexOf(key(c.raw)) % 10 >= 7;
const MAP = {'Đại lý':'agency','Mã booking':'code','Ngày đi':'travelDate','Lịch trình':'route','Loại xe':'vehicle','Số lượng khách':'pax','Thông tin khách':'customerInfo','Giờ đón':'pickupTime','Điểm đón':'pickupPoint','Điểm trả':'dropPoint','Giá dịch vụ':'price','Ghi chú':'note'};
function run(cases, pool, learn) {
  const per = Object.fromEntries(Object.keys(MAP).map(f => [f, 0])); let full = 0; const wrong = [];
  for (const c of cases) {
    let r = P.parse(c.raw);
    if (learn) r = L.apply(c.raw, r, pool.filter(o => key(o.raw) !== key(c.raw)));
    const bad = Object.entries(MAP).filter(([f, k]) => norm(r[k]) !== norm(c.fields[f]));
    for (const f in MAP) if (!bad.some(b => b[0] === f)) per[f]++;
    if (!bad.length) full++;
    for (const [f, k] of bad) wrong.push(`${all.indexOf(c) + 1} | ${f} | cần: ${JSON.stringify(c.fields[f])} | ra: ${JSON.stringify(r[k])}`);
  }
  return { per, full, n: cases.length, wrong };
}
const test = all.filter(isTest), dev = all.filter(c => !isTest(c));
const rows = [['100 mẫu (bỏ chính nó)', all, all], ['30 mẫu kiểm tra (kho = 70 mẫu)', test, dev]];
for (const [name, cases, pool] of rows) {
  const a = run(cases, pool, false), b = run(cases, pool, true);
  console.log(`\n${name}: khớp đủ 12 trường ${a.full} → ${b.full} / ${a.n}`);
  for (const f in MAP) console.log(`  ${f.padEnd(16)} ${String(a.per[f]).padStart(3)} → ${String(b.per[f]).padStart(3)}`);
  const ta = Object.values(a.per).reduce((x, y) => x + y), tb = Object.values(b.per).reduce((x, y) => x + y);
  console.log(`  Tổng ô đúng       ${ta} → ${tb} / ${a.n * 12} (${(100 * ta / a.n / 12).toFixed(1)}% → ${(100 * tb / a.n / 12).toFixed(1)}%)`);
  if (process.argv.includes('--show') && cases === all) console.log(b.wrong.join('\n'));
}
