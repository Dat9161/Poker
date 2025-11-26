# 🗄️ Hướng dẫn MySQL - Poker Game Application

## Tổng quan

MySQL trong dự án này chạy trong Docker container và được quản lý bởi Docker Compose.

## Cách 1: MySQL chạy trong Docker (Khuyến nghị)

### Khởi động MySQL cùng toàn bộ ứng dụng

```bash
docker-compose up --build
```

MySQL sẽ tự động:
- Khởi động trên port 3306
- Tạo database `poker_db`
- Chạy script `database/init.sql` để tạo tables và dữ liệu mẫu
- Lưu dữ liệu trong Docker volume `mysql_data`

### Chỉ khởi động MySQL

```bash
docker-compose up mysql
```

### Kiểm tra MySQL đã chạy chưa

```bash
docker ps
```

Bạn sẽ thấy container `poker-mysql` đang chạy.

### Xem logs của MySQL

```bash
docker-compose logs mysql
```

Hoặc theo dõi real-time:
```bash
docker-compose logs -f mysql
```

## Truy cập MySQL

### Cách 1: Từ command line (trong container)

```bash
docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db
```

Hoặc với root user:
```bash
docker exec -it poker-mysql mysql -u root -prootpassword
```

### Cách 2: Từ MySQL Workbench

1. Mở MySQL Workbench
2. Tạo connection mới với thông tin:
   - **Connection Name**: Poker Game Local
   - **Hostname**: localhost (hoặc 127.0.0.1)
   - **Port**: **3307** ← Quan trọng! (Đã đổi từ 3306)
   - **Username**: poker_user
   - **Password**: poker_password
   - **Default Schema**: poker_db

3. Click "Test Connection"
4. Click "OK" để lưu
5. Double-click connection để kết nối

### Cách 3: Từ DBeaver

1. Mở DBeaver
2. New Database Connection → MySQL
3. Nhập thông tin:
   - **Host**: localhost
   - **Port**: **3307** ← Quan trọng! (Đã đổi từ 3306)
   - **Database**: poker_db
   - **Username**: poker_user
   - **Password**: poker_password

4. Test Connection → Finish

### Cách 4: Từ command line (ngoài container)

Nếu bạn đã cài MySQL client trên máy:

```bash
mysql -h 127.0.0.1 -P 3307 -u poker_user -ppoker_password poker_db
```

**Lưu ý:** Sử dụng port **3307** (không phải 3306)

## Thông tin kết nối

### Development (Docker Compose)

```
Host: localhost (hoặc 127.0.0.1)
Port: 3307  ← ĐÃ THAY ĐỔI để tránh xung đột
Database: poker_db
Username: poker_user
Password: poker_password

Root Username: root
Root Password: rootpassword
```

**Lưu ý:** Port đã được đổi từ 3306 sang **3307** để tránh xung đột với MySQL khác trên máy bạn.

### Connection String (JDBC)

Từ host machine (port 3307):
```
jdbc:mysql://localhost:3307/poker_db?useSSL=false&allowPublicKeyRetrieval=true
```

Trong Docker network (backend → mysql, vẫn dùng port 3306 internal):
```
jdbc:mysql://mysql:3306/poker_db?useSSL=false&allowPublicKeyRetrieval=true
```

## Các lệnh MySQL thường dùng

### Sau khi đã kết nối vào MySQL

```sql
-- Xem tất cả databases
SHOW DATABASES;

-- Chọn database
USE poker_db;

-- Xem tất cả tables
SHOW TABLES;

-- Xem cấu trúc table
DESCRIBE users;
DESCRIBE rooms;
DESCRIBE game_history;

-- Xem dữ liệu
SELECT * FROM users;
SELECT * FROM rooms;
SELECT * FROM game_history;

-- Xem bảng xếp hạng
SELECT * FROM leaderboard;

-- Đếm số người dùng
SELECT COUNT(*) FROM users;

-- Xem người dùng có nhiều chips nhất
SELECT username, chips FROM users ORDER BY chips DESC LIMIT 10;

-- Xem lịch sử game gần đây
SELECT * FROM game_history ORDER BY played_at DESC LIMIT 10;

-- Xem thông tin chi tiết user
SELECT 
    username, 
    email, 
    chips, 
    total_games, 
    wins, 
    losses,
    ROUND((wins * 100.0 / NULLIF(total_games, 0)), 2) as win_rate
FROM users
ORDER BY chips DESC;
```

## Quản lý dữ liệu

### Xem dữ liệu mẫu

```sql
-- Xem users mẫu
SELECT * FROM users;

-- Xem rooms mẫu
SELECT * FROM rooms;
```

### Thêm user mới (thủ công)

```sql
INSERT INTO users (username, email, password, chips) 
VALUES ('newplayer', 'newplayer@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1000);
-- Password: password123 (đã hash)
```

### Cập nhật chips cho user

```sql
UPDATE users SET chips = 2000 WHERE username = 'player1';
```

### Xóa dữ liệu

```sql
-- Xóa tất cả game history
DELETE FROM game_history;

-- Xóa tất cả rooms
DELETE FROM rooms;

-- Reset auto increment
ALTER TABLE game_history AUTO_INCREMENT = 1;
```

### Reset toàn bộ dữ liệu

```sql
-- Xóa tất cả dữ liệu nhưng giữ cấu trúc
TRUNCATE TABLE game_players;
TRUNCATE TABLE game_history;
TRUNCATE TABLE room_players;
TRUNCATE TABLE rooms;
TRUNCATE TABLE users;

-- Chạy lại script init
SOURCE /docker-entrypoint-initdb.d/init.sql;
```

## Backup và Restore

### Backup toàn bộ database

```bash
# Backup vào file
docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > backup.sql

# Backup với timestamp
docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup chỉ cấu trúc (không có dữ liệu)
docker exec poker-mysql mysqldump -u poker_user -ppoker_password --no-data poker_db > schema.sql

# Backup chỉ dữ liệu (không có cấu trúc)
docker exec poker-mysql mysqldump -u poker_user -ppoker_password --no-create-info poker_db > data.sql
```

### Restore database

```bash
# Restore từ file backup
docker exec -i poker-mysql mysql -u poker_user -ppoker_password poker_db < backup.sql

# Hoặc từ trong container
docker cp backup.sql poker-mysql:/tmp/backup.sql
docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db -e "SOURCE /tmp/backup.sql"
```

### Backup tự động (Cron job)

Tạo file `backup-mysql.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/poker_db_$DATE.sql"

docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > $BACKUP_FILE

# Giữ lại 7 ngày backup
find $BACKUP_DIR -name "poker_db_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

Thêm vào crontab:
```bash
# Backup mỗi ngày lúc 2 giờ sáng
0 2 * * * /path/to/backup-mysql.sh
```

## Troubleshooting

### Lỗi: Can't connect to MySQL server

**Nguyên nhân:** MySQL container chưa khởi động hoặc chưa sẵn sàng

**Giải pháp:**
```bash
# Kiểm tra container đang chạy
docker ps | grep mysql

# Xem logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Chờ MySQL sẵn sàng (có thể mất 30-60 giây)
```

### Lỗi: Access denied for user

**Nguyên nhân:** Sai username hoặc password

**Giải pháp:**
```bash
# Kiểm tra thông tin trong docker-compose.yml
cat docker-compose.yml | grep MYSQL

# Sử dụng đúng credentials:
# Username: poker_user
# Password: poker_password
```

### Lỗi: Unknown database 'poker_db'

**Nguyên nhân:** Database chưa được tạo

**Giải pháp:**
```bash
# Tạo database thủ công
docker exec -it poker-mysql mysql -u root -prootpassword -e "CREATE DATABASE poker_db;"

# Chạy init script
docker exec -i poker-mysql mysql -u root -prootpassword poker_db < database/init.sql
```

### Lỗi: Table doesn't exist

**Nguyên nhân:** Tables chưa được tạo

**Giải pháp:**
```bash
# Chạy lại init script
docker exec -i poker-mysql mysql -u poker_user -ppoker_password poker_db < database/init.sql
```

### Reset hoàn toàn MySQL

```bash
# Dừng và xóa container + volume
docker-compose down -v

# Khởi động lại (sẽ tạo mới database)
docker-compose up --build
```

## Tối ưu hóa MySQL

### Xem cấu hình hiện tại

```sql
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW STATUS LIKE 'Threads_connected';
```

### Tối ưu queries

```sql
-- Xem slow queries
SHOW VARIABLES LIKE 'slow_query_log';

-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Analyze query
EXPLAIN SELECT * FROM users WHERE username = 'player1';

-- Xem indexes
SHOW INDEX FROM users;
```

### Tối ưu tables

```sql
-- Analyze table
ANALYZE TABLE users;

-- Optimize table
OPTIMIZE TABLE users;

-- Check table
CHECK TABLE users;

-- Repair table (nếu cần)
REPAIR TABLE users;
```

## Monitoring

### Xem trạng thái MySQL

```sql
-- Xem status
SHOW STATUS;

-- Xem process list
SHOW PROCESSLIST;

-- Xem kích thước database
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'poker_db'
GROUP BY table_schema;

-- Xem kích thước từng table
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'poker_db'
ORDER BY (data_length + index_length) DESC;
```

### Xem connections

```sql
SHOW STATUS WHERE variable_name = 'Threads_connected';
SHOW STATUS WHERE variable_name = 'Max_used_connections';
```

## Cách 2: MySQL cài đặt trực tiếp (Không dùng Docker)

### Cài đặt MySQL trên Windows

1. Tải MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Chạy installer và chọn "Developer Default"
3. Thiết lập root password
4. Hoàn tất cài đặt

### Cài đặt MySQL trên Mac

```bash
# Sử dụng Homebrew
brew install mysql

# Khởi động MySQL
brew services start mysql

# Thiết lập root password
mysql_secure_installation
```

### Cài đặt MySQL trên Linux (Ubuntu)

```bash
sudo apt update
sudo apt install mysql-server

# Khởi động MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Thiết lập
sudo mysql_secure_installation
```

### Tạo database và user

```sql
-- Kết nối với root
mysql -u root -p

-- Tạo database
CREATE DATABASE poker_db;

-- Tạo user
CREATE USER 'poker_user'@'localhost' IDENTIFIED BY 'poker_password';

-- Cấp quyền
GRANT ALL PRIVILEGES ON poker_db.* TO 'poker_user'@'localhost';
FLUSH PRIVILEGES;

-- Sử dụng database
USE poker_db;

-- Chạy init script
SOURCE /path/to/database/init.sql;
```

### Cập nhật backend config

Sửa file `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/poker_db
    username: poker_user
    password: poker_password
```

## Scripts hữu ích

### Script kiểm tra MySQL

Tạo file `check-mysql.sh`:

```bash
#!/bin/bash

echo "Checking MySQL container..."
docker ps | grep poker-mysql

echo -e "\nChecking MySQL connection..."
docker exec poker-mysql mysqladmin -u poker_user -ppoker_password ping

echo -e "\nChecking databases..."
docker exec poker-mysql mysql -u poker_user -ppoker_password -e "SHOW DATABASES;"

echo -e "\nChecking tables in poker_db..."
docker exec poker-mysql mysql -u poker_user -ppoker_password poker_db -e "SHOW TABLES;"

echo -e "\nChecking user count..."
docker exec poker-mysql mysql -u poker_user -ppoker_password poker_db -e "SELECT COUNT(*) as user_count FROM users;"
```

Chạy:
```bash
chmod +x check-mysql.sh
./check-mysql.sh
```

### Script reset database

Tạo file `reset-database.sh`:

```bash
#!/bin/bash

echo "Resetting database..."

# Xóa tất cả dữ liệu
docker exec poker-mysql mysql -u poker_user -ppoker_password poker_db -e "
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE game_players;
TRUNCATE TABLE game_history;
TRUNCATE TABLE room_players;
TRUNCATE TABLE rooms;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
"

# Chạy lại init script
docker exec -i poker-mysql mysql -u poker_user -ppoker_password poker_db < database/init.sql

echo "Database reset completed!"
```

## Tài liệu tham khảo

- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench: https://www.mysql.com/products/workbench/
- DBeaver: https://dbeaver.io/
- Docker MySQL: https://hub.docker.com/_/mysql

---

**Chúc bạn làm việc hiệu quả với MySQL! 🗄️**
