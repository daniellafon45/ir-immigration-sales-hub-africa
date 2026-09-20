import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { provinceData } from "@/data/provinces";
import {
  compareLivingByProvince,
  compareNetByProvince,
  draftLiving,
  draftNet,
  householdLiving,
  OTHER_MONTHLY_EXPENSES,
} from "@/lib/household-living";

describe("householdLiving", () => {
  it("combines default couple nets against Quebec rent and other expenses", () => {
    const view = householdLiving(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.province).toBe("Québec");
    expect(view.groups[0].netMonthly).toBe(4200);
    expect(view.groups[1].netMonthly).toBe(5250);
    expect(view.combinedNetMonthly).toBe(9450);
    expect(view.rent).toBe(1710);
    expect(view.other).toBe(OTHER_MONTHLY_EXPENSES);
    expect(OTHER_MONTHLY_EXPENSES).toBe(1700);
    expect(view.remainder).toBe(6040);
  });

  it("keeps a single net when the family is Seul(e)", () => {
    const view = householdLiving({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.combinedNetMonthly).toBe(4200);
    expect(view.remainder).toBe(790);
  });
});

describe("draftLiving", () => {
  it("recomputes remainder from a live net, rent and other expenses", () => {
    expect(draftLiving(3905, 1390, 1700)).toEqual({
      combinedNetMonthly: 3905,
      rent: 1390,
      other: 1700,
      remainder: 815,
    });
  });

  it("floors empty or negative values and never goes below zero remainder", () => {
    expect(draftLiving(0, 1390, 1700)).toEqual({
      combinedNetMonthly: 0,
      rent: 1390,
      other: 1700,
      remainder: 0,
    });
    expect(draftLiving(-10, -5, -8)).toEqual({
      combinedNetMonthly: 0,
      rent: 0,
      other: 0,
      remainder: 0,
    });
  });
});

describe("draftNet", () => {
  it("recomputes annual and monthly net from a live gross and province code", () => {
    expect(draftNet(72000, "QC")).toEqual({
      netAnnual: 50400,
      netMonthly: 4200,
      deductions: 21600,
      netRate: 0.7,
    });
    expect(draftNet(78000, "ON")).toEqual({
      netAnnual: 56940,
      netMonthly: 4745,
      deductions: 21060,
      netRate: 0.73,
    });
  });

  it("returns zeros when the gross is empty", () => {
    expect(draftNet(0, "QC")).toEqual({ netAnnual: 0, netMonthly: 0, deductions: 0, netRate: 0 });
  });
});

describe("compareNetByProvince", () => {
  it("ranks every province by estimated net", () => {
    const rows = compareNetByProvince(72000);
    expect(rows).toHaveLength(Object.keys(provinceData).length);
    expect(rows.map((row) => row.netAnnual)).toEqual(
      [...rows.map((row) => row.netAnnual)].sort((a, b) => b - a),
    );
    expect(rows[0]).toMatchObject({ code: "AB", name: "Alberta", netAnnual: 54000, netRate: 0.75 });
    expect(rows[1]).toMatchObject({ code: "ON", name: "Ontario", netAnnual: 52560, netRate: 0.73 });
    expect(rows.at(-1)).toMatchObject({
      code: "QC",
      name: "Québec",
      netAnnual: 50400,
      deductions: 21600,
      netRate: 0.7,
    });
  });
});

describe("compareLivingByProvince", () => {
  it("ranks every province by leftover after rent and other expenses", () => {
    const rows = compareLivingByProvince(4200);
    expect(rows).toHaveLength(Object.keys(provinceData).length);
    expect(rows.map((row) => row.remainder)).toEqual(
      [...rows.map((row) => row.remainder)].sort((a, b) => b - a),
    );
    expect(rows[0]).toMatchObject({
      code: "NL",
      name: "Terre-Neuve-et-Labrador",
      rent: 1300,
      other: OTHER_MONTHLY_EXPENSES,
      cost: 3000,
      remainder: 1200,
    });
    expect(rows.find((row) => row.code === "QC")).toMatchObject({
      rent: 1710,
      remainder: 790,
    });
    expect(rows.at(-1)).toMatchObject({
      code: "NU",
      name: "Nunavut",
      rent: 2500,
      remainder: 0,
    });
  });

  it("applies a custom other expense to every province", () => {
    const rows = compareLivingByProvince(4200, { other: 2000 });
    expect(rows[0]).toMatchObject({
      code: "NL",
      other: 2000,
      cost: 3300,
      remainder: 900,
    });
    expect(rows.find((row) => row.code === "QC")).toMatchObject({
      rent: 1710,
      other: 2000,
      remainder: 490,
    });
  });

  it("overrides rent only for the active province", () => {
    const rows = compareLivingByProvince(4200, { rentOverride: { code: "QC", rent: 1000 } });
    expect(rows[0]).toMatchObject({
      code: "QC",
      rent: 1000,
      other: OTHER_MONTHLY_EXPENSES,
      cost: 2700,
      remainder: 1500,
    });
    expect(rows.find((row) => row.code === "NL")).toMatchObject({
      rent: 1300,
      remainder: 1200,
    });
  });
});
