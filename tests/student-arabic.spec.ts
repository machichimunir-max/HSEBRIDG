import { test, expect } from '@playwright/test';

test.describe('Student Area - Arabic Language', () => {
  test('Login page displays in Arabic', async ({ page }) => {
    await page.goto('/login');

    // Switch to Arabic
    await page.click('button:has-text("عربي")');
    await page.waitForTimeout(500);

    // Verify dir="rtl" on html element
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(dir).toBe('rtl');

    // Verify Arabic labels are visible
    await expect(page.locator('text=تسجيل الدخول').first()).toBeVisible();
    await expect(page.locator('text=البريد الإلكتروني')).toBeVisible();
    await expect(page.locator('text=كلمة المرور')).toBeVisible();
  });

  test('Register page displays in Arabic', async ({ page }) => {
    await page.goto('/register');

    // Switch to Arabic
    await page.click('button:has-text("عربي")');
    await page.waitForTimeout(500);

    // Verify dir="rtl"
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(dir).toBe('rtl');

    // Verify Arabic labels
    await expect(page.locator('text=إنشاء حساب').first()).toBeVisible();
    await expect(page.locator('text=الاسم الكامل')).toBeVisible();
    await expect(page.locator('text=لديك حساب بالفعل؟')).toBeVisible();
  });

  test('Courses catalog displays in Arabic', async ({ page }) => {
    await page.goto('/courses');

    // Switch to Arabic
    await page.click('button:has-text("عربي")');
    await page.waitForTimeout(500);

    // Verify dir="rtl"
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(dir).toBe('rtl');

    // Verify Arabic labels
    await expect(page.locator('text=تكوينات الجودة والصحة والسلامة والبيئة')).toBeVisible();
    await expect(page.locator('input[placeholder="ابحث عن تكوين..."]')).toBeVisible();
    await expect(page.locator('option[value=""]').first()).toHaveText('جميع الأصناف');
  });

  test('Language persistence across pages', async ({ page }) => {
    // Start on login page
    await page.goto('/login');

    // Switch to Arabic
    await page.click('button:has-text("عربي")');
    await page.waitForTimeout(500);

    // Navigate to catalog
    await page.goto('/courses');
    await page.waitForTimeout(500);

    // Verify Arabic is still active
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(dir).toBe('rtl');

    // Verify Arabic text is present
    await expect(page.locator('text=تكوينات الجودة والصحة والسلامة والبيئة')).toBeVisible();

    // Check cookie exists
    const cookies = await page.context().cookies();
    const localeCookie = cookies.find(c => c.name === 'hse_locale');
    expect(localeCookie).toBeDefined();
    expect(localeCookie?.value).toBe('ar');
  });

  test('RTL layout in login page', async ({ page }) => {
    await page.goto('/login');

    // Switch to Arabic
    await page.click('button:has-text("عربي")');
    await page.waitForTimeout(500);

    // Verify language switcher is positioned at the end (right in LTR, left in RTL)
    const switcherContainer = page.locator('.absolute.top-6.end-6');
    await expect(switcherContainer).toBeVisible();

    // Verify dir attribute
    const htmlDir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
    expect(htmlDir).toBe('rtl');

    // Verify lang attribute
    const htmlLang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(htmlLang).toBe('ar');
  });
});
