# Task 1 brief — householdSalaries helper

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-18-salaires-profil-chrome.md` (Task 1 only)
**Spec:** `docs/superpowers/specs/2026-09-18-salaires-profil-design.md`

## Where this fits

Guide salarial currently shows Bas / Médian / Élevé for the principal profession only. This helper groups salary bands and net estimates **per adult of the household**, so the UI (Task 2) can render one Surface per adult. Do not change UI in this task.

## Global constraints (binding)

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- User-facing language stays French. Code, types, and test names stay in English.
- Do not modify `OpportunitiesSection`, `JobsSection`, `SalariesSection`, `ProvincesSection`, or `src/data/salaries.ts`.
- Skip git commits; status DONE still applies.

## Files

- Create: `src/lib/household-salaries.ts`
- Test: `src/lib/household-salaries.test.ts`

## Interfaces

- Consumes: `householdMarket` from `@/lib/household-market`; `salaryData` from `@/data/salaries`; `netEstimate` from `@/lib/finance`; `provinceCode` from `@/data/provinces`; `Profile` from `@/data/profile`
- Produces: `export type HouseholdSalaryGroup`; `export type HouseholdSalaries`; `export function householdSalaries(profile: Profile): HouseholdSalaries`

For each adult of `householdMarket(profile).adults`:

- `low` / `mid` / `high` already on the adult (via `salaryForProfession`)
- `bands` = `salaryData[profession] ?? salaryData.Comptable`
- `netAnnual` = `netEstimate(mid, provinceCode(profile.province))`
- `netMonthly` = `Math.round(netAnnual / 12)`
- `province` = `market.province`

## TDD

Follow superpowers:test-driven-development. Write the failing test first, watch it fail, then implement.

### Step 1: failing test

Create `src/lib/household-salaries.test.ts` **exactly**:

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

### Step 2: RED

Run: `npx vitest run src/lib/household-salaries.test.ts`
Expected: FAIL (missing module).

### Step 3: implementation

Create `src/lib/household-salaries.ts` **exactly**:

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

### Step 4: GREEN

Run: `npx vitest run src/lib/household-salaries.test.ts`
Expected: PASS.

### Step 5: Commit

Skip. Do not run git.

## Report

Write your full report to:
`c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme\docs\superpowers\sdd\salaires-task-1-report.md`

Then return only status, no commits, one-line test summary, concerns, report path.
