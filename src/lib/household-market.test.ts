import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { householdMarket } from "@/lib/household-market";

describe("householdMarket", () => {
  it("builds a couple view with Aminata selected and Mamadou accompanying", () => {
    const market = householdMarket(defaultProfile);
    expect(market.adults).toHaveLength(2);
    expect(market.adults.map((adult) => adult.label)).toEqual(["Candidat", "Conjoint"]);
    expect(market.principal.member.firstName).toBe("Aminata");
    expect(market.principal.selected).toBe(true);
    expect(market.principal.low).toBe(52000);
    expect(market.principal.mid).toBe(72000);
    expect(market.principal.high).toBe(98000);
    expect(market.principal.member.sector).toBe("Finance et comptabilité");
    expect(market.accompanying?.member.firstName).toBe("Mamadou");
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
    expect(names).toEqual(expect.arrayContaining(["Mamadou", "Awa"]));
    expect(market.kids).toEqual([{ id: "child-1", firstName: "Léa", age: 4 }]);
    expect(market.family).toMatch(/Polygame/);
  });

  it("overlays the study program profession on the applicant only", () => {
    const market = householdMarket({
      ...defaultProfile,
      objective: "Études",
      studyLevel: "bachelor",
      studyProgramId: "bac-nursing",
    });
    expect(market.adults[0]?.member.profession).toBe("Infirmier(ère)");
    expect(market.adults[1]?.member.profession).toBe("Développeur logiciel");
    expect(market.adults[1]?.label).toBe("Conjoint");
  });
});

