/**
 * gemini_service.js – Dịch vụ gọi Google Gemini API bóc tách booking cho Thế Long Travel
 * Được huấn luyện chính xác theo System Instruction và Few-shot Examples của Gem THE LONG BOOKING
 */

const GeminiService = {
  STORAGE_KEY_API: 'thelong_gemini_api_key',
  STORAGE_KEY_PROMPT: 'thelong_gemini_prompt',
  STORAGE_KEY_MODEL: 'thelong_gemini_model',

  DEFAULT_MODEL: 'auto',

  DEFAULT_PROMPT: `Bạn là trợ lý điều hành cấp cao của công ty du lịch vận tải 'Thế Long Travel'.
Nhiệm vụ của bạn là đọc tin nhắn đặt chỗ / booking thô (tin nhắn Zalo, mã vé Vexere, 12Go, tin nhắn điều hành, chat WhatsApp... bằng tiếng Việt hoặc tiếng Anh) và bóc tách thông tin thật chính xác theo cấu trúc JSON.

HƯỚNG DẪN ĐIỀN FORM VÀ QUY TẮC CỦA THẾ LONG TRAVEL:

1. QUY TẮC GIỜ HẸN ĐÓN KHÁCH (bắt buộc khoảng giờ đón trong vòng 20 - 30 phút):
- Bus Ninh Bình - Cát Bà:
  + Chuyến 07:00 -> hẹn đón 6:30 - 7:00
  + Chuyến 09:30 -> nếu đón The Long Hotel hẹn 8:35 - 9:35, các điểm khác hẹn 9:00 - 9:35
  + Chuyến 13:30 -> hẹn đón 13:00 - 13:30
- Bus Cát Bà - Ninh Bình:
  + Chuyến 8:15AM -> hẹn đón 8:00 - 8:15
  + Chuyến 12:30 -> hẹn đón 12:00 - 12:30
  + Chuyến 15:30 -> hẹn đón 15:00 - 15:30
- Bus Ninh Bình - Hạ Long:
  + Bus thường -> hẹn đón 6:30 - 7:30
  + Limousine -> hẹn đón 6:30 - 7:30 (tại Tam Cốc / Axasola: 6:40 - 7:00)
- Bus Hạ Long - Ninh Bình:
  + Chuyến 11:00 -> hẹn đón 11:00 - 11:30
  + Chuyến trưa 12:00 -> hẹn đón 11:45 - 12:12
- Tuyến Mai Châu / Pù Luông:
  + Bus limo NB - Mai Châu - Pù Luông: chuyến sáng hẹn 7:30 - 8:00 (hoặc 7:30 - 7:50); chuyến trưa 13:00 hẹn 12:45 - 13:00
  + Bus limo Mai Châu - Pù Luông về NB: chuyến 13:00 / 13:30 hẹn đón 12:45 - 13:00 hoặc 13:00 - 13:30
- Tour:
  + Tour 4 điểm: hẹn 8:00 - 8:30
  + Tour VL CP: hẹn 7:20 - 7:50
  + Tour CP: hẹn 8:45 - 9:10
- Các tuyến khác: hẹn sớm hơn giờ xuất phát khoảng 15 - 30 phút.

2. QUY TẮC NHẬN DIỆN ĐIỂM ĐÓN - TRẢ VÀ TÊN KHÁCH:
- Với vé voucher 12Go (không có chữ "đón:" / "trả:"): 2 dòng địa chỉ ở đầu chính là: dòng 1 = Điểm đón, dòng 2 = Điểm trả.
- TUYỆT ĐỐI KHÔNG lấy tên khách sạn / nhà nghỉ / bến cảng làm tên khách hàng.
- Khi có danh sách nhiều khách (vd: Igor Ksiezopolski, Nikola Subocz), TÊN KHÁCH CHỈ LẤY người đại diện đầu tiên kèm SĐT quốc tế (ví dụ: Igor Ksiezopolski +48735977916).
- Tuyến Tuần Châu / Hạ Long về Ninh Bình: Lịch trình là "HL - NB", Loại xe là "Bus".

3. QUY TẮC MÃ CODE & ĐẠI LÝ:
- Code dạng tlDDMMYY theo ngày đi (ví dụ ngày 19/11/2026 -> tl191126, 25/11/2026 -> tl251126, 18/11/26 -> TL181126).
- Nhận diện đại lý:
  + #AAVP9028 -> AAVP9028
  + #AAVH6204 -> vpl AAVH6204
  + AAVH6457 -> AAVH6457 (hoặc @VP Long)
  + Mã vé Vexere (R563ZK, MW0R5Z...) -> VXR [Mã vé]
  + Tuần Châu / HL-NB -> sunlight
  + Mai cho c 2 cát bà 9h (ella) -> NGỌC ĐỀ
  + Axasola / cảng sun -> Anh Sơn

4. CÁC VÍ DỤ MẪU CHUẨN (FEW-SHOT EXAMPLES):
- Mẫu Tuần Châu (#AAVP9028):
  Input: "Tuan Chau Marina Hotel\\nThe Long Travel\\n#AAVP9028\\nThứ 4 25 thg 11 2026 · Express 16\\n11:00\\nCác hành khách\\n2 × Adult\\nIgor Ksiezopolski\\nNikola Subocz\\nSố điện thoại: +48735977916"
  Output: Đại lý: "AAVP9028", Code: "tl251126", Ngày: "25/11/2026", Lịch trình: "HL - NB", Loại xe: "Bus", Pax: 2, Khách: "Igor Ksiezopolski +48735977916", Giờ đón: "11:00 - 11:30", Đón: "Tuan Chau Marina Hotel", Trả: "The Long Travel", Excel: "Tuan Chau Marina Hotel\\tThe Long Travel\\tIgor Ksiezopolski +48735977916\\t2"

- Mẫu 1:
  Input: "#AAVH6204\\nThứ 5 19 thg 11 2026 · Express 16 08:00am\\nđón Tam Coc Sunshine Hostel\\ntrả Little Mai Chau Homestay\\nCác hành khách 1 × Adult Yoav Zamir +972584760413"
  Output: Đại lý: "vpl AAVH6204", Code: "tl191126", Ngày: "19/11/2026", Lịch trình: "nb mc", Loại xe: "16", Pax: 1, Khách: "Yoav Zamir +972584760413", Giờ đón: "7:30 - 7:50", Đón: "Tam Coc Sunshine Hostel", Trả: "Little Mai Chau Homestay", Excel: "Tam Coc Sunshine Hostel\\tLittle Mai Chau Homestay\\tYoav Zamir +972584760413\\t1"

- Mẫu 2:
  Input: "AAVH6457\\nThứ 4 18 thg 11 2026 · Express 16\\nRoute: Ninh Binh to Pu Luong 13:00\\nđón The Long Travel trả OH Pu Luong Homestay\\n2 × Adult Johanna Freninger, Jonas Thoeni +436509939155"
  Output: Top: "@VP Long ", Đại lý: "AAVH6457", Code: "TL181126", Ngày: "18/11/2026", Lịch trình: "NB - PL", Loại xe: "minivan", Pax: 2, Khách: "Johanna Freninger +436509939155", Giờ đón: "12:45 - 13:00", Đón: "The Long Travel", Trả: "OH Pu Luong Homestay"

- Mẫu 3:
  Input: "Ninh Bình - Cát Bà 09:30 18/11/2026 Mã vé: R563ZK Đón: 09:30 - The Long Hotel Trả: 14:00 - 243 Núi Ngọc Tên: Tasmin Walton 3pax SĐT: 447825575049"
  Output: Đại lý: "VXR R563ZK", Code: "tl181126", Ngày: "18/11/2026", Lịch trình: "Ninh Bình - Cát Bà", Loại xe: "Bus", Pax: 3, Khách: "Tasmin Walton +447825575049", Giờ đón: "8:35 - 9:35", Đón: "The Long Hotel", Trả: "243 Núi Ngọc"

- Mẫu 4:
  Input: "@All Trưa mai 18/11, Em gửi 2 bus HL - NB. Đón Lô G54-55 ( đối diện No26) Tuần Châu. 2k Mateusz Zaremba +48514838931. Trả phố cổ Hoa Lư, NB"
  Output: Đại lý: "sunlight", Code: "TL181126", Ngày: "18/11/2026", Lịch trình: "hl nb", Loại xe: "bus", Pax: 2, Khách: "Mateusz Zaremba +48514838931", Giờ đón: "11:45 - 12:12", Đón: "Đón Lô G54-55 ( đối diện No26) Tuần Châu", Trả: "phố cổ Hoa Lư"

- Mẫu 5:
  Input: "Mai cho c 2 cát bà 9h (ella)"
  Output: Đại lý: "NGỌC ĐỀ", Code: "TL181126", Ngày: "18/11/2026", Lịch trình: "NB - CB", Loại xe: "BUS", Pax: 2, Khách: "ella", Giờ đón: "9:00 - 9:15", Đón: "NGỌC ĐỀ", Trả: "CAT BÀ"

- Mẫu 6:
  Input: "2k đón Axasola Tam Coc - VEGAN FOOD and COFFEE tên Anna Girrbach trả cảng sun lh 0904778736 e Vân"
  Output: Đại lý: "Anh Sơn", Code: "TL181126", Ngày: "18/11/2026", Lịch trình: "NB - HL", Loại xe: "LIMO", Pax: 2, Khách: "Anna Girrbach", Giờ đón: "6:40 - 7:00", Đón: "Axasola Tam Coc", Trả: "cảng sun lh 0904778736 e Vân"

Trả về DUY NHẤT một JSON hợp lệ (không kèm markdown \`\`\`json):
{
  "topMention": "@VP Long nếu có, không thì rỗng",
  "agency": "Tên đại lý (AAVP9028, vpl AAVH6204, VXR..., sunlight, NGỌC ĐỀ...)",
  "originalCode": "Mã vé hoặc mã đặt chỗ riêng nếu có",
  "code": "tlDDMMYY (ví dụ tl251126, tl191126)",
  "travelDate": "DD/MM/YYYY (ví dụ 25/11/2026, 19/11/2026)",
  "dayMonthKey": "D/M (ví dụ 25/11, 19/11)",
  "route": "Lịch trình (HL - NB, nb mc, NB - PL, Ninh Bình - Cát Bà, hl nb, NB - CB, NB - HL...)",
  "vehicle": "Bus / 16 / minivan / LIMO / Express 16",
  "pax": số_lượng_khách,
  "customerString": "Tên khách và SĐT quốc tế (ví dụ: Igor Ksiezopolski +48735977916)",
  "pickupTime": "Giờ đón chính xác theo quy tắc trên (ví dụ: 11:00 - 11:30, 7:30 - 7:50, 8:35 - 9:35, 12:45 - 13:00, 11:45 - 12:12, 6:40 - 7:00...)",
  "pickupPoint": "Điểm đón (ví dụ: Tuan Chau Marina Hotel)",
  "dropPoint": "Điểm trả (ví dụ: The Long Travel)",
  "price": "Giá vé nếu có",
  "note": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}`,

  getApiKey() {
    return (localStorage.getItem(this.STORAGE_KEY_API) || '').trim();
  },

  setApiKey(key) {
    if (!key) {
      localStorage.removeItem(this.STORAGE_KEY_API);
    } else {
      localStorage.setItem(this.STORAGE_KEY_API, key.trim());
    }
  },

  getModel() {
    return localStorage.getItem(this.STORAGE_KEY_MODEL) || this.DEFAULT_MODEL;
  },

  setModel(model) {
    localStorage.setItem(this.STORAGE_KEY_MODEL, model || this.DEFAULT_MODEL);
  },

  getCustomPrompt() {
    return localStorage.getItem(this.STORAGE_KEY_PROMPT) || this.DEFAULT_PROMPT;
  },

  setCustomPrompt(p) {
    if (!p || p.trim() === this.DEFAULT_PROMPT.trim()) {
      localStorage.removeItem(this.STORAGE_KEY_PROMPT);
    } else {
      localStorage.setItem(this.STORAGE_KEY_PROMPT, p.trim());
    }
  },

  isConfigured() {
    return !!this.getApiKey();
  },

  // Hàm gọi fetch có giới hạn thời gian (Timeout) chống bị treo/xoay liên tục
  fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(id));
  },

  async request(path, key, body) {
    let response;
    try {
      response = await this.fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        ...(body ? { body: JSON.stringify(body) } : {})
      }, 45000);
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Gemini quá thời gian chờ (45 giây). Hãy thử lại.');
      throw error;
    }
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${data.error?.message || 'Gemini không phản hồi'}`);
      error.status = response.status;
      throw error;
    }
    return data;
  },

  async listModels(key) {
    const models = [];
    let pageToken = '';
    do {
      const data = await this.request(`models?pageSize=100${pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : ''}`, key);
      models.push(...(data.models || []).filter(m => m.supportedGenerationMethods?.includes('generateContent')).map(m => m.name.replace(/^models\//, '')));
      pageToken = data.nextPageToken || '';
    } while (pageToken);
    return models;
  },

  textModels(models) {
    return [...new Set(models)].filter(m => /^gemini-/.test(m) && !/image|audio|tts|live|robot|computer-use|embedding/i.test(m))
      .sort((a, b) => Number(/preview|exp/.test(a)) - Number(/preview|exp/.test(b)) || Number(!/flash/.test(a)) - Number(!/flash/.test(b)) || b.localeCompare(a, undefined, { numeric: true }));
  },

  async resolveModel(key, preferred) {
    const availableModels = await this.listModels(key);
    const candidates = this.textModels(availableModels);
    const model = candidates.includes(preferred) ? preferred : candidates[0];
    if (!model) throw new Error('Không tìm thấy model Gemini tạo văn bản khả dụng.');
    return { model, availableModels };
  },

  workingModels: new Map(),
  waitRetry(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },

  async generate(key, preferred, body, onProgress = () => {}) {
    const selection = await this.resolveModel(key, preferred);
    const alternatives = this.textModels(selection.availableModels);
    const remembered = this.workingModels.get(key);
    // A saved model is preferred, not exclusive: 404/503 must still try alternatives.
    const first = preferred && preferred !== 'auto' ? selection.model : remembered;
    const candidates = [...new Set([first, selection.model, ...alternatives].filter(m => alternatives.includes(m)))].slice(0, 6);
    const failures = [];
    for (const model of candidates) {
      for (let attempt = 0; attempt < 2; attempt++) {
        onProgress(`${attempt ? 'Thử lại' : 'Đang gọi'} ${model}…`);
        try {
          const json = await this.request(`models/${encodeURIComponent(model)}:generateContent`, key, body);
          this.responseText(json);
          this.workingModels.set(key, model);
          return { ...selection, model, json };
        } catch (error) {
          if (![404, 500, 502, 503, 504].includes(error.status)) throw error;
          failures.push(`${model}: ${error.message}`);
          if (error.status === 404 || attempt === 1) break;
          onProgress(`${model} đang bận, tự thử lại sau 2 giây…`);
          await this.waitRetry(2000);
        }
      }
    }
    const error = new Error(`Gemini 503 quá tải: đã thử ${candidates.length} model. Tự động dùng phân tích cục bộ.`);
    error.details = failures.join('\n');
    throw error;
  },

  responseText(json) {
    const candidate = json.candidates?.[0];
    if (candidate?.finishReason && candidate.finishReason !== 'STOP') throw new Error(`Gemini chưa hoàn tất: ${candidate.finishReason}`);
    const text = candidate?.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('').trim();
    if (!text) throw new Error(`Gemini không trả về nội dung${json.promptFeedback?.blockReason ? ': ' + json.promptFeedback.blockReason : ''}`);
    return text;
  },

  async testConnection(apiKey, preferred) {
    const key = (apiKey || this.getApiKey()).trim();
    if (!key) throw new Error('Vui lòng nhập API Key!');
    const { json, ...selection } = await this.generate(key, preferred || this.getModel(), {
      contents: [{ parts: [{ text: 'Return a JSON object with status set to OK.' }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
    });
    try {
      const probe = JSON.parse(this.responseText(json));
      if (!probe || typeof probe !== 'object' || Array.isArray(probe)) throw new Error();
    } catch {
      this.workingModels.delete(key);
      throw new Error('Model chưa trả về JSON hợp lệ khi thử kết nối.');
    }
    return selection;
  },

  async parseBooking(rawText, operator = 'Felix', onProgress = () => {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('Chưa cài đặt Gemini API Key!');
    if (!rawText?.trim()) throw new Error('Vui lòng nhập nội dung booking.');
    const today = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok' }).format(new Date());
    const { json, model: usedModel } = await this.generate(apiKey, this.getModel(), {
      systemInstruction: { parts: [{ text: this.getCustomPrompt() + (typeof BookingMemory !== 'undefined' ? BookingMemory.prompt(rawText) : '') + `\nNgày hiện tại tại Việt Nam: ${today}. Ngày tương đối tính từ ngày này. Không sao chép dữ liệu ví dụ sang booking. Trường không có bằng chứng để chuỗi rỗng, pax không rõ để null. Không tự bịa ngày, tuyến, điểm đón/trả hoặc tên khách.` }] },
      contents: [{ role: 'user', parts: [{ text: rawText }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
    }, onProgress);
    const candidateText = this.responseText(json);
    let data;
    try { data = JSON.parse(candidateText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); }
    catch { throw new Error('Gemini trả về JSON không hợp lệ.'); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Gemini trả về booking không hợp lệ.');
    for (const [field, value] of Object.entries(data)) {
      if (field !== 'pax' && value != null && typeof value !== 'string') throw new Error(`Gemini trả về trường ${field} sai kiểu dữ liệu.`);
    }
    if (data.pax != null && (!Number.isInteger(Number(data.pax)) || Number(data.pax) <= 0)) throw new Error('Số khách từ Gemini không hợp lệ.');
    if (!['travelDate', 'route', 'customerString', 'pickupPoint', 'dropPoint'].some(k => data[k]?.trim())) throw new Error('Gemini không bóc tách được thông tin booking.');

    // Validation: nếu customerString chứa tên location → tự làm sạch (giữ chỉ tên người đầu tiên + SĐT)
    if (data.customerString) {
      const locationKw = /hotel|homestay|hostel|resort|villa|marina|travel|lodge|camp|cảng|bến|sân bay|tam coc|tuan chau|ha long|ninh binh|cat ba|mai chau|pu luong/i;
      // Nếu customerString chứa dấu phẩy và một trong các token chứa location keyword → chỉ lấy token đầu không phải location
      const tokens = data.customerString.split(/,\s*/);
      if (tokens.length > 1 && tokens.some(t => locationKw.test(t))) {
        const cleanTokens = tokens.filter(t => !locationKw.test(t));
        // Thêm SĐT nếu có
        const phoneMatch = data.customerString.match(/\+\d{8,14}/);
        data.customerString = (cleanTokens[0] || 'Khách').trim() + (phoneMatch ? ' ' + phoneMatch[0] : '');
      }
    }

    const staff = operator || 'Felix';
    const topMention = data.topMention ? `${data.topMention.trim()} ` : '';
    const agency = data.agency || 'Đại lý đối tác';
    const dateParts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data.travelDate || '');
    const code = dateParts ? `tl${dateParts[1]}${dateParts[2]}${dateParts[3].slice(-2)}` : '';
    const travelDate = data.travelDate || '';
    const dayMonthKey = data.dayMonthKey || travelDate.replace(/\/20\d{2}$/, '').replace(/^0/, '').replace(/\/0/, '/');
    const route = data.route || '';
    const vehicle = data.vehicle || 'Bus';
    const pax = data.pax == null ? '' : Number(data.pax);
    const customerString = data.customerString || 'Khách';
    const pickupTime = data.pickupTime || '';
    const pickupPoint = data.pickupPoint || '';
    const dropPoint = data.dropPoint || '';
    const price = data.price || '';
    const note = data.note || 'Thanh toán khi kế toán gửi công nợ ngày theo dõi';

    // Form Zalo chuẩn Thế Long Travel
    const zaloMsg = `${topMention}Thế Long Travel xác nhận booking
Đại lý             : ${agency}
Code               : ${code}
Ngày đi            : ${travelDate}
Lịch trình         : ${route}
Loại xe            : ${vehicle}
Số lượng khách     : ${pax}
Tên khách          : ${customerString}
Giờ đón            : ${pickupTime}
Điểm đón           : ${pickupPoint}
Điểm trả           : ${dropPoint}
Giá vé             : ${price}
Note               : ${note}
Lưu ý              : Các điểm bao gồm đón bên em hẹn đón theo thời gian quy định đã hẹn nếu khách không chuẩn bị kịp thì đại lí báo khách tự đến văn phòng hộ bên e
${staff} xác nhận booking
Anh chị vui lòng check lại thông tin giúp em, em cảm ơn ạ`;

    // 4 Cột Excel: ĐIỂM ĐÓN [Tab] ĐIỂM TRẢ [Tab] TÊN/CODE [Tab] SL
    const excel4Cols = `${pickupPoint}\t${dropPoint}\t${customerString}\t${pax}`;

    return {
      topMention,
      agency,
      code,
      originalCode: data.originalCode || '',
      travelDate,
      dayMonthKey,
      route,
      vehicle,
      pax,
      customerString,
      pickupTime,
      pickupPoint,
      dropPoint,
      price,
      note,
      staff,
      zaloMsg,
      excel4Cols,
      model: usedModel,
      isAiGenerated: true
    };
  }
};

if (typeof module !== 'undefined') module.exports = GeminiService;
if (typeof window !== 'undefined') window.GeminiService = GeminiService;
