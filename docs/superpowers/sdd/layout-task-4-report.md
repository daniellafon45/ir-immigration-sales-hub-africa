## Tâche 4 – Marché : bandes salaire et cartes

- **Contexte** : harmoniser la mise en page des triplets de salaires et des comparateurs de provinces avec les nouveaux helpers CSS `.ir-equal-row` et `.ir-option-grid`, sans toucher à `index.css` ni à `profile.tsx` et sans changer la logique métier.
- **Approche TDD** : ajout de tests source-read dans `src/features/market.test.ts` (bloc `market layout helpers`) pour décrire le comportement attendu, exécution de `npx vitest run src/features/market.test.ts` (échec), implémentation dans `src/features/market.tsx`, puis re-exécution des tests ciblés et de l’ensemble de la suite (`npx vitest run`), tous verts.

### Changements tests (`market.test.ts`)

- **Nouveaux tests `market layout helpers`** :
  - Vérifient que `SalaryPhaseBands` et `SalaryPhaseNet` utilisent le helper `ir-equal-row` pour les triplets et ne contiennent plus `sm:grid-cols-3`.
  - Vérifient que `PersonMarketCard` :
    - Utilise `ir-equal-row` pour la ligne Bas/Médian/Élevé.
    - Ne contient plus `@min-[24rem]:grid-cols-3` sur cette ligne.
    - Ajoute `min-w-0` sur le wrapper `Surface` de la carte (en plus du bouton) et supprime `hover:-translate-y-0.5` pour éviter les débordements sur hover.
  - Vérifient que `ProvincesCompare` remplace la rangée de boutons ville en `ir-option-grid` au lieu de `flex flex-wrap`.
  - Vérifient que `ProvincesEstimator` utilise `ir-equal-row` pour le triplet Panier/Net/Reste et qu’aucun `sm:grid-cols-3` ne subsiste dans `market.tsx`.

### Implémentation (`market.tsx`)

- **`PersonMarketCard`** :
  - Wrapper `Surface` : ajout de `min-w-0` et retrait de `hover:-translate-y-0.5` dans la classe (`"min-w-0 overflow-hidden p-0 transition duration-200 @container"`), pour que la carte reste bien calculée dans les grilles étroites sans déplacement vertical qui ferait « sortir » le contenu.
  - Ligne salaire Bas/Médian/Élevé : remplacement de `className="grid min-w-0 grid-cols-1 gap-2 @min-[24rem]:grid-cols-3"` par `className="ir-equal-row"`, en conservant la structure des champs `ReadField` et les libellés existants.
- **`SalaryPhaseBands`** :
  - Remplacement de la grille interne des trois bandes de salaire par `className="ir-equal-row"` à la place de `className="grid gap-2 sm:grid-cols-3"`, en gardant les couleurs/états (dont le `featured` sur le médian) inchangés.
- **`SalaryPhaseNet`** :
  - Même adaptation : conteneur des trois colonnes brut/net annuel/net mensuel passé en `className="ir-equal-row"` au lieu de `sm:grid-cols-3`.
- **`ProvincesEstimator`** :
  - Bloc récapitulatif Panier mensuel / Net du foyer / Reste estimatif : remplacement de `className="mt-3 grid gap-2 sm:grid-cols-3"` par `className="mt-3 ir-equal-row"`, ce qui aligne ce triplet sur le même helper que les bandes salaire.
- **`ProvincesCompare`** :
  - Rangée de boutons pour le choix des villes : remplacement de `className="flex flex-wrap gap-2"` par `className="ir-option-grid"`, pour réutiliser le même pattern de grille de choix qu’en profil (groupes d’options responsives avec `min-w-0` côté CSS).

### Validation

- **Tests ciblés** : `npx vitest run src/features/market.test.ts` – 41 tests passés, y compris les nouveaux scénarios de layout.
- **Suite complète** : `npx vitest run` – 60 fichiers de tests, 518 tests passés, aucun échec, confirmant l’absence de régression sur les autres sections (profil, jobs, calculators, etc.).

