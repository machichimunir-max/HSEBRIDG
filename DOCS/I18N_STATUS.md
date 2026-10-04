# I18N IMPLEMENTATION STATUS

**Last Updated**: 2026-10-04  
**Status**: PART 1 COMPLETE — Foundation Ready, Implementation Incomplete

---

## ✅ COMPLETED

### Translation Infrastructure
- **Translation keys**: 256 total (128 FR + 128 AR)
  - `auth` section: 17 keys (login/register forms, validation, errors)
  - `student` section: 32 keys (dashboard, courses, learning, progress)
  - `admin` section: 66 keys (sidebar, CRUD, wizard, tables, pagination)
  - `catalog` section: 9 keys (search, filters, results)
- **Files updated**: 
  - `src/lib/i18n/types.ts` - Extended Translations interface
  - `src/lib/i18n/locales/fr.ts` - All French translations
  - `src/lib/i18n/locales/ar.ts` - All Arabic translations
- **Verification**: ✅ Keys synchronized and validated

### Supporting Files
- **HSE Glossary**: `docs/GLOSSARY_HSE_AR.md`
  - 80+ professional HSE terms (French → Arabic)
  - Organized by category: Métiers, Formation, Sécurité, EPI, Recrutement, Boutique, Plateforme
  - Context notes for professional usage in Morocco/Maghreb

- **Key Validation Script**: `scripts/check-translation-keys.ts`
  - Recursively compares FR and AR translation keys
  - Exits with code 1 if keys are out of sync
  - Run with: `npx tsx scripts/check-translation-keys.ts`

### Infrastructure Improvements
- **Cookie persistence**: Locale saved to both localStorage AND cookie (1 year expiry)
- **Auto-detection**: Reads from cookie first, then localStorage on mount
- **Document attributes**: Sets `lang` and `dir` on `<html>` element dynamically
- **I18nContext**: Enhanced with cookie support in `src/lib/i18n/I18nContext.tsx`

### Bug Fixes (Part 1)
- ✅ PublicHeader: Replaced "Admin Dashboard" / "My Dashboard" with `t.navigation.admin` / `t.navigation.student`
- ✅ Login/Register buttons work correctly in Arabic (no more redirect loops)
- ✅ Middleware redirects fixed: authenticated users go to role-specific dashboard
- ✅ Auth API: Student login redirects to `/student/dashboard` (not `/student`)
- ✅ Logo aspect ratio: Added `style={{ width: 'auto', height: 'auto' }}`
- ✅ Smooth scroll: Added `data-scroll-behavior="smooth"` to layout
- ✅ Build: TypeScript compilation passes with no errors

---

## ⚠️ REMAINING WORK

### 1. Student Area Hardcoded Strings

**Files needing i18n updates:**

- `src/app/(dashboard)/student/dashboard/page.tsx`
  - Hardcoded: "My courses", "Recently watched", "Formations actives", "Leçons terminées", "Progression globale", "Bienvenue", "No lessons watched yet", "You are not enrolled in any courses yet"
  - Replace with: `t.student.myCoursesTitle`, `t.student.recentlyWatched`, `t.student.activeCourses`, `t.student.completedLessons`, `t.student.overallProgress`, `t.student.welcome`, `t.student.noLessonsWatched`, `t.student.noCoursesYet`

- `src/app/(dashboard)/student/page.tsx`
  - Check for any hardcoded strings

- `src/app/courses/page.tsx` (Public catalog)
  - Hardcoded: "Catalog", "Formations QHSE", "Découvrez nos formations...", "Rechercher", "Catégorie", "Niveau", "Toutes les catégories", "Tous les niveaux", "formation(s) trouvée(s)", "Aucune formation ne correspond", "modules", "leçons", "Voir la formation"
  - Replace with: `t.catalog.title`, `t.catalog.subtitle`, `t.common.search`, `t.common.category`, `t.common.level`, `t.catalog.allCategories`, `t.catalog.allLevels`, `t.catalog.resultsCount`, `t.catalog.noResults`, `t.student.modules`, `t.student.lessons`, `t.catalog.viewCourse`

- `src/app/courses/[slug]/CourseDetailClient.tsx`
  - Hardcoded: "Détails de la formation", "S'inscrire à cette formation", "Inscription en cours...", "Échec de l'inscription", "Continuer la formation", "Se connecter pour s'inscrire", "modules", "leçons", "min", "Programme", "Aperçu", "Protégée"
  - Replace with: `t.student.courseDetail`, `t.student.enrollButton`, `t.student.enrolling`, error messages, `t.student.continueFormation`, `t.student.loginToEnroll`, `t.student.modules`, `t.student.lessons`, duration, `t.student.programTitle`, `t.student.preview`, `t.student.locked`

- `src/app/courses/[slug]/learn/LearningPlayerClient.tsx`
  - Hardcoded: "Apprentissage", "Tableau de bord", "leçons terminées", "Programme", "Marquer comme terminée", "Impossible de marquer", "Erreur lors de la sauvegarde", "Suivant", "Précédent"
  - Replace with: `t.student.learningTitle`, `t.student.goToDashboard`, `t.student.lessonsCompleted`, `t.student.programTitle`, `t.student.markComplete`, error messages, `t.student.nextLesson`, `t.student.previousLesson`

### 2. Admin Area Hardcoded Strings

**Files needing i18n updates:**

- `src/app/(dashboard)/admin/page.tsx`
  - Admin dashboard stats and labels

- `src/app/(dashboard)/admin/layout.tsx`
  - Sidebar navigation items (if hardcoded)
  - Should use: `t.admin.sidebarDashboard`, `t.admin.sidebarCourses`, `t.admin.sidebarStudents`, `t.admin.sidebarEnrollments`, `t.admin.sidebarUsers`, `t.admin.sidebarSettings`, `t.admin.sidebarBoutique`, `t.admin.sidebarRecrutement`

- `src/app/(dashboard)/admin/courses/page.tsx`
  - Table headers, buttons, status labels
  - Use: `t.admin.coursesTitle`, `t.admin.createCourse`, `t.admin.publishedStatus`, `t.admin.draftStatus`, `t.admin.actionsColumn`

- `src/app/(dashboard)/admin/courses/[id]/page.tsx`
  - Course editor labels

- `src/app/(dashboard)/admin/courses/new/page.tsx`
  - Course wizard step titles, form labels
  - Use: `t.admin.courseWizardBasic`, `t.admin.courseWizardInfo`, `t.admin.courseWizardContent`, `t.admin.courseWizardMedia`, `t.admin.courseWizardSeo`, `t.admin.courseWizardPublish`
  - Form fields: `t.admin.courseTitle`, `t.admin.courseSlug`, `t.admin.courseDescription`, `t.admin.courseShortDescription`, `t.admin.courseCategory`, `t.admin.courseLevel`, `t.admin.courseDuration`, `t.admin.courseThumbnail`

- `src/app/(dashboard)/admin/students/page.tsx`
  - Table headers, search placeholder
  - Use: `t.admin.studentsTitle`, `t.admin.searchPlaceholder`, `t.admin.noStudents`

- `src/app/(dashboard)/admin/students/[id]/page.tsx`
  - Student detail labels

- `src/app/(dashboard)/admin/enrollments/page.tsx`
  - Already has some i18n, check for remaining hardcoded strings
  - "Search student or course...", "All courses", "Enrollments", "Manage course enrollments"

- `src/app/(dashboard)/admin/users/page.tsx`
  - User management labels

- `src/app/(dashboard)/admin/settings/page.tsx`
  - Settings labels

- `src/components/admin/EnrollmentsTableClient.tsx`
  - Table headers: "Student", "Course", "Enrolled Date", "Status", "Actions"
  - Buttons: "Enroll Student", "Previous", "Next"
  - Status: "Active"
  - Messages: "No enrollments found", "No enrollments yet", "Showing {start} to {end} of {total} enrollments"
  - Use: `t.admin.*` keys

- `src/components/admin/ManualEnrollDialog.tsx`
  - "Manual Enrollment", "Enroll a student in a course", "Student Email", "Course", "Select a course", "Cancel", "Enroll Student", "Enrolling...", "Failed to enroll student", "All fields are required"
  - Use: `t.admin.manualEnrollment`, `t.admin.enrollmentStudentEmail`, `t.admin.enrollmentCourse`, `t.admin.selectCourse`, `t.common.cancel`, `t.admin.enrollStudent`, etc.

### 3. Auth Pages Hardcoded Strings

**Files needing i18n updates:**

- `src/app/login/page.tsx`
  - Hardcoded: "Connexion", "Votre sécurité, notre priorité", "Email", "you@example.com", "Mot de passe", "••••••••", "Vous n'avez pas de compte ?", "Inscription"
  - Replace with: `t.auth.loginTitle`, `t.common.slogan3`, `t.auth.emailLabel`, `t.auth.emailPlaceholder`, `t.auth.passwordLabel`, `t.auth.passwordPlaceholder`, `t.auth.noAccount`, `t.common.register`

- `src/app/(auth)/register/page.tsx`
  - Hardcoded: "Inscription", "Invest in Safety, Invest in People", "Nom complet", "Votre nom complet", "Email", "vous@exemple.com", "Mot de passe", "Au moins 8 caractères", "Confirmer le mot de passe", "Répétez le mot de passe", "Vous avez déjà un compte ?", "Connexion"
  - Replace with: `t.auth.registerTitle`, `t.common.slogan2`, `t.auth.nameLabel`, `t.auth.namePlaceholder`, `t.auth.emailLabel`, `t.auth.emailPlaceholder`, `t.auth.passwordLabel`, `t.auth.passwordPlaceholder`, `t.auth.confirmPasswordLabel`, `t.auth.confirmPasswordPlaceholder`, `t.auth.hasAccount`, `t.common.login`

### 4. Wizard and Dialogs

**Components needing i18n:**

- Course creation wizard (all steps)
- Module/lesson creation forms
- Delete confirmation dialogs: "Confirmer la suppression", "Êtes-vous sûr...", "Oui", "Non"
  - Use: `t.admin.confirmDelete`, `t.admin.confirmDeleteMessage`, `t.admin.yes`, `t.admin.no`
- Success/error toasts
- Loading states: "Chargement...", "Loading..." → `t.common.loading`
- Empty states: "No courses", "No students" → `t.admin.noCourses`, `t.admin.noStudents`

### 5. RTL CSS Implementation

**Changes needed:**

- **CSS Logical Properties**: Replace directional properties with logical equivalents
  - `margin-left` → `margin-inline-start`
  - `margin-right` → `margin-inline-end`
  - `padding-left` → `padding-inline-start`
  - `padding-right` → `padding-inline-end`
  - `text-left` → `text-start`
  - `text-right` → `text-end`
  - `left-0` → `start-0`
  - `right-0` → `end-0`

- **Admin Sidebar**: Conditional positioning based on `isRtl`
  - Currently fixed to left side
  - Need: `className={isRtl ? "right-0" : "left-0"}` or use logical properties

- **Directional Icons**: Mirror arrows and chevrons in RTL
  - Add CSS: `.rtl .icon-arrow { transform: scaleX(-1); }`
  - Or use conditional rotation based on `isRtl`

- **Tables**: Ensure proper text alignment in RTL
  - Headers and cells should respect text direction

- **Numbers/Emails/Codes**: LTR isolation where needed
  - Wrap in `<bdi>` or `dir="ltr"` for proper display in RTL context

- **Layout.tsx**: Ensure `dir` attribute propagates
  - Already set in I18nContext provider wrapper div
  - Verify `<html dir={dir}>` is set (currently not set at root level)

### 6. Prisma Schema — Arabic Content Fields

**Schema changes needed (additive only):**

```prisma
model Course {
  // ... existing fields
  titleAr           String?
  shortDescriptionAr String?
  descriptionAr     String?
}

model Module {
  // ... existing fields
  titleAr        String?
  descriptionAr  String?
}

model Lesson {
  // ... existing fields
  titleAr        String?
  descriptionAr  String?
  contentAr      String? @db.Text
}
```

**Migration steps:**
1. Add fields to `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name add-arabic-content-fields`
3. Update course wizard to include Arabic fields (optional tab or inline fields)
4. Update display logic: Show `titleAr` if exists and locale is AR, else fallback to `title`

**Implementation pattern:**
```typescript
const displayTitle = locale === 'ar' && course.titleAr ? course.titleAr : course.title;
```

### 7. Language Switcher in Admin/Student Layouts

**Files to modify:**

- `src/app/(dashboard)/admin/layout.tsx`
  - Import and add `<LanguageSwitcher />` component
  - Position in header/sidebar area
  - Verify I18nProvider wraps the layout

- `src/app/(dashboard)/student/page.tsx` or create `layout.tsx` if needed
  - Same as admin: add `<LanguageSwitcher />`

- Verify cookie sharing: All areas should read/write the same `hse_locale` cookie

### 8. Playwright Tests Extension

**New tests needed in `tests/auth-flow-i18n.spec.ts`:**

```typescript
test('Arabic login flow', async ({ page }) => {
  await page.goto('/');
  // Switch to Arabic
  await page.click('button:has-text("عربي")');
  await page.waitForTimeout(500);
  
  // Verify dir="rtl"
  const dir = await page.evaluate(() => document.documentElement.dir);
  expect(dir).toBe('rtl');
  
  // Click login
  await page.click('a[href="/login"]');
  await expect(page).toHaveURL('/login');
  
  // Verify Arabic labels visible
  await expect(page.locator('text=تسجيل الدخول')).toBeVisible();
  await expect(page.locator('text=البريد الإلكتروني')).toBeVisible();
});

test('Admin sidebar RTL', async ({ page }) => {
  // Login as admin with Arabic
  // Assert sidebar contains Arabic labels
  // Assert dir="rtl" on html element
});

test('Language persistence', async ({ page }) => {
  // Set language to Arabic
  // Reload page
  // Assert language is still Arabic
  // Check cookie exists
});
```

---

## DECISIONS MADE

1. **Cookie + localStorage**: Dual persistence for maximum compatibility
   - Cookie for SSR/sharing across subdomains
   - localStorage for client-side fallback
   - Cookie takes precedence on read

2. **Translation key structure**: Grouped by area (auth, student, admin, catalog)
   - More maintainable than flat structure
   - Clear ownership per section

3. **Fallback strategy**: Always use French if Arabic field is empty
   - Non-breaking: Existing content works without Arabic translation
   - Gradual migration: Add Arabic content over time

4. **RTL approach**: CSS logical properties + conditional classes
   - Modern, standards-based
   - Works with Tailwind utility classes
   - Easier to maintain than duplicated stylesheets

5. **Glossary terms**: Professional HSE terminology
   - Based on usage in Morocco and Maghreb region
   - Consistent with flyers and brand materials
   - Reviewed by domain experts (pending)

6. **Key validation**: Automated script prevents key drift
   - Run before each build/deployment
   - Fails CI if keys are out of sync
   - Prevents translation bugs in production

---

## HOW TO USE

### Validate Translation Keys
```bash
npx tsx scripts/check-translation-keys.ts
```
Output: Reports total keys and any mismatches between FR and AR

### Build Project
```bash
npm run build
```
Should pass with no TypeScript errors

### Use Translations in Components
```typescript
import { useI18n } from "@/lib/i18n/I18nContext";

export function MyComponent() {
  const { t, isRtl, locale } = useI18n();
  
  return (
    <div>
      <h1>{t.student.dashboardTitle}</h1>
      <button>{t.common.save}</button>
    </div>
  );
}
```

### Add New Translation Keys
1. Add to `Translations` interface in `src/lib/i18n/types.ts`
2. Add French value in `src/lib/i18n/locales/fr.ts`
3. Add Arabic value in `src/lib/i18n/locales/ar.ts`
4. Run validation: `npx tsx scripts/check-translation-keys.ts`

---

## ESTIMATED REMAINING EFFORT

- **Student area hardcoded strings**: 2-3 hours
- **Admin area hardcoded strings**: 3-4 hours
- **Auth pages**: 30 minutes
- **RTL CSS implementation**: 2-3 hours
- **Prisma schema + wizard updates**: 1-2 hours
- **Language switcher in layouts**: 30 minutes
- **Playwright tests extension**: 1-2 hours
- **Testing and fixes**: 2-3 hours

**Total**: 12-18 hours of focused development

---

## NEXT SESSION PLAN

### Session 1: Fix All Hardcoded Strings (4-5 hours)
1. Student area (dashboard, catalog, course detail, learning player)
2. Admin area (all pages, tables, forms)
3. Auth pages (login, register)
4. Shared components (dialogs, toasts)
5. Test each area in both FR and AR

### Session 2: RTL + Schema (3-4 hours)
1. Implement RTL CSS (logical properties)
2. Test admin sidebar in RTL
3. Add Prisma Arabic fields
4. Update course wizard
5. Test display logic

### Session 3: Polish + Tests (2-3 hours)
1. Add language switchers to layouts
2. Extend Playwright tests
3. Run full test suite
4. Fix any failures
5. Manual test checklist
6. Final report

---

## BUILD STATUS

✅ **TypeScript**: No errors  
✅ **Compilation**: Success  
✅ **Translation Sync**: Verified (128 keys per language)  
✅ **Tests**: 9/9 auth flow tests passing  

---

**Phase 6 NOT started as instructed.**
