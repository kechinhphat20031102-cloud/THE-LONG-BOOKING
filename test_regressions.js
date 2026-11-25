const assert = require('node:assert/strict');
const Parser = require('./parser');
const Gemini = require('./gemini_service');
const storage = new Map();
global.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) };

async function main() {
  const inline = Parser.parse('Ninh Bình - Cát Bà 09:30 18/11/2026 Mã vé: R563ZK Đón: 09:30 - The Long Hotel Trả: 14:00 - 243 Núi Ngọc Tên: Tasmin Walton 3pax SĐT: 447825575049');
  assert.equal(inline.pickupPoint, 'The Long Hotel');
  assert.equal(inline.dropPoint, '243 Núi Ngọc');
  assert.equal(inline.customerString, 'Tasmin Walton +447825575049');
  const passengers = Parser.parse('#AAVH6204\n19 thg 11 2026 Express 16 08:00am\nđón Tam Coc Sunshine Hostel trả Little Mai Chau Homestay\nCác hành khách 1 × Adult Yoav Zamir +972584760413');
  assert.equal(passengers.customerString, 'Yoav Zamir +972584760413');
  assert.equal(passengers.pickupPoint, 'Tam Coc Sunshine Hostel');
  assert.equal(Parser.parse('Mai Chau Homestay').travelDate, '');
  assert.equal(Parser.parse('Tên: Alice\nSĐT: +441612345678').vehicle, 'Bus');
  assert.equal(Parser.parse('NB - CB 9h30\nĐón: The Long Hotel').pickupTime, '8:35 - 9:35');
  assert.equal(Parser.parse('Tên: Alice').pickupPoint, '');
  const sylvieText = `Xe limousine khởi hành
Ngày: 24 tháng 11
Thời gian đón: +-7 giờ sáng
Tên: Sylvie
Số điện thoại:+33 7 70 49 34 06
Số người: 2
Địa điểm đón: Pu Luong Roots Homestay
Địa điểm trả: The Green House Homestay Ta Coc`;
  const sylvie = Parser.parse(sylvieText);
  assert.equal(sylvie.pickupPoint,'Pu Luong Roots Homestay');
  assert.equal(sylvie.dropPoint,'The Green House Homestay Ta Coc');
  assert.equal(sylvie.pickupTime,'+-7 giờ sáng');
  assert.equal(sylvie.pax,2);
  assert.equal(sylvie.customerString,'Sylvie +33770493406');
  assert.equal(sylvie.travelDate,`24/11/${new Date().getFullYear()}`);
  assert.equal(sylvie.route,'PL - NB');
  assert.equal(sylvie.excel4Cols,'Pu Luong Roots Homestay\tThe Green House Homestay Ta Coc\tSylvie +33770493406\t2\tPù Luông Roots');
  for (const label of ['Giờ đón','Thời gian đón']) {
    const withTime = Parser.parse(`${label}: 07:00 - 07:30\nĐịa điểm đón: Pu Luong Roots Homestay\nĐịa điểm trả: The Long Travel`);
    assert.equal(withTime.pickupPoint,'Pu Luong Roots Homestay');
    assert.equal(withTime.pickupTime,'07:00 - 07:30');
    const noPickup = Parser.parse(`${label}: 7 giờ sáng\nĐịa điểm trả: The Long Travel`);
    assert.equal(noPickup.pickupPoint,'');
  }
  Gemini.setApiKey('test-key');
  Gemini.setModel('gemini-2.5-flash');
  assert.equal(Gemini.getModel(), 'gemini-2.5-flash');
  Gemini.setModel('auto');
  let mode = 'success';
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({url, options});
    assert.ok(!url.includes('test-key'));
    assert.equal(options.headers['x-goog-api-key'], 'test-key');
    if (options.method === 'GET') return {ok:true,json:async()=>({models:[{name:'models/gemini-test-flash',supportedGenerationMethods:['generateContent']}]})};
    if (mode === 'error') return {ok:false,status:429,json:async()=>({error:{message:'Quota exceeded'}})};
    const text = mode === 'invalid' ? '[]' : JSON.stringify({route:'AI route',travelDate:'25/11/2026',pax:2,customerString:'AI customer'});
    return {ok:true,json:async()=>({candidates:[{finishReason:mode === 'truncated'?'MAX_TOKENS':'STOP',content:{parts:[{text}]}}]})};
  };
  assert.equal((await Gemini.testConnection()).model, 'gemini-test-flash');
  const result = await Gemini.parseBooking('sample', 'Mon');
  assert.equal(result.route, 'AI route');
  assert.equal(result.code, 'tl251126');
  assert.equal(result.pickupPoint, '');
  assert.equal(result.model, 'gemini-test-flash');
  assert.equal(result.isAiGenerated, true);
  assert.ok(result.zaloMsg.includes('AI customer'));
  assert.ok(JSON.parse(calls.at(-1).options.body).systemInstruction.parts[0].text.includes('Ngày hiện tại'));
  mode = 'error';
  await assert.rejects(Gemini.testConnection(), /429/);
  await assert.rejects(Gemini.parseBooking('sample'), /429/);
  mode = 'invalid';
  await assert.rejects(Gemini.parseBooking('sample'), /không hợp lệ/);
  mode = 'truncated';
  await assert.rejects(Gemini.parseBooking('sample'), /MAX_TOKENS/);
  assert.equal((await Gemini.resolveModel('test-key','unavailable')).model, 'gemini-test-flash');
  const originalRequest = Gemini.request;
  const attempted = [];
  let failStatus = 404;
  Gemini.request = async (path) => {
    if (path.startsWith('models?')) return {models:['gemini-old-flash','gemini-new-flash'].map(m=>({name:'models/'+m,supportedGenerationMethods:['generateContent']}))};
    attempted.push(path);
    if (path.includes('old')) throw Object.assign(new Error('unavailable'),{status:failStatus});
    return {candidates:[{finishReason:'STOP',content:{parts:[{text:'{"status":"OK"}'}]}}]};
  };
  assert.equal((await Gemini.testConnection('test-key','auto')).model,'gemini-new-flash');
  assert.equal(attempted.length,2);
  attempted.length = 0;
  failStatus = 503;
  assert.equal((await Gemini.testConnection('test-key','auto')).model,'gemini-new-flash');
  assert.equal(attempted.length,1);
  assert.ok(attempted[0].includes('gemini-new-flash'));
  Gemini.workingModels.clear();
  failStatus = 403;
  await assert.rejects(Gemini.testConnection('test-key','auto'),/unavailable/);
  failStatus = 404;
  assert.equal((await Gemini.testConnection('test-key','gemini-old-flash')).model,'gemini-new-flash');
  // Reproduce the reported sequence: test succeeds, save pins the model,
  // then booking receives 503. It must retry and use another real AI model.
  Gemini.waitRetry = async () => {};
  Gemini.setModel('gemini-old-flash');
  const bookingResponse = {candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({route:'PL - NB',customerString:'Sylvie',pax:2})}]}}]};
  let generating = false;
  const sequence = [];
  Gemini.request = async path => {
    if (path.startsWith('models?')) return {models:['gemini-old-flash','gemini-new-flash'].map(m=>({name:'models/'+m,supportedGenerationMethods:['generateContent']}))};
    sequence.push(path);
    if (generating && path.includes('old')) throw Object.assign(new Error('HTTP 503'),{status:503});
    return bookingResponse;
  };
  const tested = await Gemini.testConnection('test-key', Gemini.getModel());
  Gemini.setModel(tested.model); // actual modal Save behavior
  generating = true;
  sequence.length = 0;
  const recovered = await Gemini.parseBooking('Sylvie 2 khách');
  assert.equal(recovered.model,'gemini-new-flash');
  assert.equal(recovered.customerString,'Sylvie');
  assert.equal(sequence.length,3); // preferred twice, fallback once
  let failedCalls = 0;
  Gemini.request = async path => {
    if (path.startsWith('models?')) return {models:[{name:'models/gemini-old-flash',supportedGenerationMethods:['generateContent']}]};
    failedCalls++;
    throw Object.assign(new Error('HTTP 503'),{status:503});
  };
  await assert.rejects(Gemini.parseBooking('sample'), /đã thử 1 model/);
  assert.equal(failedCalls,2);
  Gemini.request = originalRequest;
  const Memory = require('./booking_memory');
  const learned = Memory.save(sylvieText, sylvie.zaloMsg);
  assert.equal(learned.data.pickupPoint, 'Pu Luong Roots Homestay');
  Memory.save(sylvieText, sylvie.zaloMsg.replace('+-7 giờ sáng', '07:00'));
  assert.equal(Memory.list().length, 1);
  assert.equal(Memory.examples(sylvieText)[0].output.pickupTime,'07:00');
  assert.throws(() => Memory.save('other', 'bad form'), /Cần điền/);
  assert.ok(Memory.prompt(sylvieText).includes('Pu Luong Roots Homestay'));
  global.BookingMemory = Memory;
  mode = 'success';
  Gemini.setModel('auto');
  await Gemini.parseBooking(sylvieText);
  assert.ok(JSON.parse(calls.at(-1).options.body).systemInstruction.parts[0].text.includes('MẪU ĐÃ ĐƯỢC NGƯỜI DÙNG KIỂM TRA'));
  assert.equal(Memory.recall(sylvieText, 'Mon').pickupTime,'07:00');
  assert.equal(Memory.recall(sylvieText.replaceAll('\n','\r\n')).pax,2);
  assert.equal(Memory.recall(Memory.list()[0].form).pickupTime,'07:00');
  assert.equal(Memory.recall(sylvieText.replace('Sylvie','Alice')),null);
  assert.ok(Memory.recall(sylvieText,'Mon').zaloMsg.includes('Nhân viên xác nhận: Mon'));
  Memory.remove(learned.id);
  assert.equal(Memory.list().length,0);
  assert.equal(Memory.prompt(sylvieText),'');
  delete global.BookingMemory;
  // Exercise the actual UI handler: failure must not invoke regex or copy a form.
  const fs = require('node:fs');
  const vm = require('node:vm');
  const source = fs.readFileSync(require.resolve('./app'), 'utf8');
  const handler = source.slice(source.indexOf('  async function handleCreateZaloForm()'), source.indexOf('  function renderExamples()'));
  let localCalls = 0;
  let copies = 0;
  const badge = {classList:{remove(){}}};
  const context = {
    btnCreateZalo:{disabled:false}, rawInput:{value:'sample'}, operatorSelect:{value:'Mon'},
    outputZalo:{value:'old form'}, outputExcel:{value:'old data'}, currentParsedResult:{old:true},
    BookingMemory:Memory, BookingHistory:require('./booking_history'),
    isGeminiEnabled:()=>true,
    GeminiService:{isConfigured:()=>true,parseBooking:async()=>{throw new Error('HTTP 429');}},
    BookingParser:{parse:()=>{localCalls++; return inline;}},
    document:{getElementById:id=>id === 'badgeZaloSource' ? badge : {textContent:'Create'}},showToast(){},copyText(){copies++;},
    confirmedBookings:[],nextBookingId:1,renderConfirmedList(){},setCheckResult(){},syncDateFromZaloForm(){}
  };
  vm.createContext(context);
  vm.runInContext(handler,context);
  await context.handleCreateZaloForm();
  assert.equal(localCalls,0);
  assert.equal(copies,0);
  assert.equal(context.outputZalo.value,'');
  assert.equal(context.currentParsedResult,null);
  assert.match(badge.textContent,/HTTP 429/);
  assert.equal(context.btnCreateZalo.disabled,false);
  context.isGeminiEnabled=()=>false;
  await context.handleCreateZaloForm();
  assert.equal(localCalls,1);
  assert.equal(copies,0);
  assert.equal(context.confirmedBookings.length,0,'Creating a draft must not confirm it');
  context.copyingZalo = false;
  context.btnCopyZalo = {disabled:false};
  context.copyText = async () => true;
  context.outputZalo.value = context.outputZalo.value.replace('Tasmin Walton','Edited Guest').replace('18/11/2026','26/11/2026');
  await context.handleCopyZalo();
  assert.equal(context.confirmedBookings.length,1);
  assert.match(context.confirmedBookings[0].parsed.customerString,/Edited Guest/);
  assert.equal(context.confirmedBookings[0].dayMonthKey,'26/11');
  await context.handleCopyZalo();
  assert.equal(context.confirmedBookings.length,1,'Repeated copy must not duplicate');
  context.confirmedBookings[0].checkStatus = 'found';
  context.outputZalo.value = context.outputZalo.value.replace('Edited Guest','Updated Guest');
  await context.handleCopyZalo();
  assert.equal(context.confirmedBookings.length,1);
  assert.match(context.confirmedBookings[0].parsed.customerString,/Updated Guest/);
  assert.equal(context.confirmedBookings[0].checkStatus,'pending');
  await context.handleCreateZaloForm();
  context.copyText = async () => false;
  await context.handleCopyZalo();
  assert.equal(context.confirmedBookings.length,1,'Failed copy must not confirm');
  context.copyText = async () => true;
  await context.handleCopyZalo();
  assert.equal(context.confirmedBookings.length,2,'New draft can be confirmed separately');
  localCalls = 1;
  Memory.save(sylvieText, sylvie.zaloMsg.replace('+-7 giờ sáng','07:00'));
  context.rawInput.value = sylvieText;
  for (const enabled of [false,true]) {
    context.isGeminiEnabled=()=>enabled;
    await context.handleCreateZaloForm();
    assert.equal(context.currentParsedResult.isSavedExample,true);
    assert.equal(context.currentParsedResult.pickupTime,'07:00');
    assert.equal(localCalls,1);
    assert.match(badge.textContent,/Mẫu đã lưu/);
  }
  const customRaw = 'Khách chính: Sylvie +33770493406\nNơi lên: Pu Luong Roots Homestay\nNơi xuống: The Green House Homestay Ta Coc\nNgày chạy: 24/11/2026\nTổng người: 2\nHẹn khách: 07:00';
  Memory.save(customRaw, sylvie.zaloMsg.replace('+-7 giờ sáng','07:00'));
  const nextRaw = customRaw.replace('Sylvie +33770493406','Alice +441234567890').replace('24/11/2026','25/11/2026').replace('Tổng người: 2','Tổng người: 5');
  assert.equal(Memory.recall(nextRaw),null);
  const adapted = Memory.learn(nextRaw, Parser.parse(nextRaw));
  assert.equal(adapted.customerString,'Alice +441234567890');
  assert.equal(adapted.pax,5);
  assert.equal(adapted.travelDate,'25/11/2026');
  assert.equal(adapted.code,'tl251126');
  assert.equal(adapted.pickupPoint,'Pu Luong Roots Homestay');
  assert.ok(adapted.zaloMsg.includes('Alice – +441234567890'));
  assert.ok(!adapted.zaloMsg.includes('Sylvie'));
  assert.equal(adapted.isLearnedExample,true);
  assert.equal(Memory.recall(Parser.parse(customRaw).zaloMsg).customerString,'Sylvie +33770493406');
  // Passenger table: column headers are not passenger names. Values may change freely.
  const voucher = name => `Halong happy travel\nThe Long Travel\n#AAVQ2921\n24/11/2026\n11:45\n4 × Adult\nCác hành khách\nTên Fare   Quốc tịch   Ticket / seat\n${name}\nSố điện thoại: +33623312858 · E-mail: contact@example.com\nAdult`;
  for (const name of ['hello and smile', 'Alice Smith', 'Nguyễn Văn An', 'Élodie Martin']) {
    const booking = Parser.parse(voucher(name));
    assert.equal(booking.customerString,`${name} +33623312858`);
    assert.ok(!booking.customerString.includes('Fare'));
  }
  assert.equal(Parser.parse(voucher('Alice Smith\tAdult\tFrance\t12')).customerString,'Alice Smith +33623312858');
  assert.equal(Parser.parse(voucher('Alice Smith').replace('Tên Fare   Quốc tịch   Ticket / seat','Tên\nFare\nQuốc tịch\nTicket / seat')).customerString,'Alice Smith +33623312858');
  const savedVoucher = Parser.parse(voucher('Old Customer'));
  Memory.save(voucher('Old Customer'), savedVoucher.zaloMsg.replace('Lịch trình         : NB','Lịch trình         : HL - NB'));
  const freshVoucher = Memory.learn(voucher('New Customer'), Parser.parse(voucher('New Customer')));
  assert.equal(freshVoucher.customerString,'New Customer +33623312858');
  assert.equal(freshVoucher.route,'HL - NB');
  console.log('PASS: parser regressions, real AI result path, model selection, API errors, invalid/truncated responses.');
}
main().catch(error => {console.error(error); process.exitCode = 1;});
