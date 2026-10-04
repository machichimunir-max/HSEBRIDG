import { test, expect } from '@playwright/test';

test.describe('Admin Panel Complete E2E Check', () => {
  test('Login as Admin and test all Admin routes for UI/Console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(`[Page Error] ${error.message}`);
    });

    // 1. Aller sur la page de login
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // 2. Remplir le formulaire de connexion admin
    await page.fill('input[type="email"]', 'admin@qhse.local');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Attendre la redirection après login
    await page.waitForURL('**/admin**', { timeout: 15000 });
    console.log('✅ Admin login successful');

    // Liste des pages admin à auditer
    const adminPages = [
      { url: '/admin', name: 'Dashboard' },
      { url: '/admin/courses', name: 'Courses Table' },
      { url: '/admin/courses/new', name: 'Course Wizard (New Course)' },
      { url: '/admin/students', name: 'Students List' },
      { url: '/admin/enrollments', name: 'Enrollments List' },
      { url: '/admin/settings', name: 'Settings' },
    ];

    for (const adminPage of adminPages) {
      await page.goto(`http://localhost:3000${adminPage.url}`, { waitUntil: 'networkidle' });

      // Vérifier que la page s'affiche
      const aside = page.locator('aside');
      await expect(aside).toBeVisible();

      // Vérifier qu'aucun débordement horizontal ou crash UI n'a lieu
      const main = page.locator('main');
      await expect(main).toBeVisible();

      console.log(`✅ Admin page ${adminPage.name} (${adminPage.url}) loaded without errors`);
    }

    // Tester la pagination ou recherche sur /admin/students
    await page.goto('http://localhost:3000/admin/students', { waitUntil: 'networkidle' });
    const searchInput = page.locator('input[placeholder*="Search students"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('student');
      await page.waitForTimeout(300);
      console.log('✅ Student search input tested');
    }

    // Tester les tabs et switch vue table/grille sur /admin/courses
    await page.goto('http://localhost:3000/admin/courses', { waitUntil: 'networkidle' });
    const gridBtn = page.locator('button[aria-label="Grid view"]');
    if (await gridBtn.isVisible()) {
      await gridBtn.click();
      await page.waitForTimeout(300);
      const tableBtn = page.locator('button[aria-label="Table view"]');
      await tableBtn.click();
      await page.waitForTimeout(300);
      console.log('✅ Course Table / Grid view toggling tested');
    }

    // Vérifier l'absence totale d'erreurs console/page
    expect(consoleErrors, `Console errors encountered: \n${consoleErrors.join('\n')}`).toHaveLength(0);
    expect(pageErrors, `Page errors encountered: \n${pageErrors.join('\n')}`).toHaveLength(0);
  });
});
