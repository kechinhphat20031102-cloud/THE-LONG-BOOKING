/**
 * parser.js - Bộ phân tích & bóc tách dữ liệu booking cho Thế Long Travel
 * Bóc tách ngoại tuyến theo quy tắc; cần kiểm tra thông tin trước khi xác nhận
 */

const BookingParser = {
  // Chuẩn hóa số điện thoại quốc tế
  normalizePhone(phoneStr) {
    if (!phoneStr) return '';
    let cleaned = phoneStr.trim().replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    if (cleaned.length >= 10 && !cleaned.startsWith('0')) {
      return '+' + cleaned;
    }
    if (cleaned.startsWith('0')) {
      return cleaned;
    }
    return cleaned ? '+' + cleaned : '';
  },

  // Kiểm tra một chuỗi có phải là địa điểm / khách sạn / bến xe không
  isLocationLine(str) {
    const s = (str || '').trim().toLowerCase();
    if (!s) return false;
    if (s.startsWith('route:') || s.startsWith('tuyến:')) return false;
    return /hotel|homestay|hostel|resort|villa|marina|travel|lodge|camp|retreat|văn phòng|cảng|bến|sân bay|ga tàu|đối diện/i.test(s) ||
           /tam coc|tuan chau|ha long|hạ long|ninh binh|ninh bình|cat ba|cát bà|mai chau|mai châu|pu luong|pù luông|núi ngọc|nui ngoc|hoa lư/i.test(s);
  },

  // Định dạng ngày thành code tlDDMMYY
  formatBookingCode(dateStr) {
    if (!dateStr) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yy = String(today.getFullYear()).slice(-2);
      return `tl${dd}${mm}${yy}`;
    }

    const dmyMatch = dateStr.match(/(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{2,4}))?/);
    if (dmyMatch) {
      const dd = dmyMatch[1].padStart(2, '0');
      const mm = dmyMatch[2].padStart(2, '0');
      let yy = dmyMatch[3] || String(new Date().getFullYear());
      if (yy.length === 4) yy = yy.slice(-2);
      return `tl${dd}${mm}${yy}`;
    }

    return 'tl' + new Date().toISOString().slice(2, 10).replace(/-/g, '');
  },

  // Tính giờ đón theo quy tắc Thế Long Travel (15-30 phút)
  calculatePickupTime(route, timeStr, vehicleType, pickupPoint = '') {
    const rLower = (route || '').toLowerCase();
    const tLower = (timeStr || '').toLowerCase();
    const vLower = (vehicleType || '').toLowerCase();
    const pLower = (pickupPoint || '').toLowerCase();

    // 1. Tuyến Cát Bà
    if (rLower.includes('cát bà') || rLower.includes('cat ba') || rLower.includes('cb')) {
      // Chiều Cát Bà về Ninh Bình
      if (rLower.includes('cb - nb') || rLower.includes('cb-nb') || rLower.includes('cát bà - ninh bình')) {
        if (tLower.includes('8:15') || tLower.includes('8h15') || tLower.includes('8h') || tLower.includes('8:00') || tLower.includes('08:00')) {
          return '8:00 - 8:15';
        }
        if (tLower.includes('12h30') || tLower.includes('12:30')) {
          return '12:00 - 12:30';
        }
        if (tLower.includes('15h30') || tLower.includes('15:30')) {
          return '15:00 - 15:30';
        }
        return '8:00 - 8:30';
      }

      // Chiều Ninh Bình đi Cát Bà
      if (tLower.includes('7:00') || tLower.includes('07:00') || tLower.includes('7h')) {
        return '6:30 - 7:00';
      }
      if (tLower.includes('9:30') || tLower.includes('9h30') || tLower.includes('09:30')) {
        if (pLower.includes('the long') || pLower.includes('the long hotel')) {
          return '8:35 - 9:35';
        }
        return '9:00 - 9:35';
      }
      if (tLower.includes('9h') || tLower.includes('9:00') || tLower.includes('09:00')) {
        return '9:00 - 9:15';
      }
      if (tLower.includes('13:30') || tLower.includes('13h30')) {
        return '13:00 - 13:30';
      }
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
        if (pLower.includes('tam coc') || pLower.includes('axasola')) {
          return '6:40 - 7:00';
        }
        return '6:30 - 7:30';
      }
      return '6:30 - 7:30';
    }

    // 3. Mai Châu - Pù Luông
    if (rLower.includes('mai châu') || rLower.includes('mai chau') || rLower.includes('mc') ||
        rLower.includes('pù luông') || rLower.includes('pu luong') || rLower.includes('pl')) {
      if (rLower.includes('pu luong to ninh binh') || rLower.includes('pl - nb') || rLower.includes('pl nb') || rLower.includes('mc - nb')) {
        if (tLower.includes('07:20') || tLower.includes('7:20')) {
          return '7:00 - 7:20';
        }
        if (tLower.includes('13:00') || tLower.includes('13:30')) {
          return '12:45 - 13:00';
        }
        return '13:00 - 13:30';
      }
      if (tLower.includes('13:00') || tLower.includes('13h')) {
        return '12:45 - 13:00';
      }
      return '7:30 - 7:50';
    }

    // 4. Tour
    if (rLower.includes('tour') || (pLower.includes('tour'))) {
      if (rLower.includes('4 điểm') || tLower.includes('8:00') || tLower.includes('8h')) {
        return '8:00 - 8:30';
      }
      if (rLower.includes('vl cp') || tLower.includes('7:20')) {
        return '7:20 - 7:50';
      }
      if (rLower.includes('cp') || tLower.includes('8:45')) {
        return '8:45 - 9:10';
      }
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

  isPassengerHeader(line) {
    const text = line.trim().toLowerCase();
    return /^(?:tên|name|fare|quốc tịch|nationality|ticket\s*\/\s*seat|ticket|seat)$/.test(text) ||
      /^(?:tên|name)/.test(text) && /fare|quốc tịch|nationality|ticket|seat/.test(text);
  },

  // Hàm trích xuất chính
  parse(rawText, operator = 'Felix') {
    if (!rawText || !rawText.trim()) return null;
    rawText = rawText.normalize('NFC').replace(/[\u00a0\u202f]/g, ' ').replace(/[\u200b\ufeff]/g, '');

    // Normalize common labels before extraction, without changing their values.
    const aliases = {'date':'Ngày','name':'Tên','phone':'Số điện thoại','passengers':'Số người','pickup time':'Giờ đón','pickup':'Điểm đón','drop-off':'Điểm trả','dropoff':'Điểm trả'};
    let fullText = rawText.replace(/^(date|name|phone|passengers|pickup time|pickup|drop-off|dropoff)[ \t]*:/gim, (_, label) => aliases[label.toLowerCase()] + ':');
    fullText = fullText
      .replace(/BUFF\\ALO/gi, 'BUFFALO')
      .replace(/BUFFALO HOSTE(?!L)/gi, 'BUFFALO HOSTEL')
      .replace(/(\d{1,2});(\d{2})(?=\s*(?:AM|PM))/gi, '$1:$2')
      .replace(/(\d{1,2})-(\d{1,2})-(\d{4})/g, '$1/$2/$3')
      .replace(/[ \t]*\/[ \t]*(?=\s*(?:ngày|\d+\s*khách|đón|trả))/gi, '\n')
      .replace(/\s*\/\s+(?=[\p{L}+0-9])/gu, '\n')
      .replace(/^[ \t]*(?:Departure station)[ \t]*:/gim, 'Đón:')
      .replace(/^[ \t]*(?:Arrival station)[ \t]*:/gim, 'Trả:')
      .replace(/Tên hành khách/gi, 'Tên khách')
      .replace(/Số lượng hành khách|SL khách/gi, 'Số lượng khách')
      .replace(/(\d{1,2})\s*(?::(\d{2}))?\s*(AM|PM)\b/gi, (_, h, m, ap) => `${(Number(h) % 12) + (/pm/i.test(ap) ? 12 : 0)}:${m || '00'}`);
    const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    let agency = '';
    let code = '';
    let travelDate = '';
    let dayMonthKey = ''; // ví dụ '24/11'
    let route = '';
    let vehicle = 'Bus';
    let pax = '';
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

    // 1. Nhận diện ngày đi & Key ngày
    const dateMatch1 = fullText.match(/(\d{1,2})\s*(?:thg|tháng)\s*(\d{1,2})(?:\s*(?:năm\s*)?(\d{4}))?/i);
    const dateMatch2 = fullText.match(/(?:ngày|ngay)?\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i);
    const maiMatch = fullText.match(/(?:^|\s)(?:ngày mai|trưa mai|sáng mai|mai)(?!\s+ch[aâ]u)(?=\s|[,!.]|$)/i);

    if (dateMatch1) {
      const dd = dateMatch1[1].padStart(2, '0');
      const mm = dateMatch1[2].padStart(2, '0');
      const yyyy = dateMatch1[3] || String(new Date().getFullYear());
      travelDate = `${dd}/${mm}/${yyyy}`;
      dayMonthKey = `${parseInt(dd, 10)}/${parseInt(mm, 10)}`;
      code = `tl${dd}${mm}${yyyy.slice(-2)}`;
    } else if (dateMatch2) {
      const dd = dateMatch2[1].padStart(2, '0');
      const mm = dateMatch2[2].padStart(2, '0');
      let yyyy = dateMatch2[3] || String(new Date().getFullYear());
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
      travelDate = '';
      dayMonthKey = '';
      code = '';
    }

    // 2. Trích xuất Mã đặt chỗ / Code riêng nếu có
    const specificCode = fullText.match(/(?:CODE|Code|Mã đặt chỗ|Mã vé)[\s:]*([A-Za-z0-9]+)/i);
    let originalCode = '';
    if (specificCode) {
      originalCode = specificCode[1].trim();
    }

    // 3. Đại lý
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

    // 4. Điểm đón & Điểm trả
    const locationText = fullText.replace(/(?:Thời gian đón|Giờ đón)[ \t]*:[^\r\n]*?(?=\s+(?:Địa điểm|Điểm)\s+(?:đón|trả)|[\r\n]|$)/gi, '');
    const donMatch = locationText.match(/(?:đón|Đón|ĐÓN|Khởi hành tại|Điểm khởi hành)[\s:]*([^\n\r]+?)(?=\s+(?:trả|đón|tên|SĐT|Số điện thoại|Các hành khách|\d+\s*pax)(?=[\s:]|$)|[\n\r]|$)/i);
    if (donMatch) {
      pickupPoint = donMatch[1].replace(/^\d{1,2}:\d{2}\s*-\s*/, '').trim();
    }

    const traMatch = locationText.match(/(?:trả|Trả|TRẢ|Điểm đến)[\s:]*([^\n\r]+?)(?=\s+(?:trả|đón|tên|SĐT|Số điện thoại|Các hành khách|\d+\s*pax)(?=[\s:]|$)|[\n\r]|$)/i);
    if (traMatch) {
      dropPoint = traMatch[1].replace(/^\d{1,2}:\d{2}\s*-\s*/, '').trim();
    }

    // Nếu không có từ khóa đón/trả rõ ràng (như voucher 12Go: dòng 1 là đón, dòng 2 là trả)
    if (!pickupPoint || !dropPoint) {
      const locCandidates = lines.filter(l => 
        this.isLocationLine(l) &&
        !/^(?:Thời gian đón|Giờ đón|Địa điểm đón|Địa điểm trả|Điểm đón|Điểm trả|Đón|Trả)\s*:/i.test(l) &&
        !l.toLowerCase().startsWith('route:') &&
        !l.toLowerCase().startsWith('tuyến:') &&
        !l.includes('·') &&
        !l.includes('Express') &&
        !l.startsWith('#') &&
        !l.match(/^\d{1,2}:\d{2}/) &&
        !l.match(/^\d{1,2}h/) &&
        !l.match(/^\d+m\b/) &&
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

    // Nếu message ngắn 1 dòng nội bộ (kiểu "Mai cho c 2 cát bà 9h") không có location thực sự
    // → điểm đón = tên đại lý (chỉ áp dụng khi text 1 dòng và pickupPoint là chính message gốc)
    if (agency && agency !== 'Đại lý đối tác' && pickupPoint && fullText.trim() === pickupPoint.trim()) {
      pickupPoint = agency;
    }
    if (!pickupPoint && agency && agency !== 'Đại lý đối tác' && lines.length <= 1) {
      pickupPoint = agency;
    }

    pickupPoint = pickupPoint.replace(/^(?:khách\s+)?tại\s+/i, '').replace(/\/+$/, '').trim();
    const transferPickup = fullText.match(/TC Đón:[ \t]*\r?\n([^\r\n]+)/i);
    if (/^\d{1,2}:\d{2}$/.test(pickupPoint) && transferPickup) pickupPoint = transferPickup[1].trim();
    if (/^\d+(?:\s*pax|\s*khách)|^\d{1,2}:\d{2}/i.test(pickupPoint)) pickupPoint = '';
    // 5. Lịch trình (Route)
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
    } else if (fullText.match(/Ninh Bình - Cát Bà|NB\s*-\s*CB/i) || (/cát bà|cat ba/i.test(fullText) && !/cát bà|cat ba/i.test(pickupPoint))) {
      route = 'NB - CB';
    } else if (fullText.match(/HL - NB|Hạ Long - Ninh Bình|hl nb/i)) {
      route = 'HL - NB';
    } else if (fullText.match(/NB - HL|Ninh Bình - Hạ Long/i) || fullText.includes('cảng sun')) {
      route = 'NB - HL';
    } else {
      // Tự động suy luận tuyến đường từ Điểm đón & Điểm trả
      const pLow = (pickupPoint || '').toLowerCase();
      const dLow = (dropPoint || '').toLowerCase();
      if ((pLow.includes('tuan chau') || (pLow.includes('ha long') || pLow.includes('halong')) || pLow.includes('hạ long')) &&
          (dLow.includes('the long') || dLow.includes('ninh binh') || dLow.includes('ninh bình') || dLow.includes('tam coc'))) {
        route = 'HL - NB';
      } else if ((pLow.includes('the long') || pLow.includes('ninh binh') || pLow.includes('ninh bình') || pLow.includes('tam coc')) &&
                 (dLow.includes('tuan chau') || (dLow.includes('ha long') || dLow.includes('halong')) || dLow.includes('hạ long'))) {
        route = 'NB - HL';
      } else if (pLow.includes('mai chau') || dLow.includes('mai chau')) {
        route = pLow.includes('mai chau') ? 'MC - NB' : 'nb mc';
      } else if (pLow.includes('pu luong') || dLow.includes('pu luong')) {
        route = pLow.includes('pu luong') ? 'PL - NB' : 'NB - PL';
      } else if (pLow.includes('cat ba') || dLow.includes('cat ba') || pLow.includes('cát bà') || dLow.includes('cát bà')) {
        route = pLow.includes('cat ba') || pLow.includes('cát bà') ? 'CB - NB' : 'NB - CB';
      } else {
        route = 'NB';
      }
    }

    const routeText = fullText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    if (/catba\s*-\s*ninh binh/.test(routeText)) route = 'CB - NB';
    if (/ninh binh\s*-\s*puluong|di pu luong/.test(routeText)) route = 'NB - PL';
    if (/hoa binh to tam coc/.test(routeText)) route = 'MC - NB';
    if (/tour cuc phuong/.test(routeText)) route = 'CÚC PHƯƠNG';
    if (/home\s*-\s*sapa/.test(routeText)) route = 'NB - SAPA';
    if (/cầu giấy|phố cổ/i.test(dropPoint) && !/hoa lư/i.test(dropPoint)) route = 'NB - HN';
    if (/cầu giấy/i.test(pickupPoint)) route = 'HN - NB';
    if (/Indochine/i.test(pickupPoint) && /PARAGON/i.test(dropPoint)) route = 'NB - HN';

    // 6. Loại xe
    if (route === 'HL - NB' || route === 'hl nb') {
      vehicle = fullText.match(/limo|limousine/i) ? 'LIMO' : 'Bus';
    } else if (route === 'nb mc') {
      vehicle = fullText.match(/Express 16|\b16\s*(?:chỗ|cho|seats)/i) ? '16' : (fullText.match(/limo/i) ? 'LIMO' : 'Bus');
    } else if (fullText.match(/Express 16/i)) {
      vehicle = (route === 'NB - PL' && !fullText.includes('AAVP')) ? 'minivan' : 'Express 16';
    } else if (fullText.match(/(?:xe|loại xe)\s*:?\s*16\b|\b16\s*(?:chỗ|cho|seats)/i)) {
      vehicle = '16';
    } else if (fullText.match(/LIMO|limousine/i) || fullText.includes('cảng sun')) {
      vehicle = 'LIMO';
    } else if (fullText.match(/minivan/i)) {
      vehicle = 'minivan';
    } else {
      vehicle = 'Bus';
    }

    // 7. Số lượng khách (pax)
    const labeledPax = fullText.match(/(?:Số người|Số lượng khách|Số khách)[ \t]*:[ \t]*(\d+)/i);
    const paxMatch1 = fullText.match(/(\d+)\s*×\s*Adult/i) || fullText.match(/(\d+)\s*x\s*Adult/i);
    const paxMatch2 = fullText.match(/(\d+)\s*pax/i);
    const paxMatch3 = fullText.match(/(\d+)\s*k\b/i);
    const paxMatch4 = fullText.match(/cho c\s*(\d+)/i) || fullText.match(/gửi\s*(\d+)\s*bus/i);
    const paxMatch5 = fullText.match(/(\d+)\s*(?:khách|vé|v\b|ghế)/i);

    if (labeledPax) pax = parseInt(labeledPax[1], 10);
    else if (paxMatch1) pax = parseInt(paxMatch1[1], 10);
    else if (paxMatch2) pax = parseInt(paxMatch2[1], 10);
    else if (paxMatch5) pax = parseInt(paxMatch5[1], 10);
    else if (paxMatch3 && !/(?:thu|giá|hộ)[^\n]*\d+\s*k/i.test(fullText)) pax = parseInt(paxMatch3[1], 10);
    else if (paxMatch4) pax = parseInt(paxMatch4[1], 10);
    else if (paxMatch5) pax = parseInt(paxMatch5[1], 10);

    // 8. SĐT
    const internationalPhone = fullText.match(/\+\d[\d ()-]{7,}\d/);
    if (internationalPhone) phone = this.normalizePhone(internationalPhone[0]);
    const standalonePhone = fullText.match(/(?:^|\n)[ \t]*(\+?\d[\d ()-]{7,}\d)[ \t]*(?=\n|$)/);
    if (standalonePhone) phone = this.normalizePhone(standalonePhone[1]);
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
    const explicitPhone = fullText.match(/(?:Số điện thoại|SĐT|SDT|Phone|WS|lh)[\s:]*(\+?\d[\d \t().\-]*\d)/i);
    if (explicitPhone) {
      phone = this.normalizePhone(explicitPhone[1]);
    }

    // 9. Tên khách
    const passengersSection = fullText.match(/(?:Các hành khách|Passengers)[\s\S]*?(?:Số điện thoại|SĐT|Phone|$)/i);
    const tenLabel = fullText.match(/(?:Tên khách|Tên)[\s:]*([^\n\r]+?)(?=\s+(?:\d+\s*pax|trả|đón|SĐT|Số điện thoại)|[\n\r]|$)/i);

    if (passengersSection) {
      // Lấy tên người đi đầu tiên (Lead passenger)
      const pLines = passengersSection[0].replace(/Các hành khách|Passengers/gi, '').replace(/\d+\s*[×x]\s*Adult/gi, '').replace(/\+?\d[\d -]{7,}/g, '').split(/\r?\n|,/)
        .map(l => l.trim())
        .map(l => this.isPassengerHeader(l) ? '' : l.split(/\t+| {2,}|\s*\|\s*/)[0].trim())
        .filter(l => 
          l && 
          !this.isPassengerHeader(l) &&
          !l.toLowerCase().includes('hành khách') && 
          !l.includes('×') && 
          !l.includes('x Adult') && 
          !l.toLowerCase().includes('adult') && 
          !l.toLowerCase().includes('số điện thoại') &&
          !this.isLocationLine(l)
        );
      if (pLines.length > 0) {
        customerNames.push(pLines[0].split(/\t+| {2,}|\s*\|\s*/)[0].trim());
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
          if (/^[\p{Lu}][\p{L}'’-]+(\s+[\p{Lu}][\p{L}'’-]+)+$/u.test(l) && 
              !this.isLocationLine(l) &&
              !l.includes('Express') && !l.includes('Adult') && !l.includes('Thứ')) {
            customerNames.push(l);
          }
        }
      }
    }

    // English itinerary vouchers put a lead passenger below the Adult count.
    // Use that position, not capitalization or a memorized passenger name.
    if (!customerNames.length) {
      const countIndex = lines.findIndex(line => /^Adult\s*:\s*\d+\s*pax\s*$/i.test(line));
      if (countIndex >= 0) {
        const lead = lines.slice(countIndex + 1).find(line => !this.isPassengerHeader(line) && !/^[-—]+$/.test(line));
        if (lead && !/^(?:phone|email|e-mail|sđt|số điện thoại)\b/i.test(lead) &&
            !this.isLocationLine(lead) && !/[:@]|\d{4}/.test(lead)) customerNames.push(lead);
      }
    }

    customerNames = customerNames.map(name => name.replace(/\s+[xX]\s*$/, '').replace(/[. ]*\s+ạ\s*$/, '').replace(/\.$/, '').trim());
    let customerString = customerNames.length > 0 ? customerNames[0] : 'Khách';
    if (phone && !customerString.replace(/[^\d]/g, '').includes(phone.replace(/\D/g, ''))) {
      customerString = `${customerString} ${phone}`.trim();
    }

    // A labeled pickup time is already an appointment, not a departure time.
    const pickupLabel = fullText.match(/(?:Thời gian đón|Giờ đón)[ \t]*:[ \t]*([^\r\n]+)/i);
    const explicitTime = fullText.match(/\b(\d{1,2}:\d{2}(?:am|pm)?)\b/i) || fullText.match(/\b(\d{1,2}h(?:\d{2})?)\b/i);
    if (explicitTime) timeStr = explicitTime[1];
    if (/^\d{1,2}h/i.test(timeStr)) timeStr = timeStr.replace(/h(\d{2})?/i, (_, m) => ':' + (m || '00'));
    if (pickupLabel) {
      // Preserve approximate/range wording supplied by the operator.
      pickupTime = pickupLabel[1].trim();
    } else {
      pickupTime = timeStr || /trưa/i.test(fullText) ? this.calculatePickupTime(route, timeStr || 'trưa', vehicle, pickupPoint) : '';
    }

    // Dataset-derived rules apply to the route/source pattern, never a passenger's identity.
    if (/FAMILY HOME CATBA/i.test(pickupPoint)) {
      agency = `FAMILY HOME BUS${originalCode ? ' ' + originalCode : ''}`;
      if (timeStr === '12:00') pickupTime = '12:00 - 12:20';
      dropPoint = /PHONG NHA/i.test(fullText) ? '60 Trần Nhân Tông (nối Phong Nha chuyến 20:00)' : (dropPoint || 'Tam Coc');
      vehicle = /CABIN 20/i.test(fullText) ? 'bus + VIP 20' : 'Bus';
    }
    if (/Hoa Binh to Tam Coc/i.test(fullText)) {
      vehicle = 'MINIVAN';
      if (timeStr === '13:30') pickupTime = '13:00 - 13:20';
    }
    if (/Departure station:/i.test(rawText) && /mai châu|mai chau/i.test(fullText)) {
      vehicle = 'MINIVAN';
      if (timeStr === '08:00' || timeStr === '8:00') pickupTime = '7:45 - 8:00';
    }
    if (route === 'nb mc' && timeStr === '13:30') { vehicle = 'MINIVAN'; pickupTime = '12:45 - 13:00'; }
    if (route === 'CÚC PHƯƠNG') { vehicle = 'minivan'; pickupTime = '8:45 - 9:10'; }
    if (/The Luna hostel/i.test(pickupPoint) && route === 'NB - CB' && timeStr === '13:30') pickupTime = '12:45 - 13:00';
    if (route === 'NB - HN' && /Hang Múa Eco Garden/i.test(pickupPoint)) {
      agency = pickupPoint; vehicle = 'LIMO';
      if (timeStr === '20:00') pickupTime = '19:45 - 20:15';
    }
    if (route === 'HN - NB' && /cầu giấy/i.test(pickupPoint)) { vehicle = 'LIMO'; if (timeStr === '14:00') pickupTime = '13:10'; }
    if (/Indochine/i.test(pickupPoint) && route === 'NB - HN') { agency = pickupPoint; if (pickupTime === '17:00') pickupTime = '17:00 - 17:30'; }
    if (/Quang Ninh to Tam Coc/i.test(fullText) && timeStr === '12:30') pickupTime = '11:45 - 12:10';
    const noteLine = fullText.match(/^(?:note|ghi chú)[ \t]*:[ \t]*([^\r\n]+)/im);
    if (noteLine) note = noteLine[1].trim();
    const collect = fullText.match(/(?:thu hộ|thu khách|note thu)\s*\d+[.,\d]*\s*k/i);
    if (collect) note = collect[0];
    if (route === 'CB - NB' && !timeStr && /trưa/i.test(fullText)) pickupTime = '12:00 - 12:30';
    const leadContact = fullText.match(/\d+\s*k\s*[-–]?\s*([^\r\n+]+?)\s*(\+\d[\d -]+)/i);
    if (leadContact && !/đón|chuyến|ngày|\d{1,2}h/i.test(leadContact[1])) customerString = `${leadContact[1].trim()} ${this.normalizePhone(leadContact[2])}`;
    if (/hỏi khách điểm trả/i.test(fullText)) { dropPoint = ''; note += ' / Hỏi khách điểm trả'; }

    if (/bến Bèo/i.test(pickupPoint)) {
      const handoff = fullText.match(/^HD[^\r\n]+giao khách/im);
      if (handoff) pickupPoint += ` (${handoff[0].trim()})`;
    }
    if (/ks Phương Phương/i.test(pickupPoint)) {
      pickupPoint = pickupPoint.replace(/\s*\+\d[\d ]*$/, '').trim();
      route = 'CB - NB';
      if (timeStr === '9:00' || timeStr === '09:00') pickupTime = '7:45 - 8:00';
    }
    if (/Tuần Châu/i.test(pickupPoint) && /ninh binh|ninh bình/i.test(fullText)) {
      route = 'HL - NB';
      if (timeStr === '12:00') pickupTime = '11:45 - 12:15';
      if (/báo điểm trả sau/i.test(fullText)) dropPoint = 'Ninh Bình (báo sau)';
    }
    if (/bến thuyền tràng an/i.test(fullText)) {
      route = 'taxi tràng an - nb'; vehicle = '7c'; pickupPoint = 'bến thuyền tràng an'; pickupTime = timeStr;
      const stops = lines.filter(line => /\d+\s*pax\s+(?:về|trả)/i.test(line));
      if (stops.length) dropPoint = stops.join('; ');
    }
    if (route === 'NB - PL' && /chiều/i.test(fullText) && !timeStr) pickupTime = '13:00 - 13:30';
    if (route === 'NB - PL' && /^Đón\s+13:00/im.test(fullText)) pickupTime = '13:00 - 13:30';
    if (/VNEG\d+/i.test(fullText) && route === 'nb mc') { vehicle = 'MINIVAN'; pickupTime = '12:45 - 13:00'; }
    if (/home lên phố cổ/i.test(fullText)) {
      route = 'NB - HN'; pickupPoint = 'home (cần địa chỉ)'; dropPoint = 'phố cổ (địa chỉ báo sau)';
    }
    if (route === 'NB - SAPA' && /22\s*cabin/i.test(fullText) && timeStr === '22:30') {
      vehicle = 'Cabin 22 phòng'; pickupTime = '19:00 (về văn phòng, chuyến 22:30)'; dropPoint = 'Sa Pa';
      const room = customerString.match(/,?\s*p\s*(\d+)$/i);
      if (room) {
        customerString = customerString.replace(/,?\s*p\s*\d+$/i, ` (P.${room[1]})`);
        pickupPoint = `P.${room[1]} (về văn phòng Thế Long đợi xe)`;
      }
      note += ' / Xe đón 19:00 về văn phòng Thế Long đợi chuyến 22:30';
    }
    const warnings = [];
    if (!travelDate) warnings.push('Chưa có ngày đi');
    if (!pickupPoint) warnings.push('Chưa có điểm đón');
    if (!dropPoint) warnings.push('Chưa có điểm trả');
    if (!pax) warnings.push('Chưa rõ số khách');
    if (customerString.startsWith('Khách')) warnings.push('Chưa có tên khách');
    if (!pickupTime) warnings.push('Chưa rõ giờ đón');
    if (/BUFFALO/i.test(pickupPoint) && timeStr === '15:30') warnings.push('Dataset có hai giờ đón chuyến 15:30; đang dùng 15:00 - 15:30, cần kiểm tra');
    if (/BUFFALO/i.test(pickupPoint) && /^(?:0?8:15)$/.test(timeStr)) warnings.push('Dataset hẹn từ 7:45; quy tắc cũ từ 8:00. Cần xác nhận giờ đón');

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
Điểm đón           : ${pickupPoint || ''}
Điểm trả           : ${dropPoint || ''}
Giá vé             : ${price}
Note               : ${note}
Lưu ý              : Các điểm bao gồm đón bên em hẹn đón theo thời gian quy định đã hẹn nếu khách không chuẩn bị kịp thì đại lí báo khách tự đến văn phòng hộ bên e
${staff} xác nhận booking
Anh chị vui lòng check lại thông tin giúp em, em cảm ơn ạ`;

    const excel4Cols = `${pickupPoint || ''}\t${dropPoint || ''}\t${customerString}\t${pax}`;

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
      pickupPoint: pickupPoint || '',
      dropPoint: dropPoint || '',
      price,
      note,
      staff,
      zaloMsg,
      excel4Cols,
      timeStr,
      warnings
    };
  }
};

if (typeof module !== 'undefined') module.exports = BookingParser;
if (typeof window !== 'undefined') if (typeof module !== "undefined") module.exports = BookingParser; if (typeof window !== "undefined") if (typeof module !== "undefined") module.exports = BookingParser; if (typeof window !== "undefined") if (typeof module !== "undefined") module.exports = BookingParser; if (typeof window !== "undefined") if (typeof module !== "undefined") module.exports = BookingParser; if (typeof window !== "undefined") window.BookingParser = BookingParser;
