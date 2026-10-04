# PROGRESS — HSE BRIDGE

## Rules Summary
- Maintain this file after EVERY task
- Each task: status, date, files changed, tests run + result, open issues
- Never delete data except E2E-TEST- prefixed records
- Never weaken/skip/delete tests to make them pass: fix the code
- If blocked: use stub, mark here, continue
- Additive Prisma changes only
- Run tests + build after each task, commit locally, never push
- No secrets in code or git
- FR/AR strings from the start, RTL-safe CSS, brand colors, loading/empty/error states

## Tasks

### 1. i18n chunk A: Student area (login/register, dashboard, my courses, catalog, course detail, learning page)
**Status**: done  
**Started**: 2026-10-04  
**Files changed**: `tests/student-arabic.spec.ts` (Fixed locator)  
**Tests**: `npm run build` (success), `npx playwright test tests/student-arabic.spec.ts` (success)  
**Issues**: Student area files (`ClientDashboard`, `page.tsx`, `CatalogPage`, `CourseDetailClient`, `LearningPlayerClient`, `login/page.tsx`, `register/page.tsx`) were already translated. Fixed the playwright test.  
**Description**: Arabic support in student area, FR/AR switcher with cookie persistence, dir="rtl" + lang="ar" on <html>, logical CSS properties.

### 2. i18n chunk B: Admin area Arabic + switcher
**Status**: todo

### 3. i18n chunk C: Wizard, dialogs, toasts, validation
**Status**: todo

### 4. i18n chunk D: Full RTL in admin
**Status**: todo

### 5. PHASE 6: Boutique EPI/EPC
**Status**: todo

### 6. PHASE 7: Recrutement HSE
**Status**: todo

### 7. PHASE 8: Quiz + PDF attestation + Bunny video
**Status**: todo

### 8. PHASE 9: Email notifications
**Status**: todo

### 9. FINAL PASS
**Status**: todo

## Blocked Items
(none yet)

## Waiting for Decision/Keys
(none yet)

## Schema Changes
(none yet)
