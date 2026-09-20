# Task 1 report — routes, bridges, path helper

**Date:** 2026-09-18  
**Plan:** `docs/superpowers/plans/2026-09-18-voies-passerelles.md` (Task 1)  
**Brief:** `docs/superpowers/sdd/voies-task-1-brief.md`  
**Spec:** `docs/superpowers/specs/2026-09-18-voies-passerelles.md`

## Status

**DONE** — Demo pathways (8 routes), passerelles (8 bridges), and pure helper `route-paths` shipped per plan. No UI changes. No git operations.

## Scope delivered

| File | Action |
|------|--------|
| `src/lib/route-paths.test.ts` | Created (4 tests) |
| `src/data/routes.ts` | Replaced entirely (extended types + `routeBridges`) |
| `src/lib/route-paths.ts` | Created (`routeById`, `routeForObjective`, `bridgesFrom`) |

**Not modified:** `immigration.tsx`, `market.tsx`, `CompareSection`, or any other UI.

## TDD evidence

### Step 1 — Tests first

`src/lib/route-paths.test.ts` added exactly as specified in the plan (French strings use apostrophe U+2019).

### Step 2 — RED

Command:

```text
npx vitest run src/lib/route-paths.test.ts
```

Result (before `route-paths.ts` and updated `routes.ts`):

```text
 FAIL  src/lib/route-paths.test.ts
Error: Failed to resolve import "@/lib/route-paths" from "src/lib/route-paths.test.ts". Does the file exist?

 Test Files  1 failed (1)
      Tests  no tests
```

### Step 3 — Implementation

- **`src/data/routes.ts`** — `ImmigrationRoute` gains `conditions: string[]`; new `RouteBridge` type; `routes` expanded to 8 pathways (`ee`, `study`, `pnp`, `work`, `family`, `business`, `visit`, `asylum`); `routeBridges` with 8 demo bridges including `visit-asylum` caution copy.
- **`src/lib/route-paths.ts`** — Objective → route id map; `routeById` (fallback `routes[0]`); `routeForObjective`; `bridgesFrom` filters by `from`.

### Step 4 — GREEN

Command:

```text
npx vitest run src/lib/route-paths.test.ts
```

Result:

```text
 ✓ src/lib/route-paths.test.ts (4 tests) 4ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

### Regression check

Full suite:

```text
npx vitest run
```

Result: **35** test files, **226** tests passed (including new route-paths tests).

### Test coverage summary

| Describe | Test | Key assertions |
|----------|------|----------------|
| `routes` | eight demo pathways | length 8; ids order; every route has `conditions.length > 0` |
| `routeBridges` | eight bridges + asylum caution | length 8; `visit-asylum` from/to/caution verbatim |
| `route paths` | objective mapping | objectives map to `ee`, `study`, `work`, `visit`, `business`, `family`; `routeById("study").name` |
| `route paths` | bridges from route | `visit` → study/work/asylum; `work` → pnp/ee; `family` → [] |

## Data notes

- **`Affaires`** objective maps to route id `business` (tag `Entrepreneuriat` in data).
- **`routeById`** returns `routes[0]` when id is unknown (test uses known id `study`).
- French demo copy in data uses U+2019 apostrophe per project constraints.

## Commits

None (per brief).

## Concerns

None. Task 2 (RoutesSection UI + exports from `market.tsx`) remains out of scope for this task; `immigration.tsx` still imports `routes` only and will consume `route-paths` / `routeBridges` in Task 2.

## Return block (for orchestrator)

- **Status:** DONE  
- **Commits:** none  
- **Tests:** `npx vitest run src/lib/route-paths.test.ts` — 4/4 passed; full suite 226/226 passed  
- **Concerns:** none
