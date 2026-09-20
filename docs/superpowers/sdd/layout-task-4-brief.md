### Task 4: Marché — bandes salaire et cartes

**Files:**
- Modify: `src/features/market.tsx`
- Test: `src/features/market.test.ts`

**Interfaces:**
- Consumes: `.ir-equal-row`, `.ir-option-grid` already in `src/index.css`. Do not edit index.css.
- Pattern from Profile: option groups use `ir-option-grid`; equal triplets use `ir-equal-row`.

- [ ] **Step 1:** Tests in market.test.ts (source-read, extract function if a helper exists, otherwise search the file string):
  - `SalaryPhaseBands` and `SalaryPhaseNet` replace `sm:grid-cols-3` with `ir-equal-row`. Those functions must not contain `sm:grid-cols-3`.
  - `PersonMarketCard` salary row: `@min-[24rem]:grid-cols-3` → `ir-equal-row`.
  - `ProvincesCompare` city toggles: `flex flex-wrap` → `ir-option-grid`.
  - Cards: `min-w-0` present on PersonMarketCard Surface wrapper.
  - `hover:-translate-y-0.5` **removed** from PersonMarketCard (translate escapes overflow and clips edges).
- [ ] **Step 2:** FAIL then implement then GREEN.
- [ ] **Step 3:** Keep salary Band visuals (colors, featured state). Only change layout classes.
- Skip git commit.

Also replace any other `sm:grid-cols-3` in market.tsx that is a Bas/Médian/Élevé or three equal metric row with `ir-equal-row`. Leave unrelated `sm:grid-cols-2` card layouts unless they are choice-button groups.

## Global Constraints

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle.
- Groupes de choix / triplets salaire : cellules égales, w-full min-w-0.
- Breakpoints dans une carte : `@container` / `@min-[…]` or the new CSS helpers, pas `sm:` viewport for those groups.
- Tests source-read Vitest. TDD.
