# SyncGrid Client

A modern, real-time multiplayer Tic-Tac-Toe frontend built with Next.js 16 and React 19. Features live gameplay, animated UI, user profiles, and seamless WebSocket integration for instant game updates.

## 🚀 Features

- **Real-Time Gameplay** — Live game updates via Socket.IO with connection state recovery
- **Smart Matchmaking** — Find opponents with preferred piece (X or O)
- **User Profiles** — Customizable profiles with avatars, bios, and game history
- **Live Spectating** — Watch ongoing games in real-time
- **Responsive Design** — Optimized for desktop and mobile devices
- **Smooth Animations** — Framer Motion powered transitions and micro-interactions
- **Modern UI** — Built with Radix UI primitives and custom shadcn-style components

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.4 |
| **UI Library** | React 19.2.3 |
| **Styling** | Tailwind CSS 4.x |
| **State Management** | Redux Toolkit + React Redux |
| **Forms** | React Hook Form + Zod (via @hookform/resolvers) |
| **Real-Time** | Socket.IO Client 4.x |
| **Animations** | Framer Motion 12.x |
| **UI Components** | Radix UI + shadcn/ui |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Language** | TypeScript 5.x |

## 📁 Project Structure

```
client/
├── app/                      # Next.js App Router
│   ├── game/                 # Game pages
│   ├── login/                # Login page
│   ├── profile/              # Profile pages
│   ├── signup/               # Signup page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── not-found.tsx         # 404 page
├── components/
│   ├── main-page/            # Homepage components
│   ├── profile-page/         # Profile page components
│   ├── reusable/             # Shared components
│   └── ui/                   # UI primitives (shadcn-style)
│       ├── alert-dialog.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── combobox.tsx
│       ├── dropdown-menu.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── spinner.tsx
│       ├── table.tsx
│       └── ...
├── contexts/                 # React Context providers
│   ├── BannerLiveGameContext.tsx
│   ├── GamesFetchContext.tsx
│   ├── GameStateContext.tsx
│   ├── MatchmakingContext.tsx
│   └── ProfileFetchContext.tsx
├── hooks/                    # Custom React hooks
│   ├── auth/                 # Authentication hooks
│   ├── profile/              # Profile hooks
│   ├── useApiServiceHelper.tsx
│   ├── useGetScreenSize.tsx
│   └── useMutationService.tsx
├── lib/                      # Utilities and helpers
│   ├── socket/               # Socket.IO configuration
│   ├── types/                # TypeScript types
│   └── utils.ts              # Utility functions
├── providers/                # Provider components
│   ├── AuthProvider.tsx
│   ├── BannerLiveGameProvider.tsx
│   ├── ContextsProvider.tsx
│   ├── GameProvider.tsx
│   ├── LiveGameProvider.tsx
│   ├── PrivateProfileProvider.tsx
│   ├── PublicProfileProvider.tsx
│   ├── ReduxProvider.tsx
│   ├── SocketProvider.tsx
│   └── SonnerProvider.tsx
├── redux/                    # Redux store configuration
│   ├── apis/                 # RTK Query API slices
│   ├── slices/               # Redux slices
│   ├── base-query-config.ts
│   └── store.ts
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## 🎮 Core Features

### Authentication
- **Signup** — Create account with email, username, and password
- **Login** — Secure JWT-based authentication
- **Session Management** — Automatic token refresh
- **Protected Routes** — Auth-guarded pages and features

### Matchmaking
- Choose your preferred piece (X or O)
- Real-time opponent search with cancel option
- Automatic game room creation on match

### Gameplay
- Interactive game board with real-time updates
- Turn-based move validation
- Win/draw detection with visual feedback
- Game duration tracking
- Opponent status updates

### Profile
- Editable username and bio
- Profile picture upload
- Win streak display (current and best)
- Game history with pagination

## ⚙️ Environment Variables

Create a `.env.local` file in the client root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running SyncGrid server instance

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 🎨 UI Components

The client uses a custom component library built on Radix UI primitives with Tailwind CSS styling:

- **Alert Dialog** — Confirmation modals
- **Avatar** — User profile images with fallback
- **Badge** — Status indicators
- **Button** — Multiple variants and sizes
- **Card** — Content containers
- **Combobox** — Searchable dropdowns
- **Dropdown Menu** — Action menus
- **Field** — Form field wrapper
- **Input** — Text inputs with validation
- **Select** — Styled select menus
- **Skeleton** — Loading placeholders
- **Spinner** — Loading indicators
- **Table** — Data tables

## 🔌 Real-Time Features

### Socket.IO Integration
- Automatic connection with auth token
- Connection state recovery (25s window)
- Event-based communication for:
  - Matchmaking queue
  - Live game moves
  - Game status updates
  - Banner game streaming

### State Management
- **Redux Toolkit** — Global state and API caching
- **React Context** — Feature-specific state (game, profile, matchmaking)
- **React Hook Form** — Form state with validation

## 🌐 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with matchmaking and live games |
| `/login` | User login |
| `/signup` | New user registration |
| `/game/[id]` | Active game or game replay |
| `/profile` | Current user profile |
| `/profile/[username]` | Public user profile |

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-aware layouts
- Touch-friendly interactions
- Custom `useGetScreenSize` hook for responsive logic

## 🔒 Security

- JWT tokens stored securely
- Automatic token refresh
- Protected route guards
- XSS prevention with React

## 📝 License

Private

## 👤 Author

**Olatunji Jamaldeen**
