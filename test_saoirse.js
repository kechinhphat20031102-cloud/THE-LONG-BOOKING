const BookingParser = require('./parser.js');

const raw = `EM GỬI 1 PAX CB - NB CHUYẾN 8:15AM NGÀY 24/11
TÊN : saoirse
CODE: 4452
ĐÓN: CATBA BUFFALO HOSTEL`;

const res = BookingParser.parse(raw);
console.log('Result:');
console.log('Agency:', res.agency);
console.log('Date:', res.travelDate);
console.log('Route:', res.route);
console.log('Customer:', res.customerString);
console.log('Pickup:', res.pickupPoint);
console.log('Code:', res.code);
