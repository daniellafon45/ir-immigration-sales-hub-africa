# Review package — Salaires Task 1

**Base:** none (no project git)
**Head:** working tree
**Commits:** none (git forbidden)

## Stat

```
A  src/lib/household-salaries.ts
A  src/lib/household-salaries.test.ts
```

## Diff (new files in full)

### src/lib/household-salaries.ts

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

### src/lib/household-salaries.test.ts

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
