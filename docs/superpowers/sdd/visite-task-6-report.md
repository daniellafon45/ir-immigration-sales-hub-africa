# Visite Task 6 Report

Date: 2026-09-19

## Scope

Task 6 verification only for the Visite closing lens.

- No production edits
- No test edits
- Pitch source untouched

## Commands run

```bash
npx vitest run src/lib/visit-cost.test.ts src/data/visit-fees.test.ts src/features/immigration.test.ts src/features/profile.test.ts src/features/market.test.ts src/data/canada-live.test.ts src/lib/household-salaries.test.ts src/data/pitch.test.ts src/features/pitch-deck.test.ts src/lib/storage.test.ts
```

Result:

- 10 test files passed
- 268 tests passed
- 0 failures

Dev server used for browser verification:

```bash
npm run dev
```

Observed port:

- `http://localhost:5176/`

Notes:

- Ports `5173`, `5174`, and `5175` were already in use
- Vite started successfully on `5176`

## Test verification summary

Confirmed green behaviors from the requested suite:

1. `visitCost` solo `1m` vs couple + child `3m`: fees and funds increase; `canWork === false`; no salary rights sold
2. Accompanying card wiring remains gated on `cost.accompanying`
3. `WorkBenefitsSection` is not rendered for objective `Visite`
4. Jobs / Salaries source and tests keep the `pas un droit de travailler` framing and pill
5. Pitch tests passed unchanged

## Browser verification notes

Browser target:

- Cursor browser against `http://localhost:5176/`

### Scenario 1

Profile used:

- Family: `Seul(e)`
- Objective: `Visite`
- Country: `Bénin`
- Purpose left visible and optional
- Duration left visible and optional

Actions performed:

1. Opened `Profil client`
2. Selected `Seul(e)`
3. Selected `Visite`
4. Opened `Voies d’immigration`
5. Selected the `Visa visiteur` card
6. Opened `Voies · Détail`
7. Opened `Opportunités`
8. Opened `Emplois`
9. Opened `Guide salarial`

Observed results:

- `Voies · Détail` showed exactly 3 visit cards before conditions/positives:
  - `Frais de voyage · Visa / eTA / biométrie`
  - `Séjour · Foyer`
  - `Motif et attaches`
- No `Accompagnants` card for solo visit
- `Opportunités` showed `Repères statut` with 3 bullets:
  - `Un visa visiteur autorise le séjour, pas un emploi.`
  - `Pas d’études sans permis d’études.`
  - `Le conjoint voyage comme visiteur, pas comme travailleur.`
- No RAMQ / AE work-benefits content visible for Visite
- `Emplois` displayed the no-work framing and the pill `Pas un droit de travailler`
- `Guide salarial` displayed the no-work framing and the pill `Pas un droit de travailler`

Additional observed note:

- `Canada Live` opened on the Visite overlay with visit-only framing: `La visite autorise le séjour. Pas l’emploi.`

### Scenario 2

Profile used:

- Family: `Couple + enfants`
- Objective: `Visite`
- Purpose: `Visite familiale`
- Duration: `3 mois`

Actions performed:

1. Returned to `Profil client`
2. Selected `Couple + enfants`
3. Selected `Visite familiale`
4. Selected `3 mois`
5. Opened `Voies d’immigration`
6. Opened `Voies · Détail`
7. Opened `Comparateur de procédures`
8. Opened `Canada Live`
9. Switched to `Page 4`

Observed results:

- `Voies · Détail` showed the `Accompagnants` card as the fourth visit card
- `Accompagnants` listed:
  - `Marc · Statut visiteur`
  - `Enfant · Statut visiteur`
- `Comparateur` header pills included `Visite familiale`
- `Canada Live · Votre projet visite` included the purpose name `Visite familiale`

## Outcome

Task 6 verification completed without code changes.
