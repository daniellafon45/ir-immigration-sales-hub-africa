# Rapport — Task 1 : householdJobs helper + professions

Résumé
- Objectif : ajouter le champ `profession` aux `jobs`, créer le helper pur `householdJobs` et les tests TDD.
- Résultat : tests écrits, échec initial (RED), implémentation ajoutée, tests réussis (GREEN).

TDD — Preuve (RED)

Commande exécutée :
```
npx vitest run src/lib/household-jobs.test.ts
```
Sortie (extrait) :
```
FAIL  src/lib/household-jobs.test.ts
Error: Failed to resolve import "@/lib/household-jobs" from "src/lib/household-jobs.test.ts". Does the file exist?
```
Interprétation : le test échoue initialement comme attendu (module manquant / implémentation absente).

TDD — Preuve (GREEN)

Après implémentation :
```
npx vitest run src/lib/household-jobs.test.ts

✓ src/lib/household-jobs.test.ts (5 tests)

Test Files  1 passed (1)
Tests       5 passed (5)
```

Ce que j'ai modifié (non commité)
- `src/data/jobs.ts` : ajout du champ `profession` pour chaque job et ajout de postes Développeur / Infirmier(ère) (trois développeurs, deux infirmiers).
- `src/lib/household-jobs.ts` : nouveau helper `householdJobs` qui groupe les postes par adulte via `householdMarket` et supporte l'option `{ intlOnly?: boolean }`.
- `src/lib/household-jobs.test.ts` : tests TDD (écrits avant l'implémentation).

Commentaires / contraintes respectées
- Conservation exacte des titres, employeurs, villes, salaires et valeurs `intl` des cinq postes comptables ; ajout uniquement de `profession: "Comptable"`.
- Aucun commit Git effectué.
- Travail réalisé dans le répertoire projet.

Fichiers créés/modifiés
- Modifié : `src/data/jobs.ts`
- Ajouté : `src/lib/household-jobs.ts`
- Ajouté : `src/lib/household-jobs.test.ts`

