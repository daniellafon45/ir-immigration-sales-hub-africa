# Task 2 brief — Visite data (motif, durée, frais, séjour, fonds)

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-closing-lenses.md`
**Design:** `c:\Users\Admin\.cursor\plans\visite_closing_deck_3f8b2d16.plan.md`

## Where this fits

Data layer for objective **Visite**. No right to work. Stay cost is duration × living basket, **not** annualized as the default.

## Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- NEW files only: `src/data/` + `src/lib/` + tests
- Do NOT edit profile.ts, storage.ts, immigration.tsx, market.tsx, canada-live.ts, household-salaries.ts, profile.tsx, pitch
- Profile already has `visitPurpose` (`family` | `tourism` | `business` | `""`) and `visitDuration` (`15d` | `1m` | `3m` | `6m` | `""`)
- French apostrophe U+2019

## TDD

RED then GREEN: `npx vitest run src/lib/visit-cost.test.ts src/data/visit-fees.test.ts`

## Files to create

### `src/data/visit-purposes.ts`

3 purposes: `family`, `tourism`, `business` with `id`, `name`, `ties: string[]` (short French attachés), `hostUseful: boolean` (true only for family).

### `src/data/visit-fees.ts`

Demo IRCC-order-of-magnitude sourced 2026-09-19:
- `visitorVisa = 100`
- `eta = 7`
- `biometricsSolo = 85`
- `biometricsFamilyCap = 170`
- `sourceUrl` pointing to IRCC visitor/fees page on canada.ca
- `etaLikelyCountries`: include `"France"`, `"Allemagne"`, `"Japon"` (demo allow-list). Bénin is NOT on it.

`visitFeesFor(country: string, people: number)` → visa or eTA per person + biometrics capped.

### `src/data/visit-funds.ts`

Recommended funds by duration × household size (demo grid, labelled as such). Distinct from living basket.

`visitFundsFor(duration, adults, kids): number`

### `src/lib/visit-cost.ts`

Duration months factor: `15d` → 0.5, `1m` → 1, `3m` → 3, `6m` → 6. Empty duration → treat as `1m` but `assumedDuration: true`.

Empty purpose → tourism assumed, `assumedPurpose: true`.

```ts
visitCost(profile: Profile): {
  purpose, duration, assumedPurpose, assumedDuration,
  stayCost, // basket.total * factor
  fundsRequired,
  feesTotal,
  ticketsDemo, // fixed 2400 * adults + 1200 * kids (demo airfare)
  gap, // fundsRequired - stayCost
  accompanying: { adults: number; kids: number } | undefined // undefined if solo no kids
  canWork: false
}
```

Use `livingBasket` + `defaultCityId`. `familyHasSpouse` / `familyHasChildren`.

**No salary fields.**

## Tests

- solo 1 month: accompanying undefined, canWork false, stayCost = monthly basket
- couple + 1 child, 3 months: stayCost ≈ 3× basket, fees and funds higher than solo 1m
- Bénin → visa fee path not eTA; France → eTA

## Report

Write `docs/superpowers/sdd/closing-task-2-visite-report.md`

Return under 15 lines: Status, commits none, test summary, concerns, report path.
