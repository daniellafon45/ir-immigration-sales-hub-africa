# Task 5 fix brief — Work default permit + family delays

Two Important review findings. Do only these. Do not address Minors (startup comment test, NocSearchField interaction test).

## 1. Neutral permit card when `workPermitKind` is empty

`src/features/immigration.tsx` `WorkClosingCards` around lines 353–419.

Current:
```
const selectedPermit = workPermitById(profile.workPermitKind);
...
{(pathways.permits.find((item) => item.kind === (selectedPermit?.id ?? "")) ?? pathways.permits[0])?.reason}
```

Also `Offre requise` uses `selectedPermit?.needsOffer ? ... : "Non"` — empty kind currently shows **Non**, which is also a false default.

Required:
- Do **not** fall back to `pathways.permits[0]` (LMIA).
- If no `selectedPermit`: reason line must be a neutral prompt, e.g. `Choisissez un type de permis` (apostrophe U+2019 if you write d’…). Offre requise must not say Non; use `Selon le volet` or `—`.
- If a kind is selected: keep current reason for that kind and current offre/fees behavior.

## 2. Family delays from helper only

`FamilyClosingCards` around lines 711–712:

```
{cost.delay.tracks?.[0]?.value ?? "14-20 mois"}
{cost.delay.tracks?.[1]?.value ?? "environ 36 mois"}
```

Required:
- Remove those two string literals from `immigration.tsx` entirely.
- Read Hors Québec / Québec from `cost.delay.tracks` **by label** (`"Hors Québec"`, `"Québec"`), not by index fallback to invented numbers.
- If a track is missing, render empty or `cost.delay.headline` — never a hardcoded `14-20 mois` / `environ 36 mois` in this file.

`cost.delay` already comes from `irccTimeFor("family")` in `familyCost`. Do not duplicate numbers in the UI. Do not edit `ircc-times.ts` unless you must (you should not).

## Tests (TDD)

Edit `src/features/immigration.test.ts` first, watch RED, then fix UI.

In the work-cards test:
- `expect(source).not.toContain("?? pathways.permits[0]")`
- assert the neutral prompt string you will use is present
- assert `Choisissez un type de permis` (or your chosen exact copy) exists

In the family-cards test:
- `expect(source).not.toContain('"14-20 mois"')`
- `expect(source).not.toContain('"environ 36 mois"')`
- `expect(source).toContain('cost.delay.tracks')` and label `"Hors Québec"` / `"Québec"` used to pick values

RED/GREEN: `npx vitest run src/features/immigration.test.ts`

## Constraints

- No git / no commits
- Do not touch pitch, market.tsx, canada-live, profile.tsx, data helpers unless strictly required (should not be)
- Append results to `docs/superpowers/sdd/closing-task-5-profile-voies-report.md`
