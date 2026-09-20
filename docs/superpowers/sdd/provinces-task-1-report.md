# Task 1 report — living cities + basket helper

**Date:** 2026-09-18  
**Plan:** `docs/superpowers/plans/2026-09-18-provinces-cout-de-vie.md` (Task 1)  
**Brief:** `docs/superpowers/sdd/provinces-task-1-brief.md`

## Status

**DONE** — Dataset `livingCities`, helper `livingBasket`, and Vitest suite implemented per plan. No UI changes. No git operations.

## Scope delivered

| File | Action |
|------|--------|
| `src/lib/living-basket.test.ts` | Created (5 tests) |
| `src/data/cost-of-living.ts` | Created (12 demo cities) |
| `src/lib/living-basket.ts` | Created (pure helper + defaults) |

**Not modified:** `household-living.ts`, `market.tsx`, profile store, UI.

## TDD evidence

### Step 1 — Tests first

`src/lib/living-basket.test.ts` added exactly as specified in the plan, including family string `Couple + enfant(s)` for the child scenario.

### Step 2 — RED

Command:

```text
npx vitest run src/lib/living-basket.test.ts
```

Result (before implementation files existed):

```text
 FAIL  src/lib/living-basket.test.ts
Error: Failed to resolve import "@/data/cost-of-living" from "src/lib/living-basket.test.ts". Does the file exist?

 Test Files  1 failed (1)
      Tests  no tests
```

Suite could not load: missing `@/data/cost-of-living` and `@/lib/living-basket`.

### Step 3 — Implementation

- `src/data/cost-of-living.ts` — `LivingCity` type + `livingCities` array (12 cities, 6 provinces).
- `src/lib/living-basket.ts` — `livingBasket`, `citiesForProvince`, `cityById`, `defaultCityId`, `defaultCompareIds`.

Rules applied:

- Housing: `housing2` when `adults > 1` OR `kids > 0`, else `housing1`.
- Grocery: `grocery * adults + round(grocery * 0.5) * kids`.
- Transport: `transport * adults`.
- Childcare: `childcare * kids`.
- `netMonthly` from `householdLiving(profile).combinedNetMonthly`.
- `remainder`: `max(0, netMonthly - total)`.

### Step 4 — GREEN

Same command:

```text
npx vitest run src/lib/living-basket.test.ts
```

Result:

```text
 ✓ src/lib/living-basket.test.ts (5 tests) 32ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
```

### Test coverage summary

| Describe | Test | Key assertions |
|----------|------|----------------|
| `livingCities` | 12 cities, ordered ids | montreal → vancouver |
| `livingBasket` | Default couple, Montréal | 2-bed, total 3460, remainder 5990, net 9450 |
| `livingBasket` | `Seul(e)` | 1-bed, total 2440, net 4200 |
| `livingBasket` | `Couple + enfant(s)` + 1 child | grocery 1050, childcare 900, total 4570 |
| `city defaults` | QC cities, defaults | montreal default; compare `[montreal, toronto, moncton]` |

## Commits

None (per project constraints).

## Concerns / follow-ups

- Task 2 will wire `ProvincesSection` to these helpers; no consumer in UI yet.
- `defaultCompareIds` uses fixed contrast pool `toronto`, `moncton`, `vancouver`, `winnipeg` excluding primary — behavior is test-locked only for default QC profile.
- Demo numbers are static; not tied to live market data.

## Agent return block

- **Status:** DONE  
- **Commits:** none  
- **Tests:** 5/5 pass (`src/lib/living-basket.test.ts`)  
- **Report:** `docs/superpowers/sdd/provinces-task-1-report.md`
