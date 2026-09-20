# Review package: Task 5 re-review (fix only)

No project git. This package is the post-fix snapshot of the two Important findings. Treat it as the diff for this re-review.

## Commits

none (in-place, no git)

## Files changed this fix

- src/features/immigration.tsx
- src/features/immigration.test.ts
- docs/superpowers/sdd/closing-task-5-profile-voies-report.md (appended)

## Tests claimed

`npx vitest run src/features/immigration.test.ts --reporter verbose` → 16/16 passing. Do not re-run.

## WorkClosingCards permit block (current)

selectedPermit = workPermitById(profile.workPermitKind)

Offre requise:
- if selectedPermit: needsOffer ? (workHasOffer ? "Oui, cochée" : "Oui, à obtenir") : "Non"
- else: "Selon le volet"

Reason paragraph:
- if selectedPermit: pathways.permits.find(kind === selectedPermit.id)?.reason
- else: "Choisissez un type de permis"
- NO fallback to pathways.permits[0]

## FamilyClosingCards delay cells (current)

```
const horsQc = cost.delay.tracks?.find((t) => t.label === "Hors Québec")?.value ?? cost.delay.headline ?? "";
const qc = cost.delay.tracks?.find((t) => t.label === "Québec")?.value ?? cost.delay.headline ?? "";
```

No string literals `"14-20 mois"` or `"environ 36 mois"` in immigration.tsx.

## Tests added

immigration.test.ts work cards:
- not.toContain("?? pathways.permits[0]")
- toContain("Choisissez un type de permis")

immigration.test.ts family cards:
- not.toContain('"14-20 mois"')
- not.toContain('"environ 36 mois"')
- toContain("cost.delay.tracks")
- toContain("Hors Québec") / "Québec"

If you need full functions, Read `src/features/immigration.tsx` WorkClosingCards and FamilyClosingCards only.
