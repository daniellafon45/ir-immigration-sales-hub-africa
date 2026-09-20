## Résumé

- **Spec**: ✅
- **Task quality**: Approved
- **Issues**: Critical 0 / Important 0 / Minor 0

## Validation de la spec

- **Chrome et structure**: `RoutesSection` repose bien sur `OpportunitiesShell` / `Surface` / `SectionLabel` exportés depuis `market.tsx`, sans `panel` côté Voies. `CompareSection` reste présent et inchangé dans `immigration.tsx` (même usage de `Slide`, `Card`, `smart`, `routes`, stores Profil/Deck).
- **Slides et `slideCount`**: les tests `voies catalog` vérifient que `sections.find(...id==="voies").slideCount === 3`, et le code de `RoutesSection` câble explicitement trois vues (`RoutesOverview`, `RoutesBridges`, `RoutesDetail`) mappées aux indices de slide 0/1/2 conformément à la spec.
- **Slide 1 — Carte**: `RoutesOverview` respecte le chrome demandé (kicker, titre, lead exacts, pills `[market.family, market.province, objective]`), affiche les 8 voies `routes` en grille cliquable, et applique le badge `Objectif` sur l’id aligné via `routeForObjective`, avec sélection pilotée par `selectedRoute`.
- **Slide 2 — Passerelles**: `RoutesBridges` dérive bien les points de départ à partir de `routeBridges.from`, initialise le filtre sur la voie alignée à l’objectif, affiche les chips de sélection conformes au reste du produit, rend les cartes avec contexte `from → to`, `conditions` et `caution` optionnelle, clique relié à `setRoute(to)`, et gère explicitement le cas vide avec `Aucune passerelle pour ce point de départ.`.
- **Slide 3 — Détail**: `RoutesDetail` respecte le wrapper et les textes (`kicker`, lead `Pour qui : {fit}.`, labels `Conditions` / `Points positifs` / `Points d’attention` / `Étapes`) et termine par le disclaimer exact `Aperçu de démonstration. Pas un avis juridique.` alimenté par `routeById`/`routes`.
- **Données et helpers**: même si Task 1 couvrait `routes` / `routeBridges` / `route-paths`, les tests `route-paths` (référencés dans le plan) et l’utilisation dans `RoutesSection` (`routeForObjective`, `bridgesFrom`, `routeById` avec fallback sûr) sont cohérents avec la spec (8 voies dont `visit`/`asylum`, 8 passerelles, caution spécifique sur `visit-asylum`).
- **Stores et side effects**: `RoutesSection` lit le profil et l’état du deck via `useProfileStore` / `useDeckStore` mais n’utilise aucun setter de profil ; côté deck, seul `setRoute` est appelé, comme explicitement autorisé.
- **Copy et interdits**: toutes les chaînes nouvelles respectent la spec (y compris apostrophes U+2019), et les helpers `RoutesSection` / `RoutesOverview` / `RoutesBridges` / `RoutesDetail` sont couverts par un test qui interdit `Le commercial`, `version connectée`, `conseil juridique automatisé`, `panel=`, ce qui est bien respecté dans l’implémentation.

## Appréciation de la tâche

- **TDD et couverture**: le fichier `immigration.test.ts` suit fidèlement le plan TDD (vérification du `slideCount`, du chrome Voies, des interdits de copy, de la présence des marqueurs clés et des helpers). Le rapport documente un cycle RED puis GREEN avec la commande ciblée, sans dépendre de tests externes.
- **Respect du scope**: aucune modification en dehors des fichiers prévus (chrome exporté dans `market.tsx`, réécriture de `RoutesSection`, nouveau test). Les autres sections Emplois / Salaires / Provinces / Calculators continuent d’utiliser `OpportunitiesShell` comme avant, avec leur `panel` propre, sans interférence avec Voies.
- **Lisibilité et cohérence produit**: les nouveaux helpers restent peu magiques, composés autour de helpers existants (`householdMarket`, `route*`) et du design system interne. Les grilles, chips et cartes sont cohérentes avec le reste du chrome opportunités, ce qui respecte bien l’intention de la spec (une « lecture marché » des voies plutôt qu’une brochure de programmes).

## Issues

- **Critical**: 0
- **Important**: 0
- **Minor**: 0

Je ne vois pas de divergence fonctionnelle ou de dette manifeste par rapport à la spec et au plan pour cette tâche.
