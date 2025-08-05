# TypingMentor

A full-stack typing speed testing platform. Take timed or passage-based typing tests, see
real-time WPM/accuracy statistics, save your results, and compete on a global leaderboard.

## Features

- Timed mode (15 / 30 / 60 / 120 seconds) and passage mode
- Real-time WPM, Net WPM, accuracy, and error tracking while typing
- Framework-independent typing engine (no calculations inside React components)
- JWT authentication (register, login, logout, current user)
- Anonymous typing allowed; only authenticated users can save results
- Typing history with pagination
- Personal statistics dashboard (best/average WPM, accuracy, totals)
- Global leaderboard powered by a MongoDB aggregation pipeline
- Profile page with editable username
- Loading, empty, and error states throughout
- Responsive, accessible, keyboard-friendly UI

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Axios
**Backend:** Node.js, Express.js, TypeScript
**Database:** MongoDB + Mongoose
**Auth:** JWT, bcryptjs
**Validation:** Zod
**Testing:** Vitest, Supertest, mongodb-memory-server

## Architecture

Monorepo with three workspaces:

```
TypingMentor/
├── client/   Next.js frontend (App Router, feature-based structure)
├── server/   Express backend (routes → controller → service → repository → model)
├── shared/   Shared TypeScript types, constants, and Zod schemas
├── docker/   Dockerfiles for client and server
```

Backend layering is strict: routes never contain business logic, controllers never query
MongoDB directly — everything flows through a service and repository layer.

## Folder Structure

See `client/`, `server/`, and `shared/` for the full breakdown. Key highlights:

- `client/features/typing/engine/` — the pure TypeScript typing engine (`TypingEngine`,
  `Timer`, `CharacterAnalyzer`, `WpmCalculator`, `AccuracyCalculator`, `ResultCalculator`)
- `client/features/typing/constants/passages.ts` — 22 local passages (no external API)
- `server/src/modules/*` — one module per domain concept (auth, users, results, leaderboard,
  statistics, typing)

## Environment Variables

Copy `.env.example` and create:

**`server/.env`**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/typingmentor
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**`client/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Never commit `.env` files.

## Local Setup

### 1. Install dependencies

```bash
npm install --workspaces
```

### 2. MongoDB Setup

Either run MongoDB locally, use `docker-compose up mongo`, or point `MONGODB_URI` at a
MongoDB Atlas cluster.

### 3. Backend Setup

```bash
cd server
cp .env.example .env   # then edit values
npm run dev
```

Server runs on `http://localhost:5000`.

### 4. Frontend Setup

```bash
cd client
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Running Tests

```bash
# Backend (auth, results, leaderboard integration tests via in-memory MongoDB)
cd server && npm test

# Frontend (typing engine unit tests: WPM, Net WPM, accuracy, character analysis)
cd client && npm test
```

## Docker

```bash
docker-compose up --build
```

This starts MongoDB, the backend on port 5000, and the frontend on port 3000.
MongoDB Atlas can still be used in production by setting `MONGODB_URI` accordingly.

## API Endpoints

| Method | Endpoint                  | Auth | Description                     |
|--------|----------------------------|------|----------------------------------|
| POST   | `/api/auth/register`       | No   | Create an account               |
| POST   | `/api/auth/login`          | No   | Log in, returns JWT             |
| POST   | `/api/auth/logout`         | No   | Stateless logout                |
| GET    | `/api/auth/me`             | Yes  | Current authenticated user      |
| GET    | `/api/users/me`            | Yes  | Get own profile                 |
| PATCH  | `/api/users/me`            | Yes  | Update username                 |
| GET    | `/api/typing/passages`     | No   | List local passages             |
| POST   | `/api/results`             | Yes  | Save a completed test result    |
| GET    | `/api/results/history`     | Yes  | Paginated test history          |
| GET    | `/api/statistics`          | Yes  | Personal aggregated statistics  |
| GET    | `/api/leaderboard`         | No   | Global top-100 leaderboard      |

All responses use the shape `{ success, message, data? }`.

## Deployment

- **Frontend:** Vercel — set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- **Backend:** Render — set all backend environment variables, ensure `CLIENT_URL` matches
  your deployed frontend origin for CORS.
- **Database:** MongoDB Atlas — set `MONGODB_URI` to your Atlas connection string.

## Screenshots

_(Add screenshots of the landing page, typing test, dashboard, and leaderboard here.)_

## Future Improvements

- Multiplayer / race-against-friends mode
- More passage categories and difficulty-based scoring
- Keyboard heatmap of common mistakes
- Email verification and password reset flow
