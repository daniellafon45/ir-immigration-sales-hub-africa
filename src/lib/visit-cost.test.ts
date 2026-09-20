import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { visitFundsFor } from "@/data/visit-funds";
import { visitCost } from "@/lib/visit-cost";

describe("visit funds", () => {
  it("raises recommended funds with duration and household size", () => {
    expect(visitFundsFor("15d", 1, 0)).toBeGreaterThan(0);
    expect(visitFundsFor("1m", 1, 0)).toBeGreaterThan(visitFundsFor("15d", 1, 0));
    expect(visitFundsFor("3m", 2, 1)).toBeGreaterThan(visitFundsFor("1m", 1, 0));
    expect(visitFundsFor("6m", 2, 1)).toBeGreaterThan(visitFundsFor("3m", 2, 1));
  });
});

describe("visitCost", () => {
  it("uses the monthly basket for a solo one-month visit and never sells work rights", () => {
    const cost = visitCost({
      ...defaultProfile,
      objective: "Visite",
      family: "Seul(e)",
      spouse: emptyAdult,
      country: "Bénin",
      visitPurpose: "",
      visitDuration: "",
    });

    expect(cost.purpose).toBe("tourism");
    expect(cost.duration).toBe("1m");
    expect(cost.assumedPurpose).toBe(true);
    expect(cost.assumedDuration).toBe(true);
    expect(cost.stayCost).toBe(2440);
    expect(cost.fundsRequired).toBeGreaterThan(cost.stayCost);
    expect(cost.feesTotal).toBe(185);
    expect(cost.ticketsDemo).toBe(2400);
    expect(cost.gap).toBe(cost.fundsRequired - cost.stayCost);
    expect(cost.accompanying).toBeUndefined();
    expect(cost.canWork).toBe(false);
  });

  it("scales stay cost, fees and funds for a couple with one child over three months", () => {
    const solo = visitCost({
      ...defaultProfile,
      objective: "Visite",
      family: "Seul(e)",
      spouse: emptyAdult,
      country: "Bénin",
      visitPurpose: "tourism",
      visitDuration: "1m",
    });

    const family = visitCost({
      ...defaultProfile,
      objective: "Visite",
      family: "Couple + enfant(s)",
      country: "France",
      visitPurpose: "family",
      visitDuration: "3m",
      children: [{ id: "c1", firstName: "Léa", age: 6 }],
    });

    expect(family.purpose).toBe("family");
    expect(family.duration).toBe("3m");
    expect(family.assumedPurpose).toBe(false);
    expect(family.assumedDuration).toBe(false);
    expect(family.stayCost).toBe(4570 * 3);
    expect(family.feesTotal).toBeGreaterThan(solo.feesTotal);
    expect(family.fundsRequired).toBeGreaterThan(solo.fundsRequired);
    expect(family.ticketsDemo).toBe(6000);
    expect(family.accompanying).toEqual({ adults: 2, kids: 1 });
    expect(family.canWork).toBe(false);
  });
});
