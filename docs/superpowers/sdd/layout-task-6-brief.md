### Task 6: Contrôle plateforme (tests shell + features)

**Files:** tests already touched; no new CSS unless a leftover choice-group still uses viewport grids.

- [ ] **Step 1:** `npx vitest run` — all green.
- [ ] **Step 2:** Grep these in `src/features/profile.tsx`, `market.tsx`, `immigration.tsx`, `sales.tsx`, `canada.tsx`:

```
sm:grid-cols-3
min-[420px]
flex flex-wrap gap-1.5
grid grid-cols-3
```

Remaining hits must NOT be **choice groups** (sex/appearance/language, family tiles, objectif/destination chips, Bas/Médian/Élevé, city toggles, compare-route pills). A `flex-wrap` of MetaPills in a header is OK.

- [ ] **Step 3:** If leftovers are choice groups, convert them to `ir-option-grid` / `ir-equal-row` and add/adjust a source-read test. Skip git unless a real leftover fix was needed.

Do not edit pitch-deck. Do not change business logic.

## Global Constraints

- Ne pas changer la logique métier, les copies FR, ni l’identité visuelle.
- Groupes de choix : cellules égales via ir-option-grid / ir-equal-row.
- Tests source-read Vitest. TDD if you must change production code.
