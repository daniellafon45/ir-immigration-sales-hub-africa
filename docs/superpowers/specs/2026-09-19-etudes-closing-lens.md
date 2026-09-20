# Cohérence Études dans le deck (hors Pitch)

Date: 2026-09-19

## Décision

Rendre le menu (sauf Pitch) pertinent pour closer un dossier **Études** : programme nommé, tarifs cégep/université **toutes provinces**, coût de vie du foyer, preuve de fonds, débouchés (salaire, stage, employabilité), et emploi/salaire du conjoint s’il est au dossier.

`slideCount` Voies reste **2**. Pitch **inchangé**.

## Profil

Champs sur le Candidat seulement, visibles si `objective === "Études"` :

- `studyLevel`: `"" | "cegep" | "bachelor" | "master" | "doctorate"`
- `studyProgramId`: `""`

Pas de préremplissage depuis le métier. Changer le niveau vide le programme incompatible. Conjoint : pas de programme.

Normaliser dans `normalizeProfile`.

## Données

- `study-programs.ts` : programmes nommés (`profession`, `employability`)
- `study-tuition.ts` : scolarité internationale annuelle, 13 provinces × 4 niveaux
- `study-funds.ts` : subsistance IRCC (ROC) / CAQ (QC) selon étudiant, conjoint, enfant

Coût de vie : `livingBasket` annualisé.

Helper `studyCost(profile)` : grille, scolarité, vie, fonds, preuve de fonds, débouché étudiant, débouché conjoint si foyer avec conjoint.

Si un programme est choisi, salaires/emplois de l’étudiant suivent `program.profession`. Sinon le métier du candidat. Le conjoint garde son métier.

## Fiche Permis d’études

Si `route.id === "study"` :

1. Grille tarifs Cégep vs Université, 13 lignes, province du dossier mise en avant
2. Année 1 · Foyer : vie, subsistance, scolarité, preuve de fonds, écart
3. Après le diplôme · Programme : salaire, stage, employabilité
4. Pendant les études · Conjoint parrainé : seulement si conjoint (métier, salaire approx, employabilité, permis ouvert)

## Autres rubriques

Draft en direct (`s.draft`) : Voies, Comparateur, Canada Live, Échecs, Écosystème.

Canada Live : stats étudiants si objectif Études.

Calculateurs · Budget : Scolarité, Coût de vie, Preuve de fonds.

## Hors scope

Pitch. Visite / Regroupement / Travail / Affaires / RP (même contrat plus tard).
