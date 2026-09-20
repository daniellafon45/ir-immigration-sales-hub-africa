# Calculateurs chrome profil client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Réintégrer Calculateurs (3 slides) sur le chrome Emplois / Guide salarial, foyer-aware, copy prospect, calculateur net interactif en local.

**Architecture:** Helper `householdLiving` + `draftNet`. `CalculatorsSection` dans `market.tsx`. Catalog + registry.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. Do not commit.
- User-facing language stays French. Code, types, and test names stay in English.
- Catalog `calculateurs.slideCount` is **3**. Insert the section **after** `salaires` and **before** `provinces`.
- Do not modify `OpportunitiesSection`, `JobsSection`, `SalariesSection`, or `ProvincesSection` behavior.
- Reuse `OpportunitiesShell`, `Surface`, `SectionLabel`. No `panel=`. No `JobsBriefingPanel`. No strings `À retenir` or `La question`.
- Do not call profile store setters. Calculator drafts are local `useState`.
- Forbidden in new Calculators copy: `Le commercial`, `le commercial`, `version connectée`.
- Exact copy:
  - Slide 1 kicker `Calculateur · Salaire net`
  - Slide 1 title `Combien reste-t-il réellement après les retenues ?`
  - Slide 1 lead couple `Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes.`
  - Slide 1 lead solo `Le brut impressionne. Le net, c’est ça qui paie le loyer.`
  - Labels `Salaire annuel brut` `Province` `Net annuel estimatif`
  - Monthly hint prefix `≈ `
  - Monthly hint suffix ` / mois`
  - Slide 2 kicker `Calculateur · Coût de la vie`
  - Slide 2 title via `smart("Que vaut ce salaire à {province} ?", profile)`
  - Slide 2 lead `Un salaire n’existe pas tout seul. Il se mesure au loyer.`
  - Labels `Net mensuel` `Loyer indicatif` `Autres dépenses estimées` `Reste estimatif`
  - Slide 3 kicker `Calculateur · Budget projet`
  - Slide 3 title `Combien faut-il préparer pour démarrer ?`
  - Slide 3 lead `Un projet Canada, ce n’est pas seulement des honoraires.`
  - Cards `Honoraires IR` `Démarches & tests` `Installation` `Fonds de sécurité`
  - Placeholders `À estimer` `À prévoir`
- `other` expenses constant is `1700`.
- Honoraires IR amount is `Math.min(profile.budget || 5000, 5000)`.
- Follow Vitest source-read pattern in `src/features/market.test.ts`.
- Skip git commits; status DONE still applies.

## File structure

- Create: `src/lib/household-living.ts`
- Create: `src/lib/household-living.test.ts`
- Modify: `src/catalog.ts`
- Modify: `src/features/registry.tsx`
- Modify: `src/features/market.tsx` (append `CalculatorsSection` before `ProvincesSection`)
- Modify: `src/features/market.test.ts`

---

### Task 1: householdLiving helper

**Files:**
- Create: `src/lib/household-living.ts`
- Test: `src/lib/household-living.test.ts`

**Interfaces:**
- Consumes: `householdSalaries`, `netEstimate`, `provinceCode`, `provinceData`, `Profile`
- Produces: `OTHER_MONTHLY_EXPENSES`, `HouseholdLiving`, `householdLiving(profile)`, `draftNet(gross, code)`

- [ ] **Step 1: Write the failing test**

Create `src/lib/household-living.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { draftNet, householdLiving, OTHER_MONTHLY_EXPENSES } from "@/lib/household-living";

describe("householdLiving", () => {
  it("combines default couple nets against Quebec rent and other expenses", () => {
    const view = householdLiving(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.province).toBe("Québec");
    expect(view.groups[0].netMonthly).toBe(4200);
    expect(view.groups[1].netMonthly).toBe(5250);
    expect(view.combinedNetMonthly).toBe(9450);
    expect(view.rent).toBe(1710);
    expect(view.other).toBe(OTHER_MONTHLY_EXPENSES);
    expect(OTHER_MONTHLY_EXPENSES).toBe(1700);
    expect(view.remainder).toBe(6040);
  });

  it("keeps a single net when the family is Seul(e)", () => {
    const view = householdLiving({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.combinedNetMonthly).toBe(4200);
    expect(view.remainder).toBe(790);
  });
});

describe("draftNet", () => {
  it("recomputes annual and monthly net from a live gross and province code", () => {
    expect(draftNet(72000, "QC")).toEqual({ netAnnual: 50400, netMonthly: 4200 });
    expect(draftNet(78000, "ON")).toEqual({ netAnnual: 56940, netMonthly: 4745 });
  });
});
```

- [ ] **Step 2: RED** — `npx vitest run src/lib/household-living.test.ts` (missing module)

- [ ] **Step 3: Implementation**

Create `src/lib/household-living.ts`:

```ts
import { provinceCode, provinceData } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import { netEstimate } from "@/lib/finance";
import { householdSalaries, type HouseholdSalaryGroup } from "@/lib/household-salaries";

export const OTHER_MONTHLY_EXPENSES = 1700;

export type HouseholdLiving = {
  groups: HouseholdSalaryGroup[];
  combinedNetMonthly: number;
  rent: number;
  other: number;
  remainder: number;
  province: string;
};

export function householdLiving(profile: Profile): HouseholdLiving {
  const salaries = householdSalaries(profile);
  const code = provinceCode(profile.province);
  const rent = provinceData[code]?.rent ?? 0;
  const combinedNetMonthly = salaries.groups.reduce((sum, group) => sum + group.netMonthly, 0);
  return {
    groups: salaries.groups,
    combinedNetMonthly,
    rent,
    other: OTHER_MONTHLY_EXPENSES,
    remainder: Math.max(0, combinedNetMonthly - rent - OTHER_MONTHLY_EXPENSES),
    province: salaries.province,
  };
}

export function draftNet(gross: number, code: string) {
  const netAnnual = netEstimate(Math.max(0, Number(gross) || 0), code);
  return { netAnnual, netMonthly: Math.round(netAnnual / 12) };
}
```

- [ ] **Step 4: GREEN** — same vitest command, PASS

- [ ] **Step 5: Commit** — Skip. Do not run git.

---

### Task 2: CalculatorsSection + catalog

**Files:**
- Modify: `src/catalog.ts`
- Modify: `src/features/registry.tsx`
- Modify: `src/features/market.tsx`
- Modify: `src/features/market.test.ts`

- [ ] **Step 1: failing tests**

Append to `src/features/market.test.ts`:

```ts
describe("calculators catalog", () => {
  it("keeps three calculator slides between salaries and provinces", () => {
    const ids = sections.map((section) => section.id);
    expect(ids.indexOf("salaires") + 1).toBe(ids.indexOf("calculateurs"));
    expect(ids.indexOf("calculateurs") + 1).toBe(ids.indexOf("provinces"));
    expect(sections.find((section) => section.id === "calculateurs")?.slideCount).toBe(3);
    expect(sections.find((section) => section.id === "calculateurs")?.label).toBe("Calculateurs");
  });
});

describe("calculators chrome", () => {
  it("reuses the profil client shell on CalculatorsSection", () => {
    expect(source).toContain("export function CalculatorsSection");
    expect(source).toContain("householdLiving");
    expect(source).toContain("draftNet");
    expect(source).toContain("Combien reste-t-il réellement après les retenues ?");
    expect(source).toContain("Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes.");
    expect(source).toContain("Le brut impressionne. Le net, c’est ça qui paie le loyer.");
    expect(source).toContain('smart("Que vaut ce salaire à {province} ?", profile)');
    expect(source).toContain("Un salaire n’existe pas tout seul. Il se mesure au loyer.");
    expect(source).toContain("Combien faut-il préparer pour démarrer ?");
    expect(source).toContain("Un projet Canada, ce n’est pas seulement des honoraires.");
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
    expect(source).toContain("Net annuel estimatif");
    expect(source).toContain(" / mois");
    expect(source).toContain("Loyer indicatif");
    expect(source).toContain("Autres dépenses estimées");
    expect(source).toContain("Reste estimatif");
    expect(source).toContain("Honoraires IR");
    expect(source).toContain("Démarches & tests");
    expect(source).toContain("Fonds de sécurité");
    expect(source).toContain("À estimer");
    expect(source).toContain("À prévoir");
    expect(source).toContain("Math.min(profile.budget || 5000, 5000)");
  });
});
```

- [ ] **Step 2: RED** — `npx vitest run src/features/market.test.ts`

- [ ] **Step 3: Implementation**

1. In `src/catalog.ts`:
- Add `"calculateurs"` to `SectionId`
- Import `Calculator` from lucide-react
- Insert `{ id: "calculateurs", label: "Calculateurs", icon: Calculator, slideCount: 3 }` after salaires

2. In `src/features/registry.tsx`:
- Import `CalculatorsSection` from market
- Add `calculateurs: CalculatorsSection`

3. In `src/features/market.tsx` add:

```ts
import { draftNet, householdLiving } from "@/lib/household-living";
import { netEstimate } from "@/lib/finance";
```

`netEstimate` is only needed if used directly — prefer `draftNet`. Do not re-add unused imports. Keep existing `Input` and `Select`. `useState` is already imported.

Replace nothing in Salaries. Insert `export function CalculatorsSection` **immediately before** `export function ProvincesSection`.

```tsx
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
  const other = market.accompanying;
  const lead = other
    ? "Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes."
    : "Le brut impressionne. Le net, c’est ça qui paie le loyer.";
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  const initialCode = provinceCode(market.province);
  const [drafts, setDrafts] = useState(() =>
    living.groups.map((group) => ({
      role: group.adult.role,
      gross: group.adult.mid,
      code: initialCode,
    })),
  );
  return (
    <OpportunitiesShell
      kicker="Calculateur · Salaire net"
      title="Combien reste-t-il réellement après les retenues ?"
      lead={lead}
      pills={pills}
    >
      <div className="grid shrink-0 gap-3">
        {living.groups.map((group) => {
          const draft = drafts.find((item) => item.role === group.adult.role) ?? {
            role: group.adult.role,
            gross: group.adult.mid,
            code: initialCode,
          };
          const net = draftNet(draft.gross, draft.code);
          return (
            <Surface key={group.adult.role} className="p-4">
              <SectionLabel>
                {group.adult.label} · {group.adult.member.profession}
              </SectionLabel>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_minmax(160px,auto)]">
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Salaire annuel brut</span>
                  <Input
                    type="number"
                    value={draft.gross}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.role === group.adult.role ? { ...item, gross: Number(event.target.value) || 0 } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Province</span>
                  <Select
                    value={draft.code}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.role === group.adult.role ? { ...item, code: event.target.value } : item,
                        ),
                      )
                    }
                  >
                    {Object.entries(provinceData).map(([code, province]) => (
                      <option key={code} value={code}>
                        {province.name}
                      </option>
                    ))}
                  </Select>
                </label>
                <div className="rounded-xl bg-secondary px-4 py-3">
                  <span className="text-[10px] uppercase text-muted-foreground">Net annuel estimatif</span>
                  <strong className="mt-1 block text-[22px] text-primary">{money(net.netAnnual)}</strong>
                  <small className="text-[12px] text-muted-foreground">
                    ≈ {money(net.netMonthly)} / mois
                  </small>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </OpportunitiesShell>
  );
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
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Calculateur · Coût de la vie"
      title={smart("Que vaut ce salaire à {province} ?", profile)}
      lead="Un salaire n’existe pas tout seul. Il se mesure au loyer."
      pills={pills}
    >
      <Surface className="p-4">
        <SectionLabel>
          {market.family} · {market.province}
        </SectionLabel>
        {living.groups.length > 1 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {living.groups.map((group) => (
              <div key={group.adult.role} className="rounded-[10px] border border-border bg-white p-3">
                <span className="block text-[10px] text-muted-foreground">
                  {group.adult.label} · {group.adult.member.profession}
                </span>
                <b className="mt-1 block text-sm">{money(group.netMonthly)} / mois</b>
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Net mensuel</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.combinedNetMonthly)}</strong>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Loyer indicatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.rent)}</strong>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Autres dépenses estimées</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.other)}</strong>
          </div>
          <div className="rounded-[14px] border border-transparent bg-linear-to-br from-primary to-ir-deep p-5 text-white">
            <span className="block text-[10px] uppercase opacity-75">Reste estimatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.remainder)}</strong>
          </div>
        </div>
      </Surface>
    </OpportunitiesShell>
  );
}

function CalculatorsBudget({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const pills = [market.family, market.province];
  const fees = Math.min(profile.budget || 5000, 5000);
  const cards = [
    ["Honoraires IR", money(fees)],
    ["Démarches & tests", "À estimer"],
    ["Installation", "À estimer"],
    ["Fonds de sécurité", "À prévoir"],
  ] as const;
  return (
    <OpportunitiesShell
      kicker="Calculateur · Budget projet"
      title="Combien faut-il préparer pour démarrer ?"
      lead="Un projet Canada, ce n’est pas seulement des honoraires."
      pills={pills}
    >
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        {cards.map(([label, value]) => (
          <Surface key={label} className="p-5">
            <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
            <strong className="mt-2 block text-[24px] text-primary">{value}</strong>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}
```

Keep `ProvincesSection` exactly after this block.

- [ ] **Step 4: GREEN**

`npx vitest run src/features/market.test.ts src/lib/household-living.test.ts src/lib/household-salaries.test.ts`

- [ ] **Step 5: Commit** — Skip.

---

## Self-review

Spec coverage: helper + 3 slides + catalog position. No profile setters. No coaching. Combined rent once on slide 2.
