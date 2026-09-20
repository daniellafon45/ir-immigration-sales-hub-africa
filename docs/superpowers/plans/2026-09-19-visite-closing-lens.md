# Plan: Cohérence Visite dans le deck (hors Pitch)

> Spec: `docs/superpowers/specs/2026-09-19-visite-closing-lens.md`

## Global Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- Pitch untouched: do not edit `src/data/pitch.ts` or `src/features/pitch.tsx`
- English identifiers. French UI apostrophe U+2019
- Reuse the Études contract: profile fields + helper + Voies cards + menu except Pitch + `s.draft`
- Do not implement Travail / Regroupement / Affaires / Études / RP closing decks
- Do not invent IRCC refusal rates, invitation letters, or a ties simulator
- Do not change Voies `slideCount` (stays 2) or any other slide counts
- Do not touch layout-responsive files (`src/index.css`, `src/App.tsx`, `src/components/layout/Stage.tsx`, `src/components/layout/SideNav.tsx`)

## Already shipped (do not redo)

- Profile fields `visitPurpose` / `visitDuration` + `VisitFields` on Candidat
- `visit-purposes.ts`, `visit-fees.ts`, `visit-funds.ts`, `visit-cost.ts` + tests
- `VisitClosingCards` shell (three cards + accompanying gated on `cost.accompanying`)
- Menu recadrage in `market.tsx` (WorkBenefits hidden, jobs/salaries copy, budget visit cards, provinces lead)
- `closingDeckPills` + Échecs / Écosystème pills
- `householdSalaries` visit files stay `track: "market"` with no `openWork`

## Remaining gaps this plan still owns

- Spec file (Task 1)
- Voies fees grid: per-person | foyer columns; accompanying names + extra fees (Task 4)
- Canada Live visit overlay; Comparateur motif pill; Jobs/Salaries « Pas un droit de travailler » pill (Task 5)
- Tests + browser (Task 6)

---

### Task 1: Write the spec

**Files:**
- Create: `docs/superpowers/specs/2026-09-19-visite-closing-lens.md`

Transcribe the validated design. No code.

---

### Task 2: Motif + durée on the Candidat

Already shipped. Verify only if a gap appears:

- `visitPurpose` / `visitDuration` on `Profile`
- Shown only if `objective === "Visite"`, on Candidat via `VisitFields`
- No profession prefill
- `normalizeProfile` in `src/lib/storage.ts`

---

### Task 3: Helper séjour + accompagnants

Already shipped. Verify only if a gap appears:

- `visitCost` in `src/lib/visit-cost.ts`
- Duration factors 0.5 / 1 / 3 / 6, empty → 1m aperçu
- Empty purpose → tourism aperçu
- `canWork: false`, no salary fields
- `accompanying` undefined if Seul(e) without children

---

### Task 4: Grille Voies (frais + séjour + motif + accompagnants)

**Files:**
- Modify: `src/features/immigration.tsx` (`VisitClosingCards` only)
- Modify: `src/features/immigration.test.ts` (visit assertions only)

The three cards already exist. Finish the **grid contract**:

**Frais de voyage · Visa / eTA / biométrie**
- Rows: Visa visiteur | eTA | Biométrie
- Columns: par personne | foyer du dossier
- Country pill; short eTA vs visa mention (`eTA possible selon le passeport` when `etaLikelyCountries`, else visa)
- Use `visitFeesFor` + existing `visitorVisa` / `eta` / `biometricsSolo` constants — do not invent fees

**Séjour · Foyer** — already has durée / coût / fonds / frais / aller-retour / écart. Keep. Aperçu label when `assumedDuration`.

**Motif et attaches** — already has chosen motif vs 3 bullets, ties, family invitation, no-work reminder. Keep.

**Accompagnants** (only if `cost.accompanying`)
- Who travels (spouse and/or children names)
- Visitor status for each
- Additional fees (foyer total minus solo total)
- Explicit: pas de permis de travail, pas d’école sans permis d’études
- Seul(e) without children: card absent (`cost.accompanying` undefined)

Do not change `slideCount`. Do not edit Pitch. Do not rewrite Work/Business/Family/Study cards.

TDD: extend the existing visit source test in `immigration.test.ts` so it `toContain` `par personne`, `foyer`, `Frais additionnels`. RED then GREEN: `npx vitest run src/features/immigration.test.ts src/lib/visit-cost.test.ts`

---

### Task 5: Menu overlay (Canada Live + leftover pills) — Pitch intact

**Files:**
- Modify: `src/data/canada-live.ts` (`canadaLivePagesFor` + new `visitOverlays`)
- Modify: `src/features/immigration.tsx` (Comparateur pills only — add `closingDeckPills`)
- Modify: `src/features/market.tsx` only if Jobs/Salaries lack a pill `Pas un droit de travailler`, or Provinces lack a Visite pill
- Tests already in `src/data/canada-live.test.ts` (visit case) and `src/features/market.test.ts`

`canadaLivePagesFor` currently returns the RP array for every objective except Études. Extend it for **Visite only**:

- Keep 4 pages (`vue`, `demographie`, `emploi`, `pont`)
- `vue`: visas / eTA / délais visite (order of magnitude, not a promise)
- `emploi`: lead must contain `pas un droit de travailler`
- `pont`: include selected purpose name via `visitPurposeById` (test expects `Voyage d’affaires` when `visitPurpose === "business"`)
- No `—` or `–` in JSON of overlaid pages
- RP (`defaultProfile`) must still return the **same array identity** as `canadaLivePages`
- Do **not** add Travail / Affaires / Regroupement overlays in this task (those tests in the same file belong to another plan)

Also:
- Comparateur (`CompareSection` / scenarios): pastille motif if chosen (`closingDeckPills`)
- Emplois / Salaires: keep both slides; add pill `Pas un droit de travailler` if missing
- Provinces: pastille Visite (objective or equivalent) if missing; lead already says `ce que coûte un mois sur place, pas une installation`
- Do not show `WorkBenefitsSection` for Visite (already gated)
- Do not activate `accompanying` / `openWork` on visit files
- Do not edit Pitch

TDD: the visit test in `canada-live.test.ts` already exists and should fail first. RED then GREEN:

```
npx vitest run src/data/canada-live.test.ts src/features/market.test.ts src/features/immigration.test.ts src/features/pitch.test.ts
```

If `market.test.ts` or `canada-live.test.ts` still fail on Travail / Affaires / Regroupement assertions, do not implement those decks to silence them.

---

### Task 6: Tests and browser verification

**Files:** tests only if a gap remains; no Pitch edits.

Confirm:
- Unit: `visitCost` solo 1 month vs couple + child 3 months (fees and funds rise; no salary field)
- Source: accompanying card absent for Seul(e), present for Couple; `WorkBenefitsSection` absent when objective Visite; Jobs / Salaries titles contain `pas un droit de travailler`
- Existing Pitch tests unchanged in behavior

Browser (dev server `npm run dev`):
1. Profil Seul(e) + objectif Visite → Voies détail: 3 cards, no Accompagnants; Opportunités sans RAMQ/AE; Emplois/Salaires recadrés
2. Profil Couple + enfant + Visite + motif choisi (ex. Visite familiale) → 4e carte Accompagnants; motif sur Comparateur; Canada Live overlay visite

Write results in the task report.
