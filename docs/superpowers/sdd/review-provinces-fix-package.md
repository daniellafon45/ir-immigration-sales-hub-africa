# Review package — fix defaultProvinceCode

Read:

- docs/superpowers/sdd/provinces-fix-province-brief.md
- src/lib/living-basket.ts
- src/lib/living-basket.test.ts
- src/features/market.tsx (ProvincesEstimator init only)
- src/features/market.test.ts (defaultProvinceCode assertion)
- docs/superpowers/sdd/provinces-task-2-report.md (Fix section)

Do not re-run tests. Implementer: 32 passed on living-basket + market.

Global constraint: estimator must not start with empty city select when profile province has no demo cities. defaultProvinceCode(Saskatchewan) === QC. ProvincesEstimator useState uses defaultProvinceCode.

Write review to docs/superpowers/sdd/review-provinces-fix.md
