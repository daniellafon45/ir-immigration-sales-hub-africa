# Task 2 resolution — match current Jobs chrome (no panel)

JobsSection was changed after the original plan: `OpportunitiesShell` no longer takes a `panel` on Emplois, `JobsBriefingPanel` was removed, and `market.test.ts` now asserts the whole file does **not** contain `JobsBriefingPanel` or `À retenir`.

**Continue. Do not wait.** Replace only `SalariesSection`. Leave Opportunities (`setPrincipalMode`, `onSelect`, `MarketPanel`, `WorkBenefitsSection`) and Jobs untouched.

## Binding change

- **Do not** add `JobsBriefingPanel`.
- **Do not** pass `panel=` to `OpportunitiesShell` on salary slides (same as JobsToday / JobsIntl).
- **Do not** introduce the strings `À retenir` or `La question` (jobs tests fail if they appear anywhere in `market.tsx`).
- Keep prospect-facing titles and leads. Keep one Surface per adult.

## Tests already appended

Replace the salaries describes in `src/features/market.test.ts` with:

```ts
describe("salaries catalog", () => {
  it("keeps two salary slides", () => {
    expect(sections.find((section) => section.id === "salaires")?.slideCount).toBe(2);
  });
});

describe("salaries chrome", () => {
  it("reuses the profil client shell on SalariesSection", () => {
    expect(source).toContain("export function SalariesSection");
    expect(source).toContain("householdSalaries");
    expect(source).toContain('smart("Combien peut gagner un(e) {profession} ?", profile)');
    expect(source).toContain("Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes.");
    expect(source).toContain("Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.");
    expect(source).toContain("Le salaire brut ne raconte pas toute l’histoire.");
    expect(source).toContain("Ce qui reste après les retenues, c’est ça qui paie le loyer.");
  });

  it("keeps coaching copy out of SalariesSection and salaries chrome helpers", () => {
    for (const name of ["SalariesSection", "SalariesBands", "SalariesNet"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("salaries household boards", () => {
  it("renders salary bands and net cards per adult group", () => {
    expect(source).toContain("SalariesBoard");
    expect(source).toContain("SalariesNetBoard");
    expect(source).toContain("Salaire brut médian");
    expect(source).toContain("Net annuel estimatif");
    expect(source).toContain("Net mensuel");
    expect(source).toContain("Estimation de démonstration.");
  });
});
```

Re-run RED on `npx vitest run src/features/market.test.ts` after updating tests if needed, then implement.

## Implementation (verbatim)

Imports: add `import type { Profile } from "@/data/profile";` and `import { householdSalaries } from "@/lib/household-salaries";`. Remove `salaryData`, `netEstimate`/`salaryForProfession`, and `pitchView` only if unused after the rewrite. Keep `provinceCode`.

Replace `export function SalariesSection` through the `}` before `export function ProvincesSection`:

```tsx
export function SalariesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const view = householdSalaries(profile);
  if (slide === 1) return <SalariesNet market={market} view={view} />;
  return <SalariesBands market={market} view={view} profile={profile} />;
}

function SalariesBands({
  market,
  view,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdSalaries>;
  profile: Profile;
}) {
  const other = market.accompanying;
  const lead = other
    ? "Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes."
    : "Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.";
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Guide salarial"
      title={smart("Combien peut gagner un(e) {profession} ?", profile)}
      lead={lead}
      pills={pills}
    >
      <SalariesBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function SalariesNet({
  market,
  view,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdSalaries>;
}) {
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
          <SectionLabel>
            {group.adult.label} · {group.adult.member.profession}
          </SectionLabel>
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
          <SectionLabel>
            {group.adult.label} · {group.adult.member.profession}
          </SectionLabel>
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

Use U+2019 in `n’est` / `l’histoire` / `c’est`.

GREEN: `npx vitest run src/features/market.test.ts src/lib/household-salaries.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts`

No git.

Write the full report to `docs/superpowers/sdd/salaires-task-2-report.md`.
