# Cohérence Regroupement dans le deck (hors Pitch)

Date: 2026-09-19

## Décision

Rendre le menu (sauf Pitch) pertinent pour closer un dossier **Regroupement familial** : lien parrainé, statut du répondant, revenu exigé (MNI / engagement), frais, coût de vie du **foyer une fois réuni**, et débouché de la personne parrainée après l’arrivée (conjoint / enfant en âge de travailler — pas les parents).

`slideCount` Voies reste **2**. Pitch **inchangé**.

Convention de closing : **le Candidat est le répondant au Canada**. La personne parrainée est le conjoint du profil, un enfant du profil, ou un parent (hors cartes adulte existantes). On n’inverse pas les rôles automatiquement.

## Profil

Champs sur le Candidat seulement, visibles si `objective === "Regroupement familial"` :

- `familyLink`: `"" | "spouse" | "child" | "parent"`
- `sponsorStatus`: `"" | "pr" | "citizen"`

Pas de préremplissage depuis le métier. Normaliser dans `normalizeProfile`.

Rappels sans bloquer la saisie :

- `spouse` sans conjoint au foyer : « ajoutez le conjoint au dossier »
- `child` sans enfant : « ajoutez un enfant »
- `parent` : possible en Seul(e) comme en Couple — pas de formulaire parent

`sponsorStatus` vide = fourchette « résident ou citoyen » dans les cartes.

## Données

- `family-links.ts` : Conjoint (3 ans), Enfant (10 ans), Parent (20 ans, super visa en parallèle)
- `family-lico.ts` : MNI ROC / engagement Québec ; majorateur parent × 1,3
- `family-fees.ts` : parrainage, traitement, droit de RP, biométrie, enfant, add-on MIFI si Québec

Taille du foyer pour le seuil = adultes du répondant déjà au Canada + enfants à charge + personnes parrainées (conjoint = +1 s’il n’est pas déjà au foyer ; parent = +1).

Coût de vie du foyer réuni : `livingBasket` annualisé, avec `extraAdults` pour un parent (et un conjoint encore absent du foyer). Revenu du répondant = médian `salaryForProfession` du candidat. La capacité financière reste un appoint affiché.

Helper `familyCost(profile)` : lien, engagement, délais QC vs ROC, taille, MNI, revenu métier, écart, frais, vie annuelle réunie, débouché conjoint / enfant, super visa si parent.

## Fiche Regroupement familial

Si `route.id === "family"` : quatre cartes.

1. Liens admissibles · Délais (engagement, hors Québec, Québec)
2. Engagement · Revenu (taille, seuil, médian métier, durée, écart)
3. Frais et vie · Foyer réuni
4. Personne parrainée (rappel si conjoint sans carte ; pas de salaire parent)

Mention « aperçu de démonstration. Pas un avis juridique. »

## Autres rubriques

Draft en direct (`s.draft`) : Voies, Comparateur, Canada Live, Échecs, Écosystème, Emplois, Salaires, Calculateurs, Provinces, Opportunités.

Canada Live : stats catégorie familiale, délais conjoint vs parents, Québec vs ROC. 4 slides conservées.

Calculateurs · Budget : Frais de parrainage, Revenu exigé (MNI), Coût de vie (foyer réuni).

Emplois / Salaires : deux pistes si conjoint au dossier ; une seule piste répondant si parent.

Échecs : toujours `money` si Regroupement, même en Seul(e).

## Hors scope

Pitch. Visite / Travail / Affaires / Études / RP (même contrat ailleurs). Pas de formulaire parents, pas de super visa comme voie séparée, pas de tirage Parents au-delà d’une mention.
