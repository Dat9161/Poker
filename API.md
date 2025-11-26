# API Documentation

## Base URL
```
Development: http://localhost:8080
Production: https://yourdomain.com
```

## Authentication

Hầu hết các endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
Đăng ký người dùng mới.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "player1",
  "email": "player1@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "player1",
  "userId": 1,
  "chips": 1000
}
```

**Error Responses:**
- `400 Bad Request` - Username hoặc email đã tồn tại
```json
{
  "message": "Username already exists"
}
```

---

### Login
Đăng nhập người dùng.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "player1",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "player1",
  "userId": 1,
  "chips": 1500
}
```

**Error Responses:**
- `401 Unauthorized` - Sai username hoặc password
```json
{
  "message": "Invalid credentials"
}
```

---

## User Endpoints

### Get User Profile
Lấy thông tin profile của user hiện tại.

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "player1",
  "email": "player1@example.com",
  "chips": 1500,
  "totalGames": 10,
  "wins": 6,
  "losses": 4,
  "winRate": 60.0
}
```

**Error Responses:**
- `401 Unauthorized` - Token không hợp lệ hoặc hết hạn

---

### Get Leaderboard
Lấy bảng xếp hạng top 100 người chơi.

**Endpoint:** `GET /api/users/leaderboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 2,
    "username": "player2",
    "email": "player2@example.com",
    "chips": 2000,
    "totalGames": 15,
    "wins": 10,
    "losses": 5,
    "winRate": 66.67
  },
  {
    "id": 1,
    "username": "player1",
    "email": "player1@example.com",
    "chips": 1500,
    "totalGames": 10,
    "wins": 6,
    "losses": 4,
    "winRate": 60.0
  }
]
```

---

## Room Endpoints

### Get All Rooms
Lấy danh sách tất cả phòng chơi có sẵn.

**Endpoint:** `GET /api/rooms`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Phòng Mới Bắt Đầu",
    "maxPlayers": 6,
    "smallBlind": 10,
    "bigBlind": 20,
    "status": "WAITING",
    "createdBy": 1,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  {
    "id": 2,
    "name": "Phòng VIP",
    "maxPlayers": 6,
    "smallBlind": 100,
    "bigBlind": 200,
    "status": "PLAYING",
    "createdBy": 2,
    "createdAt": "2024-01-01T11:00:00",
    "updatedAt": "2024-01-01T11:30:00"
  }
]
```

---

### Get Room Details
Lấy chi tiết của một phòng cụ thể.

**Endpoint:** `GET /api/rooms/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (integer) - Room ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Phòng Mới Bắt Đầu",
  "maxPlayers": 6,
  "smallBlind": 10,
  "bigBlind": 20,
  "status": "WAITING",
  "createdBy": 1,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

**Error Responses:**
- `404 Not Found` - Room không tồn tại
```json
{
  "message": "Room not found"
}
```

---

### Create Room
Tạo phòng chơi mới.

**Endpoint:** `POST /api/rooms`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Poker Room",
  "maxPlayers": 6,
  "smallBlind": 10,
  "bigBlind": 20
}
```

**Response:** `200 OK`
```json
{
  "id": 3,
  "name": "My Poker Room",
  "maxPlayers": 6,
  "smallBlind": 10,
  "bigBlind": 20,
  "status": "WAITING",
  "createdBy": 1,
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

---

## WebSocket API

### Connection
Kết nối WebSocket để nhận real-time updates.

**Endpoint:** `ws://localhost:8080/ws` (hoặc `wss://` cho HTTPS)

**Protocol:** STOMP over SockJS

**Example (JavaScript):**
```javascript
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  console.log('Connected to WebSocket');
});
```

---

### Subscribe to Game Updates
Subscribe để nhận updates từ một game room.

**Destination:** `/topic/game/{roomId}`

**Example:**
```javascript
stompClient.subscribe('/topic/game/1', (message) => {
  const gameState = JSON.parse(message.body);
  console.log('Game update:', gameState);
});
```

**Message Format:**
```json
{
  "roomId": 1,
  "players": [1, 2, 3],
  "playerCards": {
    "1": ["A♠", "K♠"],
    "2": ["Q♥", "J♥"],
    "3": ["10♦", "9♦"]
  },
  "communityCards": ["8♣", "7♣", "6♣"],
  "playerChips": {
    "1": 950,
    "2": 1000,
    "3": 1050
  },
  "playerBets": {
    "1": 50,
    "2": 0,
    "3": 0
  },
  "pot": 50,
  "currentBet": 50,
  "currentPlayerIndex": 1,
  "phase": "FLOP",
  "started": true,
  "winnerId": null
}
```

---

### Join Game
Tham gia vào một game room.

**Destination:** `/app/game/{roomId}/join`

**Example:**
```javascript
const userId = 1;
stompClient.send(
  '/app/game/1/join',
  {},
  JSON.stringify(userId)
);
```

---

### Send Game Action
Gửi hành động trong game (Fold, Check, Call, Raise).

**Destination:** `/app/game/{roomId}/action`

**Request Format:**
```json
{
  "userId": 1,
  "action": "RAISE",
  "amount": 100
}
```

**Actions:**
- `FOLD` - Bỏ bài (amount không cần)
- `CHECK` - Check (amount không cần)
- `CALL` - Call bet hiện tại (amount không cần)
- `RAISE` - Raise bet (amount bắt buộc)

**Example:**
```javascript
// Fold
stompClient.send('/app/game/1/action', {}, JSON.stringify({
  userId: 1,
  action: 'FOLD',
  amount: 0
}));

// Check
stompClient.send('/app/game/1/action', {}, JSON.stringify({
  userId: 1,
  action: 'CHECK',
  amount: 0
}));

// Call
stompClient.send('/app/game/1/action', {}, JSON.stringify({
  userId: 1,
  action: 'CALL',
  amount: 0
}));

// Raise
stompClient.send('/app/game/1/action', {}, JSON.stringify({
  userId: 1,
  action: 'RAISE',
  amount: 100
}));
```

---

## Game Flow

### 1. Tạo/Tham gia phòng
```
POST /api/rooms (tạo phòng mới)
hoặc
GET /api/rooms (xem danh sách phòng)
```

### 2. Kết nối WebSocket
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
stompClient.connect({}, onConnected);
```

### 3. Subscribe game updates
```javascript
stompClient.subscribe('/topic/game/1', handleGameUpdate);
```

### 4. Join game
```javascript
stompClient.send('/app/game/1/join', {}, JSON.stringify(userId));
```

### 5. Chơi game
```javascript
// Khi đến lượt của bạn
stompClient.send('/app/game/1/action', {}, JSON.stringify({
  userId: userId,
  action: 'RAISE',
  amount: 100
}));
```

### 6. Nhận updates
```javascript
function handleGameUpdate(message) {
  const gameState = JSON.parse(message.body);
  // Update UI với game state mới
}
```

---

## Game Phases

1. **WAITING** - Chờ người chơi
2. **PRE_FLOP** - Sau khi chia bài, trước flop
3. **FLOP** - 3 bài chung đầu tiên
4. **TURN** - Bài chung thứ 4
5. **RIVER** - Bài chung thứ 5
6. **SHOWDOWN** - Xác định người thắng

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

Hiện tại chưa có rate limiting. Trong production nên implement:
- Authentication endpoints: 5 requests/minute
- API endpoints: 100 requests/minute
- WebSocket: 50 messages/second

---

## Testing API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import collection từ `postman_collection.json` (nếu có)
2. Set environment variable `token` sau khi login
3. Test các endpoints

---

## WebSocket Testing

Sử dụng tool như:
- **Postman** - WebSocket support
- **wscat** - Command line WebSocket client
- **Browser Console** - JavaScript WebSocket API

**Example với wscat:**
```bash
npm install -g wscat
wscat -c ws://localhost:8080/ws
```

---

## Support

Nếu có câu hỏi về API:
1. Xem documentation này
2. Check source code trong `backend/src/main/java/com/poker/controller/`
3. Tạo issue trên GitHub

---

**Happy coding! 🎰**
