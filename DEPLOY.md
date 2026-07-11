# BEEDS — Deployment

Next.js 15 (App Router) site with a booking API that persists to a database (Prisma)
and sends confirmation email (Resend). It is a **server-rendered app**, so it needs a
**Node.js host** (Vercel, Render, Railway, Fly, a Node VPS, etc.) — not a static-only host.

## Requirements

- Node.js 18.18+ (20 LTS recommended)
- A database (SQLite works for a single small box; Postgres/Turso recommended for production)

## Quick start

```bash
npm install          # also runs `prisma generate` automatically (postinstall)
npm run build        # production build
npm run start        # serves on port 3000 (override with PORT=8080 npm run start)
```

That's the whole cycle. Most managed hosts run `npm install` → `npm run build` →
`npm run start` for you — just point them at this folder.

## Environment variables

Copy `.env.example` to `.env` and fill in values. None are required for the site to
render; they gate the booking database and email.

| Variable | Purpose | If unset |
|----------|---------|----------|
| `DATABASE_URL` | Booking database connection | Falls back to a local SQLite file (`file:./dev.db`) — fine for a demo, **not** for production |
| `RESEND_API_KEY` | Sends booking confirmation + notification email (resend.com) | Email is **skipped and logged**; the booking still saves and the form still succeeds |
| `RESEND_FROM` | Verified sender address, e.g. `BEEDS <noreply@beedstu.com>` | Defaults to that address |

## Database setup

The Prisma schema ships with `provider = "sqlite"`.

**SQLite (simplest):**
```bash
npx prisma migrate deploy    # creates the DB file + Booking table
```

**Postgres / Supabase / Turso (recommended for production):**
1. In `prisma/schema.prisma`, change the datasource `provider` to `"postgresql"`.
2. Set `DATABASE_URL` to your connection string.
3. `npx prisma migrate deploy`

No application-code changes are needed to switch databases — only the schema provider
and `DATABASE_URL`.

## Notes

- The booking form works with or without email configured; failures are caught so a
  visitor never sees a broken form.
- All four routes (`/`, `/about`, `/booking`, `/terms`) are static; `/api/bookings` is
  the only dynamic (server) route.
- Verified: production build compiles clean, all routes return 200, the API validates
  input (400 on bad payload), and every page is responsive with zero horizontal overflow
  at 390px (mobile) through desktop.
