# Task 2 brief — SalariesSection chrome + commercial messages

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-18-salaires-profil-chrome.md` (Task 2 only)
**Spec:** `docs/superpowers/specs/2026-09-18-salaires-profil-design.md`

## Where this fits

Task 1 shipped `householdSalaries` in `src/lib/household-salaries.ts`. Task 2 restyles `SalariesSection` onto the same chrome as Jobs/Opportunités: `OpportunitiesShell` + `JobsBriefingPanel` + one Surface per adult. Do not change Jobs, Opportunities, Provinces, Band, Hero, or JobsBriefingPanel internals.

## Task 1 interface (do not change)

```ts
export function householdSalaries(profile: Profile): HouseholdSalaries
// HouseholdSalaries = { groups: HouseholdSalaryGroup[]; province: string }
// HouseholdSalaryGroup = { adult, bands, netAnnual, netMonthly }
```

## Global constraints (binding)

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. Do not commit.
- User-facing language stays French. Code, types, and test names stay in English.
- Keep catalog `salaires.slideCount` at `2`.
- Do not modify `OpportunitiesSection`, `JobsSection`, `JobsToday`, `JobsIntl`, `JobsBoard`, `JobTable`, `JobsBriefingPanel`, or `ProvincesSection` behavior.
- Reuse existing `OpportunitiesShell`, `Surface`, `SectionLabel`, `MetaPill`, `PanelBlock`, `JobsBriefingPanel`, `Band`. Do not add `HoverRevealCards`. Do not duplicate `JobsBriefingPanel`.
- Fields are read-only. Do not call profile store setters.
- Forbidden in new Salaries copy: `Le commercial`, `le commercial`, `Dans la version connectée`, `version connectée`.
- Use the typographic apostrophe `’` (U+2019) in French copy, matching JobsSection (`n’ont`, `n’est`).
- Follow Vitest source-read pattern already in `src/features/market.test.ts`.
- Skip git commits; status DONE still applies.

## Exact copy

- Slide 1 kicker `Guide salarial`
- Slide 1 title via `smart("Combien peut gagner un(e) {profession} ?", profile)`
- Slide 1 lead couple: `Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes.`
- Slide 1 lead solo: `Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.`
- Slide 1 panel kicker `À retenir`
- Talk 1 label `Ancrage` body `Le médian n’est pas une offre d’emploi. C’est le milieu observé pour ce métier, dans cette province.`
- Talk 2 label `Foyer`
- Talk 2 couple body: `{principal} et {accompagnant} n’ont pas le même médian. Deux métiers, deux fourchettes.`
- Talk 2 solo body: `Le métier de {principal} a déjà une fourchette visible.`
- Talk 3 label `Province` body `Un même métier ne paie pas pareil à Québec, en Ontario ou en Alberta.`
- Slide 1 ask `Cette fourchette suffit-elle à faire vivre le projet au Canada ?`
- Slide 2 kicker `Guide salarial · Net`
- Slide 2 title `Le salaire brut ne raconte pas toute l’histoire.`
- Slide 2 lead `Ce qui reste après les retenues, c’est ça qui paie le loyer.`
- Talk N1 label `Écart` body `Le brut impressionne. Le net décide si le projet tient.`
- Talk N2 label `Province` body `Les retenues changent selon la province. Le même brut ne donne pas le même reste.`
- Talk N3 label `Honnêteté` body `C’est une estimation de démonstration. Les tables fiscales officielles viendront ensuite.`
- Slide 2 ask `Avec ce net, le projet devient-il plus concret ou plus fragile ?`
- Net board labels `Salaire brut médian` `Net annuel estimatif` `Net mensuel`
- Net disclaimer `Estimation de démonstration.`
- Band labels `Bas` `Médian` `Élevé`

## Files

- Modify: `src/features/market.tsx` (replace `SalariesSection` only; keep everything before `export function SalariesSection` and everything from `export function ProvincesSection` onward)
- Modify: `src/features/market.test.ts` (append tests; keep all existing opportunities and jobs tests)

## TDD

Follow superpowers:test-driven-development.

### Step 1: failing tests

In `src/features/market.test.ts`, **append** after the jobs tests (do not remove existing tests):

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
    expect(source).toContain("Cette fourchette suffit-elle à faire vivre le projet au Canada ?");
    expect(source).toContain("Avec ce net, le projet devient-il plus concret ou plus fragile ?");
    expect(source).toContain("La question");
  });

  it("keeps coaching copy out of SalariesSection and salaries chrome helpers", () => {
    for (const name of ["SalariesSection", "SalariesBands", "SalariesNet"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
    }
  });
});

describe("salaries household boards", () => {
  it("renders salary bands and net cards per adult group", () => {
    expect(source).toContain("SalariesBoard");
    expect(source).toContain("SalariesNetBoard");
    expect(source).toContain("n’ont pas le même médian. Deux métiers, deux fourchettes.");
    expect(source).toContain("Le métier de ");
    expect(source).toContain("a déjà une fourchette visible.");
    expect(source).toContain("Salaire brut médian");
    expect(source).toContain("Net annuel estimatif");
    expect(source).toContain("Net mensuel");
    expect(source).toContain("Estimation de démonstration.");
  });
});
```

Do **not** assert `source).not.toContain("Le commercial")` on the whole file — Provinces still has that copy.

### Step 2: RED

Run: `npx vitest run src/features/market.test.ts`
Expected: FAIL on salaries chrome / householdSalaries / SalariesBands.

### Step 3: implementation

1. Add these imports near the existing household imports:

```ts
import type { Profile } from "@/data/profile";
import { householdSalaries } from "@/lib/household-salaries";
```

2. Remove only if unused after the rewrite:
- `import { salaryData } from "@/data/salaries";`
- `import { netEstimate, salaryForProfession } from "@/lib/finance";`
- `import { pitchView } from "@/lib/principal";`

Keep `provinceCode` — `ProvincesSection` still uses it. Keep `provinceData`, `money`, `smart`, `Band`.

3. Replace `export function SalariesSection` through its closing `}` **immediately before** `export function ProvincesSection` with the following. Do not touch `JobsBriefingPanel`, `ProvincesSection`, `Band`, or `Hero`.

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
  const other = market.accompanying?.member.firstName;
  const principalName = market.principal.member.firstName || "Le candidat";
  const foyerBody = other
    ? `${principalName} et ${other} n’ont pas le même médian. Deux métiers, deux fourchettes.`
    : `Le métier de ${principalName} a déjà une fourchette visible.`;
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
      panel={
        <JobsBriefingPanel
          kicker="À retenir"
          title={principalName}
          subtitle={market.family}
          talks={[
            {
              label: "Ancrage",
              body: "Le médian n’est pas une offre d’emploi. C’est le milieu observé pour ce métier, dans cette province.",
            },
            { label: "Foyer", body: foyerBody },
            {
              label: "Province",
              body: "Un même métier ne paie pas pareil à Québec, en Ontario ou en Alberta.",
            },
          ]}
          ask="Cette fourchette suffit-elle à faire vivre le projet au Canada ?"
        />
      }
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
      panel={
        <JobsBriefingPanel
          kicker="À retenir"
          title={market.principal.member.firstName || "Dossier"}
          subtitle={market.family}
          talks={[
            {
              label: "Écart",
              body: "Le brut impressionne. Le net décide si le projet tient.",
            },
            {
              label: "Province",
              body: "Les retenues changent selon la province. Le même brut ne donne pas le même reste.",
            },
            {
              label: "Honnêteté",
              body: "C’est une estimation de démonstration. Les tables fiscales officielles viendront ensuite.",
            },
          ]}
          ask="Avec ce net, le projet devient-il plus concret ou plus fragile ?"
        />
      }
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

### Step 4: GREEN

Run: `npx vitest run src/features/market.test.ts src/lib/household-salaries.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts`
Expected: PASS.

### Step 5: Commit

Skip. Do not run git.

## Report

Write your full report to:
`c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme\docs\superpowers\sdd\salaires-task-2-report.md`

Then return only status, no commits, one-line test summary, concerns, report path.
