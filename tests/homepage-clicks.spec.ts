import { test, expect } from '@playwright/test';

test.describe('Homepage Link Tests', () => {
  test('All navigation links should be clickable and navigate correctly', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header a:has-text("Login")', { timeout: 10000 });

    // Test header Login link
    const headerLogin = page.locator('header a:has-text("Login")');
    await expect(headerLogin).toBeVisible();
    await expect(headerLogin).toBeEnabled();
    console.log('✅ Header Login link is visible and enabled');

    // Test header "Start learning" link
    const startLearningBtn = page.locator('header a:has-text("Start learning")');
    await expect(startLearningBtn).toBeVisible();
    await expect(startLearningBtn).toBeEnabled();
    console.log('✅ Start learning link is visible and enabled');

    // Test "Create account" link
    const createAccountBtn = page.locator('main a:has-text("Create account")');
    await expect(createAccountBtn).toBeVisible();
    await expect(createAccountBtn).toBeEnabled();
    console.log('✅ Create account link is visible and enabled');

    // Test "Sign in" link
    const signInBtn = page.locator('main a:has-text("Sign in")');
    await expect(signInBtn).toBeVisible();
    await expect(signInBtn).toBeEnabled();
    console.log('✅ Sign in link is visible and enabled');

    // Try clicking header Login
    await headerLogin.click();
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
    console.log('✅ Header Login click successful - redirected to', page.url());
  });

  test('Create account link navigates to register', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    const createAccountBtn = page.locator('main a:has-text("Create account")');
    await expect(createAccountBtn).toBeVisible({ timeout: 10000 });
    await createAccountBtn.click();
    await page.waitForURL('**/register', { timeout: 10000 });
    expect(page.url()).toContain('/register');
    console.log('✅ Create account link works correctly');
  });

  test('Sign in link navigates to login', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    const signInBtn = page.locator('main a:has-text("Sign in")');
    await expect(signInBtn).toBeVisible({ timeout: 10000 });
    await signInBtn.click();
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
    console.log('✅ Sign in link works correctly');
  });

  test('Start learning link navigates to register', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    const startLearningBtn = page.locator('header a:has-text("Start learning")');
    await expect(startLearningBtn).toBeVisible({ timeout: 10000 });
    await startLearningBtn.click();
    await page.waitForURL('**/register', { timeout: 10000 });
    expect(page.url()).toContain('/register');
    console.log('✅ Start learning link works correctly');
  });
});
