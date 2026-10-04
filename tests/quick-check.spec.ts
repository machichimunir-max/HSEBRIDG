import { test, expect } from '@playwright/test';

test.describe('Quick UI Check', () => {
  test('Homepage loads and renders correctly', async ({ page }) => {
    const errors: string[] = [];

    // Capture any errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`Console error: ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      errors.push(`Page error: ${error.message}`);
    });

    // Navigate to homepage
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if page loaded
    await expect(page).toHaveTitle(/CourseFlow|Next/i);

    // Report any errors
    if (errors.length > 0) {
      console.log('Errors found:', errors);
      throw new Error(`Found ${errors.length} error(s): ${errors.join('; ')}`);
    }

    console.log('✅ Homepage loaded without errors');
  });

  test('Login page is accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Check for login form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    console.log('✅ Login page accessible');
  });

  test('Navigation works', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Try to find navigation links
    const links = page.locator('a');
    const count = await links.count();

    console.log(`Found ${count} links on homepage`);
    expect(count).toBeGreaterThan(0);
  });
});
