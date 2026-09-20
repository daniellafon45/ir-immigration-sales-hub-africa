### Spec Compliance

✅ Conforme au brief sur le périmètre audité.

- Les six fichiers livrés correspondent exactement au scope demandé: uniquement de nouveaux fichiers sous `src/data` et `src/lib`, plus les deux tests associés.
- Les exigences métier imposées par le brief sont respectées: valeurs de frais (`100`, `7`, `85`, `170`), allow-list eTA (`France`, `Allemagne`, `Japon`), chemin visa pour `Bénin`, facteurs de durée (`15d`/`1m`/`3m`/`6m`), `stayCost = livingBasket(...).total * factor`, `ticketsDemo = 2400 * adults + 1200 * kids`, `canWork: false`, et `accompanying` à `undefined` pour une personne seule sans enfant.
- Les comportements par défaut sont corrects: durée vide vers `1m` avec `assumedDuration: true`, motif vide vers `tourism` avec `assumedPurpose: true`.
- Le code s’appuie bien sur `livingBasket`, `defaultCityId`, `familyHasSpouse` et `familyHasChildren`, sans réintroduire de champs salariaux.
- L’apostrophe typographique demandée (`U+2019`) est bien utilisée dans `Voyage d’affaires`.

⚠️ Les contraintes de processus déclaratives ("pas de git", ordre RED puis GREEN, exécution réelle des tests/lint telle que rapportée) ne sont pas vérifiables à partir du package de revue seul; cette conclusion porte donc sur le code livré et les tests présents.

### Strengths

- L’implémentation est bien bornée et proprement factorisée: catalogue des motifs, catalogue des frais, grille de fonds et calculateur principal sont séparés en modules simples et cohérents.
- La logique centrale dans `src/lib/visit-cost.ts` est lisible et fidèle au brief, notamment sur le point le plus sensible: le coût de séjour reste mensuel multiplié par la durée, et n’est pas annualisé.
- Les tests couvrent les scénarios explicitement demandés par le brief: visite solo sur 1 mois, famille sur 3 mois, et distinction Bénin/France pour visa vs eTA.

### Issues (Critical / Important / Minor)

- Critical: None.
- Important: None.
- Minor: None.

### Assessment

**Task quality:** Approved
