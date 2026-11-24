const fs=require('node:fs');
const P=require('./parser');
const split=process.argv[2] || 'development';
const version=process.argv[3]==='v2'?'_v2':'';
const cases=require(`./dataset_expanded_1000${version}.json`).filter(c=>split==='all'||c.split===split);
function norm(value){return String(value??'').normalize('NFC').toLowerCase().replace(/\s+/g,'').replace(/\+/g,'');}
const results=cases.map(c=>{const result=P.parse(c.raw);const errors=Object.entries(c.expected).filter(([k,v])=>norm(v)!==norm(result[k])).map(([field,expected])=>({field,expected,actual:result[field]}));return {id:c.id,sourceId:c.sourceId,passed:errors.length===0,errors};});
const passed=results.filter(r=>r.passed).length;
const report={split,total:results.length,passed,fieldChecks:results.length*7,fieldFailures:results.reduce((n,r)=>n+r.errors.length,0),results};
fs.writeFileSync(`expanded_report${version}_${split}.json`,JSON.stringify(report,null,2));
console.log(`${split}: ${passed}/${results.length} exact cases`);
for(const r of results.filter(r=>!r.passed).slice(0,12))console.log(r.id,JSON.stringify(r.errors));
if(passed!==results.length)process.exitCode=1;
