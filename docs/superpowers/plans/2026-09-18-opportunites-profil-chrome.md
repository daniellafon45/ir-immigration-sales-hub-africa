# Opportunités chrome profil client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyler Opportunités sur le chrome Profil / Canada Live et afficher le marché de chaque adulte du foyer (couple, enfants, polygame).

**Architecture:** Extraire un helper pur `householdMarket(profile)` qui assemble adultes, bandes salariales et foyer. Réécrire `OpportunitiesSection` dans `src/features/market.tsx` avec la coquille Canada Live (header shader, Surface, panneau navy). Emplois / salaires / calculateurs / provinces inchangés.

**Tech Stack:** React 19, TypeScript, Vitest (helper unitaire + inspection source comme `src/features/profile.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- User-facing language stays French. Code, types, and test names stay in the existing English style.
- Keep catalog `opportunites.slideCount` at `3`.
- Do not modify `JobsSection`, `SalariesSection`, `CalculatorsSection`, or `ProvincesSection` behavior or `Slide` usage.
- Do not add `HoverRevealCards` or `canadaPlacesFor` to Opportunités.
- Fields on Opportunités are read-only. Do not call `useProfileStore` setters / `commit` / `patchApplicant` from this section.
- Remove the fake search bar and the word `Rechercher` from Opportunités.
- Principal card uses tone navy + `ring-2 ring-primary/30`; other adults use tone blue.
- Exact French copy:
  - Slide 1 kicker `Opportunités`
  - Slide 1 title `Votre profil peut être relié aux données du marché.`
  - Slide 1 lead `Le commercial part des métiers du foyer et montre le marché réel.`
  - Panel kicker slide 1 `Lecture marché`
  - Field labels `Métier` `Secteur` `Offres` `Bas` `Médian` `Élevé`
  - Role labels `Candidat` `Conjoint` `Épouse 1` `Épouse ${index + 2}`
  - Children section `Enfants`
  - Panel blocks `Marché retenu` and `Foyer`
  - Polygamy note `Le Canada ne reconnaît qu’un conjoint. Une seule épouse peut accompagner le dossier.`
  - Slide 2 kicker `Opportunités · Score`
  - Slide 2 title `Où ce profil semble-t-il le plus intéressant ?`
  - Slide 2 lead `Score de démonstration basé sur salaires, volume d’offres et coût de la vie.`
  - Slide 2 panel kicker `Où viser`
  - Slide 3 kicker `Opportunités · Transition`
  - Slide 3 title `Prouver avant de vendre.`
  - Slide 3 lead `Une fois le prospect convaincu qu’il existe un marché, le commercial passe aux emplois, aux salaires et aux procédures.`
  - Slide 3 panel kicker `Ensuite`
  - Destination labels `Emplois` `Salaires` `Voies d’immigration` `Comparateur de procédures`
- Chrome class strings must include `xl:grid-cols-[minmax(0,1fr)_300px]`, `IrShaderGradient`, `BrandLogo`, and the navy panel `bg-linear-to-br from-primary to-ir-deep`.
- Follow existing Vitest patterns. Helper tests import and call the function. UI tests read `market.tsx` source.
- Report file goes next to the brief. Skip git commits; status DONE still applies.

## File structure

- Create: `src/lib/household-market.ts` — pure household market view.
- Create: `src/lib/household-market.test.ts`
- Modify: `src/features/market.tsx` — replace `OpportunitiesSection` only (lines 18–65 plus local helpers added at file bottom). Keep `JobsSection` and the rest.
- Create: `src/features/market.test.ts`

---

### Task 1: householdMarket helper

**Files:**
- Create: `src/lib/household-market.ts`
- Test: `src/lib/household-market.test.ts`

**Interfaces:**
- Consumes: `Profile`, `AdultMember`, `ChildMember`, `extraPrincipalMode`, `familyHasChildren`, `familyHasSpouse`, `familyIsPolygamous` from `@/data/profile`; `opportunityCount`, `salaryForProfession` from `@/lib/finance`; `familyLabel`, `recommendPrincipal`, `AdultRole` from `@/lib/principal`
- Produces: `export type HouseholdMarketAdult`, `export type HouseholdMarket`, `export function householdMarket(profile: Profile): HouseholdMarket`

- [ ] **Step 1: Write the failing test**

Create `src/lib/household-market.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { householdMarket } from "@/lib/household-market";

describe("householdMarket", () => {
  it("builds a couple view with Loriane selected and Marc accompanying", () => {
    const market = householdMarket(defaultProfile);
    expect(market.adults).toHaveLength(2);
    expect(market.adults.map((adult) => adult.label)).toEqual(["Candidat", "Conjoint"]);
    expect(market.principal.member.firstName).toBe("Loriane");
    expect(market.principal.selected).toBe(true);
    expect(market.principal.offers).toBe(428);
    expect(market.principal.low).toBe(52000);
    expect(market.principal.mid).toBe(72000);
    expect(market.principal.high).toBe(98000);
    expect(market.principal.member.sector).toBe("Finance et comptabilité");
    expect(market.accompanying?.member.firstName).toBe("Marc");
    expect(market.accompanying?.offers).toBe(864);
    expect(market.accompanying?.mid).toBe(90000);
    expect(market.family).toBe("Couple");
    expect(market.province).toBe("Québec");
    expect(market.polygamous).toBe(false);
    expect(market.kids).toEqual([]);
  });

  it("keeps a single adult when the family is Seul(e)", () => {
    const market = householdMarket({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(market.adults).toHaveLength(1);
    expect(market.adults[0].label).toBe("Candidat");
    expect(market.accompanying).toBeUndefined();
    expect(market.excluded).toEqual([]);
  });

  it("lists wives and one excluded spouse in a polygamous household", () => {
    const extra = {
      id: "spouse-awa",
      firstName: "Awa",
      age: 28,
      jobTitle: "",
      profession: "Infirmier(ère)" as const,
      sector: "Santé",
      salary: "Bonne" as const,
      experience: 6,
      education: "Baccalauréat / Licence",
      french: "Avancé",
      english: "Intermédiaire",
    };
    const market = householdMarket({
      ...defaultProfile,
      family: "Polygame",
      extraSpouses: [extra],
      children: [{ id: "child-1", firstName: "Léa", age: 4 }],
    });
    expect(market.adults).toHaveLength(3);
    expect(market.adults.map((adult) => adult.label)).toEqual(["Candidat", "Épouse 1", "Épouse 2"]);
    expect(market.polygamous).toBe(true);
    expect(market.accompanying?.member.firstName).toBeTruthy();
    expect(market.excluded).toHaveLength(1);
    const names = [market.accompanying?.member.firstName, market.excluded[0]?.member.firstName];
    expect(names).toEqual(expect.arrayContaining(["Marc", "Awa"]));
    expect(market.kids).toEqual([{ id: "child-1", firstName: "Léa", age: 4 }]);
    expect(market.family).toMatch(/Polygame/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/household-market.test.ts`
Expected: FAIL because `@/lib/household-market` is not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/household-market.ts`:

```ts
import {
  extraPrincipalMode,
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  type AdultMember,
  type ChildMember,
  type Profile,
} from "@/data/profile";
import { opportunityCount, salaryForProfession } from "@/lib/finance";
import { familyLabel, recommendPrincipal, type AdultRole } from "@/lib/principal";

export type HouseholdMarketAdult = {
  role: AdultRole;
  label: string;
  member: AdultMember;
  selected: boolean;
  offers: number;
  low: number;
  mid: number;
  high: number;
};

export type HouseholdMarket = {
  adults: HouseholdMarketAdult[];
  principal: HouseholdMarketAdult;
  accompanying: HouseholdMarketAdult | undefined;
  excluded: HouseholdMarketAdult[];
  kids: ChildMember[];
  family: string;
  province: string;
  polygamous: boolean;
};

function marketFor(
  member: AdultMember,
  role: AdultRole,
  label: string,
  selected: boolean,
  province: string,
): HouseholdMarketAdult {
  const [low, mid, high] = salaryForProfession(member.profession, province);
  return {
    role,
    label,
    member,
    selected,
    offers: opportunityCount(member.profession),
    low,
    mid,
    high,
  };
}

export function householdMarket(profile: Profile): HouseholdMarket {
  const analysis = recommendPrincipal(profile);
  const polygamous = familyIsPolygamous(profile.family);
  const province = profile.province;
  const selected = analysis.selected;
  const adults: HouseholdMarketAdult[] = [
    marketFor(profile.applicant, "applicant", "Candidat", selected === "applicant", province),
  ];

  if (familyHasSpouse(profile.family)) {
    adults.push(
      marketFor(
        profile.spouse,
        "spouse",
        polygamous ? "Épouse 1" : "Conjoint",
        selected === "spouse",
        province,
      ),
    );
    if (polygamous) {
      profile.extraSpouses.forEach((spouse, index) => {
        const role = extraPrincipalMode(spouse.id);
        adults.push(marketFor(spouse, role, `Épouse ${index + 2}`, selected === role, province));
      });
    }
  }

  const principal = adults.find((adult) => adult.selected) ?? adults[0];
  const accompanying = analysis.accompanying
    ? adults.find((adult) => adult.role === analysis.accompanying?.role)
    : undefined;
  const excluded = analysis.excluded
    .map((adult) => adults.find((item) => item.role === adult.role))
    .filter((adult): adult is HouseholdMarketAdult => Boolean(adult));

  return {
    adults,
    principal,
    accompanying,
    excluded,
    kids: familyHasChildren(profile.family) ? profile.children : [],
    family: familyLabel(profile),
    province,
    polygamous,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/household-market.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

Skip. Do not run git. Record in the report that commits are skipped on purpose.

---

### Task 2: OpportunitiesSection chrome + foyer fields

**Files:**
- Modify: `src/features/market.tsx` (replace `OpportunitiesSection` and add local chrome helpers; do not change later exports)
- Create: `src/features/market.test.ts`

**Interfaces:**
- Consumes: `householdMarket`, `HouseholdMarket`, `HouseholdMarketAdult` from `@/lib/household-market` (Task 1)
- Produces: `OpportunitiesSection` rendered with Canada Live chrome on all 3 slides

- [ ] **Step 1: Write the failing test**

Create `src/features/market.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? undefined : next);
}

describe("opportunities catalog", () => {
  it("keeps three opportunity slides", () => {
    expect(sections.find((section) => section.id === "opportunites")?.slideCount).toBe(3);
  });
});

describe("opportunities chrome", () => {
  it("reuses the profil client shell on OpportunitiesSection", () => {
    expect(source).toContain("export function OpportunitiesSection");
    expect(source).toContain("householdMarket");
    expect(source).toContain("IrShaderGradient");
    expect(source).toContain("BrandLogo");
    expect(source).toContain("xl:grid-cols-[minmax(0,1fr)_300px]");
    expect(source).toContain("bg-linear-to-br from-primary to-ir-deep");
    expect(source).toContain("Lecture marché");
    expect(source).not.toContain("Rechercher");
  });

  it("does not add Canada places cards to opportunities", () => {
    const section = extractFunction("OpportunitiesMarket");
    expect(section).not.toContain("HoverRevealCards");
    expect(section).not.toContain("canadaPlacesFor");
  });
});

describe("opportunities household fields", () => {
  it("shows read-only métier, secteur and salary band fields on PersonMarketCard", () => {
    const card = extractFunction("PersonMarketCard");
    expect(card).toContain("<IrShaderGradient");
    expect(card).toContain('label="Métier"');
    expect(card).toContain('label="Secteur"');
    expect(card).toContain('label="Offres"');
    expect(card).toContain('label="Bas"');
    expect(card).toContain('label="Médian"');
    expect(card).toContain('label="Élevé"');
    expect(card).toContain("adult.member.profession");
    expect(card).toContain("adult.member.sector");
    expect(card).not.toContain("onChange");
  });

  it("renders adult market cards, a spouse grid, and a children strip", () => {
    const market = extractFunction("OpportunitiesMarket");
    expect(market).toContain("PersonMarketCard");
    expect(market).toContain("lg:grid-cols-2");
    expect(market).toContain("Enfants");
    expect(market).toContain("market.polygamous");
    expect(source).toContain("Le Canada ne reconnaît qu’un conjoint");
  });
});

describe("opportunities later slides", () => {
  it("keeps score ranking and transition destinations inside the same shell", () => {
    expect(source).toContain("Où viser");
    expect(source).toContain("Ensuite");
    expect(source).toContain('id: "emplois"');
    expect(source).toContain("Voies d’immigration");
  });

  it("leaves JobsSection on the Slide primitive", () => {
    expect(source).toContain("export function JobsSection");
    expect(source).toContain("<Slide");
    expect(source).toContain('kicker={slide === 0 ? "Emplois" : "Emplois · International"}');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/market.test.ts`
Expected: FAIL — `householdMarket` / `Lecture marché` / `PersonMarketCard` missing; `Rechercher` still present.

- [ ] **Step 3: Write minimal implementation**

In `src/features/market.tsx`:

1. Update imports at the top of the file to:

```tsx
import { useMemo, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { IrShaderGradient } from "@/components/brand/IrShaderGradient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slide } from "@/components/deck/primitives";
import { jobs } from "@/data/jobs";
import { provinceCode, provinceData } from "@/data/provinces";
import { salaryData } from "@/data/salaries";
import { netEstimate, opportunityCount, salaryForProfession } from "@/lib/finance";
import { money, num } from "@/lib/format";
import { householdMarket, type HouseholdMarket, type HouseholdMarketAdult } from "@/lib/household-market";
import { pitchView } from "@/lib/principal";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";
```

2. Replace the entire `OpportunitiesSection` function (from `export function OpportunitiesSection` through the closing `}` before `export function JobsSection`) with:

```tsx
export function OpportunitiesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const goTo = useDeckStore((s) => s.goToSectionId);
  const market = householdMarket(profile);
  const ranked = Object.values(provinceData).sort((a, b) => b.score - a.score);
  if (slide === 1) return <OpportunitiesScore market={market} ranked={ranked} />;
  if (slide === 2) return <OpportunitiesNext market={market} onGo={goTo} />;
  return <OpportunitiesMarket market={market} />;
}

function OpportunitiesMarket({ market }: { market: HouseholdMarket }) {
  const others = market.adults.filter((adult) => adult.role !== "applicant");
  return (
    <OpportunitiesShell
      kicker="Opportunités"
      title="Votre profil peut être relié aux données du marché."
      lead="Le commercial part des métiers du foyer et montre le marché réel."
      pills={[market.family, market.province, market.principal.member.profession]}
      panel={<MarketPanel market={market} />}
    >
      {market.polygamous ? (
        <div className="grid shrink-0 gap-3">
          <PersonMarketCard adult={market.adults[0]} />
          <div className="ir-rise grid min-h-0 gap-3 lg:grid-cols-2">
            {others.map((adult) => (
              <PersonMarketCard key={adult.role} adult={adult} />
            ))}
          </div>
        </div>
      ) : (
        <div className={cn("grid shrink-0 gap-3", others.length > 0 && "lg:grid-cols-2")}>
          {market.adults.map((adult) => (
            <PersonMarketCard key={adult.role} adult={adult} />
          ))}
        </div>
      )}
      {market.kids.length > 0 ? (
        <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
          <SectionLabel>Enfants</SectionLabel>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {market.kids.map((child) => (
              <div key={child.id} className="rounded-xl border border-[#c5d8ee] bg-secondary px-3 py-2 text-[13px] font-medium text-[#1a2332]">
                {(child.firstName || "Enfant")} · {child.age} ans
              </div>
            ))}
          </div>
        </Surface>
      ) : null}
    </OpportunitiesShell>
  );
}

function OpportunitiesScore({
  market,
  ranked,
}: {
  market: HouseholdMarket;
  ranked: Array<{ name: string; score: number }>;
}) {
  const top = ranked[0];
  return (
    <OpportunitiesShell
      kicker="Opportunités · Score"
      title="Où ce profil semble-t-il le plus intéressant ?"
      lead="Score de démonstration basé sur salaires, volume d’offres et coût de la vie."
      pills={[market.principal.member.profession, market.province]}
      panel={
        <MarketTalk
          kicker="Où viser"
          title={top?.name ?? market.province}
          subtitle={`${top?.score ?? 0}/100`}
          blocks={[
            ["Métier retenu", market.principal.member.profession],
            ["Offres", num(market.principal.offers)],
            ["Salaire médian", money(market.principal.mid)],
          ]}
        />
      }
    >
      <div className="grid shrink-0 gap-2">
        {ranked.map((province, index) => (
          <Surface key={province.name} className="grid grid-cols-[42px_1fr_100px] items-center px-3.5 py-3">
            <b className="text-primary">{index + 1}</b>
            <span className="text-[14px] font-medium">{province.name}</span>
            <strong className="text-right text-primary">{province.score}/100</strong>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function OpportunitiesNext({
  market,
  onGo,
}: {
  market: HouseholdMarket;
  onGo: (id: string) => void;
}) {
  const destinations = [
    { id: "emplois", label: "Emplois" },
    { id: "salaires", label: "Salaires" },
    { id: "voies", label: "Voies d’immigration" },
    { id: "comparateur", label: "Comparateur de procédures" },
  ];
  return (
    <OpportunitiesShell
      kicker="Opportunités · Transition"
      title="Prouver avant de vendre."
      lead="Une fois le prospect convaincu qu’il existe un marché, le commercial passe aux emplois, aux salaires et aux procédures."
      pills={[market.family, market.principal.member.profession]}
      panel={
        <MarketTalk
          kicker="Ensuite"
          title={market.principal.member.firstName || "Dossier"}
          subtitle={market.family}
          actions={destinations}
          onGo={onGo}
        />
      }
    >
      <div className="grid shrink-0 gap-2.5 sm:grid-cols-2">
        {destinations.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onGo(item.id)}
            className="flex min-h-[72px] cursor-pointer items-end rounded-[1.2rem] border border-[#e8ecf2] bg-white px-4 py-3 text-left text-[15px] font-semibold text-ir-navy shadow-[0_8px_24px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-ir-blue2"
          >
            {item.label}
          </button>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function OpportunitiesShell({
  kicker,
  title,
  lead,
  pills,
  panel,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  pills: string[];
  panel: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid h-full min-h-0 w-full max-w-[1280px] items-stretch gap-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden xl:overflow-hidden xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-h-0 min-w-0 flex-col gap-3 xl:h-full xl:overflow-y-auto xl:[scrollbar-width:none] xl:[-ms-overflow-style:none] xl:[&::-webkit-scrollbar]:hidden">
          <header className="relative shrink-0 overflow-hidden rounded-[1.2rem] bg-primary px-5 py-5 text-white sm:px-6 sm:py-6">
            <IrShaderGradient />
            <BrandLogo className="absolute top-3 right-3 z-10 size-11 rounded-lg ring-1 ring-white/20 sm:top-4 sm:right-4 sm:size-12" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pr-14 sm:pr-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">{kicker}</p>
                <h1 className="mt-1 text-[24px] leading-tight font-semibold tracking-tight">{title}</h1>
                <p className="mt-1 max-w-[62ch] text-[13px] text-white/70">{lead}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pills.map((pill) => (
                  <MetaPill key={pill}>{pill}</MetaPill>
                ))}
              </div>
            </div>
          </header>
          {children}
        </div>
        <aside className="relative min-h-0">
          <div className="xl:absolute xl:inset-0">{panel}</div>
        </aside>
      </div>
    </article>
  );
}

function PersonMarketCard({ adult }: { adult: HouseholdMarketAdult }) {
  const tone = adult.selected ? "navy" : "blue";
  return (
    <Surface className={cn("overflow-hidden p-0 transition duration-200", adult.selected && "ring-2 ring-primary/30")}>
      <div
        className={cn(
          "relative flex items-center gap-2.5 overflow-hidden px-3 py-2.5 text-white",
          tone === "navy" ? "bg-primary" : "bg-ir-blue2",
        )}
      >
        <IrShaderGradient />
        <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-semibold">
          {initials(adult.member.firstName)}
        </span>
        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium tracking-[0.12em] text-white/70 uppercase">{adult.label}</p>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">{num(adult.offers)}</span>
          </div>
          <p className="mt-0.5 truncate text-lg font-semibold tracking-tight">{adult.member.firstName || "—"}</p>
        </div>
      </div>
      <div className="grid gap-2 p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <ReadField className="sm:col-span-2" label="Métier" value={adult.member.profession} />
          <ReadField className="sm:col-span-2" label="Secteur" value={adult.member.sector} />
          <ReadField label="Offres" value={num(adult.offers)} />
          <ReadField label="Bas" value={money(adult.low)} />
          <ReadField label="Médian" value={money(adult.mid)} />
          <ReadField label="Élevé" value={money(adult.high)} />
        </div>
      </div>
    </Surface>
  );
}

function MarketPanel({ market }: { market: HouseholdMarket }) {
  const showFoyer = Boolean(market.accompanying || market.excluded.length || market.kids.length);
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(0,82,164,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">Lecture marché</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{market.principal.member.firstName || "—"}</p>
          <p className="mt-1 text-[14px] text-white/85">{market.family}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <PanelBlock title="Marché retenu">
          <FactRow label="Métier" value={market.principal.member.profession} />
          <FactRow label="Secteur" value={market.principal.member.sector} />
          <FactRow label="Offres" value={num(market.principal.offers)} />
          <FactRow label="Médian" value={money(market.principal.mid)} />
          <FactRow label="Fourchette" value={`${money(market.principal.low)} – ${money(market.principal.high)}`} />
        </PanelBlock>
        {showFoyer ? (
          <PanelBlock title="Foyer">
            {market.accompanying ? (
              <FactRow
                label={market.polygamous ? "Conjointe au dossier" : market.principal.role === "applicant" ? "Conjoint" : "Candidat"}
                value={`${market.accompanying.member.firstName || "—"} · ${market.accompanying.member.profession}`}
              />
            ) : null}
            {market.excluded.map((adult) => (
              <FactRow
                key={adult.role}
                label="Hors dossier"
                value={`${adult.member.firstName || adult.label} · ${adult.member.profession}`}
              />
            ))}
            {market.kids.map((child) => (
              <FactRow key={child.id} label="Enfant" value={`${child.firstName || "Enfant"} · ${child.age} ans`} />
            ))}
            {market.polygamous ? (
              <p className="pt-1 text-[13px] leading-snug text-white/80">
                Le Canada ne reconnaît qu’un conjoint. Une seule épouse peut accompagner le dossier.
              </p>
            ) : null}
          </PanelBlock>
        ) : null}
      </div>
    </div>
  );
}

function MarketTalk({
  kicker,
  title,
  subtitle,
  blocks,
  actions,
  onGo,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  blocks?: Array<[string, string]>;
  actions?: Array<{ id: string; label: string }>;
  onGo?: (id: string) => void;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(0,82,164,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">{kicker}</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-[14px] text-white/85">{subtitle}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {blocks?.length ? (
          <PanelBlock title="Dossier">
            {blocks.map(([label, value]) => (
              <FactRow key={label} label={label} value={value} />
            ))}
          </PanelBlock>
        ) : null}
      </div>
      {actions?.length && onGo ? (
        <div className="mt-3 grid shrink-0 gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              className="h-10 w-full rounded-xl bg-white text-primary hover:bg-secondary"
              onClick={() => onGo(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ReadField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <p className="flex h-8 items-center rounded-md border border-input bg-[#f7fafc] px-3 text-sm font-medium text-[#1a2332]">
        {value}
      </p>
    </div>
  );
}

function Surface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[1.2rem] border border-[#e5eaf0] bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)] transition duration-200 hover:shadow-[0_14px_32px_rgba(15,23,42,.07)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[12px] font-semibold text-[#1a2332]">{children}</h2>;
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
      {children}
    </span>
  );
}

function PanelBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white/10 p-2">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase">{title}</p>
      <div className="mt-1.5 space-y-0.5">{children}</div>
    </section>
  );
}

function FactRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[13px] text-white/80">{label}</span>
      <span className="text-right text-[14px] leading-tight font-medium">{value}</span>
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}
```

3. Delete the unused `Metric` helper at the bottom of `market.tsx` (the function that starts with `function Metric({ label, value }`). Leave `Band`, `Budget`, and `Hero`.

Keep `JobsSection` and every following export exactly as they are. `opportunityCount` may remain imported because `JobsSection` does not use it — if the linter flags it after Opportunities no longer calls it directly, keep the import only if still used; `householdMarket` now owns that call. If `opportunityCount` is unused in `market.tsx` after the rewrite, remove it from the import. Keep `salaryForProfession` — still used by `SalariesSection` and `CalculatorsSection`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/market.test.ts src/lib/household-market.test.ts`
Expected: PASS.

Then: `npx vitest run`
Expected: existing suite still green.

- [ ] **Step 5: Commit**

Skip. Do not run git.

---

## Self-review

1. Spec coverage: helper (Task 1), chrome + foyer fields + slides 2–3 (Task 2). Hors scope market cluster left untouched.
2. Placeholder scan: none.
3. Types: `HouseholdMarketAdult` / `HouseholdMarket` / `householdMarket` names match across tasks.
