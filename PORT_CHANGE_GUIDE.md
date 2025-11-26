# 🔧 Hướng dẫn thay đổi Port MySQL

## Vấn đề

Port 3306 đã được sử dụng bởi MySQL khác trên máy của bạn.

## Giải pháp đã áp dụng

MySQL trong Docker đã được cấu hình chạy trên **port 3307** thay vì 3306.

## Thông tin kết nối mới

### Từ máy host (localhost)

```
Host: localhost
Port: 3307  ← ĐÃ THAY ĐỔI
Database: poker_db
Username: poker_user
Password: poker_password
```

### Từ bên trong Docker network

Backend vẫn kết nối qua port 3306 (internal) - không cần thay đổi gì.

## Cách sử dụng

### 1. Khởi động ứng dụng

```bash
docker-compose up --build
```

MySQL sẽ chạy trên port **3307** (không xung đột với MySQL hiện tại của bạn).

### 2. Kết nối MySQL từ command line

```bash
# Từ trong container (không đổi)
docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db

# Từ ngoài host (port 3307)
mysql -h 127.0.0.1 -P 3307 -u poker_user -ppoker_password poker_db
```

### 3. Kết nối từ MySQL Workbench

**Cấu hình connection:**
- Connection Name: `Poker Game (Port 3307)`
- Hostname: `localhost` hoặc `127.0.0.1`
- Port: **3307** ← Quan trọng!
- Username: `poker_user`
- Password: `poker_password`
- Default Schema: `poker_db`

### 4. Kết nối từ DBeaver

- Host: `localhost`
- Port: **3307** ← Quan trọng!
- Database: `poker_db`
- Username: `poker_user`
- Password: `poker_password`

## Backup và Restore

### Backup (không đổi)

```bash
docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > backup.sql
```

### Restore (không đổi)

```bash
docker exec -i poker-mysql mysql -u poker_user -ppoker_password poker_db < backup.sql
```

## Kiểm tra port

### Xem MySQL đang chạy trên port nào

**Windows:**
```cmd
netstat -ano | findstr :3307
```

**Mac/Linux:**
```bash
lsof -i :3307
```

### Xem tất cả MySQL đang chạy

**Windows:**
```cmd
netstat -ano | findstr :3306
netstat -ano | findstr :3307
```

**Mac/Linux:**
```bash
lsof -i :3306
lsof -i :3307
```

## Nếu muốn đổi sang port khác

### Bước 1: Sửa docker-compose.yml

```yaml
mysql:
  ports:
    - "3308:3306"  # Hoặc port nào bạn muốn
```

### Bước 2: Restart

```bash
docker-compose down
docker-compose up --build
```

## Các port khác trong dự án

- **Frontend**: 3000 (có thể đổi nếu cần)
- **Backend**: 8080 (có thể đổi nếu cần)
- **MySQL**: 3307 (đã đổi từ 3306)

## Đổi port Frontend (nếu cần)

Sửa trong `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "3001:80"  # Thay 3000 thành 3001
```

## Đổi port Backend (nếu cần)

Sửa trong `docker-compose.yml`:

```yaml
backend:
  ports:
    - "8081:8080"  # Thay 8080 thành 8081
```

Và cập nhật `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_WS_URL=http://localhost:8081/ws
```

## Troubleshooting

### Lỗi: Port 3307 cũng bị chiếm

Thay đổi sang port khác (ví dụ 3308):

```yaml
mysql:
  ports:
    - "3308:3306"
```

### Lỗi: Backend không kết nối được MySQL

Kiểm tra:
1. MySQL container đã chạy chưa: `docker ps | grep mysql`
2. Xem logs: `docker-compose logs mysql`
3. Restart: `docker-compose restart backend`

### Lỗi: MySQL Workbench không kết nối được

Đảm bảo:
- Port là **3307** (không phải 3306)
- Container đang chạy: `docker ps`
- Test connection trước khi save

## Lợi ích của việc đổi port

✅ Không xung đột với MySQL hiện tại  
✅ Có thể chạy cả 2 MySQL cùng lúc  
✅ Dễ dàng phân biệt giữa các database  
✅ Không cần tắt MySQL hiện tại  

## Quay lại port 3306 (nếu muốn)

Nếu bạn muốn dùng port 3306 cho project này:

### Cách 1: Tắt MySQL hiện tại

**Windows:**
```cmd
# Xem MySQL service
net stop MySQL80

# Hoặc từ Services (services.msc)
```

**Mac:**
```bash
brew services stop mysql
```

**Linux:**
```bash
sudo systemctl stop mysql
```

### Cách 2: Đổi port MySQL hiện tại

Sửa file config của MySQL hiện tại (my.cnf hoặc my.ini):

```ini
[mysqld]
port=3308
```

Restart MySQL service.

## Tóm tắt

- ✅ MySQL trong Docker: **Port 3307**
- ✅ MySQL hiện tại của bạn: **Port 3306**
- ✅ Cả 2 có thể chạy cùng lúc
- ✅ Backend tự động kết nối đúng (qua Docker network)
- ✅ Chỉ cần nhớ port 3307 khi kết nối từ bên ngoài

---

**Giờ bạn có thể chạy ứng dụng mà không lo xung đột port! 🎉**
