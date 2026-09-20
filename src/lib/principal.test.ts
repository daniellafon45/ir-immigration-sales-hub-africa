import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { getPrincipalMember, recommendPrincipal, scoreAdult } from "@/lib/principal";

describe("principal applicant", () => {
  it("recommends Aminata in Quebec thanks to stronger French", () => {
    const result = recommendPrincipal(defaultProfile);
    expect(result.recommended).toBe("applicant");
    expect(getPrincipalMember(defaultProfile).firstName).toBe("Aminata");
    expect(result.applicantScore.language).toBeGreaterThan(result.spouseScore.language);
  });

  it("recommends the spouse when the occupation and salary clearly dominate", () => {
    const profile = {
      ...defaultProfile,
      province: "Ontario",
      applicant: { ...defaultProfile.applicant, french: "Débutant", english: "Débutant", salary: "Faible", profession: "Cuisinier(ère)", sector: "Restauration et hôtellerie" },
      spouse: { ...defaultProfile.spouse, french: "Avancé", english: "Bilingue", salary: "Très bonne", age: 33 },
    };
    expect(recommendPrincipal(profile).recommended).toBe("spouse");
    expect(getPrincipalMember(profile).firstName).toBe("Mamadou");
  });

  it("ignores an incomplete spouse", () => {
    const profile = { ...defaultProfile, spouse: { ...emptyAdult } };
    const result = recommendPrincipal(profile);
    expect(result.spouseEligible).toBe(false);
    expect(result.selected).toBe("applicant");
  });

  it("honors a manual override", () => {
    const profile = { ...defaultProfile, principalMode: "spouse" as const };
    expect(getPrincipalMember(profile).firstName).toBe("Mamadou");
  });

  it("keeps only one accompanying spouse in a polygamous household", () => {
    const extra = {
      id: "spouse-awa",
      firstName: "Awa",
      age: 28,
      jobTitle: "",
      profession: "Infirmier(ère)",
      sector: "Santé",
      salary: "Bonne" as const,
      experience: 6,
      education: "Baccalauréat / Licence",
      french: "Avancé",
      english: "Intermédiaire",
    };
    const profile = {
      ...defaultProfile,
      family: "Polygame",
      extraSpouses: [extra],
    };
    const result = recommendPrincipal(profile);
    expect(result.selected).toBe("applicant");
    expect(result.accompanying?.member.firstName).toBeTruthy();
    expect(result.excluded).toHaveLength(1);
    const household = [result.accompanying?.member.firstName, result.excluded[0]?.member.firstName];
    expect(household).toEqual(expect.arrayContaining(["Mamadou", "Awa"]));
    expect(result.reasons.some((reason) => reason.includes("ne reconnaît"))).toBe(true);
  });

  it("scores a younger skilled profile higher on age", () => {
    const young = scoreAdult({ ...defaultProfile.applicant, age: 29 }, "Québec");
    const older = scoreAdult({ ...defaultProfile.applicant, age: 46 }, "Québec");
    expect(young.age).toBeGreaterThan(older.age);
  });
});
