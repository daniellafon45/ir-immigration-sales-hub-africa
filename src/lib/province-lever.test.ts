import { describe, expect, it } from "vitest";
import { defaultApplicant, defaultSpouse } from "@/data/profile";
import { provinceLever } from "@/lib/province-lever";

describe("provinceLever", () => {
  it("uses French vs Quebec requirement for a strong francophone", () => {
    const lever = provinceLever(defaultApplicant, "Québec");
    expect(lever).toEqual({
      requirementLabel: "Exigence FR",
      requirementValue: "Très forte",
      candidateLabel: "Français",
      candidateValue: "Avancé",
      verdict: "Atout francophone — levier de qualification",
      positive: true,
    });
  });

  it("flags weak French in Quebec as a qualification brake", () => {
    const lever = provinceLever({ ...defaultApplicant, french: "Débutant" }, "Québec");
    expect(lever.verdict).toBe("Frein linguistique — qualifier le FR d'abord");
    expect(lever.positive).toBe(false);
    expect(lever.candidateValue).toBe("Débutant");
  });

  it("treats intermediate French in Quebec as a threshold to strengthen", () => {
    const lever = provinceLever({ ...defaultApplicant, french: "Intermédiaire" }, "Québec");
    expect(lever.verdict).toBe("Seuil possible — consolider le français");
    expect(lever.positive).toBe(false);
  });

  it("treats bilingual French in Quebec as a reinforced asset", () => {
    const lever = provinceLever({ ...defaultApplicant, french: "Bilingue" }, "Québec");
    expect(lever.verdict).toBe("Atout francophone — qualification renforcée");
    expect(lever.positive).toBe(true);
  });

  it("uses English as the sales lever outside Quebec", () => {
    const lever = provinceLever(defaultSpouse, "Ontario");
    expect(lever).toEqual({
      requirementLabel: "Langue prioritaire",
      requirementValue: "Anglais",
      candidateLabel: "Anglais",
      candidateValue: "Avancé",
      verdict: "Anglais solide — levier d'employabilité",
      positive: true,
    });
  });

  it("flags weak English outside Quebec", () => {
    const lever = provinceLever({ ...defaultSpouse, english: "Débutant" }, "Alberta");
    expect(lever.verdict).toBe("Frein linguistique — anglais à qualifier");
    expect(lever.positive).toBe(false);
  });
});
