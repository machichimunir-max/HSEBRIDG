# FIX ROUND 1 — HSE BRIDGE (what the first autonomous run left unfinished)

Read first: docs/AUTONOMOUS_RULES.md and docs/PROGRESS.md (rules still apply: no confirmation questions, FR+AR from the start with the same keys, RTL-safe CSS, brand colors, additive Prisma only, local commits only, never touch .env, never weaken tests).
Product reference: docs/hse-bridge-pack/docs/CURSOR_MASTER_PROMPT.md.

## HONESTY RULE (new, mandatory)
The previous run marked tasks as done when only a database model or a placeholder page existed. From now on a task is "done" ONLY if:
1. an admin or visitor can use it from the UI (no placeholder text such as "Phase 6", "Phase 7", "coming soon"),
2. a Playwright test covers its main flow and passes, with the real output shown,
3. it works in FR and AR.
Otherwise mark it "partial" or "stub" in docs/PROGRESS.md and say exactly what is missing. A DB model alone = NOT done.

## Known problems found by manual testing
- /admin/courses crashes: "TypeError: Cannot read properties of undefined (reading 'length')" at CoursesTableClient.tsx line ~253 (course.enrollments.length).
- /admin/boutique/products is a placeholder: there is no way to add a product, so the public shop shows 0 products in every category.
- Stale placeholders: admin dashboard still says "En attente Phase 6 / Phase 7"; /admin/users shows "Candidats / Employeurs: Phase 7"; /admin/settings says "Settings management coming soon" (in English).
- Recrutement admin: the job list and pipeline show, but there is no visible "create job" button; candidate CV upload and where files are stored must be verified.
- Phase 8 was NOT built: only the models exist (Quiz, QuizQuestion, QuizAttempt, Attestation). No quiz UI, no PDF attestation, no video player.
- Job cards use emoji icons (must be the outline icon set). The dev overlay shows "1 Issue": find and fix it.

## CHUNK A — Bugs and placeholders (do first)
1. Fix the /admin/courses crash at the root (query shape or missing include), not only with optional chaining. Add a Playwright test that opens /admin/courses and /admin/enrollments and /admin/students as admin.
2. Remove every stale placeholder listed above. The admin dashboard must show real numbers for the 3 pillars.
3. Real /admin/settings (additive Prisma model SiteSetting): site name, contact email, phone, WhatsApp number, address, social links (Instagram, LinkedIn). The public header, footer, floating WhatsApp button and contact page must read these values. Admin only. FR/AR labels.
4. Replace emoji icons with the outline icon set. Fix the "1 Issue" overlay and console warnings.
Commit.

## CHUNK B — Boutique: products (main gap)
Admin (/admin/boutique/products):
- List with search, category filter, visible/hidden filter, pagination, status pills; "New product" button; edit; delete with confirm.
- Create/edit form: name FR/AR, slug (unique, auto), category, short description FR/AR, description FR/AR, up to 5 images (upload + preview, jpg/png/webp, max 2MB, server-side type and size check, random filenames, set a cover image), certifications (tags such as CE, EN 397, EN 166, ANSI), specifications (key/value rows), stock status (in stock / on order / out of stock), optional reference/SKU, price optional (default display: "Sur devis"), featured toggle, visible toggle.
- Categories page: edit name/description/order/visibility, product count real.
Public:
- /boutique shows the 10 categories with real product counts; /boutique/[category] shows a product grid with search and filters (certification, stock status).
- Product page /boutique/produit/[slug]: gallery, specs, certifications, "Demander un devis" prefilled with the product, WhatsApp button prefilled with the product name.
- Quote basket (no payment): visitor can add several products to a quote list and submit one quote request with contact details; saved with items; admin inbox shows items, status pipeline (NEW, CONTACTED, QUOTED, WON, LOST), notes, and the email/WhatsApp quick actions.
- Empty states when a category has no product. No fake products in production seed; provide an optional script `npm run seed:demo-products` that creates 1 clearly named "DEMO -" hidden product per category for testing.
Playwright: admin creates a product with 2 images, it appears publicly, visitor adds it to a quote basket and submits, admin sees the request with the item and changes its status. Also test that a non-image upload is rejected.
Commit.

## CHUNK C — Recrutement: complete the admin side and verify the public side
- Admin: "New job" button and form (title FR/AR, domain from the 8 domains, contract INTERIM/CDD/CDI, national/international, city, description FR/AR, requirements, status active/closed), edit, close/reopen, delete with confirm.
- Public: job list with filters, job page, apply form with CV upload (pdf, doc, docx; max 5MB; verify real type server-side; random filename). CVs are personal data: store them OUTSIDE public/ and serve them only through an admin-protected route. Candidate gets a confirmation; admin gets a notification (stub email is fine).
- Admin pipeline moves an application through NEW, SHORTLISTED, INTERVIEW, PLACED, REJECTED; CV download works for admin only; candidate database search works.
- Employer request form saved and visible in the admin inbox.
Playwright: admin creates a job, a visitor applies with a PDF CV, admin sees the application, downloads the CV, moves the status; logged-out user cannot open the CV URL.
Commit.

## CHUNK D — Formations: finish Phase 8 for real
- Admin: quiz builder per lesson or module (questions, options, correct answer, passing score, optional time limit), inside the course wizard or lesson edit page.
- Student: take the quiz, see the score and answers, retry, results stored; completing the course requires passing required quizzes.
- Attestation PDF generated at 100% completion (and quizzes passed): student name, course title, date, unique certificate number, verification code, HSE BRIDGE logo, brand colors, FR (and AR when the language is AR, RTL correct, Arabic font that renders properly). Student downloads it from the dashboard. Public page /verify/[code] confirms validity.
- Video: lesson video provider field (BUNNY / LOCAL / URL), player component with a fallback when no video is set; Bunny signed URLs read keys from env vars only. Mark "needs my Bunny keys" in PROGRESS.md if the keys are missing, and test the LOCAL/URL path.
Playwright: admin adds a quiz, student passes it, completes the course, downloads the attestation, the verify page validates the code.
Commit.

## CHUNK E — Real final verification (the previous "final pass" showed no evidence)
1. Run the complete Playwright suite and the build. Show the real output. Fix every failure.
2. Security checks with tests: logged-out and non-enrolled users cannot get lesson content or video URLs; students get 401/403 on every admin page and API; uploads (product images, thumbnails, CVs) reject wrong types and oversized files; CVs are not reachable by URL without admin auth; forms validate server-side; no secret in the code or in git history (scan).
3. FR and AR on every page of the 3 pillars and both layouts (key parity script, dir="rtl"); screenshots are not needed, tests are.
4. Update README.md (what the project is, how to run, env variables WITHOUT secrets, how to run tests).
5. Write docs/FINAL_REPORT.md with an honest table: feature, status (done / partial / stub), test covering it, and what still needs me (API keys, payment provider, real photos, WhatsApp number, content to review).
Commit.

## Working rules for this round
- One chunk at a time, in order A, B, C, D, E. Update docs/PROGRESS.md after each chunk and commit.
- Keep responses short. If your context passes 70%, update PROGRESS.md, commit, and tell me to start a fresh session.
- Do not start payment or cart with online payment. Do not deploy. Do not push.
