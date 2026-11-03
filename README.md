# 🏛️ Chánh Điện AI Pro & Quần Thể Chùa 3D (Tam Chúc / Bái Đính)

Dự án mô phỏng 3D Quần thể Chùa & Chánh Điện Tam Thế trực quan thời gian thực, tích hợp công nghệ WebGL (Three.js), WebSocket tương tác đa người dùng, chú tiểu Chibi Phật giáo và trợ lý giải quẻ AI.

---

## 🌟 Tính Năng Nổi Bật

* **Quần Thể Chùa 3D Hoành Tráng:** Cổng Tam Quan, Cầu Bán Nguyệt, Hồ Sen Ánh Nguyệt, Tháp Chuông, Tháp Trống, Bảo Tháp Xá Lợi 13 Tầng, Tượng Phật Bà Quan Âm lộ thiên và non nước Ninh Bình / Tam Chúc.
* **Chánh Điện Tam Thế Nguy Nga (Chuẩn Thực Tế):**
  * 3 pho đại tượng Tam Thế Phật dát vàng với **Lá Bồ Đề Hào Quang (Mandorla)** cao vút 10m.
  * Hoành phi sơn son thếp vàng **"TAM ĐỨC TÍNH LINH"** & **"ĐẠI HÙNG BẢO ĐIỆN"**.
  * Liễn câu đối chữ Hán/Quốc ngữ dọc 4 thân cột gỗ lim đồ sộ và cờ Phật giáo ngũ sắc.
  * Đôi Hạc đồng cưỡi lưng rùa chầu án thờ gấm đỏ, lư hương trầm, hoa sen, chân nến.
  * Chuông U Minh & Trống Bát Nhã ngay trong điện.
  * Thảm đỏ chính diện, chiếu cói và hàng bồ đoàn tọa thiền.
  * Đạo tràng Chư Tăng & Phật tử tọa thiền (Bật/Tắt tùy biến).
* **Mô Hình Nhân Vật Chibi Chú Tiểu:** Dáng đi lon ton dễ thương, áo tràng, cà sa vàng vắt vai, chuỗi tràng hạt bồ đề 108 hạt.
* **Nghi Thức Cúng Bái Tâm Linh 3D:** Gõ Mõ, Thỉnh Chuông, Gióng Trống, Dâng Hương, Dâng Hoa Sen, An Tọa Thiền, Bái Phật 🙏, và **Xin Quẻ Trúc Trợ Lý AI**.
* **Đồng Bộ Thời Gian Thực:** WebSocket kết nối đa người dùng (PC, điện thoại).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Server

### 1. Cài đặt thư viện Python:
```bash
pip install -r requirements.txt
```

### 2. Cấu hình file `.env` (tùy chọn cho tính năng AI):
Tạo file `.env` từ `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Khởi chạy Server:
```bash
python server.py
```
Hoặc nhấp đúp vào `start_server.bat`.

### 4. Truy cập giao diện:
* **Quần Thể Chùa 3D:** [http://localhost:8000/world3d](http://localhost:8000/world3d)
* **Giao Diện Tham Gia Di Động:** [http://localhost:8000/join](http://localhost:8000/join)
* **Ban Thờ Nghi Thức 2.5D:** [http://localhost:8000/overlay](http://localhost:8000/overlay)
* **Bảng Điều Khiển Live:** [http://localhost:8000/control](http://localhost:8000/control)

---

## 💻 Chỉnh Sửa Ở Bất Kỳ Đâu Qua Trình Duyệt

Khi mở kho lưu trữ này trên GitHub tại bất kỳ máy tính nào:
* Nhấn phím **`.` (dấu chấm)** trên bàn phím: Trình duyệt sẽ mở ngay lập tức giao diện soạn thảo **VS Code nền web (`github.dev`)** để chỉnh sửa code trực tiếp từ xa mà không cần cài đặt phần mềm.
