import { test, expect } from '@playwright/test';

test.describe('Comprehensive UI & Console Check', () => {
  const routesToTest = [
    { path: '/', name: 'Homepage' },
    { path: '/login', name: 'Login Page' },
    { path: '/register', name: 'Register Page' },
    { path: '/courses', name: 'Public Courses' },
  ];

  for (const route of routesToTest) {
    test(`${route.name} (${route.path}) has no console/UI errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      // Monitor console errors
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Monitor uncaught exceptions
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      // Navigate to the page
      const response = await page.goto(`http://localhost:3000${route.path}`, {
        waitUntil: 'networkidle',
      });

      // Verify HTTP status
      expect(response?.status(), `Page ${route.path} returned status ${response?.status()}`).toBeLessThan(400);

      // Verify no console errors
      expect(
        consoleErrors,
        `Console errors found on ${route.path}: \n${consoleErrors.join('\n')}`
      ).toHaveLength(0);

      // Verify no page/runtime errors
      expect(
        pageErrors,
        `Runtime errors found on ${route.path}: \n${pageErrors.join('\n')}`
      ).toHaveLength(0);

      // Check for broken images
      const images = page.locator('img');
      const imageCount = await images.count();
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          expect(naturalWidth, `Broken image found on ${route.path}: ${src}`).toBeGreaterThan(0);
        }
      }

      console.log(`✅ ${route.name} passed all checks`);
    });
  }

  test('Check responsive layout on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Verify page is rendered properly on mobile
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check if horizontal scrollbar appears (it shouldn't)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll, 'Horizontal overflow detected on mobile').toBe(false);
    console.log('✅ Mobile layout is responsive without horizontal overflow');
  });
});
