# Review — Provinces Task 1

## Spec

✅ **Conforme au brief et au plan pour le périmètre Task 1.**

Les trois fichiers demandés sont bien présents, l'implémentation suit les valeurs et règles exactes du plan, et le test demandé passe bien avec `5/5` succès sur `src/lib/living-basket.test.ts`.

## Strengths

- `src/data/cost-of-living.ts` recopie fidèlement le dataset attendu: 12 villes, 6 provinces, ordre et montants conformes au plan.
- `src/lib/living-basket.ts` reste un helper pur, isolé de l'UI, avec des règles métier correctement appliquées pour le logement, l'épicerie, le transport, la garde, le net mensuel et le reste.
- Les helpers annexes `citiesForProvince`, `cityById`, `defaultCityId` et `defaultCompareIds` couvrent bien le besoin de Task 2 sans introduire d'écriture dans le store.
- `src/lib/living-basket.test.ts` est utile et ciblé: il verrouille à la fois le dataset, les calculs principaux et les valeurs par défaut attendues pour le profil QC par défaut.

## Issues

**Aucun problème bloquant trouvé dans le scope de Task 1.**

Je n'ai pas relevé d'écart entre:

- le brief `docs/superpowers/sdd/provinces-task-1-brief.md`
- le plan `docs/superpowers/plans/2026-09-18-provinces-cout-de-vie.md`
- les trois fichiers livrés

## Task quality

**Bonne qualité de tâche pour un lot isolé.**

- Le découpage est propre: data, helper pur, tests.
- Le code est simple à relire et prêt à être branché sur l'UI en Task 2.
- Le risque résiduel vient surtout de la couverture de tests, qui reste volontairement étroite: pas de cas sur `cityId` inconnu, province sans ville démo, ni variantes de profils hors scénario par défaut. Ce ne sont pas des écarts au spec actuel, mais ce sont les prochains bords à surveiller au moment de l'intégration UI.
