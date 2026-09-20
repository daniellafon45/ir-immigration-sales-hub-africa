# Guide salarial chrome profil client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyler le Guide salarial (2 slides) sur le chrome Profil / Opportunités / Emplois, afficher Bas / Médian / Élevé et le net par adulte du foyer, et adresser les talks au prospect.

**Architecture:** Helper pur `householdSalaries(profile)` qui reprend les adultes de `householdMarket`, attache `salaryData` (fallback Comptable) et calcule net annuel / mensuel via `netEstimate`. Réécrire `SalariesSection` avec `OpportunitiesShell` + `JobsBriefingPanel`. Emplois / Opportunités / Provinces inchangés.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- User-facing language stays French. Code, types, and test names stay in English.
- Keep catalog `salaires.slideCount` at `2`.
- Do not modify `OpportunitiesSection`, `JobsSection`, `JobsToday`, `JobsIntl`, `JobsBoard`, `JobTable`, `JobsBriefingPanel`, or `ProvincesSection` behavior.
- Reuse existing `OpportunitiesShell`, `Surface`, `SectionLabel`, `MetaPill`, `PanelBlock`, `JobsBriefingPanel`, `Band` in `market.tsx`. Do not add `HoverRevealCards`.
- Fields are read-only. Do not call profile store setters.
- Forbidden in new Salaries copy: `Le commercial`, `le commercial`, `Dans la version connectée`, `version connectée`.
- Exact copy:
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
- Follow Vitest source-read pattern in `src/features/market.test.ts`.
- Skip git commits; status DONE still applies.

## File structure

- Create: `src/lib/household-salaries.ts`
- Create: `src/lib/household-salaries.test.ts`
- Modify: `src/features/market.tsx` (`SalariesSection` only)
- Modify: `src/features/market.test.ts`

---

### Task 1: householdSalaries helper

**Files:**
- Create: `src/lib/household-salaries.ts`
- Test: `src/lib/household-salaries.test.ts`

**Interfaces:**
- Consumes: `householdMarket` from `@/lib/household-market`; `salaryData` from `@/data/salaries`; `netEstimate` from `@/lib/finance`; `provinceCode` from `@/data/provinces`; `Profile` from `@/data/profile`
- Produces: `export type HouseholdSalaryGroup`; `export type HouseholdSalaries`; `export function householdSalaries(profile: Profile): HouseholdSalaries`

- [ ] **Step 1: Write the failing test**

Create `src/lib/household-salaries.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { salaryData } from "@/data/salaries";
import { householdSalaries } from "@/lib/household-salaries";

describe("householdSalaries", () => {
  it("splits the default couple into Comptable and Développeur logiciel groups", () => {
    const view = householdSalaries(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.province).toBe("Québec");
    expect(view.groups[0].adult.member.firstName).toBe("Loriane");
    expect(view.groups[0].adult.low).toBe(52000);
    expect(view.groups[0].adult.mid).toBe(72000);
    expect(view.groups[0].adult.high).toBe(98000);
    expect(view.groups[0].bands).toEqual(salaryData.Comptable);
    expect(view.groups[0].netAnnual).toBe(50400);
    expect(view.groups[0].netMonthly).toBe(4200);
    expect(view.groups[1].adult.member.firstName).toBe("Marc");
    expect(view.groups[1].adult.mid).toBe(90000);
    expect(view.groups[1].bands).toEqual(salaryData["Développeur logiciel"]);
    expect(view.groups[1].netAnnual).toBe(63000);
    expect(view.groups[1].netMonthly).toBe(5250);
  });

  it("keeps a single group when the family is Seul(e)", () => {
    const view = householdSalaries({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].adult.member.firstName).toBe("Loriane");
    expect(view.groups[0].netAnnual).toBe(50400);
  });

  it("falls back to Comptable bands when the profession is missing from salaryData", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      spouse: emptyAdult,
      applicant: { ...defaultProfile.applicant, profession: "Aide-soignant(e)" },
    });
    expect(view.groups[0].bands).toEqual(salaryData.Comptable);
    expect(view.groups[0].adult.mid).toBe(72000);
  });

  it("uses the province net rate for monthly estimates", () => {
    const view = householdSalaries({ ...defaultProfile, province: "Ontario" });
    expect(view.province).toBe("Ontario");
    expect(view.groups[0].adult.mid).toBe(78000);
    expect(view.groups[0].netAnnual).toBe(56940);
    expect(view.groups[0].netMonthly).toBe(4745);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/household-salaries.test.ts`
Expected: FAIL (missing module).

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/household-salaries.ts`:

```ts
import { provinceCode } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import type { SalaryBand } from "@/data/salaries";
import { salaryData } from "@/data/salaries";
import { netEstimate } from "@/lib/finance";
import { householdMarket, type HouseholdMarketAdult } from "@/lib/household-market";

export type HouseholdSalaryGroup = {
  adult: HouseholdMarketAdult;
  bands: Record<string, SalaryBand>;
  netAnnual: number;
  netMonthly: number;
};

export type HouseholdSalaries = {
  groups: HouseholdSalaryGroup[];
  province: string;
};

export function householdSalaries(profile: Profile): HouseholdSalaries {
  const market = householdMarket(profile);
  const code = provinceCode(profile.province);
  const groups = market.adults.map((adult) => {
    const bands = salaryData[adult.member.profession] ?? salaryData.Comptable;
    const netAnnual = netEstimate(adult.mid, code);
    return {
      adult,
      bands,
      netAnnual,
      netMonthly: Math.round(netAnnual / 12),
    };
  });
  return { groups, province: market.province };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/household-salaries.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

Skip. Do not run git.

---

### Task 2: SalariesSection chrome + commercial messages

**Files:**
- Modify: `src/features/market.tsx` (replace `SalariesSection` only)
- Modify: `src/features/market.test.ts`

**Interfaces:**
- Consumes: `householdSalaries` from Task 1; `householdMarket`; existing `OpportunitiesShell` / `Surface` / `SectionLabel` / `JobsBriefingPanel` / `Band` / `smart` / `money` / `provinceData`
- Produces: `SalariesSection` on Canada Live chrome for both slides, prospect-facing talks, no `Slide` inside Salaries helpers

- [ ] **Step 1: Write the failing test**

In `src/features/market.test.ts`, **append** these describes after the jobs tests (keep all existing opportunities and jobs tests):

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

Do not assert `source).not.toContain("Le commercial")` on the whole `market.tsx` file — Provinces still has that copy.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/market.test.ts`
Expected: FAIL on salaries chrome / householdSalaries.

- [ ] **Step 3: Write minimal implementation**

1. Add import (keep existing `householdJobs` import):

```ts
import { householdSalaries } from "@/lib/household-salaries";
```

Remove unused `pitchView` import if nothing else in the file uses it. After the rewrite, `SalariesSection` no longer needs `salaryForProfession`, `netEstimate`, or `salaryData` — remove those imports only if unused in the rest of the file. Keep `provinceData`, `money`, `smart`, `Band`.

2. Replace `export function SalariesSection` through the closing `}` before `export function ProvincesSection` with:

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
  profile: typeof market extends never ? never : import("@/data/profile").Profile;
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

**Type cleanup:** do **not** use the `typeof market extends never` trick in production. Import `Profile` from `@/data/profile` at the top of `market.tsx` and type `profile: Profile`.

```ts
import type { Profile } from "@/data/profile";
```

Keep `ProvincesSection` and everything after it exactly as-is, including `Band` and `Hero`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/features/market.test.ts src/lib/household-salaries.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

Skip. Do not run git.

---

## Self-review

1. Spec coverage: helper (Task 1), chrome + talks + household boards (Task 2).
2. Placeholder scan: foyer copy interpolates first names in UI, not `{principal}` visible.
3. Types: `HouseholdSalaryGroup` / `householdSalaries` names match.
4. `JobsBriefingPanel` reused, not duplicated.
