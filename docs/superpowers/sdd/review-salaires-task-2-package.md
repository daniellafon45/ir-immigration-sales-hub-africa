# Review package — Salaires Task 2

**Base:** none (no project git)
**Head:** working tree
**Commits:** none (git forbidden)

Binding requirements for this task are the original Task 2 brief **as amended by** `docs/superpowers/sdd/salaires-task-2-resolution.md` (Jobs chrome changed: no side panel).

## Stat

```
M  src/features/market.tsx   (SalariesSection rewrite; unused salary/pitchView imports removed; Profile + householdSalaries imports added)
M  src/features/market.test.ts  (salaries catalog/chrome/boards describes)
```

JobsSection, OpportunitiesSection, ProvincesSection, Band, Hero, JobsBriefingPanel (absent), household-salaries.ts were not the intended change set.

## Changed salaries implementation

```tsx
export function SalariesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const view = householdSalaries(profile);
  if (slide === 1) return <SalariesNet market={market} view={view} />;
  return <SalariesBands market={market} view={view} profile={profile} />;
}

function SalariesBands({ market, view, profile }: { market: HouseholdMarket; view: ReturnType<typeof householdSalaries>; profile: Profile }) {
  const other = market.accompanying;
  const lead = other
    ? "Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes."
    : "Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.";
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell kicker="Guide salarial" title={smart("Combien peut gagner un(e) {profession} ?", profile)} lead={lead} pills={pills}>
      <SalariesBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function SalariesNet({ market, view }: { market: HouseholdMarket; view: ReturnType<typeof householdSalaries> }) {
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Guide salarial · Net"
      title="Le salaire brut ne raconte pas toute l’histoire."
      lead="Ce qui reste après les retenues, c’est ça qui paie le loyer."
      pills={pills}
    >
      <SalariesNetBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function SalariesBoard({ groups }: { groups: ReturnType<typeof householdSalaries>["groups"] }) {
  return (
    <div className="grid shrink-0 gap-3">
      {groups.map((group) => (
        <Surface key={group.adult.role} className="p-3 sm:px-4 sm:py-3">
          <SectionLabel>{group.adult.label} · {group.adult.member.profession}</SectionLabel>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Band label="Bas" value={money(group.adult.low)} />
            <Band label="Médian" value={money(group.adult.mid)} featured />
            <Band label="Élevé" value={money(group.adult.high)} />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {Object.entries(group.bands).map(([code, values]) => (
              <div key={code} className="rounded-[10px] border border-border bg-white p-3 text-center">
                <span className="block text-[10px] text-muted-foreground">{provinceData[code]?.name ?? code}</span>
                <b className="mt-1 block text-sm">{money(values[1])}</b>
              </div>
            ))}
          </div>
        </Surface>
      ))}
    </div>
  );
}

function SalariesNetBoard({ groups }: { groups: ReturnType<typeof householdSalaries>["groups"] }) {
  return (
    <div className="grid shrink-0 gap-3">
      {groups.map((group) => (
        <Surface key={group.adult.role} className="p-4">
          <SectionLabel>{group.adult.label} · {group.adult.member.profession}</SectionLabel>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground">Salaire brut médian</span>
              <strong className="mt-1 block text-[22px] text-primary">{money(group.adult.mid)}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground">Net annuel estimatif</span>
              <strong className="mt-1 block text-[22px] text-primary">{money(group.netAnnual)}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground">Net mensuel</span>
              <strong className="mt-1 block text-[22px] text-primary">{money(group.netMonthly)}</strong>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">Estimation de démonstration.</p>
        </Surface>
      ))}
    </div>
  );
}
```

Imports now include `Profile` and `householdSalaries`. Removed `salaryData`, `netEstimate`, `salaryForProfession`, `pitchView`.

## Tests (appended)

See `src/features/market.test.ts` describes `salaries catalog`, `salaries chrome`, `salaries household boards` (lines ~133–169). They assert shell copy, no coaching / no `panel=` on Salaries helpers, and per-adult boards. They do not assert `À retenir` or `La question`.
