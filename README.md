# Poker Game Application

Ứng dụng chơi Poker đầy đủ với kiến trúc Frontend (React.js) - Backend (Spring Boot) - Database (MySQL), triển khai bằng Docker.

## Tính năng

### Frontend (React.js)
- Đăng nhập/Đăng ký người chơi
- Trang chơi Poker với giao diện trực quan
- Hiển thị bài người chơi, bài chung, số chip
- Các nút hành động: Check, Call, Raise, Fold
- Bảng xếp hạng người chơi
- Quản lý phòng chơi
- Giao tiếp real-time qua WebSocket
- Responsive design (desktop & mobile)

### Backend (Spring Boot)
- Quản lý người dùng và xác thực (JWT)
- Tạo và quản lý phòng chơi
- Logic game Poker (chia bài, tính kết quả)
- Cập nhật chip và lịch sử ván bài
- REST API và WebSocket
- Bảo mật và chống gian lận

### Database (MySQL)
- Lưu trữ thông tin người dùng
- Lịch sử ván bài
- Bảng xếp hạng
- Thông tin phòng chơi

## Yêu cầu hệ thống

- Docker Desktop
- Docker Compose
- Port 3000 (Frontend), 8080 (Backend), 3307 (MySQL) phải trống

**Lưu ý:** MySQL chạy trên port 3307 thay vì 3306 để tránh xung đột với MySQL khác trên máy bạn.

## Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd poker-app
```

### 2. Chạy toàn bộ ứng dụng bằng Docker Compose
```bash
docker-compose up --build
```

Lệnh này sẽ:
- Build và chạy MySQL database
- Build và chạy Spring Boot backend
- Build và chạy React frontend

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MySQL**: localhost:3307 (đã đổi từ 3306 để tránh xung đột)

### 4. Dừng ứng dụng
```bash
docker-compose down
```

### 5. Xóa dữ liệu và khởi động lại
```bash
docker-compose down -v
docker-compose up --build
```

## Cấu trúc thư mục

```
poker-app/
├── frontend/              # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── pages/        # Page components
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── backend/              # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
├── database/             # MySQL scripts
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập

### User
- `GET /api/users/profile` - Lấy thông tin người dùng
- `GET /api/users/leaderboard` - Bảng xếp hạng

### Room
- `GET /api/rooms` - Danh sách phòng chơi
- `POST /api/rooms` - Tạo phòng mới
- `POST /api/rooms/{id}/join` - Tham gia phòng

### Game (WebSocket)
- `/ws/game` - WebSocket endpoint cho game real-time

## Tài khoản mặc định

Sau khi khởi động, bạn có thể đăng ký tài khoản mới hoặc sử dụng tài khoản test:
- Username: `player1`
- Password: `password123`

## Phát triển

### Chạy riêng từng service

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Database
```bash
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=poker_db \
  mysql:8.0
```

## Troubleshooting

### Port đã được sử dụng
Nếu gặp lỗi port đã được sử dụng, thay đổi port trong `docker-compose.yml`

### Database connection failed
Đảm bảo MySQL container đã khởi động hoàn toàn trước khi backend kết nối (có thể mất 30-60 giây)

### Frontend không kết nối được backend
Kiểm tra CORS settings trong backend và API URL trong frontend

## License

MIT License
