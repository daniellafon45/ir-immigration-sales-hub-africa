# Africa — Préparation concrète + UX Opportunités / Parcours

Date: 2026-09-19

## Intent

En closing Afrique, le prospect doit **saisir l’opportunité Canada** (surtout emploi) et **voir ce qu’IR prépare avant le dépôt** (test FR, emploi, preuves) — sans nouvelle slide ni honoraires.

## Décisions validées

- Portée **C** : Opportunités Canada **et** Écosystème & parcours.
- Préparation **A** : sous-liste courte (≤ 4 items) sous l’étape Préparation, pas d’expand, pas de timeline verticale.

## Psychologie (éthique)

- **Paradoxe du choix / Hick** : Emploi en carte vedette ; 5 autres en grille secondaire.
- **Activation energy** : checklist Préparation concrète (TEF/TCF, CV, documents, calendrier).
- **Goal-gradient** : parcours 01→05 lisible ; Préparation mise en avant.
- **Availability** : garder le drawer preuves existant (stats + presse).
- Interdit : emploi « garanti », nationalité automatique, tutoiement commercial.

## Données

`JourneyStep` gagne `items?: string[]` (optionnel).

Étape `prepare` :

- `body`: `Langue, emploi et preuves — avant le dépôt.`
- `items` (exactement 4) :
  1. `Test de français (TEF / TCF)`
  2. `CV & positionnement emploi`
  3. `Documents & preuves`
  4. `Calendrier cohérent`

Les 4 autres étapes restent sans `items`. IDs du parcours inchangés : `diagnostic`, `strategy`, `prepare`, `file`, `settle`.

## UI — Opportunités Canada

- Conserver les 6 thèmes `OPPORTUNITY_THEMES` et le drawer `opportunityPanel`.
- **Emploi** (`employment`) : carte vedette (span 2 colonnes dès `@min-[36rem]`), titre + body + « Voir preuves → ».
- Les 5 autres : grille secondaire égale.
- Aide courte sous la grille : `Cliquez une carte pour voir les preuves liées au profil.`
- Bandeau bas non cliquable inchangé.

## UI — Écosystème & parcours

- Piliers + partenaires : inchangés en contenu ; partenaires restent secondaires.
- Parcours : une bande horizontale (grille 5 cols dès `@min-[36rem]`), numéros `01`…`05`.
- Étape `prepare` : fond légèrement distinct (`bg-secondary/50` ou bordure primary) + liste à puces des `items`.
- Phrase sous le parcours inchangée : détail en rendez-vous.

## Hors scope

- Nouvelles slides catalogue.
- Expand / accordion / timeline verticale.
- Changer les CTA RDV / WhatsApp.
- Refonte du drawer preuves ou des articles presse.

## Tests

- `africa-funnel.test.ts` : `prepare.items` length 4 + contenus TEF/TCF et emploi.
- `ecosystem.test.ts` ou funnel : type/ids stables.
- `africa.test.ts` : registry inchangé.
