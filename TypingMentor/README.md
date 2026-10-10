# TypingMentor

A full-stack, distraction-free typing speed platform built with a high-contrast **Neo-Brutalist** aesthetic. Practice on timed challenges, literature passages, realistic multi-language code snippets, or custom text with rollable quote presets. Track speed and accuracy progression with interactive SVG charts, unlock milestone badges and tier ranks, enjoy tactile mechanical keyboard switch sound effects, and compete on the global leaderboard.

---

## Features

### 1. Distraction-Free Typing UX
- **Zero Live Distractions**: No live WPM counters, countdown bars, or fluctuating metrics during active typing. All performance statistics are displayed exclusively on the post-test results screen.
- **Smart Character States**: Untyped characters under the cursor remain a warm muted gray (`#aaa89c`)—never black—to prevent visual ambiguity. Soft-highlighted error states and space tolerance.
- **Advanced Keystroke Handling**: Intercepts `Tab` to prevent browser focus loss and auto-indents spaces. Supports newline (`\n`) and space line-breaking tolerance.

### 2. Diverse Test Modes
- **Timed Mode**: 15s, 30s, 60s, and 120s standardized countdowns with seamless passage repetition.
- **Passage Mode**: Curated excerpts from classic literature, philosophy, and thought-provoking speeches.
- **Code Mode**: Syntax-accurate code snippets across **JavaScript**, **Python**, **C++**, **Java**, and **Rust**.
- **Custom Text & Rollable Presets**: Paste custom texts or roll from **35+ curated quotes** across 5 categories (*Pangrams*, *Tech Quotes*, *Philosophy*, *Literature*, and *Agility Twisters*) with a 1-click dice randomizer (`🎲`).

### 3. Tactile Mechanical Keyboard Sound FX
- **Zero-Latency Web Audio Synthesizer**: Programmatically synthesizes authentic acoustic switch clicks and resonance directly via browser `AudioContext` (<5ms latency, zero external audio assets).
- **5 Sound Profiles**: `Clicky (Cherry MX Blue)`, `Thocky Linear (Gateron/Holy Panda)`, `Vintage Typewriter`, `Soft Bubble`, and `Mute`.
- **Switch Accents**: Deeper spacebar stabilizer resonance, crisp backspace return transient, and celebratory test completion chime.
- **Persisted Volume & Switch Controls**: Quick toolbar popover with volume slider, test-click preview, and automatic `localStorage` persistence.

### 4. Progression, Analytics & Export
- **Interactive SVG Performance Chart**: Visualizes speed (Raw & Net WPM) and accuracy trendlines over recent test sessions with personal baseline average and delta badges.
- **Typist Tier Ranks**: 6 speed tiers (`Novice`, `Touch Typist`, `Swift`, `Pro`, `Master`, `Grandmaster`) displayed on user profiles and leaderboard tags.
- **Milestone Achievement Badges**: Unlockable badges (`Sniper`, `100+ Club`, `Grandmaster`, `Centurion`, `Veteran`, `Key Warrior`).
- **Filtered History & CSV Export**: Filter past tests by mode and duration, and download formatted `.csv` spreadsheets directly in the browser.

### 5. Authentication & Competitive Leaderboard
- **Email Verification**: Secure 32-byte crypto verification tokens with zero-friction development fallback (prints verification links in the server console when SMTP is not configured).
- **Google OAuth 2.0**: 1-click Google Sign-In via Google Identity Services.
- **Competitive Integrity**: Global leaderboard is strictly restricted to standardized competitive modes (`Time`, `Passage`, `Code`); custom practice tests are excluded to ensure fair competition.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS (Custom Neo-Brutalist Theme), Web Audio API, Axios, Lucide Icons, Vitest |
| **Backend** | Node.js (ES Modules), Express.js 4, MongoDB with Mongoose 8, Zod Validation, Bcryptjs, JWT, Nodemailer, Google Auth Library |
| **Testing** | Vitest, Supertest, MongoDB Memory Server (100% green test suite guarantee) |
| **DevOps** | Docker, Docker Compose, npm workspaces |

---

## Monorepo Architecture

```
TypingMentor/
├── client/              # Next.js 15 frontend application (App Router)
│   ├── app/             # Next.js routes (test, dashboard, history, leaderboard, profile, auth)
│   ├── components/      # Common Neo-Brutalist UI components (Button, Card, TextField, Navbar, Footer)
│   ├── features/        # Modular domain features (auth, typing, dashboard, history, leaderboard, profile)
│   └── lib/             # Axios client, auth token storage, Tailwind merge utilities
├── server/              # Express REST API (layered domain architecture)
│   ├── src/modules/     # Feature modules (auth, users, results, leaderboard, statistics, typing)
│   ├── src/middleware/  # JWT auth, Zod validation, error handling middleware
│   └── src/tests/       # Vitest integration test suites
├── shared/              # Shared constants (durations, test modes) and validation rules
├── docker/              # Docker blueprints for client and server
├── PROJECT_STRUCTURE.md # Comprehensive file-by-file codebase architecture guide
└── context.md           # Universal AI context and development roadmap
```

---

## Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/typingmentor
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# SMTP (Optional in local development; links log to terminal if unconfigured)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="TypingMentor" <no-reply@typingmentor.com>
```

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## Local Setup & Development

### 1. Install Dependencies
```bash
# Windows PowerShell
npm.cmd install

# macOS / Linux
npm install
```

### 2. Start Development Servers
```bash
# Start backend server (Express on http://localhost:5000)
npm.cmd run dev:server

# Start frontend client (Next.js on http://localhost:3000)
npm.cmd run dev:client
```

---

## Running Test Suites

```bash
# Run client Vitest suite (24 tests: engine math, accuracy, character analyzer, sound engine)
npm.cmd run test:client

# Run server Vitest suite (20 tests: auth flows, results, statistics, filtered leaderboards)
npm.cmd run test:server
```

---

## Docker Deployment

To spin up the entire application (MongoDB, Express backend, and Next.js frontend) with containerization:

```bash
docker compose up --build -d
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new account with email verification |
| `POST` | `/api/auth/login` | No | Log in with email/password; returns JWT |
| `POST` | `/api/auth/verify-email` | No | Verify email address with 32-byte crypto token |
| `POST` | `/api/auth/resend-verification` | No | Request a fresh email verification link |
| `POST` | `/api/auth/google` | No | Authenticate / register via Google OAuth 2.0 ID token |
| `GET` | `/api/auth/me` | Yes | Get currently authenticated user profile |
| `PATCH` | `/api/users/profile` | Yes | Update user display name |
| `POST` | `/api/results` | Yes | Submit completed typing test result |
| `GET` | `/api/results/history` | Yes | Paginated history filterable by `mode` and `duration` |
| `GET` | `/api/statistics` | Yes | Aggregated performance metrics & recent test activity |
| `GET` | `/api/leaderboard` | No | Global top-100 rankings filterable by mode and duration |
| `GET` | `/api/typing/passages` | No | Retrieve curated passage texts by difficulty |

All responses follow the standardized payload shape:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

---

## License
MIT
