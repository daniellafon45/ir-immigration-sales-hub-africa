# Review package: Task 4 Regroupement (re-review after fix)

Previous: Needs fixes — empty familyLink fell back to spouse; child rprf zeroed.

Fix: 7 tests. Command:
npx vitest run src/lib/family-cost.test.ts src/data/family-lico.test.ts
RED: 3 failed | 4 passed. GREEN: 2 files, 7 passed.

## Commits

none

## Fix snapshot

- familyLinkById("") and unknown → undefined (no spouse fallback)
- familyCost empty link: link undefined, reminder false, no sponsored, superVisa false
- reminder true only for valid spouse link without spouse on file
- familyFeesFor child: rprf 575 + childExtra 155 + QC 300 = 1745
- family-lico Quebec via provinceCode()

Read current source on disk. Do not mutate. Do not re-run the suite.
