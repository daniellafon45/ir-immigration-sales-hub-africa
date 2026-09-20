# Review package: Task 1 householdMarket (no git)

**Base:** none (no project git)
**Head:** working tree
**Commits:** none (skipped on purpose)

## Files changed

```
A src/lib/household-market.ts
A src/lib/household-market.test.ts
```

## Diff

New file: src/lib/household-market.ts

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

New file: src/lib/household-market.test.ts

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
