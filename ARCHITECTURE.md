# Kiến trúc hệ thống - Poker Game Application

## Tổng quan

Ứng dụng Poker được xây dựng theo kiến trúc 3 tầng (Three-tier Architecture):

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                   (React.js Frontend)                    │
│                    Port: 3000 (Nginx)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/REST API + WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│                 (Spring Boot Backend)                    │
│                       Port: 8080                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ JDBC
                     │
┌────────────────────▼────────────────────────────────────┐
│                      DATA LAYER                          │
│                    (MySQL Database)                      │
│                       Port: 3306                         │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture (React.js)

### Cấu trúc thư mục
```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # Reusable components
│   │   ├── Card.js        # Poker card component
│   │   └── Card.css
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   ├── Register.js    # Registration page
│   │   ├── Lobby.js       # Game lobby
│   │   ├── GameRoom.js    # Poker game room
│   │   └── Leaderboard.js # Leaderboard
│   ├── services/          # API services
│   │   ├── api.js         # REST API calls
│   │   └── websocket.js   # WebSocket connection
│   ├── App.js             # Main app component
│   ├── App.css            # Global styles
│   ├── index.js           # Entry point
│   └── index.css          # Base styles
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration
└── package.json           # Dependencies
```

### Công nghệ sử dụng
- **React 18.2**: UI framework
- **React Router 6**: Client-side routing
- **Axios**: HTTP client
- **SockJS + STOMP**: WebSocket client
- **Nginx**: Web server (production)

### Luồng dữ liệu
1. User interaction → Component
2. Component → Service (api.js/websocket.js)
3. Service → Backend API
4. Backend response → Service
5. Service → Component state update
6. Component re-render

### State Management
- Local state với React Hooks (useState, useEffect)
- Authentication state trong localStorage
- Game state qua WebSocket real-time updates

## Backend Architecture (Spring Boot)

### Cấu trúc thư mục
```
backend/
└── src/main/
    ├── java/com/poker/
    │   ├── PokerApplication.java    # Main application
    │   ├── config/                  # Configuration
    │   │   ├── SecurityConfig.java  # Spring Security
    │   │   └── WebSocketConfig.java # WebSocket config
    │   ├── controller/              # REST Controllers
    │   │   ├── AuthController.java  # Authentication
    │   │   ├── UserController.java  # User management
    │   │   ├── RoomController.java  # Room management
    │   │   └── GameController.java  # Game WebSocket
    │   ├── dto/                     # Data Transfer Objects
    │   │   ├── AuthRequest.java
    │   │   ├── AuthResponse.java
    │   │   ├── RegisterRequest.java
    │   │   ├── UserDTO.java
    │   │   ├── GameState.java
    │   │   └── GameAction.java
    │   ├── model/                   # JPA Entities
    │   │   ├── User.java
    │   │   ├── Room.java
    │   │   └── GameHistory.java
    │   ├── repository/              # Data Access Layer
    │   │   ├── UserRepository.java
    │   │   ├── RoomRepository.java
    │   │   └── GameHistoryRepository.java
    │   ├── security/                # Security components
    │   │   ├── JwtService.java
    │   │   ├── JwtAuthenticationFilter.java
    │   │   └── CustomUserDetailsService.java
    │   └── service/                 # Business Logic
    │       ├── AuthService.java
    │       ├── UserService.java
    │       ├── RoomService.java
    │       └── GameService.java
    └── resources/
        └── application.yml          # Configuration
```

### Công nghệ sử dụng
- **Spring Boot 3.2**: Application framework
- **Spring Security**: Authentication & Authorization
- **Spring Data JPA**: Database ORM
- **Spring WebSocket**: Real-time communication
- **JWT (jjwt 0.12.3)**: Token-based authentication
- **MySQL Connector**: Database driver
- **Lombok**: Reduce boilerplate code

### Layers

#### 1. Controller Layer
- Nhận HTTP requests
- Validate input
- Gọi Service layer
- Trả về HTTP responses

#### 2. Service Layer
- Business logic
- Transaction management
- Gọi Repository layer
- Transform data (Entity ↔ DTO)

#### 3. Repository Layer
- Database operations (CRUD)
- Custom queries
- JPA/Hibernate

#### 4. Security Layer
- JWT token generation/validation
- Authentication filter
- Password encryption (BCrypt)
- CORS configuration

### API Design

#### REST API Endpoints
```
Authentication:
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user

User:
GET    /api/users/profile    # Get user profile (JWT required)
GET    /api/users/leaderboard # Get leaderboard

Room:
GET    /api/rooms            # List all rooms (JWT required)
GET    /api/rooms/{id}       # Get room details (JWT required)
POST   /api/rooms            # Create new room (JWT required)
```

#### WebSocket Endpoints
```
Connection:
/ws                          # WebSocket handshake endpoint

Subscribe:
/topic/game/{roomId}         # Subscribe to game updates

Send:
/app/game/{roomId}/join      # Join game
/app/game/{roomId}/action    # Send game action
```

### Game Logic Flow

1. **Player joins room**
   - WebSocket connection established
   - Player added to game state
   - Broadcast update to all players

2. **Game starts** (when ≥2 players)
   - Shuffle deck
   - Deal 2 cards to each player
   - Set blinds
   - Start betting round

3. **Betting round**
   - Player actions: Fold, Check, Call, Raise
   - Update pot and player chips
   - Check if round complete

4. **Next phase**
   - PRE_FLOP → FLOP (3 community cards)
   - FLOP → TURN (1 community card)
   - TURN → RIVER (1 community card)
   - RIVER → SHOWDOWN

5. **Determine winner**
   - Evaluate hands
   - Award pot
   - Save game history
   - Reset for next game

## Database Architecture (MySQL)

### Schema Design

```sql
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password (hashed)
├── chips
├── total_games
├── wins
├── losses
├── created_at
└── updated_at

rooms
├── id (PK)
├── name
├── max_players
├── small_blind
├── big_blind
├── status
├── created_by (FK → users.id)
├── created_at
└── updated_at

room_players
├── id (PK)
├── room_id (FK → rooms.id)
├── user_id (FK → users.id)
├── position
├── chips
├── status
└── joined_at

game_history
├── id (PK)
├── room_id (FK → rooms.id)
├── winner_id (FK → users.id)
├── pot_amount
├── winning_hand
├── players_count
└── played_at

game_players
├── id (PK)
├── game_id (FK → game_history.id)
├── user_id (FK → users.id)
├── starting_chips
├── ending_chips
├── final_hand
└── position
```

### Indexes
- `users.username` - Fast user lookup
- `users.email` - Fast email lookup
- `rooms.status` - Filter available rooms
- `game_history.room_id` - Room history
- `game_history.winner_id` - Player statistics

### Views
```sql
leaderboard
├── id
├── username
├── chips
├── total_games
├── wins
├── losses
└── win_rate (calculated)
```

## Docker Architecture

### Container Structure
```
┌─────────────────────────────────────────────┐
│           Docker Compose Network            │
│              (poker-network)                │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │   Frontend   │  │   Backend    │       │
│  │   (Nginx)    │  │ (Spring Boot)│       │
│  │   Port 3000  │  │  Port 8080   │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                │
│         │                  │                │
│         │         ┌────────▼────────┐      │
│         │         │     MySQL       │      │
│         │         │   Port 3306     │      │
│         │         └─────────────────┘      │
│         │                                   │
└─────────┼───────────────────────────────────┘
          │
    ┌─────▼─────┐
    │   Host    │
    │  Machine  │
    └───────────┘
```

### Volumes
- `mysql_data`: Persist MySQL database

### Health Checks
- MySQL: `mysqladmin ping`
- Backend: Depends on MySQL health
- Frontend: Depends on Backend

### Build Process

#### Frontend
1. Node.js build stage: Install deps + build React app
2. Nginx stage: Copy build files + serve static content

#### Backend
1. Maven build stage: Download deps + compile + package JAR
2. JRE stage: Copy JAR + run application

## Security Architecture

### Authentication Flow
```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT token (24h expiration)
   ↓
4. Return token to client
   ↓
5. Client stores token (localStorage)
   ↓
6. Client includes token in Authorization header
   ↓
7. Backend validates token on each request
   ↓
8. Grant/Deny access
```

### Security Features
- **Password Hashing**: BCrypt with salt
- **JWT**: Stateless authentication
- **CORS**: Configured allowed origins
- **HTTPS Ready**: Can be enabled with reverse proxy
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **XSS Prevention**: React auto-escaping

### Authorization
- Public endpoints: `/api/auth/**`, `/ws/**`
- Protected endpoints: All others (JWT required)

## Communication Protocols

### REST API (HTTP)
- Authentication
- User profile
- Room management
- Leaderboard

### WebSocket (STOMP over SockJS)
- Real-time game updates
- Player actions
- Game state synchronization

### Why both?
- **REST**: Simple, cacheable, stateless
- **WebSocket**: Real-time, bidirectional, low latency

## Scalability Considerations

### Current Architecture
- Single instance of each service
- Suitable for: 10-100 concurrent users

### Scaling Options

#### Horizontal Scaling
```
Load Balancer
    ├── Backend Instance 1
    ├── Backend Instance 2
    └── Backend Instance 3
         ↓
    Shared MySQL
```

#### Improvements for Scale
1. **Redis**: Session storage, game state cache
2. **Message Queue**: RabbitMQ/Kafka for game events
3. **Database**: Read replicas, connection pooling
4. **CDN**: Static assets (frontend)
5. **Kubernetes**: Container orchestration

## Monitoring & Logging

### Current Logging
- Spring Boot: Console logs
- Frontend: Browser console
- MySQL: Query logs

### Production Recommendations
- **Application Monitoring**: Prometheus + Grafana
- **Log Aggregation**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking**: Sentry
- **Performance**: New Relic, DataDog

## Deployment

### Development
```bash
docker-compose up
```

### Production
1. Use environment variables for secrets
2. Enable HTTPS (Let's Encrypt)
3. Use production database (managed MySQL)
4. Set up CI/CD pipeline
5. Configure monitoring
6. Regular backups

### Cloud Deployment Options
- **AWS**: ECS/EKS + RDS + CloudFront
- **Google Cloud**: GKE + Cloud SQL + Cloud CDN
- **Azure**: AKS + Azure Database + Azure CDN
- **DigitalOcean**: Kubernetes + Managed Database

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Backend
- Connection pooling
- Query optimization
- Caching (Redis)
- Async processing

### Database
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas

## Testing Strategy

### Frontend
- Unit tests: Jest + React Testing Library
- E2E tests: Cypress

### Backend
- Unit tests: JUnit 5
- Integration tests: Spring Boot Test
- API tests: RestAssured

### Database
- Migration tests
- Data integrity tests

## Future Enhancements

1. **Game Features**
   - Tournament mode
   - Private tables
   - Chat system
   - Spectator mode

2. **Technical**
   - Redis caching
   - Message queue
   - Microservices architecture
   - GraphQL API

3. **Business**
   - Payment integration
   - Analytics dashboard
   - Admin panel
   - Mobile apps (React Native)
