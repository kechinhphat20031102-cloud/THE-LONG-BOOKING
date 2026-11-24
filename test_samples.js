const BookingParser = require('./parser.js');

console.log('=== TEST 1: MẪU 1 (#AAVH6204) ===');
const raw1 = `#AAVH6204
Thứ 5 19 thg 11 2026 · Express 16 08:00am
đón Tam Coc Sunshine Hostel
trả Little Mai Chau Homestay
Các hành khách
1 × Adult
Yoav Zamir
Số điện thoại
+972584760413`;
const res1 = BookingParser.parse(raw1, 'Mon');
console.log('Agency:', res1.agency, '(Expected: vpl AAVH6204)');
console.log('Route:', res1.route, '(Expected: nb mc)');
console.log('Vehicle:', res1.vehicle, '(Expected: 16)');
console.log('Customer:', res1.customerString, '(Expected: Yoav Zamir +972584760413)');
console.log('Pickup time:', res1.pickupTime, '(Expected: 7:30 - 7:50)');
console.log('Pickup point:', res1.pickupPoint, '(Expected: Tam Coc Sunshine Hostel)');
console.log('Drop point:', res1.dropPoint, '(Expected: Little Mai Chau Homestay)');
console.log('Excel:', res1.excel4Cols);

console.log('\n=== TEST 2: MẪU 2 (AAVH6457) ===');
const raw2 = `AAVH6457
Thứ 4 18 thg 11 2026 · Express 16
Route: Ninh Binh to Pu Luong 13:00
đón The Long Travel
trả OH Pu Luong Homestay
Các hành khách 2 × Adult
Johanna Freninger
Jonas Thoeni
Số điện thoại: +436509939155`;
const res2 = BookingParser.parse(raw2, 'TRACY');
console.log('Agency:', res2.agency, '(Expected: AAVH6457)');
console.log('Route:', res2.route, '(Expected: NB - PL)');
console.log('Customer:', res2.customerString, '(Expected: Johanna Freninger +436509939155)');
console.log('Pickup time:', res2.pickupTime, '(Expected: 12:45 - 13:00)');
console.log('Excel:', res2.excel4Cols);

console.log('\n=== TEST 3: MẪU TUẦN CHÂU (#AAVP9028) ===');
const raw3 = `Tuan Chau Marina Hotel
The Long Travel
#AAVP9028
Thứ 4 25 thg 11 2026 · Express 16
11:00
Các hành khách
2 × Adult
Igor Ksiezopolski
Nikola Subocz
Số điện thoại: +48735977916`;
const res3 = BookingParser.parse(raw3, 'SAEN');
console.log('Agency:', res3.agency, '(Expected: AAVP9028)');
console.log('Code:', res3.code, '(Expected: tl251126)');
console.log('Date:', res3.travelDate, '(Expected: 25/11/2026)');
console.log('Route:', res3.route, '(Expected: HL - NB)');
console.log('Vehicle:', res3.vehicle, '(Expected: Bus)');
console.log('Pax:', res3.pax, '(Expected: 2)');
console.log('Customer:', res3.customerString, '(Expected: Igor Ksiezopolski +48735977916)');
console.log('Pickup time:', res3.pickupTime, '(Expected: 11:00 - 11:30)');
console.log('Pickup point:', res3.pickupPoint, '(Expected: Tuan Chau Marina Hotel)');
console.log('Drop point:', res3.dropPoint, '(Expected: The Long Travel)');
console.log('Excel:', res3.excel4Cols);

console.log('\n=== TEST 4: MẪU VEXERE (R563ZK) ===');
const raw4 = `Ninh Bình - Cát Bà
09:30
18/11/2026
Mã vé: R563ZK
Đón: 09:30 - The Long Hotel
Trả: 14:00 - 243 Núi Ngọc
Tên: Tasmin Walton 3pax 
SĐT: 447825575049`;
const res4 = BookingParser.parse(raw4, 'TRACY');
console.log('Agency:', res4.agency, '(Expected: VXR R563ZK)');
console.log('Customer:', res4.customerString, '(Expected: Tasmin Walton +447825575049)');
console.log('Pickup time:', res4.pickupTime, '(Expected: 8:35 - 9:35)');
console.log('Excel:', res4.excel4Cols);
