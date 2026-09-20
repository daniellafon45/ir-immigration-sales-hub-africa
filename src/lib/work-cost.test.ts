import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { workCost } from "@/lib/work-cost";

describe("workCost", () => {
  it("builds a solo work year-1 estimate without spouse outcome", () => {
    const cost = workCost({
      ...defaultProfile,
      objective: "Travail",
      family: "Seul(e)",
      spouse: emptyAdult,
      workNocCode: "11100",
      workPermitKind: "lmia",
      workHasOffer: true,
    });

    expect(cost.livingAnnual).toBeGreaterThan(0);
    expect(cost.settlementFunds).toBe(Math.round(cost.livingAnnual / 4));
    expect(cost.fees).toEqual({
      permit: 155,
      openHolder: 0,
      biometrics: 85,
      total: 240,
    });
    expect(cost.salary.mid).toBe(72000);
    expect(cost.salary.net).toBe(50400);
    expect(cost.spouse).toBeUndefined();
  });

  it("adds spouse outcome when the couple qualifies for a spouse open work permit", () => {
    const cost = workCost({
      ...defaultProfile,
      objective: "Travail",
      family: "Couple",
      workNocCode: "21232",
      workPermitKind: "lmia",
      workHasOffer: true,
    });

    expect(cost.fees.total).toBe(325);
    expect(cost.spouse?.profession).toBe("Développeur logiciel");
    expect(cost.spouse?.mid).toBe(90000);
    expect(cost.spouse?.net).toBe(63000);
    expect(cost.spouse?.employabilityLabel.length).toBeGreaterThan(3);
  });

  it("keeps spouse outcome hidden when the couple is not spouse-open eligible", () => {
    const cost = workCost({
      ...defaultProfile,
      objective: "Travail",
      family: "Couple",
      workNocCode: "75110",
      workPermitKind: "lmia",
      workHasOffer: true,
    });

    expect(cost.spouse).toBeUndefined();
    expect(cost.pathways.spouseOpen?.eligible).toBe(false);
    expect(cost.pathways.prAfter.cecEligible).toBe(false);
  });
});
