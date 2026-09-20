import { describe, expect, it } from "vitest";
import {
  installmentSplit,
  internshipSalaryForProfession,
  netEstimate,
  opportunityCount,
  salaryForProfession,
  workingInvestment,
} from "@/lib/finance";

describe("netEstimate", () => {
  it("applies Quebec rate", () => {
    expect(netEstimate(100000, "QC")).toBe(70000);
  });
});

describe("salaryForProfession", () => {
  it("returns Quebec accountant band", () => {
    expect(salaryForProfession("Comptable", "Québec")).toEqual([52000, 72000, 98000]);
  });
});

describe("internshipSalaryForProfession", () => {
  it("scales the Quebec accountant band to a co-op equivalent", () => {
    expect(internshipSalaryForProfession("Comptable", "Québec")).toEqual([25000, 35000, 47000]);
  });
});

describe("opportunityCount", () => {
  it("uses profession baseline", () => {
    expect(opportunityCount("Comptable")).toBe(428);
    expect(opportunityCount("Autre")).toBe(520);
  });
});

describe("workingInvestment", () => {
  it("clamps between 5000 and 12000", () => {
    expect(workingInvestment(1000)).toBe(5000);
    expect(workingInvestment(40000)).toBe(12000);
  });
});

describe("installmentSplit", () => {
  it("sums to the total", () => {
    const parts = installmentSplit(10000);
    expect(parts.reduce((sum, part) => sum + part.amount, 0)).toBe(10000);
  });
});
