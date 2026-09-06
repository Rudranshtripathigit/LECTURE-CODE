# LectureCode Pro

A video-based learning platform with a live code compiler, gesture-locked
split-pane workspace, AI-driven lecture summaries and debugging, and
LeetCode-style daily learning analytics.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS, Framer Motion, Lucide Icons
- **Editor:** `@monaco-editor/react` (vs-dark theme)
- **Database/ORM:** PostgreSQL + Prisma
- **Auth:** NextAuth.js (GitHub + Google OAuth, JWT sessions)
- **Rate limiting:** Upstash Redis sliding-window limiter
- **AI:** Google Gemini (`@google/genai`)

## Getting Started (fastest path — local, zero signup)

This spins up Postgres and Redis in Docker. Authentication is plain email
+ password — no OAuth app registration needed at all. The **only** thing
you must provide yourself is a free Gemini API key.

```bash
npm install
docker compose up -d              # starts Postgres + Redis locally
cp .env.local.example .env        # pre-filled to match docker-compose.yml
# open .env and paste your key into GEMINI_API_KEY
#   → get one free at https://aistudio.google.com/apikey
npm run db:push                   # creates all tables in the local Postgres
npm run dev
```

Visit http://localhost:3000, click **Sign in → Create an account**, fill
in a name/email/password, and you're in. GitHub/Google sign-in also work
if you later add their client ID/secret to `.env` — otherwise those
providers simply aren't offered.

To stop everything: `docker compose down` (add `-v` to also wipe the DB).

## Getting Started (production / hosted setup)

For a real deployment, use hosted Postgres, Redis, and (optionally)
OAuth apps instead of the Docker stack above.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in every value:

```bash
cp .env.example .env
```

You'll need:
- A PostgreSQL connection string (`DATABASE_URL`) — e.g. from Neon or Supabase
- A `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- A Google Gemini API key
- An Upstash Redis REST URL + token (create a free database at
  https://console.upstash.com)
- GitHub/Google OAuth credentials — optional; email/password sign-in
  works without them

### 3. Set up the database

```bash
npm run db:push      # push the Prisma schema to your database
npm run db:studio    # optional: browse data in Prisma Studio
```

### 4. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000.

## Project Structure

```
lecturecode-pro/
├── prisma/schema.prisma        # User, Profile, LectureProgress, DailyStreak, QuizSubmission
├── src/
│   ├── app/
│   │   ├── api/ai/{analyze,summary,quiz}/route.ts   # Gemini-backed, rate-limited endpoints
│   │   ├── api/auth/[...nextauth]/route.ts          # NextAuth handler
│   │   ├── api/user/{analytics,progress}/route.ts   # Streak & progress endpoints
│   │   ├── (auth)/{login,register}/page.tsx
│   │   ├── dashboard/page.tsx                       # Profile + activity heatmap
│   │   ├── workspace/page.tsx                       # Video + compiler split view
│   │   └── page.tsx                                 # Landing page
│   ├── components/
│   │   ├── workspace/   # ResizableSplitPane, VideoPlayer, CodeEditor, modals, QuizArena
│   │   ├── analytics/   # ActivityHeatmap
│   │   └── ui/          # Glassmorphism Button, Card, Badge, Input, Modal
│   ├── lib/             # prisma.ts, redis.ts, gemini.ts, auth.ts, utils.ts
│   └── middleware.ts    # Protects /dashboard and /workspace
```

## Key Behaviors

- **Split-pane resizer** (`ResizableSplitPane.tsx`) starts locked. It only
  unlocks on a double-click/double-tap on the divider, glows cyan while
  unlocked, disables `pointer-events` on nested iframes during the unlocked
  state so drags aren't trapped by the YouTube/Monaco iframes, and re-locks
  on any click outside the divider.
- **AI routes** (`/api/ai/*`) are capped at **10 requests/minute** per
  authenticated user (falling back to IP for anonymous callers) via
  Upstash's sliding-window rate limiter, returning `429` when exceeded.
  All request bodies are validated with Zod.
- **Analytics** are derived entirely from the `DailyStreak` table: every
  progress update upserts today's row, then recomputes current/longest
  streak server-side so the client never has to reconcile state.

## Deploying to Production

Two supported paths — pick whichever fits your infrastructure.

### Option A: Docker (self-hosted / VPS)

```bash
# 1. On your server, create a real .env with production values: a
#    hosted Postgres URL, a hosted Redis (e.g. Upstash) URL/token, your
#    Gemini key, NEXTAUTH_URL set to your real domain, and a fresh
#    NEXTAUTH_SECRET (openssl rand -base64 32). OAuth is optional.

# 2. Push the schema to your production database once, before the app
#    container starts:
DATABASE_URL="<your production URL>" npx prisma db push

# 3. Build and start the app + a bundled Postgres container:
docker compose -f docker-compose.prod.yml --env-file .env up -d --build

# App is now serving on port 3000 — put a reverse proxy (nginx, Caddy,
# Traefik) in front of it for TLS.
```

Health checks are available at `GET /api/health` (checks both the
database and Redis are reachable) — point your load balancer or uptime
monitor at it.

### Option B: Vercel + managed Postgres/Redis

1. Push this repo to GitHub and import it into Vercel.
2. Provision Postgres (Vercel Postgres, Neon, or Supabase) and Redis
   (Upstash) — Vercel's Upstash integration wires the REST URL/token in
   automatically.
3. Add the remaining environment variables in the Vercel dashboard:
   `NEXTAUTH_URL` (your production domain), `NEXTAUTH_SECRET`, and
   `GEMINI_API_KEY`.
4. Run `npx prisma db push` once against the production `DATABASE_URL`
   to create the tables.
5. Deploy.

### Production checklist

- [ ] `.env` was never committed to git (check with `git log --all -- .env`)
- [ ] `NEXTAUTH_SECRET` is a fresh, random value — never reuse the local dev one
- [ ] `NEXTAUTH_URL` matches your real domain (including `https://`)
- [ ] Database and Redis are managed/hosted services, not the local Docker containers
- [ ] `GET /api/health` returns `{ "status": "healthy" }`

## Scripts

| Command             | Description                       |
| -------------------- | ---------------------------------- |
| `npm run dev`         | Start the dev server               |
| `npm run build`       | Production build                   |
| `npm run start`       | Start the production server        |
| `npm run db:push`     | Push Prisma schema to the database |
| `npm run db:migrate`  | Create/apply a Prisma migration    |
| `npm run db:studio`   | Open Prisma Studio                 |
