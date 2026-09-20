# Rapport TDD - Task 2 ProvincesSection estimator + comparator

## Contexte

Objectif: remplacer l'ancienne `ProvincesSection` par l'estimateur + comparateur de cout de vie defini dans la Task 2 du plan `docs/superpowers/plans/2026-09-18-provinces-cout-de-vie.md`.

Contraintes appliquees:

- travail uniquement dans `C:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`
- aucun usage de git, aucun commit
- TDD strict: tests d'abord, RED observe, puis implementation
- remplacement limite a `ProvincesSection`, avec `ProvincesEstimator` et `ProvincesCompare` ajoutes juste avant `function Band`
- `Band` et `Hero` conserves
- aucune modification de `CalculatorsSection`, `SalariesSection`, `JobsSection`, `OpportunitiesSection`
- pas de `panel=`, pas de `JobsBriefingPanel`, pas de `A retenir`, pas de `La question`, pas de `Le commercial`
- pas de setters du profile store
- `Select` conserve

## Fichiers modifies

- `src/features/market.tsx`
- `src/features/market.test.ts`

## Phase RED

### 1. Tests ajoutes en premier

Bloc Task 2 ajoute a la fin de la zone Provinces dans `src/features/market.test.ts`:

- `describe("provinces catalog", ...)`
- `describe("provinces chrome", ...)`
- `describe("provinces cost of living boards", ...)`

Le contenu ajoute suit le plan Task 2, avec les assertions exactes sur:

- `slideCount` a `2`
- presence de `livingBasket`
- copies UI de l'estimateur et du comparateur
- absence de `Le commercial`, `version connectée`, et `panel=` dans `ProvincesSection`, `ProvincesEstimator`, `ProvincesCompare`
- presence de `Panier mensuel`, `Net du foyer`, `Reste estimatif`, `Garde d’enfants`, `defaultCompareIds`, et du message vide

### 2. Commande RED executee

```bash
npx vitest run src/features/market.test.ts
```

### 3. Echec observe

RED confirme comme attendu avec 3 echecs:

- absence de `livingBasket` dans la source actuelle
- absence de `ProvincesEstimator` / `ProvincesCompare`
- absence des libelles `Panier mensuel`, `Net du foyer`, `Reste estimatif`, etc.

Cause: l'ancienne `ProvincesSection` etait encore basee sur `Slide` avec hero + tableau de provinces, donc elle ne satisfaisait pas le nouveau contrat Task 2.

## Phase GREEN

### 1. Implementation appliquee

Dans `src/features/market.tsx`:

- ajout des imports:
  - `livingCities` depuis `@/data/cost-of-living`
  - `citiesForProvince`, `defaultCityId`, `defaultCompareIds`, `livingBasket` depuis `@/lib/living-basket`
- suppression de l'import `Slide`, devenu inutilise
- remplacement complet de `export function ProvincesSection()` par la version Task 2 exacte
- ajout immediat de:
  - `function ProvincesEstimator(...)`
  - `function ProvincesCompare(...)`
- conservation de `function Band(...)` et `function Hero(...)`

### 2. Comportement livre

#### Slide 1: estimateur

- shell `OpportunitiesShell` sans `panel=`
- select local de `Province`
- select local de `Ville`
- calcul du panier via `livingBasket(profile, selectedId)`
- affichage des postes:
  - `Logement`
  - `Épicerie`
  - `Transport`
  - `Services`
  - `Garde d’enfants` uniquement si `kids > 0`
- affichage des cartes:
  - `Panier mensuel`
  - `Net du foyer`
  - `Reste estimatif`
- disclaimer `Estimation de démonstration.`

#### Slide 2: comparateur

- shell `OpportunitiesShell` sans `panel=`
- selection locale de villes via chips
- jeu initial `defaultCompareIds(profile)`
- maximum de 3 villes selectionnees
- message vide:
  - `Choisissez jusqu’à trois villes pour comparer.`
- tableau comparatif avec colonnes:
  - `Ville`
  - `Logement`
  - `Épicerie`
  - `Transport`
  - `Services`
  - `Garde` seulement si le foyer a des enfants
  - `Panier`
  - `Reste`

## Ajustement de tests legacy

Apres l'implementation exacte de Task 2, un test legacy existant dans `src/features/market.test.ts` echouait encore:

- `provinces prospect copy > keeps coaching copy out of ProvincesSection`

Ce test imposait l'ancienne copie Provinces:

- `Comparer plusieurs provinces, côte à côte.`
- `Salaire, emploi, langue et coût du logement : le portrait de la province.`

Ces attentes contredisaient directement le TSX exact demande par la Task 2. Pour remettre la suite en coherence avec le nouveau contrat, ce bloc legacy a ete retire. Les nouvelles attentes Task 2 couvrent deja:

- la nouvelle copie d'estimateur
- la nouvelle copie de comparateur
- l'absence de copie coaching interdite

## Verification finale

### Tests

Commande executee:

```bash
npx vitest run src/features/market.test.ts src/lib/living-basket.test.ts src/lib/household-living.test.ts
```

Resultat:

- `src/features/market.test.ts`: 26 tests OK
- `src/lib/living-basket.test.ts`: 5 tests OK
- `src/lib/household-living.test.ts`: 3 tests OK
- total: 34 tests OK

### Lints

Verification IDE effectuee sur:

- `src/features/market.tsx`
- `src/features/market.test.ts`

Resultat: aucune erreur de lint signalee.

## Contraintes revalidees

- aucun commit realise
- aucun usage de git
- aucun changement sur `CalculatorsSection`, `SalariesSection`, `JobsSection`, `OpportunitiesSection`
- aucun setter du profile store ajoute
- `Select` conserve
- `Slide` retire parce qu'inutilise apres la re ecriture de Provinces
- `Band` et `Hero` conserves

## Risques / points de vigilance

- Le code suit le TSX exact du plan: l'etat local `code` et `cityId` est initialise depuis le profil au montage, mais ne se resynchronise pas automatiquement si le profil change apres montage. Ce n'est pas un bug de la tache telle que specifiee, mais c'est un comportement a connaitre.
- Le comparateur limite bien l'ajout a 3 villes, mais n'affiche pas de feedback explicite quand l'utilisateur tente d'en ajouter une 4e. C'est conforme au TSX fourni.

## Conclusion

Task 2 est implementee en TDD, avec RED observe avant toute modification de production, puis GREEN valide sur la suite ciblee. La `ProvincesSection` livre maintenant l'estimateur de cout de vie et le comparateur de villes, sans toucher aux autres sections interdites.

## Fix: defaultProvinceCode

### Contexte et TDD

- Defaut: pour un profil dont la province n’a aucun `livingCities` (ex. Saskatchewan), `ProvincesEstimator` initialisait son code avec `provinceCode(profile.province)`, ce qui menait a un tableau `citiesForProvince(code)` vide et a un fallback de ville `montreal` avec une province de panier incoherente.
- Nouveau helper pur `defaultProvinceCode(profile)` ajoute dans `src/lib/living-basket.ts`:
  - si `citiesForProvince(provinceCode(profile.province)).length > 0`, retourne ce code;
  - sinon retourne `cityById(defaultCityId(profile)).province` (par defaut Montreal → `QC`).
- `ProvincesEstimator` initialise maintenant `useState` avec `defaultProvinceCode(profile)` au lieu de `provinceCode(profile.province)`.

Ordre TDD respecte:

1. **RED tests d’abord**
   - Ajout dans `src/lib/living-basket.test.ts` d’un nouveau test dans `describe("city defaults")`:
     - `defaultProvinceCode(defaultProfile) === "QC"`
     - `defaultProvinceCode({ ...defaultProfile, province: "Ontario" }) === "ON"`
     - `defaultProvinceCode({ ...defaultProfile, province: "Saskatchewan" }) === "QC"`.
   - Ajout dans `src/features/market.test.ts` (bloc `provinces chrome`) de `expect(source).toContain("defaultProvinceCode");`.
   - Execution RED ciblee:

```bash
npx vitest run src/lib/living-basket.test.ts src/features/market.test.ts
```

   - Echecs observes:
     - `defaultProvinceCode` non defini / non fonction dans `living-basket.ts`.
     - absence de la chaine `defaultProvinceCode` dans `market.tsx`.

2. **GREEN implementation**
   - Implementation de `export function defaultProvinceCode(profile: Profile)` dans `src/lib/living-basket.ts` en suivant exactement la specification du brief.
   - Import de `defaultProvinceCode` dans `src/features/market.tsx` et remplacement de `const initialCode = provinceCode(profile.province);` par `const initialCode = defaultProvinceCode(profile);` dans `ProvincesEstimator`.

### Tests de verification

Commande executee apres implementation:

```bash
npx vitest run src/lib/living-basket.test.ts src/features/market.test.ts
```

Sortie pertinente:

```text
 RUN  v3.2.7 C:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme

 ✓ src/features/market.test.ts (26 tests)
 ✓ src/lib/living-basket.test.ts (6 tests)

 Test Files  2 passed (2)
      Tests  32 passed (32)
```

Conclusion: le helper `defaultProvinceCode` est couvert par un test unitaire explicite et `ProvincesEstimator` est cable dessus; les tests chrome Provinces confirment la presence du helper dans la source et l’estimateur demarre maintenant sur une province qui dispose de villes de demonstration.
