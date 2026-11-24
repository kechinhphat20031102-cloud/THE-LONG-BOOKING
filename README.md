# Thế Long Travel – Xác Nhận & Đối Soát Booking

Hệ thống quản lý, chuẩn hóa tin nhắn booking thô thành Form Zalo và đối soát thông minh với Google Sheet dành cho **Thế Long Travel**.

## 🚀 Tính Năng Chính
- **Bóc tách thông minh**: Hỗ trợ tin nhắn Zalo, mã vé Vexere, 12Go, vé tiếng Anh/tiếng Việt.
- **Tùy chọn AI Gemini**: Tích hợp Google Gemini API để xử lý ngôn ngữ tự nhiên, tự động fallback phân tích cục bộ khi mạng chậm / API bận.
- **Quy tắc Thế Long Travel**: Tự động tính khung giờ hẹn đón (15–30 phút trước xuất phát), chuẩn hóa đại lý và mã code `tlDDMMYY`.
- **Xuất dữ liệu 4 cột Excel**: Phục vụ dán trực tiếp vào bảng theo dõi (`Đón | Trả | Tên/Code | SL`).
- **Đối soát Google Sheet**: Kiểm tra trực tiếp với Google Sheet điều hành thời gian thực.
- **Lưu lịch sử booking**: Hỗ trợ lưu trữ cục bộ (`localStorage`) khi chạy trên web (Vercel/GitHub Pages) và SQLite khi chạy với server nội bộ.

## 🛠️ Triển Khai (Deploy)
Dự án được xây dựng dưới dạng ứng dụng Web Frontend thuần (HTML, TailwindCSS, JavaScript), có thể chạy offline hoặc deploy lên bất kỳ nền tảng tĩnh nào như Vercel, Netlify, GitHub Pages.
