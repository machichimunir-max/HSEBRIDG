# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-clicks.spec.ts >> Homepage Link Tests >> Create account link navigates to register
- Location: tests\homepage-clicks.spec.ts:39:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main a:has-text("Create account")')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('main a:has-text("Create account")') with timeout 10000ms
  - waiting for locator('main a:has-text("Create account")')

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Homepage Link Tests', () => {
  4  |   test('All navigation links should be clickable and navigate correctly', async ({ page }) => {
  5  |     await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  6  |     await page.waitForSelector('header a:has-text("Login")', { timeout: 10000 });
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
> 43 |     await expect(createAccountBtn).toBeVisible({ timeout: 10000 });
     |                                    ^ Error: expect(locator).toBeVisible() failed
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