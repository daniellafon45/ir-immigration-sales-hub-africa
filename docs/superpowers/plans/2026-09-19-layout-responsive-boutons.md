# Layout fluide, clipping et boutons alignés

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aucune carte n’est coupée (surtout le bord gauche sous/contre la nav), et tous les groupes de boutons restent alignés et de largeur égale quel que soit le zoom ou la largeur du split.

**Architecture:** Le clipping vient du shell (SideNav `z-50` au-dessus du Stage `z-0`, chaîne `overflow-x: hidden` App → Stage → `.page-shell` → `.page-shell__main`, gutter Stage seulement si `slideCount > 1`, animation `translateX(-16px)`). L’alignement des boutons vient de `grid-cols-N` fixes, `h-8` + `text-[10px]`, `flex-wrap`/`whitespace-nowrap`, et de breakpoints viewport (`sm:`, `min-[420px]`) alors que le split PageShell rétrécit la colonne via `@container`. On corrige le shell une fois, puis on impose une grille d’options `auto-fit` + `minmax(0, 1fr)` partout.

**Tech Stack:** React, Tailwind v4, CSS container queries déjà en place dans `src/index.css`, tests Vitest en lecture de source (pattern existant).

## Global Constraints

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle (bleu IR, `rounded-[1.2rem]`, ombres existantes).
- Aucun scroll horizontal. Le contenu ne passe jamais sous `SideNav` (`md:w-14`, flux flex — pas `position: fixed`).
- Les ombres et `ring-2` des cartes ne sont pas rognés : le clip horizontal, s’il reste, est à l’extérieur du padding de page.
- Groupes de choix (sexe, apparence, langues, tuiles famille, chips objectif/destination, Bas/Médian/Élevé, toggles de comparaison) : cellules **égales**, `w-full min-w-0`, **même `min-height`**, texte centré ; zoom navigateur et panneau split ne cassent pas l’alignement.
- Breakpoints **dans** une carte ou `.page-shell__main` : `@container` / `@min-[…]`, pas `sm:` / `min-[420px]` viewport.
- Réutiliser `.ir-auto-grid` / `.ir-auto-grid-sm` ; ajouter `.ir-option-grid` plutôt que dupliquer des `grid-cols-N`.
- Les tooltips SideNav (`left-[52px]`) restent lisibles au-dessus du stage ; seul le tooltip a besoin d’un z-index élevé, pas toute la barre.
- Tests : pattern source-read Vitest déjà utilisé (`PageShell.test.ts`, `profile.test.ts`). TDD : test d’abord, puis code.
- Ne pas redessiner le pitch deck ; le shell partagé s’applique aussi à pitch.

---

### Task 1: Shell — plus de cartes coupées

**Files:**
- Modify: `src/index.css` (`.page-shell`, `__frame`, `__main`, `__aside`)
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Stage.tsx`
- Modify: `src/components/layout/SideNav.tsx`
- Test: `src/components/layout/PageShell.test.ts`, `src/components/layout/Stage.test.ts`, `src/components/layout/SideNav.test.ts`

**Interfaces:**
- Consumes: layout flex actuel (`SideNav` + `main` + `Stage`)
- Produces: règles d’overflow/z-index/padding ci-dessous — Tasks 3–5 s’appuient dessus, sans les modifier

**Cause à corriger (capture 2):** le bord gauche de la carte Candidat (header photo `overflow-hidden`) est rogné. Chaîne actuelle : `.page-shell { overflow: hidden }`, `.page-shell__frame { overflow-x: hidden }`, split `.page-shell__main { overflow-x: hidden }`, Stage `overflow-x-hidden` + gutter seulement si `slideCount > 1`. SideNav `z-50`. `.slide-enter.from-left` démarre à `translateX(-16px)`.

- [ ] **Step 1:** Tests source qui figent le contrat
  - `PageShell.test.ts` : `.page-shell` n’a plus `overflow: hidden` global ; `__frame` / `__main` n’ont plus `overflow-x: hidden` ; padding `--page-pad-x` reste un `clamp` dont le min est **au moins `1rem`** (ombres `24px` + ring).
  - `Stage.test.ts` : padding horizontal Stage **toujours** (`px-3 md:px-6` ou équivalent), plus conditionné à `hasSlides` ; plus `overflow-x-hidden` sur le scroller (garder `overflow-y-auto` + `min-w-0`).
  - `SideNav.test.ts` : l’`aside` n’a plus `z-50` ; le tooltip garde un z-index élevé (`z-50` sur le span tooltip).
- [ ] **Step 2:** Lancer les tests — FAIL
- [ ] **Step 3:** Implémenter
  - `App.tsx` : `main` → `relative z-0 min-w-0 isolate` (le stage ne passe plus sous la nav).
  - `SideNav.tsx` : retirer `z-50` de l’aside ; le mettre sur le tooltip uniquement. Garder `shrink-0 md:w-14` dans le flux.
  - `Stage.tsx` : `gutter` devient toujours vrai (sauf pitch qui a déjà son padding interne — ne pas doubler : `section.id !== "pitch"`). Classes scroller : `overflow-y-auto overflow-x-clip` (pas `hidden`) + `px-3 md:px-6`.
  - `index.css` :
    - `.page-shell { overflow: visible; }` (garder `min-width: 0; min-height: 0; height: 100%`).
    - `.page-shell__frame { overflow-x: visible; overflow-y: auto; }`
    - split : `overflow: hidden` **uniquement vertical** sur le frame (`overflow-x: visible; overflow-y: hidden`) ; `.page-shell__main` split : `overflow-x: visible; overflow-y: auto`.
    - `--page-pad-x: clamp(1rem, 2vw, 2rem);`
  - Animation : `.slide-enter.from-left { --slide-from: 0px; }` **ou** réduire à `0` — un slide qui part à `-16px` avec clip parent recoupe le bord gauche. Conserver le fade (`opacity`).
- [ ] **Step 4:** Tests PASS
- [ ] **Step 5:** Commit `fix: stop clipping page cards against the sidebar`

---

### Task 2: Grille d’options égale (CSS)

**Files:**
- Modify: `src/index.css`
- Test: `src/index.css.test.ts`

**Interfaces:**
- Consumes: Task 1 (padding/overflow stables)
- Produces: classes `.ir-option-grid` et `.ir-option-btn` utilisées telles quelles par Tasks 3–5

- [ ] **Step 1:** Test que `index.css` contient exactement les blocs `.ir-option-grid`, `.ir-option-btn`, `.ir-equal-row` du plan.
- [ ] **Step 2:** FAIL puis ajouter le CSS à la fin de `index.css` (après `.ir-auto-grid-sm`)
- [ ] **Step 3:** PASS + commit `feat: add equal option and salary grid utilities`

---

### Task 3: Profil — picks, tuiles, chips

**Files:**
- Modify: `src/features/profile.tsx`
- Test: `src/features/profile.test.ts`

**Interfaces:**
- Consumes: `.ir-option-grid`, `.ir-option-btn` (Task 2)
- Produces: pattern de picks que Market/Immigration recopient

- [ ] **Step 1:** Tests
  - `SexPicks` / `AppearancePicks` / `LanguagePicks` utilisent `ir-option-grid` + `ir-option-btn`, plus `grid-cols-2` / `grid-cols-3` / `h-8` / `text-[10px]` seuls.
  - Grille famille : plus `min-[420px]:grid-cols-3` ; `ir-option-grid` avec `--ir-option-min: 6.5rem`.
  - Objectif + Destination : plus `flex flex-wrap` ; grille `ir-option-grid` (chips `w-full min-w-0 justify-center`).
  - Grille Candidat/Conjoint : `min-w-0` sur la grille et chaque carte ; garder `@min-[34rem]:grid-cols-2`.
- [ ] **Step 2:** FAIL
- [ ] **Step 3:** Brancher les classes. Couleurs picks inchangées. `ChoiceTile` : `w-full min-w-0`.
- [ ] **Step 4:** PASS + commit `fix: keep profile option buttons aligned at any width`

---

### Task 4: Marché — bandes salaire et cartes

**Files:**
- Modify: `src/features/market.tsx`
- Test: `src/features/market.test.ts`

**Interfaces:**
- Consumes: `.ir-equal-row`, `.ir-option-grid` (Task 2), shell (Task 1)

- [ ] **Step 1:** Tests — `SalaryPhaseBands` et `SalaryPhaseNet` remplacent `sm:grid-cols-3` par `ir-equal-row` ; `PersonMarketCard` salaires `@min-[24rem]:grid-cols-3` → `ir-equal-row` ; toggles villes `ProvincesCompare` → `ir-option-grid` ; cartes `min-w-0` ; `hover:-translate-y-0.5` retiré.
- [ ] **Step 2–4:** Implémenter, PASS, commit `fix: align market salary bands and city toggles`

---

### Task 5: Immigration, ventes, Canada — mêmes grilles

**Files:**
- Modify: `src/features/immigration.tsx`
- Modify: `src/features/sales.tsx`
- Modify: `src/features/canada.tsx`
- Tests: `src/features/immigration.test.ts` (+ sales/canada tests existants)

**Interfaces:**
- Consumes: `.ir-option-grid`, `.ir-equal-row`

- [ ] **Step 1:** Tests source : plus de `grid grid-cols-3` nu sur BandMini ; compare voies en `ir-option-grid` ; canada stats en `ir-equal-row`.
- [ ] **Step 2–4:** Implémenter, PASS, commit `fix: align remaining section option and salary grids`

---

### Task 6: Contrôle plateforme (tests shell + features)

- [ ] **Step 1:** `npx vitest run` — tout vert.
- [ ] **Step 2:** Grep `sm:grid-cols-3`, `min-[420px]`, `flex flex-wrap gap-1.5` dans profile/market/immigration/sales/canada — hits restants ne doivent plus être des groupes de choix (MetaPills header OK).
- [ ] **Step 3:** Commit seulement s’il reste un correctif `fix: remove leftover viewport button grids`
