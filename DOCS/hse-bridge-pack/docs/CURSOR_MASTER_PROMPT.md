# CURSOR MASTER PROMPT v2 — HSE BRIDGE platform (3 pillars)

## 0. Mission
The project started as "CourseFlow" (an LMS). It becomes the full platform of **HSE BRIDGE**, a company with 3 business lines:
1. **Formation HSE** (online + in-person training academy): this is the existing LMS, reused and extended.
2. **Vente EPI / EPC** (safety equipment shop).
3. **Recrutement HSE** (jobs, candidates, employers).
One brand, one account system, one admin panel, one public website.

Brand assets: `docs/brand/` (read `BRAND.md` first, LOOK at logos, cover and flyers).
UI layout references: `docs/design-references/` (README inside). Layout and UX only, never copy their colors.

## 1. Brand rules (mandatory)
- Rename every visible "CourseFlow" to "HSE BRIDGE". Keep internal code names unless trivial to rename.
- Use the logo files exactly as provided (copy to `public/brand/`): light logo on light backgrounds, dark logo on dark/green backgrounds. Never redraw or recolor it.
- Use `cover-banner.jpg` as the hero/cover of the public home page and as the social (Open Graph) image.
- Replace the cyan accent with the brand tokens from BRAND.md (deep green #073022, safety yellow #FDCD1A, black, white).
- Public website: light/white background like the flyers. Admin and student areas may stay dark, but with green and yellow accents instead of cyan.
- Languages: French default + Arabic (RTL support). Prepare i18n from the start; no hardcoded strings in components. Content wording comes from the flyers.
- Icons: one consistent outline icon set (no emoji style).

## 2. Platform blueprint

PUBLIC WEBSITE (French/Arabic)
- Home: cover banner, 3 pillar sections (Formations, Boutique EPI/EPC, Recrutement), why-us benefits, contact CTA, footer (Instagram, WhatsApp, LinkedIn, email).
- Pillar pages: /formations, /boutique, /recrutement, plus /contact and /a-propos.

PILLAR 1 — FORMATION (LMS)
- Public catalog of the 8 trainings: Animateur HSE, Supervisor HSE, Supervisor Levage, Responsable HSE, Inspecteur HSE, Travail en hauteur, SST / Contre incendie, Espace confiné.
- Student area: dashboard, my courses, learning page (lessons, video), progress, attestation (certificate) at the end of the training.
- Admin: course builder wizard, modules/lessons, enrollments, students.
- Benefits to show (from flyer): qualified trainers, theory + practice, attestation at the end, adapted to field needs.

PILLAR 2 — BOUTIQUE EPI / EPC
- Categories (from flyer): Protection de la tête (casques), Protection des yeux (lunettes), Protection auditive (bouchons, casques), Protection des mains (gants), Protection des pieds (chaussures de sécurité), Vêtements haute visibilité (gilets, vestes), Travail en hauteur (harnais, longes), Protection respiratoire (masques, filtres), Lutte contre l'incendie (extincteurs, RIA), EPC sécurisation (signalisation, balisage).
- Public: category grid, product list with search/filter, product page (images, description, certifications, specs), "Demander un devis" (quote request) and WhatsApp contact button.
- V1 = catalog + quote requests (no online payment). Cart and payment only in the last phase.
- Admin: categories, products (images, stock status, visible/hidden), quote requests inbox with status (new, contacted, quoted, won, lost).
- Benefits to show: certified products, fast delivery, personalized advice, partner of professionals.

PILLAR 3 — RECRUTEMENT HSE
- Domains (from flyer): Responsable HSE, Supervisor HSE, Inspecteur HSE, Supervisor Levage, Technicien travail en hauteur, Technicien espace confiné, SST / Lutte contre l'incendie, Animateur HSE.
- Contract types: Intérim, CDD, CDI. Scope: national and international projects.
- Candidate side: public job list with filters (domain, contract, location, national/international), job page, apply with CV upload, candidate profile (experience, certifications, languages, availability).
- Employer side: "Demander des profils" form (company, domain, contract, location, needs).
- Admin: job postings CRUD, applications pipeline (new, shortlisted, interview, placed, rejected), candidate database with search, employer requests inbox.
- Benefits to show: qualified and verified candidates, personalized support, fast matching, opportunities on large projects.

SHARED
- Auth and roles: Admin, Student, Candidate (a student can also be a candidate), optionally Employer. Protect pages AND API.
- Admin sidebar becomes multi-module: Dashboard, Formations, Boutique, Recrutement, Users, Settings.
- Services to plug in later: Bunny video, quizzes, PDF attestations, payment, email notifications.

## 3. Current status (from screenshots, verify in code)
DONE (as CourseFlow): landing, student dashboard, admin layout, courses table, admin dashboard, students page, settings placeholder.
NOT DONE: wizard, enrollments page, student learning page, e2e flow test, everything for Boutique and Recrutement, branding, i18n, video, quiz, attestation, payment.
Known issues: leftover "QHSE Test Course ..." drafts; colorful emoji sidebar icons.

## 4. Global rules (every phase)
- Inspect the repo first (stack, styling, Prisma schema, routes). Reuse, do not duplicate.
- NEVER break auth, roles, enrollment or progress. No destructive Prisma migrations: additive only. List every schema change.
- Suggested new models (adapt to the existing schema and naming): ProductCategory, Product, QuoteRequest(+items), JobPosting, CandidateProfile, Application, EmployerRequest.
- Protect admin pages and API routes. Validate input server-side. File uploads (images, CV) limited by type and size, stored safely.
- Loading, empty, error states. Accessible. Responsive (mobile matters for the public site). RTL-safe layouts (use logical CSS properties).
- Secrets only in environment variables.
- ONE phase at a time. At the end: files changed, how to test, test results, then STOP and wait for my "next".

## PHASE 0 — Audit and cleanup
- Report: what works, what is broken, what is missing, per area of the blueprint.
- Offer a script to remove the "QHSE Test Course ..." records (ask for my confirmation before deleting data).
- Run the end-to-end LMS flow and report pass/fail per step.

## PHASE 1 — Brand foundation + i18n
- Brand tokens (colors, typography, radius, shadows), logo components (light/dark), favicon, metadata and OG image from the cover.
- Rename visible CourseFlow to HSE BRIDGE. Replace cyan accents. Replace emoji icons.
- i18n FR/AR with language switcher and RTL support. Move existing strings to translation files.

## PHASE 2 — Public website
Ref: `docs/brand/flyers/*`, `cover-banner.jpg`.
- Header (logo, nav: Formations, Boutique, Recrutement, À propos, Contact, language switch, Login), home page with cover hero, the 3 pillar sections styled like the flyers (yellow banner + green circle icon, white cards with photo), benefits strip, contact CTA, footer.
- Pillar landing pages /formations, /boutique, /recrutement (content shells, wired to real data in later phases), /contact form with WhatsApp button.
- Photos: use placeholders or crop from flyers only as temporary; I will provide real images.

## PHASE 3 — Admin shell multi-module
Ref: 01, 02. Sidebar: Dashboard, Formations, Boutique, Recrutement, Users, Settings. Move existing courses/students/enrollments under "Formations". Dashboard shows KPIs per pillar (courses/students, quote requests, open jobs/applications).

## PHASE 4 — Formation: course builder wizard
Ref: 07 (main), 06, 04. Stepper: 1 Basic, 2 Info, 3 Content (modules and lessons builder with reorder, lesson video URL placeholder, free-preview toggle), 4 Media (thumbnail upload), 5 SEO, 6 Publish (summary, Save draft / Publish). Auto-save draft after step 1, same wizard for edit, per-step validation, unsaved-changes warning. No pricing step yet.
Test: create course -> 2 modules, 3 lessons -> reorder -> thumbnail -> publish -> edit a lesson.

## PHASE 5 — Formation: enrollments and student experience
- Admin enrollments page (filters, manual enroll/unenroll), student detail with progress.
- Public catalog of formations (cards, Ref 05) and course detail page, Enroll button.
- Learning page: lessons grouped by module, content/video area, mark complete, next/previous, locked for non-enrolled (free previews stay open). Progress saved, "Continue" resumes, "Recently watched" real data.
Test the full flow from section 0.

## PHASE 6 — Boutique EPI/EPC
Admin CRUD (categories, products, images), public catalog (category grid, search, filters, product page), quote request flow (form, saved to DB, admin inbox with statuses, email or WhatsApp notification hook), seed the 10 categories from the flyer.
Test: admin adds product -> visible publicly -> visitor requests a quote -> admin sees and updates status.

## PHASE 7 — Recrutement HSE
Admin job CRUD, public job list and page with filters, application with CV upload, candidate profile, employer profile request form, admin pipeline and candidate search. Seed the 8 domains from the flyer.
Test: admin posts job -> candidate applies with CV -> admin moves application through statuses; employer request appears in admin.

## PHASE 8 — Video, quiz, attestation
- Bunny Stream video per lesson (keys in env vars, fallback if no video).
- Quiz per lesson/module (questions, passing score, results stored).
- PDF attestation at the end of a formation (student name, course, date, verification code, public verify page), branded with the logo.

## PHASE 9 — Notifications and payment
- Email notifications (quote received, application received, enrollment confirmation).
- Payment and cart: ask me to choose the provider first (options that work for Morocco). Do not start before my decision.

## Definition of done (each phase)
Builds with no TypeScript or lint errors, no console errors, existing flows still work, phase tests executed and reported. Then STOP.
