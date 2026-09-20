## Task 3 – Profil : picks, tuiles, chips

- **Contexte** : harmoniser l’alignement et la responsivité des sélecteurs (picks), tuiles et chips sur la page Profil afin de s’aligner sur les nouveaux helpers CSS `.ir-option-grid` et `.ir-option-btn` ajoutés lors de la tâche 2, sans toucher à `index.css`, à la logique métier, ni aux copies FR.

- **TDD – Tests ajoutés (`src/features/profile.test.ts`)**  
  - **`describe("option grid alignment")`**  
    - Vérifie que `SexPicks`, `AppearancePicks` et `LanguagePicks` consomment **`ir-option-grid`** pour le conteneur et **`ir-option-btn`** pour les boutons, et que leurs fonctions ne contiennent plus les anciennes classes de layout (`grid-cols-2`, `grid-cols-3`, `h-8`, `text-[10px]`).  
    - Vérifie que la grille des tuiles familiales dans `ProfileForm` utilise désormais **`ir-option-grid`** avec la variable CSS **`--ir-option-min: 6.5rem`** et qu’elle ne dépend plus de `min-[420px]:grid-cols-3`.  
    - Vérifie que les sections **Objectif** et **Destination** utilisent `ir-option-grid` au lieu de `flex flex-wrap` et que les `Chip` correspondants sont rendus avec `className="w-full min-w-0 justify-center"`, ce qui garantit des chips à largeur uniforme dans la grille.  
    - Vérifie que le grid Candidat / Conjoint conserve `@min-[34rem]:grid-cols-2` tout en ajoutant **`min-w-0`** sur la grille, `PersonCard` et `Surface`, pour éviter tout overflow horizontal dans la mise en page des cartes.

- **Implémentation (`src/features/profile.tsx`)**  
  - **Picks adulte (SexPicks / AppearancePicks / LanguagePicks)** :  
    - Remplacement des div `grid grid-cols-*` par **`className="ir-option-grid"`** pour les radiogroups.  
    - Remplacement des classes bouton (`h-8`, `text-[10px]`, etc.) par **`ir-option-btn`** tout en conservant les couleurs et ombres existantes pour les états sélectionné / non sélectionné via `cn("ir-option-btn …", selected ? "bg-primary text-white …" : "bg-secondary text-primary …")`.  
  - **Grille des tuiles familiales** :  
    - Remplacement de `grid grid-cols-2 ... min-[420px]:grid-cols-3 @min-[42rem]:grid-cols-5` par **`className="mt-2 ir-option-grid"`** avec `style={{ "--ir-option-min": "6.5rem" }}`, ce qui délègue la responsivité à `auto-fit` et aligne la carte famille sur le même pattern d’options que le reste de l’app.  
  - **Objectif & Destination (chips)** :  
    - Conteneurs transformés en **`div` avec `className="mt-1.5 ir-option-grid"`**, supprimant l’ancien `flex flex-wrap`.  
    - Les `Chip` d’objectif et de province reçoivent désormais **`className="w-full min-w-0 justify-center"`**, en s’appuyant sur le support `className` déjà testé sur le composant `Chip`, pour obtenir des chips à largeur uniforme dans la grille responsive.  
  - **Grille Candidat / Conjoint & cartes** :  
    - Ajout de **`min-w-0`** sur la grille conditionnelle `cn("grid shrink-0 gap-3 min-w-0", showSpouse && "@min-[34rem]:grid-cols-2")` et sur la grille polygame `"ir-rise grid min-h-0 min-w-0 gap-3 @min-[34rem]:grid-cols-2"`.  
    - Ajout de **`min-w-0`** dans le layout interne de `PersonCard` (bloc `div` des champs) ainsi que dans la classe de base de `Surface` (`"rounded-[1.2rem] min-w-0 border …"`), afin de garantir que les cartes et leurs contenus respectent bien les contraintes de conteneur à toutes les largeurs.  

- **Tests**  
  - **Commandes exécutées** :  
    - `npx vitest run src/features/profile.test.ts` → rouge après ajout des tests (4 échecs sur le nouveau `describe("option grid alignment")`), puis vert après implémentation.  
    - `npx vitest run` → 60 fichiers, **512 tests OK**.  

- **Risques / points de vigilance**  
  - Le passage des layouts explicites (`grid-cols-*`, `flex flex-wrap`) à `ir-option-grid` délègue davantage la responsivité aux règles CSS globales : visuellement, le comportement est cohérent avec le brief, mais il faudra valider en UI réelle que tous les textes d’options (notamment les objectifs longs et les provinces) restent lisibles et non tronqués sur les petits écrans.  
  - `Surface` gagne `min-w-0` de manière globale : cela améliore la robustesse des cartes dans les grilles, mais modifie potentiellement le comportement de surfaces réutilisées ailleurs – un rapide smoke test visuel des autres écrans cartes (marché / immigration / ventes) est recommandé lors de la prochaine passe de QA.

## Annexe – Correctif finding Task 3 (ChoiceTile + grille polygame)

- **Changements** : `ChoiceTile` → `w-full min-w-0` sur le bouton ; grille épouses polygame → `min-w-0` sur `ir-rise grid min-h-0 …`.
- **Test ajouté** : `option grid alignment > stretches family ChoiceTile buttons and constrains the polygamous spouse grid`.

### RED (tests seuls, avant implémentation)

```
npx vitest run src/features/profile.test.ts
```

```
 Test Files  1 failed (1)
      Tests  1 failed | 25 passed (26)
 × option grid alignment > stretches family ChoiceTile buttons …
   → expected … ChoiceTile … to contain 'w-full min-w-0'
```

### GREEN (après implémentation)

```
npx vitest run src/features/profile.test.ts
```

```
 Test Files  1 passed (1)
      Tests  26 passed (26)
   Duration  3.88s
```

