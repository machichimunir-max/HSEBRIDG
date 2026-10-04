# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-clicks.spec.ts >> Homepage Link Tests >> All navigation links should be clickable and navigate correctly
- Location: tests\homepage-clicks.spec.ts:4:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('header a:has-text("Login")') to be visible

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Homepage Link Tests', () => {
  4  |   test('All navigation links should be clickable and navigate correctly', async ({ page }) => {
  5  |     await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
> 6  |     await page.waitForSelector('header a:has-text("Login")', { timeout: 10000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  7  | 
  8  |     // Test header Login link
  9  |     const headerLogin = page.locator('header a:has-text("Login")');
  10 |     await expect(headerLogin).toBeVisible();
  11 |     await expect(headerLogin).toBeEnabled();
  12 |     console.log('✅ Header Login link is visible and enabled');
  13 | 
  14 |     // Test header "Start learning" link
  15 |     const startLearningBtn = page.locator('header a:has-text("Start learning")');
  16 |     await expect(startLearningBtn).toBeVisible();
  17 |     await expect(startLearningBtn).toBeEnabled();
  18 |     console.log('✅ Start learning link is visible and enabled');
  19 | 
  20 |     // Test "Create account" link
  21 |     const createAccountBtn = page.locator('main a:has-text("Create account")');
  22 |     await expect(createAccountBtn).toBeVisible();
  23 |     await expect(createAccountBtn).toBeEnabled();
  24 |     console.log('✅ Create account link is visible and enabled');
  25 | 
  26 |     // Test "Sign in" link
  27 |     const signInBtn = page.locator('main a:has-text("Sign in")');
  28 |     await expect(signInBtn).toBeVisible();
  29 |     await expect(signInBtn).toBeEnabled();
  30 |     console.log('✅ Sign in link is visible and enabled');
  31 | 
  32 |     // Try clicking header Login
  33 |     await headerLogin.click();
  34 |     await page.waitForURL('**/login', { timeout: 10000 });
  35 |     expect(page.url()).toContain('/login');
  36 |     console.log('✅ Header Login click successful - redirected to', page.url());
  37 |   });
  38 | 
  39 |   test('Create account link navigates to register', async ({ page }) => {
  40 |     await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  41 | 
  42 |     const createAccountBtn = page.locator('main a:has-text("Create account")');
  43 |     await expect(createAccountBtn).toBeVisible({ timeout: 10000 });
  44 |     await createAccountBtn.click();
  45 |     await page.waitForURL('**/register', { timeout: 10000 });
  46 |     expect(page.url()).toContain('/register');
  47 |     console.log('✅ Create account link works correctly');
  48 |   });
  49 | 
  50 |   test('Sign in link navigates to login', async ({ page }) => {
  51 |     await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  52 | 
  53 |     const signInBtn = page.locator('main a:has-text("Sign in")');
  54 |     await expect(signInBtn).toBeVisible({ timeout: 10000 });
  55 |     await signInBtn.click();
  56 |     await page.waitForURL('**/login', { timeout: 10000 });
  57 |     expect(page.url()).toContain('/login');
  58 |     console.log('✅ Sign in link works correctly');
  59 |   });
  60 | 
  61 |   test('Start learning link navigates to register', async ({ page }) => {
  62 |     await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  63 | 
  64 |     const startLearningBtn = page.locator('header a:has-text("Start learning")');
  65 |     await expect(startLearningBtn).toBeVisible({ timeout: 10000 });
  66 |     await startLearningBtn.click();
  67 |     await page.waitForURL('**/register', { timeout: 10000 });
  68 |     expect(page.url()).toContain('/register');
  69 |     console.log('✅ Start learning link works correctly');
  70 |   });
  71 | });
  72 | 
```