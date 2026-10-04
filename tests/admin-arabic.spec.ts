import { test, expect } from '@playwright/test';

test.describe('Admin Area - Arabic Language', () => {
  test('Admin dashboard displays in Arabic', async ({ page }) => {
    // Set Arabic locale cookie before navigation
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'ar',
      domain: 'localhost',
      path: '/',
    }]);

    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });

    // Verify Arabic text in dashboard
    await expect(page.locator('h1:has-text("لوحة التحكم")')).toBeVisible({ timeout: 10000 });

    // Verify RTL direction
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(dir).toBe('rtl');

    // Verify Arabic in stats
    await expect(page.locator('text=التكوينات')).toBeVisible();
    await expect(page.locator('text=الطلاب')).toBeVisible();
  });

  test('Admin students page displays in Arabic', async ({ page }) => {
    // Set Arabic locale cookie
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'ar',
      domain: 'localhost',
      path: '/',
    }]);

    // Login and navigate
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');

    // Go to students page
    await page.goto('http://localhost:3000/admin/students');
    await page.waitForLoadState('networkidle');

    // Verify Arabic title
    await expect(page.locator('h1:has-text("الطلاب")')).toBeVisible({ timeout: 10000 });
  });

  test('Admin enrollments page displays in Arabic', async ({ page }) => {
    // Set Arabic locale cookie
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'ar',
      domain: 'localhost',
      path: '/',
    }]);

    // Login and navigate
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');

    // Go to enrollments page
    await page.goto('http://localhost:3000/admin/enrollments');
    await page.waitForLoadState('networkidle');

    // Verify Arabic title
    await expect(page.locator('h1:has-text("التسجيلات")')).toBeVisible({ timeout: 10000 });

    // Verify Arabic in search placeholder
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    // Verify enroll button in Arabic
    await expect(page.locator('button:has-text("تسجيل طالب")')).toBeVisible();
  });

  test('Manual enrollment dialog displays in Arabic', async ({ page }) => {
    // Set Arabic locale cookie
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'ar',
      domain: 'localhost',
      path: '/',
    }]);

    // Login and navigate
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');

    // Go to enrollments page
    await page.goto('http://localhost:3000/admin/enrollments');
    await page.waitForLoadState('networkidle');

    // Click enroll button
    await page.click('button:has-text("تسجيل طالب")');

    // Verify dialog appears with Arabic text
    await expect(page.locator('h2:has-text("تسجيل يدوي")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=بريد الطالب')).toBeVisible();
    await expect(page.locator('text=التكوين')).toBeVisible();
    await expect(page.locator('button:has-text("إلغاء")')).toBeVisible();
  });

  test('Admin sidebar displays in Arabic', async ({ page }) => {
    // Set Arabic locale cookie
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'ar',
      domain: 'localhost',
      path: '/',
    }]);

    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');

    // Verify sidebar items in Arabic
    await expect(page.locator('text=لوحة التحكم')).toBeVisible();
    await expect(page.locator('text=التكوينات')).toBeVisible();
    await expect(page.locator('text=الطلاب')).toBeVisible();
    await expect(page.locator('text=التسجيلات')).toBeVisible();
  });
});
