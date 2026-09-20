### Spec Compliance (✅, ⚠️)

✅ L’implémentation respecte la résolution binding et, par conséquent, la version amendée du brief.

- `SalariesSection` utilise bien `householdSalaries(profile)` et garde `salaires.slideCount` à `2`.
- Les deux slides réutilisent `OpportunitiesShell`, avec les titres, kickers et leads exacts demandés.
- Aucun `JobsBriefingPanel`, aucun `panel=` côté salaires, et aucune occurrence de `À retenir` ou `La question` n’a été réintroduite dans `src/features/market.tsx`.
- Les cartes utilisent bien `Surface`, `SectionLabel` et `Band`, avec une `Surface` par adulte via `view.groups`.
- Les libellés net demandés sont présents: `Salaire brut médian`, `Net annuel estimatif`, `Net mensuel`, ainsi que le disclaimer `Estimation de démonstration.`
- La section salaires reste en lecture seule: aucun setter du profile store n’est utilisé dans `SalariesSection`, `SalariesBands` ou `SalariesNet`.
- Les tests salaires dans `src/features/market.test.ts` suivent bien le pattern de lecture de source déjà en place.

⚠️ Les contraintes de processus du type "pas de git" ou "travail uniquement dans le dossier projet" ne sont pas auditables depuis ce diff seul, donc cette revue porte sur le code et les tests livrés.

### Strengths

- La réécriture est bien bornée: la logique salaires est isolée dans `SalariesSection`, `SalariesBands`, `SalariesNet`, `SalariesBoard` et `SalariesNetBoard`, sans modification comportementale visible de `OpportunitiesSection`, `JobsSection` ou `ProvincesSection`.
- La solution s’aligne proprement sur le chrome actuel d’Emplois: même shell, même logique de pills, et suppression cohérente de l’ancien panneau latéral.
- Le code réutilise correctement les données préparées par `householdSalaries`, ce qui évite de rebrancher des calculs métier directement dans la vue.
- Les tests couvrent les points les plus sensibles de la résolution: présence du shell attendu, absence du coaching/panel sur salaires, et rendu des boards par adulte.

### Issues (Critical / Important / Minor)

Aucune.

### Assessment (Approved | Needs fixes)

Approved
