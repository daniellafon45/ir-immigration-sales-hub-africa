# Revue · Task 6 — Contrôle plateforme (grep + Vitest)

**Brief :** `layout-task-6-brief.md`  
**Rapport audité :** `layout-task-6-report.md`  
**Date de revue :** 2026-09-19  
**Périmètre :** vérification indépendante (grep + lecture de contexte + Vitest). Aucune mutation du dépôt.

---

## Verdict

**Assessment : Approved**

Le rapport Task 6 est **exact** sur les faits vérifiables : suite Vitest verte, inventaire grep des quatre motifs du brief, et classification « non choice group » **honnête** pour chaque reliquat listé.

---

## Vitest (reproduction indépendante)

```text
npx vitest run
→ Test Files  61 passed (61)
→ Tests       524 passed (524)
```

Aligné avec le rapport (~59 s localement).

---

## Grep — quatre motifs du brief

Fichiers ciblés : `src/features/profile.tsx`, `market.tsx`, `immigration.tsx`, `sales.tsx`, `canada.tsx`.

| Motif | Résultat revue | vs rapport |
|--------|----------------|------------|
| `sm:grid-cols-3` | 1 hit — `immigration.tsx` L937 (`RouteSteps`) | Conforme |
| `min-[420px]` | 0 hit | Conforme |
| `flex flex-wrap gap-1.5` | 10 hits (profile×1, market×1, canada×1, immigration×7) | Conforme (mêmes lignes) |
| `grid grid-cols-3` (motif exact) | 0 hit | Conforme |

`sales.tsx` : **aucune** occurrence des quatre motifs — affirmation du rapport **correcte**.

> Note : d’autres `flex-wrap` existent hors liste du brief (ex. en-têtes `items-end justify-between`, `sales.tsx` L95/L183, `immigration.tsx` L339/L1034/L1252). Ils ne sont pas des groupes de choix ; le rapport ne les inventorie pas car le brief ne les demandait pas — **omission documentaire**, pas une fausse classification.

---

## Vérification « leftover ≠ choice group »

Lecture du JSX autour de chaque hit `flex flex-wrap gap-1.5` et du seul `sm:grid-cols-3` :

| Fichier | Ligne | Éléments | Interaction | Revue |
|---------|-------|----------|-------------|--------|
| `profile.tsx` | 283 | `MetaPill` pays / profession | Affichage header | OK — autorisé par le brief |
| `market.tsx` | 299 | MetaPills `MarketHero` | Affichage header | OK |
| `canada.tsx` | 68 | MetaPills page | Affichage header | OK |
| `immigration.tsx` | 357 | `span` — permis ouvert/fermé | Lecture seule (résultats `pathways.permits`) | OK — badges statuts, pas toggles |
| `immigration.tsx` | 534 | `span` — pays + eTA/visa | Lecture seule | OK |
| `immigration.tsx` | 615 | `span` — noms de volets business | Lecture seule (surbrillance `profile.businessPath`) | OK — récap fermeture, pas sélecteur UI |
| `immigration.tsx` | 697 | `span` — crédibilité projet | Lecture seule | OK |
| `immigration.tsx` | 798 | `span` — statut parrain / super visa | Lecture seule | OK |
| `immigration.tsx` | 1236 | `span` — pistes délai IRCC | Lecture seule | OK |
| `immigration.tsx` | 937 | `ol` / `li` — frise `RouteSteps` | Timeline contenu | OK — pas Bas/Médian/Élevé ni pills comparateur |

Contrôle croisé : les groupes de choix visés (sexe/apparence/langue, tuiles famille, objectif/destination, bandes salariales, villes, voies comparateur) utilisent `ir-option-grid` / `ir-equal-row` dans les features concernées ; les tests source-read (`profile.test.ts`, `market.test.ts`, `immigration.test.ts`, etc.) passent avec la suite complète.

Exemple confirmé : bandes conjoint Bas/Médian/Élevé en `ir-equal-row` (`immigration.tsx` ~L724), cohérent avec la migration layout.

---

## Écarts / réserves mineures

1. **Inventaire partiel par design** : seuls les quatre motifs du brief sont tabulés ; d’autres `flex-wrap` / grilles responsives (`sales.tsx` `lg:grid-cols-3` presse, `@min-[40rem]:grid-cols-3` écosystème) restent en dehors du périmètre grep Task 6 et ne sont pas des choice groups.
2. **L615 immigration** : visuellement proche de chips sélectionnables, mais implémentation **read-only** (`span`) dans une carte de clôture — la classification du rapport est défendable ; amélioration UX future possible sans impact sur la conformité Task 6.

Aucun reliquat identifié comme **choice group** déguisé en MetaPills/badges.

---

## Conclusion revue

- **Tests :** reproduits, verts.  
- **Grep :** aligné avec le rapport.  
- **Classification leftovers :** honnête ; aucune correction production requise pour Task 6.  
- **Commit SKIPPED :** acceptable.

**Assessment : Approved**
