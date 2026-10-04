Plateforme QHSE E-Learning — Prompts par partie
Ordre : colle RÈGLES GLOBALES une seule fois au début, puis une partie à la fois. Passe à la suivante seulement quand la précédente est validée.

RÈGLES GLOBALES (à coller en premier)
PROJET : Plateforme QHSE E-Learning (Qualité, Hygiène, Sécurité, Environnement).

STACK : Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, Prisma, bcryptjs, cookies HTTP-only.

RÈGLES :
- Développement 100 % local et gratuit : aucun service payant (pas de Bunny, VdoCipher, Stripe, cloud).
- Le projet existe déjà : NE PAS repartir de zéro. Lire l'existant, le réutiliser, modifier uniquement le nécessaire.
- Pas de doublons (routes, modèles Prisma, système d'auth).
- Toute opération sensible côté serveur, avec vérification des permissions et validation des données.
- Ne jamais dire "ça marche" parce que ça compile : exécuter, tester, et écrire "NON TESTÉ" si non testé.
- Travailler par petites étapes, tester chaque étape.

Réponds "OK, prêt" et attends la partie suivante.
PARTIE 0 — Audit (aucune modification)
PARTIE 0 : AUDIT. NE MODIFIE RIEN.

Analyse tout le code existant :
1. Architecture des dossiers
2. Schéma Prisma et migrations
3. Authentification, middleware, sessions
4. Routes API, Server Actions, composants
5. Dashboards (admin, étudiant)
6. Système vidéo

Donne un rapport court :

EXISTANT ET FONCTIONNEL :
- ...
EXISTANT MAIS À CORRIGER / ADAPTER :
- ...
MANQUANT À DÉVELOPPER :
- ...
RISQUES / PROBLÈMES :
- ...
PLAN D'IMPLÉMENTATION (en réutilisant l'existant) :
- Phase 1 ... Phase N

Attends ma validation avant toute modification.
PARTIE 1 — Base de données + Seed
PARTIE 1 : PRISMA + SEED.

Vérifie/complète le schéma (sans dupliquer les modèles existants) :
User (role ADMIN/STUDENT), Course, Module, Lesson, Enrollment, LessonProgress, VideoMetadata, VideoAccessToken.

Course : id, title, slug unique, description, shortDescription, thumbnail, category, level, duration, published, createdAt, updatedAt.
Module : id, courseId, title, description, order, createdAt, updatedAt.
Lesson : id, moduleId, title, description, order, duration, videoId, videoProvider ("local" par défaut), published, createdAt, updatedAt.
Relations propres avec onDelete adapté et contraintes uniques (ex : une inscription unique par user+course, une progression unique par user+lesson).
Catégories QHSE : prévoir une liste (SST, incendie, travail en hauteur, risque électrique, EPI, ISO 45001/14001/9001, LOTO, etc.).

Seed :
- admin@qhse.local / Admin123! (ADMIN)
- student@qhse.local / Student123! (STUDENT)
- 2 formations (ex : "HSE Fondamentaux du Chantier"), 2 modules chacune, 3 leçons par module, données QHSE réalistes.

Exécute : npx prisma generate, npx prisma migrate dev, npx prisma db seed, npx tsc --noEmit.
Corrige les erreurs et donne un rapport (testé / NON TESTÉ).
PARTIE 2 — Authentification et protection
PARTIE 2 : AUTH.

Réutilise l'auth existante (un seul système). Vérifie/finalise :
- Register, Login, Logout, session
- Mots de passe hashés (bcryptjs), cookies HTTP-only sécurisés
- Session contenant userId et role
- Middleware/guards : /admin réservé à ADMIN, /learn et dashboard étudiant réservés aux connectés
- Validation serveur (email, password)
- Erreurs propres : 400, 401, 403, 404, 500 sans fuite d'informations internes

Teste : étudiant -> /admin (refusé), non connecté -> /admin (refusé), login/logout OK.
Rapport testé / NON TESTÉ.
PARTIE 3 — Admin : dashboard et gestion des formations
PARTIE 3 : ADMIN.

Pages : /admin, /admin/courses, /admin/courses/new, /admin/courses/[id], /admin/courses/[id]/edit, /admin/users, /admin/enrollments.

Dashboard : nb formations, publiées, nb étudiants, nb inscriptions, stats de progression.
Tableau formations : Formation | Catégorie | Statut | Modules | Leçons | Actions (Modifier, Publier/Dépublier, Supprimer, Voir).
Formulaire création : titre, description, description courte, catégorie, niveau, durée, thumbnail.
Éditeur de formation : "+ Ajouter un module", dans chaque module "+ Ajouter une leçon", modifier/supprimer/réordonner.
Leçon : titre, description, vidéo (sélection d'une vidéo locale), durée, ordre, publication.

Server Actions avec vérification ADMIN + validation :
createCourse, updateCourse, deleteCourse, publishCourse, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson.

UI : Tailwind, responsive, loading/empty/error states, toasts.
Teste le parcours admin complet (créer, modifier, publier, dépublier, supprimer). Rapport testé / NON TESTÉ.
PARTIE 4 — Étudiant : catalogue, détail, inscription, dashboard
PARTIE 4 : ESPACE ÉTUDIANT.

- /courses : formations publiées (image, titre, description courte, catégorie, niveau, durée, bouton "Voir la formation") + recherche + filtres catégorie/niveau.
- /courses/[slug] : détails, objectifs, modules, leçons, nombre total de leçons. Bouton "S'inscrire à cette formation" si non inscrit, "Continuer la formation" si inscrit.
- enrollInCourse() côté serveur (connecté, formation publiée, pas de doublon).
- Dashboard étudiant : "Mes formations" (cards avec thumbnail, titre, catégorie, progression, bouton Continuer), formations commencées/terminées, progression moyenne, "Continuer" vers la dernière leçon consultée.

Responsive, états vides/erreur. Teste : register, login, catalogue, inscription. Rapport testé / NON TESTÉ.
PARTIE 5 — Learning Player et progression
PARTIE 5 : LEARNING + PROGRESSION.

Page /learn/[courseId]/[lessonId] :
- Sidebar : modules, leçons, leçon actuelle (→), terminées (✓), non commencées (○)
- Zone principale : vidéo, titre, description, bouton "Leçon terminée", Précédent, Suivant
- Mobile : sidebar repliable, lecteur adapté.

Progression :
- updateLessonProgress() côté serveur (completed = true)
- progression = leçons terminées / total leçons x 100
- Afficher barre, pourcentage, "7 / 10 leçons terminées"
- Mémoriser la dernière leçon consultée

Sécurité serveur à chaque accès : utilisateur connecté, rôle, inscription à la formation, leçon appartenant bien à la formation.

Teste : terminer une leçon, passer à la suivante, quitter, revenir, progression conservée. Rapport testé / NON TESTÉ.
PARTIE 6 — Vidéo locale + abstraction VideoProvider
PARTIE 6 : VIDÉO.

Crée l'abstraction :
interface VideoProvider { uploadVideo(...), getPlaybackUrl(...), getVideoMetadata(...) }

Classes : LocalVideoProvider (réellement utilisé), BunnyVideoProvider et VdoCipherVideoProvider (squelettes préparés, non branchés).
Variable : VIDEO_PROVIDER=local.
Vidéos de test servies depuis /public/videos/ ou une route serveur propre.

Flux sécurisé : demande d'accès -> vérif session -> vérif inscription -> vérif leçon -> génération d'un accès temporaire (durée configurable, ex : 30 min) -> lecture.
generateVideoAccessToken() côté serveur. Aucune clé/secret envoyé au navigateur. Le frontend ne dépend jamais directement d'un provider.

Teste la lecture d'une vidéo locale dans le player. Rapport testé / NON TESTÉ.
PARTIE 7 — Tests de sécurité et build
PARTIE 7 : TESTS FINAUX.

Teste réellement :
- étudiant -> /admin
- non connecté -> /admin
- étudiant non inscrit -> /learn/...
- étudiant A -> données de l'étudiant B
- accès direct à une leçon privée
- manipulation des IDs dans l'URL
- appels API sans authentification
- validation serveur des formulaires

Puis : npx prisma generate, npx tsc --noEmit, npm run build, npm run dev.
Corrige toutes les erreurs.

Scénario final sur http://localhost:3000 :
ADMIN : login -> créer formation/modules/leçons -> vidéos locales -> publier
STUDENT : register/login -> catalogue -> inscription -> learning -> vidéo -> leçon terminée -> progression -> leçon suivante -> quitter -> revenir -> progression conservée

Rapport final : FONCTIONNEL / NON TESTÉ / RESTE À FAIRE.
PARTIE 8 — Préparation Bunny / VdoCipher (plus tard)
PARTIE 8 : PRÉPARATION FUTURE (sans service payant connecté).

Vérifie que passer de VIDEO_PROVIDER=local à bunny ou vdocipher ne demande de modifier que la couche providers.
Documente les variables d'environnement futures et complète les squelettes des providers.
NE PAS implémenter maintenant : paiement, Stripe, certificats, quiz, emails, coupons, watermark, analytics.