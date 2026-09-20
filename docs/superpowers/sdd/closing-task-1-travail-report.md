# Closing Task 1 Travail Report

## Scope delivered

Implemented the Travail data layer only, under `src/data` and `src/lib`, following the brief:

- NOC 2021 catalog with FEER lookup helpers
- profession to NOC default mapping
- FEER/NOC search
- work permit catalog
- IRCC fee data
- IRCC work rules data
- work pathways helper
- work cost helper
- focused Vitest coverage for the new behavior

No edits were made to the forbidden files listed in the brief.

## TDD evidence

### RED

Command run:

```bash
npx vitest run src/lib/noc-search.test.ts src/lib/work-pathways.test.ts src/lib/work-cost.test.ts src/data/work-permits.test.ts
```

Observed RED result:

- `src/lib/noc-search.test.ts` failed because `@/data/noc-2021` did not exist yet
- `src/lib/work-pathways.test.ts` failed because `@/lib/work-pathways` did not exist yet
- `src/lib/work-cost.test.ts` failed because `@/lib/work-cost` did not exist yet
- `src/data/work-permits.test.ts` failed because `@/data/work-fees` did not exist yet

This confirmed the requested Travail modules were missing before implementation.

### GREEN

Re-ran the same command after implementation.

Observed GREEN result:

- `Test Files 4 passed (4)`
- `Tests 14 passed (14)`

## Files changed

Created:

- `src/data/noc-2021.ts`
- `src/data/profession-noc.ts`
- `src/data/work-permits.ts`
- `src/data/work-fees.ts`
- `src/data/ircc-work-rules.ts`
- `src/lib/noc-search.ts`
- `src/lib/work-pathways.ts`
- `src/lib/work-cost.ts`
- `src/lib/noc-search.test.ts`
- `src/data/work-permits.test.ts`
- `src/lib/work-pathways.test.ts`
- `src/lib/work-cost.test.ts`

Created report:

- `docs/superpowers/sdd/closing-task-1-travail-report.md`

## Self-review

Checked:

- brief-required test cases are present
- FEER 1 and FEER 5 pathway behavior is covered
- solo vs spouse-eligible vs spouse-ineligible work cost behavior is covered
- work permit catalog length is 5
- no linter errors were reported on the touched files

## Concerns

- None for this fix pass.

## Review fixes

Addressed the two Important review findings and the cheap Minor coverage gap:

- `src/lib/work-pathways.ts`: treat `workPermitKind === "iec"` as the safe "varies but do not sell closed" renewal path, with `closedKeepsSameEmployer: false` and `openCanChangeEmployer: true`
- `src/data/work-fees.ts`: apply `openHolderFee` to both `open` and `iec`, producing the sales-deck default of `155 + 100 + biometrics`
- `src/lib/work-pathways.test.ts`: added a dedicated IEC renewal regression test
- `src/data/work-permits.test.ts`: added a regression test proving IEC includes the 100 open-holder fee
- `src/lib/work-pathways.test.ts`: added a positive spouse-open case for selected TEER 3 code `33102`

### RED for review fixes

Ran before implementation:

```bash
npx vitest run src/lib/noc-search.test.ts src/lib/work-pathways.test.ts src/lib/work-cost.test.ts src/data/work-permits.test.ts
```

Observed RED result:

- `src/lib/work-pathways.test.ts`: IEC renewal test failed because `closedKeepsSameEmployer` was `true`
- `src/data/work-permits.test.ts`: IEC fee test failed because `openHolder` was `0` instead of `100`

### GREEN after fixes

Re-ran:

```bash
npx vitest run src/lib/noc-search.test.ts src/lib/work-pathways.test.ts src/lib/work-cost.test.ts src/data/work-permits.test.ts
```

Observed GREEN result:

- `Test Files 4 passed (4)`
- `Tests 16 passed (16)`
- no linter errors on touched Travail files
