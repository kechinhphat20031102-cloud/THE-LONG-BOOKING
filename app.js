/**
 * app.js – THẾ LONG TRAVEL
 * Layout: Trên = Input | Zalo form   |  Dưới = Đối soát | Danh sách booking
 */

const SHEET_ID = '1wOAcBhlmhc7K89sbl1Jy9ijvktfdhW8rCtb5s6hOLaw';
const SHEET_TABS = {
  '1/11':  '1745536383', '2/11':  '1241195770', '3/11':  '712710281',
  '4/11':  '1887518525', '5/11':  '468892901',  '6/11':  '2020007964',
  '7/11':  '1426234889', '8/11':  '1436927344', '9/11':  '1379227434',
  '10/11': '1241257705', '11/11': '1089870617', '12/11': '1987604536',
  '13/11': '1498124567', '14/11': '1359927923', '15/11': '2009230870',
  '16/11': '1954679918', '17/11': '1437711105', '18/11': '537823561',
  '19/11': '1952044156', '20/11': '1532329041', '21/11': '148473742',
  '22/11': '316902882',  '23/11': '1300805401', '24/11': '1330423694',
  '25/11': '1693044512', '26/11': '132902633',  '27/11': '716026577',
  '28/11': '832538288',  '29/11': '756075368',  '30/11': '2127971404'
};

// --- State ---
let currentTabKey          = '24/11';
let currentParsedResult    = null;
let liveSheetRows          = [];
let pendingSearchAfterLoad = false;
let pendingCheckBookingId  = null;

// Danh sách booking đã xác nhận
let confirmedBookings = [];
let nextBookingId     = 1;

// ============================================================
document.addEventListener('DOMContentLoaded', async () => {

  // --- DOM refs ---
  let sourceForExample = '';
  let currentDraft = { bookingId: null };
  let copyingZalo = false;
  let historyWritable = true;
  let selectedHistoryDay = BookingHistory.day();
  try {
    await BookingHistory.initialize();
    confirmedBookings = BookingHistory.load();
    nextBookingId = Math.max(0, ...confirmedBookings.map(b => b.id)) + 1;
  } catch (error) {
    historyWritable = false;
    document.getElementById('historySaveStatus').textContent = error.message;
  }
  const rawInput         = document.getElementById('rawInput');
  const btnCreateZalo    = document.getElementById('btnCreateZalo');
  const btnRunCheck      = document.getElementById('btnRunCheck');
  const btnClearInput    = document.getElementById('btnClearInput');
  const operatorSelect   = document.getElementById('operatorSelect');
  const tabSelect        = document.getElementById('tabSelect');
  const outputZalo       = document.getElementById('outputZalo');
  const btnCopyZalo      = document.getElementById('btnCopyZalo');
  const outputExcel      = document.getElementById('outputExcel');
  const btnCopyExcel     = document.getElementById('btnCopyExcel');

  const checkResultBox   = document.getElementById('checkResultBox');
  const checkResultIcon  = document.getElementById('checkResultIcon');
  const checkResultTitle = document.getElementById('checkResultTitle');
  const checkResultDesc  = document.getElementById('checkResultDesc');

  const sheetStatusDot   = document.getElementById('sheetStatusDot');
  const sheetStatusText  = document.getElementById('sheetStatusText');

  const confirmedList    = document.getElementById('confirmedList');
  const confirmedCount   = document.getElementById('confirmedCount');
  const emptyState       = document.getElementById('emptyState');
  const btnClearAll      = document.getElementById('btnClearAll');

  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  const btnQuickGuide    = document.getElementById('btnQuickGuide');
  const modalGuide       = document.getElementById('modalGuide');
  const btnCloseModal    = document.getElementById('btnCloseModal');
  const btnCloseModalBtn = document.getElementById('btnCloseModalBtn');

  // ===== UTILS =====
  function showToast(msg, ok = true) {
    toastMsg.textContent = msg;
    toast.className = `fixed bottom-5 right-5 ${ok ? 'bg-slate-900' : 'bg-rose-900'} text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 transform translate-y-0 opacity-100 transition duration-300 z-50`;
    setTimeout(() => {
      toast.className = 'fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 transform translate-y-20 opacity-0 transition duration-300 z-50';
    }, 2800);
  }

  async function copyText(text, msg) {
    if (!text || !text.trim()) { showToast('Không có dữ liệu để sao chép!', false); return false; }
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); showToast(msg); return true; }
    } catch (_) { /* Use the browser's legacy copy mechanism if available. */ }
    return fallbackCopy(text, msg);
  }

  function fallbackCopy(text, msg) {
    const ta = document.createElement('textarea');
    try {
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      if (!document.execCommand('copy')) throw new Error('Copy failed');
      showToast(msg); return true;
    } catch (_) {
      showToast('Không sao chép được. Booking chưa được xác nhận; hãy thử lại.', false);
      return false;
    } finally { ta.remove(); }
  }


  // ===== TAB SELECT =====
  function initTabSelect() {
    tabSelect.innerHTML = '';
    Object.keys(SHEET_TABS).sort((a, b) => parseInt(a) - parseInt(b)).forEach(k => {
      const o = document.createElement('option');
      o.value = k; o.textContent = k;
      if (k === currentTabKey) o.selected = true;
      tabSelect.appendChild(o);
    });
  }

  // ===== GOOGLE SHEET JSONP =====
  window.onGoogleSheetDataLoaded = function(json) {
    try {
      if (!json?.table?.rows) throw new Error('Empty');
      const rows = json.table.rows;
      const row1 = (rows[1]?.c || []).map(c => c?.v || '');
      const row3 = (rows[3]?.c || []).map(c => c?.v || '');
      const row5 = (rows[5]?.c || []).map(c => c?.v || '');

      // Tìm các khối booking (cột ĐẠI LÝ)
      const blocks = [];
      for (let c = 0; c < row5.length; c++) {
        if (String(row5[c] || '').toUpperCase().includes('ĐẠI LÝ')) {
          let t1 = '', t3 = '';
          for (let o = -2; o <= 3; o++) {
            const i = c + o;
            if (i >= 0 && row1[i] && !t1) t1 = String(row1[i]).trim();
            if (i >= 0 && row3[i] && !t3) t3 = String(row3[i]).trim();
          }
          let title = `${t1} - ${t3}`.replace(/LỆNH ĐIỀU XE /gi,'').replace(/: NGÀY \d+.*$/i,'').trim();
          title = title.replace(/CHỐT KM ĐI.*(CHUYẾN)/i,'$1').trim() || 'Chuyến';
          blocks.push({ colStart: c, title });
        }
      }

      const extracted = [];
      let gid = 1;
      for (let r = 6; r < rows.length; r++) {
        const cells = rows[r].c || [];
        for (const b of blocks) {
          const cs = b.colStart;
          if (cs >= cells.length) continue;
          const agency   = String(cells[cs]?.v   || '').trim();
          const pickup   = String(cells[cs+1]?.v || '').trim();
          const drop     = String(cells[cs+2]?.v || '').trim();
          const customer = String(cells[cs+3]?.v || '').trim();
          const paxRaw   = String(cells[cs+4]?.v || '').trim();
          const note     = String(cells[cs+5]?.v || '').trim();
          const up = agency.toUpperCase();
          if (agency && !up.includes('TỔNG') && !up.includes('ĐẠI LÝ') && !up.includes('YÊU CẦU') && !up.includes('VỀ 12H')) {
            let pax = parseInt(paxRaw.replace(/\D/g,''), 10) || 1;
            if (pax > 50) pax = 1;
            extracted.push({ id: gid++, trip: b.title, agency, pickupPoint: pickup, dropPoint: drop, customer, pax, note });
          }
        }
      }

      liveSheetRows = extracted;
      sheetStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400';
      sheetStatusText.textContent = `Sheet ${currentTabKey}: ${extracted.length} cuốc xe`;
      showToast(`🟢 Đã nạp ${extracted.length} cuốc xe ngày ${currentTabKey}`);

      // Nếu đang chờ đối soát sau khi load tab
      if (pendingSearchAfterLoad) {
        pendingSearchAfterLoad = false;
        if (pendingCheckBookingId !== null) {
          const bk = confirmedBookings.find(b => b.id === pendingCheckBookingId);
          pendingCheckBookingId = null;
          if (bk) performCrossCheck(bk);
        } else {
          performCrossCheck(null);
        }
      }
    } catch(e) {
      console.error('JSONP error:', e);
      sheetStatusDot.className = 'w-2 h-2 rounded-full bg-rose-400';
      sheetStatusText.textContent = `Lỗi tải ngày ${currentTabKey}`;
      showToast('Không thể tải Google Sheet!', false);
      pendingSearchAfterLoad = false;
      pendingCheckBookingId = null;
    }
  };

  function loadSheetTab(tabKey) {
    currentTabKey = tabKey;
    const gid = SHEET_TABS[tabKey] || '1330423694';
    sheetStatusDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
    sheetStatusText.textContent = `Đang tải ngày ${tabKey}...`;
    const existing = document.getElementById('gviz-jsonp-script');
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.id  = 'gviz-jsonp-script';
    s.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=responseHandler:onGoogleSheetDataLoaded&gid=${gid}&_=${Date.now()}`;
    s.onerror = () => {
      sheetStatusDot.className = 'w-2 h-2 rounded-full bg-rose-400';
      sheetStatusText.textContent = `Lỗi kết nối ngày ${tabKey}`;
      showToast('Không thể tải Google Sheet!', false);
      pendingSearchAfterLoad = false;
      pendingCheckBookingId = null;
    };
    document.body.appendChild(s);
  }

  // ===== RENDER DANH SÁCH BOOKING (GỘP LẠI, HIỆN NGÀY CẠNH TÊN) =====
  function renderConfirmedList() {
    if (historyWritable) {
      const status = document.getElementById('historySaveStatus');
      status.textContent = 'Đang lưu…';
      try {
        Promise.resolve(BookingHistory.save(confirmedBookings)).then(() => {
          status.textContent = BookingHistory.remote ? 'Đã lưu vào data/bookings.sqlite' : 'Đang mở file cũ · Xuất lịch sử rồi mở ứng dụng qua file .bat';
        }).catch(error => { status.textContent = 'CHƯA LƯU: ' + error.message + ' · Xuất bản sao trước khi đóng trang.'; });
      } catch (error) { status.textContent = 'CHƯA LƯU: ' + error.message; }
    }
    const historyDay = document.getElementById('historyDay');
    const days = [...new Set([BookingHistory.day(), selectedHistoryDay, ...confirmedBookings.map(b => b.confirmedDay)])].sort().reverse();
    historyDay.replaceChildren(...days.map(day => {
      const label = day.split('-').reverse().join('/');
      return new Option(`${day === BookingHistory.day() ? 'Hôm nay · ' : ''}${label} (${BookingHistory.forDay(confirmedBookings, day).length} cuốc)`, day);
    }));
    historyDay.value = selectedHistoryDay;
    const visibleBookings = BookingHistory.forDay(confirmedBookings, selectedHistoryDay);
    const existingContainer = document.getElementById('bookingItemsContainer');
    if (existingContainer) existingContainer.remove();

    if (visibleBookings.length === 0) {
      emptyState.style.display = '';
      confirmedCount.textContent = '0 cuốc';
      return;
    }
    emptyState.style.display = 'none';

    const checkedCount = visibleBookings.filter(b => b.checkStatus === 'found').length;
    confirmedCount.textContent = `${visibleBookings.length} cuốc (${checkedCount}/${visibleBookings.length} đã đối soát)`;

    const container = document.createElement('div');
    container.id = 'bookingItemsContainer';
    container.className = 'bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden card-anim';

    visibleBookings.forEach(bk => {
      const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const p = Object.fromEntries(Object.entries(bk.parsed).map(([key,value])=>[key,typeof value === 'string' ? escapeText(value) : value]));
      const card = document.createElement('div');
      card.id = `bk-${bk.id}`;
      card.className = 'flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition';

      // Status badge
      let badge = '';
      if      (bk.checkStatus === 'found')    badge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap"><i class="fa-solid fa-circle-check"></i> Đã có trên Sheet</span>`;
      else if (bk.checkStatus === 'notfound') badge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-full whitespace-nowrap"><i class="fa-solid fa-triangle-exclamation"></i> Chưa thấy</span>`;
      else if (bk.checkStatus === 'checking') badge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap"><i class="fa-solid fa-rotate spin-icon"></i> Đang kiểm tra...</span>`;
      else                                    badge = `<span class="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap"><i class="fa-regular fa-circle"></i> Chưa đối soát</span>`;

      card.innerHTML = `
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-slate-800">${p.customerString || 'Khách'}</span>
            <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-flex items-center gap-1" title="Ngày đi">
              <i class="fa-regular fa-calendar-days text-emerald-600 text-[10px]"></i> ${escapeText(bk.dayMonthKey) || p.dayMonthKey}
            </span>
            ${p.originalCode ? `<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border">#${p.originalCode}</span>` : ''}
            ${p.agency ? `<span class="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">${p.agency}</span>` : ''}
            ${p.isAiGenerated ? `<span class="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-semibold inline-flex items-center gap-0.5"><i class="fa-solid fa-wand-magic-sparkles text-[9px] text-purple-500"></i> AI</span>` : ''}
          </div>
          <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
            ${p.route        ? `<span><i class="fa-solid fa-route text-emerald-500 mr-0.5"></i>${p.route}</span>` : ''}
            ${p.pickupTime   ? `<span>· <i class="fa-regular fa-clock text-slate-400 mr-0.5"></i>${p.pickupTime}</span>` : ''}
            ${p.pickupPoint  ? `<span>· <i class="fa-solid fa-location-dot text-rose-400 mr-0.5"></i>${p.pickupPoint}</span>` : ''}
          </div>
          ${bk.checkStatus === 'found' && bk.matchLabel ? `<p class="text-[10px] text-emerald-600 mt-1 font-medium">✓ Khớp theo: ${escapeText(bk.matchLabel)}</p>` : ''}
          ${bk.checkStatus === 'notfound' ? `<p class="text-[10px] text-rose-500 mt-1 font-medium">⚠️ Không tìm thấy trên Sheet ngày ${escapeText(bk.dayMonthKey)}</p>` : ''}
        </div>
        <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
          ${badge}
          <div class="flex items-center gap-1.5">
            <button class="btn-check-bk text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-sm" data-id="${bk.id}">
              <i class="fa-solid fa-magnifying-glass text-[10px]"></i> Kiểm tra
            </button>
            <button class="btn-del-bk text-slate-300 hover:text-rose-500 transition p-1" data-id="${bk.id}" title="Xóa cuốc này">
              <i class="fa-regular fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    confirmedList.appendChild(container);

    // Gắn sự kiện
    container.querySelectorAll('.btn-check-bk').forEach(btn => {
      btn.addEventListener('click', () => handleCheckBooking(parseInt(btn.dataset.id)));
    });
    container.querySelectorAll('.btn-del-bk').forEach(btn => {
      btn.addEventListener('click', () => {
        confirmedBookings = confirmedBookings.filter(b => b.id !== parseInt(btn.dataset.id));
        renderConfirmedList();
      });
    });
  }

  // ===== BƯỚC 1: TẠO FORM + LƯU DANH SÁCH =====
  async function handleCreateZaloForm() {
    if (btnCreateZalo.disabled) return;
    const text = rawInput.value.trim();
    if (!text) { showToast('Vui lòng dán nội dung booking vào ô!', false); return; }

    const useGemini = isGeminiEnabled();
    let result = null;
    try { result = BookingMemory.recall(text, operatorSelect.value); }
    catch (error) { showToast(`Không đọc được mẫu đã lưu: ${error.message}`, false); return; }

    if (result) {
      showToast('Đã dùng lại form bạn sửa trong mẫu đã lưu.');
    } else if (useGemini && GeminiService.isConfigured()) {
      // Dùng Gemini AI bóc tách
      const btnCreateText = document.getElementById('btnCreateText');
      const btnCreateIcon = document.getElementById('btnCreateIcon');
      const originalText = btnCreateText.textContent;

      btnCreateText.textContent = 'Gemini AI đang bóc tách...';
      btnCreateIcon.className = 'fa-solid fa-rotate spin-icon text-amber-300';
      btnCreateZalo.disabled = true;

      try {
        result = await GeminiService.parseBooking(text, operatorSelect.value, status => { btnCreateText.textContent = status; });
        showToast('✨ Gemini đã bóc tách booking. Vui lòng kiểm tra thông tin.');
      } catch (err) {
        // Khi Gemini thất bại (503, overload, timeout...) → tự động fallback sang local parser
        const isOverload = err.isOverload || err.message?.includes('503') || err.message?.includes('overload') || err.message?.includes('quá tải') ||
                           err.message?.includes('high demand') || err.message?.includes('timeout') || err.message?.includes('thời gian');
        if (isOverload) {
          showToast('⚡ Gemini đang bận — dùng phân tích cục bộ thay thế.', false);
          result = BookingMemory.learn(text, BookingParser.parse(text, operatorSelect.value));
          if (!result) { showToast('Không thể phân tích dữ liệu booking!', false); return; }
          // Đánh dấu là fallback
          result._geminiError = err.message;
        } else {
          sourceForExample = '';
          currentParsedResult = null;
          outputZalo.value = '';
          if (outputExcel) outputExcel.value = '';
          const badge = document.getElementById('badgeZaloSource');
          badge.className = 'text-xs text-rose-700 max-w-sm break-words';
          badge.title = err.details || err.message;
          badge.textContent = `Gemini thất bại: ${err.message}. Chưa tạo hoặc sao chép form.`;
          showToast('Gemini thất bại — chưa tạo hoặc sao chép form.', false);
          return;
        }
      } finally {
        btnCreateText.textContent = originalText;
        btnCreateIcon.className = 'fa-solid fa-bolt text-amber-300';
        btnCreateZalo.disabled = false;
      }
    } else if (useGemini && !GeminiService.isConfigured()) {
      openGeminiModal();
      showToast('Vui lòng cài đặt Gemini API Key để dùng AI!', false);
      return;
    } else {
      result = BookingMemory.learn(text, BookingParser.parse(text, operatorSelect.value));
    }

    if (!result) { showToast('Không thể phân tích dữ liệu booking!', false); return; }

    sourceForExample = text;
    currentParsedResult = result;
    outputZalo.value = result.zaloMsg;
    if (outputExcel) outputExcel.value = result.excel4Cols || '';

    // Cập nhật nhãn nhận biết nguồn xử lý
    const badgeZaloSource = document.getElementById('badgeZaloSource');
    if (badgeZaloSource) {
      badgeZaloSource.classList.remove('hidden');
      badgeZaloSource.title = '';
      if (result.isSavedExample) {
        badgeZaloSource.className = 'text-xs font-semibold text-amber-700';
        badgeZaloSource.textContent = 'Mẫu đã lưu · dùng bản bạn đã sửa';
      } else if (result.isLearnedExample) {
        badgeZaloSource.className = 'text-xs font-semibold text-amber-700';
        badgeZaloSource.textContent = 'Cục bộ · áp dụng quy tắc từ mẫu đã lưu';
      } else if (result.isAiGenerated) {
        badgeZaloSource.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300 inline-flex items-center gap-1 shadow-xs';
        badgeZaloSource.textContent = `Gemini AI · ${result.model}`;
      } else if (result._geminiError) {
        badgeZaloSource.className = 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300 inline-flex items-center gap-1';
        badgeZaloSource.title = 'Gemini bị quá tải, đã tự động dùng phân tích cục bộ';
        badgeZaloSource.innerHTML = '<i class="fa-solid fa-bolt text-orange-500"></i> Cục bộ (Gemini bận)';
      } else {
        badgeZaloSource.className = 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1';
        badgeZaloSource.innerHTML = '<i class="fa-solid fa-bolt text-amber-500"></i> Phân tích Cục bộ';
      }
    }

    if (result.warnings?.length && badgeZaloSource) {
      badgeZaloSource.textContent += ' · Cần kiểm tra: ' + result.warnings.join('; ');
      badgeZaloSource.title = result.warnings.join('\n');
    }

    currentDraft = { bookingId: null };

    // Báo trạng thái ô đối soát
    setCheckResult('info',
      `✔ Đã tạo Form Zalo (Ngày ${result.travelDate})`,
      `Sửa thông tin nếu cần, rồi bấm <b>"Sao chép Zalo"</b> để thêm vào danh sách đã xác nhận.`
    );

    // Tự động đồng bộ ngày trên Header theo Form Zalo
    syncDateFromZaloForm();
  }

  function readEditedZalo() {
    const labels = {'đại lý':'agency','code':'code','ngày đi':'travelDate','lịch trình':'route','loại xe':'vehicle','số lượng khách':'pax','tên khách':'customerString','giờ đón':'pickupTime','điểm đón':'pickupPoint','điểm trả':'dropPoint','giá vé':'price','giá':'price','note':'note'};
    const result = Object.fromEntries(Object.values(labels).map(key => [key, '']));
    for (const line of outputZalo.value.split(/\r?\n/)) {
      const colon = line.indexOf(':');
      const key = labels[line.slice(0, colon).trim().toLowerCase()];
      if (colon >= 0 && key) result[key] = line.slice(colon + 1).trim();
    }
    const date = /^(\d{1,2})[/.\-](\d{1,2})(?:[/.\-]\d{2,4})?$/.exec(result.travelDate);
    result.dayMonthKey = date ? `${Number(date[1])}/${Number(date[2])}` : '';
    result.zaloMsg = outputZalo.value;
    result.excel4Cols = `${result.pickupPoint}\t${result.dropPoint}\t${result.customerString}\t${result.pax}`;
    return result;
  }

  async function handleCopyZalo() {
    if (copyingZalo || btnCreateZalo.disabled) return;
    if (!outputZalo.value.trim()) { showToast('Chưa có form để sao chép.', false); return; }
    const result = readEditedZalo();
    const draft = currentDraft;
    copyingZalo = true;
    btnCopyZalo.disabled = true;
    try {
      if (!await copyText(result.zaloMsg, 'Đã sao chép Form Zalo!')) return;
      let booking = confirmedBookings.find(b => b.id === draft.bookingId);
      if (!booking) {
        booking = {id: nextBookingId++, confirmedAt: new Date().toISOString(), confirmedDay: BookingHistory.day()};
        draft.bookingId = booking.id;
        confirmedBookings.push(booking);
      }
      selectedHistoryDay = booking.confirmedDay;
      if (booking.parsed?.zaloMsg !== result.zaloMsg) {
        Object.assign(booking, {dayMonthKey:result.dayMonthKey, parsed:result, checkStatus:'pending', matchedRows:[], matchLabel:''});
      }
      if (currentDraft === draft) {
        currentParsedResult = result;
        if (outputExcel) outputExcel.value = result.excel4Cols;
      }
      renderConfirmedList();
    } finally { copyingZalo = false; btnCopyZalo.disabled = false; }
  }

  function renderExamples() {
    const list = document.getElementById('exampleList');
    list.replaceChildren();
    const entries = BookingMemory.list();
    document.getElementById('exampleCount').textContent = entries.length;
    for (const entry of entries) {
      const item = document.createElement('details');
      const title = document.createElement('summary');
      title.textContent = `${entry.data.route} · ${entry.data.travelDate} · ${entry.data.customerString}`;
      const preview = document.createElement('pre');
      preview.className = 'whitespace-pre-wrap text-xs p-2';
      preview.textContent = `TIN GỐC:\n${entry.raw}\n\nFORM ĐÃ SỬA:\n${entry.form}`;
      const remove = document.createElement('button');
      remove.textContent = 'Xóa mẫu';
      remove.className = 'text-rose-600 p-2';
      remove.addEventListener('click', () => {
        try { BookingMemory.remove(entry.id); renderExamples(); }
        catch (error) { showToast(error.message, false); }
      });
      item.append(title, preview, remove);
      list.append(item);
    }
  }
  document.getElementById('btnSaveExample').addEventListener('click', () => {
    if (btnCreateZalo.disabled || !sourceForExample || sourceForExample !== rawInput.value.trim()) {
      showToast('Hãy tạo form từ tin nhắn hiện tại, sửa đúng thông tin rồi lưu mẫu.', false);
      return;
    }
    try {
      const entry = BookingMemory.save(sourceForExample, outputZalo.value);
      if (outputExcel) outputExcel.value = `${entry.data.pickupPoint}\t${entry.data.dropPoint}\t${entry.data.customerString}\t${entry.data.pax}`;
      renderExamples();
      showToast('Đã lưu mẫu đã sửa. Gemini sẽ tham khảo khi gặp tin tương tự.');
    } catch (error) { showToast(error.message || 'Không lưu được mẫu trong trình duyệt.', false); }
  });
  try { renderExamples(); } catch (error) { showToast(error.message, false); }

  // ===== BƯỚC 2: Kiểm tra booking vừa tạo =====
  async function handleRunCheck() {
    if (!currentParsedResult) { await handleCreateZaloForm(); if (!currentParsedResult) return; }

    const need = currentParsedResult.dayMonthKey;
    if (need && SHEET_TABS[need] && need !== currentTabKey) {
      pendingSearchAfterLoad = true;
      pendingCheckBookingId  = null;
      setCheckResult('loading', `Đang chuyển sang ngày ${need}...`, `Hệ thống đang nạp dữ liệu ngày <b>${need}</b> từ Google Sheet. Vui lòng chờ...`);
      tabSelect.value = need;
      loadSheetTab(need);
      return;
    }
    performCrossCheck(null);
  }

  // ===== Kiểm tra từng booking trong danh sách =====
  function handleCheckBooking(id) {
    const bk = confirmedBookings.find(b => b.id === id);
    if (!bk) return;

    currentParsedResult = bk.parsed;
    bk.checkStatus = 'checking';
    renderConfirmedList();

    const need = bk.dayMonthKey;
    if (need && SHEET_TABS[need] && need !== currentTabKey) {
      pendingSearchAfterLoad = true;
      pendingCheckBookingId  = id;
      setCheckResult('loading', `Đang chuyển sang ngày ${need}...`, `Hệ thống đang nạp dữ liệu ngày <b>${need}</b> từ Google Sheet để kiểm tra <b>${bk.parsed.customerString}</b>...`);
      tabSelect.value = need;
      loadSheetTab(need);
      return;
    }
    performCrossCheck(bk);
  }

  // ===== Core: thực thi đối soát =====
  function performCrossCheck(bk) {
    const parsed = bk ? bk.parsed : currentParsedResult;
    if (!parsed) return;

    const criteria = document.querySelector('input[name="checkCriteria"]:checked')?.value || 'customer';

    // Từ khóa tìm kiếm
    const custLow  = parsed.customerString.toLowerCase();
    const phoneM   = parsed.customerString.match(/\+?\d{8,14}/);
    const phone    = phoneM ? phoneM[0].replace(/\D/g,'') : '';
    const custKws  = custLow.split(/[\s,]+/).filter(k => k.length > 2 && !k.startsWith('+'));
    const codeKey  = (parsed.originalCode || '').toLowerCase();
    const agencyK  = parsed.agency.toLowerCase().replace(/^(vxr|vpl|đại lý)\s*/i,'').trim();
    const pickKws  = parsed.pickupPoint.toLowerCase().split(/[\s,]+/).filter(k => k.length > 2);

    const matched = [];
    let   label   = '';

    liveSheetRows.forEach(row => {
      const rCust   = row.customer.toLowerCase();
      const rPhoneM = (row.customer.match(/\+?\d{8,14}/) || [''])[0].replace(/\D/g,'');
      const rAgency = row.agency.toLowerCase();
      const rPickup = row.pickupPoint.toLowerCase();
      const full    = `${row.agency} ${row.customer} ${row.pickupPoint} ${row.dropPoint} ${row.note}`.toLowerCase();
      let   ok      = false;

      if (criteria === 'customer' || criteria === 'all') {
        if (phone.length >= 8 && rPhoneM && rPhoneM.includes(phone))  { ok = true; label = `SĐT (${phone})`; }
        else if (custKws.some(k => rCust.includes(k)))                 { ok = true; label = `Tên (${parsed.customerString})`; }
        else if (codeKey && full.includes(codeKey))                    { ok = true; label = `Mã ${codeKey}`; }
      }
      if ((criteria === 'agency' || criteria === 'all') && !ok) {
        if (codeKey && (rAgency.includes(codeKey) || full.includes(codeKey))) { ok = true; label = `Mã đặt chỗ ${codeKey}`; }
        else if (agencyK.length > 2 && rAgency.includes(agencyK))             { ok = true; label = `Đại lý (${parsed.agency})`; }
      }
      if ((criteria === 'pickup' || criteria === 'all') && !ok) {
        if (pickKws.length && pickKws.some(k => rPickup.includes(k))) { ok = true; label = `Điểm đón (${parsed.pickupPoint})`; }
      }
      if (ok) matched.push(row);
    });

    const found = matched.length > 0;

    // Cập nhật hộp kết quả hiển thị bên trái
    if (found) {
      const details = matched.slice(0, 2).map(r =>
        `• <b>${r.trip}</b>: ${r.agency} | <b>${r.customer}</b> | Đón: ${r.pickupPoint}`
      ).join('<br>');
      setCheckResult('found',
        `✅ Tìm thấy ${matched.length} cuốc – Khớp: ${label}`,
        `${details}<br><span class="text-emerald-700 font-semibold">➡️ Cuốc xe của <b>${parsed.customerString}</b> đã có trên Sheet ngày ${currentTabKey}!</span>`
      );
      showToast(`✅ Tìm thấy "${parsed.customerString}" trên Sheet!`);
    } else {
      const critName = criteria === 'customer' ? `Tên/SĐT (${parsed.customerString})` :
                       criteria === 'agency'   ? `Đại lý (${parsed.agency})` :
                       criteria === 'pickup'   ? `Điểm đón (${parsed.pickupPoint})` : 'Tất cả tiêu chí';
      setCheckResult('notfound',
        `⚠️ Chưa thấy "${parsed.customerString}" trên Sheet ngày ${currentTabKey}`,
        `Không khớp với <b>${critName}</b>.<br><span class="text-rose-700 font-semibold">➡️ Vui lòng kiểm tra lại với điều hành!</span>`
      );
      showToast(`⚠️ Không tìm thấy "${parsed.customerString}" trên Sheet!`, false);
    }

    if (bk) {
      // Cập nhật card booking được chọn
      bk.checkStatus = found ? 'found' : 'notfound';
      bk.matchLabel  = label;
      bk.matchedRows = matched;
      renderConfirmedList();
    } else {
      // Cập nhật booking mới nhất chưa đối soát
      const last = confirmedBookings.find(b => b.id === currentDraft.bookingId && b.parsed.zaloMsg === currentParsedResult?.zaloMsg);
      if (last) {
        last.checkStatus = found ? 'found' : 'notfound';
        last.matchLabel = label;
        renderConfirmedList();
      }
    }
  }

  // Helper: cập nhật ô kết quả
  function setCheckResult(type, title, desc) {
    const styles = {
      info:     ['bg-blue-50 border-blue-200',   'w-8 h-8 rounded-lg bg-blue-200 text-blue-700 flex items-center justify-center text-base flex-shrink-0',  '<i class="fa-solid fa-check"></i>'],
      loading:  ['bg-amber-50 border-amber-300',  'w-8 h-8 rounded-lg bg-amber-200 text-amber-700 flex items-center justify-center text-base flex-shrink-0', '<i class="fa-solid fa-rotate spin-icon"></i>'],
      found:    ['bg-emerald-50 border-emerald-300', 'w-8 h-8 rounded-lg bg-emerald-200 text-emerald-700 flex items-center justify-center text-base flex-shrink-0', '<i class="fa-solid fa-circle-check"></i>'],
      notfound: ['bg-rose-50 border-rose-300',    'w-8 h-8 rounded-lg bg-rose-200 text-rose-700 flex items-center justify-center text-base flex-shrink-0',   '<i class="fa-solid fa-triangle-exclamation"></i>'],
    };
    const [box, icon, iconHtml] = styles[type] || styles.info;
    checkResultBox.className  = `bg-white rounded-xl shadow-sm border p-4 flex items-start gap-3 transition duration-200 ${box}`;
    checkResultIcon.className = icon;
    checkResultIcon.innerHTML = iconHtml;
    checkResultTitle.textContent = title;
    checkResultDesc.innerHTML    = desc;
  }

  // ===== TỰ ĐỘNG CẬP NHẬT NGÀY THEO FORM ZALO =====
  function syncDateFromZaloForm() {
    const text = outputZalo.value;
    if (!text) return;

    // Tìm dòng: Ngày đi : 24/11/2026 hoặc 24/11
    const m = text.match(/Ngày đi\s*:\s*(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{2,4}))?/i) ||
              text.match(/(?:ngày|ngay)?\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i);

    if (m) {
      const day = parseInt(m[1], 10);
      const month = parseInt(m[2], 10);
      const key = `${day}/${month}`;

      if (SHEET_TABS[key]) {
        if (tabSelect.value !== key) {
          tabSelect.value = key;
          // Hiệu ứng nhấp nháy viền nổi bật để người dùng nhận biết ngày đã chuyển
          tabSelect.classList.add('ring-2', 'ring-amber-400', 'bg-emerald-900');
          setTimeout(() => tabSelect.classList.remove('ring-2', 'ring-amber-400', 'bg-emerald-900'), 1500);
        }
        if (currentTabKey !== key) {
          loadSheetTab(key);
        }
      }
    }
  }

  // ===== SỰ KIỆN =====
  btnCreateZalo.addEventListener('click', handleCreateZaloForm);
  btnRunCheck.addEventListener('click', handleRunCheck);

  // Khi người dùng chỉnh sửa trực tiếp trên Form Zalo (ô bên phải) -> tự động cập nhật ngày trên Header
  outputZalo.addEventListener('input', () => {
    currentParsedResult = outputZalo.value.trim() ? readEditedZalo() : null;
    if (outputExcel) outputExcel.value = currentParsedResult?.excel4Cols || '';
    syncDateFromZaloForm();
  });

  // Khi người dùng dán hoặc nhập nội dung booking vào ô bên trái -> tự phát hiện ngày và cập nhật trước
  rawInput.addEventListener('input', () => {
    const text = rawInput.value;
    const dateM = text.match(/(?:ngày|ngay)?\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i) ||
                  text.match(/(\d{1,2})\s*thg\s*(\d{1,2})/i);
    if (dateM) {
      const d = parseInt(dateM[1], 10);
      const m = parseInt(dateM[2], 10);
      const k = `${d}/${m}`;
      if (SHEET_TABS[k] && tabSelect.value !== k) {
        tabSelect.value = k;
        tabSelect.classList.add('ring-2', 'ring-amber-400');
        setTimeout(() => tabSelect.classList.remove('ring-2', 'ring-amber-400'), 1500);
        if (currentTabKey !== k) {
          loadSheetTab(k);
        }
      }
    }
  });

  rawInput.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') handleCreateZaloForm();
  });

  btnClearInput.addEventListener('click', () => { rawInput.value = ''; rawInput.focus(); });
  document.getElementById('btnCopyForGem').addEventListener('click', () => {
    if (!rawInput.value.trim()) { showToast('Hãy dán booking vào ô nhập trước.', false); return; }
    copyText(rawInput.value, 'Đã sao chép booking. Mở Gem rồi dán vào cuộc trò chuyện.');
  });
  btnCopyZalo.addEventListener('click', handleCopyZalo);
  btnCopyExcel?.addEventListener('click', () => copyText(outputExcel.value, '📊 Đã sao chép 4 cột Excel (Tab)!'));

  document.getElementById('exportHistory').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(confirmedBookings,null,2)], {type:'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = `booking-history-${BookingHistory.day()}.json`;
    link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
  });
  document.getElementById('importHistory').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (!historyWritable || BookingHistory.failure) throw new Error('Hãy tải lại lịch sử thành công trước khi nhập.');
      const merged = BookingHistory.merge(confirmedBookings, JSON.parse(await file.text()));
      await BookingHistory.save(merged);
      confirmedBookings = merged;
      nextBookingId = Math.max(0,...merged.map(b=>b.id))+1;
      renderConfirmedList(); showToast('Đã nhập và lưu lịch sử; giữ nguyên dữ liệu đang có.');
    } catch(error) { showToast(error.message, false); }
    finally { event.target.value=''; }
  });

  document.getElementById('historyDay').addEventListener('change', event => {
    selectedHistoryDay = event.target.value;
    renderConfirmedList();
  });
  btnClearAll.addEventListener('click', () => {
    if (!confirm('Xóa các booking trong ngày đang xem? Các ngày khác vẫn được giữ.')) return;
    confirmedBookings = confirmedBookings.filter(b => b.confirmedDay !== selectedHistoryDay);
    renderConfirmedList();
    showToast('Đã xóa booking trong ngày đang xem.', false);
  });

  tabSelect.addEventListener('change', e => loadSheetTab(e.target.value));

  btnQuickGuide.addEventListener('click',    () => modalGuide.classList.remove('hidden'));
  btnCloseModal.addEventListener('click',    () => modalGuide.classList.add('hidden'));
  btnCloseModalBtn.addEventListener('click', () => modalGuide.classList.add('hidden'));

  // ===== GEMINI AI MODAL & CÀI ĐẶT =====
  const btnOpenGeminiModal        = document.getElementById('btnOpenGeminiModal');
  const btnToggleGeminiActive   = document.getElementById('btnToggleGeminiActive');
  const btnConfigureGeminiQuick = document.getElementById('btnConfigureGeminiQuick');
  const geminiStatusBadge       = document.getElementById('geminiStatusBadge');
  const chkUseGemini            = document.getElementById('chkUseGemini');
  const modalGemini             = document.getElementById('modalGemini');
  const modalToggleGemini       = document.getElementById('modalToggleGemini');
  const btnCloseGeminiModal     = document.getElementById('btnCloseGeminiModal');
  const inputGeminiKey          = document.getElementById('inputGeminiKey');
  const btnToggleKeyVisibility  = document.getElementById('btnToggleKeyVisibility');
  const eyeIcon                 = document.getElementById('eyeIcon');
  const inputGeminiPrompt       = document.getElementById('inputGeminiPrompt');
  const btnResetPrompt          = document.getElementById('btnResetPrompt');
  const selectGeminiModel       = document.getElementById('selectGeminiModel');
  const geminiTestAlert         = document.getElementById('geminiTestAlert');
  const btnTestGeminiKey        = document.getElementById('btnTestGeminiKey');
  const btnSaveGeminiKey        = document.getElementById('btnSaveGeminiKey');
  const btnDeleteGeminiKey      = document.getElementById('btnDeleteGeminiKey');

  const STORAGE_KEY_GEMINI_ENABLED = 'thelong_gemini_enabled';
  // User requested local processing. Migrate existing preferences once.
  if (localStorage.getItem('thelong_local_default_v1') !== 'true') {
    localStorage.setItem(STORAGE_KEY_GEMINI_ENABLED, 'false');
    localStorage.setItem('thelong_local_default_v1', 'true');
  }

  function isGeminiEnabled() {
    if (!GeminiService.isConfigured()) return false;
    const saved = localStorage.getItem(STORAGE_KEY_GEMINI_ENABLED);
    return saved === 'true';
  }

  function setGeminiEnabled(enabled) {
    localStorage.setItem(STORAGE_KEY_GEMINI_ENABLED, enabled ? 'true' : 'false');
    updateGeminiStatusBadge();
  }

  function updateGeminiStatusBadge() {
    const configured = GeminiService.isConfigured();
    const enabled = isGeminiEnabled();

    if (!configured) {
      geminiStatusBadge.textContent = 'Chưa cài Key';
      geminiStatusBadge.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-700 text-slate-300';
      if (chkUseGemini) chkUseGemini.checked = false;
      if (modalToggleGemini) modalToggleGemini.checked = false;
    } else if (enabled) {
      geminiStatusBadge.textContent = 'Bật';
      geminiStatusBadge.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500 text-white shadow-xs';
      if (chkUseGemini) chkUseGemini.checked = true;
      if (modalToggleGemini) modalToggleGemini.checked = true;
    } else {
      geminiStatusBadge.textContent = 'Tắt';
      geminiStatusBadge.className = 'text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-600 text-slate-300';
      if (chkUseGemini) chkUseGemini.checked = false;
      if (modalToggleGemini) modalToggleGemini.checked = false;
    }
  }

  function openGeminiModal() {
    inputGeminiKey.value = GeminiService.getApiKey();
    inputGeminiPrompt.value = GeminiService.getCustomPrompt();
    const savedModel = GeminiService.getModel();
    if (!Array.from(selectGeminiModel.options).some(o => o.value === savedModel)) selectGeminiModel.add(new Option(savedModel, savedModel));
    selectGeminiModel.value = savedModel;
    if (modalToggleGemini) modalToggleGemini.checked = isGeminiEnabled();
    geminiTestAlert.className = 'hidden';
    modalGemini.classList.remove('hidden');
  }

  function closeGeminiModal() {
    modalGemini.classList.add('hidden');
  }

  // Bấm vào nút Gemini AI trên header để BẬT / TẮT trực tiếp
  btnToggleGeminiActive?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!GeminiService.isConfigured()) {
      openGeminiModal();
      showToast('Vui lòng cài đặt Gemini API Key trước khi bật!', false);
      return;
    }
    const nextState = !isGeminiEnabled();
    setGeminiEnabled(nextState);
    if (nextState) {
      showToast('✨ Đã BẬT Gemini AI (bóc tách thông minh)');
    } else {
      showToast('⚡ Đã TẮT Gemini AI (chuyển sang phân tích Cục bộ)', false);
    }
  });

  // Đồng bộ checkbox Dùng Gemini AI ở dưới khung nhập
  chkUseGemini?.addEventListener('change', (e) => {
    if (e.target.checked && !GeminiService.isConfigured()) {
      e.target.checked = false;
      openGeminiModal();
      showToast('Vui lòng cài đặt Gemini API Key trước khi bật!', false);
      return;
    }
    setGeminiEnabled(e.target.checked);
    showToast(e.target.checked ? '✨ Đã BẬT Gemini AI' : '⚡ Đã TẮT Gemini AI (chuyển sang Cục bộ)', e.target.checked);
  });

  // Đồng bộ nút switch trong Modal
  modalToggleGemini?.addEventListener('change', (e) => {
    if (e.target.checked && !inputGeminiKey.value.trim() && !GeminiService.isConfigured()) {
      e.target.checked = false;
      showToast('Vui lòng nhập API Key trước khi bật!', false);
      return;
    }
    setGeminiEnabled(e.target.checked);
  });

  btnOpenGeminiModal?.addEventListener('click', openGeminiModal);
  btnConfigureGeminiQuick?.addEventListener('click', openGeminiModal);
  btnCloseGeminiModal?.addEventListener('click', closeGeminiModal);

  btnToggleKeyVisibility?.addEventListener('click', () => {
    if (inputGeminiKey.type === 'password') {
      inputGeminiKey.type = 'text';
      eyeIcon.className = 'fa-regular fa-eye-slash';
    } else {
      inputGeminiKey.type = 'password';
      eyeIcon.className = 'fa-regular fa-eye';
    }
  });

  btnResetPrompt?.addEventListener('click', () => {
    inputGeminiPrompt.value = GeminiService.DEFAULT_PROMPT;
    showToast('Đã khôi phục System Prompt mặc định!');
  });

  btnTestGeminiKey?.addEventListener('click', async () => {
    const key = inputGeminiKey.value.trim();
    if (!key) {
      geminiTestAlert.className = 'p-2.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 block';
      geminiTestAlert.textContent = '⚠️ Vui lòng nhập API Key trước khi thử kết nối!';
      return;
    }
    const origText = btnTestGeminiKey.innerHTML;
    btnTestGeminiKey.innerHTML = '<i class="fa-solid fa-rotate spin-icon"></i> Đang thử...';
    btnTestGeminiKey.disabled = true;

    try {
      const res = await GeminiService.testConnection(key, selectGeminiModel.value);
      const chosenModel = (typeof res === 'object' && res.model) ? res.model : GeminiService.getModel();
      // Cập nhật các model thực tế có trong tài khoản
      if (res && res.availableModels && res.availableModels.length > 0) {
        const existingValues = Array.from(selectGeminiModel.options).map(o => o.value);
        [...new Set([chosenModel, ...res.availableModels])].forEach(m => {
          if (!existingValues.includes(m)) {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            selectGeminiModel.appendChild(opt);
          }
        });
        selectGeminiModel.value = chosenModel;
      }

      geminiTestAlert.className = 'p-2.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 block';
      geminiTestAlert.textContent = `✅ Thử JSON thành công với ${chosenModel}. Bấm Lưu cài đặt để dùng model này. Tình trạng quá tải có thể thay đổi ở lần gọi sau.`;
    } catch (err) {
      geminiTestAlert.className = 'p-2.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 block';
      geminiTestAlert.textContent = `❌ Kết nối thất bại: ${err.message}`;
    } finally {
      btnTestGeminiKey.innerHTML = origText;
      btnTestGeminiKey.disabled = false;
    }
  });

  btnSaveGeminiKey?.addEventListener('click', () => {
    const key = inputGeminiKey.value.trim();
    GeminiService.setApiKey(key);
    GeminiService.setCustomPrompt(inputGeminiPrompt.value);
    GeminiService.setModel(selectGeminiModel.value);

    if (modalToggleGemini) {
      setGeminiEnabled(modalToggleGemini.checked);
    } else {
      updateGeminiStatusBadge();
    }
    closeGeminiModal();
    showToast(key ? '💾 Đã lưu cấu hình Gemini AI thành công!' : 'Đã lưu cài đặt!');
  });

  btnDeleteGeminiKey?.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa Gemini API Key không?')) {
      GeminiService.setApiKey('');
      inputGeminiKey.value = '';
      updateGeminiStatusBadge();
      closeGeminiModal();
      showToast('Đã xóa Gemini API Key!', false);
    }
  });

  // ===== PRESETS (Các mẫu từ Gem THE LONG BOOKING) =====
  const PRESETS = {
    'tuanchau': `Tuan Chau Marina Hotel
The Long Travel
#AAVP9028
Thứ 4 25 thg 11 2026 · Express 16
11:00
Các hành khách
2 × Adult
Igor Ksiezopolski
Nikola Subocz
Số điện thoại: +48735977916`,
    'yoav': `#AAVH6204\nThứ 5 19 thg 11 2026 · Express 16 08:00am\nđón Tam Coc Sunshine Hostel\ntrả Little Mai Chau Homestay\nCác hành khách\n1 × Adult\nYoav Zamir\nSố điện thoại\n+972584760413`,
    'johanna': `AAVH6457\nThứ 4 18 thg 11 2026 · Express 16\nRoute: Ninh Binh to Pu Luong 13:00\nđón The Long Travel\ntrả OH Pu Luong Homestay\nCác hành khách 2 × Adult\nJohanna Freninger\nJonas Thoeni\nSố điện thoại: +436509939155`,
    'saoirse': `EM GỬI 1 PAX CB - NB CHUYẾN 8:15AM NGÀY 24/11\nTÊN : saoirse\nCODE: 4452\nĐÓN: CATBA BUFFALO HOSTEL`,
    '1': `Ninh Bình - Cát Bà\n09:30\n18/11/2026\nThời gian xác nhận còn lại\n00:33:29\n1 ghế:\n3\nMã vé:\nR563ZK\nMã đặt chỗ:\nXH72U0I\nĐón:\n09:30 - The Long Hotel\nTC Đón:\nTrả:\n14:00 - 243 Núi Ngọc\nTC trả:\nTên:\nTasmin Walton 3pax \nSĐT:\n447825575049\nEmail:\ntazzyw@hotmail.com`,
    '2': `Mã vé: MW0R5Z\nMã đặt chỗ 50T7DY3\nTuyến đường Mai Châu - Ninh Bình 13:30 18/11/2026\nPhương tiện giao thông: bus\nĐiểm khởi hành: 13:00 - Nha Tan Homestay\nKhởi hành tại: 13:00\nĐiểm đến: The Long Hotel\nThông tin hành khách 1 pax\nAdult Alison Allum 447984858530`,
    '3': `@All Trưa mai 18/11, Em gửi 2 bus HL - NB. Đón Lô G54-55 ( đối diện No26) Tuần Châu. Lễ tân đón bến 0964 023 086 nhận/ giao khách.\n2k\tMateusz Zaremba +48514838931.  Trả phố cổ Hoa Lư, NB`,
    '4': `Mai cho c 2 cát bà 9h (ella)`,
    '5': `2k\nđón Axasola Tam Coc - VEGAN FOOD and COFFEE\ntên Anna Girrbach\ntrả cảng sun lh 0904778736 e Vân`,
    '6': `VP Long\n#AAVP7636\nThứ 6 27 thg 11 2026 · Express 16\nRoute: Pu Luong to Ninh Binh\n07:20\n3h 30m\n10:50\nOH Pu Luong Homestay\nThe Long Travel\nCác hành khách\n2 × Adult\nJocelin BobinetLopez\nSố điện thoại: +33783789389\nCeliane Ferrin\nSố điện thoại: +33783789389`
  };

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = PRESETS[btn.dataset.preset];
      if (p) { rawInput.value = p; handleCreateZaloForm(); }
    });
  });

  // ===== KHỞI ĐỘNG =====
  initTabSelect();
  loadSheetTab('24/11');
  renderConfirmedList();
  updateGeminiStatusBadge();
});
