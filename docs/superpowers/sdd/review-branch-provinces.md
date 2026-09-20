# Review — Branch Provinces

## Verdict

- Ready to merge: Yes (no git)
- Spec: ✅
- Critical: 0
- Important: 0 (province hors dataset fixed via `defaultProvinceCode`; re-review approved)
- Minor: 2 (unused Hero; source-string tests)

## Findings

### Important

1. `src/features/market.tsx`

`ProvincesEstimator` can initialize into an inconsistent state whenever the profile province has no demo city in `livingCities` (for example `Saskatchewan`, `Nouvelle-Écosse`, `Île-du-Prince-Édouard`, `Yukon`, etc.).

- `code` is initialized from `provinceCode(profile.province)`.
- The province dropdown options are then filtered down to provinces that have demo cities only.
- For a non-demo province, `citiesForProvince(code)` returns `[]`, so the city dropdown renders no options.
- At the same time, `selectedId` and `livingBasket(profile, selectedId)` fall back to `montreal`, so the UI can still show a Montréal basket while the province state started on a different province.

That breaks province/city consistency and misses the intended flow of "Ville initiale = première ville de la province du profil". This is a real product edge case because the profile flow still allows provinces outside the 6-city demo set.

### Minor

1. `src/features/market.tsx`

`Hero` is still unused after the Provinces rewrite. This was already carried in the ledger and remains true in the final branch, so it should stay triaged as branch cleanup.

2. `src/features/market.test.ts`

The provinces coverage is still mainly source-string inspection via `readFileSync(...market.tsx)` and `toContain(...)`, not rendered behavior. The branch therefore does not automatically protect the two explicit product constraints that were only validated in browser evidence:

- max 3 compared cities
- hide childcare row/column when `kids.length === 0`

Per the ledger, I am keeping this item triaged as a minor rather than upgrading it without contradicting the verified browser evidence.

## Verified Positives

- `src/catalog.ts` keeps `provinces.slideCount` at `2`.
- `src/data/cost-of-living.ts` matches the 12-city / 6-province demo dataset from the plan.
- `src/lib/living-basket.ts` matches the requested basket formulas for housing, grocery, transport, utilities, childcare, total, net monthly, and capped remainder.
- `src/features/market.tsx` respects the requested reuse of `OpportunitiesShell`, `Surface`, `SectionLabel`, and `Select`.
- No `panel=` is used in the Provinces flows.
- No profile store setter is introduced for city or compare selection; both remain local `useState`.
- The forbidden copy called out in the global constraints is not present in the Provinces helpers.
- The browser evidence provided for the default Québec scenarios is consistent with the code and should be treated as verified.

## Notes

- I did not rerun tests, per instruction.
- I did not edit product code, per instruction.

## Summary

Ready. The unsupported-province edge is fixed with `defaultProvinceCode` (Saskatchewan → QC / Montréal, city select filled). Remaining minors: unused `Hero`, source-string tests.
