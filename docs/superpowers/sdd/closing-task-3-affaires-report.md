# Task 3 report — Affaires data

**Date:** 2026-09-19  
**Brief:** `docs/superpowers/sdd/closing-task-3-affaires-brief.md`  
**Plan:** `docs/superpowers/plans/2026-09-19-closing-lenses.md`  
**Design:** `c:\Users\Admin\.cursor\plans\affaires_closing_deck_b91e04c3.plan.md`

## Status

**DONE** — la couche data/lib Affaires demandée a été ajoutée avec TDD, sans usage de git, sans commit, et sans modification des fichiers interdits.

## Files Added

- `src/data/business-paths.ts`
- `src/data/business-thresholds.ts`
- `src/data/business-paths.test.ts`
- `src/lib/business-cost.ts`
- `src/lib/business-cost.test.ts`

## TDD Evidence

### RED

Commande exécutée :

```text
npx vitest run src/lib/business-cost.test.ts src/data/business-paths.test.ts
```

Échec observé avant implémentation :

- import `@/data/business-paths` introuvable
- import `@/lib/business-cost` introuvable

Le RED était donc bien causé par la fonctionnalité manquante.

### GREEN

Après implémentation minimale, même commande relancée :

```text
✓ src/data/business-paths.test.ts (2 tests)
✓ src/lib/business-cost.test.ts (2 tests)

Test Files  2 passed (2)
Tests  4 passed (4)
```

## Delivered Behavior

- catalogue de 4 volets : `visitor`, `c11`, `ict`, `pnp-entrepreneur`
- `startupVisaPaused = true` avec note IRCC et `retrievedAt: "2026-09-19"`
- deux grilles de seuils démo sur les 13 codes `QC ON AB MB NB BC SK NS PE NL YT NT NU`
- `businessCost(profile)` avec :
  - `path`
  - `investment`
  - `livingAnnual`
  - `stayShort`
  - `personalFunds`
  - `capitalToShow`
  - `gap`
  - `spouseOpen`
  - `startupPaused`

## Constraints Check

- aucun git utilisé
- aucun commit
- aucun changement dans `profile.ts`, `storage.ts`, UI, ni pitch
- nouveaux fichiers uniquement sous `src/data`, `src/lib` et tests

## Lint

Contrôle ciblé effectué sur les 5 nouveaux fichiers.

```text
No linter errors found.
```

## Concern

Le brief imposait explicitement les valeurs Québec (`C11 100000`, `PNP 200000`) et la présence des 13 codes, mais ne donnait pas les autres montants provinciaux/territoriaux. Les autres seuils ont donc été renseignés comme **valeurs de démonstration cohérentes**, conformément au brief, sans source chiffrée additionnelle fournie.
