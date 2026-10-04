# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-ui.spec.ts >> Admin UI Tests >> Admin dashboard loads without errors (with auth)
- Location: tests\admin-ui.spec.ts:50:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Dashboard")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('h1:has-text("Dashboard")') with timeout 5000ms
  - waiting for locator('h1:has-text("Dashboard")')

```

```yaml
- complementary:
  - link "HSE BRIDGE - Health, Safety, Environment":
    - /url: /admin
    - img "HSE BRIDGE - Health, Safety, Environment"
  - navigation:
    - link "Dashboard":
      - /url: /admin
      - img
      - text: Dashboard
    - button "Formation HSE":
      - img
      - text: Formation HSE
      - img
    - link "Formations":
      - /url: /admin/courses
    - link "Étudiants":
      - /url: /admin/students
    - link "Inscriptions":
      - /url: /admin/enrollments
    - button "Boutique EPI/EPC":
      - img
      - text: Boutique EPI/EPC
      - img
    - link "Catégories":
      - /url: /admin/boutique/categories
    - link "Produits":
      - /url: /admin/boutique/products
    - link "Demandes de devis":
      - /url: /admin/boutique/quotes
    - button "Recrutement HSE":
      - img
      - text: Recrutement HSE
      - img
    - link "Offres d'emploi":
      - /url: /admin/recrutement/jobs
    - link "Candidatures":
      - /url: /admin/recrutement/applications
    - link "Base candidats":
      - /url: /admin/recrutement/candidates
    - link "Demandes entreprises":
      - /url: /admin/recrutement/employer-requests
    - link "Utilisateurs":
      - /url: /admin/users
      - img
      - text: Utilisateurs
    - link "Paramètres":
      - /url: /admin/settings
      - img
      - text: Paramètres
  - paragraph: HSE BRIDGE Admin v2.0
  - paragraph: Multi-pilier Management
- banner:
  - img
  - searchbox "Search courses, students..."
  - button "FR"
  - button "عربي"
  - button "User menu":
    - text: A
    - paragraph: Admin
    - paragraph: admin@qhse.local
    - img
- main:
  - heading "Tableau de Bord Multi-Pilier" [level=1]
  - paragraph: Vue d'ensemble des 3 métiers HSE BRIDGE — Formation, Boutique EPI/EPC, Recrutement
  - img
  - heading "Formation HSE — Académie en Ligne" [level=2]
  - paragraph: LMS, Étudiants, Inscriptions
  - paragraph: Formations Total
  - paragraph: "7"
  - paragraph: 2 publiées
  - paragraph: Étudiants Inscrits
  - paragraph: "1"
  - paragraph: Comptes actifs
  - paragraph: Inscriptions Actives
  - paragraph: "2"
  - paragraph: Gestion
  - link "Gérer Formations":
    - /url: /admin/courses
  - link "Voir Étudiants":
    - /url: /admin/students
  - heading "Dernières Inscriptions" [level=3]
  - link "Voir tout →":
    - /url: /admin/enrollments
  - paragraph: Local Student
  - paragraph: Prevention des Risques Incendie
  - paragraph: 02/10/2026
  - paragraph: Local Student
  - paragraph: HSE Fondamentaux du Chantier
  - paragraph: 02/10/2026
  - img
  - heading "Boutique EPI / EPC — Équipements de Protection" [level=2]
  - paragraph: Catalogue, Produits, Demandes de Devis
  - paragraph: Produits Catalogue
  - paragraph: "0"
  - paragraph: Disponible Phase 6
  - paragraph: Demandes Devis
  - paragraph: "0"
  - paragraph: 0 en attente
  - paragraph: Statut Module
  - paragraph: ⏳ En attente Phase 6
  - paragraph: Catalogue + Devis pro
  - paragraph: Gestion
  - link "Gérer Catégories":
    - /url: /admin/boutique/categories
  - link "Gérer Produits":
    - /url: /admin/boutique/products
  - img
  - heading "Recrutement HSE — Emplois & Candidatures" [level=2]
  - paragraph: Offres d'Emploi, Candidats, Demandes Entreprises
  - paragraph: Offres Publiées
  - paragraph: "0"
  - paragraph: 0 actives
  - paragraph: Candidatures
  - paragraph: "0"
  - paragraph: 0 nouvelles
  - paragraph: Statut Module
  - paragraph: ⏳ En attente Phase 7
  - paragraph: Jobs + CV + Pipeline
  - paragraph: Gestion
  - link "Gérer Offres":
    - /url: /admin/recrutement/jobs
  - link "Voir Candidatures":
    - /url: /admin/recrutement/applications
- alert
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | test.describe('Admin UI Tests', () => {
  4   |   let consoleErrors: string[] = [];
  5   |   let pageErrors: string[] = [];
  6   | 
  7   |   test.beforeEach(async ({ page }) => {
  8   |     consoleErrors = [];
  9   |     pageErrors = [];
  10  | 
  11  |     // Capture console errors
  12  |     page.on('console', (msg) => {
  13  |       if (msg.type() === 'error') {
  14  |         consoleErrors.push(msg.text());
  15  |       }
  16  |     });
  17  | 
  18  |     // Capture page errors
  19  |     page.on('pageerror', (error) => {
  20  |       pageErrors.push(error.message);
  21  |     });
  22  |   });
  23  | 
  24  |   test('Homepage loads without errors', async ({ page }) => {
  25  |     await page.goto('/');
  26  | 
  27  |     // Wait for page to be fully loaded
  28  |     await page.waitForLoadState('networkidle');
  29  | 
  30  |     // Check for console errors
  31  |     expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
  32  |     expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);
  33  | 
  34  |     // Verify page loaded
  35  |     await expect(page).toHaveTitle(/CourseFlow|Next/i);
  36  |   });
  37  | 
  38  |   test('Login page loads without errors', async ({ page }) => {
  39  |     await page.goto('/login');
  40  |     await page.waitForLoadState('networkidle');
  41  | 
  42  |     expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
  43  |     expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);
  44  | 
  45  |     // Check if login form is present
  46  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  47  |     await expect(page.locator('input[type="password"]')).toBeVisible();
  48  |   });
  49  | 
  50  |   test('Admin dashboard loads without errors (with auth)', async ({ page }) => {
  51  |     // First login as admin
  52  |     await page.goto('/login');
  53  |     await page.waitForLoadState('networkidle');
  54  | 
  55  |     // Fill login form (using test credentials)
  56  |     await page.fill('input[type="email"]', 'admin@qhse.local');
  57  |     await page.fill('input[type="password"]', 'Admin123!');
  58  |     await page.click('button[type="submit"]');
  59  | 
  60  |     // Wait for navigation
  61  |     await page.waitForURL('**/admin**', { timeout: 15000 });
  62  | 
  63  |     // If we're on admin page, check for errors
  64  |     await page.waitForLoadState('networkidle');
  65  | 
  66  |     expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
  67  |     expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);
  68  | 
  69  |     // Check for key admin elements
> 70  |     await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  71  |     await expect(page.locator('text=Total courses')).toBeVisible();
  72  |   });
  73  | 
  74  |   test('Admin courses page loads without errors', async ({ page }) => {
  75  |     // Try to access directly (will redirect if not authenticated)
  76  |     await page.goto('/admin/courses');
  77  |     await page.waitForLoadState('networkidle');
  78  | 
  79  |     // Check for errors regardless of auth state
  80  |     expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
  81  |     expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);
  82  |   });
  83  | 
  84  |   test('Check for broken images on homepage', async ({ page }) => {
  85  |     await page.goto('/');
  86  |     await page.waitForLoadState('networkidle');
  87  | 
  88  |     const images = page.locator('img');
  89  |     const count = await images.count();
  90  | 
  91  |     for (let i = 0; i < count; i++) {
  92  |       const img = images.nth(i);
  93  |       const src = await img.getAttribute('src');
  94  | 
  95  |       if (src) {
  96  |         const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
  97  |         expect(naturalWidth, `Image broken: ${src}`).toBeGreaterThan(0);
  98  |       }
  99  |     }
  100 |   });
  101 | 
  102 |   test('Check for layout shifts and visual issues', async ({ page }) => {
  103 |     await page.goto('/');
  104 | 
  105 |     // Take screenshot for visual comparison
  106 |     await expect(page).toHaveScreenshot('homepage.png', {
  107 |       fullPage: true,
  108 |       maxDiffPixels: 100,
  109 |     });
  110 |   });
  111 | 
  112 |   test('Mobile responsive - sidebar collapses', async ({ page }) => {
  113 |     await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  114 | 
  115 |     await page.goto('/admin/courses');
  116 |     await page.waitForLoadState('networkidle');
  117 | 
  118 |     // Sidebar should be hidden on mobile
  119 |     const sidebar = page.locator('aside');
  120 |     if (await sidebar.isVisible()) {
  121 |       const transform = await sidebar.evaluate((el) =>
  122 |         window.getComputedStyle(el).transform
  123 |       );
  124 |       // Should be translated off-screen or hidden
  125 |       expect(transform).not.toBe('none');
  126 |     }
  127 |   });
  128 | 
  129 |   test.afterEach(async ({ page }, testInfo) => {
  130 |     if (testInfo.status === 'failed') {
  131 |       console.log(`Test "${testInfo.title}" failed`);
  132 |       console.log('Console errors:', consoleErrors);
  133 |       console.log('Page errors:', pageErrors);
  134 | 
  135 |       // Take screenshot on failure
  136 |       await page.screenshot({
  137 |         path: `test-results/${testInfo.title.replace(/\s+/g, '-')}-failure.png`,
  138 |         fullPage: true
  139 |       });
  140 |     }
  141 |   });
  142 | });
  143 | 
```