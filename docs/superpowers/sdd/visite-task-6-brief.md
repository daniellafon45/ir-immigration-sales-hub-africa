# Task 6 brief — Tests et vérification navigateur Visite

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-visite-closing-lens.md`
**Spec:** `docs/superpowers/specs/2026-09-19-visite-closing-lens.md`

## Where this fits

Last task of the Visite closing lens. Tasks 1–5 shipped spec, fields, helper, Voies grid, and Canada Live / leftover pills. You verify; you only edit tests if a required assertion is missing. No Pitch edits. No new features.

## Constraints

- Project folder: `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`
- No git. No commits. Do not touch `C:/Users/Admin/.git`
- Do not edit `src/data/pitch.ts` or `src/features/pitch.tsx`
- Do not implement Travail / Affaires / Regroupement to silence their tests
- If a required Visite assertion is missing, add it (TDD) then keep GREEN

## Tests to run and keep green

```
npx vitest run src/lib/visit-cost.test.ts src/data/visit-fees.test.ts src/features/immigration.test.ts src/features/profile.test.ts src/features/market.test.ts src/data/canada-live.test.ts src/lib/household-salaries.test.ts src/features/pitch.test.ts src/lib/storage.test.ts
```

Required behaviours:

1. Unit `visitCost`: solo 1 month vs couple + child 3 months — fees and funds rise; `canWork === false`; no salary field on the object
2. Source: accompanying card gated on `cost.accompanying` (absent Seul(e), present Couple)
3. Source: `WorkBenefitsSection` not rendered when `objective === "Visite"`
4. Source: Jobs / Salaries contain `pas un droit de travailler`
5. Pitch tests still pass with the same behaviour

Other-objective overlay failures in `canada-live.test.ts` / combined menu tests are **out of scope** — record them, do not implement those decks.

## Browser

Start or reuse `npm run dev`. Exercise as a real user:

1. **Seul(e) + Visite** (no children): Profil motif/durée; Voies détail = 3 cards, no Accompagnants; Opportunités shows the 3 status bullets, not RAMQ/AE; Emplois and Salaires recadrés; Calculateurs budget = Frais de visa / Coût du séjour / Fonds à démontrer; Canada Live visit overlay
2. **Couple + enfant + Visite + motif Visite familiale + durée 3 mois**: 4th card Accompagnants; motif pill on Comparateur; Canada Live pont includes the purpose name

If the UI is wrong, fix the smallest production gap (still no Pitch, no other-objective decks) and re-verify.

## Report

Write `docs/superpowers/sdd/visite-task-6-report.md` with commands, results, browser notes.

Then return ONLY status, SKIPPED_COMMIT, one-line test summary, concerns, report path.
