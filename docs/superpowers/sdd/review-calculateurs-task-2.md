# Review Task 2 — CalculatorsSection

## Spec ❌

La mise en oeuvre respecte bien le placement catalogue/registre, le chrome `OpportunitiesShell` sans panneau, la copy imposée, l'absence de `Le commercial` / `version connectée`, la reuse de `householdLiving` / `draftNet`, le loyer combine sur la slide 2, et la formule budget `Math.min(profile.budget || 5000, 5000)`.

En revanche, le comportement interactif du calculateur n'est pas coherent avec un flow "3 slides" foyer-aware. Les brouillons sont portes par `useState` a l'interieur de `CalculatorsNet`, puis `CalculatorsSection` change entierement de composant selon `slideIndex`. Concretement, quand l'utilisateur quitte la slide 1, l'etat local est detruit; la slide 2 continue d'afficher `householdLiving(profile)` calcule depuis le profil source, pas depuis les valeurs brouillonnees. Le calculateur est donc interactif seulement a l'interieur de la slide 1, pas a l'echelle de la section.

## Strengths

- `calculateurs` est bien insere apres `salaires` et avant `provinces` dans `src/catalog.ts`.
- `src/features/registry.tsx` reference bien `CalculatorsSection`.
- `src/features/market.tsx` place bien `CalculatorsSection` juste avant `ProvincesSection`.
- Le chrome est conforme: `OpportunitiesShell`, pas de `panel=`, pas de `JobsBriefingPanel`, pas de copy coaching interdite.
- La copy visible correspond au brief, y compris les apostrophes typographiques et les placeholders budget.
- La slide 2 affiche bien un board foyer partage avec un loyer unique, ce qui colle a la contrainte "combined rent".

## Issues

1. Les brouillons ne persistent pas entre les slides. `CalculatorsSection` rend soit `CalculatorsNet`, soit `CalculatorsLiving`, soit `CalculatorsBudget`; or le `useState` des drafts est declare dans `CalculatorsNet`. Changer de slide demonte donc le composant et remet les saisies a zero au retour. Reference: `src/features/market.tsx`.

```731:806:src/features/market.tsx
export function CalculatorsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const living = householdLiving(profile);
  if (slide === 1) return <CalculatorsLiving market={market} living={living} profile={profile} />;
  if (slide === 2) return <CalculatorsBudget market={market} profile={profile} />;
  return <CalculatorsNet market={market} living={living} />;
}

function CalculatorsNet({
  market,
  living,
}: {
  market: HouseholdMarket;
  living: ReturnType<typeof householdLiving>;
}) {
  // ...
  const [drafts, setDrafts] = useState(() =>
    living.groups.map((group) => ({
      role: group.adult.role,
      gross: group.adult.mid,
      code: initialCode,
    })),
  );
```

2. La slide 2 n'est pas alimentee par les valeurs interactives. Elle consomme `living` calcule une seule fois via `householdLiving(profile)`, donc ni le `Net mensuel` combine ni le titre `Que vaut ce salaire a {province} ?` ne refletent une province ou un brut modifies sur la slide 1. Cela contredit l'intention produit d'un calculateur local interactif sur la section. Reference: `src/features/market.tsx`.

```731:879:src/features/market.tsx
export function CalculatorsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const living = householdLiving(profile);
  if (slide === 1) return <CalculatorsLiving market={market} living={living} profile={profile} />;
  if (slide === 2) return <CalculatorsBudget market={market} profile={profile} />;
  return <CalculatorsNet market={market} living={living} />;
}

function CalculatorsLiving({
  market,
  living,
  profile,
}: {
  market: HouseholdMarket;
  living: ReturnType<typeof householdLiving>;
  profile: Profile;
}) {
  return (
    <OpportunitiesShell
      kicker="Calculateur · Coût de la vie"
      title={smart("Que vaut ce salaire à {province} ?", profile)}
      lead="Un salaire n’existe pas tout seul. Il se mesure au loyer."
      pills={pills}
    >
      <Surface className="p-4">
        {/* ... */}
        <strong className="mt-1.5 block text-[26px]">{money(living.combinedNetMonthly)}</strong>
```

3. La couverture de test est trop superficielle pour valider la spec comportementale. Les `describe` ajoutees dans `src/features/market.test.ts` ne font que verifier des chaines presentes dans le source; elles ne testent ni la persistance des drafts, ni le recalcul du board foyer, ni le fait que la province/budget affiches suivent les brouillons. C'est precisement pour cela que l'ecart principal ci-dessus passe au vert. Reference: `src/features/market.test.ts`.

```212:249:src/features/market.test.ts
describe("calculators chrome", () => {
  it("reuses the profil client shell on CalculatorsSection", () => {
    expect(source).toContain("export function CalculatorsSection");
    expect(source).toContain("householdLiving");
    expect(source).toContain("draftNet");
    // ...
  });

  it("keeps coaching copy out of CalculatorsSection helpers", () => {
    for (const name of ["CalculatorsSection", "CalculatorsNet", "CalculatorsLiving", "CalculatorsBudget"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("calculators household boards", () => {
  it("renders live net drafts, a shared living board, and project budget cards", () => {
    expect(source).toContain("Salaire annuel brut");
    expect(source).toContain("Math.min(profile.budget || 5000, 5000)");
  });
});
```

## Task quality

Qualite moyenne. Le travail est propre sur la structure, la copy et les contraintes visibles, mais il manque la partie la plus importante d'un calculateur multi-slides: faire circuler l'etat local sur toute la section. Les tests et le rapport surestiment la couverture reelle, car ils prouvent surtout une conformite textuelle/statique, pas le comportement utilisateur attendu.
