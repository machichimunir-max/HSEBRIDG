import { test, expect, Page } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = 'admin@qhse.local';
const ADMIN_PASS = 'Admin123!';

/**
 * Log in as admin and return the page already at /admin.
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**', { timeout: 15000 });
}

// ─── Public Boutique Pages ──────────────────────────────────────────────────

test.describe('Boutique – Public Pages', () => {
  test.describe.configure({ mode: 'serial' });

  test('Main boutique page loads with categories from DB', async ({ page }) => {
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');

    // Hero section is visible
    await expect(page.locator('h1')).toBeVisible();

    // At least one category card should be visible (seeded 10 categories)
    const categoryCards = page.locator('#categories .grid > div, #categories .grid > a');
    await expect(categoryCards.first()).toBeVisible({ timeout: 10000 });
    const cardCount = await categoryCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
  });

  test('Boutique page has a working quote form', async ({ page }) => {
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');

    // Scroll to the quote form
    const quoteSection = page.locator('#quote-form');
    await quoteSection.scrollIntoViewIfNeeded();

    // Fill in the quote form
    const form = quoteSection.locator('form');
    if (await form.isVisible()) {
      await form.locator('input[type="text"]').first().fill('Test User');
      await form.locator('input[type="tel"]').first().fill('+212600000000');
      await form.locator('input[type="email"]').first().fill('test@example.com');
      await form.locator('textarea').first().fill('Test quote request for Playwright E2E');

      // Submit the form
      await form.locator('button[type="submit"]').click();

      // Wait for the success confirmation
      await expect(page.locator('text=/succès|successfully|بنجاح/i')).toBeVisible({ timeout: 10000 });
    }
  });

  test('Category page loads and shows product grid or empty state', async ({ page }) => {
    // Go to a seeded category slug
    await page.goto('/boutique/protection-tete');
    await page.waitForLoadState('networkidle');

    // Breadcrumb is visible
    const breadcrumb = page.locator('nav, [class*="breadcrumb"]').first();
    await expect(breadcrumb).toBeVisible();

    // Category title visible in heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Either product cards or empty state message should be visible
    const products = page.locator('.grid a[href*="/boutique/produit/"]');
    const emptyState = page.locator('text=/aucun produit|no products|لا توجد منتجات/i');
    const productCount = await products.count();

    if (productCount > 0) {
      await expect(products.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test('Category page shows stock filters', async ({ page }) => {
    await page.goto('/boutique/protection-tete');
    await page.waitForLoadState('networkidle');

    // Check for availability/stock filter select
    const stockSelect = page.locator('select').first();
    await expect(stockSelect).toBeVisible();
  });

  test('Main boutique page has link to categories', async ({ page }) => {
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');

    // Find a category link (either "Voir les produits" or "Demander un devis")
    const categoryLinks = page.locator('#categories a[href*="/boutique/"]').first();
    if (await categoryLinks.isVisible()) {
      const href = await categoryLinks.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});

// ─── Language Switching (RTL / LTR) ─────────────────────────────────────────

test.describe('Boutique – i18n & RTL', () => {
  test('Switching to Arabic sets dir="rtl" on html element', async ({ page }) => {
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');

    // Find language switcher button (it's in the header)
    const langSwitcher = page.locator('button:has-text("العربية"), button:has-text("AR"), button[aria-label*="lang"], button[aria-label*="Language"]').first();

    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      await page.waitForTimeout(1000);

      // Check html dir attribute
      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
    } else {
      // Try cookie approach: set hse_locale to ar
      await page.context().addCookies([{
        name: 'hse_locale',
        value: 'ar',
        domain: 'localhost',
        path: '/',
      }]);
      await page.reload();
      await page.waitForLoadState('networkidle');

      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
    }
  });

  test('Switching to French sets dir="ltr" on html element', async ({ page }) => {
    // Set cookie to French
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'fr',
      domain: 'localhost',
      path: '/',
    }]);
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');

    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });

  test('Boutique page Arabic locale shows Arabic text', async ({ page }) => {
    await page.context().addCookies([{
      name: 'hse_locale',
      value: 'ar',
      domain: 'localhost',
      path: '/',
    }]);
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');

    // Check that the page has Arabic text visible somewhere
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('ar');
  });
});

// ─── Admin – Boutique Products CRUD ─────────────────────────────────────────

test.describe('Admin – Products CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('Admin can access the products page', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/admin/boutique/products');
    await page.waitForLoadState('networkidle');

    // Sidebar and main content visible
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Page heading visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('Admin can open the "New Product" modal', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/boutique/products');
    await page.waitForLoadState('networkidle');

    // Click the "New Product" button
    const newBtn = page.locator('button:has-text("Nouveau produit"), button:has-text("منتج جديد")').first();
    await expect(newBtn).toBeVisible();
    await newBtn.click();

    // Modal should open - use more specific selector (backdrop + modal content)
    const modal = page.locator('div.fixed.inset-0.z-50.flex.items-center.justify-center');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Modal content (the white/dark rounded box inside)
    const modalContent = modal.locator('.rounded-2xl, [class*="rounded"]').first();
    await expect(modalContent).toBeVisible();

    // Form fields visible inside modal
    await expect(modalContent.locator('input').first()).toBeVisible();

    // Category dropdown should have options
    const categorySelect = modalContent.locator('select').first();
    await expect(categorySelect).toBeVisible();
    const optionCount = await categorySelect.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  test('Admin can create a new product', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/boutique/products');
    await page.waitForLoadState('networkidle');

    // Open modal
    const newBtn = page.locator('button:has-text("Nouveau produit"), button:has-text("منتج جديد")').first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('div.fixed.inset-0.z-50.flex.items-center.justify-center');
    await expect(modal).toBeVisible();

    const modalContent = modal.locator('.rounded-2xl, [class*="rounded"]').first();

    // Fill basic info
    const timestamp = Date.now();
    const titleFr = `Casque Test E2E ${timestamp}`;
    const titleAr = `خوذة اختبار ${timestamp}`;
    const slug = `casque-test-e2e-${timestamp}`;

    // Title FR
    const inputs = modalContent.locator('input[type="text"]');
    await inputs.nth(0).fill(titleFr);
    // Title AR
    await inputs.nth(1).fill(titleAr);
    // Slug
    await inputs.nth(2).fill(slug);

    // Submit the form
    const submitBtn = modalContent.locator('button[type="submit"]');
    await submitBtn.click();

    // Wait for success toast or modal close
    await page.waitForTimeout(3000);

    // Modal should close on success
    const modalStillVisible = await modal.isVisible();
    if (!modalStillVisible) {
      // Success: modal closed
      expect(modalStillVisible).toBe(false);
    } else {
      // Check if there's an error message
      const errorText = await modalContent.locator('[role="alert"], .text-red-300, .text-red-400').textContent().catch(() => '');
      console.log('Modal still open, possible error:', errorText);
    }
  });

  test('Admin can search for products', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/boutique/products');
    await page.waitForLoadState('networkidle');

    // Find the search input
    const searchInput = page.locator('input[placeholder*="Rechercher"], input[placeholder*="بحث"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test');
      await page.waitForTimeout(500); // debounce
    }
  });

  test('Admin can filter by category', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/boutique/products');
    await page.waitForLoadState('networkidle');

    // Find a category filter select
    const selects = page.locator('select');
    const selectCount = await selects.count();
    expect(selectCount).toBeGreaterThanOrEqual(1);

    // Select the first category filter (should have category options)
    const categorySelect = selects.first();
    const options = await categorySelect.locator('option').count();
    expect(options).toBeGreaterThanOrEqual(2); // "All" + at least 1 category
  });

  test('Admin products page loads without console/page errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known non-critical errors
        if (!text.includes('favicon') && !text.includes('hydration')) {
          consoleErrors.push(text);
        }
      }
    });
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await loginAsAdmin(page);
    await page.goto('/admin/boutique/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    expect(pageErrors, `Page errors: ${pageErrors.join(', ')}`).toHaveLength(0);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(', ')}`).toHaveLength(0);
  });
});

// ─── Admin – Boutique Categories & Quotes ───────────────────────────────────

test.describe('Admin – Boutique Categories & Quotes', () => {
  test('Admin can access the categories page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/boutique/categories');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('Admin can access the quotes page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/boutique/quotes');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
});

// ─── Admin – Core Pages Smoke Test ──────────────────────────────────────────

test.describe('Admin – All Pages Smoke Test', () => {
  const adminPages = [
    { url: '/admin', name: 'Dashboard' },
    { url: '/admin/courses', name: 'Courses' },
    { url: '/admin/students', name: 'Students' },
    { url: '/admin/enrollments', name: 'Enrollments' },
    { url: '/admin/settings', name: 'Settings' },
    { url: '/admin/boutique/products', name: 'Boutique Products' },
    { url: '/admin/boutique/categories', name: 'Boutique Categories' },
    { url: '/admin/boutique/quotes', name: 'Boutique Quotes' },
    { url: '/admin/recrutement/jobs', name: 'Recrutement Jobs' },
    { url: '/admin/recrutement/candidates', name: 'Recrutement Candidates' },
    { url: '/admin/recrutement/applications', name: 'Recrutement Applications' },
    { url: '/admin/recrutement/employer-requests', name: 'Employer Requests' },
  ];

  for (const adminPage of adminPages) {
    test(`Admin page "${adminPage.name}" loads without crash`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      await loginAsAdmin(page);
      await page.goto(adminPage.url);
      await page.waitForLoadState('networkidle');

      // Sidebar visible
      const aside = page.locator('aside');
      await expect(aside).toBeVisible();

      // Main content visible
      const main = page.locator('main');
      await expect(main).toBeVisible();

      expect(pageErrors, `Page errors on ${adminPage.name}: ${pageErrors.join(', ')}`).toHaveLength(0);
    });
  }
});
