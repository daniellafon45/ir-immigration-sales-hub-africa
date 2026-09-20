# Guide salarial — années reconnues et closing

Date: 2026-09-19

## Décision

Remplir le vide sous Bas / Médian / Élevé par un bloc lecture seule : années déclarées vs années reconnues au Canada, palier salarial, écart en dollars, et 3 faits de closing.

Le catalogue `salaires.slideCount` reste **1** (état actuel). L’écho net mensuel au palier reconnu s’affiche sur cette unique slide, pas sur une 2e slide Net.

Copy adressée au prospect. Pas de curseur. Pas de `JobsBriefingPanel` / `panel=` / « À retenir ».

## Psychologie (closing)

- **Loss aversion + contrast** : l’écart « si les années comptent » vs « ce que le marché paie sans reconnaissance ».
- **Anchoring** : les 3 Bandes restent au-dessus ; le bloc mesure le candidat contre elles.
- **Goal-gradient** : « il manque X années reconnues pour viser le palier Médian / Élevé ».
- **Authority** : nommer l’ordre quand le métier est réglementé.
- **Pratfall / honesty** : estimation de démonstration.
- **Hick** : un seul bloc, pas de 3e CTA.
- **Mental accounting** : écart annuel brut + net mensuel au palier reconnu.

Interdit : « le commercial », « version connectée ».

## Données

Helper `recognitionFor` dans `src/lib/salary-recognition.ts`.

Paliers discrets :

- 0–2 ans → Bas (`band[0]`)
- 3–7 ans → Médian (`band[1]`)
- 8 ans et + → Élevé (`band[2]`)

Années reconnues (estim.) = `min(déclarées, max(0, round(experience × facteur)))`.

Facteurs (démo, pas une table IRCC) :

- Comptable : 0,4 — réglementé — `Ordre comptable (CPA)`
- Infirmier(ère) : 0,35 — réglementé — `OIIQ / ordre provincial`
- Développeur logiciel : 0,8 — non réglementé
- Électromécanicien : 0,55 — réglementé — `Certification de métier`
- Autre : 0,5

`householdSalaries` attache `recognition` à chaque groupe, calculé sur la phase marché / après-études / openWork (**pas** le stage).

Exemple foyer par défaut, Québec :

- Loriane, 5 ans, Comptable → 2 ans reconnus → Bas 52 000 $ vs Médian 72 000 $ → écart 20 000 $
- Marc, 8 ans, Développeur → 6 ans reconnus → Médian 90 000 $ vs Élevé 125 000 $ → écart 35 000 $

## UI

Dans `SalariesBoard`, sous les phases de chaque Surface :

1. Échelle 3 paliers (`ir-equal-row`) : `0–2 ans` / `3–7 ans` / `8 ans et +` avec Bas / Médian / Élevé.
   - Palier reconnu : style featured. Badge `Reconnu`.
   - Palier déclaré si différent : contour. Badge `Si les années comptent`.
   - Même palier : badge `Déclaré et reconnu`.
2. 4 pastilles (`ir-auto-grid-sm`) : `Années déclarées` · `Années reconnues (estim.)` · `Écart salarial` · `Net mensuel à ce palier`.
3. 3 chips :
   - Réglementé : `Métier réglementé · {ordre}` ; sinon `Métier non réglementé · les années transférent mieux`.
   - Langue QC si français < Avancé : `Le médian suppose un français qui tient au travail.` Hors QC, même logique sur l’anglais. Sinon `La langue tient. L’écart vient surtout de la reconnaissance.`
   - Réglementé : `Équivalence : 12–24 mois, ordre de grandeur.` Sinon `L’expérience canadienne accélère le palier.`
4. Honnêteté : `Estimation de démonstration. La reconnaissance réelle dépend du permis, du CNP et de l’ordre.`
5. Si écart de palier : `Il manque {n} année(s) reconnue(s) pour viser le palier {Médian|Élevé}.`
6. Écho net : `À {n} ans reconnus : {net mensuel} net / mois.`
7. Foyer 2+ : `Deux métiers : deux reconnaissances. L’écart du foyer s’additionne.`
8. Close sous le board : `Sans reconnaissance, on part souvent du palier Bas. Le dossier sert aussi à faire compter ces années.`

Études : le bloc s’accroche à la phase après-études, pas au stage. Visite : le bloc reste.

Responsive : `ir-equal-row` + `ir-auto-grid-sm`, pas de `sm:grid-cols-3`, pas de `flex-1` qui recrée un vide. Lecture seule.

## Hors scope

Emplois, Opportunités, Provinces, Calculateurs, 2e slide salaires, curseur, interpolation continue, commits git.
