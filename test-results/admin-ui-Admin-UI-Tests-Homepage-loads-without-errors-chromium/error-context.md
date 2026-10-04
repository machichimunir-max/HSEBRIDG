# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-ui.spec.ts >> Admin UI Tests >> Homepage loads without errors
- Location: tests\admin-ui.spec.ts:24:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /CourseFlow|Next/i
Received string:  "HSE BRIDGE | Solutions HSE pour des projets durables"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    13 × locator resolved to <html lang="fr" data-scroll-behavior="smooth" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased scroll-smooth">…</html>
       - unexpected value "HSE BRIDGE | Solutions HSE pour des projets durables"

```

```yaml
- text: Together for a safer tomorrow • Votre sécurité, notre priorité
- banner:
  - link "HSE BRIDGE - Health, Safety, Environment":
    - /url: /
    - img "HSE BRIDGE - Health, Safety, Environment"
  - navigation:
    - link "Formations HSE":
      - /url: /formations
    - link "Boutique EPI / EPC":
      - /url: /boutique
    - link "Recrutement HSE":
      - /url: /recrutement
    - link "À propos":
      - /url: /a-propos
    - link "Contact":
      - /url: /contact
  - button "FR"
  - button "عربي"
  - link "Connexion":
    - /url: /login
  - link "Inscription":
    - /url: /register
- main:
  - img "HSE BRIDGE Background"
  - img
  - text: HSE BRIDGE • Health • Safety • Environment
  - heading "DES SOLUTIONS HSE POUR DES PROJETS DURABLES" [level=1]
  - paragraph: Formation professionnelle certifiante, vente d'équipements EPI/EPC de qualité et recrutement de talents HSE pour des chantiers et industries plus sûrs.
  - link "Explorer les formations":
    - /url: /formations
  - link "Demander un devis EPI":
    - /url: /boutique
  - link "Contact Rapide WhatsApp":
    - /url: https://wa.me/212600000000?text=Bonjour%20HSE%20BRIDGE%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services.
    - img
    - text: Contact Rapide WhatsApp
  - heading "Nos 3 Piliers d'Excellence" [level=3]
  - paragraph: Une réponse globale et certifiée à tous vos besoins HSE
  - link "FORMATION HSE DES FORMATEURS QUALIFIÉS POUR DES FORMATIONS DE QUALITÉ":
    - /url: /formations
    - img
    - heading "FORMATION HSE" [level=4]
    - paragraph: DES FORMATEURS QUALIFIÉS POUR DES FORMATIONS DE QUALITÉ
  - link "VENTE EPI / EPC TOUS VOS ÉQUIPEMENTS DE SÉCURITÉ AU MÊME ENDROIT":
    - /url: /boutique
    - img
    - heading "VENTE EPI / EPC" [level=4]
    - paragraph: TOUS VOS ÉQUIPEMENTS DE SÉCURITÉ AU MÊME ENDROIT
  - link "RECRUTEMENT HSE DES PROFILS QUALIFIÉS POUR DES PROJETS NATIONAUX ET INTERNATIONAUX":
    - /url: /recrutement
    - img
    - heading "RECRUTEMENT HSE" [level=4]
    - paragraph: DES PROFILS QUALIFIÉS POUR DES PROJETS NATIONAUX ET INTERNATIONAUX
  - text: 8+ Formations certifiantes 10+ Catégories EPI / EPC 500+ Talents HSE qualifiés 98% Taux de satisfaction Nos 3 Métiers
  - heading "3 Pôles d'Expertise Dédiés à Votre Sécurité" [level=2]
  - paragraph: HSE BRIDGE rassemble la formation certifiante, l'équipement professionnel et le recrutement de spécialistes sur une plateforme unique.
  - img
  - text: ACADÉMIE HSE
  - heading "FORMATION HSE" [level=3]
  - paragraph: Formations certifiantes adaptées aux besoins du terrain, alliant théorie rigoureuse et mise en situation pratique, avec délivrance d'une attestation officielle.
  - paragraph: Pourquoi choisir l'Académie HSE BRIDGE ?
  - list:
    - listitem: Formateurs certifiés avec solide expérience de terrain
    - listitem: "Pédagogie active : 50% théorie, 50% cas pratiques"
    - listitem: Attestation officielle délivrée en fin de formation
    - listitem: Modules adaptés aux normes nationales et internationales
  - link "Découvrir toutes les formations":
    - /url: /formations
  - img
  - text: ÉQUIPEMENTS CERTIFIÉS
  - heading "VENTE EPI / EPC" [level=3]
  - paragraph: Des chantiers et usines plus sûrs grâce à notre gamme complète d'équipements de protection individuelle et collective certifiés aux normes internationales.
  - paragraph: "Nos engagements de qualité :"
  - list:
    - listitem: 100% de produits certifiés CE / EN / ISO
    - listitem: Livraison rapide sur l'ensemble de vos chantiers
    - listitem: Conseil technique personnalisé par des ingénieurs HSE
    - listitem: Tarifs préférentiels et accompagnement pour grands comptes
  - link "Consulter le catalogue et demander un devis":
    - /url: /boutique
  - img
  - text: TALENTS QUALIFIÉS
  - heading "RECRUTEMENT HSE" [level=3]
  - paragraph: Plateforme spécialisée dans la sélection et le placement de professionnels de la santé, sécurité et environnement. Nous connectons les talents certifiés aux projets les plus exigeants.
  - paragraph: Pourquoi confier votre recrutement à HSE BRIDGE ?
  - list:
    - listitem: Candidats rigoureusement évalués sur leurs compétences théoriques et pratiques
    - listitem: Vivier réactif couvrant l'ensemble des spécialités HSE
    - listitem: "Flexibilité contractuelle : Intérim, CDD, CDI et missions de consulting"
    - listitem: Accompagnement continu sur site pour garantir la performance des profils placés
  - link "Déposer votre CV ou Exprimer un besoin":
    - /url: /recrutement
  - heading "PRÊT À SÉCURISER VOS PROJETS ?" [level=2]
  - paragraph: Nos experts HSE sont à votre disposition pour vous conseiller et répondre à tous vos besoins.
  - link "Contactez notre équipe":
    - /url: /contact
  - link "Contact WhatsApp":
    - /url: https://wa.me/212600000000?text=Bonjour%20HSE%20BRIDGE%2C%20je%20souhaite%20un%20devis%20ou%20des%20renseignements.
    - img
    - text: Contact WhatsApp
- link "Contact WhatsApp":
  - /url: https://wa.me/212600000000?text=Bonjour%20HSE%20BRIDGE%2C%20je%20souhaite%20des%20renseignements.
  - img
- contentinfo:
  - img "HSE BRIDGE - Health, Safety, Environment"
  - paragraph: HSE BRIDGE est votre partenaire de confiance en Santé, Sécurité et Environnement. Formations certifiantes, équipements EPI/EPC et recrutement de spécialistes.
  - text: Together for a safer tomorrow
  - heading "Liens rapides" [level=4]
  - list:
    - listitem:
      - link "Formations HSE":
        - /url: /formations
    - listitem:
      - link "Boutique EPI / EPC":
        - /url: /boutique
    - listitem:
      - link "Recrutement HSE":
        - /url: /recrutement
    - listitem:
      - link "À propos":
        - /url: /a-propos
    - listitem:
      - link "Contact":
        - /url: /contact
  - heading "Contact" [level=4]
  - list:
    - listitem:
      - img
      - text: +212 6 00 00 00 00
    - listitem:
      - img
      - text: contact@hsebridge.ma
    - listitem:
      - img
      - text: Casablanca, Maroc
  - heading "Suivez-nous" [level=4]
  - paragraph: Rejoignez notre réseau professionnel pour suivre nos actualités réglementaires, nouveaux arrivages EPI et offres d'emploi HSE.
  - link "WhatsApp":
    - /url: https://wa.me/212600000000
    - img
  - link "LinkedIn":
    - /url: https://linkedin.com
    - img
  - link "Instagram":
    - /url: https://instagram.com
    - img
  - paragraph: © 2026 HSE BRIDGE. Tous droits réservés.
  - paragraph: Des solutions HSE pour des projets durables
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
> 35  |     await expect(page).toHaveTitle(/CourseFlow|Next/i);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
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
  70  |     await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
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
```