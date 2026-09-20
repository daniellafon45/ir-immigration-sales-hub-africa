## Revue Task 1 — `recommendedScenarioId`

- **Spec**: ✅  
- **Task quality**: Approved  
- **Counts**: Critical 0 · Important 0 · Minor 1

### Conformité à la spec / brief

- **Périmètre**: Uniquement le helper pur `recommendedScenarioId(profile)` et ses tests dans `route-paths.ts` / `route-paths.test.ts`. Aucun changement UI ni dans `immigration.tsx`, conforme au brief, au plan (Task 1 uniquement) et à la section *Helper* de la spec `2026-09-18-comparateur-chrome`.
- **Comportement fonctionnel**: L’implémentation suit exactement la spec:
  - enfants via `familyHasChildren(profile.family)` **ou** objectif `Regroupement familial` → `"D"`  
  - objectif `Études` / `Travail` / `Visite` → `"B"`  
  - objectif `Résidence permanente` → `"A"`  
  - sinon (ex. `Affaires`) → `"C"`.
- **Tests**: Le bloc `describe("recommendedScenarioId")` couvre tous les cas listés dans la spec (profil par défaut, objectifs Études/Travail/Visite/Affaires/Regroupement familial, foyer avec enfants, célibataire en Affaires). Les assertions sont cohérentes avec la logique attendue.
- **Contraintes d’implémentation**: Import `familyHasChildren` et `Profile` centralisé depuis `@/data/profile` comme demandé; les imports existants (`routes`, `routeBridges`, helpers de routes) et les tests préexistants sont préservés. Le rapport TDD (RED puis GREEN, puis run de la suite complète) est aligné avec le brief.

### Qualité de la tâche (exécution, lisibilité, risques)

- **Lisibilité de l’API**: Signature claire `recommendedScenarioId(profile: Profile): "A" | "B" | "C" | "D"` (même si le type littéral n’est pas explicité, l’usage est évident via les tests et la spec). Le nom de fonction est parlant dans le contexte du chrome comparateur.
- **Lisibilité interne**: Enchaînement de `if` ordonnés par priorité métier (famille / regroupement, puis objectifs B, puis A, puis défaut) qui correspond bien à l’ordre décrit dans la spec et le plan; aucune logique implicite cachée.
- **Alignement avec l’écosystème existant**: Réutilisation de `familyHasChildren` pour détecter les foyers avec enfants plutôt qu’une logique ad hoc dans le helper, ce qui garde le mapping cohérent avec le reste du domaine profil/foyer.
- **Surface de régression**: Le helper est pur, sans dépendance UI ni store; les tests encadrent les principaux scénarios métier. Couplage limité à `Profile` et aux valeurs d’`objective` déjà présentes dans le domaine, ce qui minimise le risque de régression.

### Points à noter / améliorations possibles

- **Minor (1)**: Le test unique `picks a household scenario from the profile` agrège plusieurs cas métier dans un seul `it`. En cas de régression partielle, il sera un peu moins évident de voir immédiatement quel scénario a cassé. On pourrait, à terme, scinder en plusieurs tests ciblés (par ex. un par objectif ou par scénario A–D) pour une granularité d’échec plus fine, mais ce n’est pas bloquant pour Task 1.

### Synthèse

- **Spec**: ✅ — Implémentation et tests de `recommendedScenarioId` conformes au brief, au plan Task 1 et à la spec chrome, sans débordement sur le scope UI.  
- **Task quality**: Approved — TDD respecté, code simple et aligné métier, bonne réutilisation des helpers existants.  
- **Critical / Important / Minor**: 0 / 0 / 1.

