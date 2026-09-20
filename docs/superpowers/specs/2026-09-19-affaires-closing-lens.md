# Cohérence Affaires dans le deck (hors Pitch)

Date: 2026-09-19

## Décision

Rendre le menu (sauf Pitch) pertinent pour closer un dossier **Affaires** : volet nommé, seuils d’investissement **toutes provinces**, coût de vie du foyer, capital à démontrer, crédibilité (expérience + capacité), et emploi/salaire du conjoint s’il est au dossier et que le volet ouvre un permis.

`slideCount` Voies reste **2**. Pitch **inchangé**. Le visa démarrage est une **mention de pause IRCC**, pas un volet déposable.

## Profil

Champ sur le Candidat seulement, visible si `objective === "Affaires"` :

- `businessPath`: `"" | "visitor" | "c11" | "ict" | "pnp-entrepreneur"`

Pas de préremplissage depuis le métier. Conjoint : pas de volet.

`visitor` = visiteur d’affaires (pas d’exploitation quotidienne). `c11` = entrepreneur / avantage notable. `ict` = transfert intra-entreprise. `pnp-entrepreneur` = volet provincial.

La capacité du candidat (`applicant.salary` → `financialCapacityAmount`) sert de **fonds personnels approximatifs**. Pas de second champ « valeur nette ».

Normaliser dans `normalizeProfile`.

## Données

- `business-paths.ts` : 4 volets (`needsInvestment`, `spouseOpenEligible`, `workAllowed`, `caution`) + `startupVisaPaused`
- `business-thresholds.ts` : minima de démonstration, 13 provinces × 2 colonnes (C11 / fonds de roulement | Entrepreneur provincial)

Visiteur d’affaires et ICT n’utilisent pas la grille comme un seuil d’investissement.

Coût de vie : `livingBasket` annualisé dès qu’on n’est plus en simple visiteur.

Helper `businessCost(profile)` : grille, seuil, vie ou séjour court, fonds personnels, capital à démontrer, écart, crédibilité (trois pastilles), débouché conjoint si foyer avec conjoint.

Le métier du candidat n’est pas le produit : c’est le projet. Les salaires marché restent un **plan B salarial**.

## Fiche Affaires

Si `route.id === "business"` :

1. Volets · Seuils d’investissement : 13 lignes, province du dossier mise en avant ; visa démarrage = pause IRCC
2. Année 1 · Capital : investissement, vie (ou séjour court), fonds personnels, capital, écart
3. Projet · Crédibilité : expérience, capacité, province / volet, caution
4. Pendant le projet · Conjoint : seulement si conjoint (métier, salaire approx, employabilité, permis ouvert — ou « visite, pas un permis de travail »)

## Autres rubriques

Draft en direct (`s.draft`) : Voies, Comparateur, Canada Live, Échecs, Écosystème.

Canada Live : stats gens d’affaires / C11 / volets provinciaux / pause Start-up Visa si objectif Affaires.

Calculateurs · Budget : Investissement, Coût de vie, Capital à démontrer — ou Frais de voyage / Coût du séjour / Fonds à démontrer si visiteur.

Opportunités : « le projet doit être crédible ici ». `WorkBenefitsSection` seulement si le volet autorise le travail.

Emplois / Salaires : fourchettes = ce que paierait le métier si le projet ne tient pas.

## Hors scope

Pitch. Visite / Regroupement / Travail / Études / RP (même contrat plus tard). Pas de business plan généré, pas de Start-up Visa déposable, pas de liste d’incubateurs.
