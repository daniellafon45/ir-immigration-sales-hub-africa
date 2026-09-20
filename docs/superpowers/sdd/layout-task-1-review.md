Spec Compliance: Approved

Spec Compliance
- **Couverture du brief** : Les changements observés dans `App.tsx`, `Stage.tsx`, `SideNav.tsx` et `index.css` correspondent fidèlement aux attentes du brief : retrait du clipping horizontal au niveau du shell (`.page-shell`, `__frame`, `__main`), recentrage du z-index sur le tooltip de la SideNav uniquement, ajout d’un padding horizontal constant côté Stage (hors `pitch`) et correction de l’animation `slide-enter.from-left` pour ne plus partir à `-16px`.
- **Respect des contraintes globales** : La logique métier, les textes FR et l’identité visuelle (palette IR, arrondis, ombres existantes) ne sont pas modifiés. La SideNav reste un élément du flux flex (`shrink-0 md:w-14`, pas de `position: fixed`), les tooltips conservent un z-index élevé (`z-50` sur le span uniquement), et aucun nouvel overflow horizontal global n’est introduit (le shell et le Stage utilisent `overflow-x: visible/clip` combiné avec le `overflow-x: clip` global sur `html`).
- **Contrat de shell conforme** : `.page-shell` utilise désormais `overflow: visible` et `--page-pad-x: clamp(1rem, 2vw, 2rem);`, `.page-shell__frame` est en `overflow-x: visible; overflow-y: auto;`, et le mode split ne clippe verticalement que le frame, en laissant `overflow-x: visible` et un `main` scrollable verticalement. Cela répond à la cause initiale (cartes rognées à gauche) tout en gardant un gutter horizontal suffisant pour les ombres et `ring-2`.
- **Contrat de Stage conforme** : Le scroller interne de `Stage` est bien passé à `overflow-y-auto overflow-x-clip` avec `px-3 md:px-6` activé via `gutter` pour toutes les sections sauf `pitch`, conformément à la note « ne pas doubler : section.id !== "pitch" ». L’outer `section` reste `overflow-hidden` comme dans l’état initial, ce que le brief n’interdit pas, et les flèches conservent `relative z-0` et la logique de masquage en bout de deck.
- **Contrat de SideNav conforme** : L’`aside` ne comporte plus de `z-50` tandis que le tooltip (span avec `group-hover:opacity-100`) a bien `z-50`, ce qui garde la nav dans le flux tout en garantissant la lisibilité des tooltips au-dessus du Stage. Les largeurs et comportements de scroll existants (notamment le petit scroll horizontal sur la nav en mobile) sont conservés.
- **TDD et tests de contrat** : Les nouveaux tests `PageShell.test.ts`, `Stage.test.ts` et `SideNav.test.ts` encodent précisément ces contrats (absence de `overflow-x: hidden` au mauvais niveau, min de `1rem` sur `--page-pad-x`, z-index limité au tooltip), et le rapport montre un cycle RED puis GREEN ciblé avant l’exécution de la suite complète.

Strengths
- **Implémentation très proche du brief** : Les modifications suivent quasiment ligne à ligne les instructions du brief (placements de `overflow`, `--page-pad-x`, `gutter`, `z-50`), avec une bonne discipline de ne pas toucher ce qui sort du périmètre (pitch deck, logique métier, copies FR).
- **Contrats de layout bien encodés dans les tests** : L’utilisation de tests source-read Vitest pour contrôler le CSS et les composants de layout verrouille bien le contrat pour les tâches suivantes (3–5), notamment sur les points fragiles historiques (clipping des cartes, z-index global de la SideNav).
- **Gestion propre du z-index et des piles de rendu** : L’ajout de `relative z-0 min-w-0 isolate` sur le `main` et le recentrage de `z-50` sur le seul tooltip réduisent le risque de futures régressions visuelles liées à des empilements mal contrôlés, tout en restant minimalistes dans les changements.
- **Respect de l’identité visuelle et du scope** : Les classes liées aux couleurs, aux arrondis et aux ombres ne sont pas modifiées ; seul le comportement de conteneur (overflow, padding, scroll) évolue, ce qui respecte bien la contrainte de ne pas redessiner le pitch deck ou la charte.

Issues
- **Critical**
  - Aucune.

- **Important**
  - Aucune.

- **Minor**
  - **Brittleness potentielle des tests CSS** : Les tests `PageShell.test.ts` s’appuient sur des découpes de blocs CSS par `indexOf` / `slice`; ils sont déjà relativement robustes (recherche de blocs nommés puis match sur les propriétés clés), mais resteront sensibles à des refactors de mise en forme (par exemple, regroupement de sélecteurs ou ajout de commentaires en ligne). Ce n’est pas bloquant mais à garder en tête pour de futures évolutions.
  - **Overflow horizontal au niveau du Stage** : L’outer `section` de `Stage` reste en `overflow-hidden`. Dans l’état actuel, grâce au nouveau padding horizontal du scroller et au contrat du shell, les cartes et leurs ombres ne sont plus rognées comme dans le bug initial. Toutefois, si de futures vues souhaitent volontairement laisser déborder des éléments décoratifs au-delà du Stage, il faudra revisiter ce choix et, le cas échéant, ajuster les tests pour rendre ce besoin explicite plutôt que de le contourner localement.

Assessment
- **Approved** : la tâche respecte le brief, les contraintes globales et encode correctement les contrats de layout attendus, avec uniquement quelques points de vigilance mineurs pour de futures évolutions.

