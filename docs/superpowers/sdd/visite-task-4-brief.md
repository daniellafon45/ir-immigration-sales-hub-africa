# Task 4 brief — Grille Voies visite (frais par personne / foyer + accompagnants)

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-visite-closing-lens.md`
**Spec:** `docs/superpowers/specs/2026-09-19-visite-closing-lens.md`

## Where this fits

Data helper `visitCost` and a `VisitClosingCards` shell already ship. This task finishes the **Visa visiteur** detail grid so a closer can read per-person vs household fees, and see accompanying travellers without selling a right to work.

## Constraints

- Project folder: `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`
- No git. No commits. Do not touch `C:/Users/Admin/.git`
- English identifiers. French UI apostrophe U+2019
- Edit **only** `VisitClosingCards` in `src/features/immigration.tsx` and visit assertions in `src/features/immigration.test.ts`
- Do not edit Pitch, profile fields, visit-cost data files, Work/Business/Family/Study cards, layout files, or `market.tsx`
- Do not change `slideCount`
- Use existing `visitFeesFor`, `visitorVisa`, `eta`, `biometricsSolo`, `etaLikelyCountries`

## TDD

Follow superpowers:test-driven-development. RED then GREEN.

```
npx vitest run src/features/immigration.test.ts src/lib/visit-cost.test.ts
```

Extend the existing test `embeds visit closing cards with no-work copy and accompanying gating` so it also contains:

- `par personne`
- `foyer` (as a column header, e.g. `Foyer` or `foyer du dossier`)
- `Frais additionnels`

Keep existing assertions (`VisitClosingCards`, `visitCost`, `cost.accompanying`, no-work copy).

## Implementation

In `VisitClosingCards`:

1. **Frais** card: a 3-row × 2-column grid
   - Rows: `Visa visiteur` | `eTA` | `Biométrie`
   - Columns: `Par personne` | `Foyer`
   - Inactive document type shows `Non` on both columns
   - Biometrics per person = `biometricsSolo`; foyer = `fees.biometricsTotal` (cap already in helper)
   - Pill: `{country}` plus `eTA possible selon le passeport` when `fees.documentType === "eta"`, else a short visa mention

2. Keep **Séjour · Foyer** and **Motif et attaches** as they are (including aperçu and family invitation).

3. **Accompagnants** (already gated on `cost.accompanying`):
   - Who travels: spouse first name if present, each child first name (fallback `Enfant`)
   - Statut visiteur for each
   - `Frais additionnels` = `visitFeesFor(country, people).total - visitFeesFor(country, 1).total` displayed with `money(...)`
   - Keep: `Pas de permis de travail, pas d’école sans permis d’études.`

Seul(e) without children: `cost.accompanying` is undefined — card stays absent.

## Report

Write the full report to `docs/superpowers/sdd/visite-task-4-report.md` (TDD RED/GREEN evidence, files changed, concerns).

Then return ONLY:
- Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- Commits: SKIPPED_COMMIT (no project git)
- One-line test summary
- Concerns, if any
- Report file path
