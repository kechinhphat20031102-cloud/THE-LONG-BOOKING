// Kiểm tra logic khớp khách với Google Sheet và chọn tab ngày trong app.js
const fs = require('fs');
const assert = require('assert');
const src = fs.readFileSync(__dirname + '/app.js', 'utf8');
const start = src.indexOf('const SHEET_TABS');
const end = src.indexOf("document.addEventListener('DOMContentLoaded'");
const api = new Function(src.slice(start, end).replace(/^let /gm, 'var ') +
  '\nreturn {SHEET_TABS, matchCustomer, escapeHtml, isValidTabKey, todayTabKey, tabKeyWindow, sheetHeaderDate};')();
const {matchCustomer: m, escapeHtml, isValidTabKey, todayTabKey} = api;

// Khớp đúng
assert.strictEqual(m('Nguyen Van An 0912345678', 'Nguyễn Văn An'), 'name');
assert.strictEqual(m('Igor Ksiezopolski +48735977916', 'IGOR KSIEZOPOLSKI'), 'name');
assert.strictEqual(m('Mr John Smith', 'john smith x2'), 'name');
assert.strictEqual(m('Anna 0912 345 678', 'Khách lẻ +84912345678'), 'phone');
// Không còn báo nhầm vì trùng 1 từ
assert.strictEqual(m('Nguyen Van An', 'Nguyen Thi Hoa'), '');
assert.strictEqual(m('Mr John Smith', 'Mr Peter Smith'), '');
assert.strictEqual(m('Ann', 'Annabelle Lee'), '');
assert.strictEqual(m('Mrs', 'Mrs Lee'), '');
assert.strictEqual(m('', 'abc'), '');
// Escape HTML
assert.strictEqual(escapeHtml('<img src=x onerror=1>'), '&lt;img src=x onerror=1&gt;');
// Tab ngày: tháng 11 cũ vẫn có; hôm nay và 1/12 (trong 90 ngày tới) hợp lệ; ngày xa như 1/4 thì không
assert.ok(isValidTabKey('24/11'));
assert.ok(isValidTabKey(todayTabKey()));
const in10 = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',day:'numeric',month:'numeric'}).format(new Date(Date.now()+10*86400000)).split('/').map(Number).join('/');
assert.ok(!api.tabKeyWindow().has('05/12') && !/^0/.test(in10));
assert.ok(isValidTabKey(in10), in10);
assert.ok(!isValidTabKey('32/12'));
assert.ok(!isValidTabKey('abc'));
const row = t => ({c:[{v:t}]});
assert.strictEqual(api.sheetHeaderDate([row('NGÀY 26 THÁNG 11 NĂM 2026')]), '26/11');
assert.strictEqual(api.sheetHeaderDate([row('x'), row('LỆNH ĐIỀU XE CÁT BÀ: NGÀY 1 THÁNG 12 NĂM 2026')]), '1/12');
assert.strictEqual(api.sheetHeaderDate([row('abc')]), '');
console.log('PASS: sheet match (' + todayTabKey() + ', ' + in10 + ')');
