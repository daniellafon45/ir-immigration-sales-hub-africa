# Calculateurs — chrome profil client + foyer

Date: 2026-09-18

## Décision

Réintégrer **Calculateurs** (3 slides) entre Guide salarial et Provinces. Même chrome que Emplois / Guide salarial : `OpportunitiesShell` sans panneau, Surfaces foyer, copy prospect. Retirer « Le commercial peut modifier… ».

Le calculateur **reste interactif** (brut + province en local). On n’écrit pas dans le store profil.

## Psychologie

- **Mental accounting** : brut → net annuel → net mensuel.
- **Contrast** : deux métiers, deux restes.
- **Loss aversion** : le loyer mange le net.
- **Honesty** : estimation de démonstration.
- Interdit : tutoyer le commercial, « version connectée ».

## Chrome

`OpportunitiesShell`, `Surface`, `SectionLabel`, `MetaPill`, `Band` si utile. Pas de `panel=`. Pas de `JobsBriefingPanel`. Pas de `À retenir` / `La question`. `slideCount` = **3**.

## Données

Helper `householdLiving(profile)` :

- reprend `householdSalaries`
- `combinedNetMonthly` = somme des nets mensuels
- `rent` = `provinceData[provinceCode].rent`
- `other` = `1700`
- `remainder` = `Math.max(0, combinedNetMonthly - rent - other)`

`draftNet(gross, code)` pour le calcul en direct : `netEstimate` + mensuel arrondi.

## Slide 1 — Salaire net

**Kicker:** `Calculateur · Salaire net`  
**Titre:** `Combien reste-t-il réellement après les retenues ?`  
**Lead couple:** `Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes.`  
**Lead solo:** `Le brut impressionne. Le net, c’est ça qui paie le loyer.`  
**Pills:** family, province, métiers.

Une Surface par adulte : brut (input, init = médian), province (select, init = province du profil), net annuel, `≈ {netMonthly} / mois`.

Labels : `Salaire annuel brut` `Province` `Net annuel estimatif`.

## Slide 2 — Coût de la vie

**Kicker:** `Calculateur · Coût de la vie`  
**Titre:** `Que vaut ce salaire à {province} ?` via `smart`  
**Lead:** `Un salaire n’existe pas tout seul. Il se mesure au loyer.`

Une Surface foyer : net mensuel combiné, loyer, autres dépenses (1 700 $), reste. Si couple, lister aussi le net mensuel de chaque adulte (sans recouper le loyer).

Labels : `Net mensuel` `Loyer indicatif` `Autres dépenses estimées` `Reste estimatif`.

## Slide 3 — Budget projet

**Kicker:** `Calculateur · Budget projet`  
**Titre:** `Combien faut-il préparer pour démarrer ?`  
**Lead:** `Un projet Canada, ce n’est pas seulement des honoraires.`

Cartes : `Honoraires IR` = `money(Math.min(profile.budget || 5000, 5000))` ; `Démarches & tests` `À estimer` ; `Installation` `À estimer` ; `Fonds de sécurité` `À prévoir`.

## Hors scope

Emplois, Opportunités, Salaires, Provinces. Commits git.
