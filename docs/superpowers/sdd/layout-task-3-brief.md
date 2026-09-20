### Task 3: Profil — picks, tuiles, chips

**Files:**
- Modify: `src/features/profile.tsx` (`SexPicks`, `AppearancePicks`, `LanguagePicks`, `ChoiceTile` grid, chips Objectif/Destination, grille PersonCard)
- Test: `src/features/profile.test.ts`

**Interfaces:**
- Consumes: `.ir-option-grid`, `.ir-option-btn` from `src/index.css` (already added; do not redefine)
- Produces: pattern of picks that Market/Immigration will copy in later tasks

Task 2 already added these CSS classes (do not edit index.css):

```css
.ir-option-grid { display: grid; width: 100%; gap: 0.25rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-option-min, 5.5rem)), 1fr)); }
.ir-option-btn { display: flex; min-width: 0; width: 100%; min-height: 2rem; align-items: center; justify-content: center; padding-inline: 0.25rem; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

- [ ] **Step 1:** Tests in `src/features/profile.test.ts` using existing `extractFunction` helper:
  - `SexPicks` / `AppearancePicks` / `LanguagePicks` use `ir-option-grid` + `ir-option-btn`. They must NOT contain standalone `grid-cols-2` / `grid-cols-3` / `h-8` / `text-[10px]` as the pick button layout (those strings must not appear in those three functions).
  - Family tile grid: no `min-[420px]:grid-cols-3`. Use `ir-option-grid` with style `--ir-option-min: 6.5rem` (or equivalent className `ir-option-grid` plus that CSS variable).
  - Objectif + Destination: no `flex flex-wrap` on those chip rows; use `ir-option-grid`. Chips in those grids get `className="w-full min-w-0 justify-center"` (Chip already accepts className from earlier work).
  - Candidat/Conjoint grid: `min-w-0` on the grid and each card; keep `@min-[34rem]:grid-cols-2`.
- [ ] **Step 2:** FAIL
- [ ] **Step 3:** Wire the classes. Pick buttons: `className={cn("ir-option-btn", selected ? "bg-primary text-white ..." : "bg-secondary text-primary ...")}` — keep current selected/unselected colors. `ChoiceTile`: add `w-full min-w-0`. Do not change copy, colors, or business logic.
- [ ] **Step 4:** PASS. Skip git commit.

LanguagePicks currently has `@min-[20rem]:grid-cols-4` — replace the whole radiogroup div with `ir-option-grid` (auto-fit handles wrap). Optionally set `--ir-option-min` smaller for 4 language levels if needed; default 5.5rem is fine.

## Global Constraints

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle (bleu IR, `rounded-[1.2rem]`, ombres existantes).
- Groupes de choix : cellules **égales**, `w-full min-w-0`, **même `min-height`**, texte centré.
- Breakpoints **dans** une carte ou `.page-shell__main` : `@container` / `@min-[…]`, pas `sm:` / `min-[420px]` viewport.
- Tests : pattern source-read Vitest. TDD : test d’abord, puis code.
