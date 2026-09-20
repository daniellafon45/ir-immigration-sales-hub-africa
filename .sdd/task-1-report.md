# Task 1 Report: Stretch Auto / Loriane / Marc to Profil retenu width

## What was implemented

- **`PrincipalPanel` mode chips row:** Replaced `flex shrink-0 flex-wrap` wrapper with a CSS grid (`grid w-full shrink-0 gap-1.5`) that uses `grid-cols-3` when `showSpouse` is true and `grid-cols-2` otherwise, so the segmented control spans the same horizontal width as the scrollable content area (including **Profil retenu**).
- **Mode `Chip` instances:** Each chip receives `className="w-full min-w-0 justify-center"` so columns are equal width, labels stay centered, and long first names respect `min-w-0` overflow behavior.
- **`Chip` component:** Added optional `className?: string` prop, merged as the last argument to `cn(...)` so mode chips can override layout without affecting other `Chip` usages (Objectif / Destination unchanged).

## What was tested and test results

| Command | Result |
|---------|--------|
| `npm test -- src/features/profile.test.ts` | 3/3 passed |
| `npm test` (full suite) | 30/30 passed (9 files) |

New coverage in `describe("principal mode chips")`:

1. `PrincipalPanel` source contains grid layout and chip stretch classes.
2. `Chip` source exposes `className` and passes it into `cn(...)`.

## TDD Evidence

### RED

**Command:** `npm test -- src/features/profile.test.ts`

**Output (summary):**

```
❯ src/features/profile.test.ts (3 tests | 2 failed)
   × principal mode chips > stretches Auto / applicant / spouse chips to the Profil retenu width
     → expected 'function PrincipalPanel({…' to contain 'grid w-full'
   × principal mode chips > lets Chip accept a className so mode chips can fill their column
     → expected 'function Chip({…' to contain 'className?: string'
```

**Why expected:** `PrincipalPanel` still used `mt-3 flex shrink-0 flex-wrap gap-1.5` and mode chips had no stretch `className`; `Chip` had no `className` prop.

### GREEN

**Command:** `npm test -- src/features/profile.test.ts`

**Output (summary):**

```
✓ src/features/profile.test.ts (3 tests) 140ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

**Note:** After the first implementation pass, one test still failed because the brief’s `cn(..., className,)` trailing comma prevented the regex `/cn\([\s\S]*className\s*\)/` from matching. Removing the trailing comma after the final `className` argument (keeping `className` immediately before the closing `)` of `cn` via whitespace/newline) fixed the match without changing behavior.

## Files changed

- `src/features/profile.test.ts` — appended `describe("principal mode chips")` with two tests.
- `src/features/profile.tsx` — grid mode row in `PrincipalPanel`; `Chip` `className` passthrough.

## Self-review findings

- Scope limited to mode chips row and `Chip` as required; no other `PrincipalPanel` layout changes.
- Other `Chip` call sites unchanged (no `className` passed).
- Grid column count correctly tied to `showSpouse` (2 vs 3 columns).
- `w-full` on the grid row aligns chip edges with full-width blocks below within the same padded column.
- Minor formatting deviation from brief snippet: no trailing comma after `className` in `cn()` to satisfy the source-read regex test.

## Issues or concerns

- The brief’s Step 3 snippet shows `className,` with a trailing comma inside `cn()`, while Step 1’s regex expects `className` followed by optional whitespace and `)`. Those two are slightly inconsistent; implementation uses the comma-free last argument form so tests pass.
- Tests are static source assertions only; no visual/regression check in browser (consistent with existing `profile.test.ts` pattern).
