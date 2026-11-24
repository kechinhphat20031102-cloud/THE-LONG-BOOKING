const BookingParser = require('./parser.js');
const text = `EM GỬI 1 PAX CB - NB CHUYẾN 8:15AM NGÀY 24/11
TÊN : saoirse
CODE: 4452
ĐÓN: CATBA BUFFALO HOSTEL`;
const r = BookingParser.parse(text, 'Felix');
if (!r) { console.log('PARSE FAILED'); process.exit(1); }
console.log('dayMonthKey:', r.dayMonthKey);
console.log('customerString:', r.customerString);
console.log('originalCode:', r.originalCode);
console.log('agency:', r.agency);
console.log('pickupPoint:', r.pickupPoint);
console.log('travelDate:', r.travelDate);
