# Task 4 Report: Regroupement data

## Ce que j’ai implémenté

- Créé `src/data/family-links.ts` avec les 3 liens `spouse`, `child`, `parent`, leurs noms français, durées d’engagement ROC, droit au travail après arrivée et indicateur `superVisaAlt`.
- Créé `src/data/family-lico.ts` avec les grilles `rocMni` et `quebecEngagement`, le majorateur parent `1.3`, `sizeFor(profile)` et `requiredIncome(province, familySize, link)`.
- Créé `src/data/family-fees.ts` avec les frais démo demandés: parrainage `85`, traitement `545`, RP `575`, biométrie `85`, supplément enfant `155`, ajout Québec `300`.
- Créé `src/lib/family-cost.ts` pour calculer le lien, le statut du répondant, la taille du foyer, le revenu requis, le salaire médian du répondant, l’écart au seuil, les frais, le coût de vie du foyer réuni, le délai IRCC `family`, le cas conjoint parrainé et le drapeau `superVisa`.

## TDD

1. RED
   - Commande: `npx vitest run src/lib/family-cost.test.ts src/data/family-lico.test.ts`
   - Résultat: échec attendu sur imports non résolus car `@/lib/family-cost` et `@/data/family-lico` n’existaient pas encore.
2. GREEN
   - Même commande relancée après implémentation.
   - Résultat: `2` fichiers, `5` tests passés.

## Vérifications

- `src/data/family-lico.test.ts` valide les grilles, le majorateur parent, le helper de taille et le choix Québec/ROC.
- `src/lib/family-cost.test.ts` valide le cas `spouse` en couple et le cas `parent` en solo, sans inventer de salaire parent.
- Contrôle lints ciblé prévu sur les nouveaux fichiers après création.

## Point d’attention

- Le brief ne donnait pas les chiffres détaillés de grille MNI/Québec dans le texte; les tableaux démo ont donc été figés explicitement dans `family-lico.ts` et couverts par tests pour stabiliser la suite.

## Fix review findings

- `src/data/family-links.ts`: suppression du fallback implicite vers `spouse`; `familyLinkById("")` et un identifiant inconnu renvoient désormais `undefined`.
- `src/lib/family-cost.ts`: plus de simulation conjointe inventée si `familyLink` est vide/invalide; l’objet reste exploitable, `reminder` ne s’active que pour un vrai lien `spouse` sans conjoint au dossier, et `superVisa` retombe à `false` sans lien valide.
- `src/data/family-fees.ts`: conservation de `rprf = 575` pour `child`, tout en gardant `childExtra = 155` et l’ajout Québec `300`.
- `src/data/family-lico.ts`: détection Québec alignée sur `provinceCode()`, y compris pour une province vide si elle suit le fallback `QC`.

## RED/GREEN evidence

1. RED
   - Commande: `npx vitest run src/lib/family-cost.test.ts src/data/family-lico.test.ts`
   - Résultat: `2` fichiers en échec, `3` tests rouges sur les points attendus:
     - `requiredIncome("", 2, "child")` retournait `37158` au lieu de `39600`
     - `familyLinkById("")` retombait sur `spouse` au lieu de `undefined`
     - `familyFeesFor(...child...)` mettait `rprf` à `0` au lieu de `575`
   - Extrait:
     ```text
     ❯ src/data/family-lico.test.ts (3 tests | 1 failed)
     ❯ src/lib/family-cost.test.ts (4 tests | 2 failed)
     Tests  3 failed | 4 passed (7)
     ```
2. GREEN
   - Même commande relancée après correctif
   - Résultat: `2` fichiers passés, `7` tests passés
   - Extrait:
     ```text
     ✓ src/data/family-lico.test.ts (3 tests)
     ✓ src/lib/family-cost.test.ts (4 tests)
     Test Files  2 passed (2)
     Tests  7 passed (7)
     ```
