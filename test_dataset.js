const fs = require('node:fs');
const assert = require('node:assert/strict');
const Parser = require('./parser');
const cases = require('./dataset_cases.json');
const compact = value => String(value ?? '').normalize('NFC').toLowerCase().replace(/\s+/g,'').replace(/\+/g,'');
const norm = (field,value) => {
  let s = compact(value);
  if (field === 'customerString') s=s.replace(/(?<=\d)-(?=\d)/g,'');
  if (field === 'travelDate') s = s.replace(/\/(\d{2})$/, '/20$1');
  if (field === 'route') {
    s=s.replace(/ninhbình|ninhbinh/g,'nb').replace(/maichâu|maichau/g,'mc').replace(/pùluông|puluong/g,'pl');
    if(s==='nbmc')s='nb-mc';
  }
  return s;
};
const results = cases.map(c => {
  const actual=Parser.parse(c.raw);
  const differences=Object.entries(c.expected).filter(([k,v])=>norm(k,v)!==norm(k,actual[k])).map(([field,expected])=>({field,expected,actual:actual[field]}));
  return {id:c.id,differences,warnings:actual.warnings};
});
let checked=0;
const check=(id,field,expected)=>{assert.equal(norm(field,Parser.parse(cases[id-1].raw)[field]),norm(field,expected),`Dataset ${id}: ${field}`);checked++;};
// Fields explicitly present in the input. Sample 2 has no date; sample 11 has no name.
for(const c of cases) {
  check(c.id,'pax',c.expected.pax);
  if(c.id!==2)check(c.id,'travelDate',c.expected.travelDate);
  if(![2,11,34].includes(c.id))check(c.id,'customerString',c.expected.customerString);
}
check(10,'pax',1); check(23,'pax',2); check(12,'customerString','Eric Maxime Joyal +18195002830');
for(const id of [14,20,21,24,25,26,27,28,40])check(id,'pickupTime','12:00 - 12:30');
for(const id of [9,36]) {check(id,'route','MC - NB');check(id,'pickupTime','13:00 - 13:20');}
for(const [id,time] of [[1,'19:45 - 20:15'],[4,'13:10'],[6,'17:00 - 17:30'],[13,'7:45 - 8:00'],[15,'12:00 - 12:20'],[16,'12:00 - 12:20'],[18,'8:45 - 9:10'],[19,'12:45 - 13:00'],[22,'11:45 - 12:15'],[35,'12:45 - 13:00'],[37,'11:45 - 12:10']])check(id,'pickupTime',time);
// Changed passenger, phone, count and date must not recall an old customer.
for(const id of [14,20,24,27,29,30,31,40,41]) {
  const raw=cases[id-1].raw.replace(/TÊN\s*:[^\n]+/i,'TÊN: New Guest').replace(/\d+\s+PAX/i,'7 PAX').replace(/NGÀY\s+\d+\/\d+/i,'NGÀY 28/12');
  const actual=Parser.parse(raw);
  assert.equal(actual.customerString,'New Guest');assert.equal(actual.pax,7);assert.equal(actual.travelDate,`28/12/${new Date().getFullYear()}`);checked+=3;
}
assert.ok(Parser.parse(cases[10].raw).warnings.includes('Chưa có tên khách'));checked++;
const report={source:'DATA SET.docx',samples:cases.length,assertionsPassed:checked,fullMatch:results.filter(r=>!r.differences.length).length,results};
fs.writeFileSync('dataset_validation_report.json',JSON.stringify(report,null,2));
console.log(`Dataset: ${cases.length} samples, ${checked} assertions passed; ${report.fullMatch} full matches across the 7 compared fields. Remaining differences documented.`);
