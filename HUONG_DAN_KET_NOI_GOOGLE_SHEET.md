# HƯỚNG DẪN KẾT NỐI HỆ THỐNG VỚI GOOGLE SHEET (THẾ LONG TRAVEL)

Cơ chế này giúp giải quyết dứt điểm vấn đề: **"Xác nhận trên Zalo xong nhưng quên không vào Google Sheet"**.

---

## ⚡ NGUYÊN LÝ HOẠT ĐỘNG:
Khi nhân viên dán booking vào Web và bấm:
👉 **[ ⚡ XÁC NHẬN & ĐẨY VÀO GOOGLE SHEET NGAY ]**

1. **Hệ thống tự động bắn dữ liệu vào file Google Sheet "Lệnh Điều Xe" (Ảnh 3)** trước tiên.
2. Khi Google Sheet xác nhận đã lưu thành công, hệ thống **tự động sao chép form xác nhận Zalo** vào bộ nhớ tạm.
3. Nhân viên chỉ việc quay sang Zalo bấm `Ctrl + V` gửi cho khách/đại lý.
4. **Không bao giờ có chuyện gửi tin Zalo rồi mà sót cuốc trong Google Sheet!**

---

## 🛠️ CÁC BƯỚC CÀI ĐẶT (CHỈ MẤT 1 PHÚT - LÀM 1 LẦN DUY NHẤT):

### Bước 1: Mở Apps Script trong Google Sheet của bạn
1. Mở file Google Sheet **"Lệnh Điều Xe"** của Thế Long Travel trên trình duyệt.
2. Trên thanh menu trên cùng, bấm: **Tiện ích mở rộng (Extensions)** $\rightarrow$ **Apps Script**.

### Bước 2: Dán mã kết nối
1. Xóa hết code trắng mặc định.
2. Mở file [google_apps_script.js](file:///c:/Users/Mon/Desktop/system%20booking/google_apps_script.js) trong thư mục này, copy toàn bộ nội dung và dán vào.
3. Bấm biểu tượng **Lưu (Save - hình đĩa mềm)**.

### Bước 3: Triển khai Webhook
1. Ở góc trên bên phải, bấm nút xanh **Triển khai (Deploy)** $\rightarrow$ Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng ⚙️ bên cạnh "Chọn loại" $\rightarrow$ Chọn **Ứng dụng web (Web app)**.
3. Điền cấu hình như sau:
   - **Mô tả:** Đồng bộ Booking Thế Long
   - **Thực thi dưới dạng (Execute as):** `Tôi` (Địa chỉ email của bạn)
   - **Ai có quyền truy cập (Who has access):** `Bất kỳ ai` (Anyone)  *(BẮT BUỘC CHỌN CÁI NÀY để Web đẩy được dữ liệu vào Sheet)*.
4. Bấm nút **Triển khai (Deploy)**.
5. Google sẽ hiện bảng cấp quyền $\rightarrow$ Bấm **Xem lại quyền** $\rightarrow$ Chọn tài khoản của bạn $\rightarrow$ Bấm **Nâng cao (Advanced)** $\rightarrow$ Bấm **Đi tới... (không an toàn)** $\rightarrow$ Bấm **Cho phép (Allow)**.

### Bước 4: Dán link vào Web App
1. Copy đường link **"URL của ứng dụng web"** (đường link có đuôi kết thúc bằng `/exec`).
2. Mở trang Web điều hành lên: Bấm nút **"Kết Nối Google Sheet"** ở góc trên bên phải.
3. Dán đường link vừa copy vào ô $\rightarrow$ Bấm **"Thử kết nối"** $\rightarrow$ Bấm **"Lưu Cấu Hình"**.

Từ lúc này, chấm tròn sẽ chuyển sang **Xanh lá (Đã kết nối sẵn sàng)**. Mọi booking dán vào sẽ tự động bay thẳng vào Google Sheet!
