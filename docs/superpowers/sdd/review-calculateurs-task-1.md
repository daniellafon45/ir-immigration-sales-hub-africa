# Review Task 1 — `householdLiving`

## Spec

✅ Conforme au brief et à la spec vérifiés.

Le helper implémente bien les règles demandées :
- `OTHER_MONTHLY_EXPENSES = 1700`
- `householdLiving(profile)` part de `householdSalaries(profile)`
- `rent` vient de `provinceData[provinceCode(profile.province)]`
- `remainder` applique bien `Math.max(0, combinedNetMonthly - rent - 1700)`
- `draftNet(gross, code)` passe bien par `netEstimate` puis arrondit le mensuel

Les deux fichiers attendus ont bien été créés :
- `src/lib/household-living.ts`
- `src/lib/household-living.test.ts`

## Strengths

- Implémentation simple, lisible et très proche du brief, donc faible risque d'interprétation métier.
- Les tests couvrent les trois cas explicitement demandés : couple par défaut, foyer `Seul(e)`, et recalcul `draftNet` pour `QC` et `ON`.
- Le helper réutilise correctement les primitives existantes (`householdSalaries`, `provinceCode`, `provinceData`, `netEstimate`) au lieu de dupliquer de la logique.
- Le calcul du reste est bien protégé contre les valeurs négatives avec `Math.max(0, ...)`.

## Issues

Aucun écart bloquant trouvé.

Point mineur non bloquant :
- La couverture reste strictement calée au brief. Il n'y a pas de test supplémentaire pour un `gross` invalide/négatif ou pour une province inconnue, mais ce n'était pas exigé et l'implémentation se comporte raisonnablement grâce aux garde-fous existants.

## Task quality

Approved
