# Review package: Task 3 Affaires data

No project git — snapshot of added files.

## Commits

none

## Files changed

- src/data/business-paths.ts (added)
- src/data/business-thresholds.ts (added)
- src/data/business-paths.test.ts (added)
- src/lib/business-cost.ts (added)
- src/lib/business-cost.test.ts (added)

## Diff summary

business-paths: 4 ids visitor/c11/ict/pnp-entrepreneur with needsInvestment, spouseOpenEligible, workAllowed, caution (U+2019). startupVisaPaused true, retrievedAt 2026-09-19, note no new Start-up Visa applications.

business-thresholds: 13 codes. QC C11 100000, PNP 200000. Other provinces filled as demo (ON 150k/250k, BC 150k/300k, etc.). Label "Données de démonstration".

businessCost: path from businessPathById; investment 0 unless needsInvestment; livingAnnual = basket*12 if workAllowed else 0; stayShort = basket.total if visitor else 0; personalFunds financialCapacityAmount; capitalToShow = investment + (livingAnnual || stayShort); gap = capitalToShow - personalFunds; spouseOpen = hasSpouse && path.spouseOpenEligible; startupPaused true.

Tests: 4 paths + paused flag; 13 keys; visitor couple investment 0 spouseOpen false; pnp-entrepreneur QC 200000, Bonne 48000, spouseOpen true.
