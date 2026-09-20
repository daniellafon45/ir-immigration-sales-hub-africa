# Task 1 brief — householdLiving helper

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-18-calculateurs-profil-chrome.md` (Task 1 only)
**Spec:** `docs/superpowers/specs/2026-09-18-calculateurs-profil-design.md`

## Where this fits

Calculateurs is being re-added to the React deck. This helper computes combined household living costs from `householdSalaries`. Task 2 (not you) will build the UI. Do not touch `market.tsx`, catalog, or registry.

## Global constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any git command. Do not commit.
- Code/types/tests in English.
- Do not modify `household-salaries.ts` or UI files.
- `OTHER_MONTHLY_EXPENSES` = `1700`.
- Skip git; status DONE still applies.

## Files

- Create: `src/lib/household-living.ts`
- Test: `src/lib/household-living.test.ts`

## TDD

Follow superpowers:test-driven-development.

### Step 1 — test exactly

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

### Step 2 RED

`npx vitest run src/lib/household-living.test.ts`

### Step 3 implementation exactly

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

### Step 4 GREEN — same command, PASS

### Step 5 — no git

## Report

Write full report to:
`c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme\docs\superpowers\sdd\calculateurs-task-1-report.md`

Return only: Status, commits none, test summary, concerns, report path.
