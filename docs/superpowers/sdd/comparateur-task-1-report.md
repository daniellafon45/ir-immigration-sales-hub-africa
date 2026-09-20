# Task 1 report — recommendedScenarioId helper

**Date:** 2026-09-18  
**Plan:** `docs/superpowers/plans/2026-09-18-comparateur-chrome.md` (Task 1)  
**Brief:** `docs/superpowers/sdd/comparateur-task-1-brief.md`  
**Spec:** `docs/superpowers/specs/2026-09-18-comparateur-chrome.md`

## Status

**DONE** — Pure helper `recommendedScenarioId(profile)` shipped per plan. No UI changes. No git operations.

## Scope delivered

| File | Action |
|------|--------|
| `src/lib/route-paths.test.ts` | Appended `recommendedScenarioId` describe + merged imports (5 tests total in file) |
| `src/lib/route-paths.ts` | Added `recommendedScenarioId`; merged import from `@/data/profile` (`familyHasChildren`, `Profile`) |

**Not modified:** `src/features/immigration.tsx`, `CompareSection`, or any other UI.

## Helper behavior

`recommendedScenarioId` maps a household profile to scenario id `A`–`D`:

| Condition | Scenario |
|-----------|----------|
| `familyHasChildren(profile.family)` or objective `Regroupement familial` | `D` |
| Objective `Études`, `Travail`, or `Visite` | `B` |
| Objective `Résidence permanente` | `A` |
| Default (e.g. `Affaires`) | `C` |

Priority order matches plan: family / regroupement before objective branches; `Affaires` and other non-listed objectives fall through to `C`.

## TDD evidence

### Step 1 — Tests first

Appended to `src/lib/route-paths.test.ts` exactly as in the plan. Existing describes (`routes`, `routeBridges`, `route paths`) unchanged.

### Step 2 — RED

Command:

```text
npx vitest run src/lib/route-paths.test.ts
```

Result:

```text
 × recommendedScenarioId > picks a household scenario from the profile
TypeError: (0 , recommendedScenarioId) is not a function

 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
```

### Step 3 — Implementation

Appended to `src/lib/route-paths.ts` per plan (single `@/data/profile` import merged at top).

### Step 4 — GREEN

Command:

```text
npx vitest run src/lib/route-paths.test.ts
```

Result:

```text
 ✓ src/lib/route-paths.test.ts (5 tests) 11ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
```

### Regression check

Command:

```text
npx vitest run
```

Result: **36** test files, **231** tests passed.

### Test coverage summary

| Describe | Test | Key assertions |
|----------|------|----------------|
| `recommendedScenarioId` | picks a household scenario from the profile | `defaultProfile` → `A`; Études/Travail/Visite → `B`; Affaires → `C`; Regroupement familial → `D`; Couple + enfant(s) → `D`; Seul(e) + Affaires → `C` |

## Commits

None (per brief).

## Concerns

None. Task 2 (`CompareSection` chrome + `immigration.test.ts`) remains out of scope; UI does not import `recommendedScenarioId` until that task.

## Return block (for orchestrator)

- **Status:** DONE  
- **Commits:** none  
- **Test summary:** `route-paths.test.ts` 5/5 passed; full suite 231/231 passed  
- **Concerns:** none  
