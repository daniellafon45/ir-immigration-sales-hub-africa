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

**Cause à corriger (capture 2):** le bord gauche de la carte Candidat (header photo `overflow-hidden`) est rogné. Chaîne actuelle :

```
.page-shell { overflow: hidden; }
.page-shell__frame { overflow-x: hidden; }
```

```
@container page (min-width: 50rem) {
  .page-shell__frame--split { overflow: hidden; }
  .page-shell__frame--split .page-shell__main { overflow-x: hidden; }
}
```

```
Stage: relative z-0 overflow-hidden
scroller: overflow-x-hidden overflow-y-auto, gutter && "md:px-12"
```

`gutter` n’est vrai que si `section.slideCount > 1` — Profil n’a **pas** de marge Stage. SideNav est `z-50`. `.slide-enter.from-left` démarre à `translateX(-16px)`.

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

## Global Constraints (bind this task)

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle (bleu IR, `rounded-[1.2rem]`, ombres existantes).
- Aucun scroll horizontal. Le contenu ne passe jamais sous SideNav (`md:w-14`, flux flex — pas `position: fixed`).
- Les ombres et `ring-2` des cartes ne sont pas rognés : le clip horizontal, s’il reste, est à l’extérieur du padding de page.
- Les tooltips SideNav (`left-[52px]`) restent lisibles au-dessus du stage ; seul le tooltip a besoin d’un z-index élevé, pas toute la barre.
- Tests : pattern source-read Vitest. TDD : test d’abord, puis code.
- Ne pas redessiner le pitch deck ; le shell partagé s’applique aussi à pitch.
