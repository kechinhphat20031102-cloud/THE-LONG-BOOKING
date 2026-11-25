const assert = require('assert');
const Core = require('./booking_history_firebase.js');
const mk = (id, day, msg, extra={}) => ({id, confirmedDay: day, confirmedAt: day+'T01:00:00Z', parsed: {zaloMsg: msg}, checkStatus: 'pending', ...extra});

// 1. Cuốc mới -> set; không đổi -> không ghi
const a = mk(1,'2026-11-25','A'), b = mk(2,'2026-11-25','B');
let known = new Map();
let d = Core.diff(known, [a,b], '2026-09-26');
assert.deepStrictEqual(d.sets.map(s=>s.id), ['1','2']); assert.strictEqual(d.deletes.length, 0);
d.sets.forEach(s => known.set(s.id, s.json));
assert.deepStrictEqual(Core.diff(known, [a,b], '2026-09-26'), {sets:[], deletes:[]});

// 2. Sửa 1 cuốc -> chỉ ghi cuốc đó; xoá 1 cuốc -> delete đúng cuốc đó
const b2 = {...b, checkStatus:'found'};
d = Core.diff(known, [a,b2], '2026-09-26');
assert.deepStrictEqual(d.sets.map(s=>s.id), ['2']);
d = Core.diff(known, [a], '2026-09-26');
assert.deepStrictEqual(d.deletes, ['2']);

// 3. "checking" chỉ tạm thời: không coi là thay đổi
assert.deepStrictEqual(Core.diff(known, [a, {...b, checkStatus:'checking'}], '2026-09-26'), {sets:[], deletes:[]});

// 4. Cuốc cũ hơn khoảng tải không bị xoá nhầm
const old = mk(3,'2026-01-01','OLD'); known.set('3', Core.serialize(old));
assert.ok(!Core.diff(known, [a,b], '2026-09-26').deletes.includes('3'));

// 5. Hai máy tạo cuốc cùng lúc -> id khác nhau, an toàn
const ids = new Set(); for (let i=0;i<2000;i++) ids.add(Core.newId(ids));
assert.strictEqual(ids.size, 2000); for (const id of ids) assert.ok(Number.isSafeInteger(id));

// 6. Gộp lịch sử cũ trong trình duyệt: bỏ trùng, id mới không đụng id đang có
const merged = Core.merge([a,b], [mk(1,'2026-11-25','A'), mk(2,'2026-11-24','C')]);
assert.strictEqual(merged.length, 3);
assert.strictEqual(new Set(merged.map(x=>x.id)).size, 3);

// 7. Ngày cắt
assert.strictEqual(Core.cutoffDay('2026-11-25', 60), '2026-09-26');
console.log('Tất cả 7 nhóm kiểm thử đều đạt');
