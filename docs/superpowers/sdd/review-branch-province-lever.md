# Review package: whole-branch linguistic qualification lever (no git)

Merge base: pre-feature working tree (salary vs local median in PrincipalPanel)
Head: working tree after Tasks 1–2

## Commits

none (git forbidden)

## Files changed

```
src/lib/province-lever.ts        created
src/lib/province-lever.test.ts   created
src/features/profile.tsx         modified
src/features/profile.test.ts     modified
```

## Minors already recorded (triage before merge)

- Task 1: Québec branch uses `province === "Québec"` literal instead of `provinceCode(province) === "QC"`.
- Task 2: two existing readability assertions were updated to match the brief's `text-[12px]` verdict classes.

## Diff summary

### Added src/lib/province-lever.ts

Pure helper `provinceLever(member, province)`:
- Québec: Exigence FR + province.french + candidate french + quebecFrenchVerdict
- Else: Langue prioritaire / Anglais / candidate english + englishVerdict
- positive only for Avancé and Bilingue

### Added src/lib/province-lever.test.ts

6 tests: QC Avancé/Débutant/Intermédiaire/Bilingue, ON Avancé, AB Débutant.

### Modified src/features/profile.tsx

PrincipalPanel:
- `const lever = provinceLever(principal, draft.province)`
- PanelBlock title still `Levier ${draft.province}`
- Rows: requirement, candidate language, verdict (semibold if positive)
- Removed salaryForProfession / money / financialCapacityAmount from this file
- PersonCard Capacité financière field unchanged
- SCORE_BARS Capacité unchanged

### Modified src/features/profile.test.ts

New describe `principal panel provincial lever` asserting provinceLever wiring and absence of Médiane locale / salaryForProfession / salaryLift / financialCapacityAmount.
Readability assertions updated for `pt-0.5 text-[12px]` verdict classes.

Full file contents of the two new modules are in:
- src/lib/province-lever.ts
- src/lib/province-lever.test.ts
Read those plus PrincipalPanel in src/features/profile.tsx (the Levier PanelBlock and the lever const) and the new describe in profile.test.ts.
