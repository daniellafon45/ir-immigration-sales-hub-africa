# Opportunités Canada — panneau preuve (cartes cliquables)

Date: 2026-09-19

## Décision

Rendre les **6 cartes** d’`AfricaOpportunitiesSection` cliquables. Au clic, un **drawer droit** s’ouvre sur la même slide avec :

1. 3–4 stats liées au **profil client**
2. 1 graphique en **barres CSS** (même langage que Salaires / Provinces)
3. **2 articles de presse** publics réels
4. Disclaimer : `Sources publiques. Aperçu de démonstration, pas un diagnostic.`

Le bandeau « Immigrer pour réussir… » reste **non cliquable**.

## Psychologie

- **Availability + Authority** : la presse rend le Canada concret (sources publiques).
- **Contrast / projection** : les chiffres du foyer personnalisent la preuve.
- **Commitment** : un petit clic avant le RDV.
- **Hick** : un panneau, trois blocs, une fermeture claire.
- Interdit : tutoyer le commercial, promesse de nationalité automatique, travail hors statut.

## Chrome

`OpportunitiesShell` inchangé. Drawer overlay à l’intérieur de la section (backdrop + Escape + bouton fermer). Cartes en `<button>` avec `aria-expanded` / état sélectionné.

## Thèmes

| id | Titre carte | Stats profil | Graphique |
|---|---|---|---|
| study | Études | programme, scolarité, preuve de fonds, délai | frais de scolarité par province (extrait grille) |
| employment | Emploi | offres liées, part intl, demande métier | score de demande par adulte |
| salary | Salaire & aides | net mensuel, loyer, reste | répartition net / loyer / autres |
| nationality | Nationalité | jalons RP → citoyenneté (curated + délais IRCC) | timeline en barres (années / mois) |
| business | Entrepreneuriat | voie, investissement, capital à montrer | seuils C11 / PNP par province (extrait) |
| flexibility | Flexibilité | permis possibles, conjoint, PR après | voies ouvertes vs fermées |

## Presse

Deux articles par thème (`OpportunityPressArticle` : theme, source, date, title, excerpt, url, image). URLs publiques réelles uniquement.

## Modules

- `src/data/opportunity-proof.ts` — thèmes + articles + labels
- `src/lib/opportunity-panel.ts` — `opportunityPanel(theme, profile)` → `{ title, stats, chart, articles, disclaimer }`
- UI dans `src/features/africa.tsx`

## Hors scope

- Bandeau bas cliquable
- Navigation vers d’autres slides
- Nouvelle lib de charts
