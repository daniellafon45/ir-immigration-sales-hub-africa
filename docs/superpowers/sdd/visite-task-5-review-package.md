# Review package: Task 5 Visite menu leftover pills

No project git. Implementer kept already-landed Canada Live visitOverlays. This task's own diff is pills only.

## Commits

SKIPPED_COMMIT

## Files changed by this task

- src/features/market.tsx
- src/features/market.test.ts

## Production hunks

JobsToday ~654-657: `visitPills = visit ? ["Pas un droit de travailler"] : []` spread into pills.

JobsIntl ~712: same visitPills.

SalariesBands ~942: same.

SalariesNet ~995-998: same.

ProvincesEstimator ~1367: `...(profile.objective === "Visite" ? ["Visite"] : [])`

ProvincesCompare ~1467: same.

## Tests

market.test.ts:
- JobsToday / JobsIntl contain `"Pas un droit de travailler"`
- SalariesBands / SalariesNet contain `"Pas un droit de travailler"`
- ProvincesEstimator contains `"Visite"`

## Pre-existing (not this task's diff; controller should verify)

- src/data/canada-live.ts `visitOverlays` + `canadaLivePagesFor` Visite branch
- Comparateur already uses closingDeckPills
- WorkBenefitsSection already gated off for Visite

## Test evidence

RED: 3 failing market tests on new pill assertions
GREEN: market.test.ts pass; canada-live.test.ts pass including visit overlay test; immigration.test.ts pass; visit-cost.test.ts pass
pitch.test.ts path in original brief does not exist (actual: src/data/pitch.test.ts, src/features/pitch-deck.test.ts)
