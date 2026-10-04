# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-ui.spec.ts >> Admin UI Tests >> Check for layout shifts and visual issues
- Location: tests\admin-ui.spec.ts:102:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1280px by 720px, received 1280px by 2666px. 1272226 pixels (ratio 0.38 of all image pixels) are different.

  Snapshot: homepage.png

Call log:
  - Expect "toHaveScreenshot(homepage.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 720px, received 1280px by 2666px. 1274086 pixels (ratio 0.38 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 8022 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1280px by 720px, received 1280px by 2666px. 1272226 pixels (ratio 0.38 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]: Together for a safer tomorrow • Votre sécurité, notre priorité
    - banner [ref=e5]:
      - generic [ref=e6]:
        - link [ref=e7] [cursor=pointer]:
          - /url: /
          - img "HSE BRIDGE - Health, Safety, Environment" [ref=e8]
        - navigation [ref=e9]:
          - link "Formations HSE" [ref=e10] [cursor=pointer]:
            - /url: /formations
          - link "Boutique EPI / EPC" [ref=e11] [cursor=pointer]:
            - /url: /boutique
          - link "Recrutement HSE" [ref=e12] [cursor=pointer]:
            - /url: /recrutement
          - link "À propos" [ref=e13] [cursor=pointer]:
            - /url: /a-propos
          - link "Contact" [ref=e14] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e15]:
          - generic [ref=e16]:
            - button "FR" [ref=e17] [cursor=pointer]
            - button "عربي" [ref=e18] [cursor=pointer]
          - link "Connexion" [ref=e19] [cursor=pointer]:
            - /url: /login
          - link "Inscription" [ref=e20] [cursor=pointer]:
            - /url: /register
    - main [ref=e21]:
      - generic [ref=e22]:
        - img "HSE BRIDGE Background" [ref=e24]
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]: HSE BRIDGE • Health • Safety • Environment
            - heading "DES SOLUTIONS HSE POUR DES PROJETS DURABLES" [level=1] [ref=e31]
            - paragraph [ref=e32]: Formation professionnelle certifiante, vente d'équipements EPI/EPC de qualité et recrutement de talents HSE pour des chantiers et industries plus sûrs.
            - generic [ref=e33]:
              - link "Explorer les formations" [ref=e34] [cursor=pointer]:
                - /url: /formations
              - link "Demander un devis EPI" [ref=e35] [cursor=pointer]:
                - /url: /boutique
              - link "Contact Rapide WhatsApp" [ref=e36] [cursor=pointer]:
                - /url: https://wa.me/212600000000?text=Bonjour%20HSE%20BRIDGE%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services.
          - generic [ref=e41]:
            - heading "Nos 3 Piliers d'Excellence" [level=3] [ref=e42]
            - paragraph [ref=e43]: Une réponse globale et certifiée à tous vos besoins HSE
            - generic [ref=e44]:
              - link [ref=e45] [cursor=pointer]:
                - /url: /formations
                - generic [ref=e49]:
                  - heading "FORMATION HSE" [level=4] [ref=e50]
                  - paragraph [ref=e51]: DES FORMATEURS QUALIFIÉS POUR DES FORMATIONS DE QUALITÉ
              - link [ref=e52] [cursor=pointer]:
                - /url: /boutique
                - generic [ref=e56]:
                  - heading "VENTE EPI / EPC" [level=4] [ref=e57]
                  - paragraph [ref=e58]: TOUS VOS ÉQUIPEMENTS DE SÉCURITÉ AU MÊME ENDROIT
              - link [ref=e59] [cursor=pointer]:
                - /url: /recrutement
                - generic [ref=e63]:
                  - heading "RECRUTEMENT HSE" [level=4] [ref=e64]
                  - paragraph [ref=e65]: DES PROFILS QUALIFIÉS POUR DES PROJETS NATIONAUX ET INTERNATIONAUX
      - generic [ref=e68]:
        - generic [ref=e69]:
          - generic [ref=e70]: 8+
          - generic [ref=e71]: Formations certifiantes
        - generic [ref=e72]:
          - generic [ref=e73]: 10+
          - generic [ref=e74]: Catégories EPI / EPC
        - generic [ref=e75]:
          - generic [ref=e76]: 500+
          - generic [ref=e77]: Talents HSE qualifiés
        - generic [ref=e78]:
          - generic [ref=e79]: 98%
          - generic [ref=e80]: Taux de satisfaction
      - generic [ref=e81]:
        - generic [ref=e82]:
          - generic [ref=e83]: Nos 3 Métiers
          - heading "3 Pôles d'Expertise Dédiés à Votre Sécurité" [level=2] [ref=e84]
          - paragraph [ref=e85]: HSE BRIDGE rassemble la formation certifiante, l'équipement professionnel et le recrutement de spécialistes sur une plateforme unique.
        - generic [ref=e86]:
          - generic [ref=e87]:
            - generic [ref=e88]:
              - generic [ref=e92]: ACADÉMIE HSE
              - heading "FORMATION HSE" [level=3] [ref=e93]
              - paragraph [ref=e94]: Formations certifiantes adaptées aux besoins du terrain, alliant théorie rigoureuse et mise en situation pratique, avec délivrance d'une attestation officielle.
              - generic [ref=e95]:
                - paragraph [ref=e96]: Pourquoi choisir l'Académie HSE BRIDGE ?
                - list [ref=e97]:
                  - listitem [ref=e98]: Formateurs certifiés avec solide expérience de terrain
                  - listitem [ref=e100]: "Pédagogie active : 50% théorie, 50% cas pratiques"
                  - listitem [ref=e102]: Attestation officielle délivrée en fin de formation
                  - listitem [ref=e104]: Modules adaptés aux normes nationales et internationales
            - link "Découvrir toutes les formations" [ref=e106] [cursor=pointer]:
              - /url: /formations
          - generic [ref=e107]:
            - generic [ref=e108]:
              - generic [ref=e112]: ÉQUIPEMENTS CERTIFIÉS
              - heading "VENTE EPI / EPC" [level=3] [ref=e113]
              - paragraph [ref=e114]: Des chantiers et usines plus sûrs grâce à notre gamme complète d'équipements de protection individuelle et collective certifiés aux normes internationales.
              - generic [ref=e115]:
                - paragraph [ref=e116]: "Nos engagements de qualité :"
                - list [ref=e117]:
                  - listitem [ref=e118]: 100% de produits certifiés CE / EN / ISO
                  - listitem [ref=e120]: Livraison rapide sur l'ensemble de vos chantiers
                  - listitem [ref=e122]: Conseil technique personnalisé par des ingénieurs HSE
                  - listitem [ref=e124]: Tarifs préférentiels et accompagnement pour grands comptes
            - link "Consulter le catalogue et demander un devis" [ref=e126] [cursor=pointer]:
              - /url: /boutique
          - generic [ref=e127]:
            - generic [ref=e128]:
              - generic [ref=e132]: TALENTS QUALIFIÉS
              - heading "RECRUTEMENT HSE" [level=3] [ref=e133]
              - paragraph [ref=e134]: Plateforme spécialisée dans la sélection et le placement de professionnels de la santé, sécurité et environnement. Nous connectons les talents certifiés aux projets les plus exigeants.
              - generic [ref=e135]:
                - paragraph [ref=e136]: Pourquoi confier votre recrutement à HSE BRIDGE ?
                - list [ref=e137]:
                  - listitem [ref=e138]: Candidats rigoureusement évalués sur leurs compétences théoriques et pratiques
                  - listitem [ref=e140]: Vivier réactif couvrant l'ensemble des spécialités HSE
                  - listitem [ref=e142]: "Flexibilité contractuelle : Intérim, CDD, CDI et missions de consulting"
                  - listitem [ref=e144]: Accompagnement continu sur site pour garantir la performance des profils placés
            - link "Déposer votre CV ou Exprimer un besoin" [ref=e146] [cursor=pointer]:
              - /url: /recrutement
      - generic [ref=e148]:
        - heading "PRÊT À SÉCURISER VOS PROJETS ?" [level=2] [ref=e149]
        - paragraph [ref=e150]: Nos experts HSE sont à votre disposition pour vous conseiller et répondre à tous vos besoins.
        - generic [ref=e151]:
          - link "Contactez notre équipe" [ref=e152] [cursor=pointer]:
            - /url: /contact
          - link "Contact WhatsApp" [ref=e153] [cursor=pointer]:
            - /url: https://wa.me/212600000000?text=Bonjour%20HSE%20BRIDGE%2C%20je%20souhaite%20un%20devis%20ou%20des%20renseignements.
    - link "Contact WhatsApp" [ref=e157] [cursor=pointer]:
      - /url: https://wa.me/212600000000?text=Bonjour%20HSE%20BRIDGE%2C%20je%20souhaite%20des%20renseignements.
    - contentinfo [ref=e160]:
      - generic [ref=e161]:
        - generic [ref=e162]:
          - img "HSE BRIDGE - Health, Safety, Environment" [ref=e163]
          - paragraph [ref=e164]: HSE BRIDGE est votre partenaire de confiance en Santé, Sécurité et Environnement. Formations certifiantes, équipements EPI/EPC et recrutement de spécialistes.
          - generic [ref=e165]: Together for a safer tomorrow
        - generic [ref=e166]:
          - heading "Liens rapides" [level=4] [ref=e167]
          - list [ref=e168]:
            - listitem [ref=e169]:
              - link "Formations HSE" [ref=e170] [cursor=pointer]:
                - /url: /formations
            - listitem [ref=e172]:
              - link "Boutique EPI / EPC" [ref=e173] [cursor=pointer]:
                - /url: /boutique
            - listitem [ref=e175]:
              - link "Recrutement HSE" [ref=e176] [cursor=pointer]:
                - /url: /recrutement
            - listitem [ref=e178]:
              - link "À propos" [ref=e179] [cursor=pointer]:
                - /url: /a-propos
            - listitem [ref=e181]:
              - link "Contact" [ref=e182] [cursor=pointer]:
                - /url: /contact
        - generic [ref=e184]:
          - heading "Contact" [level=4] [ref=e185]
          - list [ref=e186]:
            - listitem [ref=e187]:
              - generic [ref=e190]: +212 6 00 00 00 00
            - listitem [ref=e191]:
              - generic [ref=e194]: contact@hsebridge.ma
            - listitem [ref=e195]:
              - generic [ref=e199]: Casablanca, Maroc
        - generic [ref=e200]:
          - heading "Suivez-nous" [level=4] [ref=e201]
          - paragraph [ref=e202]: Rejoignez notre réseau professionnel pour suivre nos actualités réglementaires, nouveaux arrivages EPI et offres d'emploi HSE.
          - generic [ref=e203]:
            - link "WhatsApp" [ref=e204] [cursor=pointer]:
              - /url: https://wa.me/212600000000
            - link "LinkedIn" [ref=e207] [cursor=pointer]:
              - /url: https://linkedin.com
            - link "Instagram" [ref=e210] [cursor=pointer]:
              - /url: https://instagram.com
      - generic [ref=e213]:
        - paragraph [ref=e214]: © 2026 HSE BRIDGE. Tous droits réservés.
        - paragraph [ref=e215]: Des solutions HSE pour des projets durables
  - button "Open Next.js Dev Tools" [ref=e221] [cursor=pointer]
  - alert [ref=e225]
```

# Test source

```ts
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
> 106 |     await expect(page).toHaveScreenshot('homepage.png', {
      |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
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