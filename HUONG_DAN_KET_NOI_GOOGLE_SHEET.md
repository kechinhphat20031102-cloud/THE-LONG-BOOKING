# HƯỚNG DẪN ĐỐI SOÁT VỚI GOOGLE SHEET (THẾ LONG TRAVEL)

Web **chỉ đọc** Google Sheet "Lệnh Điều Xe" để đối soát. Web **không ghi** gì vào Sheet. Nhân viên vẫn nhập cuốc vào Sheet bằng tay như bình thường.

---

## ⚡ CÁCH HOẠT ĐỘNG

1. Dán tin booking vào web, bấm tạo form. Web tự nhận ngày đi và chuyển sang tab ngày đó (ví dụ `25/11`).
2. Web tải dữ liệu tab đó từ Google Sheet (chế độ chỉ xem).
3. Bấm **Kiểm tra / Đối soát**: web tìm cuốc trên Sheet theo:
   - **Số điện thoại** (so 9 số cuối), hoặc
   - **Tên khách**: phải trùng **đủ tất cả các chữ** trong tên (bỏ qua Mr/Mrs/anh/chị…). Trùng một chữ như "Nguyen" thì không tính.
   - Mã đặt chỗ, đại lý, điểm đón: khi chọn các tiêu chí đó.
4. Kết quả:
   - ✅ **Đã có trên Sheet**: tìm thấy cuốc khớp.
   - ⚠️ **Chưa thấy**: cần kiểm tra lại với điều hành.
   - ⚠️ **Chưa đối soát được ngày …**: không tải được tab của ngày đó (xem bên dưới).

---

## 🛠️ YÊU CẦU VỚI GOOGLE SHEET

- Sheet để chế độ **"Bất kỳ ai có đường liên kết đều có thể xem"** (chỉ xem). Không cần quyền sửa.
- Mỗi ngày một tab, **tên tab đúng dạng `ngày/tháng`, không có số 0 ở đầu**: `1/12`, `25/12`, không viết `01/12`.
- Dòng đầu tab ghi ngày dạng `NGÀY 1 THÁNG 12 NĂM 2026` như mẫu hiện tại. Web dùng dòng này để chắc chắn đã tải đúng tab. Nếu tab chưa có, Google sẽ trả về tab khác và web sẽ báo lỗi thay vì đối soát nhầm ngày.

---

## ⚠️ LƯU Ý BẢO MẬT

Ai có ID Sheet (nằm trong `app.js`) đều xem được Sheet, gồm cả tên và số điện thoại khách. Không gửi link Sheet hoặc link web ra ngoài.

---

File `google_apps_script.js` là phần ghi tự động vào Sheet từ phiên bản cũ. Hiện **không dùng**, không cần cài.
