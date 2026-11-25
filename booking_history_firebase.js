/*
 * Đồng bộ "Booking đã xác nhận Zalo" giữa mọi máy qua Firebase Firestore.
 *
 * Nạp SAU booking_history.js và firebase_config.js. Nếu firebase_config.js chưa
 * điền cấu hình thì file này không làm gì cả: app chạy y như cũ (SQLite / trình duyệt).
 *
 * Mỗi cuốc là 1 document trong collection "bookings" (id document = id cuốc),
 * nên 2 máy lưu cùng lúc không ghi đè lên nhau.
 */
(function () {
  const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const COLLECTION = 'bookings';
  const KEEP_DAYS = 60;                       // chỉ tải các cuốc trong 60 ngày gần nhất
  const MIGRATED_KEY = 'thelong_firebase_migrated_v1';

  // ---------- Phần logic thuần (test được bằng Node) ----------
  const Core = {
    serialize(b) {
      const { checkStatus, ...rest } = b;
      // "checking" chỉ là trạng thái tạm thời trên 1 máy, không đẩy lên mây
      return JSON.stringify({ ...rest, checkStatus: checkStatus === 'checking' ? 'pending' : checkStatus });
    },
    /** So sánh danh sách hiện tại với bản đã biết trên mây -> các thao tác cần ghi. */
    diff(known, bookings, cutoffDay) {
      const sets = [], deletes = [];
      const ids = new Set();
      for (const b of bookings) {
        ids.add(String(b.id));
        const s = Core.serialize(b);
        if (known.get(String(b.id)) !== s) sets.push({ id: String(b.id), booking: b, json: s });
      }
      for (const [id, json] of known) {
        if (ids.has(id)) continue;
        // Cuốc cũ hơn khoảng đang tải không nằm trong danh sách: không xoá nhầm
        if (cutoffDay && JSON.parse(json).confirmedDay < cutoffDay) continue;
        deletes.push(id);
      }
      return { sets, deletes };
    },
    /** id số nguyên duy nhất giữa các máy (thời gian ms * 1000 + ngẫu nhiên). */
    newId(taken) {
      let id;
      do id = Date.now() * 1000 + Math.floor(Math.random() * 1000);
      while (taken && taken.has(id));
      return id;
    },
    signature(b) { return JSON.stringify([b.confirmedDay, b.confirmedAt || '', b.parsed && b.parsed.zaloMsg]); },
    /** Gộp danh sách nhập vào, bỏ cuốc trùng, cấp id mới không đụng máy khác. */
    merge(current, incoming, validate) {
      if (validate) validate(incoming);
      const result = [...current];
      const seen = new Set(result.map(Core.signature));
      const taken = new Set(result.map(b => b.id));
      for (const booking of incoming) {
        const sig = Core.signature(booking);
        if (seen.has(sig)) continue;
        seen.add(sig);
        const id = Core.newId(taken); taken.add(id);
        result.push({ ...booking, id });
      }
      return result;
    },
    cutoffDay(today, days) {
      const d = new Date(today + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - days);
      return d.toISOString().slice(0, 10);
    }
  };

  if (typeof module !== 'undefined') module.exports = Core;
  if (typeof window === 'undefined') return;

  const config = window.FIREBASE_CONFIG;
  const BH = window.BookingHistory;
  if (!BH || !config || !config.apiKey || /DIEN_/.test(config.apiKey)) return; // chưa cấu hình -> giữ cách cũ

  let fs = null, db = null, auth = null;
  let known = new Map();          // id -> json đã có trên mây
  let cache = [];
  let listeners = [];
  let cutoff = '';

  function applySnapshot(snap) {
    const next = new Map();
    const list = [];
    snap.forEach(doc => {
      const json = doc.data().json;
      try { const b = JSON.parse(json); next.set(doc.id, json); list.push(b); } catch (_) {}
    });
    // giữ các cuốc cũ hơn khoảng tải (nếu có) trong bộ nhớ "known"
    for (const [id, json] of known) if (!next.has(id) && JSON.parse(json).confirmedDay < cutoff) next.set(id, json);
    known = next;
    list.sort((a, b) => (a.confirmedAt || '').localeCompare(b.confirmedAt || '') || a.id - b.id);
    cache = list;
  }

  async function writeChanges(bookings) {
    const { sets, deletes } = Core.diff(known, bookings, cutoff);
    if (!sets.length && !deletes.length) return;
    // Firestore giới hạn 500 thao tác / batch
    const ops = [...sets.map(s => ['set', s]), ...deletes.map(d => ['del', d])];
    for (let i = 0; i < ops.length; i += 450) {
      const batch = fs.writeBatch(db);
      for (const [kind, x] of ops.slice(i, i + 450)) {
        if (kind === 'set') {
          batch.set(fs.doc(db, COLLECTION, x.id), { json: x.json, confirmedDay: x.booking.confirmedDay, updatedAt: fs.serverTimestamp() });
          known.set(x.id, x.json);
        } else {
          batch.delete(fs.doc(db, COLLECTION, x));
          known.delete(x);
        }
      }
      await batch.commit();
    }
  }

  async function migrateBrowserHistory() {
    if (localStorage.getItem(MIGRATED_KEY) === 'true') return;
    let local = [];
    try { const raw = localStorage.getItem(BH.key); if (raw) local = JSON.parse(raw); } catch (_) {}
    if (Array.isArray(local) && local.length) {
      const merged = Core.merge(cache, local.filter(b => b && b.parsed && b.confirmedDay));
      if (merged.length !== cache.length) { await writeChanges(merged); cache = merged; }
    }
    // Giữ nguyên bản trong trình duyệt làm bản dự phòng, chỉ đánh dấu đã chuyển
    localStorage.setItem(MIGRATED_KEY, 'true');
  }

  // ---------- Đồng bộ "Mẫu đã lưu để học" (BookingMemory) giữa các máy ----------
  // BookingMemory vẫn đọc/ghi localStorage như cũ; lớp này chỉ giữ localStorage khớp với Firestore.
  const EX_COLLECTION = 'examples';
  const EX_MIGRATED_KEY = 'thelong_firebase_examples_migrated_v1';
  async function syncExamples() {
    const BM = window.BookingMemory;
    if (!BM || BM._firebaseWrapped) return;
    BM._firebaseWrapped = true;
    const exRef = id => fs.doc(db, EX_COLLECTION, String(id));
    const writeEntry = e => fs.setDoc(exRef(e.id), { json: JSON.stringify(e), updatedAt: fs.serverTimestamp() });
    const readLocal = () => { try { return BM.list(); } catch (_) { return []; } };

    const origSave = BM.save.bind(BM), origRemove = BM.remove.bind(BM);
    BM.save = function (raw, form) {
      const entry = origSave(raw, form);
      writeEntry(entry).catch(err => console.error('Không lưu được mẫu lên Firebase:', err));
      return entry;
    };
    BM.remove = function (id) {
      origRemove(id);
      fs.deleteDoc(exRef(id)).catch(err => console.error('Không xoá được mẫu trên Firebase:', err));
    };

    let firstExamples = true;
    await new Promise(resolve => {
      fs.onSnapshot(fs.collection(db, EX_COLLECTION), async snap => {
        const cloud = [];
        snap.forEach(doc => { try { cloud.push(JSON.parse(doc.data().json)); } catch (_) {} });
        if (firstExamples) {
          firstExamples = false;
          // Lần đầu trên máy này: đẩy các mẫu cũ chỉ có trong trình duyệt lên mây
          if (localStorage.getItem(EX_MIGRATED_KEY) !== 'true') {
            const ids = new Set(cloud.map(e => e.id));
            for (const e of readLocal()) if (e && e.id && !ids.has(e.id)) { cloud.push(e); try { await writeEntry(e); } catch (_) {} }
            localStorage.setItem(EX_MIGRATED_KEY, 'true');
          }
          resolve();
        }
        cloud.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
        localStorage.setItem(BM.key, JSON.stringify(cloud.slice(0, 100)));
        window.dispatchEvent(new CustomEvent('bookingmemory-updated'));
      }, err => { console.error('Firebase mẫu:', err); if (firstExamples) { firstExamples = false; resolve(); } });
    });
  }

  Object.assign(BH, {
    remote: true,
    storageLabel: 'Đã lưu lên Firebase (mọi máy dùng chung)',
    async initialize() {
      const [appMod, authMod, fsMod] = await Promise.all([
        import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')
      ]);
      fs = fsMod;
      const app = appMod.initializeApp(config);
      auth = authMod.getAuth(app);
      // Cache offline: mất mạng vẫn xem/ghi được, có mạng lại tự đẩy lên
      try { db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) }); }
      catch (_) { db = fs.getFirestore(app); }

      await authMod.setPersistence(auth, authMod.browserLocalPersistence);
      const user = await new Promise(r => { const off = authMod.onAuthStateChanged(auth, u => { off(); r(u); }); });
      // Không cần tài khoản: mỗi trình duyệt tự đăng nhập ẩn danh, nhân viên chỉ chọn tên ở góc trên
      if (!user) await authMod.signInAnonymously(auth);

      cutoff = Core.cutoffDay(BH.day(), KEEP_DAYS);
      const q = fs.query(fs.collection(db, COLLECTION), fs.where('confirmedDay', '>=', cutoff));
      await new Promise((resolve, reject) => {
        let first = true;
        fs.onSnapshot(q, snap => {
          applySnapshot(snap);
          if (first) { first = false; resolve(); return; }
          if (!snap.metadata.hasPendingWrites) listeners.forEach(fn => fn(BH.load()));
        }, err => {
          if (first) { first = false; reject(new Error('Không kết nối được Firebase: ' + err.message)); }
          else BH.failure = err;
        });
      });
      await migrateBrowserHistory();
      try { await syncExamples(); } catch (err) { console.error('Không đồng bộ được mẫu:', err); }
    },
    load() { return cache.map(b => ({ ...b, checkStatus: b.checkStatus === 'checking' ? 'pending' : b.checkStatus })); },
    save(bookings) {
      const op = this.queue.then(() => writeChanges(bookings));
      this.queue = op.catch(() => {});
      return op;
    },
    merge(current, incoming) { return Core.merge(current, incoming, BH.validate.bind(BH)); },
    newId() { return Core.newId(new Set(cache.map(b => b.id))); },
    poll() { return null; },
    startAutoSync(callback) { if (typeof callback === 'function') listeners.push(callback); }
  });
})();
