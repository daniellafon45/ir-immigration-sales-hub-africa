import { describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import {
  PARENT_MULTIPLIER,
  quebecEngagement,
  requiredIncome,
  rocMni,
  sizeFor,
} from "@/data/family-lico";

describe("family LICO data", () => {
  it("keeps the demo MNI grids aligned with the regroupement brief", () => {
    expect(rocMni).toEqual([29833, 37158, 45643, 55490, 62989, 71006, 79015]);
    expect(quebecEngagement).toEqual([31100, 39600, 48600, 59200, 67200, 75800, 84400]);
    expect(PARENT_MULTIPLIER).toBe(1.3);
  });

  it("counts the current household and only adds one parent for regroupement", () => {
    expect(sizeFor({ ...defaultProfile, familyLink: "spouse" })).toBe(2);
    expect(
      sizeFor({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        familyLink: "child",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
      }),
    ).toBe(3);
    expect(sizeFor({ ...defaultProfile, family: "Seul(e)", familyLink: "parent" })).toBe(2);
    expect(sizeFor({ ...defaultProfile, family: "Seul(e)", familyLink: "spouse" })).toBe(2);
    expect(sizeFor({ ...defaultProfile, family: "Seul(e)", familyLink: "child" })).toBe(2);
  });

  it("uses the Quebec grid when needed, caps at 7+, and adds the parent uplift", () => {
    expect(requiredIncome("Québec", 2, "spouse")).toBe(39600);
    expect(requiredIncome("QC", 2, "child")).toBe(39600);
    expect(requiredIncome("", 2, "child")).toBe(39600);
    expect(requiredIncome("Ontario", 2, "child")).toBe(37158);
    expect(requiredIncome("Ontario", 2, "parent")).toBe(48305);
    expect(requiredIncome("Ontario", 9, "spouse")).toBe(79015);
  });
});
