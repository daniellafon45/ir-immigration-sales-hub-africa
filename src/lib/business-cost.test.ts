import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { businessCost } from "@/lib/business-cost";

describe("businessCost", () => {
  it("keeps visitor as a short stay with travel funds, no investment and no spouse open permit", () => {
    const cost = businessCost({
      ...defaultProfile,
      objective: "Affaires",
      family: "Couple",
      businessPath: "visitor",
    });

    expect(cost.path?.id).toBe("visitor");
    expect(cost.investment).toBe(0);
    expect(cost.livingAnnual).toBe(0);
    expect(cost.stayShort).toBeGreaterThan(0);
    expect(cost.travelFunds).toBeGreaterThan(0);
    expect(cost.capitalToShow).toBe(cost.stayShort + cost.travelFunds);
    expect(cost.spouseOpen).toBe(false);
    expect(cost.spouse?.openWork).toBe(false);
    expect(cost.startupPaused).toBe(true);
  });

  it("uses the Quebec entrepreneur threshold plus annual living costs against Bonne capacity", () => {
    const cost = businessCost({
      ...defaultProfile,
      objective: "Affaires",
      province: "Québec",
      family: "Couple",
      businessPath: "pnp-entrepreneur",
      applicant: {
        ...defaultProfile.applicant,
        salary: "Bonne",
      },
    });

    expect(cost.path?.id).toBe("pnp-entrepreneur");
    expect(cost.investment).toBe(200000);
    expect(cost.livingAnnual).toBeGreaterThan(0);
    expect(cost.stayShort).toBe(0);
    expect(cost.personalFunds).toBe(48000);
    expect(cost.capitalToShow).toBe(cost.investment + cost.livingAnnual);
    expect(cost.gap).toBe(cost.capitalToShow - 48000);
    expect(cost.spouseOpen).toBe(true);
    expect(cost.spouse?.openWork).toBe(true);
    expect(cost.spouse?.profession).toBe("Développeur logiciel");
    expect(cost.spouse?.mid).toBeGreaterThan(0);
    expect(cost.grid).toHaveLength(13);
    expect(cost.grid.find((row) => row.selected)?.code).toBe("QC");
    expect(cost.credibility.experienceYears).toBe(5);
    expect(cost.credibility.fundsLabel).toBe("Bonne");
    expect(cost.credibility.province).toBe("Québec");
  });

  it("omits the spouse outcome on a solo file even when the path could open a permit", () => {
    const cost = businessCost({
      ...defaultProfile,
      objective: "Affaires",
      family: "Seul(e)",
      spouse: emptyAdult,
      businessPath: "c11",
    });

    expect(cost.spouseOpen).toBe(false);
    expect(cost.spouse).toBeUndefined();
    expect(cost.path?.spouseOpenEligible).toBe(true);
  });

  it("treats ICT as a transfer without an investment threshold", () => {
    const cost = businessCost({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "ict",
    });

    expect(cost.investment).toBe(0);
    expect(cost.livingAnnual).toBeGreaterThan(0);
    expect(cost.path?.needsInvestment).toBe(false);
  });
});
