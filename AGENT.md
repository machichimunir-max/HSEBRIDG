## Verification Loop
Après chaque phase d'implémentation:
1. Lance `npm run build` pour vérifier les erreurs TypeScript/Next.js.
2. Si le build échoue, lis l'erreur, corrige le fichier concerné, et relance `npm run build`.
3. Répète jusqu'à ce que le build passe à 100% sans aucune erreur.
