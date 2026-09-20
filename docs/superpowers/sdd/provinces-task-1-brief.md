# Task 1 brief — living cities + basket helper

Read this first — exact values to use verbatim.

**Plan Task 1:** `docs/superpowers/plans/2026-09-18-provinces-cout-de-vie.md`
**Spec:** `docs/superpowers/specs/2026-09-18-provinces-cout-de-vie.md`

## Where this fits

Provinces becomes a city-level cost-of-living estimator/comparator. This task ships demo city data and a pure `livingBasket` helper. Do not touch UI.

## Constraints

- Project folder only. No git. No commits.
- English code/tests. Do not modify household-living.ts or market.tsx.
- Child family string is `Couple + enfant(s)` (with `(s)`).
- Housing: 2-bed if adults > 1 OR kids > 0, else 1-bed.
- grocery = grocery * adults + round(grocery * 0.5) * kids
- transport = transport * adults
- childcare = childcare * kids
- netMonthly from householdLiving.combinedNetMonthly
- remainder = max(0, net - total)

## TDD

Write `src/lib/living-basket.test.ts` then RED, then create `src/data/cost-of-living.ts` and `src/lib/living-basket.ts` exactly as in the plan Task 1.

RED/GREEN: `npx vitest run src/lib/living-basket.test.ts`

## Report

`c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme\docs\superpowers\sdd\provinces-task-1-report.md`

Return: Status, commits none, test summary, concerns, report path.
