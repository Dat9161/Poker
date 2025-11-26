# Hướng dẫn cài đặt chi tiết - Poker Game Application

## Yêu cầu hệ thống

1. **Docker Desktop** (phiên bản mới nhất)
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/

2. **Docker Compose** (thường đi kèm với Docker Desktop)

3. **Port cần thiết phải trống:**
   - 3000 (Frontend)
   - 8080 (Backend)
   - 3306 (MySQL)

## Cài đặt từng bước

### Bước 1: Kiểm tra Docker

Mở terminal/command prompt và chạy:

```bash
docker --version
docker-compose --version
```

Nếu hiển thị version thì Docker đã sẵn sàng.

### Bước 2: Clone hoặc tải project

```bash
git clone <repository-url>
cd poker-app
```

### Bước 3: Khởi động ứng dụng

#### Trên Windows (Command Prompt):
```cmd
docker-compose up --build
```

#### Trên Windows (PowerShell):
```powershell
docker-compose up --build
```

#### Trên Mac/Linux:
```bash
docker-compose up --build
```

Lần đầu tiên sẽ mất 5-10 phút để tải và build tất cả.

### Bước 4: Chờ khởi động hoàn tất

Bạn sẽ thấy các log như:
- `poker-mysql | ready for connections` - MySQL đã sẵn sàng
- `poker-backend | Started PokerApplication` - Backend đã sẵn sàng
- `poker-frontend | Compiled successfully!` - Frontend đã sẵn sàng

### Bước 5: Truy cập ứng dụng

Mở trình duyệt và truy cập:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## Sử dụng ứng dụng

### Đăng ký tài khoản mới

1. Truy cập http://localhost:3000
2. Click "Đăng ký ngay"
3. Nhập thông tin:
   - Tên đăng nhập
   - Email
   - Mật khẩu
4. Click "Đăng ký"

### Hoặc sử dụng tài khoản có sẵn

- Username: `player1`
- Password: `password123`

### Chơi game

1. Sau khi đăng nhập, bạn sẽ vào Lobby
2. Tạo phòng mới hoặc tham gia phòng có sẵn
3. Chờ ít nhất 2 người chơi để bắt đầu
4. Game sẽ tự động bắt đầu khi đủ người
5. Sử dụng các nút: Fold, Check, Call, Raise

### Xem bảng xếp hạng

Click nút "Bảng xếp hạng" ở Lobby để xem top người chơi.

## Dừng ứng dụng

Nhấn `Ctrl + C` trong terminal đang chạy docker-compose.

Hoặc chạy lệnh:
```bash
docker-compose down
```

## Xóa dữ liệu và khởi động lại

Nếu muốn reset toàn bộ database:

```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

### Lỗi: Port đã được sử dụng

**Triệu chứng:** `Error: bind: address already in use`

**Giải pháp:**
1. Kiểm tra port nào đang bị chiếm:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :8080
   netstat -ano | findstr :3306
   
   # Mac/Linux
   lsof -i :3000
   lsof -i :8080
   lsof -i :3306
   ```

2. Dừng process đang chiếm port hoặc thay đổi port trong `docker-compose.yml`

### Lỗi: Backend không kết nối được database

**Triệu chứng:** Backend log hiển thị `Connection refused` hoặc `Unknown database`

**Giải pháp:**
1. Đảm bảo MySQL container đã khởi động hoàn toàn (chờ 30-60 giây)
2. Restart backend container:
   ```bash
   docker-compose restart backend
   ```

### Lỗi: Frontend không load được

**Triệu chứng:** Trang trắng hoặc lỗi 404

**Giải pháp:**
1. Kiểm tra log của frontend container:
   ```bash
   docker-compose logs frontend
   ```
2. Rebuild frontend:
   ```bash
   docker-compose up --build frontend
   ```

### Lỗi: CORS error

**Triệu chứng:** Console hiển thị `CORS policy` error

**Giải pháp:**
1. Kiểm tra file `backend/src/main/resources/application.yml`
2. Đảm bảo `cors.allowed-origins` có `http://localhost:3000`
3. Restart backend

### Lỗi: WebSocket không kết nối

**Triệu chứng:** Game không cập nhật real-time

**Giải pháp:**
1. Kiểm tra backend log
2. Đảm bảo WebSocket endpoint `/ws` hoạt động
3. Kiểm tra firewall không block WebSocket

## Phát triển (Development Mode)

### Chạy riêng từng service

#### 1. MySQL
```bash
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=poker_db \
  -e MYSQL_USER=poker_user \
  -e MYSQL_PASSWORD=poker_password \
  mysql:8.0
```

#### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
```

Hoặc trên Windows:
```cmd
cd backend
mvnw.cmd spring-boot:run
```

#### 3. Frontend
```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy ở http://localhost:3000 với hot-reload.

## Kiểm tra logs

### Xem tất cả logs
```bash
docker-compose logs
```

### Xem log của service cụ thể
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### Theo dõi log real-time
```bash
docker-compose logs -f backend
```

## Backup và Restore Database

### Backup
```bash
docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > backup.sql
```

### Restore
```bash
docker exec -i poker-mysql mysql -u poker_user -ppoker_password poker_db < backup.sql
```

## Cấu trúc Database

### Bảng chính:
- `users` - Thông tin người dùng
- `rooms` - Phòng chơi
- `room_players` - Người chơi trong phòng
- `game_history` - Lịch sử game
- `game_players` - Chi tiết người chơi trong game

### Truy cập MySQL trực tiếp
```bash
docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### User
- `GET /api/users/profile` - Thông tin user (cần JWT)
- `GET /api/users/leaderboard` - Bảng xếp hạng

### Room
- `GET /api/rooms` - Danh sách phòng (cần JWT)
- `GET /api/rooms/{id}` - Chi tiết phòng (cần JWT)
- `POST /api/rooms` - Tạo phòng (cần JWT)

### WebSocket
- `/ws` - WebSocket endpoint
- `/app/game/{roomId}/join` - Tham gia game
- `/app/game/{roomId}/action` - Thực hiện hành động
- `/topic/game/{roomId}` - Subscribe game updates

## Performance Tips

1. **Tăng memory cho Docker Desktop:**
   - Settings → Resources → Memory: tối thiểu 4GB

2. **Tối ưu build time:**
   - Sử dụng Docker layer caching
   - Không xóa images khi không cần thiết

3. **Production deployment:**
   - Sử dụng environment variables cho sensitive data
   - Enable HTTPS
   - Sử dụng reverse proxy (nginx)
   - Scale backend với multiple instances

## Liên hệ và hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `docker-compose logs`
2. Restart services: `docker-compose restart`
3. Rebuild: `docker-compose up --build`
4. Reset toàn bộ: `docker-compose down -v && docker-compose up --build`
