# CURSOR PROMPT — CourseFlow Admin UI upgrade

## Context
CourseFlow is a Next.js LMS (Prisma, auth, roles Admin/Student, enrollments, progress tracking).
The backend logic works. The Admin UI is too basic. Upgrade it to a professional admin panel.

Visual references are in `docs/design-references/` (read its README.md first and LOOK at every image).
Use them for layout and UX patterns only. Keep our existing dark theme (navy bg, cyan accent, glass cards).

## Rules (apply to every phase)
- First inspect the repo: stack, styling approach (Tailwind or CSS), existing components, Prisma schema, existing API routes. Reuse them. Do not add a new UI library unless truly needed.
- Do NOT break auth, roles, enrollments or progress tracking. No destructive Prisma migrations. If the schema must change, make additive changes only and tell me.
- Admin routes must stay protected (Admin role only), on both pages and API routes.
- Responsive (desktop first, usable on tablet), accessible (labels, focus states), loading/empty/error states everywhere.
- Work ONE phase at a time. At the end of each phase: list files changed, how to test, then STOP and wait for my "next".

## PHASE 1 — Admin layout shell
Ref: 01, 02
- Shared `/admin` layout: fixed left sidebar (logo, Dashboard, Courses, Students, Enrollments, Settings), top bar (search input, user avatar/menu with Logout), main content area.
- Active link highlight, collapsible sidebar on small screens.
- Move existing pages (/admin, /admin/courses, create/edit) into this layout without changing their logic.

## PHASE 2 — Courses table
Ref: 01, 05
- `/admin/courses`: table with columns Course (thumbnail + title), Category, Level, Modules, Students, Status, Actions (view / edit / delete).
- Tabs: All / Published / Draft. Search by title. Sort by title/date. Pagination (10 per page, server-side).
- Status pill (Published / Draft). Delete with confirm dialog. Bulk select optional.
- Toggle between table view and card grid view.
- "Create course" button top right.

## PHASE 3 — Course builder wizard
Ref: 07, 06, 04
- Replace the flat create form with a stepper: 1 Basic, 2 Info, 3 Modules & Lessons, 4 Media, 5 SEO, 6 Publish.
  - Basic: title, auto-generated editable slug, category, level, language, short description, description.
  - Info: duration, requirements, what students will learn.
  - Modules & Lessons: add / rename / reorder / delete modules and lessons (title, video URL placeholder, duration, free preview flag).
  - Media: thumbnail upload (preview, max 2MB) or URL.
  - SEO: meta title, meta description.
  - Publish: summary + Save as Draft / Publish.
- Per-step validation, progress kept between steps, edit mode reuses the same wizard.

## PHASE 4 — Dashboard analytics
Ref: 02, 03
- `/admin`: KPI cards (Total courses, Published, Students, Enrollments) with trend vs last period.
- Charts from real DB data: enrollments over time (line), completion rate (donut), top courses by enrollments.
- Recent enrollments list. Use a lightweight chart lib already in the repo, or recharts if none.

## PHASE 5 — Students & Enrollments
Ref: 01, 03
- `/admin/students`: table (name, email, enrolled courses, overall progress, joined date) with search and pagination.
- Student detail: enrollments + per-course progress.
- `/admin/enrollments`: table (student, course, progress %, date), filter by course, manual enroll / unenroll.

## Definition of done (each phase)
Builds with no TypeScript/lint errors, no console errors, existing flows still work
(Admin: create/edit/publish course. Student: login, view course, complete lesson, progress saved).
