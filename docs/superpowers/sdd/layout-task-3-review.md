## Revue Task 3 – Profil : picks, tuiles, chips

**Assessment: Approved**

### Contexte

- **Objet** : relecture de la Task 3 après le correctif « ChoiceTile / grille polygame min-w-0 », en s’appuyant sur le brief (`layout-task-3-brief.md`) et le rapport initial (`layout-task-3-report.md`).
- **Portée** : `ChoiceTile`, grille famille (polygamie comprise), `SexPicks`, `AppearancePicks`, `LanguagePicks`, grilles Objectif / Destination, et tests `src/features/profile.test.ts`.

### État des correctifs ChoiceTile + grille polygame

- **ChoiceTile** : le bouton utilise maintenant `w-full min-w-0` dans sa classe de base, ce qui garantit des tuiles famille à largeur égale dans la `ir-option-grid` et évite tout débordement horizontal.
- **Grille polygame** : le conteneur des épouses est `className="ir-rise grid min-h-0 min-w-0 gap-3 @min-[34rem]:grid-cols-2"`, ce qui ajoute bien `min-w-0` sur la grille tout en conservant la montée `@min-[34rem]:grid-cols-2`.
- **Tests dédiés** : le bloc `describe("option grid alignment")` contient un test qui :
  - vérifie que `ChoiceTile` contient `w-full min-w-0` ;
  - isole la section `>Épouses<` dans `ProfileForm` et s’assure que la grille polygame contient `min-w-0` et `ir-rise grid min-h-0`.

### Vérifications détaillées par exigence du brief

- **Grilles de picks adulte (SexPicks / AppearancePicks / LanguagePicks)**  
  - Les trois fonctions utilisent `ir-option-grid` comme conteneur et `ir-option-btn` pour les boutons.  
  - Les anciennes classes de layout (`grid-cols-2`, `grid-cols-3`, `h-8`, `text-[10px]`) ne sont plus présentes dans ces fonctions, et le test associé le vérifie explicitement.  
  - Les couleurs / ombres d’état sélectionné / non sélectionné sont conservées via le `cn` existant, sans changement de logique métier ni de copy.

- **Grille famille (family tiles)**  
  - Le bloc « Situation familiale » dans `ProfileForm` utilise bien une `div` `className="mt-2 ir-option-grid"` avec `style={{ "--ir-option-min": "6.5rem" }}`.  
  - Il n’y a plus de `min-[420px]:grid-cols-3` dans ce bloc ni ailleurs dans `ProfileForm` (vérifié par les tests et une recherche sur le fichier).

- **Objectif & Destination (chips)**  
  - Les conteneurs Objectif et Destination sont des `div` `className="mt-1.5 ir-option-grid"`, sans `flex flex-wrap`.  
  - Les `Chip` correspondants reçoivent `className="w-full min-w-0 justify-center"`, ce qui assure des cellules à largeur égale dans la grille responsive.  
  - Le test `option grid alignment` vérifie à la fois la présence de `ir-option-grid` et de `className="w-full min-w-0 justify-center"` et l’absence de `flex flex-wrap`.

- **Grille Candidat / Conjoint + PersonCard / Surface**  
  - La grille Candidat / Conjoint utilise `cn("grid shrink-0 gap-3 min-w-0", showSpouse && "@min-[34rem]:grid-cols-2")` : `@min-[34rem]:grid-cols-2` est conservé et `min-w-0` est bien présent sur la grille.  
  - La grille polygame des épouses ajoute également `min-w-0`.  
  - `PersonCard` et `Surface` intègrent `min-w-0` dans leurs layouts internes, ce qui respecte la contrainte « cartes et contenus ne débordent pas leurs conteneurs ».  
  - Le test dédié vérifie que `ProfileForm`, `PersonCard` et `Surface` contiennent tous `min-w-0`.

### Tests / TDD

- **Fichier de tests** : `src/features/profile.test.ts`.  
- **Bloc concerné** : `describe("option grid alignment")`, qui couvre :  
  - l’usage de `ir-option-grid` / `ir-option-btn` pour `SexPicks`, `AppearancePicks`, `LanguagePicks`,  
  - la grille famille utilisant `ir-option-grid` avec `--ir-option-min: "6.5rem"` et sans `min-[420px]:grid-cols-3`,  
  - les grilles Objectif / Destination avec `ir-option-grid` + `className="w-full min-w-0 justify-center"`,  
  - la présence de `min-w-0` sur les grilles Candidat / Conjoint / polygame, `PersonCard` et `Surface`,  
  - le correctif `ChoiceTile w-full min-w-0` + `min-w-0` sur la grille polygame.  
- **Exécution** : les tests décrits dans le rapport initial (incluant `option grid alignment`) sont toujours au vert avec `npx vitest run src/features/profile.test.ts`, et la suite complète passe également (`npx vitest run`).

### Contraintes globales

- **Logique métier / copy / brand** : aucune modification détectée sur les enums métier, les textes FR ou les couleurs / tokens IR existants ; les changements sont strictement layout / classes utilitaires.  
- **Cellules égales / min-w-0** : les groupes de choix concernés présentent des cellules à largeur uniforme avec `w-full min-w-0` et un `min-height` cohérent, conformément au brief.  
- **Container queries vs viewport** : aucune nouvelle utilisation de `min-[420px]:…` ou de breakpoints viewport n’a été introduite ; les ajustements reposent bien sur les helpers `.ir-option-grid` / `.ir-option-btn` et les container queries déjà prévues (`@min-[…]`).  
- **Pattern TDD Vitest source-read** : la nouvelle exigence (ChoiceTile + grille polygame) est couverte par un test source-read explicite avant implémentation et reste documentée dans l’annexe du rapport initial.

**Conclusion** : les correctifs `ChoiceTile w-full min-w-0` et `min-w-0` sur la grille polygame sont correctement implémentés, testés et alignés avec les contraintes globales. **Assessment Approved**.

### Spec Compliance

- **SexPicks / AppearancePicks / LanguagePicks** : les trois groupes utilisent bien `ir-option-grid` pour le conteneur et `ir-option-btn` pour les boutons, sans `grid-cols-2`, `grid-cols-3`, `h-8` ni `text-[10px]`. Les classes d’état conservent le bleu IR, le contraste et les ombres spécifiés dans le brief.
- **Grille des tuiles familiales** : la section « Situation familiale » remplace les anciennes classes de grille (dont `min-[420px]:grid-cols-3`) par `className="mt-2 ir-option-grid"` avec `style={{ "--ir-option-min": "6.5rem" }}`, conformément au brief.
- **Chips Objectif / Destination** : les conteneurs « Objectif » et « Destination » utilisent `ir-option-grid` à la place de `flex flex-wrap`. Les `Chip` correspondants reçoivent `className="w-full min-w-0 justify-center"`, ce qui respecte la contrainte de cellules égales, `w-full min-w-0` et texte centré dans la grille.
- **Grille Candidat / Conjoint** : le grid principal non polygame applique `min-w-0` sur la grille (`"grid shrink-0 gap-3 min-w-0"`) tout en conservant `@min-[34rem]:grid-cols-2`. `PersonCard` et `Surface` ajoutent aussi `min-w-0`, ce qui va dans le sens de la spec pour éviter les overflows horizontaux.
- **Respect des contraintes globales** : aucune modification de la logique métier, des copies FR ni de l’identité visuelle (bleu IR, `rounded-[1.2rem]`, ombres). Les nouveaux comportements responsives s’appuient sur les helpers `.ir-option-grid` / `.ir-option-btn` et des `@min-[…]` déjà présents plutôt que d’introduire de nouveaux breakpoints viewport. Les nouveaux tests couvrent bien les points demandés.

### Strengths

- **Alignement fort avec le pattern d’options global** : la réutilisation systématique de `.ir-option-grid` / `.ir-option-btn` et l’extension du composant `Chip` rendent le layout des picks/chips cohérent et facilement réutilisable pour d’autres écrans.
- **Implémentation soignée des états visuels** : les classes de sélection/non-sélection gardent le bleu IR et les ombres existantes, avec des transitions discrètes, ce qui respecte l’identité visuelle tout en améliorant la lisibilité.
- **Bon usage de `min-w-0` sur les cartes** : l’ajout de `min-w-0` sur la grille Candidat/Conjoint, `PersonCard` et `Surface` traite un vrai problème d’overflow potentiel dans les layouts en colonnes sans toucher à la logique métier.
- **Tests ciblés et lisibles** : le bloc `describe("option grid alignment")` suit le pattern « source-read Vitest », verrouille les contrats visuels critiques (grilles de picks, famille, Objectif/Destination, Candidat/Conjoint) et documente bien les intentions de layout.

### Issues (Critical/Important/Minor)

- **Critical**
  - Aucun bloquant identifié pour cette tâche.

- **Important**
  - **`ChoiceTile` n’applique pas `w-full min-w-0` comme demandé** : le brief spécifie explicitement « `ChoiceTile`: add `w-full min-w-0` » pour garantir que les tuiles famille se comportent comme de vraies cellules de grille (`ir-option-grid`), avec largeur forcée à 100 % de la colonne et min-content relâché. Aujourd’hui, `ChoiceTile` reste sans ces classes, ce qui laisse un léger écart entre la spec et l’implémentation, même si le rendu restera probablement correct dans la plupart des cas.

- **Minor**
  - **Grille polygame sans `min-w-0` sur le conteneur** : la grille des épouses polygames (`"ir-rise grid min-h-0 gap-3 @min-[34rem]:grid-cols-2"`) ne bénéficie pas du `min-w-0` ajouté sur la grille Candidat/Conjoint. Grâce au `min-w-0` sur `PersonCard` et `Surface`, le risque d’overflow reste limité, mais appliquer le même pattern sur ce conteneur renforcerait la robustesse du layout.
  - **Tests ne verrouillent pas le contrat de `ChoiceTile`** : les tests couvrent bien les helpers `.ir-option-grid` / `.ir-option-btn` et les chips, mais ne vérifient pas que `ChoiceTile` intègre `w-full min-w-0`. Ajouter une assertion dédiée dans le bloc `option grid alignment` sécuriserait ce point pour les futures refactorisations.

### Assessment

**Needs fixes** – la majorité des exigences de layout sont correctement implémentées et bien testées, mais l’absence de `w-full min-w-0` sur `ChoiceTile` laisse un écart explicite par rapport au brief, et la grille polygame gagnerait à être alignée sur le même pattern de `min-w-0`. Une petite passe de correction sur ces points permettrait de considérer la tâche comme conforme.

