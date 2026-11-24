/**
 * ====================================================================
 * GOOGLE APPS SCRIPT CHO THẾ LONG TRAVEL - ĐIỀU XE & TỰ ĐỘNG ĐỒNG BỘ
 * ====================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT (CHỈ MẤT 1 PHÚT):
 * 1. Mở file Google Sheet "Lệnh Điều Xe" của Thế Long Travel.
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết code cũ (nếu có), dán toàn bộ đoạn mã này vào.
 * 4. Nhấn nút "Triển khai" (Deploy) ở góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment).
 * 5. Chọn loại: "Ứng dụng web" (Web app).
 * 6. Cấu hình:
 *    - Mô tả: "Đồng bộ Booking Thế Long Travel"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> Rất quan trọng!
 * 7. Nhấn "Triển khai" (Deploy) -> Cấp quyền truy cập cho tài khoản Google của bạn.
 * 8. Copy đường link "URL của ứng dụng web" (kết thúc bằng /exec) và dán vào Web App trên máy tính!
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Google Sheet Thế Long Travel đã kết nối thành công và sẵn sàng nhận booking!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet(); // Lấy sheet đang mở hoặc sheet đầu tiên

    // Chuẩn bị dữ liệu 7 cột chuẩn theo Ảnh 3 (Lệnh điều xe)
    // Cột: ĐẠI LÝ | ĐIỂM ĐÓN | ĐIỂM TRẢ | TÊN/CODE | SL | GIỜ ĐÓN | GHI CHÚ
    var agency = data.agency || "";
    var pickupPoint = data.pickupPoint || "";
    var dropPoint = data.dropPoint || "";
    var customerString = data.customerString || "";
    var pax = parseInt(data.pax, 10) || 1;
    var pickupTime = data.pickupTime || "";
    var note = (data.route || "") + " (" + (data.vehicle || "") + ") - Code: " + (data.code || "");

    // Tìm dòng thích hợp để chèn (Chèn trước dòng TỔNG hoặc chèn vào cuối bảng)
    var lastRow = sheet.getLastRow();
    var insertRowIndex = lastRow + 1;

    // Quét tìm dòng chữ "TỔNG" ở cột E hoặc F để chèn ngay phía trên dòng TỔNG
    for (var r = 1; r <= lastRow; r++) {
      var cellVal = sheet.getRange(r, 5).getValue().toString().toUpperCase() + " " +
                     sheet.getRange(r, 6).getValue().toString().toUpperCase();
      if (cellVal.indexOf("TỔNG") !== -1) {
        sheet.insertRowBefore(r);
        insertRowIndex = r;
        break;
      }
    }

    // Nếu không tìm thấy chữ TỔNG thì thêm dòng mới ở cuối
    if (insertRowIndex > lastRow) {
      sheet.appendRow([agency, pickupPoint, dropPoint, customerString, pax, pickupTime, note]);
      insertRowIndex = sheet.getLastRow();
    } else {
      sheet.getRange(insertRowIndex, 1, 1, 7).setValues([[
        agency, pickupPoint, dropPoint, customerString, pax, pickupTime, note
      ]]);
    }

    // Định dạng viền và căn giữa cột SL, Giờ đón
    sheet.getRange(insertRowIndex, 5).setHorizontalAlignment("center");
    sheet.getRange(insertRowIndex, 6).setHorizontalAlignment("center");

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu booking vào Google Sheet thành công!",
      row: insertRowIndex,
      bookingCode: data.code,
      pax: pax,
      customer: customerString
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
