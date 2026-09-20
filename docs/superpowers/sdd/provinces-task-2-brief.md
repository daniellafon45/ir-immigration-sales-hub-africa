# Task 2 brief — ProvincesSection estimator + comparator

Read this first. Exact TSX is in plan Task 2.

**Plan:** `docs/superpowers/plans/2026-09-18-provinces-cout-de-vie.md` (Task 2)
**Spec:** `docs/superpowers/specs/2026-09-18-provinces-cout-de-vie.md`

## Context

Task 1 shipped `livingBasket`, `citiesForProvince`, `defaultCityId`, `defaultCompareIds`, `livingCities`. Import them. Do not change the helper.

Replace `ProvincesSection` (currently old Slide hero + province table) with OpportunitiesShell estimator + comparator. Keep Band and Hero functions after it.

Current Jobs/Salaires/Calculateurs chrome: **no panel**. Do not add panel=, JobsBriefingPanel, À retenir, La question.

## Constraints

- No git. No profile setters. Local useState for city and compare chips.
- slideCount stays 2.
- Do not modify Opportunities, Jobs, Salaries, Calculators.
- Forbidden: Le commercial, version connectée.
- Max 3 compared cities.
- Hide Garde d’enfants when kids.length === 0.
- U+2019 apostrophes.
- If Slide unused after rewrite, remove the unused import.

## TDD

Append tests from plan Task 2 to market.test.ts, RED, then replace ProvincesSection with plan TSX.

GREEN: `npx vitest run src/features/market.test.ts src/lib/living-basket.test.ts`

## Report

`docs/superpowers/sdd/provinces-task-2-report.md`
