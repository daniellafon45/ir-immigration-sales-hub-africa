# Review — provinces defaultProvinceCode fix

## Verdict

- **Spec**: ✅
- **Task quality**: Approved
- **Issues**: Critical 0, Important 0, Minor 0

## Summary

- `defaultProvinceCode(profile)` in `living-basket.ts` matches the brief exactly: it returns the profile province code when it has demo cities, otherwise falls back to the province of `defaultCityId(profile)` (Montréal → `QC`), ensuring `defaultProvinceCode("Saskatchewan") === "QC"`.
- `ProvincesEstimator` initializes its province state from `defaultProvinceCode(profile)`, so the estimator never starts with an empty city `<Select>` even when the profile province has no demo cities; the city list and selected city stay consistent.
- Tests were added in `living-basket.test.ts` for the new helper and in `market.test.ts` (source-string assertion), and the TDD story in `provinces-task-2-report.md` documents RED → GREEN, with no violations of the constraints (no changes to Opportunities/Jobs/Salaries/Calculators behavior, no new profile store setters, `Hero` preserved, and test style kept as source-string checks).

