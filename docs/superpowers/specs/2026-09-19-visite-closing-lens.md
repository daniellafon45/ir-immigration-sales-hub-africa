# Cohérence Visite dans le deck (hors Pitch)

Date: 2026-09-19

## Décision

Rendre le menu (sauf Pitch) pertinent pour closer un dossier **Visite** : motif, durée, frais de visa / eTA / biométrie, coût du séjour (pas une année complète), fonds à démontrer, attaches au pays, et accompagnants s’ils sont au dossier — **sans jamais vendre un droit de travailler**.

`slideCount` Voies reste **2**. Pitch **inchangé**. Contrat Études : champs profil + helper + fiche Voies + menu (sauf Pitch) + `s.draft`.

## Profil

Champs sur le Candidat seulement, visibles si `objective === "Visite"` :

- `visitPurpose`: `"" | "family" | "tourism" | "business"`
- `visitDuration`: `"" | "15d" | "1m" | "3m" | "6m"`

Pas de préremplissage depuis le métier. Le conjoint n’a pas de motif distinct.

Sans motif / sans durée : le helper assume tourisme · 1 mois, affiché comme **aperçu**.

Normaliser dans `normalizeProfile`.

## Données

- `visit-purposes.ts` : 3 motifs (`id`, `name`, `ties`, `hostUseful`)
- `visit-fees.ts` : visa 100 $, eTA 7 $, biométrie 85 $ / personne, plafond foyer 170 $. eTA seulement si le pays est dans une petite liste démo
- `visit-funds.ts` : grille démo durée × taille du foyer, distincte du panier

Coût du séjour : `livingBasket.total` **sans annualiser** (`15d` × 0,5, `1m` × 1, `3m` × 3, `6m` × 6).

Helper `visitCost(profile)` : motif, durée, frais foyer, séjour, fonds, écart, billets démo, `accompanying` si conjoint/enfants, `canWork: false`. Aucun champ salaire.

## Fiche Visa visiteur

Si `route.id === "visit"` : trois cartes toujours, plus une quatrième si conjoint ou enfant.

1. **Frais de voyage · Visa / eTA / biométrie** — lignes Visa / eTA / Biométrie ; colonnes par personne | foyer ; pastille pays ; eTA vs visa
2. **Séjour · Foyer** — durée, coût séjour, fonds, frais foyer, aller-retour, ligne d’écart IRCC
3. **Motif et attaches** — motif choisi (sinon les 3) ; attaches ; invitation si `family` ; « un visa visiteur n’autorise pas à travailler ni à étudier »
4. **Accompagnants** — seulement si conjoint et/ou enfants : qui voyage, statut visiteur, frais additionnels, pas de permis de travail / pas d’école sans permis d’études

Mention « Aperçu de démonstration. Pas un avis juridique. »

## Autres rubriques

Draft en direct (`s.draft`) :

- Canada Live : overlay visiteurs (visas, eTA, délais, pas un droit de travailler). 4 slides. RP inchangé.
- Opportunités : pas de `WorkBenefitsSection` ; 3 puces statut visiteur
- Emplois / Salaires : 2 slides conservées ; recadrage « pas un droit de travailler » ; pas de piste `accompanying` / `openWork`
- Calculateurs · Budget : `Frais de visa`, `Coût du séjour`, `Fonds à démontrer`
- Provinces : panier = séjour ; pastille Visite ; lead « ce que coûte un mois sur place, pas une installation »
- Comparateur : pastille motif si choisi
- Échecs : `counsel` + `job-myth` visibles
- Écosystème : foyer / objectif / motif

## Hors scope

Pitch. Travail / Regroupement / Affaires / Études / RP. Taux de refus par pays, lettre d’invitation, simulateur d’attaches.
