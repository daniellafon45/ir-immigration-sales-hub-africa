# Review package — Provinces coût de vie (whole branch)

No git. Files to read:

- docs/superpowers/specs/2026-09-18-provinces-cout-de-vie.md
- docs/superpowers/plans/2026-09-18-provinces-cout-de-vie.md (Global Constraints + Tasks 1–2)
- src/data/cost-of-living.ts
- src/lib/living-basket.ts
- src/lib/living-basket.test.ts
- src/features/market.tsx (ProvincesSection, ProvincesEstimator, ProvincesCompare only)
- src/features/market.test.ts (provinces-related tests)
- docs/superpowers/sdd/progress-provinces.md
- docs/superpowers/sdd/review-provinces-task-1.md
- docs/superpowers/sdd/review-provinces-task-2.md

Do not re-run tests. Implementer evidence: 34/34 vitest (`market.test.ts` 26, `living-basket.test.ts` 5, `household-living.test.ts` 3).
