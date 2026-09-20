# Comparateur de procédures — chrome Profil client

Date: 2026-09-18

## Décision

Restyler **Comparateur de procédures** (2 slides) sur le chrome Profil client / Emplois (`OpportunitiesShell`), comme Voies et Provinces.

Copy prospect. Plus de « aider le prospect » ni « Le commercial… ». Les 8 voies (dont visiteur et asile) sont comparables. Trois maximum. Le scénario du foyer est mis en avant.

`slideCount` reste **2**. Voies d’immigration inchangée.

## Psychologie

- **Jobs to be done** : choisir une logique de projet, pas cocher des programmes.
- **Contrast** : trois colonnes côte à côte rendent les écarts visibles.
- **Hick / paradox of choice** : **3 voies max**.
- **Default effect** : EE + études + PNP déjà cochés.
- **Similarity** : le scénario du foyer porte le badge `Foyer`.
- Interdit : tutoyer le commercial, « version connectée », « aider le prospect ».

## Chrome

`OpportunitiesShell` sans `panel`. `Surface`, `SectionLabel`. Puces comme Provinces (boutons, pas de cases). Pas d’écriture profil. `toggleCompare` du deck store OK.

## Slide 1 — Table

**Kicker:** `Comparateur`  
**Titre:** `Comparer les voies côte à côte.`  
**Lead:** `Trois procédures maximum. Celle qui colle au foyer, pas à la brochure.`  
**Pills:** family, province, objective.

Lignes : `Objectif`, `Profil type`, `Condition`, `Point fort`, `Attention`.  
Vide : `Choisissez jusqu’à trois voies pour comparer.`

## Slide 2 — Scénarios

**Kicker:** `Comparateur · Scénarios`  
**Titre:** `Quel scénario correspond le mieux à {name} ?` (via `smart`)  
**Lead:** `On choisit une logique de projet, pas un programme au hasard.`

Quatre scénarios A–D. Badge `Foyer` sur `recommendedScenarioId(profile)`.

## Helper

`recommendedScenarioId` dans `route-paths.ts` :

- enfants ou regroupement → `D`
- études, travail ou visite → `B`
- résidence permanente → `A`
- sinon → `C`

## Hors scope

Voies, Provinces, git. Changer le store `compareSelected` par défaut.
