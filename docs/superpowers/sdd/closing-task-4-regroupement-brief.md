# Task 4 brief — Regroupement data (lien, MNI, frais, foyer réuni)

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-closing-lenses.md`
**Design:** `c:\Users\Admin\.cursor\plans\regroupement_closing_deck_5a2d8e70.plan.md`

## Where this fits

Data layer for **Regroupement familial**. **Applicant = sponsor in Canada.** Sponsored person is spouse / child / parent.

## Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- NEW files only under `src/data/` and `src/lib/` + tests
- Do NOT edit profile.ts, storage.ts, UI, pitch
- Profile already has `familyLink` (`spouse` | `child` | `parent` | `""`) and `sponsorStatus` (`pr` | `citizen` | `""`)
- Use `irccTimeFor("family")` from `src/data/ircc-times.ts` for delay copy
- French apostrophe U+2019

## TDD

RED then GREEN: `npx vitest run src/lib/family-cost.test.ts src/data/family-lico.test.ts`

## Files to create

### `src/data/family-links.ts`

| id | undertakingYears (ROC demo) | sponsoredCanWorkAfterLanding | superVisaAlt |
|---|---|---|---|
| spouse | 3 | true | false |
| child | 10 | false | false |
| parent | 20 | false | true |

French `name` for each.

### `src/data/family-lico.ts`

Demo MNI / engagement by household size 1–7+:

- `rocMni: number[]` (index = size-1)
- `quebecEngagement: number[]` (distinct, typically higher)
- parent multiplier `1.3` (LICO+30% style)

`requiredIncome(province, familySize, link): number` — if Québec (province name or code QC) use quebec grid; if parent multiply.

Size helper: adults already in household (`householdMarket` or familyHasSpouse + extras) + kids + sponsored extras:
- spouse link adds +1 if not already counted as spouse on file… Keep it simple: `sizeFor(profile)` = current adults + kids + (1 if parent link) ; spouse/child already in family options so do not double-count. Parent always +1.

### `src/data/family-fees.ts`

Demo: sponsorship 85, principal processing 545, rprf 575, biometrics 85, child extra 155. Québec MIFI add-on 300 if QC.

`familyFeesFor(profile): { total, breakdown }`

### `src/lib/family-cost.ts`

```ts
familyCost(profile: Profile): {
  link, sponsorStatus,
  undertakingYears,
  familySize,
  incomeRequired,
  sponsorMid, // salaryForProfession(applicant.profession, province)[1]
  incomeGap, // incomeRequired - sponsorMid
  feesTotal,
  livingReunitedAnnual, // livingBasket; for parent, pass a profile copy with +1 adult via extra calculation: monthly * (1 + 0.35) if parent else basket*12
  delay, // irccTimeFor("family")
  sponsored?: { profession, low, mid, high, employability, employabilityLabel } // only if link==="spouse" && familyHasSpouse
  superVisa: boolean
  reminder: boolean // true if link==="spouse" && !familyHasSpouse
}
```

Do not invent a parent salary.

## Tests

- couple + familyLink spouse: sponsored profession is spouse’s, reminder false, CEC-style salary present
- solo + parent: reminder false, superVisa true, no sponsored salary, incomeRequired uses 1.3 multiplier vs a child/spouse same size
- `highlightedFailureIds` is NOT this task — do not edit failure-press.ts

## Report

Write `docs/superpowers/sdd/closing-task-4-regroupement-report.md`

Return under 15 lines: Status, commits none, test summary, concerns, report path.
