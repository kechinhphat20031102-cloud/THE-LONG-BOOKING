const assert = require('node:assert/strict');
const fs = require('node:fs');
const Parser = require('./parser');
const cases = [];
const names = ['Alice Smith','Nguyễn Văn An','Élodie Martin','hello and smile'];
for (const [i,name] of names.entries()) {
  for (const separator of ['\n','\r\n']) {
    const date = `${24+i}/11/2026`, pax = i+1, phone = '+33623312858';
    const common = {customerString:`${name} ${phone}`,pax,travelDate:date};
    const add = (kind, lines, expected) => cases.push({name:`${kind} / ${name} / ${separator.length}`,raw:lines.join(separator),expected:{...common,...expected}});
    add('Vietnamese labels', [`Ngày: ${date}`,`Tên: ${name}`,`Số điện thoại: +33 6 23 31 28 58`,`Số người: ${pax}`,'Thời gian đón: 07:00 - 07:20','Địa điểm đón: Pu Luong Roots Homestay','Địa điểm trả: The Long Travel'], {pickupPoint:'Pu Luong Roots Homestay',dropPoint:'The Long Travel',pickupTime:'07:00 - 07:20',route:'PL - NB'});
    add('Voucher table', ['Halong happy travel','The Long Travel',date,'11:00',`${pax} × Adult`,'Các hành khách','Tên Fare Quốc tịch Ticket / seat',name,`Số điện thoại: ${phone}`],{pickupPoint:'Halong happy travel',dropPoint:'The Long Travel',route:'HL - NB',pickupTime:'11:00 - 11:30'});
    add('Vexere', ['Ninh Bình - Cát Bà','09:30',date,'Mã vé: TEST12','Đón: 09:30 - The Long Hotel','Trả: 14:00 - 243 Núi Ngọc',`Tên: ${name} ${pax}pax`,`SĐT: ${phone}`], {pickupPoint:'The Long Hotel',dropPoint:'243 Núi Ngọc',route:'NB - CB',pickupTime:'8:35 - 9:35'});
    add('English labels', [`Date: ${date}`,`Name: ${name}`,`Phone: ${phone}`,`Passengers: ${pax}`,'Pickup time: 07:00','Pickup: Pu Luong Roots Homestay','Drop-off: The Long Travel'],{pickupPoint:'Pu Luong Roots Homestay',dropPoint:'The Long Travel',route:'PL - NB',pickupTime:'07:00'});
    add('Reverse Cat Ba voucher', ['Cat Ba Buffalo Hostel','The Long Travel',date,'08:15',`${pax} × Adult`,'Các hành khách',name,`Số điện thoại: ${phone}`], {pickupPoint:'Cat Ba Buffalo Hostel',dropPoint:'The Long Travel',route:'CB - NB',pickupTime:'8:00 - 8:15'});
    const original = Parser.parse([`Ngày: ${date}`,`Tên: ${name}`,`Số điện thoại: ${phone}`,`Số người: ${pax}`,'Giờ đón: 07:00','Địa điểm đón: Pu Luong Roots Homestay','Địa điểm trả: The Long Travel'].join(separator));
    cases.push({name:`Confirmation round trip / ${name} / ${separator.length}`,raw:original.zaloMsg,expected:{...common,route:'PL - NB',pickupPoint:'Pu Luong Roots Homestay',pickupTime:'07:00'}});
  }
}
for (const name of names) {
  cases.push({name:`Single line / ${name}`,raw:`Ninh Bình - Cát Bà 09:30 25/11/2026 Đón: The Long Hotel Trả: 243 Núi Ngọc Tên: ${name} 3pax SĐT: +33623312858`,expected:{customerString:`${name} +33623312858`,pax:3,travelDate:'25/11/2026',pickupPoint:'The Long Hotel',dropPoint:'243 Núi Ngọc',pickupTime:'8:35 - 9:35'}});
  cases.push({name:`Short agent / ${name}`,raw:`EM GỬI 1 PAX CB - NB CHUYẾN 8:15AM NGÀY 24/11/2026\nTÊN: ${name}\nCODE: 4452\nĐÓN: CATBA BUFFALO HOSTEL`,expected:{customerString:name,pax:1,route:'CB - NB',pickupPoint:'CATBA BUFFALO HOSTEL',pickupTime:'8:00 - 8:15',originalCode:'4452'}});
}
// Learning uses isolated storage: no synthetic customer records touch the real app.
const Memory = require('./booking_memory');
const entries = new Map();
global.localStorage = {getItem:k=>entries.get(k) || null,setItem:(k,v)=>entries.set(k,v)};
const sample = 'Khách chính: Old Guest\nNơi lên: Pu Luong Roots Homestay\nNơi xuống: The Long Travel\nNgày chạy: 24/11/2026\nTổng người: 2\nHẹn khách: 07:00';
const corrected = Parser.parse('Tên: Old Guest\nĐón: Pu Luong Roots Homestay\nTrả: The Long Travel\nNgày: 24/11/2026\nSố người: 2\nGiờ đón: 07:00');
Memory.save(sample,corrected.zaloMsg);
for (const name of names) {
  for (const location of ['Pu Luong Roots Homestay','OH Pu Luong Homestay']) {
    cases.push({name:`Learned template / ${name} / ${location}`,learn:true,raw:sample.replace('Old Guest',name).replace('24/11/2026','26/11/2026').replace('Tổng người: 2','Tổng người: 6').replace('Pu Luong Roots Homestay',location),expected:{customerString:name,pax:6,travelDate:'26/11/2026',pickupPoint:location,dropPoint:'The Long Travel',pickupTime:'07:00',code:'tl261126'}});
  }
}
const results = cases.map(test => {
  const parsed = Parser.parse(test.raw);
  const actual = test.learn ? Memory.learn(test.raw, parsed) : parsed;
  const errors = Object.entries(test.expected).filter(([k,v])=>actual[k]!==v).map(([k,v])=>({field:k,expected:v,actual:actual[k]}));
  return {name:test.name,passed:!errors.length,errors};
});
fs.writeFileSync('booking_test_report.json',JSON.stringify({total:results.length,passed:results.filter(r=>r.passed).length,results},null,2));
for (const r of results.filter(r=>!r.passed)) console.log(r.name, JSON.stringify(r.errors));
console.log(`${results.filter(r=>r.passed).length}/${results.length} cases passed`);
assert.ok(results.every(r=>r.passed),'See booking_test_report.json');
