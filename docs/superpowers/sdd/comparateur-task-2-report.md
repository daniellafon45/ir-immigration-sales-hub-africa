## Task 2 — CompareSection chrome

### Contexte

Cette tâche restyle le **Comparateur de procédures** sur le chrome Profil client / Emplois, en alignant `CompareSection` avec `OpportunitiesShell` comme pour les sections Voies et Provinces. Le helper `recommendedScenarioId` est déjà en place dans `route-paths.ts` et le catalogue conserve `comparateur.slideCount` à `2`.

### Approche et TDD

- Ajout des tests de Task 2 dans `immigration.test.ts` avant toute modification de l’UI, conformément au plan :
  - `comparateur catalog` vérifie que la section `comparateur` du catalogue a bien `slideCount === 2`.
  - `comparateur chrome` s’assure que `CompareSection` réutilise le shell Profil client (`OpportunitiesShell`) et contient exactement les copies imposées pour les deux slides, tout en excluant la copie de coaching ou les traces de `panel=` dans `CompareSection`, `CompareTable` et `CompareScenarios`.
  - `comparateur boards` vérifie la présence du texte vide `Choisissez jusqu’à trois voies pour comparer.`, des libellés de lignes (`Profil type`, `Condition`, `Point fort`), de l’import `recommendedScenarioId`, du badge `Foyer` et de l’usage de `toggleCompare`.
- Exécution de `npx vitest run src/features/immigration.test.ts` : les nouveaux tests échouent (RED) car l’ancienne version de `CompareSection` utilisait encore `Slide` / `Card` et ne portait pas le chrome Profil client ni les nouvelles copies.
- Réécriture de `CompareSection` et ajout des helpers `CompareTable` et `CompareScenarios` conformément au plan, puis exécution de `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts` (GREEN, 13 tests passés).

### Détails d’implémentation

#### Imports et dépendances

- Nettoyage des imports UI et ajout des dépendances nécessaires :
  - Remplacement de `import { Slide, Timeline } from "@/components/deck/primitives";` par `import { Timeline } from "@/components/deck/primitives";` car `Slide` n’est plus utilisé après la réécriture.
  - Suppression de l’import inutilisé `Card` de `@/components/ui/card` (Task 2 demande explicitement de retirer `Slide` / `Card` si plus utilisés).
  - Ajout de `Profile` depuis `@/data/profile` pour typer les props de `CompareTable` et `CompareScenarios`.
  - Extension de l’import `@/lib/route-paths` pour inclure `recommendedScenarioId` aux côtés de `bridgesFrom`, `routeById` et `routeForObjective`.
  - Conservation et réutilisation des imports `OpportunitiesShell`, `Surface`, `SectionLabel`, `householdMarket`, `cn`, `smart`, `useDeckStore`, `useProfileStore`, déjà employés par `RoutesSection`.

Ces changements respectent la contrainte de ne pas modifier `RoutesSection` ni ses helpers : seule la zone à partir de `export function CompareSection` est réécrite, et les imports sont simplement ajustés pour rester cohérents et sans warnings.

#### CompareSection — logique d’aiguillage

- Nouvelle signature :

  ```ts
  export function CompareSection() {
    const slide = useDeckStore((s) => s.slideIndex);
    const profile = useProfileStore((s) => s.profile);
    const market = householdMarket(profile);
    const compareSelected = useDeckStore((s) => s.compareSelected);
    const toggleCompare = useDeckStore((s) => s.toggleCompare);
    if (slide === 1) return <CompareScenarios market={market} profile={profile} />;
    return (
      <CompareTable
        market={market}
        profile={profile}
        selectedIds={compareSelected}
        onToggle={toggleCompare}
      />
    );
  }
  ```

- Le composant :
  - Continue d’utiliser `slideIndex` du `deck store` pour choisir la vue active, mais la logique est inversée par rapport à l’ancienne version (qui utilisait `slide === 0` pour la table et `else` pour les scénarios). Désormais :
    - `slide !== 1` (typiquement 0) affiche la **table de comparaison** (`CompareTable`).
    - `slide === 1` affiche les **scénarios de foyer** (`CompareScenarios`).
  - Réutilise le `profile` du `profile store` et le marché calculé `householdMarket(profile)` pour alimenter les pills d’interface.
  - Réutilise `compareSelected` et `toggleCompare` du deck store (aucune modification du store, conformément aux contraintes) pour gérer la sélection des voies à comparer.

Cette structure fait de `CompareSection` un simple routeur d’UI entre les deux sous-vues, tout en le branchant sur le chrome Profil client (`OpportunitiesShell`) via les helpers.

#### CompareTable — slide 1, table de comparaison

- Signature et props typées :

  ```ts
  function CompareTable({
    market,
    profile,
    selectedIds,
    onToggle,
  }: {
    market: ReturnType<typeof householdMarket>;
    profile: Profile;
    selectedIds: string[];
    onToggle: (id: string) => void;
  }) { ... }
  ```

- Sélection et lignes :
  - Les routes comparées sont dérivées de `selectedIds` (provenant de `compareSelected`), via `routes.filter((route) => selectedIds.includes(route.id)).slice(0, 3)` pour respecter la limite à **trois voies maximum**.
  - Les lignes du tableau sont construites exactement comme dans le plan :
    - `"Objectif"` + `route.tag` (tag par voie).
    - `"Profil type"` + `route.fit`.
    - `"Condition"` + première condition (ou `—` si aucune) : `route.conditions[0] ?? "—"`.
    - `"Point fort"` + premier élément de `route.positives`.
    - `"Attention"` + premier élément de `route.attention`.

- Chrome Profil client (OpportunitiesShell) :
  - Le composant est enveloppé dans :

    ```tsx
    <OpportunitiesShell
      kicker="Comparateur"
      title="Comparer les voies côte à côte."
      lead="Trois procédures maximum. Celle qui colle au foyer, pas à la brochure."
      pills={[market.family, market.province, profile.objective]}
    >
      {...}
    </OpportunitiesShell>
    ```

  - Le kicker, le titre, le lead et les pills sont exactement ceux imposés dans le plan/spec, avec les mêmes apostrophes (U+2019) pour la cohérence de la copie française.

- Sélecteur de voies :
  - Les voies sont affichées comme une rangée de **boutons pills** (comme Provinces), en réutilisant `cn` et les classes Tailwind déjà utilisées ailleurs :

    ```tsx
    <div className="flex flex-wrap gap-2">
      {routes.map((route) => {
        const on = selectedIds.includes(route.id);
        return (
          <button
            key={route.id}
            type="button"
            onClick={() => onToggle(route.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
              on ? "border-primary bg-primary text-white" : "border-border bg-white text-[#1a2332]",
            )}
          >
            {route.name}
          </button>
        );
      })}
    </div>
    ```

  - Aucun `panel=` ni copie interdite n’est introduite, ce que les tests de `comparateur chrome` vérifient via `extractFunction`.

- État vide vs tableau :
  - Si `selected.length === 0`, on affiche le texte vide spécifié :

    ```tsx
    <p className="text-[13px] text-muted-foreground">
      Choisissez jusqu’à trois voies pour comparer.
    </p>
    ```

  - Sinon, on rend une table responsive enveloppée dans un `Surface` :

    ```tsx
    <Surface className="overflow-x-auto p-3">
      <table className="w-full border-separate border-spacing-y-1.5 text-[11px]">
        <thead>
          <tr className="text-left text-[9px] tracking-wide text-[#89929f] uppercase">
            <th className="px-2.5">Critère</th>
            {selected.map((route) => (
              <th key={route.id} className="px-2.5">
                {route.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${index}`}
                  className={cn(
                    "bg-[#f7fafc] px-2.5 py-2.5",
                    index === 0 ? "rounded-l-[9px] border border-r-0 border-[#e4e8ee] font-semibold" : "border-y border-[#e4e8ee]",
                    index === row.length - 1 ? "rounded-r-[9px] border border-l-0 border-[#e4e8ee]" : "",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Surface>
    ```

  - La structure visuelle (background légèrement bleuté, arrondis sur la première/dernière colonne, séparation en lignes) reprend les patterns existants dans d’autres tableaux du chrome Profil client.

#### CompareScenarios — slide 2, scénarios de foyer

- Signature et typage :

  ```ts
  function CompareScenarios({
    market,
    profile,
  }: {
    market: ReturnType<typeof householdMarket>;
    profile: Profile;
  }) { ... }
  ```

- Logique de scénario recommandé :
  - `const featured = recommendedScenarioId(profile);`
  - `recommendedScenarioId` vient de `route-paths.ts` (Task 1 déjà livrée) et encapsule la logique métier :
    - Enfants ou `Regroupement familial` → scénario `D`.
    - Objectifs `Études`, `Travail`, `Visite` → scénario `B`.
    - Objectif `Résidence permanente` → scénario `A`.
    - Sinon → scénario `C`.

- Définition des scénarios :

  ```ts
  const scenarios = [
    ["A", "Aller vers la résidence permanente", "Explorer d’abord les voies économiques directes."],
    ["B", "Construire une expérience canadienne", "Études ou travail selon les conditions applicables."],
    ["C", "Maximiser l’employabilité", "Province + métier + carrière + immigration."],
    ["D", "Partir en famille", "Comparer coût, emploi du conjoint et installation."],
  ] as const;
  ```

  - Les titres et copies sont exactement ceux listés dans le spec, avec les mêmes apostrophes et accents.

- Chrome Profil client :

  ```tsx
  <OpportunitiesShell
    kicker="Comparateur · Scénarios"
    title={smart("Quel scénario correspond le mieux à {name} ?", profile)}
    lead="On choisit une logique de projet, pas un programme au hasard."
    pills={[market.family, profile.objective]}
  >
    {...}
  </OpportunitiesShell>
  ```

  - `smart` injecte le prénom dans `{name}` si disponible, comme dans les autres sections réutilisant ce helper.

- Grille de cartes de scénarios :
  - Layout : `grid gap-3 sm:grid-cols-2 xl:grid-cols-4` pour une grille responsive 2 colonnes (small) puis 4 colonnes (desktop large).
  - Chaque scénario est affiché dans un `Surface` :

    ```tsx
    <Surface key={id} className={cn("p-4", id === featured && "border-primary")}>
      <span className="flex items-center justify-between gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
          {id}
        </span>
        {id === featured ? (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
            Foyer
          </span>
        ) : null}
      </span>
      <h3 className="mt-3 mb-2 text-base font-semibold">{title}</h3>
      <p className="text-[12px] leading-relaxed text-[#707987]">{copy}</p>
    </Surface>
    ```

  - Le badge `Foyer` est affiché uniquement sur la carte dont l’ID correspond au `featured` calculé, ce qui matérialise le **scénario du foyer** mis en avant dans la spec.

#### Respect des contraintes

- **RoutesSection inchangé** : aucune modification de `RoutesSection`, `RoutesOverview`, `RoutesBridges`, `RoutesDetail` ni de leurs signatures ; la logique, les textes et le chrome des voies d’immigration restent identiques.
- **Pas de panel=** : le nouveau code n’introduit ni prop `panel` ni la chaîne `"panel="`. Les tests `comparateur chrome` scannent `CompareSection`, `CompareTable` et `CompareScenarios` et échoueraient en cas d’ajout.
- **Pas de coaching copy** : aucune occurrence de `Le commercial`, `aider le prospect` ou `version connectée` dans les nouveaux composants ; tests de garde présents.
- **Store compareSelected** : réutilisé tel quel, via `compareSelected` et `toggleCompare` provenant de `useDeckStore`; aucune mutation de la configuration par défaut.
- **French UI / English code** : les textes d’interface sont en français (avec apostrophe U+2019), tandis que noms de fonctions, types et tests restent en anglais.
- **Comparateur.slideCount** : non modifié dans le catalogue ; les tests `comparateur catalog` vérifient toujours `2`.

### Tests

- Commande exécutée (PowerShell) :

  ```bash
  cd c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme; npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts
  ```

- Résultat :
  - `src/lib/route-paths.test.ts` : **5 tests passés** (incluant ceux de `recommendedScenarioId` déjà livrés).
  - `src/features/immigration.test.ts` : **8 tests passés**, incluant les nouveaux blocs `comparateur catalog`, `comparateur chrome`, `comparateur boards`.
  - **Total** : 2 fichiers, 13 tests passés, aucun échec.

### Points d’attention / risques

- Le routage entre slides dans `CompareSection` repose sur `slideIndex` (`slide === 1` pour les scénarios, sinon la table). Si le deck du comparateur utilise une convention différente (par exemple `slideCount` > 2 ou un mapping d’index spécifique), il faudra ajuster cette logique pour rester aligné.
- Les styles du tableau (`bg-[#f7fafc]`, bordures, arrondis) sont calqués sur les patterns existants du chrome Profil client ; si un design system central change ces tokens, on devra peut-être factoriser ces classes dans un composant commun pour éviter la duplication.

### Conclusion

Task 2 est implémentée : `CompareSection` est désormais restylée sur le chrome Profil client / Emplois via `OpportunitiesShell`, avec une table de comparaison à trois voies maximum, des scénarios de foyer pilotés par `recommendedScenarioId`, et des tests Vitest assurant la stabilité du chrome, des copies et des contraintes métier.

