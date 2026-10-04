import { test, expect, Page } from '@playwright/test';

test.describe('Admin UI Tests', () => {
  let consoleErrors: string[] = [];
  let pageErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    pageErrors = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });
  });

  test('Homepage loads without errors', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check for console errors
    expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
    expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);

    // Verify page loaded
    await expect(page).toHaveTitle(/CourseFlow|Next/i);
  });

  test('Login page loads without errors', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
    expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);

    // Check if login form is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Admin dashboard loads without errors (with auth)', async ({ page }) => {
    // First login as admin
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login form (using test credentials)
    await page.fill('input[type="email"]', 'admin@qhse.local');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL('**/admin**', { timeout: 15000 });

    // If we're on admin page, check for errors
    await page.waitForLoadState('networkidle');

    expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
    expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);

    // Check for key admin elements
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Total courses')).toBeVisible();
  });

  test('Admin courses page loads without errors', async ({ page }) => {
    // Try to access directly (will redirect if not authenticated)
    await page.goto('/admin/courses');
    await page.waitForLoadState('networkidle');

    // Check for errors regardless of auth state
    expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
    expect(pageErrors, `Page errors found: ${pageErrors.join(', ')}`).toHaveLength(0);
  });

  test('Check for broken images on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth, `Image broken: ${src}`).toBeGreaterThan(0);
      }
    }
  });

  test('Check for layout shifts and visual issues', async ({ page }) => {
    await page.goto('/');

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('Mobile responsive - sidebar collapses', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto('/admin/courses');
    await page.waitForLoadState('networkidle');

    // Sidebar should be hidden on mobile
    const sidebar = page.locator('aside');
    if (await sidebar.isVisible()) {
      const transform = await sidebar.evaluate((el) =>
        window.getComputedStyle(el).transform
      );
      // Should be translated off-screen or hidden
      expect(transform).not.toBe('none');
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      console.log(`Test "${testInfo.title}" failed`);
      console.log('Console errors:', consoleErrors);
      console.log('Page errors:', pageErrors);

      // Take screenshot on failure
      await page.screenshot({
        path: `test-results/${testInfo.title.replace(/\s+/g, '-')}-failure.png`,
        fullPage: true
      });
    }
  });
});
