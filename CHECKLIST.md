# ✅ Checklist - Khởi động Poker Game

## Trước khi bắt đầu

- [ ] Đã cài đặt Docker Desktop
- [ ] Docker Desktop đang chạy
- [ ] Đã đọc file **IMPORTANT_PORT_CHANGE.txt**
- [ ] Hiểu rằng MySQL chạy trên port **3307** (không phải 3306)

## Kiểm tra ports

- [ ] Port 3000 trống (Frontend)
- [ ] Port 8080 trống (Backend)  
- [ ] Port 3307 trống (MySQL mới)
- [ ] Port 3306 có thể đang được MySQL cũ sử dụng (OK, không sao)

**Chạy script kiểm tra:**
```bash
# Windows
check-ports.bat

# Mac/Linux
./check-ports.sh
```

## Khởi động ứng dụng

- [ ] Mở terminal/command prompt
- [ ] Di chuyển vào thư mục project
- [ ] Chạy lệnh: `docker-compose up --build`
- [ ] Chờ 3-5 phút cho lần đầu build
- [ ] Thấy log "Started PokerApplication" (Backend ready)
- [ ] Thấy log "ready for connections" (MySQL ready)

## Kiểm tra ứng dụng

- [ ] Mở trình duyệt: http://localhost:3000
- [ ] Thấy trang đăng nhập
- [ ] Đăng nhập với: `player1` / `password123`
- [ ] Vào được Lobby
- [ ] Thấy danh sách phòng chơi

## Kiểm tra MySQL

### Từ Command Line
- [ ] Chạy: `docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db`
- [ ] Kết nối thành công
- [ ] Chạy: `SHOW TABLES;`
- [ ] Thấy 5 tables: users, rooms, room_players, game_history, game_players

### Từ MySQL Workbench (Tùy chọn)
- [ ] Tạo connection mới
- [ ] Host: `localhost`, Port: **3307**
- [ ] Username: `poker_user`, Password: `poker_password`
- [ ] Test connection thành công
- [ ] Kết nối và xem dữ liệu

## Test chức năng

### Authentication
- [ ] Đăng ký tài khoản mới
- [ ] Đăng xuất
- [ ] Đăng nhập lại

### Lobby
- [ ] Xem danh sách phòng
- [ ] Tạo phòng mới
- [ ] Tham gia phòng

### Game (Cần 2+ người chơi)
- [ ] Mở 2 trình duyệt/tab
- [ ] Đăng nhập 2 tài khoản khác nhau
- [ ] Cả 2 vào cùng 1 phòng
- [ ] Game tự động bắt đầu
- [ ] Thấy bài được chia
- [ ] Test các nút: Fold, Check, Call, Raise

### Leaderboard
- [ ] Click "Bảng xếp hạng"
- [ ] Thấy danh sách người chơi
- [ ] Thấy thống kê: chips, wins, losses, win rate

## Troubleshooting

### Nếu Frontend không load
- [ ] Kiểm tra: `docker ps | grep frontend`
- [ ] Xem logs: `docker-compose logs frontend`
- [ ] Restart: `docker-compose restart frontend`

### Nếu Backend không chạy
- [ ] Kiểm tra: `docker ps | grep backend`
- [ ] Xem logs: `docker-compose logs backend`
- [ ] Kiểm tra MySQL đã ready chưa
- [ ] Restart: `docker-compose restart backend`

### Nếu MySQL không kết nối
- [ ] Kiểm tra: `docker ps | grep mysql`
- [ ] Xem logs: `docker-compose logs mysql`
- [ ] Đảm bảo dùng port **3307** (không phải 3306)
- [ ] Restart: `docker-compose restart mysql`

### Nếu port bị xung đột
- [ ] Đọc file **PORT_CHANGE_GUIDE.md**
- [ ] Thay đổi port trong `docker-compose.yml`
- [ ] Restart: `docker-compose down && docker-compose up --build`

## Dừng ứng dụng

- [ ] Nhấn `Ctrl + C` trong terminal
- [ ] Hoặc chạy: `docker-compose down`
- [ ] Kiểm tra containers đã dừng: `docker ps`

## Reset database (Nếu cần)

- [ ] Dừng ứng dụng: `docker-compose down`
- [ ] Xóa volumes: `docker-compose down -v`
- [ ] Khởi động lại: `docker-compose up --build`
- [ ] Database sẽ được tạo mới với dữ liệu mẫu

## Backup database (Khuyến nghị)

- [ ] Chạy: `docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > backup.sql`
- [ ] Kiểm tra file `backup.sql` đã được tạo
- [ ] Lưu file backup ở nơi an toàn

## Tài liệu đã đọc

- [ ] **START_HERE.md** - Bắt đầu tại đây
- [ ] **IMPORTANT_PORT_CHANGE.txt** - Thông báo port
- [ ] **QUICKSTART.md** - Hướng dẫn nhanh
- [ ] **README.md** - Tổng quan
- [ ] **MYSQL_GUIDE.md** - Hướng dẫn MySQL
- [ ] **PORT_CHANGE_GUIDE.md** - Chi tiết port

## Ghi chú

```
Thông tin quan trọng:
- MySQL Port: 3307 (ĐÃ ĐỔI từ 3306)
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Test account: player1 / password123
```

## Hoàn thành! 🎉

- [ ] Ứng dụng chạy thành công
- [ ] Đã test các chức năng chính
- [ ] Đã kết nối được MySQL
- [ ] Sẵn sàng phát triển/sử dụng

---

**Nếu tất cả đều OK, bạn đã sẵn sàng chơi Poker! 🃏🎰**

Nếu gặp vấn đề, xem:
- **SETUP.md** - Hướng dẫn chi tiết
- **MYSQL_GUIDE.md** - Troubleshooting MySQL
- **PORT_CHANGE_GUIDE.md** - Vấn đề về port
