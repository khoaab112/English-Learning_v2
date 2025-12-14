# Idea_v1 – Ứng dụng học tiếng Anh

## 1. Tổng quan

Ứng dụng học tiếng Anh tập trung vào các kỹ năng:

* Nghe và ghi chép (dictation)
* Nghe và dịch sang tiếng Việt
* Đọc và dịch sang tiếng Việt

Mục tiêu chính:

* Luyện khả năng nghe – hiểu – diễn đạt
* Chấm điểm linh hoạt, không máy móc
* Có hệ thống quản trị nội dung và người dùng rõ ràng

Phạm vi hiện tại (MVP): **chỉ tập trung vào các chức năng cốt lõi**, chưa mở rộng AI nâng cao hay tính năng xã hội.

---

## 2. Công nghệ & môi trường triển khai

### 2.1. Runtime & Version

* Node.js: **v24.11.1**

### 2.2. Backend

* Nền tảng: **Node.js (NestJS)**
* Kiến trúc: Monolith (MVP)
* Giao tiếp: REST API
* Auth: JWT (access / refresh token) , check các chức năng login, xác thực , logout , hết hạn

### 2.3. Frontend

* Framework: **Vue.js 3**
* Build tool: Vite
* State management: Pinia
* Routing: Vue Router

### 2.4. Database

* Hệ quản trị: **MySQL 8**
* Database name: **learn_el**

### 2.5. Lưu trữ & khác

* Audio: Cloud Storage (lưu URL trong DB)
* Triển khai: Docker (dev / prod)

---

## 3. Hệ thống người dùng

### 2.1. ADMIN (Quản trị)

#### Quản lý tài khoản

* Xem danh sách người dùng
* Kích hoạt / khóa tài khoản
* Hỗ trợ reset mật khẩu (nếu cần)

#### Quản lý nội dung học

* Thêm / sửa / xóa kho từ vựng
* Thêm / sửa / xóa bài nghe (audio + transcript)
* Phân loại nội dung:

  * Theo mức độ: dễ / trung bình / khó
  * Theo độ dài audio

#### Thông báo & giao tiếp

* Gửi thông báo:

  * Toàn bộ người dùng
  * Một nhóm người dùng
  * Người dùng cụ thể
* Nhắn tin 1–1 với người dùng (hỗ trợ cơ bản)

---

### 2.2. CUSTOMER (Người dùng)

#### Đăng nhập & tài khoản

* Đăng nhập hệ thống
* Quên mật khẩu

#### Profile & Settings

* Cập nhật thông tin cá nhân
* Thay đổi mật khẩu
* Thiết lập học tập cá nhân:

  * Số từ vựng / bài học mỗi ngày
  * Có bắt buộc hoàn thành chỉ tiêu ngày hay không

---

## 3. Các chế độ học / kiểm tra

### 3.1. Nghe – Gõ lại tiếng Anh (Listening Dictation)

**Mô tả**

* Người dùng nghe một đoạn audio tiếng Anh
* Gõ lại nội dung bằng tiếng Anh

**Độ khó**

* Tăng dần theo:

  * Độ dài đoạn ghi âm
  * Tốc độ nói
  * Độ khó từ vựng

**Nguyên tắc chấm điểm**

* Không so sánh văn bản 100% cứng nhắc
* Cho phép:

  * Thiếu hoặc thừa một số từ nhỏ
  * Sai chính tả nhẹ
* Hệ thống chỉ rõ:

  * Vị trí thiếu từ
  * Vị trí sai từ
  * Những chỗ nghe nhầm

**Mục tiêu học tập**

* Rèn khả năng nghe chi tiết
* Giảm cảm giác bị chấm sai oan

---

### 3.2. Nghe – Dịch sang tiếng Việt

**Mô tả**

* Người dùng nghe audio tiếng Anh
* Nhập bản dịch tiếng Việt

**Cách đánh giá**

* Không so khớp câu chữ
* So sánh theo **ý nghĩa**
* Đánh giá:

  * Đúng ý chính
  * Thiếu ý
  * Hiểu sai ý

**Ghi chú**

* Có thể tích hợp AI để đánh giá ngữ nghĩa
* AI chỉ đóng vai trò chấm và phản hồi ngắn gọn

---

### 3.3. Đọc tiếng Anh – Gõ lại tiếng Việt

**Mô tả**

* Hiển thị đoạn văn tiếng Anh
* Người dùng gõ lại nội dung bằng tiếng Việt

**Cách đánh giá**

* Đánh giá theo mức độ hiểu nội dung
* Phân loại:

  * Đúng ý
  * Thiếu ý
  * Sai trọng tâm

**Ghi chú**

* Có thể dùng chung logic chấm với mode 3.2

---

## 4. Phạm vi triển khai hiện tại (MVP)

Bao gồm:

* Hệ thống đăng nhập
* Quản lý người dùng (admin & customer)
* Kho nội dung học (audio, text, vocabulary)
* 3 mode học chính:

  * Nghe – gõ lại tiếng Anh
  * Nghe – dịch sang tiếng Việt
  * Đọc – dịch sang tiếng Việt

Chưa bao gồm:

* Speaking
* Gamification (ranking, streak, badge)
* Social / cộng đồng
* Cá nhân hóa nâng cao bằng AI

---

## 5. Mổ xẻ chi tiết mode học đầu tiên (MVP)

### 5.1. Mode: Nghe – Gõ lại tiếng Anh (Listening Dictation)

#### 5.1.1. Mục tiêu của mode

* Luyện khả năng nghe chi tiết (word-by-word)
* Giúp người học nhận ra chính xác mình nghe sai ở đâu
* Không tạo cảm giác bị chấm điểm quá khắt khe

---

#### 5.1.2. UI Flow (luồng giao diện)

**Màn hình 1: Chọn bài nghe**

* Danh sách bài nghe theo mức độ: Easy / Medium / Hard
* Hiển thị:

  * Độ dài audio
  * Mức độ
  * Trạng thái (chưa làm / đã làm)

**Màn hình 2: Làm bài**

* Audio player:

  * Play / Pause
  * Replay (giới hạn số lần nếu cần)
* Textarea để người dùng gõ nội dung nghe được
* Nút nộp bài (Submit)

**Màn hình 3: Kết quả & phản hồi**

* Hiển thị:

  * Đoạn gốc (ẩn/hiện)
  * Đoạn người dùng nhập
* Highlight:

  * Từ đúng
  * Từ sai
  * Từ bị thiếu
* Điểm số tổng quát
* Gợi ý cải thiện (ngắn gọn)

---

#### 5.1.3. Logic xử lý (Backend)

**Input**

* lesson_id
* user_id
* user_text

**Xử lý chính**

1. Lấy transcript chuẩn của bài nghe
2. Chuẩn hóa dữ liệu:

   * Lowercase
   * Loại bỏ ký tự đặc biệt không cần thiết
3. So khớp theo cụm từ / token:

   * Không yêu cầu trùng khớp 100%
   * Cho phép sai chính tả nhẹ
4. Xác định:

   * Đúng
   * Sai
   * Thiếu
5. Tính điểm dựa trên tỷ lệ đúng

**Output**

* score
* danh sách lỗi (vị trí + loại lỗi)
* feedback ngắn

---

#### 5.1.4. Dữ liệu cần lưu (Database)

**Bảng lessons**

* id
* audio_url
* transcript
* level
* duration

**Bảng user_attempts**

* id
* user_id
* lesson_id
* user_text
* score
* created_at

**Bảng user_errors (tuỳ chọn)**

* user_id
* lesson_id
* error_word
* error_type (missing / wrong)
* created_at

---

#### 5.1.5. Ghi chú triển khai

* Chưa cần AI cho mode này ở MVP
* Toàn bộ logic chấm điểm có thể xử lý bằng backend
* UI cần ưu tiên rõ ràng, dễ nhìn lỗi

---

## 6. Định hướng mở rộng (sau này)

* Áp dụng logic tương tự cho các mode còn lại
* Tái sử dụng dữ liệu lỗi để cá nhân hóa bài học
* Nâng cấp thuật toán chấm điểm khi cần

---

**Ghi chú cuối**

Tài liệu này tiếp tục được dùng làm nền tảng để:

* Thiết kế UI chi tiết
* Viết API backend
* Phân chia task phát triển

