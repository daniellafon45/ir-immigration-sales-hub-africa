# Guide salarial — chrome profil client + messages commerciaux

Date: 2026-09-18

## Décision

Restyler le **Guide salarial** (2 slides) sur le chrome Profil / Opportunités / Emplois. Afficher les fourchettes **par adulte du foyer**. Remplacer le comparatif « principal only » par deux cartes quand il y a un conjoint. Copy adressée au prospect (pas au commercial).

## Psychologie (closing)

- **Anchoring** : montrer le médian en premier visuel (bande featured), puis bas/haut.
- **Mental accounting** : slide 2 convertit le brut annuel en net annuel et net mensuel.
- **Contrast** : deux métiers du foyer = deux médianes, pas un seul chiffre magique.
- **Loss aversion** : le brut impressionne, le net décide si le loyer tient.
- **Pratfall / honesty** : dire que c’est une estimation de démonstration.
- **Peak-end** : panneau « La question ».
- Interdit : tutoyer le commercial, « version connectée », expliquer le prototype.

## Chrome

Réutiliser `OpportunitiesShell`, `Surface`, `SectionLabel`, `MetaPill`, `PanelBlock`, `JobsBriefingPanel`, `Band`.

`slideCount` reste **2**. Pas de `HoverRevealCards`. Pas d’édition de profil.

## Données

Helper `householdSalaries(profile)` dans `src/lib/household-salaries.ts`.

Pour chaque adulte de `householdMarket(profile).adults` :

- `low` / `mid` / `high` déjà sur l’adulte (via `salaryForProfession`)
- `bands` = `salaryData[profession] ?? salaryData.Comptable`
- `netAnnual` = `netEstimate(mid, provinceCode(profile.province))`
- `netMonthly` = `Math.round(netAnnual / 12)`

## Slide 1 — Fourchettes

**Kicker:** `Guide salarial`  
**Titre:** `Combien peut gagner un(e) {profession} ?` (métier du **principal**, via `smart`)  
**Lead:** foyer avec accompagnant : `Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes.` Sinon : `Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.`  
**Pills:** familyLabel, province, métier de chaque adulte.

Une Surface par adulte : `{label} · {profession}` + 3 Bandes Bas / Médian (featured) / Élevé + pastilles médian par province.

**Panneau kicker:** `À retenir`

Talks :

1. **Ancrage** — `Le médian n’est pas une offre d’emploi. C’est le milieu observé pour ce métier, dans cette province.`
2. **Foyer** — accompagnant : `{principal} et {accompagnant} n’ont pas le même médian. Deux métiers, deux fourchettes.` Sinon : `Le métier de {principal} a déjà une fourchette visible.`
3. **Province** — `Un même métier ne paie pas pareil à Québec, en Ontario ou en Alberta.`

**La question:** `Cette fourchette suffit-elle à faire vivre le projet au Canada ?`

## Slide 2 — Net

**Kicker:** `Guide salarial · Net`  
**Titre:** `Le salaire brut ne raconte pas toute l’histoire.`  
**Lead:** `Ce qui reste après les retenues, c’est ça qui paie le loyer.`

Une Surface par adulte : brut médian → net annuel → net mensuel. Mention `Estimation de démonstration.`

Talks :

1. **Écart** — `Le brut impressionne. Le net décide si le projet tient.`
2. **Province** — `Les retenues changent selon la province. Le même brut ne donne pas le même reste.`
3. **Honnêteté** — `C’est une estimation de démonstration. Les tables fiscales officielles viendront ensuite.`

**La question:** `Avec ce net, le projet devient-il plus concret ou plus fragile ?`

## Hors scope

Emplois, Opportunités, Provinces. Commits git.
