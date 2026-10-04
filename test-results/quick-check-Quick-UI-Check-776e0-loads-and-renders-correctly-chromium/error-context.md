# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: quick-check.spec.ts >> Quick UI Check >> Homepage loads and renders correctly
- Location: tests\quick-check.spec.ts:4:7

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Quick UI Check', () => {
  4  |   test('Homepage loads and renders correctly', async ({ page }) => {
  5  |     const errors: string[] = [];
  6  | 
  7  |     // Capture any errors
  8  |     page.on('console', (msg) => {
  9  |       if (msg.type() === 'error') {
  10 |         errors.push(`Console error: ${msg.text()}`);
  11 |       }
  12 |     });
  13 | 
  14 |     page.on('pageerror', (error) => {
  15 |       errors.push(`Page error: ${error.message}`);
  16 |     });
  17 | 
  18 |     // Navigate to homepage
  19 |     await page.goto('http://localhost:3000');
  20 | 
  21 |     // Wait for page to load
  22 |     await page.waitForLoadState('networkidle');
  23 | 
  24 |     // Check if page loaded
> 25 |     await expect(page).toHaveTitle(/CourseFlow|Next/i);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  26 | 
  27 |     // Report any errors
  28 |     if (errors.length > 0) {
  29 |       console.log('Errors found:', errors);
  30 |       throw new Error(`Found ${errors.length} error(s): ${errors.join('; ')}`);
  31 |     }
  32 | 
  33 |     console.log('✅ Homepage loaded without errors');
  34 |   });
  35 | 
  36 |   test('Login page is accessible', async ({ page }) => {
  37 |     await page.goto('http://localhost:3000/login');
  38 |     await page.waitForLoadState('networkidle');
  39 | 
  40 |     // Check for login form elements
  41 |     const emailInput = page.locator('input[type="email"]');
  42 |     const passwordInput = page.locator('input[type="password"]');
  43 | 
  44 |     await expect(emailInput).toBeVisible();
  45 |     await expect(passwordInput).toBeVisible();
  46 | 
  47 |     console.log('✅ Login page accessible');
  48 |   });
  49 | 
  50 |   test('Navigation works', async ({ page }) => {
  51 |     await page.goto('http://localhost:3000');
  52 | 
  53 |     // Try to find navigation links
  54 |     const links = page.locator('a');
  55 |     const count = await links.count();
  56 | 
  57 |     console.log(`Found ${count} links on homepage`);
  58 |     expect(count).toBeGreaterThan(0);
  59 |   });
  60 | });
  61 | 
```