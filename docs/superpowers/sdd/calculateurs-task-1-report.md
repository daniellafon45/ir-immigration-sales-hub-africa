# Task 1 report — householdLiving helper

**Date:** 2026-09-18  
**Plan:** `docs/superpowers/plans/2026-09-18-calculateurs-profil-chrome.md` (Task 1)  
**Brief:** `docs/superpowers/sdd/calculateurs-task-1-brief.md`

## Status

**DONE** — helper implemented and tests green. No git commands run; no commits.

## Scope

| Action | Path |
|--------|------|
| Created | `src/lib/household-living.ts` |
| Created | `src/lib/household-living.test.ts` |

Not modified: UI, catalog, registry, `household-salaries.ts`, `market.tsx`.

## TDD evidence

### Step 1 — Test written first

Test file matches the brief verbatim (3 cases: default couple living costs, single `Seul(e)` household, `draftNet` for QC/ON).

### Step 2 — RED

Command:

```text
npx vitest run src/lib/household-living.test.ts
```

Result (implementation file absent):

```text
 FAIL  src/lib/household-living.test.ts
Error: Failed to resolve import "@/lib/household-living" from "src/lib/household-living.test.ts". Does the file exist?

 Test Files  1 failed (1)
      Tests  no tests
```

Exit code: **1**

### Step 3 — Implementation

Added `src/lib/household-living.ts` per brief:

- `OTHER_MONTHLY_EXPENSES = 1700`
- `householdLiving(profile)` — delegates groups/province to `householdSalaries`, rent from `provinceData`, remainder `max(0, combinedNet - rent - other)`
- `draftNet(gross, code)` — `netEstimate` + rounded monthly

### Step 4 — GREEN

Same command:

```text
npx vitest run src/lib/household-living.test.ts
```

Result:

```text
 ✓ src/lib/household-living.test.ts (3 tests) 5ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

Exit code: **0**

## Test summary

| Suite | Test | Assertion highlights |
|-------|------|----------------------|
| `householdLiving` | combines default couple nets… | 2 groups, Québec, nets 4200+5250, combined 9450, rent 1710, other 1700, remainder 6040 |
| `householdLiving` | keeps a single net when Seul(e) | 1 group, combined 4200, remainder 790 |
| `draftNet` | recomputes annual and monthly net | QC 72k → 50400/4200; ON 78k → 56940/4745 |

**Total:** 3 passed, 0 failed.

## Git

None — per brief constraints.

## Concerns

None. Implementation and tests align with brief; dependencies (`householdSalaries`, `netEstimate`, province data) behave as expected for default profile values.
