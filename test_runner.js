const fs = require('fs');
let code = fs.readFileSync('parser.js', 'utf8');
code = code.replace('window.BookingParser = BookingParser;', 'if (typeof module !== "undefined") module.exports = BookingParser; if (typeof window !== "undefined") window.BookingParser = BookingParser;');
fs.writeFileSync('parser.js', code);

const BookingParser = require('./parser.js');

console.log('----------------------------------------------------');
console.log('TEST 1: ẢNH 1 (AAVP7636) - Pù Luông về Ninh Bình');
console.log('----------------------------------------------------');
const test1 = `VP Long
#AAVP7636
Thứ 6 27 thg 11 2026 · Express 16
Route: Pu Luong to Ninh Binh
07:20
3h 30m
10:50
OH Pu Luong Homestay
The Long Travel
Các hành khách
2 × Adult
Jocelin BobinetLopez
Số điện thoại: +33783789389
Celiane Ferrin
Số điện thoại: +33783789389`;

const res1 = BookingParser.parse(test1, 'SAEN');
console.log(res1.zaloMsg);
console.log('\n[EXCEL DÁN]:\n' + res1.excel4Cols);

console.log('\n----------------------------------------------------');
console.log('TEST 2: MẪU 1 VEXERE (R563ZK)');
console.log('----------------------------------------------------');
const test2 = `Ninh Bình - Cát Bà
09:30
18/11/2026
Thời gian xác nhận còn lại
00:33:29
1 ghế:
3
Mã vé:
R563ZK
Mã đặt chỗ:
XH72U0I
Đón:
09:30 - The Long Hotel
TC Đón:
Trả:
14:00 - 243 Núi Ngọc
TC trả:
Tên:
Tasmin Walton 3pax 
SĐT:
447825575049
Email:
tazzyw@hotmail.com`;

const res2 = BookingParser.parse(test2, 'TRACY');
console.log(res2.zaloMsg);
console.log('\n[EXCEL DÁN]:\n' + res2.excel4Cols);

console.log('\n----------------------------------------------------');
console.log('TEST 3: MẪU 4 (ZALO NGẮN - NGỌC ĐỀ)');
console.log('----------------------------------------------------');
const test3 = `Mai cho c 2 cát bà 9h (ella)`;
const res3 = BookingParser.parse(test3, 'Felix');
console.log(res3.zaloMsg);
console.log('\n[EXCEL DÁN]:\n' + res3.excel4Cols);

console.log('\n----------------------------------------------------');
console.log('TEST 4: MẪU 3 (SUNLIGHT TUẦN CHÂU)');
console.log('----------------------------------------------------');
const test4 = `@All Trưa mai 18/11, Em gửi 2 bus HL - NB. Đón Lô G54-55 ( đối diện No26) Tuần Châu. Lễ tân đón bến 0964 023 086 nhận/ giao khách.
2k\tMateusz Zaremba +48514838931.  Trả phố cổ Hoa Lư, NB`;
const res4 = BookingParser.parse(test4, 'Felix');
console.log(res4.zaloMsg);
console.log('\n[EXCEL DÁN]:\n' + res4.excel4Cols);
