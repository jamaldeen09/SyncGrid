# SyncGrid Server

A high-performance, real-time multiplayer Tic-Tac-Toe backend built with Express.js and Socket.IO. This server powers live gameplay, matchmaking, user authentication, and game state management with WebSocket-based communication.

## 🚀 Features

- **Real-Time Gameplay** — Live WebSocket connections for instant game updates and move synchronization
- **Smart Matchmaking** — Automated opponent matching based on player preferences (X or O)
- **JWT Authentication** — Secure access and refresh token system with token versioning
- **Rate Limiting** — Redis-powered API rate limiting for auth, profile, and game endpoints
- **Profile Management** — User profiles with bio, avatar uploads via Cloudinary, and win streak tracking
- **Game History** — Persistent game records with moves, duration, and results
- **Live Spectating** — Real-time game data streaming for spectators

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js with TypeScript |
| **Framework** | Express.js 5.x |
| **Real-Time** | Socket.IO 4.x |
| **Database** | MongoDB with Mongoose 9.x |
| **Caching** | Redis 5.x |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Validation** | express-validator |
| **File Upload** | Multer + Cloudinary |
| **Rate Limiting** | express-rate-limit + rate-limit-redis |

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration modules
│   │   ├── cloudinary.config.ts
│   │   ├── database.config.ts
│   │   ├── env.config.ts
│   │   ├── redis.config.ts
│   │   └── socket.config.ts
│   ├── controllers/      # Route handlers
│   │   ├── auth.controllers.ts
│   │   ├── game.controllers.ts
│   │   └── profile.controllers.ts
│   ├── lib/              # Utilities and validations
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose schemas
│   │   ├── Game.ts
│   │   └── User.ts
│   ├── routes/           # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── game.routes.ts
│   │   └── profile.routes.ts
│   ├── services/         # Business logic
│   │   ├── auth.services.ts
│   │   ├── db.service.ts
│   │   ├── game-play.service.ts
│   │   ├── game.service.ts
│   │   ├── matchmaking.service.ts
│   │   ├── redis.service.ts
│   │   ├── socket.service.ts
│   │   └── user.service.ts
│   ├── types/            # TypeScript type definitions
│   └── server.ts         # Application entry point
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Create a new user account |
| `POST` | `/login` | Authenticate and receive tokens |
| `GET` | `/session` | Get current session data |
| `GET` | `/refresh` | Refresh access token |
| `POST` | `/logout` | Invalidate current session |

### Profile (`/api/v1/profile`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/public/:username` | Get public profile by username |
| `GET` | `/private` | Get authenticated user's profile |
| `PATCH` | `/` | Update authenticated user's profile |

### Games (`/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/games/:userId` | Get paginated game history |
| `GET` | `/game/:gameId` | Get specific game details |
| `GET` | `/banner/game` | Get current live banner game |

## 🎮 WebSocket Events

### Client → Server

| Event | Description |
|-------|-------------|
| `find-opponent` | Request matchmaking with preference |
| `cancel-matchmaking` | Cancel ongoing search |
| `get-live-game` | Fetch live game data |
| `new-move` | Submit a move in active game |
| `banner-live-game` | Request banner game updates |
| `status-update` | Send game result status |

### Server → Client

- Real-time game state updates
- Opponent found notifications
- Move confirmations
- Game end events

## ⚙️ Environment Variables

Create a `.env` file in the server root with the following variables:

```env
# Server
PORT=3001
HOST_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
LOCAL_HOST_URL=http://localhost:3000

# MongoDB
MONGO_CONNECTION_STRING=mongodb://localhost:27017/syncgrid

# Redis
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- Redis instance
- Cloudinary account (for profile pictures)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm test` | Run tests (not configured) |

## 🗄️ Data Models

### User
- Email, username, password hash
- Profile picture URL and bio
- Win streak tracking (current and best)
- Token versioning for secure logout
- Timestamps (created, updated, last login)

### Game
- Players with X/O preferences
- Move history with timestamps and board locations
- Game settings (status, visibility)
- Result (decisive, draw, pending)
- Duration tracking

## 🔒 Security Features

- **Password Hashing** — bcrypt with secure salt rounds
- **JWT Tokens** — Short-lived access tokens, long-lived refresh tokens
- **Token Versioning** — Invalidate all sessions on password change
- **Rate Limiting** — Configurable limits per endpoint category
- **Input Validation** — express-validator on all routes
- **CORS** — Configured for specific frontend origins

## 📝 License

ISC

## 👤 Author

**Olatunji Jamaldeen**
