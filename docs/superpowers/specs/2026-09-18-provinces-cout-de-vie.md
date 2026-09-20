# Provinces — estimateur et comparateur de coût de vie

Date: 2026-09-18

## Décision

Restyler **Provinces** (2 slides) sur le chrome Emplois / Calculateurs, et remplacer le portrait « score / postes vacants » par un **estimateur** puis un **comparateur** de coût de vie **par ville**.

Le foyer compte : 1 ou 2 chambres, épicerie par adulte, transport par adulte, services du ménage, garde si enfants. Copy prospect. Pas de « Le commercial… ».

## Psychologie

- **Jobs to be done** : le prospect ne veut pas une fiche province. Il veut savoir si le net fait vivre une ville.
- **Anchoring** : panier mensuel d’abord, puis le détail.
- **Contrast** : Montréal vs Toronto vs Moncton — le même foyer, trois restes.
- **Mental accounting** : logement, épicerie, transport, services, garde.
- **Paradox of choice / Hick** : 12 villes démo, **3 villes max** à comparer.
- **Loss aversion** : un reste à 0 $ dit « le salaire disparaît ici ».
- **Availability** : des noms de villes, pas une moyenne provinciale.
- **Pratfall / honesty** : estimation de démonstration.
- Interdit : tutoyer le commercial, « version connectée ».

## Chrome

`OpportunitiesShell` sans `panel`. `Surface`, `SectionLabel`, `Select`. Pas de `À retenir` / `La question`. `slideCount` reste **2**. Pas d’écriture dans le store profil (ville choisie = `useState`).

## Données

`src/data/cost-of-living.ts` : 12 villes (QC, ON, AB, MB, NB, BC). Montants mensuels CAD démo.

Helper `src/lib/living-basket.ts` :

- `housing` = 2 ch. si conjoint **ou** enfants, sinon 1 ch.
- `grocery` = `grocery * adults + round(grocery * 0.5) * kids`
- `transport` = `transport * adults`
- `utilities` = ménage
- `childcare` = `childcare * kids`
- `total` = somme
- `netMonthly` = `householdLiving(profile).combinedNetMonthly`
- `remainder` = `max(0, net - total)`

## Slide 1 — Estimateur

**Kicker:** `Provinces · Coût de vie`  
**Titre:** `Le salaire ne paie pas une moyenne. Il paie une ville.`  
**Lead:** `Logement, épicerie, transport, services. Tout le foyer, pas un célibataire imaginaire.`  
**Pills:** family, province, métiers.

Sélecteurs `Province` + `Ville` (villes filtrées par province). Ville initiale = première ville de la province du profil.

Surface : lignes du panier + `Panier mensuel` + `Net du foyer` + `Reste estimatif` (featured). Masquer `Garde d’enfants` si 0 enfant. Mention `Estimation de démonstration.`

## Slide 2 — Comparateur

**Kicker:** `Provinces · Comparer`  
**Titre:** `La même vie ne coûte pas le même prix.`  
**Lead:** `Trois villes maximum. Celle qui laisse un reste rend le projet possible.`

Puces cliquables, max 3. Défaut : ville du profil + Toronto + Moncton (sans doublon).

Table : Ville, Logement, Épicerie, Transport, Services, Garde (si enfants), Panier, Reste.

Vide : `Choisissez jusqu’à trois villes pour comparer.`

## Hors scope

Calculateurs, Salaires, Emplois, Opportunités. Commits git. Données StatCan live.
