## Task 6 · Contrôle plateforme (tests shell + features)

### Portée

- Valider que la suite Vitest est entièrement verte après les tâches layout 1–5.
- Auditer les motifs viewport / flex-wrap listés dans les features `profile`, `market`, `immigration`, `sales`, `canada` et confirmer qu’aucun **groupe de choix** n’utilise encore d’anciens layouts.
- Aucune modification de production attendue si l’audit est clean ; pas de commit (`SKIPPED_COMMIT`).

### Commandes exécutées

```text
npx vitest run
```

Grep (patterns du brief, fichiers ciblés) :

```text
sm:grid-cols-3
min-[420px]
flex flex-wrap gap-1.5
grid grid-cols-3
```

Fichiers : `src/features/profile.tsx`, `market.tsx`, `immigration.tsx`, `sales.tsx`, `canada.tsx`.

### Résultats des tests

- **Suite complète** : 61 fichiers, **524 tests passés**, 0 échec (~53 s).
- Shell / fluid layout : `PageShell.test.ts` (5 tests) — vert.
- Features layout verrouillées par tâches 3–5 : `profile.test.ts`, `market.test.ts`, `immigration.test.ts` (`voies equal grids`), `sales.test.ts`, `canada.test.ts` — vert.

### Inventaire grep et classification

| Fichier | Ligne | Motif | Contexte | Classification |
|---------|-------|--------|----------|----------------|
| `profile.tsx` | 283 | `flex flex-wrap gap-1.5` | MetaPills pays / profession dans le header | **OK** — header MetaPills (explicitement autorisé) |
| `market.tsx` | 299 | `flex flex-wrap gap-1.5` | MetaPills dynamiques dans `MarketHero` | **OK** — header MetaPills |
| `canada.tsx` | 68 | `flex flex-wrap gap-1.5` | MetaPills page dans le header | **OK** — header MetaPills |
| `immigration.tsx` | 357 | `flex flex-wrap gap-1.5` | Badges lecture seule « Permis · Ouvert ou fermé » (`span`, pas de sélection) | **OK** — affichage informatif, pas un groupe de choix |
| `immigration.tsx` | 534 | `flex flex-wrap gap-1.5` | Tags pays / eTA après tableau frais visite | **OK** — badges statiques |
| `immigration.tsx` | 615 | `flex flex-wrap gap-1.5` | Noms de volets business (surbrillance du volet courant, `span`) | **OK** — récap statique, pas toggles utilisateur |
| `immigration.tsx` | 697 | `flex flex-wrap gap-1.5` | Tags crédibilité projet (expérience, fonds, province) | **OK** — badges statiques |
| `immigration.tsx` | 798 | `flex flex-wrap gap-1.5` | Tags statut parrain / super visa | **OK** — badges statiques |
| `immigration.tsx` | 1236 | `flex flex-wrap gap-1.5` | Pistes de délai IRCC (`time.tracks`, `span`) | **OK** — affichage multi-pistes, pas choix de boutons |
| `immigration.tsx` | 937 | `sm:grid-cols-3` (+ `grid-cols-2`) | `RouteSteps` — frise d’étapes de parcours (`ol` / icônes) | **OK** — grille de contenu (timeline), pas Bas/Médian/Élevé ni pills comparateur |
| `sales.tsx` | — | *(aucune occurrence des 4 motifs)* | — | **OK** |
| Tous | — | `min-[420px]` | — | **Aucun hit** |
| Tous | — | `grid grid-cols-3` (motif exact) | — | **Aucun hit** (hors sous-chaîne dans `sm:grid-cols-3` ci-dessus) |

**Groupes de choix ciblés par le brief** (sexe/apparence/langue, tuiles famille, objectif/destination, Bas/Médian/Élevé, villes, voies comparateur) : déjà migrés vers `ir-option-grid` / `ir-equal-row` ; les tests source-read des tâches 3–5 le verrouillent.

### Correctifs production

- **Aucun** — aucun reliquat « choice group » identifié ; pas de TDD ni changement CSS requis pour la tâche 6.

### Git

- Commit non effectué (`SKIPPED_COMMIT`, consigne utilisateur).

### Conclusion

La plateforme layout est **conforme** au contrôle : tests shell + features verts, grep sans reliquat de groupes de choix sur grilles viewport / `flex-wrap gap-1.5`.
