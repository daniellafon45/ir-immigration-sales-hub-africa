# Task 2 report — CalculatorsSection + catalog

**Date:** 2026-09-18  
**Plan:** `docs/superpowers/plans/2026-09-18-calculateurs-profil-chrome.md` (Task 2)  
**Brief:** `docs/superpowers/sdd/calculateurs-task-2-brief.md`

## Status

**DONE** — `CalculatorsSection` a été ajouté avec ses 3 slides, le catalog/registry ont été mis à jour, et les tests sont verts. Aucun usage de git, aucun commit.

## Scope

Fichiers modifiés :

- `src/features/market.test.ts`
- `src/catalog.ts`
- `src/features/registry.tsx`
- `src/features/market.tsx`

Non modifiés volontairement :

- `OpportunitiesSection`
- `JobsSection`
- `SalariesSection`
- `ProvincesSection`
- `Band`
- `Hero`
- `src/lib/household-living.ts`

## TDD evidence

### Step 1 — Tests ajoutés d’abord

Le bloc de tests Task 2 du plan a été ajouté tel quel à la fin de `src/features/market.test.ts` :

- `calculators catalog`
- `calculators chrome`
- `calculators household boards`

Aucun code de production Task 2 n’a été implémenté avant cet ajout.

### Step 2 — RED observé

Commande exécutée :

```text
npx vitest run src/features/market.test.ts
```

Résultat observé :

```text
❯ src/features/market.test.ts (23 tests | 4 failed)
× calculators catalog > keeps three calculator slides between salaries and provinces
× calculators chrome > reuses the profil client shell on CalculatorsSection
× calculators chrome > keeps coaching copy out of CalculatorsSection helpers
× calculators household boards > renders live net drafts, a shared living board, and project budget cards
```

Cause du RED :

- `calculateurs` absent du catalogue
- `CalculatorsSection` absente du registre
- `CalculatorsSection` absente de `market.tsx`
- le contenu exact attendu (`Salaire annuel brut`, `Loyer indicatif`, `Honoraires IR`, etc.) n’existait pas encore

Le RED était donc bien causé par la fonctionnalité manquante, pas par une erreur de test.

### Step 3 — Implémentation minimale pour passer

#### `src/catalog.ts`

- ajout de `Calculator` depuis `lucide-react`
- ajout de `"calculateurs"` à `SectionId`
- insertion de `{ id: "calculateurs", label: "Calculateurs", icon: Calculator, slideCount: 3 }` immédiatement après `salaires`

#### `src/features/registry.tsx`

- import de `CalculatorsSection`
- ajout de `calculateurs: CalculatorsSection` après `salaires`

#### `src/features/market.tsx`

- import de `draftNet` et `householdLiving` depuis `@/lib/household-living`
- insertion de `CalculatorsSection` immédiatement avant `export function ProvincesSection`
- reprise du TSX du plan pour :
  - `CalculatorsSection`
  - `CalculatorsNet`
  - `CalculatorsLiving`
  - `CalculatorsBudget`

Points respectés :

- `slideCount` = 3
- pas de `panel=`
- pas de `JobsBriefingPanel`
- pas de `À retenir`
- pas de `La question`
- pas de setters du profile store
- brouillons locaux en `useState`
- copie exacte avec apostrophes typographiques
- helper Task 1 réutilisé sans modification

### Step 4 — GREEN observé

Commande exécutée :

```text
npx vitest run src/features/market.test.ts src/lib/household-living.test.ts src/lib/household-salaries.test.ts
```

Résultat observé :

```text
✓ src/features/market.test.ts (23 tests)
✓ src/lib/household-salaries.test.ts (4 tests)
✓ src/lib/household-living.test.ts (3 tests)

Test Files  3 passed (3)
Tests  30 passed (30)
```

## Lint / diagnostics

Contrôle effectué sur les fichiers modifiés via `ReadLints`.

Résultat :

```text
No linter errors found.
```

## Constraint check

- aucun git utilisé
- `calculateurs` placé après `salaires` et avant `provinces`
- `registry` mis à jour
- `CalculatorsSection` insérée immédiatement avant `ProvincesSection`
- aucune modification de comportement dans `OpportunitiesSection`, `JobsSection`, `SalariesSection`, `ProvincesSection`
- aucun ajout de copy coaching interdite

## Concerns

Aucun bloquant identifié. La seule sortie annexe durant Vitest est l’avertissement npm existant :

```text
npm warn Unknown env config "devdir". This will stop working in the next major version of npm.
```

Cet avertissement n’a pas empêché l’exécution ni la validation des tests.

## Summary

Task 2 est implémentée conformément au brief et au plan, avec preuve TDD complète : tests ajoutés d’abord, RED constaté, implémentation minimale, puis GREEN sur les suites demandées.
