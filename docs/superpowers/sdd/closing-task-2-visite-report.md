# Task 2 report — Visite data

**Date:** 2026-09-19  
**Plan:** `docs/superpowers/plans/2026-09-19-closing-lenses.md`  
**Brief:** `docs/superpowers/sdd/closing-task-2-visite-brief.md`

## Status

**DONE** — Data layer visite implémentée avec TDD, sans modification UI, `profile.ts`, `storage.ts` ou Pitch.

## Scope delivered

| File | Action |
|------|--------|
| `src/data/visit-fees.test.ts` | Created (3 tests) |
| `src/lib/visit-cost.test.ts` | Created (3 tests) |
| `src/data/visit-purposes.ts` | Created |
| `src/data/visit-fees.ts` | Created |
| `src/data/visit-funds.ts` | Created |
| `src/lib/visit-cost.ts` | Created |

## TDD evidence

### Step 1 — Tests first

Tests added before implementation:

- `src/data/visit-fees.test.ts`
- `src/lib/visit-cost.test.ts`

### Step 2 — RED

Command:

```text
npx vitest run src/lib/visit-cost.test.ts src/data/visit-fees.test.ts
```

Result before implementation:

```text
FAIL  src/lib/visit-cost.test.ts
Error: Failed to resolve import "@/data/visit-funds" from "src/lib/visit-cost.test.ts". Does the file exist?

FAIL  src/data/visit-fees.test.ts
Error: Failed to resolve import "@/data/visit-fees" from "src/data/visit-fees.test.ts". Does the file exist?
```

### Step 3 — Implementation

- `visit-purposes`: 3 motifs (`family`, `tourism`, `business`) avec attaches courtes et `hostUseful`.
- `visit-fees`: frais démo IRCC 2026-09-19, chemin visa vs eTA, biométrie plafonnée.
- `visit-funds`: grille démo recommandée par durée × taille du foyer.
- `visit-cost`: durée et motif par défaut, coût du séjour = `livingBasket(...).total * factor`, fonds, frais, billets démo, écart, accompagnants, `canWork: false`.

### Step 4 — GREEN

Same command:

```text
npx vitest run src/lib/visit-cost.test.ts src/data/visit-fees.test.ts
```

Result:

```text
✓ src/data/visit-fees.test.ts (3 tests)
✓ src/lib/visit-cost.test.ts (3 tests)

Test Files  2 passed (2)
Tests       6 passed (6)
```

## Verification

- Lint check on edited files: no diagnostics found.
- No git operations performed.

## Concerns

- The brief specifies exact fee values, but not exact numeric values for the demo `visit-funds` grid; a monotonic demo grid was introduced to satisfy the required API and tests.

## Agent return block

- **Status:** DONE  
- **Commits:** none  
- **Tests:** 6/6 pass (`src/lib/visit-cost.test.ts`, `src/data/visit-fees.test.ts`)  
- **Concerns:** demo `visit-funds` grid values were inferred because the brief does not provide a numeric matrix  
- **Report:** `docs/superpowers/sdd/closing-task-2-visite-report.md`
