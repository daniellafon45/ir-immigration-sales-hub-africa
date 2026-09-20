# Review package: whole branch Opportunités chrome (no git)

**Merge base:** none (no project git)
**Head:** working tree

## Scope of this branch

Restyle Opportunités to Profil/Canada Live chrome and show household market (couple, children, polygamy).

## Files changed

```
A src/lib/household-market.ts
A src/lib/household-market.test.ts
M src/features/market.tsx
A src/features/market.test.ts
A docs/superpowers/specs/2026-09-18-opportunites-profil-design.md
A docs/superpowers/plans/2026-09-18-opportunites-profil-chrome.md
```

## Minors already recorded

- Task 1: optional chaining on `analysis.accompanying?.role` after a truthy check
- Task 2: source-string tests are brittle; ranked sort not memoized; BrandLogo duplicated in header+panel
- Full suite: pre-existing failures in canada-live-media.test.ts and pitch.test.ts (out of scope)

## Diff view (no git)

Read these production/test files:

1. `src/lib/household-market.ts`
2. `src/lib/household-market.test.ts`
3. `src/features/market.tsx` lines 1–414 (Opportunities block; JobsSection starts at 410 and should be unchanged)
4. `src/features/market.test.ts`

Spec: `docs/superpowers/specs/2026-09-18-opportunites-profil-design.md`
Plan constraints: Global Constraints in `docs/superpowers/plans/2026-09-18-opportunites-profil-chrome.md`
