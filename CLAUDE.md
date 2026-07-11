# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No testing framework is configured.

## Architecture

Next.js 14 App Router site for BEEDS creative agency (Japan-focused video/content production). TypeScript + Tailwind CSS throughout.

**Design:** The canonical design is documented in `Beeds.md` (ported from `preview.html`). Always follow it. It is an editorial/minimalist look: Times New Roman serif, light `#f5f5f5` background, black text, hairline `1px solid #000` dividers, sharp corners (the booking calendar/form are the only rounded elements).

**Page structure:**
- `src/app/page.tsx` — Homepage (server component): Navigation → Hero → Portfolio (Featured Work) → Services → Clients → VideoPortfolio (Selected Reel) → About → BookingCalendar (Contact) → Footer
- `src/app/booking/page.tsx` — Booking page (server component with metadata): Navigation → BookingCalendar → Footer
- `src/app/api/bookings/route.ts` — POST endpoint; validates with Zod, persists to SQLite via Prisma, sends email via Resend (no-op if `RESEND_API_KEY` unset). Returns 201/400/500.

Section components live in `src/components/sections/` (Hero, Portfolio, Services, Clients, About); `BookingCalendar.tsx` is the calendar booking widget. `Hero` is a client component (typewriter animation).

**Path alias:** `@/*` → `./src/*`

**Backend libs:**
- `src/lib/prisma.ts` — singleton `PrismaClient` using `@prisma/adapter-libsql` (SQLite local, swappable to Postgres via adapter swap + `DATABASE_URL`).
- `src/lib/email.ts` — sends booking confirmation (customer) + notification (info@beedstu.com) via Resend API; graceful no-op if `RESEND_API_KEY` unset.
- `prisma/schema.prisma` — `Booking` model (id, name, email, service, message?, date, time, createdAt). Migrations in `prisma/migrations/`.
- Generated Prisma client at `src/generated/prisma/` (gitignored; run `npx prisma generate` after checkout).

## Styling

Editorial design system — see `Beeds.md`. Global CSS classes in `src/app/globals.css`: `.nav`, `.eyebrow`, `.container-x`, `.work-grid`/`.work-item`, `.service-item`, `.client-list`, plus typewriter (`.typewriter-cursor`) and calendar/booking styles. Tailwind utilities are used inline for layout. Sharp corners everywhere except the booking calendar/form.

## Current State & TODOs

**Booking persistence + email are implemented.** The `/api/bookings` route validates with Zod, writes to SQLite (Prisma 7 + libsql adapter), and emails via Resend.

**Prod env vars to set:**
- `DATABASE_URL` — e.g. `postgresql://user:pass@host:5432/dbname` for Supabase/Postgres (swap provider in schema.prisma + run `npx prisma migrate deploy`)
- `RESEND_API_KEY` — from https://resend.com (if unset, email is skipped and logged; bookings still succeed)
- `RESEND_FROM` — verified sender address, e.g. `BEEDS <noreply@beedstu.com>` (defaults to that if unset)

**After checkout / deploy:**
1. `npm install`
2. `npx prisma generate` (client is gitignored)
3. `npx prisma migrate deploy` (or `migrate dev` for local)

**Remaining TODOs:** Portfolio items, client names, and contact info (`info@beedstu.com`, `+81 (0) 123 456 7890`) are placeholders for real content.
