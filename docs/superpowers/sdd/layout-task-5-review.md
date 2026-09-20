### Task 5 · Immigration, ventes, Canada — revue layout

**Verdict global**: **Assessment Approved**  
Les grilles Immigration / Ventes / Canada respectent le brief, les helpers CSS partagés sont utilisés correctement, et les tests Vitest couvrent les régressions clés.

---

### 1. Rappel du brief et des contraintes

- **Scope**  
  - Harmoniser les triplets de salaires et groupes d’options via les helpers CSS existants.  
  - Ne pas modifier la logique métier, les copies FR ni l’identité de marque.  
- **Attendus layout précis**  
  - **BandMini** (Bas / Médian / Élevé) : plus de `grid grid-cols-3` nu autour des bandes; utilisation du helper `.ir-equal-row`.  
  - **Pills de sélection de voies dans le comparateur** : groupe sur `.ir-option-grid` (le header MetaPills peut rester en `flex flex-wrap`).  
  - **Stats Canada** : grille sur `.ir-equal-row` avec `--ir-equal-min: 8rem`.  
  - **Piliers écosystème ventes** : conserver les container queries `@min-[24rem]` / `@min-[40rem]`, ajouter `min-w-0`, ne pas introduire de `sm:` pour ces cartes.  
- **Contraintes globales**  
  - **Égalité visuelle** des cellules pour les groupes ciblés.  
  - **Pas de nouveau breakpoint viewport** de type `sm:` / `min-[420px]` sur ces groupes; privilégier helpers ou container queries existants.  
  - **TDD Vitest source-read** : les tests doivent verrouiller ces choix de layout.

---

### 2. Immigration · `src/features/immigration.tsx`

#### 2.1. Triplets BandMini

- Dans `StudyClosingCards`, la rangée de salaire étudiant est:  
  - `className="mt-3 ir-equal-row"` avec `BandMini` pour **Bas / Médian / Élevé**.  
- Pour le conjoint d’études (`cost.spouse`), même pattern:  
  - `className="mt-3 ir-equal-row"` avec les trois bandes.  
- Dans `WorkClosingCards` (conjoint), `BusinessClosingCards` (conjoint, selon le volet) et `FamilyClosingCards` (personne parrainée), les triplets de salaires reposent aussi sur `ir-equal-row`.  
- **Contrôle brief**: la fonction `StudyClosingCards` ne contient plus de `grid grid-cols-3` ou variantes autour des `BandMini`.  
  - Confirmé par le code et par le test `voies equal grids` (cf. `immigration.test.ts`).  

**Évaluation**: conforme au brief, avec même une généralisation positive de l’helper `ir-equal-row` à d’autres cartes salaire.

#### 2.2. Groupe de sélection des voies (comparateur)

- Dans `CompareTable`, le groupe des voies cochables est implémenté comme suit :  
  - Conteneur: `className="ir-option-grid"` avec `role="group" aria-label="Voies à comparer"`.  
  - Chaque voie est un bouton `role="checkbox"` avec stylage via `ir-option-btn`.  
- L’ancien pattern `className="flex flex-wrap gap-1.5"` pour ce groupe n’apparaît plus dans la fonction `CompareTable`.  
- Le header de la section `Comparateur` reste en `flex flex-wrap` pour les MetaPills, ce qui est autorisé par le brief (seul le groupe de choix est concerné).  

**Évaluation**: conforme; l’utilisation de `.ir-option-grid` est correcte et isolée au bon endroit.

---

### 3. Ventes · `src/features/sales.tsx`

#### 3.1. Grille des piliers écosystème

- Dans `EcosystemSection`, la grille des piliers est:  
  - `className="grid min-w-0 gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3"`.  
- Points contrôlés vs brief:  
  - **`min-w-0`** est bien ajouté sur la grille, pour éviter les débordements en container-query.  
  - Les colonnes restent gérées via `@min-[24rem]` et `@min-[40rem]`: aucune utilisation de `sm:grid-cols-*`.  
  - Aucun nouveau breakpoint en `min-[420px]` ne concerne ces piliers.  

**Évaluation**: conforme; la grille reste pilotée par des container queries, et la largeur minimale est correctement sécurisée.

---

### 4. Canada · `src/features/canada.tsx`

#### 4.1. Grille de statistiques

- Dans `CanadaLiveView`, la section de stats est codée:  
  - Conteneur: `className="shrink-0 ir-equal-row"`.  
  - Style inline: `style={{ ["--ir-equal-min" as string]: "8rem" }}`.  
  - Chaque stat est rendue dans un `Surface` homogène, ce qui permet aux helpers CSS d’égaliser les cellules.  
- L’ancienne grille explicite `grid-cols-2` / `@min-[40rem]:grid-cols-4` n’est plus présente dans cette section.  

**Évaluation**: conforme; l’helper partagé est bien utilisé avec la valeur minimale de 8rem attendue.

---

### 5. Tests Vitest et TDD

#### 5.1. `src/features/immigration.test.ts`

- Bloc `describe("voies equal grids")`:  
  - **BandMini**:  
    - Extrait `StudyClosingCards` via `extractFunction`.  
    - Vérifie la présence de `BandMini label="Bas"`, `Médian`, `Élevé`.  
    - Exige `ir-equal-row` dans le chunk.  
    - Interdit `grid grid-cols-3`.  
  - **Groupe d’options du comparateur**:  
    - Extrait `CompareTable`.  
    - Vérifie `role="group" aria-label="Voies à comparer"`.  
    - Exige `ir-option-grid`.  
    - Interdit `className="flex flex-wrap gap-1.5"`.  

**Appréciation**: les tests sont strictement alignés sur le brief et verrouillent les régressions layout ciblées. Ils utilisent bien une approche source-read sur `immigration.tsx`.

#### 5.2. `src/features/sales.test.ts`

- Bloc `describe("ecosystem layout grids")`:  
  - Extrait `EcosystemSection`.  
  - Vérifie la présence exacte de `grid min-w-0 gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3`.  
  - Interdit `sm:grid-cols` dans ce chunk.  

**Appréciation**: couvre précisément le brief sur les piliers écosystème; l’assertion par chaîne est volontairement spécifique, mais cohérente avec la contrainte.

#### 5.3. `src/features/canada.test.ts`

- Bloc `describe("Canada live layout")`:  
  - Vérifie `className="shrink-0 ir-equal-row"`.  
  - Vérifie la présence de `--ir-equal-min` et de `8rem`.  
  - Interdit `grid-cols-4`.  

**Appréciation**: test simple mais ciblé, qui verrouille l’usage du helper égalisateur et l’abandon de la grille 4 colonnes en dur.

---

### 6. Contraintes globales et non-régressions

- **Pas de changement métier / copy / brand**  
  - Les tests de chrome existants dans `immigration.test.ts` et `sales.test.ts` continuent d’assert-er les phrases-clés et structures d’UI métier; aucune nouvelle phrase ou branding divergents n’apparaît dans les fichiers inspectés.  
- **Égalité visuelle des cellules**  
  - Les groupes ciblés (BandMini, options de voies, stats Canada, piliers écosystème) reposent maintenant sur des helpers communs (`ir-equal-row`, `ir-option-grid`) ou sur une grille container-query avec `min-w-0`.  
- **Breakpoints autorisés**  
  - Aucun usage de `sm:` ou `min-[420px]` n’a été introduit pour ces groupes; les breakpoints existants restent basés sur `@min-[…]` ou des helpers CSS.  
- **Respect de l’existant CSS**  
  - Aucun changement à `index.css` dans le scope de la tâche; les helpers `.ir-equal-row` et `.ir-option-grid` sont uniquement consommés.  

---

### 7. Synthèse

- Les modifications dans `immigration.tsx`, `sales.tsx` et `canada.tsx` implémentent fidèlement le brief Task 5.  
- Les tests `immigration.test.ts`, `sales.test.ts` et `canada.test.ts` sont bien en TDD source-read et verrouillent les points sensibles: égalité des cellules, choix du helper CSS, et interdiction de reintroduire des grilles explicites ou des breakpoints viewport non désirés.  
- Aucune violation des contraintes globales (métier, copy, brand, breakpoints) n’a été détectée dans les fichiers inspectés.

**Conclusion**: **Assessment Approved**.

