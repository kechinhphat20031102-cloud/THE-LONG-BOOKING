const rawInput = `Tuan Chau Marina Hotel
The Long Travel
#AAVP9028
Thứ 4 25 thg 11 2026 · Express 16
11:00
Các hành khách
2 × Adult
Igor Ksiezopolski
Nikola Subocz
Số điện thoại: +48735977916`;

const isLocationLine = (str) => {
  const s = (str || '').toLowerCase();
  return /hotel|homestay|hostel|resort|villa|marina|travel|lodge|camp|retreat|văn phòng|cảng|bến|sân bay/i.test(s) ||
         /tam coc|tuan chau|ha long|hạ long|ninh binh|ninh bình|cat ba|cát bà|mai chau|mai châu|pu luong|pù luông/i.test(s);
};

const lines = rawInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

// Find candidate locations
const candidateLocations = lines.filter(l => 
  isLocationLine(l) && 
  !l.includes('·') && 
  !l.includes('Express') && 
  !l.includes('#') && 
  !l.match(/^\d{1,2}:\d{2}/) && 
  !l.toLowerCase().includes('thứ')
);

console.log('Candidate locations:', candidateLocations);

// Passenger extraction
const passengersSection = rawInput.match(/Các hành khách[\s\S]*?(?:Số điện thoại|SĐT|$)/i);
let customerNames = [];
if (passengersSection) {
  const pLines = passengersSection[0].split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.toLowerCase().includes('hành khách') && !l.includes('×') && !l.includes('x Adult') && !l.toLowerCase().includes('adult') && !l.toLowerCase().includes('số điện thoại'));
  if (pLines.length > 0) {
    customerNames = [pLines[0]]; // first passenger is lead
  }
}

console.log('Customer name:', customerNames);
