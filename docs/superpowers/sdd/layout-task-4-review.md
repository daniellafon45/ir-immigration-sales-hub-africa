## Revue Tâche 4 – Marché (bandes salaires & grilles)

**Assessment Approved**

### 1. Alignement avec le brief

- **Helpers de mise en page**  
  - `SalaryPhaseBands` et `SalaryPhaseNet` utilisent bien `ir-equal-row` pour les triplets, sans aucun `sm:grid-cols-3` dans ces fonctions.  
  - La rangée Bas/Médian/Élevé de `PersonMarketCard` est passée sur `ir-equal-row` (plus de `@min-[24rem]:grid-cols-3`).  
  - Les toggles de villes dans `ProvincesCompare` sont rendus via `ir-option-grid` et ne reposent plus sur `flex flex-wrap`.  
  - Le triplet Panier / Net du foyer / Reste estimatif de `ProvincesEstimator` utilise également `ir-equal-row`, ce qui respecte l’instruction de basculer les triplets metrics sur le helper égal.

- **Comportement des cartes**  
  - Le wrapper `Surface` de `PersonMarketCard` inclut bien `min-w-0` et conserve l’overflow maîtrisé (`overflow-hidden`).  
  - `hover:-translate-y-0.5` a été retiré du `Surface` de `PersonMarketCard`, ce qui évite les débordements/clipping sur hover tout en gardant la transition d’ombre existante.  
  - Le bouton racine reste `block w-full min-w-0`, ce qui respecte l’exigence de cellules w-full + min-w-0 pour les rangées concernées.

- **Nettoyage des anciens breakpoints**  
  - Le test `market layout helpers` vérifie explicitement `expect(source).not.toContain("sm:grid-cols-3")` et passe, ce qui garantit qu’aucun `sm:grid-cols-3` ne subsiste, y compris sur les anciens triplets salariaux ou métriques.  
  - Les autres `sm:` conservés dans `market.tsx` concernent des grilles génériques (ex. 2 colonnes de cartes ou panneaux) et non les groupes ciblés (triplets salaire, toggles de villes), en accord avec le brief.

### 2. Contraintes globales (business / copy / brand)

- **Logique métier**: aucune modification de logique dans les helpers de marché, de salaires ou de provinces – seuls les `className` des conteneurs de grilles ont été ajustés.  
- **Copies & branding**: les tests existants dans `market.test.ts` couvrent largement les textes d’opportunités, salaires, provinces, calculateurs et vérifient la présence d’éléments de marque (`BrandLogo`, héros photo, etc.). Tous passent, ce qui est cohérent avec l’absence de changement de copy ou d’identité visuelle.  
- **Helpers CSS réutilisés**: `.ir-equal-row` et `.ir-option-grid` sont consommés tels quels depuis `index.css` sans modification du fichier CSS, conforme à l’interface décrite dans le brief.

### 3. Égalité des cellules & breakpoints

- **Triplets salaire**  
  - `SalaryPhaseBands` et `SalaryPhaseNet` reposent désormais sur `ir-equal-row` pour les 3 colonnes; le composant `Band` (couleurs, état `featured`, gradient) reste inchangé, ce qui respecte la consigne de préserver les visuels.  
  - La rangée salaire de `PersonMarketCard` utilise également `ir-equal-row`, avec un wrapper et des champs `ReadField` gardant `min-w-0`, garantissant des cellules égales et non tronquées.

- **Toggles de villes**  
  - `ProvincesCompare` entoure les boutons de ville dans `ir-option-grid`, sans breakpoint `sm:` sur ce groupe; la logique de sélection (max 3 villes) est intacte.  
  - Les autres grilles `sm:grid-cols-2` qui subsistent sont des dispositions de cartes ou de panneaux, pas des groupes de choix visés par la contrainte, ce qui reste conforme.

- **Pas de `sm:` pour les groupes ciblés**  
  - Les groupes suivants n’emploient plus de breakpoint viewport `sm:` pour leur mise en colonnes:  
    - Triplets salariaux (`SalaryPhaseBands`, `SalaryPhaseNet`, rangée salaire de `PersonMarketCard`).  
    - Triplet Panier / Net / Reste de `ProvincesEstimator`.  
    - Toggles de villes dans `ProvincesCompare` (passés sur `ir-option-grid`).  
  - Les autres comportements responsives s’appuient soit sur `@container` / `@min-[…]`, soit sur les nouveaux helpers CSS, conformément aux contraintes.

### 4. Couverture tests & TDD

- **Pattern source-read Vitest respecté**  
  - `market.test.ts` lit la source de `market.tsx` et utilise `extractFunction` pour isoler les fonctions ciblées, puis vérifie la présence/absence des classes (`ir-equal-row`, `ir-option-grid`, absence de `sm:grid-cols-3`, absence de `flex flex-wrap` dans `ProvincesCompare`, présence de `min-w-0` et absence de `hover:-translate-y-0.5` sur `PersonMarketCard`).  
  - Les assertions sont explicites et couplées au brief, ce qui rend la régression sur la mise en page difficile sans casser ces tests.

- **Intégration avec le reste de la suite**  
  - Les tests ajoutés sont regroupés dans `describe("market layout helpers")`, sans toucher aux describe existants qui couvrent catalogue, chrome, boards, calculatrices, etc.  
  - Les nombreux tests de copy/chrome autour des sections Opportunités, Provinces, Emplois, Salaires et Calculateurs continuent de passer avec ces modifications de layout, ce qui confirme que la Tâche 4 reste strictement sur le périmètre de mise en page.

### 5. Points d’attention / Nits

- **Couverture fonctionnelle**: les tests actuels vérifient bien le wiring des helpers de grilles et le nettoyage de `sm:grid-cols-3`. Ils ne simulent pas le rendu visuel réel, mais au vu de la convention des helpers et du code `className`, le risque de divergence est faible.  
- **Portée du nettoyage `sm:grid-cols-3`**: le test global `expect(source).not.toContain("sm:grid-cols-3")` va au-delà des cas explicitement listés (Bas/Médian/Élevé, triplets métriques). Compte tenu du fichier courant, cela reste acceptable et ne semble pas retirer de pattern légitime.

**Conclusion**: la mise en œuvre respecte le brief, les contraintes globales et le pattern Vitest TDD demandé, sans toucher à la logique métier ni à la copy. **Assessment Approved**.

