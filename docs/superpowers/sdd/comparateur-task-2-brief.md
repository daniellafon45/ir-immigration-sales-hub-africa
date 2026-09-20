# Task 2 brief — CompareSection chrome

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan Task 2:** `docs/superpowers/plans/2026-09-18-comparateur-chrome.md`
**Spec:** `docs/superpowers/specs/2026-09-18-comparateur-chrome.md`

## Where this fits

After Task 1, `recommendedScenarioId` exists. This task restyles `CompareSection` onto OpportunitiesShell (Profil client / Emplois chrome).

## Already shipped

- `recommendedScenarioId` in `src/lib/route-paths.ts`

## Constraints

- Project folder only. No git. No commits.
- Keep `RoutesSection` and its helpers unchanged.
- Replace only `CompareSection` through end of file, as in the plan.
- No `panel=`. No profile store setters. `toggleCompare` is allowed.
- Copy Task 2 tests and TSX from the plan.
- Remove unused `Slide` / `Card` imports if nothing uses them.

## TDD

Append tests to `src/features/immigration.test.ts`, RED, then rewrite CompareSection.

RED/GREEN: `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts`

## Report

Write `docs/superpowers/sdd/comparateur-task-2-report.md`

Return: Status, commits none, test summary, concerns.
