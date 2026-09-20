## Task 1: Shell — plus de cartes coupées

### Ce que j’ai implémenté
- **Shell PageShell / CSS** : mis à jour `index.css` pour que `.page-shell` n’utilise plus `overflow: hidden` mais `overflow: visible`, que `.page-shell__frame` gère `overflow-x: visible` et `overflow-y: auto`, et que le mode split applique seulement un clip vertical (`overflow-x: visible; overflow-y: hidden` sur le frame, `overflow-x: visible; overflow-y: auto` sur le main). Le padding horizontal de page est désormais `--page-pad-x: clamp(1rem, 2vw, 2rem);` et l’animation `.slide-enter.from-left` part de `--slide-from: 0px` pour éviter de rogner les cartes lors de la transition.
- **Stage** : modifié `Stage.tsx` pour que le scroller interne n’utilise plus `overflow-x-hidden` mais `overflow-y-auto overflow-x-clip`, avec un padding horizontal de stage appliqué par défaut (`px-3 md:px-6`) dès que la section n’est pas `pitch` (afin de ne pas doubler le padding du pitch), tout en conservant `hasSlides && "pb-4"` et la structure existante des flèches.
- **SideNav** : retiré `z-50` de l’`aside` afin que la barre latérale reste dans le flux sans passer au-dessus du stage, et déplacé ce `z-50` sur le span du tooltip pour conserver un z-index élevé uniquement sur le tooltip (`left-[52px]`), les autres classes de layout restant inchangées.
- **App** : mis à jour le `main` dans `App.tsx` pour ajouter `relative z-0 min-w-0 isolate` en plus de la structure flex existante, de manière à garantir que le stage ne passe pas sous la nav et que la pile de rendu reste bien définie.

### Preuve TDD
- **Commande RED ciblée** :  
  `cd c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme; npx vitest run src/components/layout/PageShell.test.ts src/components/layout/Stage.test.ts src/components/layout/SideNav.test.ts`  
  **Sortie clé (échec attendu)** :  
  - `SideNav.test.ts` : le nouveau test « keeps the sidebar in the flow while only raising the tooltip above the stage » échoue car le tooltip span contient encore `z-20` et l’aside contient encore `z-50`.  
  - `PageShell.test.ts` : le nouveau test « stops clipping cards at the page shell level while keeping a horizontal page gutter » échoue car le bloc `.page-shell` contient encore `overflow: hidden` et `--page-pad-x: clamp(0.75rem, 2vw, 2rem)`.  
  - `Stage.test.ts` : le test mis à jour échoue car `Stage.tsx` contient encore `overflow-x-hidden` et `gutter && "md:px-12"` au lieu de `overflow-x-clip` et `px-3 md:px-6`.
- **Commande GREEN ciblée** :  
  `cd c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme; npx vitest run src/components/layout/PageShell.test.ts src/components/layout/Stage.test.ts src/components/layout/SideNav.test.ts`  
  **Sortie clé (succès)** : les fichiers `PageShell.test.ts` (5 tests), `Stage.test.ts` (1 test) et `SideNav.test.ts` (2 tests) passent tous avec succès, 0 échec.
- **Suite complète GREEN** :  
  `cd c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme; npx vitest run`  
  **Sortie clé (succès)** : 60 fichiers de test, 478 tests au total, tous passés (`Test Files 60 passed (60)`, `Tests 478 passed (478)`), incluant les tests layout mis à jour et les autres tests de l’application.

### Fichiers modifiés
- **`src/index.css`** : ajustement de la variable `--page-pad-x`, remplacement de `overflow: hidden` par `overflow: visible` sur `.page-shell`, passage de `.page-shell__frame` en `overflow-x: visible; overflow-y: auto;`, mise à jour du mode split pour ne clipper que verticalement et laisser `overflow-x: visible` sur le frame et le main, et modification de `.slide-enter.from-left` pour utiliser `--slide-from: 0px`.
- **`src/components/layout/Stage.tsx`** : `gutter` est désormais vrai pour toutes les sections sauf `pitch` (`section.id !== "pitch"`), le scroller utilise `overflow-y-auto overflow-x-clip` et applique `px-3 md:px-6` conditionnellement au gutter, tout en conservant `hasSlides && "pb-4"` et la logique existante des flèches et de `section.id !== "pitch"`.
- **`src/components/layout/SideNav.tsx`** : suppression de `z-50` de l’`aside` principal et ajout de `z-50` au span tooltip (`group-hover:opacity-100`), en conservant `shrink-0 md:w-14` et les autres classes de layout pour respecter le flux flex et éviter les scrollbars horizontales.
- **`src/App.tsx`** : ajout de `relative z-0 min-w-0 isolate` sur le `main` pour assurer la bonne pile de rendu du stage vis-à-vis de la nav, en plus des classes flex existantes.
- **`src/components/layout/PageShell.test.ts`** : ajout d’un test qui vérifie que `.page-shell` ne clippe plus horizontalement les cartes, que `--page-pad-x` est un `clamp` avec un minimum de `1rem` et que les blocs `.page-shell__frame` et `.page-shell__frame--split .page-shell__main` utilisent `overflow-x: visible` / `overflow-y: auto` sans `overflow-x: hidden`.
- **`src/components/layout/Stage.test.ts`** : mise à jour du test pour refléter le nouveau contrat de Stage (présence de `overflow-y-auto`, `overflow-x-clip`, `px-3 md:px-6`, absence de `overflow-x-hidden`) tout en conservant les assertions sur les flèches, `relative z-0` et `section.id !== "pitch"`.
- **`src/components/layout/SideNav.test.ts`** : ajout d’un test qui vérifie que l’`aside` ne contient plus `z-50` et que le span tooltip porte désormais `z-50`, en plus du test existant sur `FullscreenButton`.

### Auto-revue
- Les modifications respectent le brief : aucune logique métier, texte ou identité visuelle n’a été modifiée, seuls les comportements de shell (overflow, z-index, padding horizontal) ont été ajustés. La suppression de `overflow-x-hidden` au niveau de la frame et du main, couplée à `--slide-from: 0px`, élimine le rognage du bord gauche des cartes tout en conservant l’absence de scroll horizontal grâce à `overflow-x: clip` sur le scroller Stage et au layout flex existant.
- Le z-index élevé est désormais limité au tooltip SideNav, ce qui garantit que la nav reste dans le flux et n’agit plus comme une couche globale au-dessus du stage, tout en maintenant la lisibilité des tooltips. Le `main` isolé (`relative z-0 isolate`) et le Stage (`relative z-0`) partagent une pile de rendu cohérente avec le nouveau contrat.
- Les tests encodent explicitement les nouveaux contrats de shell (pad-x minimal à 1rem, absence de `overflow-x: hidden` sur la frame et le main, z-index localisé sur le tooltip, scroller Stage avec padding et overflow-x-clip), ce qui protège les tâches suivantes (Tasks 3–5) contre des régressions sur ce comportement.

### SKIPPED_COMMIT
- **SKIPPED_COMMIT** : AUCUN commit git créé, conformément aux instructions, car le seul dépôt git présent est au niveau `C:/Users/Admin` (dépôt global utilisateur) et il ne doit pas être utilisé pour ce projet.

### Préoccupations / Points de vigilance
- Le test sur `--page-pad-x` vérifie uniquement que le `clamp` commence à `1rem` ; si à l’avenir la structure de la déclaration CSS change (par exemple ajout de commentaires sur la même ligne), le test pourrait nécessiter une mise à jour mineure pour rester robuste.
- Le choix de `overflow-x-clip` sur le scroller Stage garde une sécurité contre tout débordement horizontal accidentel, mais si de futures sections introduisent des éléments qui doivent dépasser visuellement du conteneur de stage, il faudra ajuster ce contrat et mettre à jour les tests en conséquence plutôt que de contourner localement avec des overrides ad hoc.
