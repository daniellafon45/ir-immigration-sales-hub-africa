# Voies d’immigration — passerelles et détail

Date: 2026-09-18

## Décision

Restyler **Voies d’immigration** (3 slides) sur le chrome Emplois / Provinces, et remplacer le coaching « développeur d’affaires / conseil juridique automatisé » par :

1. une **carte des voies** alignée sur le foyer et l’objectif
2. des **passerelles** (visiteur → études / travail / asile, études → travail, travail → RP, RP → famille) **avec conditions**
3. une **vue détail** (conditions, plus, attention, étapes)

`slideCount` reste **3**. Comparateur inchangé. Copy prospect. Pas de « Le commercial… ».

## Psychologie

- **Jobs to be done** : le prospect ne veut pas une brochure de programmes. Il veut savoir *par quelle porte il peut passer depuis où il est*.
- **Contrast** : le statut actuel n’est pas le suivant. Les conditions font la différence.
- **Hick / paradox of choice** : 8 voies, 8 passerelles. Filtrer les passerelles par point de départ.
- **Honesty / pratfall** : l’asile protège, ce n’est pas un plan B économique.
- **Goal-gradient** : les étapes du détail montrent l’effort, pas un miracle.
- **Regret aversion** : « ne pas commencer avant l’approbation ».
- **Curse of knowledge** : conditions en français simple, pas un code IRCC.
- Interdit : tutoyer le commercial, « version connectée », « conseil juridique automatisé ».

## Chrome

`OpportunitiesShell` sans `panel`. `Surface`, `SectionLabel`. Exporter ces trois helpers depuis `market.tsx`. Pas de `À retenir` / `La question`. Pas d’écriture dans le store profil. `setRoute` du deck store OK (sélection de voie).

## Données

Étendre `ImmigrationRoute` avec `conditions: string[]`. Ajouter deux voies : `visit` (Visa visiteur), `asylum` (Asile et protection). Total **8**.

`routeBridges` : 8 passerelles, chacune `from`, `to`, `title`, `conditions`, `caution?`.

Helper `src/lib/route-paths.ts` : `routeById`, `routeForObjective`, `bridgesFrom`.

## Slide 1 — Carte

**Kicker:** `Voies d’immigration`  
**Titre:** `Une destination. Plusieurs chemins.`  
**Lead:** `Le chemin dépend du foyer et de l’objectif, pas d’une brochure.`  
**Pills:** family, province, objective.

Cartes cliquables. Badge `Objectif` sur la voie de `routeForObjective`. Sélection = `selectedRoute`.

## Slide 2 — Passerelles

**Kicker:** `Voies · Passerelles`  
**Titre:** `Un statut n’est pas encore le suivant.`  
**Lead:** `Chaque passerelle a des conditions. Les sauter coûte des années.`

Puces de filtre = voies qui apparaissent en `from`. Défaut = `routeForObjective`. Cartes : De → Vers, conditions, `caution` si présente. Clic → `setRoute(to)`. Vide : `Aucune passerelle pour ce point de départ.`

## Slide 3 — Détail

**Kicker:** `Voies · Détail`  
**Titre:** nom de la voie  
**Lead:** `Pour qui : {fit}.`  
Blocs : `Conditions`, `Points positifs`, `Points d’attention`, `Étapes`.  
Disclaimer : `Aperçu de démonstration. Pas un avis juridique.`

## Hors scope

Comparateur, Provinces, Calculateurs, git. Données IRCC live.
