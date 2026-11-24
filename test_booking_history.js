const assert = require('node:assert/strict');
const H = require('./booking_history');
let stored = new Map();
global.localStorage = {getItem:k=>stored.get(k) || null,setItem:(k,v)=>stored.set(k,v)};
assert.equal(H.day('2026-11-23T18:00:00Z'),'2026-11-24');
const bookings = [
 {id:1,confirmedDay:'2026-11-24',confirmedAt:'2026-11-24T03:00:00Z',parsed:{travelDate:'30/11/2026',customerString:'Edited Guest',zaloMsg:'edited'},checkStatus:'found'},
 {id:2,confirmedDay:'2026-11-23',parsed:{travelDate:'24/11/2026'},checkStatus:'checking'}
];
H.save(bookings);
const reloaded = H.load();
assert.equal(reloaded[0].parsed.customerString,'Edited Guest');
assert.equal(reloaded[0].checkStatus,'found');
assert.equal(reloaded[1].checkStatus,'pending');
assert.deepEqual(H.forDay(reloaded,'2026-11-24').map(b=>b.id),[1]);
H.save(reloaded.filter(b=>b.confirmedDay!=='2026-11-24'));
assert.deepEqual(H.load().map(b=>b.id),[2]);
stored.set(H.key,'broken');
assert.throws(()=>H.load());
assert.equal(stored.get(H.key),'broken');
global.localStorage.setItem=()=>{throw new Error('QuotaExceeded');};
assert.throws(()=>H.save(bookings),/QuotaExceeded/);
console.log('PASS: reload, edited fields, daily filtering by confirmation date, Bangkok midnight, daily deletion, corruption and storage failure.');
