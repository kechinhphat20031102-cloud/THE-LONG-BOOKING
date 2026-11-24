const BookingHistory = {
  key: 'thelong_confirmed_bookings_v1',
  remote: false, revision: 0, cache: null, queue: Promise.resolve(), failure: null, lastSaved: '',
  async initialize() {
    this.remote = typeof location !== 'undefined' && /^https?:$/.test(location.protocol);
    if (!this.remote) return;
    try {
      const response = await fetch('/api/history', {cache:'no-store'});
      if (!response.ok) {
        // Khi chạy trên Vercel / GitHub Pages (không có backend SQLite cục bộ), tự động chuyển sang localStorage
        this.remote = false;
        return;
      }
      const data = await response.json();
      this.cache = this.validate(data.bookings);
      this.revision = data.revision;
      this.lastSaved = JSON.stringify(this.cache);
    } catch (e) {
      // Fallback về localStorage nếu fetch /api/history gặp lỗi mạng
      this.remote = false;
    }
  },
  validate(value) {
    if (!Array.isArray(value) || value.some(b=>!Number.isSafeInteger(b.id) || !b.parsed || !/^\d{4}-\d{2}-\d{2}$/.test(b.confirmedDay))) throw new Error('Lịch sử không hợp lệ.');
    return value;
  },
  day(value = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
    const get = type => parts.find(p=>p.type===type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  },
  load() {
    if (this.remote) return this.cache.map(b=>({...b,checkStatus:b.checkStatus === 'checking' ? 'pending' : b.checkStatus}));
    const raw = localStorage.getItem(this.key);
    if (!raw) return [];
    const value = JSON.parse(raw);
    if (!Array.isArray(value) || value.some(b=>!Number.isSafeInteger(b.id) || !b.parsed || !/^\d{4}-\d{2}-\d{2}$/.test(b.confirmedDay))) throw new Error('Dữ liệu lịch sử không hợp lệ; chưa ghi đè dữ liệu cũ.');
    return value.map(b=>({...b,checkStatus:b.checkStatus === 'checking' ? 'pending' : b.checkStatus}));
  },
  save(bookings) {
    const payload = JSON.stringify(bookings);
    if (!this.remote) { localStorage.setItem(this.key, payload); return; }
    const operation = this.queue.then(async () => {
      if (this.failure) throw this.failure;
      if (payload === this.lastSaved) return;
      const response = await fetch('/api/history', {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:this.revision,bookings:JSON.parse(payload)})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không lưu được SQLite');
      this.revision = data.revision; this.lastSaved = payload; this.cache = JSON.parse(payload);
    });
    this.queue = operation.catch(error => { this.failure = error; });
    return operation;
  },
  merge(current, incoming) {
    this.validate(incoming);
    const result = [...current];
    const signature = b => JSON.stringify([b.confirmedDay,b.confirmedAt || '',b.parsed.zaloMsg]);
    const seen = new Set(result.map(signature));
    let id = Math.max(0,...result.map(b=>b.id)) + 1;
    for (const booking of incoming) if (!seen.has(signature(booking))) {
      seen.add(signature(booking)); result.push({...booking,id:id++});
    }
    return result;
  },
  forDay(bookings, day) { return bookings.filter(b=>b.confirmedDay === day); },
  async poll() {
    if (!this.remote) return null;
    try {
      const response = await fetch('/api/history', {cache:'no-store'});
      if (!response.ok) return null;
      const data = await response.json();
      if (data.revision !== this.revision) {
        this.cache = this.validate(data.bookings);
        this.revision = data.revision;
        this.lastSaved = JSON.stringify(this.cache);
        return this.load();
      }
    } catch (_) {}
    return null;
  },
  startAutoSync(callback, intervalMs = 4000) {
    if (typeof window === 'undefined') return;
    const tick = async () => {
      const updated = await this.poll();
      if (updated && typeof callback === 'function') {
        callback(updated);
      }
    };
    setInterval(tick, intervalMs);
    window.addEventListener('focus', tick);
  }
};
if (typeof module !== 'undefined') module.exports = BookingHistory;
if (typeof window !== 'undefined') window.BookingHistory = BookingHistory;
