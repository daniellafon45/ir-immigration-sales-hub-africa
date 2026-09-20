# Task 5 Report — Menu Visite

## Scope handled

This task was completed against the current repository state, keeping the already-landed `visitOverlays`, `canadaLivePagesFor(... "Visite")`, comparator closing pills wiring, and visit-specific copy already present in `src/data/canada-live.ts` and `src/features/market.tsx`.

The remaining requested work was limited to the missing visit pills in the market closing-lens screens and to extending the existing tests accordingly.

## TDD log

1. Confirmed the existing visit overlay test was already green:
   - `npx vitest run src/data/canada-live.test.ts`
   - Result: pass, including `overlays visit pages with stay-only framing instead of work rights`

2. Extended `src/features/market.test.ts` first to require the missing visit pills:
   - `JobsToday` contains `Pas un droit de travailler`
   - `JobsIntl` contains `Pas un droit de travailler`
   - `SalariesBands` contains `Pas un droit de travailler`
   - `SalariesNet` contains `Pas un droit de travailler`
   - `ProvincesEstimator` contains `Visite`
   - `ProvincesCompare` contains `Visite`

3. Ran RED:
   - `npx vitest run src/features/market.test.ts`
   - Result: 3 failing tests, all targeted to the newly added visit-pill expectations

4. Implemented the minimal production change in `src/features/market.tsx`:
   - Added `Pas un droit de travailler` to pills for visit objective in:
     - `JobsToday`
     - `JobsIntl`
     - `SalariesBands`
     - `SalariesNet`
   - Added `Visite` to pills for visit objective in:
     - `ProvincesEstimator`
     - `ProvincesCompare`

5. Ran GREEN:
   - `npx vitest run src/features/market.test.ts`
   - Result: pass

## Files changed

- `src/features/market.test.ts`
- `src/features/market.tsx`

## Verification

Required suite executed:

```bash
npx vitest run src/data/canada-live.test.ts src/features/market.test.ts src/features/immigration.test.ts src/features/pitch.test.ts src/lib/visit-cost.test.ts
```

Observed result:

- `src/data/canada-live.test.ts`: passed
- `src/features/market.test.ts`: passed
- `src/features/immigration.test.ts`: passed
- `src/lib/visit-cost.test.ts`: passed
- Exit code: `0`

Note: `src/features/pitch.test.ts` does not exist in the current tree, so Vitest completed successfully with 4 executed test files.

Lints checked on edited files:

- `src/features/market.tsx`: no diagnostics
- `src/features/market.test.ts`: no diagnostics

## Self-review

- Kept the existing visit overlay implementation unchanged, per instruction.
- Did not touch Pitch files.
- Did not alter Travail, Affaires, or Regroupement overlays/decks.
- Added only the missing visit pills requested by the brief resolution.
- Preserved existing visit copy, including the provinces lead about a month on site rather than installation.

## Concerns

- The requested command references `src/features/pitch.test.ts`, but that file is absent in the current repository state.
- The full required suite had no leftover other-objective failures in the files that actually ran.
