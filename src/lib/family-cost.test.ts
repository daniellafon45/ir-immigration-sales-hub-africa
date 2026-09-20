import { describe, expect, it } from "vitest";
import { familyFeesFor } from "@/data/family-fees";
import { familyLinkById } from "@/data/family-links";
import { requiredIncome } from "@/data/family-lico";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { familyCost } from "@/lib/family-cost";

describe("familyCost", () => {
  it("builds the spouse regroupement view from the sponsor profile without reminders", () => {
    const cost = familyCost({
      ...defaultProfile,
      objective: "Regroupement familial",
      familyLink: "spouse",
      sponsorStatus: "citizen",
    });

    expect(cost.link.id).toBe("spouse");
    expect(cost.sponsorStatus).toBe("citizen");
    expect(cost.undertakingYears).toBe(3);
    expect(cost.familySize).toBe(2);
    expect(cost.incomeRequired).toBe(39600);
    expect(cost.sponsorMid).toBe(72000);
    expect(cost.incomeGap).toBe(-32400);
    expect(cost.feesTotal).toBe(1590);
    expect(cost.sponsorCapacity).toBe(28000);
    expect(cost.livingReunitedAnnual).toBe(41520);
    expect(cost.delay.routeId).toBe("family");
    expect(cost.delay.headline).toBe("14-20 mois");
    expect(cost.sponsored).toEqual({
      profession: "Développeur logiciel",
      low: 65000,
      mid: 90000,
      high: 125000,
      employability: 76,
      employabilityLabel: "Élevée",
    });
    expect(cost.superVisa).toBe(false);
    expect(cost.reminder).toBe(false);
  });

  it("keeps the parent case salary-free, enables super visa, and applies the 1.3 uplift", () => {
    const parent = familyCost({
      ...defaultProfile,
      objective: "Regroupement familial",
      family: "Seul(e)",
      spouse: emptyAdult,
      familyLink: "parent",
      sponsorStatus: "pr",
    });

    expect(parent.link.id).toBe("parent");
    expect(parent.undertakingYears).toBe(20);
    expect(parent.familySize).toBe(2);
    expect(parent.incomeRequired).toBe(51480);
    expect(requiredIncome("Québec", parent.familySize, "child")).toBe(39600);
    expect(parent.feesTotal).toBe(1590);
    expect(parent.livingReunitedAnnual).toBe(41520);
    expect(parent.sponsored).toBeUndefined();
    expect(parent.childSponsored).toBeUndefined();
    expect(parent.sponsorCapacity).toBe(28000);
    expect(parent.superVisa).toBe(true);
    expect(parent.reminder).toBe(false);
  });

  it("keeps spouse reminders only for a valid spouse link without inventing a fallback", () => {
    expect(familyLinkById("")).toBeUndefined();
    expect(familyLinkById("unknown")).toBeUndefined();

    const spouseMissing = familyCost({
      ...defaultProfile,
      objective: "Regroupement familial",
      family: "Seul(e)",
      spouse: emptyAdult,
      familyLink: "spouse",
    });

    expect(spouseMissing.link?.id).toBe("spouse");
    expect(spouseMissing.reminder).toBe(true);
    expect(spouseMissing.sponsored).toBeUndefined();

    const noLink = familyCost({
      ...defaultProfile,
      objective: "Regroupement familial",
      family: "Seul(e)",
      spouse: emptyAdult,
      familyLink: "",
    });

    expect(noLink.link).toBeUndefined();
    expect(noLink.undertakingYears).toBeUndefined();
    expect(noLink.reminder).toBe(false);
    expect(noLink.sponsored).toBeUndefined();
    expect(noLink.superVisa).toBe(false);
    expect(noLink.feesTotal).toBe(1590);
  });

  it("does not invent a salary for an adult child and still names age and studies or work", () => {
    const child = familyCost({
      ...defaultProfile,
      objective: "Regroupement familial",
      family: "Couple + enfant(s)",
      familyLink: "child",
      children: [{ id: "c1", firstName: "Léa", age: 19 }],
    });

    expect(child.familySize).toBe(3);
    expect(child.sponsored).toBeUndefined();
    expect(child.childSponsored).toEqual({ firstName: "Léa", age: 19, inSchool: false });
    expect(child.superVisa).toBe(false);
  });

  it("keeps rprf for child regroupement and still applies child and Quebec extras", () => {
    const fees = familyFeesFor({
      ...defaultProfile,
      objective: "Regroupement familial",
      familyLink: "child",
      province: "Québec",
    });

    expect(fees.breakdown.rprf).toBe(575);
    expect(fees.breakdown.childExtra).toBe(155);
    expect(fees.breakdown.quebecMifi).toBe(300);
    expect(fees.total).toBe(1745);
  });
});
