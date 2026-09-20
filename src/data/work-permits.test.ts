import { describe, expect, it } from "vitest";
import {
  biometricsFamilyCap,
  biometricsSolo,
  openHolderFee,
  workFeesFor,
  workPermitFee,
} from "@/data/work-fees";
import { workPermitById, workPermits } from "@/data/work-permits";

describe("work permits catalog", () => {
  it("keeps the five expected permit kinds", () => {
    expect(workPermits).toHaveLength(5);
    expect(workPermits.map((item) => item.id)).toEqual(["lmia", "imp", "open", "ict", "iec"]);
    expect(workPermitById("lmia")).toMatchObject({
      id: "lmia",
      employerTied: true,
      needsOffer: true,
      openVsClosed: "closed",
    });
    expect(workPermitById("open")).toMatchObject({
      id: "open",
      employerTied: false,
      needsOffer: false,
      openVsClosed: "open",
    });
    expect(workPermitById("iec")).toMatchObject({
      id: "iec",
      openVsClosed: "varies",
    });
  });
});

describe("workFeesFor", () => {
  it("applies open holder fees and biometrics cap by household size", () => {
    expect(workPermitFee).toBe(155);
    expect(openHolderFee).toBe(100);
    expect(biometricsSolo).toBe(85);
    expect(biometricsFamilyCap).toBe(170);
    expect(workFeesFor("lmia", 1)).toEqual({
      permit: 155,
      openHolder: 0,
      biometrics: 85,
      total: 240,
    });
    expect(workFeesFor("open", 2)).toEqual({
      permit: 155,
      openHolder: 100,
      biometrics: 170,
      total: 425,
    });
    expect(workFeesFor("iec", 1)).toEqual({
      permit: 155,
      openHolder: 100,
      biometrics: 85,
      total: 340,
    });
  });
});
