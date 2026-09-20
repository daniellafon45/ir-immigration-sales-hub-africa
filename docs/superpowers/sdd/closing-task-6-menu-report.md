# Task 6 Menu lenses report

## Résumé

Implémentation complète de la Task 6 pour les surfaces menu du closing deck IR Sales Hub:

- `Canada Live` étendu à `Travail`, `Visite`, `Affaires` et `Regroupement familial` avec 4 pages conservées et identité inchangée pour la RP par défaut.
- Helper partagé `closingDeckPills(profile)` créé puis branché sur `Opportunités`, `Emplois`, `Salaires`, `Calculateurs`, `Provinces`, `Comparateur`, `Échecs` et `Écosystème`.
- `Échecs` mis à jour pour forcer `money` sur `Affaires` et `Regroupement familial`, même en `Seul(e)`.
- `CalculatorsBudget` rendu objectif-spécifique pour `Travail`, `Visite`, `Affaires` et `Regroupement familial`, sans casser le fallback RP ni `Études`.
- `Opportunités` recadré pour masquer `WorkBenefitsSection` sur `Visite` et `Affaires + visitor`, avec les 3 puces exactes demandées.
- `householdSalaries` étendu pour gérer les pistes `Visite`, `Travail`, `Affaires` et `Regroupement familial`.
- `JobsToday`, `JobsIntl`, `SalariesBands` et `Provinces` recadrés avec les messages demandés sur le statut, l’arrivée et la réunification.

## TDD

### RED

Commande exécutée:

```bash
npx vitest run src/data/canada-live.test.ts src/lib/failure-press.test.ts src/lib/household-salaries.test.ts src/features/market.test.ts src/features/sales.test.ts
```

Résultat RED observé:

- `src/features/sales.test.ts` cassait d’abord car `@/lib/closing-pills` n’existait pas.
- `src/data/canada-live.test.ts` échouait car les overlays `Travail`, `Visite`, `Affaires`, `Regroupement familial` n’étaient pas implémentés.
- `src/lib/failure-press.test.ts` échouait car `money` n’était pas forcé pour `Affaires` et `Regroupement familial` en solo.
- `src/lib/household-salaries.test.ts` échouait car `Travail` ne créait pas la piste conjoint `openWork` et `Regroupement familial` ne recadrait pas le groupe conjoint en `Après l’arrivée`.
- `src/features/market.test.ts` échouait car les nouvelles branches source-string `Visite`, `Affaires visitor`, budgets spécifiques et helper partagé n’étaient pas présentes.

Extrait du constat RED:

- 5 fichiers de tests en échec
- 12 tests en échec
- erreurs attendues de type `toContain`, identité inchangée sur `canadaLivePagesFor`, et import manquant du helper

### GREEN

Même commande relancée après implémentation:

```bash
npx vitest run src/data/canada-live.test.ts src/lib/failure-press.test.ts src/lib/household-salaries.test.ts src/features/market.test.ts src/features/sales.test.ts
```

Résultat GREEN:

```text
✓ src/features/market.test.ts (36 tests)
✓ src/features/sales.test.ts (14 tests)
✓ src/lib/failure-press.test.ts (4 tests)
✓ src/lib/household-salaries.test.ts (11 tests)
✓ src/data/canada-live.test.ts (16 tests)

Test Files  5 passed (5)
Tests       81 passed (81)
```

## Fichiers modifiés

- `src/lib/closing-pills.ts`
- `src/data/canada-live.ts`
- `src/data/canada-live.test.ts`
- `src/lib/failure-press.ts`
- `src/lib/failure-press.test.ts`
- `src/lib/household-salaries.ts`
- `src/lib/household-salaries.test.ts`
- `src/features/market.tsx`
- `src/features/market.test.ts`
- `src/features/sales.tsx`
- `src/features/sales.test.ts`
- `src/features/immigration.tsx`

## Détails d’implémentation

### 1. Helper partagé de pills

Ajout de `closingDeckPills(profile)` avec les règles:

- `Travail`: `CNP · FEER n`
- `Visite`: nom du motif
- `Affaires`: nom du volet
- `Regroupement familial`: nom du lien
- sinon `[]`

Le helper a été branché sur les surfaces menu demandées et a remplacé la logique locale de `closingPills` dans `immigration.tsx`.

### 2. Canada Live

`canadaLivePagesFor(profile)`:

- retourne toujours la même identité `canadaLivePages` pour `Résidence permanente`
- conserve `Études`
- ajoute des overlays dédiés pour `Travail`, `Visite`, `Affaires`, `Regroupement familial`
- conserve 4 pages par objectif
- garde 4 stats par page
- n’introduit pas de `—` ni `–` dans le JSON des overlays

### 3. Échecs

`highlightedFailureIds(profile)`:

- base inchangée `housing`, `job-myth`
- `money` conservé pour foyer avec conjoint ou enfants
- `money` forcé aussi pour `Affaires` et `Regroupement familial`, même en solo
- le cap à 3 garde naturellement `money` avant toute épice métier car l’ajout se fait avant `employability` / `program` / `counsel`

### 4. Opportunités / Emplois / Salaires

- `WorkBenefitsSection` masqué pour `Visite`
- `WorkBenefitsSection` masqué pour `Affaires + visitor`
- mêmes 3 puces exactes affichées dans ces cas
- recadrage des titres/leads pour `Visite`, `Affaires`, `Regroupement familial`
- mention `pas un droit de travailler` ajoutée sur les branches `Visite`
- mention `Après l’arrivée` ajoutée pour la lecture familiale conjoint

### 5. householdSalaries

Nouvelles branches:

- `Visite`: 2 groupes marché max, aucun `openWork`
- `Travail`: conjoint en `accompanying/openWork` seulement si `workPathways(profile).spouseOpen?.eligible`
- `Affaires + visitor`: même logique que `Visite`
- `Affaires` autres volets: conjoint en `openWork` seulement si `businessCost(profile).spouseOpen`
- `Regroupement familial + spouse`: deux groupes `market`, le conjoint devient `Après l’arrivée · {profession}`
- `Regroupement familial + parent`: un seul groupe, jamais de salaire inventé pour le parent

### 6. Calculateurs / Provinces / Écosystème

- `CalculatorsBudget` gère désormais toutes les cartes demandées par objectif
- `Provinces` ajoute les `closingDeckPills`
- le lead `Visite` de `Provinces` utilise exactement `ce que coûte un mois sur place, pas une installation`
- `Écosystème` et `Échecs` utilisent maintenant les pills partagées sans ajouter de nouveaux piliers

## Self-review

Points revus manuellement:

- pas de modification sur `src/data/pitch.ts` ni `src/features/pitch.tsx`
- pas de reconstruction des cartes `Voies` Task 5
- identité RP préservée pour `canadaLivePagesFor(defaultProfile)`
- chaînes métier réutilisent les helpers existants pour les coûts et voies
- aucune erreur de linter sur les fichiers modifiés

## Commandes de vérification

Tests:

```bash
npx vitest run src/data/canada-live.test.ts src/lib/failure-press.test.ts src/lib/household-salaries.test.ts src/features/market.test.ts src/features/sales.test.ts
```

Lint IDE:

- `ReadLints` sur les fichiers modifiés
- résultat: aucune erreur

## Concerns

Aucune préoccupation bloquante après vérification ciblée.
 
## Fix: suppression de `market.province` dans EcosystemSection

### RED
Commande exécutée:

```bash
npx vitest run src/features/sales.test.ts
```

Résultat (aucune assertion en échec — pas de RED observé):

```text
✓ src/features/sales.test.ts (14 tests)

Test Files  1 passed (1)
Tests       14 passed (14)
```

### CHANGE
Fichier modifié:

- `src/features/sales.tsx` — suppression de `market.province` de la liste `pills` uniquement dans `EcosystemSection`.

### GREEN
Commande relancée après modification:

```bash
npx vitest run src/features/sales.test.ts
```

Sortie:

```text
✓ src/features/sales.test.ts (14 tests)

Test Files  1 passed (1)
Tests       14 passed (14)
```
