# Review package: Visite closing lens whole branch

No project git. In-place workspace.

## Scope of this pass

Make the deck (except Pitch) relevant for closing a Visite file: motif, duration, visa/eTA/biometrics fees, stay cost (not annualized), funds, ties, accompanying without selling a right to work.

## Files this pass owned or finished

Production:
- `src/features/immigration.tsx` — VisitClosingCards fees grid (par personne | foyer), etaLikelyCountries pill, accompanying names + extra fees
- `src/features/market.tsx` — visit pills `Pas un droit de travailler` on jobs/salaries; `Visite` pill on provinces

Already shipped before this pass (sibling closing-lenses) and in scope of the spec:
- profile visit fields, visit-purposes/fees/funds, visit-cost
- VisitFields, VisitClosingCards shell
- canada-live visitOverlays
- WorkBenefits gating, budget visit cards, jobs/salaries recadrage copy
- closingDeckPills

Docs:
- `docs/superpowers/specs/2026-09-19-visite-closing-lens.md`
- `docs/superpowers/plans/2026-09-19-visite-closing-lens.md`

Tests:
- immigration.test.ts visit assertions
- market.test.ts visit pills
- visit-cost.test.ts / visit-fees.test.ts / canada-live visit overlay / pitch-deck + pitch data unchanged

## Out of scope

Pitch. Full Travail/Affaires/Regroupement decks (some overlays exist from a sibling task).

## Verification

Controller: `npx vitest run` on 10 focused files → 272 passed.
Browser: Seul(e)+Visite → 3 Voies cards, no Accompagnants, Opportunités status bullets.
Couple+enfant+Visite familiale+3 mois → Accompagnants card with Marc + Enfant, motif named, stay ~13 710 $.
