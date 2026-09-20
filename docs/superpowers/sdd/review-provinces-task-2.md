# Review Task 2 ProvincesSection estimator + comparator

## Spec ✅

L'implémentation de `ProvincesSection`, `ProvincesEstimator` et `ProvincesCompare` dans `src/features/market.tsx` est conforme au brief et au plan Task 2.

Points vérifiés :

- `slideCount` reste à `2`.
- `ProvincesSection` bascule bien entre estimateur et comparateur.
- le chrome passe par `OpportunitiesShell` sans `panel=`.
- les textes demandés sont présents.
- l'estimateur utilise bien `livingBasket`, `citiesForProvince` et `defaultCityId`.
- le comparateur utilise bien `livingCities` et `defaultCompareIds`.
- la comparaison est limitée à 3 villes.
- `Garde d’enfants` / `Garde` est bien conditionné à la présence d'enfants.
- `Band` et `Hero` restent après la réécriture.

## Strengths

- L'implémentation suit de très près le TSX prescrit dans le plan, ce qui réduit le risque d'écart produit.
- La logique d'état reste locale comme demandé, sans setter du profile store.
- Les garde-fous métier visibles dans le code sont corrects : fallback de ville, reset de ville au changement de province, limite à 3 sélections, message vide du comparateur.
- Les tests ciblés passent avec la suite annoncée dans le report.

## Issues

- Les tests provinces de `src/features/market.test.ts` valident presque uniquement la présence de chaînes dans le fichier source, pas le comportement rendu. Ils ne prouvent donc pas réellement les exigences les plus importantes de Task 2.
- En particulier, rien ne teste de façon comportementale la limite à 3 villes dans `ProvincesCompare`, alors que c'est une contrainte explicite du brief.
- Rien ne teste non plus le masquage conditionnel de `Garde d’enfants` / `Garde` quand `kids.length === 0`, alors que c'est une autre contrainte explicite.
- Les tests ne vérifient pas le couplage province -> villes dans l'estimateur, ni le reset de la ville au changement de province.

## Task quality

Qualité globale : bonne sur l'implémentation, moyenne sur la validation.

Le code livré est cohérent avec la spec, mais la review ne peut pas considérer la partie TDD comme forte, car les tests ajoutés sont surtout des tests de source statique. Pour une task annoncée "estimator + comparator", il manque au moins quelques assertions de comportement sur les interactions clés et les affichages conditionnels.
