# 🃏 Poker Game - Hướng dẫn nhanh

## Khởi động nhanh (3 bước)

### 1. Cài đặt Docker Desktop
Tải và cài đặt Docker Desktop từ: https://www.docker.com/products/docker-desktop

### 2. Khởi động ứng dụng

**Windows:**
```cmd
docker-compose up --build
```

**Mac/Linux:**
```bash
docker-compose up --build
```

Hoặc chạy script:
- Windows: Double-click `start.bat`
- Mac/Linux: `chmod +x start.sh && ./start.sh`

### 3. Truy cập ứng dụng
Mở trình duyệt: http://localhost:3000

## Tài khoản test

- **Username:** player1
- **Password:** password123

## Chơi game

1. Đăng nhập hoặc đăng ký tài khoản mới
2. Tạo phòng mới hoặc tham gia phòng có sẵn
3. Chờ ít nhất 2 người chơi
4. Game tự động bắt đầu
5. Sử dụng các nút: **Fold**, **Check**, **Call**, **Raise**

## Dừng ứng dụng

Nhấn `Ctrl + C` hoặc:
```bash
docker-compose down
```

## Xem thêm

- [README.md](README.md) - Tổng quan dự án
- [SETUP.md](SETUP.md) - Hướng dẫn chi tiết
- [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc hệ thống

## Gặp vấn đề?

### Port đã được sử dụng
```bash
docker-compose down
# Đợi 10 giây
docker-compose up --build
```

### Reset toàn bộ
```bash
docker-compose down -v
docker-compose up --build
```

### Xem logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## Tính năng chính

✅ Đăng nhập/Đăng ký với JWT  
✅ Tạo và tham gia phòng chơi  
✅ Chơi Poker real-time với WebSocket  
✅ Bảng xếp hạng người chơi  
✅ Giao diện responsive (desktop & mobile)  
✅ Quản lý chip và lịch sử game  

## Tech Stack

- **Frontend:** React.js + WebSocket
- **Backend:** Spring Boot + JWT
- **Database:** MySQL
- **Deploy:** Docker + Docker Compose

---

**Chúc bạn chơi vui vẻ! 🎰**
