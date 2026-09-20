import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { salaryData } from "@/data/salaries";
import { householdSalaries } from "@/lib/household-salaries";
import { recognitionFor, seniorityFor } from "@/lib/salary-recognition";

describe("seniorityFor", () => {
  it("maps 0–2 years to entry, 3–7 to mid, and 8+ to senior", () => {
    expect(seniorityFor(0)).toBe("entry");
    expect(seniorityFor(2)).toBe("entry");
    expect(seniorityFor(3)).toBe("mid");
    expect(seniorityFor(7)).toBe("mid");
    expect(seniorityFor(8)).toBe("senior");
    expect(seniorityFor(12)).toBe("senior");
  });
});

describe("recognitionFor", () => {
  it("places a 5-year Comptable at Bas once years are discounted in Quebec", () => {
    const view = recognitionFor({
      profession: "Comptable",
      years: 5,
      band: salaryData.Comptable.QC,
      province: "Québec",
      french: "Avancé",
      english: "Intermédiaire",
    });

    expect(view.declaredYears).toBe(5);
    expect(view.recognizedYears).toBe(2);
    expect(view.declaredTier).toBe("mid");
    expect(view.recognizedTier).toBe("entry");
    expect(view.declaredSalary).toBe(72000);
    expect(view.recognizedSalary).toBe(52000);
    expect(view.gap).toBe(20000);
    expect(view.netAnnual).toBe(36400);
    expect(view.netMonthly).toBe(3033);
    expect(view.missingYears).toBe(1);
    expect(view.targetLabel).toBe("Médian");
    expect(view.regulated).toBe(true);
    expect(view.regulator).toBe("Ordre comptable (CPA)");
    expect(view.facts).toEqual([
      "Métier réglementé · Ordre comptable (CPA)",
      "La langue tient. L’écart vient surtout de la reconnaissance.",
      "Équivalence : 12–24 mois, ordre de grandeur.",
    ]);
    expect(view.climbCopy).toBe("Il manque 1 année reconnue pour viser le palier Médian.");
  });

  it("places an 8-year software developer at Médian once years are discounted", () => {
    const view = recognitionFor({
      profession: "Développeur logiciel",
      years: 8,
      band: salaryData["Développeur logiciel"].QC,
      province: "Québec",
      french: "Intermédiaire",
      english: "Avancé",
    });

    expect(view.recognizedYears).toBe(6);
    expect(view.declaredTier).toBe("senior");
    expect(view.recognizedTier).toBe("mid");
    expect(view.declaredSalary).toBe(125000);
    expect(view.recognizedSalary).toBe(90000);
    expect(view.gap).toBe(35000);
    expect(view.missingYears).toBe(2);
    expect(view.targetLabel).toBe("Élevé");
    expect(view.regulated).toBe(false);
    expect(view.facts[0]).toBe("Métier non réglementé · les années transférent mieux");
    expect(view.facts[1]).toBe("Le médian suppose un français qui tient au travail.");
    expect(view.facts[2]).toBe("L’expérience canadienne accélère le palier.");
    expect(view.climbCopy).toBe("Il manque 2 années reconnues pour viser le palier Élevé.");
  });

  it("uses English copy outside Quebec and the default factor for unknown professions", () => {
    const view = recognitionFor({
      profession: "Aide-soignant(e)",
      years: 4,
      band: salaryData.Comptable.ON,
      province: "Ontario",
      french: "Avancé",
      english: "Intermédiaire",
    });

    expect(view.factor).toBe(0.5);
    expect(view.recognizedYears).toBe(2);
    expect(view.recognizedSalary).toBe(56000);
    expect(view.facts[1]).toBe("Le médian suppose un anglais qui tient au travail.");
  });

  it("keeps the same-tier case without a climb prompt", () => {
    const view = recognitionFor({
      profession: "Comptable",
      years: 2,
      band: salaryData.Comptable.QC,
      province: "Québec",
      french: "Avancé",
      english: "Intermédiaire",
    });

    expect(view.declaredTier).toBe("entry");
    expect(view.recognizedTier).toBe("entry");
    expect(view.sameTier).toBe(true);
    expect(view.gap).toBe(0);
    expect(view.climbCopy).toBeNull();
  });
});

describe("householdSalaries recognition", () => {
  it("attaches recognition to default couple groups from the market phase", () => {
    const view = householdSalaries(defaultProfile);
    expect(view.groups[0].recognition.recognizedYears).toBe(2);
    expect(view.groups[0].recognition.gap).toBe(20000);
    expect(view.groups[1].recognition.recognizedYears).toBe(6);
    expect(view.groups[1].recognition.gap).toBe(35000);
  });

  it("computes student recognition from the post-study band, not the internship", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      objective: "Études",
      spouse: emptyAdult,
    });
    expect(view.groups[0].phases.map((phase) => phase.id)).toEqual(["postStudy", "internship"]);
    expect(view.groups[0].recognition.declaredSalary).toBe(72000);
    expect(view.groups[0].recognition.recognizedSalary).toBe(52000);
  });
});
