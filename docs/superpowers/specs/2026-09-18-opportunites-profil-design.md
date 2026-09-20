# Opportunités — chrome profil client + foyer

Date: 2026-09-18

## Décision

Restyler la section **Opportunités** (3 slides) sur le chrome du **Profil client** / **Canada Live**. Afficher le marché de **chaque adulte du foyer** (candidat, conjoint, épouses), pas seulement le demandeur principal. Les champs sont **en lecture seule** : la saisie reste dans Profil client.

## Contexte

Aujourd’hui `OpportunitiesSection` utilise l’ancien `Slide` : une barre métier factice (« Rechercher ») et 3 métriques (offres, médian, province) calculées via `pitchView` (principal seulement). Le profil gère déjà Couple, Couple + enfants, Parent seul, Polygame.

## Chrome

Même coquille que Canada Live :

- Grille `xl:grid-cols-[minmax(0,1fr)_300px]`, `max-w-[1280px]`, scrollbars masquées.
- En-tête navy `rounded-[1.2rem]` + `IrShaderGradient` + `BrandLogo`.
- Cartes `Surface` (`rounded-[1.2rem]`, bordure `#e5eaf0`).
- Panneau latéral navy `from-primary to-ir-deep`, `PanelBlock` / `FactRow`.
- Pas de `HoverRevealCards` (hors sujet marché).
- Pas de barre « Rechercher ».

`slideCount` reste **3**. Emplois, salaires, calculateurs, provinces inchangés.

## Slide 1 — Marché du foyer

**Kicker:** `Opportunités`  
**Titre:** `Votre profil peut être relié aux données du marché.`  
**Lead:** `Le commercial part des métiers du foyer et montre le marché réel.`  
**Pills:** `familyLabel` · `province` · métier du principal.

Une fiche par adulte visible au dossier :

| Situation | Fiches |
| --- | --- |
| Seul(e) / Parent seul | Candidat |
| Couple / Couple + enfants | Candidat + Conjoint, `lg:grid-cols-2` |
| Polygame | Candidat pleine largeur, puis Épouse 1 + extra en `lg:grid-cols-2` |

Chaque fiche (look `PersonCard`, champs lecture seule style inputs profil) :

- En-tête shader : titre de rôle, prénom, initiales, pastille = nombre d’offres.
- Tone `navy` si adulte **sélectionné** (demandeur principal), sinon `blue` + `ring-2 ring-primary/30` sur la fiche active.
- Champs : Métier, Secteur, Offres, Bas, Médian, Élevé.
- Valeurs : `profession`, `sector`, `opportunityCount`, `salaryForProfession` → `[low, mid, high]`, format `num` / `money`.

Si `familyHasChildren` : Surface **Enfants** (prénom · âge).

## Panneau slide 1

Kicker `Lecture marché`. Titre = prénom du principal. Sous-titre = `familyLabel`.

- **Marché retenu :** métier, secteur, offres, médian, fourchette `bas – haut`.
- **Foyer** (si conjoint / exclus / enfants) : accompagnant, hors dossier, enfants.
- Note polygame inchangée : `Le Canada ne reconnaît qu’un conjoint. Une seule épouse peut accompagner le dossier.`

## Slides 2 et 3

Même coquille.

**Slide 2** — titre/lead actuels. Ranking provinces en lignes `Surface`. Panneau `Où viser` : 1re province du ranking, score, métier du principal.

**Slide 3** — titre/lead actuels. Quatre destinations (emplois, salaires, voies, comparateur) en tuiles type `ChoiceTile`. Panneau `Ensuite` + boutons identiques.

## Données

Helper pur `householdMarket(profile)` dans `src/lib/household-market.ts`.

- Adultes = candidat toujours ; conjoint si `familyHasSpouse` ; extra spouses si polygame.
- `selected` = `recommendPrincipal(profile).selected`.
- Labels : `Candidat` / `Conjoint` / `Épouse 1` / `Épouse ${index + 2}`.
- `accompanying` / `excluded` alignés sur `recommendPrincipal`.
- `kids` = `profile.children` si `familyHasChildren`, sinon `[]`.
- `family` = `familyLabel(profile)`.

Aucune édition de profil depuis Opportunités. Pas de nouvel appel réseau.

## Tests

- Vitest du helper : couple défaut (Loriane + Marc), seul, polygame (3 adultes, 1 exclus).
- Inspection source `src/features/market.test.ts` (pattern `profile.test.ts` / `canada-live.test.ts`) : chrome, champs, plus de `Rechercher`, `JobsSection` reste sur `Slide`.

## Hors scope

Emplois, salaires, calculateurs, provinces. Champs éditables. Cartes lieux Canada. Commits git (pas de repo projet).
