# Review package: Task 6 re-review (ecosystem pills)

No project git. Post-fix snapshot of the one Important finding.

## Commits

none

## Files changed this fix

- `src/features/sales.tsx` — `EcosystemSection` pills no longer include `market.province`
- `docs/superpowers/sdd/closing-task-6-menu-report.md` — appended; implementer reported **no RED** because `sales.test.ts` was not given the new `not.toContain("market.province")` assertion

## Current EcosystemSection pills

```
pills={[
  market.family,
  profile.objective,
  ...studyDeckPills(profile).filter((pill) => pill !== profile.objective),
  ...closingDeckPills(profile),
]}
```

`FailuresRisks` may still use `market.province`.

## Tests claimed

`npx vitest run src/features/sales.test.ts` → 14/14. Do not re-run.

If you need the function, Read `EcosystemSection` in `src/features/sales.tsx` and the ecosystem pills test in `src/features/sales.test.ts`.
