# 🚀 BẮT ĐẦU TẠI ĐÂY

## ⚠️ QUAN TRỌNG: Port MySQL đã thay đổi

MySQL đã được cấu hình chạy trên **PORT 3307** thay vì 3306 để tránh xung đột với MySQL hiện có trên máy bạn.

---

## 🎯 Khởi động nhanh (3 bước)

### Bước 1: Kiểm tra ports (Tùy chọn)

**Windows:**
```cmd
check-ports.bat
```

**Mac/Linux:**
```bash
chmod +x check-ports.sh
./check-ports.sh
```

### Bước 2: Khởi động ứng dụng

**Windows:**
```cmd
docker-compose up --build
```

Hoặc double-click file `start.bat`

**Mac/Linux:**
```bash
docker-compose up --build
```

Hoặc:
```bash
chmod +x start.sh
./start.sh
```

### Bước 3: Truy cập ứng dụng

Mở trình duyệt: **http://localhost:3000**

---

## 🔑 Tài khoản test

```
Username: player1
Password: password123
```

---

## 🗄️ Kết nối MySQL

### Từ MySQL Workbench

```
Host:     localhost
Port:     3307  ← QUAN TRỌNG! (Đã đổi từ 3306)
Database: poker_db
Username: poker_user
Password: poker_password
```

### Từ Command Line

```bash
docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db
```

---

## 📊 Các Port đang sử dụng

| Service  | Port | URL                      |
|----------|------|--------------------------|
| Frontend | 3000 | http://localhost:3000    |
| Backend  | 8080 | http://localhost:8080    |
| MySQL    | 3307 | localhost:3307           |

---

## 🛠️ Các lệnh hữu ích

### Dừng ứng dụng
```bash
docker-compose down
```

### Xem logs
```bash
docker-compose logs -f
```

### Reset database
```bash
docker-compose down -v
docker-compose up --build
```

### Kiểm tra containers
```bash
docker ps
```

---

## 📚 Tài liệu

- **QUICKSTART.md** - Hướng dẫn nhanh
- **README.md** - Tổng quan dự án
- **MYSQL_GUIDE.md** - Hướng dẫn MySQL chi tiết
- **PORT_CHANGE_GUIDE.md** - Chi tiết về thay đổi port
- **SETUP.md** - Hướng dẫn cài đặt đầy đủ
- **API.md** - API documentation
- **ARCHITECTURE.md** - Kiến trúc hệ thống

---

## ❓ Gặp vấn đề?

### Port vẫn bị xung đột?

Đọc file **PORT_CHANGE_GUIDE.md** để biết cách đổi sang port khác.

### MySQL không kết nối được?

```bash
# Kiểm tra container
docker ps | grep mysql

# Xem logs
docker-compose logs mysql

# Restart
docker-compose restart mysql
```

### Backend không chạy?

```bash
# Xem logs
docker-compose logs backend

# Restart
docker-compose restart backend
```

---

## 🎮 Cách chơi

1. **Đăng nhập** hoặc đăng ký tài khoản mới
2. **Tạo phòng** hoặc tham gia phòng có sẵn
3. Chờ ít nhất **2 người chơi**
4. Game tự động bắt đầu
5. Sử dụng các nút: **Fold**, **Check**, **Call**, **Raise**

---

## ✨ Tính năng

✅ Đăng nhập/Đăng ký với JWT  
✅ Tạo và tham gia phòng chơi  
✅ Chơi Poker real-time với WebSocket  
✅ Bảng xếp hạng người chơi  
✅ Giao diện responsive (desktop & mobile)  
✅ Quản lý chip và lịch sử game  

---

## 🔧 Tech Stack

- **Frontend:** React.js + WebSocket
- **Backend:** Spring Boot + JWT
- **Database:** MySQL (Port 3307)
- **Deploy:** Docker + Docker Compose

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Đọc file **SETUP.md** hoặc **MYSQL_GUIDE.md**
2. Kiểm tra logs: `docker-compose logs`
3. Tạo issue trên GitHub

---

**Chúc bạn chơi vui vẻ! 🎰🃏**
