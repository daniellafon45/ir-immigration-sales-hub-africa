# Échecs fréquents — chrome Profil client + presse

Date: 2026-09-18

## Décision

Restyler **Échecs fréquents** (2 slides) sur le chrome Profil client / Emplois (`OpportunitiesShell`), comme Comparateur et Voies.

Slide 1 : les 8 erreurs, copy prospect, badge `Foyer` sur celles qui collent au ménage.

Slide 2 : **articles de presse réels** sur la détresse des immigrants, la pénurie de logement et le chômage / sous-emploi. Pas un slide citation seul.

`slideCount` reste **2**. Écosystème IR inchangé.

## Psychologie

- **Inversion** : montrer ce qui garantit l’échec (visa sans projet, arrivée sans logement, emploi « garanti »).
- **Loss aversion** : temps, argent, années.
- **Availability** : la presse rend le coût réel, pas un slogan de coaching.
- **Social proof / honesty** : sources publiques (Radio-Canada, StatCan, PBO, Institut du Québec). Pas de fake news.
- **Contrast** : le Canada n’est pas fermé ; arriver sans préparation coûte.
- Interdit : tutoyer le commercial, « Cette section sert à… », « aider le prospect », « version connectée ».

## Chrome

`OpportunitiesShell` sans `panel`. `Surface`, `SectionLabel`. Puces foyer (`family`, `province`, `objective`). Lecture profil seulement.

## Slide 1 — Erreurs

**Kicker:** `Échecs fréquents`  
**Titre:** `Les erreurs qui coûtent du temps, de l’argent et parfois plusieurs années.`  
**Lead:** `Arriver sans plan, c’est payer le prix du Canada avant d’en avoir les bénéfices.`  
**Pills:** family, province, objective.

Huit cartes (ids) :

| id | label | cost |
|---|---|---|
| program | Choisir un programme pour le visa au lieu du projet | Un visa obtenu n’est pas encore un projet. |
| rush | Déposer trop vite | Un dossier incomplet revient plus cher qu’un dossier complet. |
| money | Sous-estimer les preuves financières | Le foyer entier doit tenir, pas seulement le candidat. |
| employability | Ignorer l’employabilité | Un métier sans débouché bloque le plan. |
| housing | Arriver sans logement préparé | Un loyer trop haut mange le budget dès le premier mois. |
| job-myth | Croire qu’un emploi est garanti | Personne n’embauche sur un souhait. |
| counsel | Suivre des conseils non autorisés | Un mauvais conseil peut fermer une voie. |
| urgent | Attendre que tout soit urgent | L’urgence fait signer n’importe quoi. |

Badge `Foyer` via `highlightedFailureIds(profile)` (max 3) :

- Toujours `housing` et `job-myth`.
- `money` si conjoint ou enfant(s).
- `employability` si objectif Travail (si place).
- `program` si Études (si place).
- `counsel` si Visite (si place).

Couple RP par défaut : `housing`, `job-myth`, `money`.

## Slide 2 — Presse

**Kicker:** `Échecs fréquents · Presse`  
**Titre:** `Le Canada n’est pas un échec. L’arrivée sans préparation, si.`  
**Lead:** `Logement, emploi, santé mentale : la presse raconte ce qui arrive quand le projet s’improvise.`  
**Pills:** family, province, objective.

Six articles, deux par thème, liens externes réels :

| theme | label UI | sources |
|---|---|---|
| housing | Logement | Radio-Canada étudiants / pauvreté ; PBO écart de logements |
| jobs | Emploi | StatCan surqualification ; Institut du Québec chômage temporaires |
| distress | Détresse | Radio-Canada anxiété ; Radio-Canada « rêve canadien » |

Chaque carte : source, date, titre, extrait, `Lire l’article`.

Disclaimer : `Sources publiques. Aperçu de démonstration, pas un diagnostic.`

Citation en bas (Surface, plus un slide entier) : `Une bonne décision prise tôt coûte souvent moins cher qu’une mauvaise décision corrigée tard.`

## Hors scope

Pas d’écriture profil. Pas de changement catalog hors `echecs` (reste 2). Pas de git.
