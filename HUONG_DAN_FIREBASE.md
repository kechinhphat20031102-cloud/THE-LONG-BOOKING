# Đồng bộ "Booking đã xác nhận Zalo" giữa các máy bằng Firebase

Sau khi cài xong, mọi máy mở **thelongtravel.vercel.app**, file .bat hay địa chỉ LAN đều thấy **cùng một danh sách**. Khi máy A xác nhận một cuốc, máy B thấy cuốc đó sau khoảng 1 giây mà không cần tải lại trang. File Google Sheet "Lệnh Điều Xe" **không bị đụng tới**.

Gói miễn phí (Spark) của Firebase là đủ dùng: mỗi ngày được 50.000 lượt đọc và 20.000 lượt ghi.

## Bước 1: Tạo dự án Firebase (khoảng 3 phút)
1. Vào https://console.firebase.google.com và đăng nhập bằng tài khoản Google của công ty.
2. Bấm **Create a project**, đặt tên `thelong-booking`. Bước Google Analytics có thể tắt.
3. Ở menu bên trái, vào **Build > Firestore Database > Create database**. Chọn vùng **asia-southeast1 (Singapore)**, chọn chế độ **Production mode**.

## Bước 2: Bật đăng nhập ẩn danh (không cần tạo tài khoản)
1. Vào **Build > Authentication > Get started**.
2. Ở tab **Sign-in method**, chọn **Anonymous** rồi bật **Enable** và bấm **Save**.
   Nhân viên không phải đăng nhập gì. Web tự kết nối, và nhân viên chỉ chọn tên ở góc trên như hiện nay.

## Bước 3: Dán quy tắc bảo mật
1. Vào **Firestore Database > Rules**.
2. Dán toàn bộ nội dung file `firestore.rules` rồi bấm **Publish**.

**Lưu ý về bảo mật:** vì không có đăng nhập, ai có link web cũng xem được danh sách booking (tên và số điện thoại khách), giống như ai có link Sheet gốc cũng xem được nếu Sheet đang mở công khai. Quy tắc trên chỉ chặn ghi dữ liệu sai khuôn dạng. Sau này nếu cần chặn người ngoài, chỉ cần thêm 1 tài khoản dùng chung mà không phải đổi lại cấu trúc.

## Bước 4: Lấy cấu hình gửi cho Claude
1. Bấm biểu tượng bánh răng ⚙️ rồi chọn **Project settings**. Ở mục **Your apps**, bấm biểu tượng **</>** (Web) và đặt tên `web`. Không cần chọn Hosting.
2. Copy đoạn `firebaseConfig = { apiKey: ..., projectId: ... }` rồi gửi lại cho Claude, hoặc tự dán vào file `firebase_config.js`.
   Đoạn cấu hình này được phép nằm công khai trong web. Phần bảo vệ dữ liệu là quy tắc ở Bước 3.
3. Vào **Authentication > Settings > Authorized domains** và thêm `thelongtravel.vercel.app`. `localhost` thường đã có sẵn.

## Bước 5: Mở web trên từng máy
Không cần làm gì thêm. Lịch sử cũ đang lưu trong trình duyệt của từng máy (ví dụ 9 cuốc trên máy MON) sẽ **tự được đưa lên Firebase** ngay lần đầu mở web bản mới, và các cuốc trùng sẽ được bỏ qua. Bản cũ trong trình duyệt vẫn được giữ lại để dự phòng.

Riêng lịch sử trong `data/bookings.sqlite` của máy chạy .bat không tự chuyển được. Muốn đưa lên, bạn mở web qua .bat, bấm **Xuất bản sao**, rồi mở web bản mới và bấm **Nhập lịch sử cũ**.

## Thay đổi trong code (thư mục `firebase_sync_draft/`)
- `booking_history_firebase.js` (mới): lưu mỗi cuốc thành 1 bản ghi riêng, nên 2 máy lưu cùng lúc không ghi đè nhau. App nhận thay đổi từ máy khác ngay lập tức và vẫn chạy được khi mất mạng (có mạng lại sẽ tự đẩy lên). App chỉ tải các cuốc trong 60 ngày gần nhất.
- `firebase_config.js` (mới): nơi dán cấu hình. Nếu để trống, app chạy y như cũ.
- `firestore.rules` (mới): quy tắc bảo mật.
- `index.html`: thêm 2 dòng nạp 2 file mới.
- `app.js`: sửa 2 dòng, gồm (1) id cuốc mới không trùng giữa các máy và (2) dòng trạng thái hiện "Đã lưu lên Firebase".
- `test_firebase_sync.js`: kiểm thử phần so sánh, ghi và gộp lịch sử. Chạy bằng `node test_firebase_sync.js`.
