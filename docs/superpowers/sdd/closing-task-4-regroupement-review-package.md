# Review package: Task 4 Regroupement data

No project git. Implementer: DONE. 5 tests. MNI grid numbers were not in the brief; frozen in family-lico.ts as demo.

## Commits

none

## Files changed (all added)

- src/data/family-links.ts
- src/data/family-lico.ts
- src/data/family-fees.ts
- src/lib/family-cost.ts
- src/data/family-lico.test.ts
- src/lib/family-cost.test.ts

## Snapshot

family-links: spouse 3y canWork; child 10y; parent 20y superVisaAlt. familyLinkById falls back to spouse.

family-lico: rocMni and quebecEngagement size 1–7; PARENT_MULTIPLIER 1.3; sizeFor = householdMarket adults+kids +1 if parent; QC via name or QC.

family-fees: 85+545+575+85, child extra 155, QC MIFI 300. rprf 0 if child link.

familyCost: reminder if spouse link without spouse; sponsored salary only if spouse on file; parent living *1.35 annual; delay irccTimeFor("family"). Empty familyLink treated as spouse.

Tests: couple spouse 39600 QC size 2, sponsorMid 72000, sponsored developer; solo parent size 2, 51480, superVisa, no sponsored salary.
