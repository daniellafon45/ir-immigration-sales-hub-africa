## Task 5 · Immigration, ventes, Canada — mêmes grilles

### Portée

- Harmoniser les grilles de salaires / options entre les sections immigration, ventes et Canada en réutilisant les helpers CSS existants (`.ir-equal-row`, `.ir-option-grid`), sans modifier la logique métier ni les copies.

### Changements de tests (TDD)

- `immigration.test.ts`
  - Ajout de `describe("voies equal grids")` :
    - Vérifie que `StudyClosingCards` affiche les bandes de salaires Bas/Médian/Élevé via la classe `ir-equal-row` et qu’aucun `grid grid-cols-3` nu n’est utilisé autour des `BandMini`.
    - Vérifie que `CompareTable` utilise `ir-option-grid` pour le groupe de choix des voies (`role="group" aria-label="Voies à comparer"`) et n’emploie plus `className="flex flex-wrap gap-1.5"` à cet endroit.
- `sales.test.ts`
  - Ajout de `describe("ecosystem layout grids")` :
    - Vérifie que la grille des piliers dans `EcosystemSection` conserve les colonnes définies par `@min-[24rem]` / `@min-[40rem]`, ajoute `min-w-0`, et n’introduit aucun `sm:grid-cols` de viewport pour ces cartes.
- `canada.test.ts`
  - Nouveau fichier de tests source-read.
  - Vérifie que la grille de statistiques dans `CanadaSection` utilise la classe `className="shrink-0 ir-equal-row"`, applique `--ir-equal-min: 8rem` et ne contient plus `grid-cols-4`.

### Changements d’implémentation

- `immigration.tsx`
  - `StudyClosingCards`, `WorkClosingCards`, `BusinessClosingCards`, `FamilyClosingCards` :
    - Remplacement de chaque conteneur de `BandMini` de `className="mt-3 grid grid-cols-3 gap-2"` par `className="mt-3 ir-equal-row"` pour que les triplets Bas/Médian/Élevé reposent sur l’helper `.ir-equal-row` partagé au lieu d’un grid explicite.
  - `CompareTable` :
    - Le groupe de boutons de sélection des voies, précédemment `className="flex flex-wrap gap-1.5"`, est remplacé par `className="ir-option-grid"` tout en conservant le rôle ARIA et la logique de `toggleCompare`.
    - Les pills du header (MetaPills) restent en `flex` afin de préserver le comportement responsive existant, conformément au brief.
- `sales.tsx`
  - `EcosystemSection` :
    - Mise à jour du conteneur de grilles des piliers de `className="grid gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3"` vers `className="grid min-w-0 gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3"`.
    - Aucun breakpoint `sm:` n’est ajouté sur les piliers ; seules les queries `@min-[…]` existantes sont conservées.
- `canada.tsx`
  - `CanadaLiveView` :
    - Remplacement de la grille de statistiques `className="grid shrink-0 grid-cols-2 gap-3 @min-[40rem]:grid-cols-4"` par :
      - `className="shrink-0 ir-equal-row"`.
      - Ajout de `style={{ ["--ir-equal-min" as string]: "8rem" }}` afin de paramétrer la largeur minimale des cartes dans la grille partagée.

### Fichiers explicitement non modifiés

- Aucune modification de `index.css`, `profile.tsx`, `market.tsx`, ni des fichiers liés au pitch deck, conformément aux contraintes.

### Résultats des tests

- Commande ciblée : `npx vitest run src/features/immigration.test.ts src/features/sales.test.ts src/features/canada.test.ts`
  - Résultat : 3 fichiers, 34 tests passés / 0 échec.
- Suite complète : `npx vitest run`
  - Résultat : 61 fichiers, 522 tests passés / 0 échec.

### Points de vigilance / suivis potentiels

- Les helpers CSS `.ir-equal-row` et `.ir-option-grid` sont maintenant utilisés pour tous les triplets de salaires et pour les choix de voies dans le comparateur ; toute future extension de ces composants devrait réutiliser ces helpers plutôt que de réintroduire des `grid-cols-*` ou des `flex flex-wrap` spécifiques.
- La grille des stats Canada repose sur `--ir-equal-min: 8rem`; si de nouvelles stats sont ajoutées, vérifier que ce min reste cohérent avec les contraintes visuelles globales (aucune modification d’`index.css` n’a été effectuée dans cette tâche).

