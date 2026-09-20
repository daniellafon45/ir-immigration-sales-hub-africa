## Revue Task 2 — Comparateur chrome

### Verdicts

- **Spec**: ✅
- **Qualité de la tâche**: Approved
- **Constats**: 0 Critique / 0 Important / 0 Mineur

### Alignement avec le spec et le plan

- **Couverture fonctionnelle**: `CompareSection`, `CompareTable` et `CompareScenarios` implémentent exactement le plan `2026-09-18-comparateur-chrome` et le spec associé : réutilisation de `OpportunitiesShell`, `Surface`, `SectionLabel`, aucun `panel=`, aucune modification de `RoutesSection` ni du catalogue `comparateur.slideCount` (toujours `2` via les tests), UI en français avec apostrophes U+2019.
- **Slide 1 — Table**: kicker, titre, lead, texte vide, labels de lignes et pills (`family`, `province`, `objective`) correspondent mot pour mot aux valeurs imposées. La logique limite bien la comparaison à trois voies via `slice(0, 3)` et n’introduit pas de texte interdit.
- **Slide 2 — Scénarios**: kicker, titre `smart("Quel scénario correspond le mieux à {name} ?", profile)`, lead et contenus A–D sont conformes au spec, avec badge `Foyer` sur `recommendedScenarioId(profile)` uniquement. L’usage du helper `recommendedScenarioId` respecte la table de décision décrite dans le spec (enfants/regroupement → D, études/travail/visite → B, résidence permanente → A, sinon C).
- **Contraintes techniques**: aucun setter de profil n’est introduit, uniquement des lectures via `useProfileStore`; `toggleCompare` est réutilisé tel quel depuis le deck store, sans changer sa configuration par défaut. Aucun `panel=` ni copy interdite (`Le commercial`, `version connectée`, `aider le prospect`) n’apparaît dans `CompareSection`, `CompareTable` ou `CompareScenarios`, ce que les tests de `immigration.test.ts` verrouillent.

### Qualité du travail et TDD

- **TDD et tests**: le rapport décrit correctement une boucle RED/GREEN centrée sur `immigration.test.ts` et `route-paths.test.ts`, avec ajout progressif des suites `comparateur catalog`, `comparateur chrome` et `comparateur boards`. La commande de test utilisée correspond à celle prescrite dans le brief, sans mélange avec git ni d’autres tâches hors scope.
- **Lisibilité et structure**: la séparation claire entre `CompareSection` (aiguillage par `slideIndex`), `CompareTable` (tableau + sélection de voies) et `CompareScenarios` (scénarios de foyer) respecte l’architecture du chrome Profil client et rend la maintenance future simple. Les props sont typées (`Profile`, `ReturnType<typeof householdMarket>`) et les classes Tailwind sont cohérentes avec les autres sections.
- **Rapport de tâche**: le fichier `comparateur-task-2-report.md` est précis, factuel et couvre les points demandés dans le brief (statut, absence de commits, résumé des tests, risques identifiés). Le risque mentionné sur la convention de `slideIndex` est pertinent mais reste hypothétique et ne révèle pas de non‑conformité actuelle.

### Synthèse des écarts

- **Critique**: 0
- **Important**: 0
- **Mineur**: 0

À date, l’implémentation respecte le spec et le plan sans écart détecté, et la qualité de la tâche est suffisante pour considérer Task 2 comme livrée.

