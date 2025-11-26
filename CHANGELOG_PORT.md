# 📝 Changelog - Port Configuration

## Thay đổi ngày: 2024

### ⚠️ BREAKING CHANGE: MySQL Port

**Lý do:** Port 3306 đã được sử dụng bởi MySQL khác trên máy người dùng.

**Thay đổi:**
- MySQL port: `3306` → `3307`

---

## Chi tiết thay đổi

### 1. docker-compose.yml

**Trước:**
```yaml
mysql:
  ports:
    - "3306:3306"
```

**Sau:**
```yaml
mysql:
  ports:
    - "3307:3306"
```

### 2. Documentation Updates

**Files đã cập nhật:**
- ✅ `README.md` - Cập nhật port trong yêu cầu hệ thống
- ✅ `MYSQL_GUIDE.md` - Cập nhật tất cả thông tin kết nối
- ✅ `SETUP.md` - Cập nhật hướng dẫn

**Files mới tạo:**
- ✅ `PORT_CHANGE_GUIDE.md` - Hướng dẫn chi tiết về port
- ✅ `IMPORTANT_PORT_CHANGE.txt` - Thông báo nhanh
- ✅ `START_HERE.md` - Hướng dẫn bắt đầu
- ✅ `CHECKLIST.md` - Checklist khởi động
- ✅ `check-ports.bat` - Script kiểm tra port (Windows)
- ✅ `check-ports.sh` - Script kiểm tra port (Mac/Linux)

---

## Impact Analysis

### ✅ Không ảnh hưởng

- **Backend → MySQL**: Vẫn kết nối qua Docker network (internal port 3306)
- **Frontend → Backend**: Không thay đổi
- **Application logic**: Không thay đổi
- **Database schema**: Không thay đổi
- **Docker volumes**: Không thay đổi

### ⚠️ Cần cập nhật

- **MySQL Workbench connections**: Đổi port từ 3306 → 3307
- **DBeaver connections**: Đổi port từ 3306 → 3307
- **External MySQL clients**: Sử dụng port 3307
- **Documentation**: Đã cập nhật

---

## Migration Guide

### Cho người dùng hiện tại

Nếu bạn đã có connection đến MySQL cũ (port 3306):

1. **Cập nhật connection trong MySQL Workbench:**
   - Edit connection
   - Đổi Port: `3306` → `3307`
   - Test connection
   - Save

2. **Cập nhật connection trong DBeaver:**
   - Edit connection
   - Đổi Port: `3306` → `3307`
   - Test connection
   - Save

3. **Cập nhật scripts/code:**
   ```bash
   # Cũ
   mysql -h localhost -P 3306 -u poker_user -ppoker_password poker_db
   
   # Mới
   mysql -h localhost -P 3307 -u poker_user -ppoker_password poker_db
   ```

### Cho người dùng mới

Không cần làm gì, chỉ cần:
- Sử dụng port **3307** khi kết nối MySQL từ bên ngoài
- Đọc file **START_HERE.md**

---

## Testing

### Test Cases

- [x] Docker Compose khởi động thành công
- [x] MySQL container chạy trên port 3307
- [x] Backend kết nối MySQL thành công
- [x] Frontend kết nối Backend thành công
- [x] MySQL Workbench kết nối thành công (port 3307)
- [x] Command line kết nối thành công
- [x] Không xung đột với MySQL hiện tại (port 3306)

### Verified Scenarios

1. ✅ MySQL cũ (port 3306) và MySQL mới (port 3307) chạy cùng lúc
2. ✅ Backend trong Docker kết nối MySQL qua internal network
3. ✅ External tools kết nối MySQL qua port 3307
4. ✅ Backup/Restore hoạt động bình thường
5. ✅ Application logic không bị ảnh hưởng

---

## Rollback Plan

Nếu cần quay lại port 3306:

### Bước 1: Tắt MySQL hiện tại

**Windows:**
```cmd
net stop MySQL80
```

**Mac:**
```bash
brew services stop mysql
```

**Linux:**
```bash
sudo systemctl stop mysql
```

### Bước 2: Đổi lại port

Sửa `docker-compose.yml`:
```yaml
mysql:
  ports:
    - "3306:3306"  # Đổi lại từ 3307
```

### Bước 3: Restart

```bash
docker-compose down
docker-compose up --build
```

---

## Benefits

### ✅ Advantages

1. **Không xung đột**: Có thể chạy cả 2 MySQL cùng lúc
2. **Linh hoạt**: Không cần tắt MySQL hiện tại
3. **Isolation**: Dữ liệu của 2 MySQL hoàn toàn tách biệt
4. **Development**: Dễ dàng switch giữa các projects

### ⚠️ Considerations

1. **Port awareness**: Cần nhớ port 3307 khi kết nối
2. **Documentation**: Cần cập nhật docs (đã làm)
3. **Team sync**: Team cần biết về thay đổi này

---

## Communication

### Thông báo cho team

```
🔔 THÔNG BÁO: MySQL Port đã thay đổi

MySQL trong Poker Game project giờ chạy trên PORT 3307 thay vì 3306.

Lý do: Tránh xung đột với MySQL hiện có trên máy.

Action required:
- Cập nhật MySQL Workbench connections (port 3307)
- Đọc file PORT_CHANGE_GUIDE.md
- Đọc file START_HERE.md

Backend không cần thay đổi gì (tự động kết nối đúng).
```

---

## Future Considerations

### Option 1: Environment Variable

Có thể parameterize port trong `.env`:

```env
MYSQL_PORT=3307
```

```yaml
mysql:
  ports:
    - "${MYSQL_PORT}:3306"
```

### Option 2: Docker Network Only

Không expose port ra ngoài (chỉ dùng internal network):

```yaml
mysql:
  # Không có ports section
  # Chỉ backend trong Docker network mới kết nối được
```

**Pros:**
- Bảo mật hơn
- Không xung đột port

**Cons:**
- Không thể dùng MySQL Workbench từ host
- Khó debug

---

## References

- Docker Compose Networking: https://docs.docker.com/compose/networking/
- MySQL Docker Image: https://hub.docker.com/_/mysql
- Port Mapping: https://docs.docker.com/config/containers/container-networking/

---

## Version History

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2024 | Initial setup (port 3306) | - |
| 1.1 | 2024 | Changed to port 3307 | - |

---

## Approval

- [x] Technical review completed
- [x] Documentation updated
- [x] Testing completed
- [x] Ready for deployment

---

**Status: ✅ COMPLETED**

Port change đã được implement và test thành công. Tất cả documentation đã được cập nhật.
