# Proof & Play

Mathematical puzzle library (203 verified puzzles, 10 categories) with **ranked online 1v1 matches**: accounts, Elo matchmaking, live results and a leaderboard. Runs entirely on free tiers.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · KaTeX · Supabase (Postgres, Auth, Realtime)

## Status

| Area | State |
|---|---|
| Solo puzzle library (localStorage) | Done, unchanged |
| Database schema, RLS, matchmaking + answer-check functions | Written (`supabase/migrations`), run them once |
| Seed script (puzzles to DB, answers to a locked table) | Done |
| Auth: email/password, Google/GitHub, username | Done |
| Matchmaking queue, 1v1 match room, Elo, leaderboard | Done |
| Type-check / build / live test | **Not yet run** (written without network access); do `npm run typecheck && npm run build` first |

## Setup

1. `npm install`
2. Supabase dashboard → SQL Editor: run `supabase/migrations/001_proof_and_play.sql`, then `002_hardening.sql`.
3. `cp .env.example .env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (same page; used only by the seed script, never the browser)
4. `npm run seed` to import all puzzles.
5. Authentication → Providers: Email is on by default. For quick testing turn off "Confirm email" (Authentication → Sign In / Providers → Email). Enable Google/GitHub if wanted.
6. Authentication → URL Configuration: add `http://localhost:3000/auth/callback` (and your deployed URL's `/auth/callback`) to Redirect URLs.
7. `npm run dev`. Create two accounts (normal window + private window) and press **Find match** in both.

Other scripts: `npm run validate` (brute-force check of every puzzle answer), `npm run typecheck`, `npm run build`.

## How it works

- **Queue:** `join_queue()` is idempotent. A waiting client calls it every 4 s, which refreshes its place and widens the rating window (±100, +50 per 10 s). Stale rows (closed tabs) are purged.
- **Match:** the pairing creates a `matches` row. Both clients are notified through Realtime (`postgres_changes` on `matches`) and open `/match/[id]`.
- **Puzzle choice:** closest to the pair's average rating, preferring puzzles neither has solved.
- **Rules:** 20 minutes (database clock), first correct answer wins, one guess per 5 s, no hints.
- **Grading:** `submit_answer()` compares against `puzzle_secrets` server-side. Numbers are compared numerically (`1/2` = `0.5`).
- **Rating:** Elo, start 1200, K = 32. Draws/timeouts change nothing.
- **Security:** RLS on every table, no direct client writes, answers in a table with no read policy, all mutations through `SECURITY DEFINER` functions. Only `/play`, `/match/*`, `/account` run middleware; puzzle pages stay static.

## Free-tier notes (check supabase.com/pricing)

- ~200 concurrent Realtime connections and ~2M Realtime messages/month; only match-created and match-updated events are used.
- Free projects pause after 7 days of inactivity: add a daily keep-alive request (GitHub Actions cron).
- No automatic backups: schedule a weekly `pg_dump`.

## Known gaps

1. **Solo pages still ship answers.** `/puzzle/[slug]` includes the solution in its page data, so a player could open the solo page for their live match's puzzle. Fix: a separate ranked puzzle pool that has no solo page, or move solo checking to `check_answer` too.
2. **Not all puzzles suit ranked play.** Matches need short exact answers; hard Olympiad-style problems still need to be written or converted.
3. Puzzle ratings are static (no post-match adjustment yet).
4. Solo progress is still localStorage-only; migration to the `solves` table is not done.
5. No automated tests for the SQL functions yet.

## Layout

```
app/                 pages: / explore, puzzle, category, progress, settings, login, account, play, match/[id], leaderboard
components/          UI incl. LoginForm, AccountForm, PlayClient, MatchClient
lib/supabase/        browser + server clients, config
middleware.ts        session check for /play, /match, /account
supabase/migrations/ 001 schema + RLS + RPCs, 002 queue/answer hardening
scripts/             seed.ts, validate-puzzles.ts + checks/
data/                the puzzle bank
```
