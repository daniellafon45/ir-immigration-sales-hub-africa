# Review package: Task 1 Travail FEER data

No project git. Implementer status: DONE_WITH_CONCERNS (IEC fees: +100$ only on kind `open`, not `iec` which is `openVsClosed: "varies"` — matches brief; treat as known limitation unless it violates the brief).

## Commits

none

## Files changed (all added)

- src/data/noc-2021.ts
- src/data/profession-noc.ts
- src/data/work-permits.ts
- src/data/work-fees.ts
- src/data/ircc-work-rules.ts
- src/lib/noc-search.ts
- src/lib/work-pathways.ts
- src/lib/work-cost.ts
- src/lib/noc-search.test.ts
- src/data/work-permits.test.ts
- src/lib/work-pathways.test.ts
- src/lib/work-cost.test.ts

## Behavior snapshot

noc-2021: ≥80 units; 11100 Comptable FEER 1; 31301 Infirmier FEER 1; 33102 Aide-soignant FEER 3; 21232 Développeurs logiciels FEER 1; teerOf uses 2nd digit.

searchNoc: 2+ chars; 21232 → FEER 1 software; infirm → 313xx or 33102.

work-permits: 5 kinds lmia/imp/open/ict/iec; iec openVsClosed varies.

work-fees: 155 / 100 if kind==="open" / biometrics 85 or cap 170. IEC does not get +100.

workPathways: FEER 1 couple CEC 12 months + SOWP; 75110 FEER 5 no CEC no SOWP; solo no spouseOpen; open kind does not alone make SOWP.

workCost: livingBasket*12, 3 months settlement, spouse outcome only if SOWP eligible.

Tests: 14 reported passing.
