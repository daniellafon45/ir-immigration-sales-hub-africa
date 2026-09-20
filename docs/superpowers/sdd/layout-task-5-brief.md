### Task 5: Immigration, ventes, Canada — mêmes grilles

**Files:**
- Modify: `src/features/immigration.tsx` (`BandMini` `grid-cols-3`, pills compare `flex flex-wrap`)
- Modify: `src/features/sales.tsx` (grilles piliers déjà `@min-` — add `min-w-0`; no `sm:` viewport for piliers)
- Modify: `src/features/canada.tsx` (stats `grid-cols-2` / `@min-[40rem]:grid-cols-4` → `ir-equal-row` with `--ir-equal-min: 8rem`)
- Tests: `src/features/immigration.test.ts` if it exists; otherwise create it using source-read like other feature tests. Also sales/canada tests if present (`src/features/sales.test.ts`, `src/features/canada.tsx` tests).

**Interfaces:**
- Consumes: `.ir-option-grid`, `.ir-equal-row` from index.css. Do not edit index.css.

- [ ] **Step 1:** Tests:
  - BandMini rows: no bare `grid grid-cols-3` around Bas/Médian/Élevé; use `ir-equal-row`.
  - Compare-route pills: `ir-option-grid` instead of `flex flex-wrap` for the choice group (header MetaPills flex-wrap is OK).
  - canada stats: `ir-equal-row` with `--ir-equal-min: 8rem` (style or class).
  - sales piliers grid: `min-w-0` on the grid; keep `@min-[24rem]` / `@min-[40rem]` container queries (not `sm:`).
- [ ] **Step 2–4:** Implement, PASS. Skip git.

Do not redesign pitch-deck.

## Global Constraints

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle.
- Groupes de choix / triplets salaire : cellules égales.
- Breakpoints dans une carte : `@container` / `@min-[…]` or CSS helpers, pas `sm:` / `min-[420px]` viewport for those groups.
- Tests source-read Vitest. TDD.
