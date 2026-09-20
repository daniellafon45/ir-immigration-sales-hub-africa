# Pitch mosaïque — cartes cliquables (panneau preuve)

Date: 2026-09-20

## Intent

Rendre les 4 cartes de `africa-mosaic` cliquables. Au clic : drawer droit (même UX que Opportunités) avec stats profil + graphique + 2 articles presse.

## Psychologie

- Availability + Authority (presse)
- Commitment (petit clic)
- Hick (un panneau, fermeture claire)

## Mapping cartes → thèmes

| Carte | theme id |
|-------|----------|
| ÉTUDIER | study |
| TRAVAILLER | employment |
| ENTREPRENDRE | business |
| S’INSTALLER | nationality |

## Implémentation

- Réutiliser `opportunityPanel` + `ProofDrawer` (extraire si besoin)
- `AfricaMosaic` : buttons + état + Escape
- Hint copy sous la grille
- Spec tests : mapping + aria-expanded

## Hors scope

- Autres slides pitch
- Nouveaux thèmes presse
