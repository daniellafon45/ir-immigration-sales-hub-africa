# Whole-branch review package — Closing lenses (Travail / Visite / Affaires / Regroupement)

No project git. In-place workspace:
`c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`

Pitch is off-limits and must remain unchanged (`src/data/pitch.ts`, `src/features/pitch.tsx`). RP objective is out of this pass except as default Canada Live identity.

## Goal

Helpers + IRCC-sourced catalogs so each non-RP objective (Travail, Visite, Affaires, Regroupement familial) can close with FEER / fonds / capital / MNI numbers, plus Profil fields, Voies cards, and menu overlays. Études was already shipped.

## Task reviews already approved

See `docs/superpowers/sdd/progress-closing-lenses.md`. Tasks 1–6 task-gated.

## Deferred minors (triage which must be fixed before merge)

- Task 5: Affaires startup test looks for `path.id !== "startup"` comment-string; `NocSearchField` has no interaction test
- Task 6: ecosystem pills test originally did not lock `not.toContain("market.province")` (UI is already fixed)

## Key files to inspect (read these; do not git)

Data: `src/data/noc-2021.ts`, `profession-noc.ts`, `work-permits.ts`, `work-fees.ts`, `ircc-work-rules.ts`, `visit-purposes.ts`, `visit-fees.ts`, `visit-funds.ts`, `business-paths.ts`, `business-thresholds.ts`, `family-links.ts`, `family-lico.ts`, `family-fees.ts`, `canada-live.ts`

Libs: `src/lib/noc-search.ts`, `work-pathways.ts`, `work-cost.ts`, `visit-cost.ts`, `business-cost.ts`, `family-cost.ts`, `closing-pills.ts`, `failure-press.ts`, `household-salaries.ts`

UI: `src/features/noc-search-field.tsx`, `profile.tsx`, `immigration.tsx`, `market.tsx`, `sales.tsx`

## Constraints

- No invented IRCC numbers in UI
- Empty familyLink does not simulate spouse
- IEC treated as open for +100$ / renewal
- Visite `canWork: false`; hide WorkBenefits
- `canadaLivePagesFor(defaultProfile)` identity === `canadaLivePages`
- Voies slideCount 2
- French U+2019 in new UI strings

Write the review to `docs/superpowers/sdd/review-branch-closing-lenses.md`.
