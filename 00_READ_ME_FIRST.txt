╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🃏 POKER GAME APPLICATION 🃏                    ║
║                                                              ║
║                    ĐỌC FILE NÀY TRƯỚC!                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


⚠️  THÔNG BÁO QUAN TRỌNG
═══════════════════════════════════════════════════════════════

MySQL đã được cấu hình chạy trên PORT 3307 thay vì 3306
để tránh xung đột với MySQL hiện có trên máy bạn.


📋 THÔNG TIN KẾT NỐI
═══════════════════════════════════════════════════════════════

Frontend:  http://localhost:3000
Backend:   http://localhost:8080
MySQL:     localhost:3307  ← ĐÃ ĐỔI TỪ 3306


🚀 KHỞI ĐỘNG NHANH (3 BƯỚC)
═══════════════════════════════════════════════════════════════

Bước 1: Mở terminal/command prompt

Bước 2: Chạy lệnh
    
    Windows:
    docker-compose up --build
    
    Mac/Linux:
    docker-compose up --build

Bước 3: Mở trình duyệt
    
    http://localhost:3000


🔑 TÀI KHOẢN TEST
═══════════════════════════════════════════════════════════════

Username: player1
Password: password123


📚 TÀI LIỆU QUAN TRỌNG
═══════════════════════════════════════════════════════════════

1. START_HERE.md              ← Bắt đầu tại đây
2. IMPORTANT_PORT_CHANGE.txt  ← Thông báo port
3. QUICKSTART.md              ← Hướng dẫn nhanh
4. CHECKLIST.md               ← Kiểm tra từng bước
5. MYSQL_GUIDE.md             ← Hướng dẫn MySQL
6. DOCS_INDEX.md              ← Danh sách tất cả docs


🗄️ KẾT NỐI MYSQL
═══════════════════════════════════════════════════════════════

Từ Command Line:
    docker exec -it poker-mysql mysql -u poker_user -ppoker_password poker_db

Từ MySQL Workbench:
    Host:     localhost
    Port:     3307  ← QUAN TRỌNG!
    Database: poker_db
    Username: poker_user
    Password: poker_password


🛠️ SCRIPTS HỮU ÍCH
═══════════════════════════════════════════════════════════════

Windows:
    start.bat         - Khởi động ứng dụng
    check-ports.bat   - Kiểm tra ports

Mac/Linux:
    ./start.sh        - Khởi động ứng dụng
    ./check-ports.sh  - Kiểm tra ports


❓ GẶP VẤN ĐỀ?
═══════════════════════════════════════════════════════════════

Port bị xung đột?
    → Đọc PORT_CHANGE_GUIDE.md

MySQL không chạy?
    → Đọc MYSQL_GUIDE.md

Không biết bắt đầu?
    → Đọc START_HERE.md

Cần checklist?
    → Đọc CHECKLIST.md


✨ TÍNH NĂNG
═══════════════════════════════════════════════════════════════

✅ Đăng nhập/Đăng ký với JWT
✅ Tạo và tham gia phòng chơi
✅ Chơi Poker real-time với WebSocket
✅ Bảng xếp hạng người chơi
✅ Giao diện responsive (desktop & mobile)
✅ Quản lý chip và lịch sử game


🔧 TECH STACK
═══════════════════════════════════════════════════════════════

Frontend:  React.js + WebSocket
Backend:   Spring Boot + JWT
Database:  MySQL (Port 3307)
Deploy:    Docker + Docker Compose


📞 HỖ TRỢ
═══════════════════════════════════════════════════════════════

1. Đọc DOCS_INDEX.md để tìm tài liệu phù hợp
2. Xem CHECKLIST.md để kiểm tra từng bước
3. Đọc SETUP.md nếu gặp vấn đề
4. Tạo issue trên GitHub


═══════════════════════════════════════════════════════════════

            Chúc bạn chơi vui vẻ! 🎰🃏

═══════════════════════════════════════════════════════════════
