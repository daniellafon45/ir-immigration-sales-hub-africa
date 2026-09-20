# Task 1 brief — routes, bridges, path helper

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan Task 1:** `docs/superpowers/plans/2026-09-18-voies-passerelles.md`
**Spec:** `docs/superpowers/specs/2026-09-18-voies-passerelles.md`

## Where this fits

Voies d’immigration becomes household-aware pathways + bridges + detail. This task ships demo route/bridge data and a pure helper. Do not touch UI.

## Constraints

- Project folder only. No git. No commits.
- English code/tests. French strings in data use apostrophe U+2019.
- Do not modify immigration.tsx, market.tsx, or CompareSection.
- Copy the Task 1 files from the plan exactly (tests first).

## TDD

Write `src/lib/route-paths.test.ts` then RED, then replace `src/data/routes.ts` and create `src/lib/route-paths.ts` exactly as in the plan Task 1.

RED/GREEN: `npx vitest run src/lib/route-paths.test.ts`

## Report

Write `docs/superpowers/sdd/voies-task-1-report.md`

Return: Status, commits none, test summary, concerns.
