# TypingMentor

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Neo--Brutalist-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-76%20Passing%20(100%25)-06D6A0?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-FFD60A?style=for-the-badge&logoColor=black)](https://opensource.org/licenses/MIT)

<p align="center">
  A full-stack, distraction-free typing speed platform engineered with a high-contrast <strong>Neo-Brutalist</strong> aesthetic. Practice on standardized timed tests, classical literature passages, realistic multi-language code snippets, or custom text with rollable quote presets. Track speed and accuracy progression with interactive SVG charts, unlock milestone badges and typist tier ranks, enjoy zero-latency tactile mechanical keyboard sound effects, and compete on the global leaderboard.
</p>

</div>

---

## Key Features

### 1. Distraction-Free Typing UX
- **Zero Live Distractions**: No live WPM counters, countdown bars, or fluctuating metrics during active typing. All performance statistics are displayed exclusively on the post-test results screen.
- **Smart Character States**: Untyped characters under the cursor remain a warm muted gray (`#aaa89c`)—never black—to prevent visual ambiguity. Soft-highlighted error states and space tolerance.
- **Advanced Keystroke Handling**: Intercepts `Tab` to prevent browser focus loss and auto-indents spaces. Supports newline (`\n`) and space line-breaking tolerance.

### 2. Diverse Test Modes
- **Timed Mode**: Standardized 15s, 30s, 60s, and 120s countdowns with seamless passage looping.
- **Passage Mode**: Curated excerpts from classic literature, philosophy, and thought-provoking speeches.
- **Code Mode**: Syntax-accurate code snippets across **JavaScript**, **Python**, **C++**, **Java**, and **Rust**.
- **Custom Text & Rollable Presets**: Paste custom texts or roll from **35+ curated quotes** across 5 categories (*Pangrams*, *Tech Quotes*, *Philosophy*, *Literature*, and *Agility Twisters*) with a 1-click dice randomizer (`🎲`).
- **Punctuation Flag**: Dedicated toolbar toggle (`@ punctuation [ON/OFF]`) across `time`, `passage`, and `custom` modes to practice with full punctuation and capitalization or lowercase-only without punctuation.

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

### 5. Industry-Standard Pure Scoring Engine
- **Core WPM & Raw WPM**: Fully standardized to Monkeytype conventions:
  - **Core WPM**: Characters in 100% correct words only divided by 5 per minute. Words with even one typo contribute 0.
  - **Raw WPM**: All typed keystrokes divided by 5 per minute, accurately capturing raw physical mechanical speed including backspaced typos.
- **Consistency Rating (0–100%)**: Implements Monkeytype's signature mathematical formula using population coefficient of variation ($\text{cov} = \sigma / \mu$) and a hyperbolic tangent polynomial expansion ($z = \text{cov} + \text{cov}^3/3 + \text{cov}^5/5$).
- **4-Way Keystroke Classification**: Evaluates `correct`, `incorrect`, `extra` (overtyped beyond word length), and `missed` characters with full newline and space interchangeability in code modes.
- **Alternative Grading Standards**: Built-in support for 10FastFingers (capital letters = 2 keystrokes), TypeRacer instantaneous burst formulas, Typing.com, Type to Learn, eSkill, and hiring percentile normalization via standard Gaussian error function ($\text{erf}$).

### 6. Authentication & Competitive Leaderboard
- **Email Verification**: Secure 32-byte crypto verification tokens with zero-friction development fallback (prints verification links in the server console when SMTP is not configured).
- **Google OAuth 2.0**: 1-click Google Sign-In via Google Identity Services.
- **Competitive Integrity**: Global leaderboard is strictly restricted to standardized competitive modes (`Time`, `Passage`, `Code`); custom practice tests are excluded to ensure fair competition.

### 7. Feedback & Direct Support
- **Dedicated Feedback Portal (`/feedback`)**: Users can submit suggestions, bug reports, or queries directly from a dedicated Neo-Brutalist interface.
- **15-Minute Anti-Spam Cooldown**: Submissions are strictly rate-limited to once every 15 minutes per user account and client IP address.
- **Interactive Anti-Spam Modal Alert**: Attempts to spam or submit while on cooldown trigger an accessible Neo-Brutalist pop-up modal displaying a live countdown timer.
- **Direct Support Notification**: Automatic email notification dispatched via Brevo/Nodemailer to the team inbox (`byteforgelabs.app@gmail.com`) with the user's email set as `replyTo`.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS (Custom Neo-Brutalist Theme), Web Audio API, Axios, Lucide Icons, Vitest |
| **Backend** | Node.js (ES Modules), Express.js 4, MongoDB with Mongoose 8, Zod Validation, Bcryptjs, JWT, Nodemailer, Google Auth Library |
| **Testing** | Vitest, Supertest, MongoDB Memory Server (76 tests, 100% green test suite guarantee) |
| **DevOps** | Docker, Docker Compose, npm workspaces |

---

## Monorepo Architecture

```
TypingMentor/
├── client/              # Next.js 15 frontend application (App Router)
│   ├── app/             # Route handlers (test, dashboard, history, leaderboard, profile, feedback, auth)
│   ├── components/      # Common Neo-Brutalist UI components (Button, Card, TextField, Navbar, Footer)
│   ├── features/        # Modular domain features (auth, typing, dashboard, history, leaderboard, profile, feedback)
│   └── lib/             # Axios client, auth token storage, Tailwind merge utilities
├── server/              # Express REST API (layered domain architecture)
│   ├── src/modules/     # Feature modules (auth, users, results, leaderboard, statistics, typing, feedback)
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

# Support & Notifications
ADMIN_EMAIL=byteforgelabs.app@gmail.com

# SMTP (Optional in local dev; links log to terminal if unconfigured)
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

## NPM Scripts Reference

| Script | Workspace | Description |
| :--- | :--- | :--- |
| `npm.cmd run dev:client` | `client` | Starts Next.js development server on `http://localhost:3000` |
| `npm.cmd run dev:server` | `server` | Starts Express development server on `http://localhost:5000` |
| `npm.cmd run test:client` | `client` | Runs client Vitest suite (51 unit tests) |
| `npm.cmd run test:server` | `server` | Runs server Vitest suite with MongoDB Memory Server (25 integration tests) |
| `npm.cmd run build --workspace client` | `client` | Compiles production bundle and statically renders Next.js routes |
| `npm.cmd run start --workspace client` | `client` | Starts Next.js production server |

---

## Running Test Suites

```bash
# Run client Vitest suite (51 tests: scoring engine benchmarks, WPM math, accuracy, character analyzer, sound engine, punctuation formatting)
npm.cmd run test:client

# Run server Vitest suite (25 tests: auth flows, results, statistics, filtered leaderboards, feedback cooldown)
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

### Authentication & Users
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new account with email verification |
| `POST` | `/api/auth/login` | No | Log in with email/password; returns JWT |
| `POST` | `/api/auth/verify-email` | No | Verify email address with 32-byte crypto token |
| `POST` | `/api/auth/resend-verification` | No | Request a fresh email verification link |
| `POST` | `/api/auth/google` | No | Authenticate / register via Google OAuth 2.0 ID token |
| `GET` | `/api/auth/me` | Yes | Get currently authenticated user profile |
| `PATCH` | `/api/users/profile` | Yes | Update user display name |

### Typing Tests & Analytics
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/results` | Yes | Submit completed typing test result |
| `GET` | `/api/results/history` | Yes | Paginated history filterable by `mode` and `duration` |
| `GET` | `/api/statistics` | Yes | Aggregated performance metrics & recent test activity |
| `GET` | `/api/leaderboard` | No | Global top-100 rankings filterable by mode and duration |
| `GET` | `/api/typing/passages` | No | Retrieve curated passage texts by difficulty |

### Feedback & Support
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/feedback` | No | Submit feedback message (enforces 15-minute cooldown per user/IP) |
| `GET` | `/api/feedback/cooldown` | No | Check cooldown status and remaining time for IP/email |

---

## Standardized API Response & Error Contract

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "FEEDBACK_COOLDOWN_ACTIVE",
    "message": "You can only submit feedback once every 15 minutes. Please try again later.",
    "remainingSeconds": 840
  }
}
```

Common error codes:
- `VALIDATION_ERROR` (400) - Invalid or missing payload fields
- `UNAUTHORIZED` (401) - Missing or expired JWT token
- `EMAIL_NOT_VERIFIED` (403) - Account requires email verification
- `FEEDBACK_COOLDOWN_ACTIVE` (429) - 15-minute anti-spam limit active

---

## Contributing & Collaboration

We warmly welcome contributions from developers, designers, and keyboard enthusiasts of all skill levels! Whether you want to add new language passages to Code Mode, refine the sound synthesizer, optimize performance, or fix an edge-case bug, your contributions are appreciated.

### How to Contribute

1. **Fork the Repository**  
   Click the **Fork** button at the top right of the GitHub repository page.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/typingmentor.git
   cd typingmentor
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

4. **Development Guidelines**
   * **Design Identity**: Respect the **Neo-Brutalist** aesthetic (bold 2px black borders `#0d0d0d`, solid drop shadows `shadow-nb`, uppercase tracking, and warm canvas palettes).
   * **Pure Scoring Logic**: Keep typing math modular, unrounded, and UI-independent inside `ScoringEngine.js`.
   * **Backend Standards**: Maintain the layered architecture under `server/src/modules/<feature>/` with strict Zod input validation.

5. **Verify Test Suites**  
   TypingMentor enforces a **100% green test suite guarantee**. Ensure both suites pass cleanly before submitting:
   ```bash
   npm.cmd run test:client   # 51 client unit tests
   npm.cmd run test:server   # 25 server integration tests
   ```

6. **Submit a Pull Request (PR)**
   * Push your branch to GitHub: `git push origin feat/your-feature-name`
   * Open a **Pull Request / Merge Request** against the `main` branch.
   * Provide a clear description of your changes, reference any related issues, and attach before/after screenshots for any UI adjustments.
   * We review PRs promptly and welcome discussions!

### Ways to Contribute
* 💡 **Code Mode Passages**: Contribute authentic, idiomatic snippets in Go, Kotlin, TypeScript, Swift, or Zig.
* 🎨 **Sound Synthesizers**: Introduce new acoustic mechanical switch profiles or resonance characteristics.
* ⚡ **Accessibility & Speed**: Enhance ARIA landmarks, keyboard focus rings, and Core Web Vitals.
* 🐛 **Bug Reports & Feature Ideas**: Open an Issue on GitHub or submit feedback directly via the in-app `/feedback` page!

---

## License
MIT
