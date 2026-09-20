import { describe, expect, it } from "vitest";
import {
  businessPathById,
  businessPaths,
  startupVisaNote,
  startupVisaPaused,
  startupVisaRetrievedAt,
} from "@/data/business-paths";
import {
  BUSINESS_THRESHOLD_CODES,
  businessThresholdsLabel,
  c11WorkingCapital,
  pnpEntrepreneur,
} from "@/data/business-thresholds";

describe("business paths catalog", () => {
  it("keeps the four selectable business paths and the paused startup visa flag", () => {
    expect(businessPaths).toHaveLength(4);
    expect(businessPaths.map((path) => path.id)).toEqual(["visitor", "c11", "ict", "pnp-entrepreneur"]);
    expect(businessPathById("visitor")).toMatchObject({
      needsInvestment: false,
      spouseOpenEligible: false,
      workAllowed: false,
      caution: "visiteur d’affaires, pas d’exploitation quotidienne",
    });
    expect(businessPathById("c11")).toMatchObject({
      needsInvestment: true,
      spouseOpenEligible: true,
      workAllowed: true,
      caution: "avantage notable à démontrer",
    });
    expect(businessPathById("ict")).toMatchObject({
      needsInvestment: false,
      spouseOpenEligible: true,
      workAllowed: true,
      caution: "mutation, pas un seuil d’investissement",
    });
    expect(businessPathById("pnp-entrepreneur")).toMatchObject({
      needsInvestment: true,
      spouseOpenEligible: true,
      workAllowed: true,
      caution: "volets provinciaux variables",
    });
    expect(startupVisaPaused).toBe(true);
    expect(startupVisaRetrievedAt).toBe("2026-09-19");
    expect(startupVisaNote).toContain("n’accepte plus de nouvelles demandes");
  });
});

describe("business thresholds", () => {
  it("covers all 13 province and territory codes in both demonstration maps", () => {
    expect(BUSINESS_THRESHOLD_CODES).toEqual(["QC", "ON", "AB", "MB", "NB", "BC", "SK", "NS", "PE", "NL", "YT", "NT", "NU"]);
    expect(Object.keys(c11WorkingCapital)).toEqual(BUSINESS_THRESHOLD_CODES);
    expect(Object.keys(pnpEntrepreneur)).toEqual(BUSINESS_THRESHOLD_CODES);
    expect(c11WorkingCapital.QC).toBe(100000);
    expect(pnpEntrepreneur.QC).toBe(200000);
    expect(businessThresholdsLabel).toBe("Données de démonstration");
  });
});
