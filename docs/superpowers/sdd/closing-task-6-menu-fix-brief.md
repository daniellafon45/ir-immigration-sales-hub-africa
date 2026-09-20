# Task 6 fix brief — Ecosystem pills

One Important finding. Do only this. Do not address the Minor (test composition) except as needed to lock the fix.

## Bug

`src/features/sales.tsx` `EcosystemSection` pills currently include `market.province`.

Brief: pills = foyer / objective / `studyDeckPills` / `closingDeckPills`. No province pill. No extra pillars.

Keep `market.family`, `profile.objective`, study + closing pills. Remove `market.province` from **EcosystemSection only**. `FailuresRisks` may keep province.

## Tests (TDD)

Edit `src/features/sales.test.ts` first (`keeps ecosystem pills limited to foyer, objective and closing lenses`):

```ts
const chunk = extractFunction("EcosystemSection");
expect(chunk).toContain("market.family");
expect(chunk).toContain("profile.objective");
expect(chunk).toContain("studyDeckPills(profile)");
expect(chunk).toContain("closingDeckPills(profile)");
expect(chunk).not.toContain("market.province");
```

Watch RED, then remove the province pill.

RED/GREEN: `npx vitest run src/features/sales.test.ts`

## Constraints

- No git / no commits
- Do not touch pitch, market.tsx, canada-live, Voies cards
- Append results to `docs/superpowers/sdd/closing-task-6-menu-report.md`
