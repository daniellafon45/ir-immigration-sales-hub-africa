### Task 2: Grille d’options égale (CSS)

**Files:**
- Modify: `src/index.css`
- Test: `src/index.css.test.ts`

**Interfaces:**
- Consumes: Task 1 (padding/overflow stables) — do not change Task 1 overflow/z-index/padding rules
- Produces: classes `.ir-option-grid` et `.ir-option-btn` utilisées telles quelles par Tasks 3–5

- [ ] **Step 1:** Test that `index.css` contains exactly:

```css
.ir-option-grid {
  display: grid;
  width: 100%;
  gap: 0.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-option-min, 5.5rem)), 1fr));
}

.ir-option-btn {
  display: flex;
  min-width: 0;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  padding-inline: 0.25rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Also `.ir-equal-row` for Bas/Médian/Élevé triplets:

```css
.ir-equal-row {
  display: grid;
  width: 100%;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-equal-min, 7rem)), 1fr));
}
```

- [ ] **Step 2:** FAIL then add the CSS at the end of `index.css` (after `.ir-auto-grid-sm`)
- [ ] **Step 3:** PASS + commit `feat: add equal option and salary grid utilities`

Keep existing `.ir-auto-grid` / `.ir-auto-grid-sm`. Do not wire these classes into feature pages (Tasks 3–5). Do not change shell overflow from Task 1.

## Global Constraints

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle (bleu IR, `rounded-[1.2rem]`, ombres existantes).
- Réutiliser `.ir-auto-grid` / `.ir-auto-grid-sm` ; ajouter `.ir-option-grid` plutôt que dupliquer des `grid-cols-N`.
- Tests : pattern source-read Vitest. TDD : test d’abord, puis code.
