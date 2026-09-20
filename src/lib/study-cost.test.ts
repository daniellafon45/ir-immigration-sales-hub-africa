import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { studyPrograms } from "@/data/study-programs";
import { studyTuition } from "@/data/study-tuition";
import { subsistenceFunds, studyFundsCaq } from "@/data/study-funds";
import { studyLivingIrccFor } from "@/data/ircc-funds";
import { studyCost } from "@/lib/study-cost";

const soloStudy = {
  ...defaultProfile,
  family: "Seul(e)",
  objective: "Études",
  spouse: emptyAdult,
} as const;

describe("study catalog", () => {
  it("keeps named programs with a target profession and employability", () => {
    expect(studyPrograms.length).toBeGreaterThanOrEqual(12);
    for (const program of studyPrograms) {
      expect(program.name.length).toBeGreaterThan(8);
      expect(program.profession.length).toBeGreaterThan(3);
      expect(program.employability).toBeGreaterThan(0);
      expect(program.employability).toBeLessThanOrEqual(100);
    }
  });

  it("covers every province and territory for the four study levels", () => {
    const codes = Object.keys(studyTuition.cegep);
    expect(codes).toHaveLength(13);
    expect(codes).toEqual(Object.keys(studyTuition.bachelor));
    expect(studyTuition.cegep.QC).toBe(18000);
    expect(studyTuition.bachelor.QC).toBe(24000);
  });
});

describe("studyCost", () => {
  it("builds a 13-row cégep vs university grid and household year-1 costs without a spouse", () => {
    const cost = studyCost(soloStudy);
    expect(cost.grid).toHaveLength(13);
    expect(cost.grid.filter((row) => row.selected)).toHaveLength(1);
    expect(cost.grid.find((row) => row.selected)?.code).toBe("QC");
    expect(cost.spouse).toBeUndefined();
    expect(cost.student.profession).toBe("Comptable");
    expect(cost.tuitionLow).toBe(studyTuition.cegep.QC);
    expect(cost.tuitionHigh).toBe(studyTuition.bachelor.QC);
    expect(cost.subsistence).toBe(subsistenceFunds(studyFundsCaq, false, 0));
    expect(cost.fundsLabel).toBe("CAQ");
    expect(cost.proofOfFunds).toBe(cost.tuition + cost.subsistence);
    expect(cost.livingAnnual).toBeGreaterThan(cost.subsistence);
  });

  it("adds spouse salary and employability when a partner is on the file", () => {
    const cost = studyCost({ ...defaultProfile, objective: "Études" });
    expect(cost.spouse?.profession).toBe("Développeur logiciel");
    expect(cost.spouse?.mid).toBe(90000);
    expect(cost.spouse?.employability).toBeGreaterThan(0);
    expect(cost.spouse?.employabilityLabel.length).toBeGreaterThan(3);
    expect(cost.subsistence).toBe(subsistenceFunds(studyFundsCaq, true, 0));
  });

  it("uses the chosen program for student outcomes and leaves the spouse profession untouched", () => {
    const cost = studyCost({
      ...defaultProfile,
      objective: "Études",
      studyLevel: "bachelor",
      studyProgramId: "bac-nursing",
    });
    expect(cost.programName).toMatch(/sciences infirmières/i);
    expect(cost.student.profession).toBe("Infirmier(ère)");
    expect(cost.tuition).toBe(studyTuition.bachelor.QC);
    expect(cost.spouse?.profession).toBe("Développeur logiciel");
  });

  it("counts children in IRCC subsistence outside Quebec", () => {
    const cost = studyCost({
      ...defaultProfile,
      objective: "Études",
      family: "Couple + enfant(s)",
      province: "Ontario",
      children: [{ id: "child-1", firstName: "Léa", age: 6 }],
    });
    expect(cost.fundsLabel).toBe("IRCC");
    expect(cost.subsistence).toBe(studyLivingIrccFor(3));
    expect(cost.subsistence).toBe(35888);
    expect(cost.proofOfFunds).toBe(cost.tuition + 35888);
    expect(cost.grid.find((row) => row.selected)?.code).toBe("ON");
  });
});
