const assert=require('node:assert/strict');
const H=require('./booking_history');
global.location={protocol:'http:'};
const item={id:1,confirmedDay:'2026-11-24',parsed:{zaloMsg:'A'}};
let revision=0, saved=[];
global.fetch=async (url,opts)=>{
 if(!opts?.method)return {ok:true,json:async()=>({revision,bookings:saved})};
 const body=JSON.parse(opts.body);
 assert.equal(body.revision,revision);
 saved=body.bookings;revision++;
 return {ok:true,json:async()=>({revision})};
};
(async()=>{
 await H.initialize();
 await Promise.all([H.save([item]),H.save([{...item,parsed:{zaloMsg:'B'}}])]);
 assert.equal(revision,2);assert.equal(saved[0].parsed.zaloMsg,'B');
 const merged=H.merge(saved,[item]);assert.equal(merged.length,2);assert.equal(merged[1].id,2);
 assert.equal(H.merge(merged,[item]).length,2);
 await H.initialize();assert.equal(H.load()[0].parsed.zaloMsg,'B');
 global.fetch=async()=>({ok:false,json:async()=>({error:'Conflict'})});
 await assert.rejects(H.save([]),/Conflict/);
 await assert.rejects(H.save([item]),/Conflict/);
 console.log('PASS: API load, queued revisions, import collision/deduplication, reload, conflict stops writes.');
})().catch(e=>{console.error(e);process.exitCode=1;});
