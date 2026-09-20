import { describe, expect, it } from "vitest";
import {
  biometricsFamilyCap,
  biometricsSolo,
  eta,
  etaLikelyCountries,
  sourceUrl,
  visitFeesFor,
  visitorVisa,
} from "@/data/visit-fees";

describe("visit fees", () => {
  it("keeps the demo fee catalogue aligned with the brief", () => {
    expect(visitorVisa).toBe(100);
    expect(eta).toBe(7);
    expect(biometricsSolo).toBe(85);
    expect(biometricsFamilyCap).toBe(170);
    expect(sourceUrl).toContain("canada.ca");
    expect(etaLikelyCountries).toEqual(expect.arrayContaining(["France", "Allemagne", "Japon"]));
    expect(etaLikelyCountries).not.toContain("Bénin");
  });

  it("uses the visitor visa path for Benin", () => {
    expect(visitFeesFor("Bénin", 1)).toEqual({
      documentType: "visa",
      documentPerPerson: 100,
      documentTotal: 100,
      biometricsTotal: 85,
      people: 1,
      total: 185,
    });
  });

  it("uses the eTA path and caps biometrics for a family", () => {
    expect(visitFeesFor("France", 3)).toEqual({
      documentType: "eta",
      documentPerPerson: 7,
      documentTotal: 21,
      biometricsTotal: 170,
      people: 3,
      total: 191,
    });
  });
});
