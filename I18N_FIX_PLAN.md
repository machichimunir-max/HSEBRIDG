# I18N COMPLETE FIX PLAN

## PART 1 — Arabic Bug Fixes (Immediate)

### Issue: Arabic links don't work
**Root Cause**: All hardcoded English strings in components bypass i18n
**Fix**: Replace ALL hardcoded strings with t.key references

### Files to Fix:
1. PublicHeader.tsx - hardcoded "Admin Dashboard", "My Dashboard"
2. All public pages - scan for hardcoded French strings
3. Login/Register pages - hardcoded French labels
4. Student dashboard - hardcoded labels
5. Admin pages - all hardcoded strings

## PART 2 — Full i18n Extension

### 1. Translation Keys to Add:
```typescript
// Student area
student: {
  myCoursesTitle: string;
  continueLesson: string;
  progress: string;
  completed: string;
  notStarted: string;
  enrolledCourses: string;
  recentlyWatched: string;
  // ... more
}

// Admin area
admin: {
  sidebar: {
    dashboard: string;
    courses: string;
    students: string;
    enrollments: string;
    // ... more
  }
  // ... more
}

// Auth pages
auth: {
  loginTitle: string;
  registerTitle: string;
  emailPlaceholder: string;
  // ... more
}
```

### 2. Prisma Schema Changes (Additive Only):
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

### 3. RTL Implementation:
- Use logical CSS: margin-inline-start, padding-inline-end
- Mirror directional icons with CSS transform: scaleX(-1)
- Layout: dir={isRtl ? "rtl" : "ltr"} on container divs
- Admin sidebar: flip to right in RTL
- Tables: text-align based on dir

### 4. Cookie-based persistence:
- Save locale to cookie in addition to localStorage
- Read cookie on server-side for SSR
- Share cookie between public/student/admin

### 5. Glossary Creation:
- docs/GLOSSARY_HSE_AR.md with French → Arabic terms
- Use consistently across all translations

### 6. Key Sync Script:
```typescript
// scripts/check-translation-keys.ts
// Compare fr.ts and ar.ts keys, fail if mismatch
```

### 7. Playwright Tests Extension:
- Test Arabic login/register navigation
- Assert dir="rtl" in Arabic
- Test language persistence after navigation
- Test admin sidebar in RTL
- Test student dashboard labels in Arabic

## Execution Order:
1. Fix Part 1 hardcoded strings (build, test)
2. Add translation keys for student area
3. Add translation keys for admin area
4. Implement RTL CSS
5. Add Arabic content fields to schema
6. Create glossary
7. Add key sync validation
8. Extend Playwright tests
9. Run all tests and fix failures

## Expected File Count:
- Modified: ~30 files
- Created: ~5 files (glossary, scripts, tests)
- Schema changes: 3 models (additive only)
- Translation keys: ~200+ new keys
