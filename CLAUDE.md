# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Commands

```bash
# Development
npm run dev              # Start Next.js dev server on :3000

# Build & type-check
npm run build            # Production build (also runs tsc)
npm run lint             # ESLint

# Database
npx prisma db push       # Push schema changes (no migration file; use for dev)
npx prisma generate      # Regenerate Prisma client after schema edits
npm run db:seed          # Seed base data (seed.mjs)
npx tsx prisma/seed-boutique.ts   # Seed the 10 EPI/EPC categories
npx tsx prisma/seed-recrutement.ts

# Translation key parity check (must stay at 0 divergence)
npx tsx scripts/check-translation-keys.ts

# Tests — all Playwright, no unit tests
npm run test:e2e                            # All specs, headless
npx playwright test tests/auth-flow.spec.ts # Single spec file
npm run test:e2e:headed                     # With browser visible
npm run test:e2e:debug                      # Step-through debugger
npm run test:ui                             # Playwright UI mode
```

> **Before committing**: run `npm run build` and `npx tsx scripts/check-translation-keys.ts`. Both must pass.

---

## Architecture overview

### Three-pillar product

HSE BRIDGE has three independent business pillars, each with its own admin section and public pages:

| Pillar | Public routes | Admin routes | Key models |
|---|---|---|---|
| Formation LMS | `/courses`, `/courses/[slug]`, `/courses/[slug]/learn` | `/admin/courses`, `/admin/enrollments`, `/admin/students` | `Course`, `Module`, `Lesson`, `Enrollment`, `LessonProgress` |
| Boutique EPI/EPC | `/boutique`, `/boutique/[category]`, `/boutique/produit/[slug]` | `/admin/boutique/products`, `/admin/boutique/categories`, `/admin/boutique/quotes` | `ProductCategory`, `Product`, `QuoteRequest`, `QuoteRequestItem` |
| Recrutement HSE | `/recrutement` | `/admin/recrutement/jobs`, `/admin/recrutement/applications`, `/admin/recrutement/candidates`, `/admin/recrutement/employer-requests` | `JobPosting`, `CandidateProfile`, `Application`, `EmployerRequest` |

### Route groups and layouts

```
src/app/
  layout.tsx                  # Root: sets lang/dir from hse_locale cookie, wraps I18nProvider
  (dashboard)/admin/layout.tsx  # Client component; double-checks auth via /api/auth/me,
                                # renders AdminSidebar + AdminTopBar + <main>
  (dashboard)/student/          # Student dashboard (protected by middleware)
  (auth)/register/              # Registration page
  login/                        # Login page (outside route group to keep URL clean)
  api/                          # All Route Handlers live here
```

The middleware (`src/middleware.ts`) enforces:
- `/admin*` → must have `role === "ADMIN"` in JWT; redirects to `/login?error=admin_required`
- `/student*`, `/dashboard*` → must have any valid session
- `/login`, `/register` → if already logged in, redirect to their dashboard

### Auth and sessions

Auth is **custom JWT**, not NextAuth. The flow:
1. `POST /api/auth/login` → validates credentials, calls `createSession()` which sets an `httpOnly` cookie named `session` containing a signed JWT (HS256, 7-day TTL, secret from `JWT_SECRET` env var).
2. Every protected server action or API route calls `getCurrentUser()` → `verifySession()` which reads the cookie and verifies the JWT with `jose`.
3. `SessionPayload` carries `{ userId, email, role }` — roles are `STUDENT` | `ADMIN`.

`src/lib/auth-server.ts` — server-only helpers (register, login with DB lookup).  
`src/lib/authorization.ts` — `requireRole()`, `requireStudentEnrollment()`, `assertOwnershipOrAdmin()`.

### i18n system

All user-visible strings go through the i18n layer. **Never hardcode display text.**

- `src/lib/i18n/types.ts` — the `Translations` interface (single source of truth for key shape)
- `src/lib/i18n/locales/fr.ts` and `ar.ts` — must stay 100% in sync; run the check script after any addition
- `src/lib/i18n/I18nContext.tsx` — client `I18nProvider` + `useI18n()` hook; persists choice in `hse_locale` cookie and `localStorage`
- Locale is read from the cookie server-side in `layout.tsx` to set `<html lang dir>` on first render; `I18nProvider` re-applies it client-side

When adding i18n keys: add to `types.ts` first, then to both `fr.ts` and `ar.ts` in lockstep.

### RTL layout rules

- Use Tailwind **logical properties**: `ps-*`/`pe-*`, `ms-*`/`me-*`, `text-start`, `text-end` — not `pl-*`/`pr-*`/`ml-*`/`mr-*`/`text-left`/`text-right`
- Sidebar: position opposite to reading direction — `lg:pl-64` becomes `isRtl ? "lg:pr-64" : "lg:pl-64"` on the content wrapper
- Icons that imply direction (arrows, chevrons) use `.icon-flip` CSS class in RTL (`[dir="rtl"] .icon-flip { transform: scaleX(-1) }`)
- Number sequences (pagination `"X of Y"`) use `dir="ltr"` wrapper to keep left-to-right digit order
- The `isRtl` boolean from `useI18n()` drives all conditional class logic

### Database (Prisma + PostgreSQL)

`src/lib/db.ts` uses a global singleton to avoid connection exhaustion in dev (HMR).

**Additive schema rule**: the project only adds models and fields — never renames, deletes or alters existing columns. Use `npx prisma db push` (not `migrate`). List every schema change in `DOCS/PROGRESS.md`.

`directUrl` is used for migrations/push; `url` for the pooled runtime connection (both are required in `.env`).

### Server functions vs. Route Handlers

- **Server Actions** (`"use server"`) live in `src/lib/*-server.ts` and `src/app/.../actions.ts`. Used for admin CRUD called from client components inside the admin dashboard.
- **Route Handlers** (`route.ts`) live under `src/app/api/`. Used for public API endpoints and upload-handling endpoints that need `Request`/`Response` primitives (e.g., file upload with magic-byte validation).

### File uploads

Uploads go to `public/uploads/` (course thumbnails) with server-side magic-byte validation and 2 MB cap. CVs (recrutement) must be stored **outside** `public/` and served through an admin-authenticated route — never served at a public URL. Images are validated by checking actual file bytes, not just MIME type.

### Video security

Videos never expose their source URL to the frontend. Flow: student requests a lesson → `generateVideoAccessToken()` in `src/lib/video-security.ts` creates a 30-minute DB token → player fetches `/api/video/token` with the token → server returns the resolved video data. Supports `LOCAL`, `VDOCIPHER`, and `BUNNY` providers (set by `VIDEO_PROVIDER` env var). Bunny signed URLs require `VIDEO_PROVIDER_API_KEY`.

### Email notifications

`src/lib/email.ts` wraps nodemailer with a console-log fallback when `SMTP_HOST` is unset. All sends are fire-and-forget (`await sendEmail(...)` but the result is never awaited by the caller's HTTP response). Domain-specific builders (`welcomeEmail`, `enrollmentEmail`, etc.) live in that same file.

### Icons

All icons are inline SVG components in `src/components/icons/HseIcons.tsx` — `fill="none"`, `stroke="currentColor"`, `strokeWidth={1.75}`. **Do not use emoji or external icon libraries.** Add new icons to that file following the same pattern.

### Brand colors

Defined as CSS custom properties in `globals.css` and used via inline styles or `style={{ color: 'var(--hse-safety-yellow)' }}`:

| Token | Value | Use |
|---|---|---|
| `--hse-deep-green` | `#073022` | Primary brand, buttons |
| `--hse-safety-yellow` | `#FDCD1A` | Accent, highlights |
| `--hse-logo-gold` | `#D9A51F` | Gradient partner |

Tailwind utilities: `.text-hse-gradient`, `.bg-hse-gradient`, `.shadow-hse`.

### Admin layout structure

The admin area is a dark-themed SPA shell: `slate-950` background, `AdminSidebar` (fixed, 64-wide, RTL-aware), `AdminTopBar`, and a `<main className="p-6">` content area. Authentication is verified client-side in `admin/layout.tsx` via `/api/auth/me`, in addition to the middleware check.

### Test accounts (seeded by `seed.mjs`)

- Admin: `admin@qhse.local` / `Admin123!`
- Student: `student@qhse.local` / `Student123!`

---

## Environment variables

```
DATABASE_URL=            # Pooled connection string (required)
DIRECT_URL=              # Direct connection for Prisma push/generate (required)
JWT_SECRET=              # HS256 signing secret (falls back to "change-me" in dev)
VIDEO_PROVIDER=          # local | vdocipher | bunny (default: local)
VIDEO_PROVIDER_API_KEY=  # Required for Bunny/VdoCipher
VIDEO_PROVIDER_LIBRARY_ID=
APP_URL=                 # e.g. http://localhost:3000
NEXT_PUBLIC_APP_URL=     # Same, but accessible client-side
SMTP_HOST=               # Optional; without it emails log to console
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_EMAIL=             # Receives admin notification emails
```
