import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { salaryData } from "@/data/salaries";
import { householdSalaries } from "@/lib/household-salaries";

describe("householdSalaries", () => {
  it("splits the default couple into Comptable and Développeur logiciel groups", () => {
    const view = householdSalaries(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.province).toBe("Québec");
    expect(view.groups[0].adult.member.firstName).toBe("Aminata");
    expect(view.groups[0].adult.low).toBe(52000);
    expect(view.groups[0].adult.mid).toBe(72000);
    expect(view.groups[0].adult.high).toBe(98000);
    expect(view.groups[0].bands).toEqual(salaryData.Comptable);
    expect(view.groups[0].netAnnual).toBe(50400);
    expect(view.groups[0].netMonthly).toBe(4200);
    expect(view.groups[1].adult.member.firstName).toBe("Mamadou");
    expect(view.groups[1].adult.mid).toBe(90000);
    expect(view.groups[1].bands).toEqual(salaryData["Développeur logiciel"]);
    expect(view.groups[1].netAnnual).toBe(63000);
    expect(view.groups[1].netMonthly).toBe(5250);
  });

  it("keeps a single group when the family is Seul(e)", () => {
    const view = householdSalaries({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].adult.member.firstName).toBe("Aminata");
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

  it("splits a solo study file into post-diploma and internship phases", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      objective: "Études",
      spouse: emptyAdult,
    });
    expect(view.study).toBe(true);
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].track).toBe("student");
    expect(view.groups[0].phases.map((phase) => phase.id)).toEqual(["postStudy", "internship"]);
    expect(view.groups[0].phases[0]?.mid).toBe(72000);
    expect(view.groups[0].phases[1]?.mid).toBe(35000);
    expect(view.groups[0].phases[1]?.label).toBe("Durant vos stages");
  });

  it("adds open-work employment for an accompanying spouse on a study file", () => {
    const view = householdSalaries({ ...defaultProfile, objective: "Études" });
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].track).toBe("student");
    expect(view.groups[1].track).toBe("accompanying");
    expect(view.groups[1].heading).toBe("Conjoint parrainé · Développeur logiciel");
    expect(view.groups[1].phases).toHaveLength(1);
    expect(view.groups[1].phases[0]?.id).toBe("openWork");
    expect(view.groups[1].phases[0]?.mid).toBe(90000);
  });

  it("keeps the accompanying spouse when the student is wired to a program profession", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Études",
      studyLevel: "bachelor",
      studyProgramId: "bac-nursing",
    });
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].adult.member.profession).toBe("Infirmier(ère)");
    expect(view.groups[0].track).toBe("student");
    expect(view.groups[1].adult.member.profession).toBe("Développeur logiciel");
    expect(view.groups[1].track).toBe("accompanying");
  });

  it("keeps visit files on pure market phases with no open-work spouse track", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Visite",
      visitPurpose: "tourism",
      visitDuration: "3m",
    });

    expect(view.groups).toHaveLength(2);
    expect(view.groups.map((group) => group.track)).toEqual(["market", "market"]);
    expect(view.groups.map((group) => group.phases.map((phase) => phase.id))).toEqual([["market"], ["market"]]);
  });

  it("adds an open-work spouse phase for eligible work files", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Travail",
      workNocCode: "21232",
      workPermitKind: "closed-lmia",
    });

    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].track).toBe("market");
    expect(view.groups[1].track).toBe("accompanying");
    expect(view.groups[1].phases.map((phase) => phase.id)).toEqual(["openWork"]);
  });

  it("keeps only the sponsor market group for parent sponsorship in solo files", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      spouse: emptyAdult,
      objective: "Regroupement familial",
      familyLink: "parent",
    });

    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].track).toBe("market");
    expect(view.groups[0].phases.map((phase) => phase.id)).toEqual(["market"]);
  });

  it("uses two market groups after arrival for spouse sponsorship files", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Regroupement familial",
      familyLink: "spouse",
    });

    expect(view.groups).toHaveLength(2);
    expect(view.groups.map((group) => group.track)).toEqual(["market", "market"]);
    expect(view.groups[1].heading).toBe("Après l’arrivée · Développeur logiciel");
    expect(view.groups[1].phases.map((phase) => phase.id)).toEqual(["market"]);
  });

  it("adds an open-work spouse phase for eligible business files and keeps visitor files on market tracks", () => {
    const visitor = householdSalaries({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "visitor",
    });
    expect(visitor.groups).toHaveLength(2);
    expect(visitor.groups.map((group) => group.track)).toEqual(["market", "market"]);
    expect(visitor.groups.map((group) => group.phases.map((phase) => phase.id))).toEqual([["market"], ["market"]]);

    const c11 = householdSalaries({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "c11",
    });
    expect(c11.groups[1].track).toBe("accompanying");
    expect(c11.groups[1].phases.map((phase) => phase.id)).toEqual(["openWork"]);
  });
});
