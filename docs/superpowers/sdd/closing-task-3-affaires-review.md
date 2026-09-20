Spec Compliance

Verdict: Conforme au brief.

L’implémentation respecte les exigences demandées. Les 4 parcours exacts sont présents dans `src/data/business-paths.ts`, avec les bons booléens `needsInvestment` / `spouseOpenEligible` / `workAllowed` et les libellés de prudence attendus. `startupVisaPaused` est bien à `true`, le Start-up Visa n’est pas exposé comme parcours sélectionnable, et les apostrophes françaises utilisent bien `’`.

Les seuils de démonstration sont bien définis dans `src/data/business-thresholds.ts` pour les 13 codes `QC ON AB MB NB BC SK NS PE NL YT NT NU`, avec `QC` à `100000` pour `c11` et `200000` pour `pnp-entrepreneur`. Dans `src/lib/business-cost.ts`, le calcul suit le brief: fonds personnels via `financialCapacityAmount(profile.applicant.salary)`, aucun investissement pour `visitor`, `livingAnnual = 0` pour `visitor`, `stayShort` égal au panier d’un mois, et scénario entrepreneur Québec calculé contre la capacité `Bonne = 48000`.

Strengths

- Le périmètre est propre: uniquement de nouveaux fichiers sous `src/data`, `src/lib` et tests, conformément au package fourni.
- La construction réutilise correctement les primitives existantes (`financialCapacityAmount`, `familyHasSpouse`, `provinceCode`, `livingBasket`) au lieu de dupliquer de la logique.
- Les tests couvrent les points contractuels les plus importants: 4 parcours + pause Start-up Visa, 13 clés de seuils, visiteur en couple sans permis ouvert, et entrepreneur Québec avec seuil à `200000` et écart calculé contre `48000`.
- La séparation catalogue / seuils / calcul rend la fonctionnalité simple à maintenir et cohérente avec le reste de la base.

Issues

Critical

- Aucun.

Important

- Aucun.

Minor

- Aucun.

Assessment

Task quality: Approved
