# AUTONOMOUS MODE — HSE BRIDGE (rules + order of work)

Source of truth for the product: docs/hse-bridge-pack/docs/CURSOR_MASTER_PROMPT.md (and docs/I18N_STATUS.md for i18n).
Do not ask me for confirmation between tasks or phases. Skip any "Teach auto mode" question.

## State file
Maintain docs/PROGRESS.md. At the top of it, copy a 10-line summary of these rules.
For every task keep: status (todo / in progress / done / blocked), date, files changed, tests run + result, open issues.
Update it after EVERY task. At the start of any session: read docs/PROGRESS.md first and continue from the first task not done.

## Order of work
1. i18n chunk A: Arabic in the student area (login/register, dashboard, my courses, catalog, course detail, learning page), FR/AR switcher persisted in a cookie, dir="rtl" + lang="ar" on <html>, logical CSS properties.
2. i18n chunk B: Arabic in the admin area (sidebar, dashboard, courses table, enrollments, students) + switcher.
3. i18n chunk C: wizard, dialogs, toasts, validation messages.
4. i18n chunk D: full RTL in admin (sidebar on the right, mirrored icons, tables, stepper, modals, progress bars).
   (Arabic course content fields = chunk E: SKIP for now.)
5. PHASE 6: Boutique EPI/EPC.
6. PHASE 7: Recrutement HSE.
7. PHASE 8: quiz + PDF attestation (logo, unique verification code, public verify page). Bunny video: build the integration with env vars and a fallback, mark "needs my API keys".
8. PHASE 9: email notifications behind an interface with a dev stub (log to console), mark "needs my provider keys". Do NOT build payment or cart: mark "waiting for my decision".
9. FINAL PASS.

## For each task
- Implement fully, following the master prompt. FR and AR strings from the start (same keys in both files, run the key-parity script), RTL-safe CSS, brand colors, loading/empty/error states.
- Additive Prisma changes only, list them in PROGRESS.md.
- Write Playwright tests for it, run them AND the existing suites. Show the real output. Fix failures and re-run. After 3 failed attempts on the same problem, mark it "blocked" with the reason and move on.
- Run build + TypeScript. Commit locally: git add -A && git commit -m "<task>: <summary>". Never push. Never commit .env, credentials files or public/uploads.

## Final pass
- Complete test suite + build, fix everything that fails.
- Security: logged-out and non-enrolled users cannot get lesson content or video URLs; students get 401/403 on every admin page and API; uploads (images, CVs) reject wrong types and oversized files; every form validates server-side; no secret in code or git (scan the repo).
- FR and AR on every page in both layouts (key parity, dir="rtl").
- Write docs/FINAL_REPORT.md: built per phase, blocked / waiting for me (API keys, payment provider, real photos, WhatsApp number, content to review), schema changes, how to run tests, manual checklist (15 steps max).

## Rules
- Never delete or modify data other than records prefixed E2E-TEST-. Never weaken, skip or delete a test to make it pass: fix the code. Do not touch .env.
- If you need a decision or a secret: do not stop. Use a stub, mark it in PROGRESS.md, continue with the next task.
- Keep each response short. Work in small steps. Update PROGRESS.md before the context fills up.
