# Review package — Provinces Task 1

New files:
- src/data/cost-of-living.ts (12 cities)
- src/lib/living-basket.ts
- src/lib/living-basket.test.ts (5 tests)

Bindings: 2-bed if adults>1 or kids>0; grocery*adults + round(grocery*0.5)*kids; transport*adults; childcare*kids; net from householdLiving; remainder max(0, net-total); family `Couple + enfant(s)`; defaultCompare montreal/toronto/moncton for default QC profile.
