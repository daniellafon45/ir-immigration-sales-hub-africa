# Task 2 brief — RoutesSection chrome + passerelles + détail

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan Task 2:** `docs/superpowers/plans/2026-09-18-voies-passerelles.md`
**Spec:** `docs/superpowers/specs/2026-09-18-voies-passerelles.md`

## Where this fits

After Task 1, `routes` has 8 pathways + conditions, `routeBridges` has 8 bridges, and `route-paths` helpers exist. This task restyles `RoutesSection` onto OpportunitiesShell and adds passerelles + detail slides.

## Already shipped (do not redo)

- `src/data/routes.ts` — 8 routes including `visit` and `asylum`, `routeBridges`
- `src/lib/route-paths.ts` — `routeById`, `routeForObjective`, `bridgesFrom`

## Constraints

- Project folder only. No git. No commits.
- Keep `CompareSection` in the same file, unchanged.
- Export `OpportunitiesShell`, `Surface`, `SectionLabel` from `src/features/market.tsx`. Do not change their behavior.
- No `panel=`. No profile store setters. `setRoute` is allowed.
- Copy the Task 2 tests and TSX from the plan.
- Keep `Slide` import because CompareSection still uses it.
- Apostrophe U+2019 in French UI.

## TDD

Write `src/features/immigration.test.ts` then RED, then export chrome, then rewrite `RoutesSection` as in the plan.

RED/GREEN: `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts`

## Report

Write `docs/superpowers/sdd/voies-task-2-report.md`

Return: Status, commits none, test summary, concerns.
