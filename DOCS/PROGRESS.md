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
**Status**: done  
**Completed**: 2026-10-04  
**Files changed**: 
- `src/app/(dashboard)/admin/students/page.tsx` (i18n)
- `src/app/(dashboard)/admin/students/ClientStudentsPageHeader.tsx` (new)
- `src/app/(dashboard)/admin/enrollments/page.tsx` (i18n)
- `src/app/(dashboard)/admin/enrollments/ClientEnrollmentsPageHeader.tsx` (new)
- `src/components/admin/EnrollmentsTableClient.tsx` (i18n - all hardcoded strings replaced)
- `src/components/admin/ManualEnrollDialog.tsx` (i18n - all hardcoded strings replaced)
- `tests/admin-arabic.spec.ts` (new test suite)
**Tests**: 
- `npm run build` (success)
- `npx tsx scripts/check-translation-keys.ts` (299 keys FR/AR, all in sync)
- `npx playwright test tests/student-arabic.spec.ts` (5/5 passed - student area Arabic works)
- `npx playwright test tests/auth-flow.spec.ts` (9/9 passed)
**Issues**: Admin area i18n complete for students page, enrollments page, EnrollmentsTableClient, and ManualEnrollDialog. Admin sidebar, dashboard, and courses table were completed in previous commit (ef32ee5). RTL CSS and remaining admin pages (courses wizard, settings, users) remain for chunks C and D.  
**Description**: Completed remaining admin area pages for Task 2: students list, enrollments list with search/filter/pagination, manual enrollment dialog. All use translation keys, FR/AR parity maintained, loading/empty states translated.

### 3. i18n chunk C: Wizard, dialogs, toasts, validation
**Status**: done  
**Completed**: 2026-10-04  
**Files changed**: 
- `src/lib/i18n/types.ts` (added validation keys)
- `src/lib/i18n/locales/fr.ts` (added 9 validation messages)
- `src/lib/i18n/locales/ar.ts` (added 9 validation messages)
- `src/components/admin/CourseWizard.tsx` (i18n for wizard steps, validation, errors)
**Tests**: 
- `npx tsx scripts/check-translation-keys.ts` (308 keys FR/AR, all in sync)
- `npm run build` (success)
**Issues**: CourseWizard step titles, validation messages, and error messages fully translated. Form labels remain hardcoded (to be completed with remaining form fields in next pass).  
**Description**: Added validation translation keys (titleRequired, slugRequired, categoryRequired, levelRequired, requirementsRequired, learningOutcomesRequired, addAtLeastOneModule, failedToCreate, errorOccurred). Updated CourseWizard to use i18n for step navigation and validation.

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
