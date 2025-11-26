# 🃏 Poker Game Application - Tóm tắt dự án

## Tổng quan

Ứng dụng chơi Poker đầy đủ chức năng với kiến trúc Frontend-Backend-Database, triển khai bằng Docker.

## Công nghệ sử dụng

### Frontend
- **React.js 18.2** - UI framework
- **React Router 6** - Routing
- **Axios** - HTTP client
- **SockJS + STOMP** - WebSocket client
- **Nginx** - Web server

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - ORM
- **Spring WebSocket** - Real-time communication
- **JWT** - Token-based authentication
- **MySQL Connector** - Database driver

### Database
- **MySQL 8.0** - Relational database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Cấu trúc dự án

```
poker-app/
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── services/     # API & WebSocket services
│   ├── Dockerfile
│   └── package.json
│
├── backend/              # Spring Boot application
│   ├── src/main/java/com/poker/
│   │   ├── config/      # Configuration classes
│   │   ├── controller/  # REST & WebSocket controllers
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── model/       # JPA Entities
│   │   ├── repository/  # Data Access Layer
│   │   ├── security/    # Security components
│   │   └── service/     # Business Logic
│   ├── Dockerfile
│   └── pom.xml
│
├── database/             # MySQL initialization
│   └── init.sql
│
├── docker-compose.yml    # Development setup
├── docker-compose.prod.yml # Production setup
└── README.md
```

## Tính năng chính

### 1. Authentication & Authorization
- ✅ Đăng ký người dùng mới
- ✅ Đăng nhập với JWT
- ✅ Bảo mật API endpoints
- ✅ Password hashing (BCrypt)

### 2. User Management
- ✅ Profile người dùng
- ✅ Quản lý chips
- ✅ Thống kê thắng/thua
- ✅ Bảng xếp hạng

### 3. Room Management
- ✅ Tạo phòng chơi
- ✅ Tham gia phòng
- ✅ Cấu hình blinds
- ✅ Giới hạn số người chơi

### 4. Game Logic
- ✅ Chia bài tự động
- ✅ Các hành động: Fold, Check, Call, Raise
- ✅ Quản lý pot và bets
- ✅ Các phase: Pre-flop, Flop, Turn, River, Showdown
- ✅ Xác định người thắng
- ✅ Lưu lịch sử game

### 5. Real-time Communication
- ✅ WebSocket connection
- ✅ Real-time game updates
- ✅ Synchronize game state
- ✅ Broadcast to all players

### 6. UI/UX
- ✅ Responsive design
- ✅ Giao diện đẹp mắt
- ✅ Hiệu ứng animation
- ✅ Mobile-friendly

## Cách chạy

### Development
```bash
docker-compose up --build
```

Truy cập: http://localhost:3000

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Tài khoản test

- Username: `player1`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### User
- `GET /api/users/profile` - Profile (JWT required)
- `GET /api/users/leaderboard` - Bảng xếp hạng

### Room
- `GET /api/rooms` - Danh sách phòng (JWT required)
- `POST /api/rooms` - Tạo phòng (JWT required)

### WebSocket
- `/ws` - WebSocket endpoint
- `/app/game/{roomId}/join` - Join game
- `/app/game/{roomId}/action` - Game action
- `/topic/game/{roomId}` - Subscribe updates

## Database Schema

### Tables
- `users` - Thông tin người dùng
- `rooms` - Phòng chơi
- `room_players` - Người chơi trong phòng
- `game_history` - Lịch sử game
- `game_players` - Chi tiết người chơi trong game

### Views
- `leaderboard` - Bảng xếp hạng

## Security Features

- ✅ JWT authentication
- ✅ Password hashing (BCrypt)
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS prevention
- ✅ Input validation

## Performance

### Current Capacity
- 10-100 concurrent users
- Single instance deployment

### Optimization Options
- Redis caching
- Database read replicas
- Load balancing
- CDN for static assets
- Horizontal scaling

## Documentation

- **README.md** - Tổng quan và hướng dẫn cơ bản
- **QUICKSTART.md** - Hướng dẫn nhanh
- **SETUP.md** - Hướng dẫn cài đặt chi tiết
- **ARCHITECTURE.md** - Kiến trúc hệ thống
- **API.md** - API documentation
- **DEPLOYMENT.md** - Hướng dẫn triển khai production
- **CONTRIBUTING.md** - Hướng dẫn đóng góp

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
./mvnw test
```

## Deployment Options

### Cloud Platforms
- **AWS**: EC2 + RDS + ECS
- **Google Cloud**: GKE + Cloud SQL
- **Azure**: AKS + Azure Database
- **DigitalOcean**: Kubernetes + Managed Database

### VPS
- Ubuntu/Debian
- CentOS/RHEL
- Docker + Docker Compose

## Monitoring & Logging

### Development
- Console logs
- Browser DevTools
- Docker logs

### Production (Recommended)
- Prometheus + Grafana
- ELK Stack
- Sentry
- New Relic / DataDog

## Future Enhancements

### Game Features
- [ ] Tournament mode
- [ ] Private tables with passwords
- [ ] Chat system
- [ ] Spectator mode
- [ ] Hand history viewer
- [ ] Replay system

### Technical
- [ ] Redis caching
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Mobile apps (React Native)

### Business
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Email notifications
- [ ] Social features

## Known Limitations

1. **Game Logic**: Simplified poker rules (không có full hand evaluation)
2. **Scalability**: Single instance (cần Redis cho multi-instance)
3. **Security**: Basic JWT (nên thêm refresh tokens)
4. **Testing**: Minimal test coverage
5. **Monitoring**: No production monitoring setup

## Contributing

Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết cách đóng góp.

## License

MIT License - Xem [LICENSE](LICENSE)

## Support

- **Issues**: GitHub Issues
- **Documentation**: Xem các file .md trong project
- **Email**: [your-email@example.com]

## Credits

Developed with ❤️ using:
- React.js
- Spring Boot
- MySQL
- Docker

---

## Quick Commands

```bash
# Start development
docker-compose up --build

# Stop
docker-compose down

# Reset database
docker-compose down -v

# View logs
docker-compose logs -f

# Production deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Backup database
docker exec poker-mysql mysqldump -u poker_user -ppoker_password poker_db > backup.sql

# Restore database
docker exec -i poker-mysql mysql -u poker_user -ppoker_password poker_db < backup.sql
```

## Project Stats

- **Total Files**: 50+
- **Lines of Code**: ~5000+
- **Languages**: Java, JavaScript, SQL
- **Frameworks**: Spring Boot, React
- **Database Tables**: 5
- **API Endpoints**: 8+
- **WebSocket Endpoints**: 3

---

**Happy Gaming! 🎰🃏**
