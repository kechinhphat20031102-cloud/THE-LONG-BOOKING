const BookingParser = {
  normalizePhone(phoneStr) {
    if (!phoneStr) return '';
    let cleaned = phoneStr.trim().replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.length >= 10 && !cleaned.startsWith('0')) return '+' + cleaned;
    if (cleaned.startsWith('0')) return cleaned;
    return cleaned ? '+' + cleaned : '';
  },

  isLocationLine(str) {
    const s = (str || '').trim().toLowerCase();
    if (!s) return false;
    return /hotel|homestay|hostel|resort|villa|marina|travel|lodge|camp|retreat|văn phòng|cảng|bến|sân bay/i.test(s) ||
           /tam coc|tuan chau|ha long|hạ long|ninh binh|ninh bình|cat ba|cát bà|mai chau|mai châu|pu luong|pù luông|núi ngọc|núi vang|hoa lư/i.test(s);
  },

  calculatePickupTime(route, timeStr, vehicleType, pickupPoint = '') {
    const rLower = (route || '').toLowerCase();
    const tLower = (timeStr || '').toLowerCase();
    const vLower = (vehicleType || '').toLowerCase();
    const pLower = (pickupPoint || '').toLowerCase();

    // 1. Tuyến Cát Bà
    if (rLower.includes('cát bà') || rLower.includes('cat ba') || rLower.includes('cb')) {
      if (rLower.includes('cb - nb') || rLower.includes('cb-nb') || rLower.includes('cát bà - ninh bình')) {
        if (tLower.includes('8:15') || tLower.includes('8h15') || tLower.includes('8h') || tLower.includes('8:00') || tLower.includes('08:00')) {
          return '8:00 - 8:15';
        }
        if (tLower.includes('12h30') || tLower.includes('12:30')) return '12:00 - 12:30';
        if (tLower.includes('15h30') || tLower.includes('15:30')) return '15:00 - 15:30';
        return '8:00 - 8:30';
      }

      if (tLower.includes('7:00') || tLower.includes('07:00') || tLower.includes('7h')) return '6:30 - 7:00';
      if (tLower.includes('9:30') || tLower.includes('9h30') || tLower.includes('09:30')) {
        if (pLower.includes('the long') || pLower.includes('the long hotel')) return '8:35 - 9:35';
        return '9:00 - 9:35';
      }
      if (tLower.includes('9h') || tLower.includes('9:00') || tLower.includes('09:00')) return '9:00 - 9:15';
      if (tLower.includes('13:30') || tLower.includes('13h30')) return '13:00 - 13:30';
      return '9:00 - 9:35';
    }

    // 2. Tuyến Hạ Long
    if (rLower.includes('hạ long') || rLower.includes('ha long') || rLower.includes('hl')) {
      if (tLower.includes('11:00') || tLower.includes('11h00') || tLower.includes('11h')) {
        return '11:00 - 11:30';
      }
      if (rLower.includes('hl - nb') || rLower.includes('hl nb') || rLower.includes('hạ long - ninh bình') || tLower.includes('12:00') || tLower.includes('trưa')) {
        return '11:45 - 12:12';
      }
      if (vLower.includes('limo')) {
        if (pLower.includes('tam coc') || pLower.includes('axasola')) return '6:40 - 7:00';
        return '6:30 - 7:30';
      }
      return '6:30 - 7:30';
    }

    // 3. Mai Châu - Pù Luông
    if (rLower.includes('mai châu') || rLower.includes('mai chau') || rLower.includes('mc') ||
        rLower.includes('pù luông') || rLower.includes('pu luong') || rLower.includes('pl')) {
      if (rLower.includes('pu luong to ninh binh') || rLower.includes('pl - nb') || rLower.includes('pl nb') || rLower.includes('mc - nb')) {
        if (tLower.includes('07:20') || tLower.includes('7:20')) return '7:00 - 7:20';
        if (tLower.includes('13:00') || tLower.includes('13:30')) return '12:45 - 13:00';
        return '13:00 - 13:30';
      }
      if (tLower.includes('13:00') || tLower.includes('13h')) return '12:45 - 13:00';
      return '7:30 - 7:50';
    }

    // Mặc định lùi 15-30 phút
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const totalMin = h * 60 + m;
      const startMin = Math.max(0, totalMin - 30);
      const startH = Math.floor(startMin / 60);
      const startM = String(startMin % 60).padStart(2, '0');
      return `${startH}:${startM} - ${h}:${String(m).padStart(2, '0')}`;
    }

    return '7:00 - 7:30';
  },

  parse(rawText, operator = 'Felix') {
    if (!rawText || !rawText.trim()) return null;

    const fullText = rawText;
    const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    let agency = '';
    let code = '';
    let travelDate = '';
    let dayMonthKey = '';
    let route = '';
    let vehicle = 'Bus';
    let pax = 1;
    let customerNames = [];
    let phone = '';
    let timeStr = '';
    let pickupTime = '';
    let pickupPoint = '';
    let dropPoint = '';
    let price = '';
    let note = 'Thanh toán khi kế toán gửi công nợ ngày theo dõi';
    let topMention = '';

    if (fullText.includes('@VP Long') || fullText.includes('VP Long')) {
      topMention = '@VP Long ';
    }

    // 1. Ngày đi
    const dateMatch1 = fullText.match(/(\d{1,2})\s*thg\s*(\d{1,2})(?:\s*(\d{4}))?/i);
    const dateMatch2 = fullText.match(/(?:ngày|ngay)?\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i);
    const maiMatch = fullText.match(/\b(mai|trưa mai|sáng mai)\b/i);

    if (dateMatch1) {
      const dd = dateMatch1[1].padStart(2, '0');
      const mm = dateMatch1[2].padStart(2, '0');
      const yyyy = dateMatch1[3] || '2026';
      travelDate = `${dd}/${mm}/${yyyy}`;
      dayMonthKey = `${parseInt(dd, 10)}/${parseInt(mm, 10)}`;
      code = `tl${dd}${mm}${yyyy.slice(-2)}`;
    } else if (dateMatch2) {
      const dd = dateMatch2[1].padStart(2, '0');
      const mm = dateMatch2[2].padStart(2, '0');
      let yyyy = dateMatch2[3] || '2026';
      if (yyyy.length === 2) yyyy = '20' + yyyy;
      travelDate = `${dd}/${mm}/${yyyy}`;
      dayMonthKey = `${parseInt(dd, 10)}/${parseInt(mm, 10)}`;
      code = `tl${dd}${mm}${yyyy.slice(-2)}`;
    } else if (maiMatch) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const yyyy = tomorrow.getFullYear();
      travelDate = `${dd}/${mm}/${yyyy}`;
      dayMonthKey = `${parseInt(dd, 10)}/${parseInt(mm, 10)}`;
      code = `TL${dd}${mm}${String(yyyy).slice(-2)}`;
    } else {
      travelDate = '24/11/2026';
      dayMonthKey = '24/11';
      code = 'TL241126';
    }

    // 2. Đại lý / Code
    const specificCode = fullText.match(/(?:CODE|Code|Mã đặt chỗ|Mã vé)[\s:]*([A-Za-z0-9]+)/i);
    let originalCode = specificCode ? specificCode[1].trim() : '';

    const vxrMatch = fullText.match(/Mã vé:\s*([A-Z0-9]+)/i);
    const vplMatch = fullText.match(/#([A-Z]{3,4}\d{4,6})/i) || fullText.match(/\b([A-Z]{3,4}\d{4,6})\b/);

    if (vxrMatch) {
      agency = `VXR ${vxrMatch[1]}`;
    } else if (vplMatch) {
      const codeOnly = vplMatch[1].toUpperCase();
      if (codeOnly.startsWith('AAVP')) {
        agency = codeOnly;
      } else if (codeOnly.startsWith('AAVH')) {
        agency = fullText.includes('#') ? `vpl ${codeOnly}` : codeOnly;
      } else {
        agency = codeOnly;
      }
    } else if (fullText.toLowerCase().includes('buffalo') || fullText.toLowerCase().includes('catba buffalo')) {
      agency = originalCode ? `BUFFALO ${originalCode}` : 'BUFFALO';
    } else if (fullText.toLowerCase().includes('sunlight') || fullText.includes('Tuần Châu') || fullText.includes('HL - NB')) {
      agency = 'sunlight';
    } else if (fullText.toLowerCase().includes('ngọc đề') || fullText.toLowerCase().includes('c 2 cát bà')) {
      agency = 'NGỌC ĐỀ';
    } else if (fullText.toLowerCase().includes('anh sơn') || fullText.toLowerCase().includes('axasola')) {
      agency = 'Anh Sơn';
    } else {
      agency = 'Đại lý đối tác';
    }

    // 3. Điểm đón & Điểm trả
    const donMatch = fullText.match(/(?:đón|Đón|ĐÓN|Khởi hành tại|Điểm khởi hành)[\s:]*([^\n\r]+)/i);
    if (donMatch) {
      pickupPoint = donMatch[1].replace(/^\d{1,2}:\d{2}\s*-\s*/, '').trim();
    }

    const traMatch = fullText.match(/(?:trả|Trả|TRẢ|Điểm đến)[\s:]*([^\n\r]+)/i);
    if (traMatch) {
      dropPoint = traMatch[1].replace(/^\d{1,2}:\d{2}\s*-\s*/, '').trim();
    }

    // Nếu không có từ khóa đón/trả rõ ràng (như voucher 12Go: dòng 1 là đón, dòng 2 là trả)
    if (!pickupPoint || !dropPoint) {
      const locCandidates = lines.filter(l => 
        this.isLocationLine(l) &&
        !l.includes('·') &&
        !l.includes('Express') &&
        !l.startsWith('#') &&
        !l.match(/^\d{1,2}:\d{2}/) &&
        !l.toLowerCase().includes('thứ') &&
        !l.toLowerCase().includes('hành khách')
      );

      if (locCandidates.length >= 2) {
        if (!pickupPoint) pickupPoint = locCandidates[0];
        if (!dropPoint) dropPoint = locCandidates[1];
      } else if (locCandidates.length === 1) {
        if (!pickupPoint) pickupPoint = locCandidates[0];
      }
    }

    if (!pickupPoint && fullText.includes('CATBA BUFFALO HOSTEL')) {
      pickupPoint = 'CATBA BUFFALO HOSTEL';
    }

    // 4. Lịch trình (Route)
    if (fullText.match(/CB\s*-\s*NB|Cát Bà\s*-\s*Ninh Bình|cat ba\s*-\s*ninh binh/i) || fullText.match(/\bCH\s*-\s*NB\b/i)) {
      route = 'CB - NB';
    } else if (fullText.match(/Pu Luong to Ninh Binh/i) || fullText.match(/PL\s*-\s*NB/i)) {
      route = 'PL - NB';
    } else if (fullText.match(/Ninh Binh to Pu Luong/i) || fullText.match(/NB\s*-\s*PL/i)) {
      route = 'NB - PL';
    } else if (fullText.match(/Mai Châu - Ninh Bình|Mai Chau - Ninh Binh/i)) {
      route = 'MC - NB';
    } else if (fullText.match(/Ninh Bình - Mai Châu|nb mc/i) || (fullText.includes('Tam Coc') && fullText.includes('Mai Chau'))) {
      route = 'nb mc';
    } else if (fullText.match(/Ninh Bình - Cát Bà|cát bà|cat ba|NB - CB/i)) {
      route = 'NB - CB';
    } else if (fullText.match(/HL - NB|Hạ Long - Ninh Bình|hl nb/i)) {
      route = 'HL - NB';
    } else if (fullText.match(/NB - HL|Ninh Bình - Hạ Long/i) || fullText.includes('cảng sun')) {
      route = 'NB - HL';
    } else {
      // Suy luận từ Điểm đón và Điểm trả
      const pLow = (pickupPoint || '').toLowerCase();
      const dLow = (dropPoint || '').toLowerCase();
      if ((pLow.includes('tuan chau') || pLow.includes('ha long') || pLow.includes('hạ long')) &&
          (dLow.includes('the long') || dLow.includes('ninh binh') || dLow.includes('tam coc'))) {
        route = 'HL - NB';
      } else if ((pLow.includes('the long') || pLow.includes('ninh binh') || pLow.includes('tam coc')) &&
                 (dLow.includes('tuan chau') || dLow.includes('ha long') || dLow.includes('hạ long'))) {
        route = 'NB - HL';
      } else if (pLow.includes('mai chau') || dLow.includes('mai chau')) {
        route = pLow.includes('mai chau') ? 'MC - NB' : 'nb mc';
      } else if (pLow.includes('pu luong') || dLow.includes('pu luong')) {
        route = pLow.includes('pu luong') ? 'PL - NB' : 'NB - PL';
      } else {
        route = 'NB';
      }
    }

    // 5. Loại xe
    if (route === 'HL - NB' || route === 'hl nb') {
      vehicle = fullText.match(/limo|limousine/i) ? 'LIMO' : 'Bus';
    } else if (route === 'nb mc') {
      vehicle = fullText.match(/Express 16|16/) ? '16' : (fullText.match(/limo/i) ? 'LIMO' : 'Bus');
    } else if (fullText.match(/Express 16/i)) {
      vehicle = (route === 'NB - PL' && !fullText.includes('AAVP')) ? 'minivan' : 'Express 16';
    } else if (fullText.match(/16/)) {
      vehicle = '16';
    } else if (fullText.match(/LIMO|limousine/i) || fullText.includes('cảng sun')) {
      vehicle = 'LIMO';
    } else if (fullText.match(/minivan/i)) {
      vehicle = 'minivan';
    } else {
      vehicle = 'Bus';
    }

    // 6. Số lượng khách (pax)
    const paxMatch1 = fullText.match(/(\d+)\s*×\s*Adult/i) || fullText.match(/(\d+)\s*x\s*Adult/i);
    const paxMatch2 = fullText.match(/(\d+)\s*pax/i);
    const paxMatch3 = fullText.match(/(\d+)\s*k\b/i);
    const paxMatch4 = fullText.match(/cho c\s*(\d+)/i) || fullText.match(/gửi\s*(\d+)\s*bus/i);
    const paxMatch5 = fullText.match(/(\d+)\s*ghế/i);

    if (paxMatch1) pax = parseInt(paxMatch1[1], 10);
    else if (paxMatch2) pax = parseInt(paxMatch2[1], 10);
    else if (paxMatch3) pax = parseInt(paxMatch3[1], 10);
    else if (paxMatch4) pax = parseInt(paxMatch4[1], 10);
    else if (paxMatch5) pax = parseInt(paxMatch5[1], 10);

    // 7. SĐT
    const sdtMatches = fullText.match(/\+?\d{8,14}/g);
    if (sdtMatches) {
      for (const m of sdtMatches) {
        const clean = m.replace(/\D/g, '');
        if (clean.length >= 9 && clean.length <= 13 && !m.includes(':')) {
          phone = this.normalizePhone(m);
          break;
        }
      }
    }
    const explicitPhone = fullText.match(/(?:Số điện thoại|SĐT|lh)[\s:]*(\+?\d[\d\s\-]{8,15})/i);
    if (explicitPhone) {
      phone = this.normalizePhone(explicitPhone[1]);
    }

    // 8. Tên khách
    const passengersSection = fullText.match(/Các hành khách[\s\S]*?(?:Số điện thoại|SĐT|$)/i);
    const tenLabel = fullText.match(/(?:Tên|tên|TÊN)[\s:]*([A-Za-z\s]+?)(?:\s+\d+pax|\s*$|\n)/i);

    if (passengersSection) {
      // Bóc tên người đi đầu tiên (Lead passenger)
      const pLines = passengersSection[0].split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => 
          l && 
          !l.toLowerCase().includes('hành khách') && 
          !l.includes('×') && 
          !l.includes('x Adult') && 
          !l.toLowerCase().includes('adult') && 
          !l.toLowerCase().includes('số điện thoại') &&
          !this.isLocationLine(l)
        );
      if (pLines.length > 0) {
        customerNames.push(pLines[0]);
      }
    } else if (tenLabel) {
      customerNames.push(tenLabel[1].trim());
    } else {
      const adultNamed = fullText.match(/Adult\s+([A-Za-z\s]+?)(?:\s+\d+|\s*$)/i);
      const parenName = fullText.match(/\(([A-Za-z\s]+)\)/);
      const kName = fullText.match(/\d+k\s+([A-Za-z\s]+?)\s+\+/i);

      if (kName) {
        customerNames.push(kName[1].trim());
      } else if (adultNamed) {
        customerNames.push(adultNamed[1].trim());
      } else if (parenName && !fullText.includes('đối diện')) {
        customerNames.push(parenName[1].trim());
      } else {
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(l) && 
              !this.isLocationLine(l) &&
              !l.includes('Express') && !l.includes('Adult') && !l.includes('Thứ')) {
            customerNames.push(l);
          }
        }
      }
    }

    let customerString = customerNames.length > 0 ? customerNames[0] : 'Khách';
    if (phone && !customerString.includes(phone)) {
      customerString = `${customerString} ${phone}`.trim();
    }

    // 9. Giờ
    const explicitTime = fullText.match(/\b(\d{1,2}:\d{2}(?:am|pm)?)\b/i) || fullText.match(/\b(\d{1,2}h(?:\d{2})?)\b/i);
    if (explicitTime) {
      timeStr = explicitTime[1];
    }
    if (fullText.includes('9h')) timeStr = '9:00';
    if (fullText.includes('8:15') || fullText.includes('8h15')) timeStr = '8:15';

    pickupTime = this.calculatePickupTime(route, timeStr, vehicle, pickupPoint);

    const staff = operator || 'Felix';

    const zaloMsg = `${topMention}Thế Long Travel xác nhận booking
Đại lý             : ${agency}
Code               : ${code}
Ngày đi            : ${travelDate}
Lịch trình         : ${route}
Loại xe            : ${vehicle}
Số lượng khách     : ${pax}
Tên khách          : ${customerString}
Giờ đón            : ${pickupTime}
Điểm đón           : ${pickupPoint || 'The Long Travel'}
Điểm trả           : ${dropPoint || 'Văn phòng / Khách sạn'}
Giá vé             : ${price}
Note               : ${note}
Lưu ý              : Các điểm bao gồm đón bên em hẹn đón theo thời gian quy định đã hẹn nếu khách không chuẩn bị kịp thì đại lí báo khách tự đến văn phòng hộ bên e
${staff} xác nhận booking
Anh chị vui lòng check lại thông tin giúp em, em cảm ơn ạ`;

    const excel4Cols = `${pickupPoint || 'The Long Travel'}\t${dropPoint || 'Văn phòng / Khách sạn'}\t${customerString}\t${pax}`;

    return {
      topMention,
      agency,
      code,
      originalCode,
      travelDate,
      dayMonthKey,
      route,
      vehicle,
      pax,
      customerString,
      pickupTime,
      pickupPoint: pickupPoint || 'The Long Travel',
      dropPoint: dropPoint || 'Văn phòng / Khách sạn',
      price,
      note,
      staff,
      zaloMsg,
      excel4Cols,
      timeStr
    };
  }
};

const inputAAVP = `Tuan Chau Marina Hotel
The Long Travel
#AAVP9028
Thứ 4 25 thg 11 2026 · Express 16
11:00
Các hành khách
2 × Adult
Igor Ksiezopolski
Nikola Subocz
Số điện thoại: +48735977916`;

const r = BookingParser.parse(inputAAVP, 'SAEN');
console.log('=== TEST PARSER CHO TẤT CẢ TRƯỜNG CỦA AAVP9028 ===');
console.log('Đại lý:', r.agency);
console.log('Code:', r.code);
console.log('Ngày đi:', r.travelDate);
console.log('Lịch trình:', r.route);
console.log('Loại xe:', r.vehicle);
console.log('Số lượng khách:', r.pax);
console.log('Tên khách:', r.customerString);
console.log('Giờ đón:', r.pickupTime);
console.log('Điểm đón:', r.pickupPoint);
console.log('Điểm trả:', r.dropPoint);
console.log('\n--- FORM ZALO XUẤT RA ---');
console.log(r.zaloMsg);
console.log('\n--- 4 CỘT EXCEL ---');
console.log(r.excel4Cols);
