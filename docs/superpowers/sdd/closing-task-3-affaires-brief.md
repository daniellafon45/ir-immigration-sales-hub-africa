# Task 3 brief — Affaires data (volets, seuils, capital)

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-closing-lenses.md`
**Design:** `c:\Users\Admin\.cursor\plans\affaires_closing_deck_b91e04c3.plan.md`

## Where this fits

Data layer for objective **Affaires**. Start-up Visa is **paused** — not a selectable path. Mention it only as a constant flag.

## Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- NEW files only under `src/data/` and `src/lib/` + tests
- Do NOT edit profile.ts, storage.ts, UI files, pitch
- Profile already has `businessPath`: `"" | "visitor" | "c11" | "ict" | "pnp-entrepreneur"`
- Use `financialCapacityAmount(profile.applicant.salary)` for personal funds
- French apostrophe U+2019

## TDD

RED then GREEN: `npx vitest run src/lib/business-cost.test.ts src/data/business-paths.test.ts`

## Files to create

### `src/data/business-paths.ts`

4 paths:

| id | needsInvestment | spouseOpenEligible | workAllowed | caution (short French) |
|---|---|---|---|---|
| visitor | false | false | false | visiteur d’affaires, pas d’exploitation quotidienne |
| c11 | true | true | true | avantage notable à démontrer |
| ict | false | true | true | mutation, pas un seuil d’investissement |
| pnp-entrepreneur | true | true | true | volets provinciaux variables |

`startupVisaPaused = true` with IRCC note that new Start-up Visa applications are not accepted (from ircc-times / IRCC business page). `retrievedAt: "2026-09-19"`.

### `src/data/business-thresholds.ts`

Demo minima **for all 13 province codes** used in `study-tuition.ts` / `provinceData` (`QC ON AB MB NB BC SK NS PE NL YT NT NU`):

- `c11WorkingCapital: Record<code, number>`
- `pnpEntrepreneur: Record<code, number>`

QC example demo: C11 100000, PNP 200000. Keep all 13 keys. Label as demonstration.

### `src/lib/business-cost.ts`

`businessCost(profile)`:

- `path` from catalog or undefined if empty
- `investment` = threshold for province if path needsInvestment, else 0
- `livingAnnual` = basket × 12 if workAllowed, else `stayShort` = basket.total (one month) for visitor
- `personalFunds` = financialCapacityAmount(applicant.salary)
- `capitalToShow` = investment + (livingAnnual or stayShort)
- `gap` = capitalToShow − personalFunds
- `spouseOpen` if familyHasSpouse && path.spouseOpenEligible
- `startupPaused: true`

Visitor: no investment threshold.

## Tests

- visitor: investment 0, spouseOpen false even if couple
- pnp-entrepreneur Québec: investment 200000, livingAnnual > 0, gap vs Bonne capacity
- all 13 codes present in both threshold maps
- 4 paths, startupVisaPaused true

## Report

Write `docs/superpowers/sdd/closing-task-3-affaires-report.md`

Return under 15 lines: Status, commits none, test summary, concerns, report path.
