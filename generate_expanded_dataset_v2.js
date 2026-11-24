const fs=require('node:fs');
const samples=[];
const names=['Trần Bảo Ngọc','Chloé Dubois',"Liam O’Connor",'nguyen van binh','Sofia De Luca'];
for(let family=0;family<8;family++)for(let n=0;n<125;n++){
 const name=names[n%5]+' '+String.fromCharCode(65+Math.floor(n/5)%26);
 const pax=1+n%6,date=`${String(1+n%28).padStart(2,'0')}/${String(1+n%12).padStart(2,'0')}/${2029+Math.floor(n/84)}`;
 const phone='+447000'+String(2000+family*125+n).padStart(6,'0');
 const pickup=`Tam Coc Garden Hotel ${1+n%9}`,drop=`Cat Ba Seaside Hotel ${1+n%7}`;
 let raw='',expected={};
 const base={travelDate:date,pax,customerString:`${name} ${phone}`,pickupPoint:pickup,dropPoint:drop,pickupTime:'09:00 - 09:20',route:'NB - CB'};
 if(family===0){raw=`Ngày đi: ${date} Tên khách: ${name} SĐT: ${phone} Số khách: ${pax} Giờ đón: 09:00 - 09:20 Điểm đón: ${pickup} Điểm trả: ${drop}`;expected=base;}
 if(family===1){let lines=[`Date: ${date}`,`Name: ${name}`,`Phone: ${phone}`,`Passengers: ${pax}`,'Pickup time: 09:00 - 09:20',`Pickup: ${pickup}`,`Drop-off: ${drop}`];lines=lines.slice(n%7).concat(lines.slice(0,n%7));raw=lines.join('\n');expected=base;}
 if(family===2){raw=`Điều hành: 0904000000\nNgày: ${date}\nTên: ${name}\nSĐT tài xế: 0905000000\nSĐT khách: ${phone}\nSố người: ${pax}\nGiờ đón: 09:00 - 09:20\nĐón: ${pickup}\nTrả: ${drop}`;expected=base;}
 if(family===3){raw=`Ngày: ${date}\nTên: ${name}\nSĐT: ${phone}\nThu hộ ${200+n}k\nĐón: ${pickup}\nTrả: ${drop}\nGiờ đón: 09:00 - 09:20`;expected={...base,pax:''};}
 if(family===4){raw=`Ngày: ${date}\nSố người: ${pax}\nSĐT: ${phone}\nGiờ đón: 09:00 - 09:20\nĐón: ${pickup}\nTrả: ${drop}`;expected={...base,customerString:`Khách ${phone}`};}
 if(family===5){raw=`Ngày ${date}\n15:10 đặt xe đón ${pax+1} pax từ bến thuyền tràng an\n${pax}pax về bích động\n1pax trả Si Grand Hotel`;expected={travelDate:date,pax:pax+1,customerString:'Khách',pickupPoint:'bến thuyền tràng an',dropPoint:`${pax}pax về bích động; 1pax trả Si Grand Hotel`,pickupTime:'15:10',route:'taxi tràng an - nb'};}
 if(family===6){raw=`chị đặt xe : chuyến 20h / ngày ${date} / ${pax} khách / đón Hang Múa Eco Garden / trả công viên cầu giấy / ${name} / ${phone}`;expected={...base,pickupPoint:'Hang Múa Eco Garden',dropPoint:'công viên cầu giấy',pickupTime:'19:45 - 20:15',route:'NB - HN'};}
 if(family===7){raw=`Ngày:\n${date}\nTên:\n${name}\nSĐT:\n${phone}\nSố người:\n${pax}\nGiờ đón:\n09:00 - 09:20\nĐón:\n${pickup}\nTrả:\n${drop}`;expected=base;}
 if(n%3===0)raw=raw.replace(/ /g,'\u00a0');
 if(n%4===0)raw=raw.replace(/\n/g,'\r\n');
 if(n%5===0)raw='  '+raw.split('\n').join('\n  ');
 samples.push({id:`expanded-v2-${family}-${n}`,split:n<100?'development':'validation',sourceId:[10,10,7,23,11,2,1,19][family],synthetic:true,raw,expected});
}
const old=new Set(require('./dataset_expanded_1000.json').map(c=>c.raw));
if(samples.some(c=>old.has(c.raw))||new Set(samples.map(c=>c.raw)).size!==1000)throw Error('Duplicate sample');
fs.writeFileSync('dataset_expanded_1000_v2.json',JSON.stringify(samples,null,2));
console.log('Generated 1000 unique NEW samples; 800 development + 200 validation.');
