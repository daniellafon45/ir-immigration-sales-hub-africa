# Layout Task 2 — Grille d’options égale (CSS)

**Date:** 2026-09-19  
**Statut:** Terminé (TDD RED → GREEN)

## Objectif

Ajouter les utilitaires CSS `.ir-option-grid`, `.ir-option-btn` et `.ir-equal-row` dans `src/index.css`, sans modifier le shell Task 1 ni brancher ces classes dans les pages (Tasks 3–5).

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/index.css.test.ts` | Nouveau `describe("option grid utilities")` (4 tests) |
| `src/index.css` | Blocs CSS ajoutés après `.ir-auto-grid-sm` |

## TDD

### RED

```text
npx vitest run src/index.css.test.ts
```

Résultat : **3 échecs** (classes absentes), **3 passes** (fonts + `.ir-auto-grid` / `.ir-auto-grid-sm`).

### GREEN

CSS ajouté verbatim depuis `layout-task-2-brief.md` :

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

.ir-equal-row {
  display: grid;
  width: 100%;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-equal-min, 7rem)), 1fr));
}
```

```text
npx vitest run src/index.css.test.ts
```

Résultat : **6/6 passes**.

## Suite complète

```text
npx vitest run
```

- **Task 2 :** `src/index.css.test.ts` — 6/6 passes.
- **Global :** 495 passes, 7 échecs dans des fichiers **non touchés** par cette tâche :
  - `src/data/canada-live.test.ts` (4)
  - `src/lib/business-cost.test.ts` (2 — stack overflow récursif)
  - `src/features/market.test.ts` (1 — copie visiteur attendue absente du source)

Ces échecs existaient avant Task 2 ; aucune régression introduite par les changements CSS/tests.

## Contraintes respectées

- [x] `.ir-auto-grid` et `.ir-auto-grid-sm` inchangés
- [x] Aucune modification des règles shell overflow/z-index/padding (Task 1)
- [x] Aucune page feature modifiée
- [x] Tests Open Sans / Inter conservés

## Git

**SKIPPED_COMMIT** — pas de dépôt git projet ; commit demandé par le brief (`feat: add equal option and salary grid utilities`) non exécuté.

## Prochaines étapes (Tasks 3–5)

Consommer `.ir-option-grid` / `.ir-option-btn` dans les pickers profil et `.ir-equal-row` pour les bandes salaire Bas/Médian/Élevé.

---

## Correctif post‑review — unicité des blocs CSS

### Tests ciblés

```text
npx vitest run src/index.css.test.ts
```

Sortie :

```text
✓ src/index.css.test.ts (7 tests)
Test Files  1 passed (1)
Tests      7 passed (7)
```

```text
npx vitest run src/components/layout/PageShell.test.ts
```

Sortie :

```text
✓ src/components/layout/PageShell.test.ts (5 tests)
Test Files  1 passed (1)
Tests      5 passed (5)
```
