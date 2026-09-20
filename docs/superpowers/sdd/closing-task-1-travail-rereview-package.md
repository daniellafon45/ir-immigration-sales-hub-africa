# Review package: Task 1 Travail FEER data (re-review after IEC fix)

Previous review: Needs fixes (IEC renewal sold as closed; IEC missing 100$ open-holder fee).

Fix agent: 16 tests, covering command:
npx vitest run src/lib/noc-search.test.ts src/lib/work-pathways.test.ts src/lib/work-cost.test.ts src/data/work-permits.test.ts
GREEN: Test Files 4 passed (4), Tests 16 passed (16)

## Commits

none

## Files changed in the fix

- src/lib/work-pathways.ts — workPermitKind iec uses selectedOpenState "open" so closedKeepsSameEmployer false, openCanChangeEmployer true
- src/data/work-fees.ts — openHolderFee for kind === "open" || kind === "iec"
- src/lib/work-pathways.test.ts — IEC renewal test + SOWP 33102
- src/data/work-permits.test.ts — workFeesFor("iec", 1) openHolder 100

Read the current source on disk for those files. Do not mutate. Do not re-run the suite.
