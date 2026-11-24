// Ground truth is specified here from reviewed source rules, never from parser output.
const fs=require('node:fs');
const names=['Nguyễn Minh Anh','Élodie Bernard',"Sean O’Neill",'hello and smile','Anna Maria Rossi','José García','Lê Hoài An','Zoë van Dijk','Müller Jonas','Dương Ngọc Mai'];
const samples=[];
for(let family=0;family<10;family++) for(let n=0;n<100;n++) {
 const name=names[n%10]+' '+String.fromCharCode(65+Math.floor(n/10));
 const pax=1+n%8, day=1+n%27, month=1+Math.floor(n/9)%12, year=2027+n%2;
 const date=`${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`;
 const phone='+3360000'+String(family*100+n).padStart(4,'0');
 const shownPhone=n%3===0 ? phone.slice(0,3)+' '+phone.slice(3,6)+' '+phone.slice(6) : phone;
 const code='AAVQ'+String(1000+family*100+n);
 let lines=[], expected={travelDate:date,pax,customerString:name+' '+phone};
 const labels=(pickup,drop,time)=>[`Ngày: ${date}`,`Tên khách: ${name}`,`Số điện thoại: ${shownPhone}`,`Số lượng khách: ${pax}`,`Giờ đón: ${time}`,`Đón: ${pickup}`,`Trả: ${drop}`];
 const header=['TênFareQuốc tịchTicket / seat','Tên Fare   Quốc tịch Ticket / seat','Tên\nFare\nQuốc tịch\nTicket / seat'][n%3];
 const table=[`Các hành khách`,`${pax} × Adult`,header,name,`Số điện thoại: ${shownPhone}`, 'Adult','Other Passenger'];
 const voucher=(route,time,pickup,drop)=>[code,`${day} thg ${month} ${year} · Express 16`,`Route: ${route}`,time,pickup,drop,...table];
 if(family===0){ // Dataset 14/24; user explicitly chose the noon pickup rule.
  lines=[`EM GỬI ${pax} PAX CB - NB CHUYẾN ${n%2?'12:30PM':'12h30'} NGÀY ${date}`,`TÊN: ${name}${n%2?' X '+pax+' PAX':''}`,`CODE: ${10000+n}`,`ĐÓN: CATBA BUFF${n%3?'':'\\'}ALO HOSTEL`,`WS: ${shownPhone}`];
  expected={...expected,route:'CB - NB',pickupTime:'12:00 - 12:30',pickupPoint:'CATBA BUFFALO HOSTEL',dropPoint:''};
 }
 if(family===1){lines=voucher('Ninh Binh to Pu Luong','13:00','The Long Travel','OH Pu Luong Homestay');expected={...expected,route:'NB - PL',pickupTime:'12:45 - 13:00',pickupPoint:'The Long Travel',dropPoint:'OH Pu Luong Homestay'};}
 if(family===2){lines=[`Mã đặt chỗ: R${1000+n}`,`Ngày khởi hành: ${day} tháng ${month} năm ${year}`,'Lịch trình: Ninh Bình - Cát Bà',`Số lượng hành khách: ${pax}`,`Tên hành khách: ${name} ${shownPhone}`,'Thời gian đón: 6:40 - 7:00','Điểm đón: Tam Coc Sunseekers Homestay 2','Điểm trả: Cat Ba Love House',`note: thu khách ${250+n}k`];expected={...expected,route:'NB - CB',pickupTime:'6:40 - 7:00',pickupPoint:'Tam Coc Sunseekers Homestay 2',dropPoint:'Cat Ba Love House'};}
 if(family===3){lines=[code,`${day} thg ${month} ${year} · Express 16`,'Route: Hoa Binh to Tam Coc 13:30','đón: Mac Thanh Homestay','trả: Tam Coc Sunshine Hostel',...table];expected={...expected,route:'MC - NB',pickupTime:'13:00 - 13:20',pickupPoint:'Mac Thanh Homestay',dropPoint:'Tam Coc Sunshine Hostel'};}
 if(family===4){lines=[code,'Route: Tam Coc boat station to mai châu','Vehicle: Express 16','Departure station: tam coc boat station',`Departure at: ${day}-${month}-${year} 08:00`,'Arrival station: Little Mai Chau Homestay',`Adult: ${pax}pax`,name,`Phone: ${shownPhone}`];expected={...expected,route:'nb mc',pickupTime:'7:45 - 8:00',pickupPoint:'tam coc boat station',dropPoint:'Little Mai Chau Homestay'};}
 if(family===5 || family===6){const connection=family===5;lines=[`EM GỬI ${pax} KHÁCH CATBA - NINH BINH${connection?' - PHONG NHA':''} CHUYẾN 12PM NGÀY ${date}`,`TÊN: ${name}`,'ĐÓN: FAMILY HOME CATBA',...(connection?['ĐÓN: NINH BÌNH 20:00 (CABIN 20)']:[]),`CODE: ${10000+n}`,`WS: ${shownPhone}`];expected={...expected,route:'CB - NB',pickupTime:'12:00 - 12:20',pickupPoint:'FAMILY HOME CATBA',dropPoint:connection?'60 Trần Nhân Tông (nối Phong Nha chuyến 20:00)':'Tam Coc'};}
 if(family===7){lines=labels('Indochine','PARAGON 2 BOUTIQUE HOTEL AND POOL',n%2?'5:00 PM':'17:00');lines.push('Loại xe: Limousine');expected={...expected,route:'NB - HN',pickupTime:'17:00 - 17:30',pickupPoint:'Indochine',dropPoint:'PARAGON 2 BOUTIQUE HOTEL AND POOL'};if(n%2)lines.reverse();}
 if(family===8){lines=[`ngày ${date}, bên e book ${pax} vé đi tour cúc phương, tên khách ${name} ạ`,`SĐT: ${shownPhone}`];expected={...expected,route:'CÚC PHƯƠNG',pickupTime:'8:45 - 9:10',pickupPoint:'',dropPoint:''};}
 if(family===9){lines=[code,`${day} thg ${month} ${year} · Tourist AC`,'Route: Quang Ninh to Tam Coc [Tourist AC] 12:30','đón Ha Long Happy Travel Tuan Chau','trả Tam Coc Sunshine Hostel',...table];expected={...expected,route:'HL - NB',pickupTime:'11:45 - 12:10',pickupPoint:'Ha Long Happy Travel Tuan Chau',dropPoint:'Tam Coc Sunshine Hostel'};}
 // Independent formatting variants: indentation, NBSP, CRLF, blank lines, colon spacing.
 let raw=lines.join(n%4===0?'\r\n':n%4===1?'\n\n':'\n');
 if(n%5===0)raw=raw.split('\n').map(l=>'  '+l+'  ').join('\n');
 if(n%7===0)raw=raw.replace(/ /g,'\u00a0');
 if(n%6===0)raw=raw.replace(/: /g,':   ');
 samples.push({id:`expanded-${family}-${n}`,sourceId:[14,12,10,9,13,15,16,6,18,37][family],split:n>=80?'validation':'development',synthetic:true,raw,expected});
}
fs.writeFileSync('dataset_expanded_1000.json',JSON.stringify(samples,null,2));
console.log(`Generated ${samples.length} distinct synthetic cases; 800 development, 200 validation.`);
