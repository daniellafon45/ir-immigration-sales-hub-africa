# Emplois — chrome profil client + messages commerciaux

Date: 2026-09-18

## Décision

Restyler **Emplois** (2 slides) sur le chrome Profil / Canada Live / Opportunités. Afficher les postes **par adulte du foyer**. Remplacer le coaching interne (« Le commercial… », « Dans la version connectée… ») par des **messages de closing** adressés au prospect.

## Psychologie (closing)

- **Jobs to Be Done** : le prospect n’achète pas une table ; il veut un employeur réel.
- **Availability** : noms d’employeurs, villes, salaires visibles tout de suite.
- **Social proof** : badge International vs Local.
- **Loss aversion (slide 2)** : un poste local peut faire rêver trop tôt s’il n’embauche pas depuis l’étranger.
- **Paradox of choice** : garder une courte liste de démonstration, pas un dump.
- **Peak-end** : panneau « La question » pour fermer la slide.
- Interdit : tutoyer le commercial, expliquer le prototype, « version connectée ».

## Chrome

Réutiliser `OpportunitiesShell`, `Surface`, `SectionLabel`, `MetaPill`, `PanelBlock`, `FactRow` déjà dans `market.tsx`.

`slideCount` reste **2**. Pas de `HoverRevealCards`. Pas d’édition de profil.

## Données

Chaque `Job` a un champ `profession` aligné sur `@/data/profile`.

- 5 postes actuels → `Comptable` (inchangés titre/employeur/salaire/intl).
- Ajouter 3 postes `Développeur logiciel` (2 intl, 1 local).
- Ajouter 2 postes `Infirmier(ère)` (1 intl, 1 local).

Helper `householdJobs(profile, { intlOnly?: boolean })` :

- Adultes = `householdMarket(profile).adults`.
- `jobs` = postes dont `profession` égale `adult.member.profession`.
- `intlOnly: true` → `job.intl` seulement.
- Groupe vide autorisé (métier sans démo).

## Slide 1 — Aujourd’hui

**Kicker:** `Emplois`  
**Titre:** `Voyons les postes disponibles aujourd’hui.`  
**Lead:** `Un employeur, un lieu, un salaire. C’est ça, un marché réel.`  
**Pills:** familyLabel, province, métier de chaque adulte.

Une Surface par adulte : `{label} · {profession}` + table Poste / Employeur / Lieu / Salaire / badge.  
Vide : `Pas encore de postes de démonstration pour ce métier.`

**Panneau kicker:** `À retenir`  
**Titre:** prénom du principal. Sous-titre: familyLabel.

Talks (verbatim) :

1. **Preuve** — `Ces intitulés existent déjà. Le projet n’est plus une idée : il a des noms d’employeurs.`
2. **Foyer** — s’il y a un accompagnant : `{principal} et {accompagnant} n’ont pas le même marché. Deux métiers, deux listes.` Sinon : `Le métier de {principal} se relie déjà à des postes ouverts.`
3. **Nuance** — `Un poste local n’embauche pas depuis l’étranger. Il reste utile une fois arrivé.`

**La question:** `Lequel de ces employeurs vous projette déjà au Canada ?`

Les phrases foyer interpolent les prénoms (Loriane / Marc), pas des placeholders visibles.

## Slide 2 — International

**Kicker:** `Emplois · International`  
**Titre:** `Tous les employeurs n’embauchent pas depuis l’étranger.`  
**Lead:** `Les postes internationaux ouvrent une porte maintenant. Les postes locaux attendent l’arrivée.`  
Chips : `International`, province, métiers du foyer, `Temps plein`.  
Même grilles, filtrées `intlOnly`.

Talks :

1. **Filtre** — `International, ce n’est pas un badge de prestige. C’est un employeur qui peut vous parler avant le visa.`
2. **Piège** — `Un beau salaire local peut faire rêver trop tôt. S’il n’embauche pas à l’étranger, il n’avance pas le dossier aujourd’hui.`
3. **Suite** — `Une fois le bon type de poste isolé, on parle salaire net et province. Pas avant.`

**La question:** `Parmi les postes internationaux, lequel justifie de continuer le dossier ?`

## Hors scope

Salaires, calculateurs, provinces, Opportunités. Commits git. Nouvel appel réseau.
