import { describe, expect, it } from "vitest";
import { livingCities } from "@/data/cost-of-living";
import { professions } from "@/data/profile";
import { provinceData } from "@/data/provinces";
import {
  ALL_CITIES,
  ALL_PROVINCES,
  demandFor,
  demandLabel,
  demandSeries,
  featuredCitiesFor,
} from "@/data/job-demand";

describe("demandFor", () => {
  it("returns a 0-100 tightness score with openings and applicants for a profession in a city", () => {
    const point = demandFor("Comptable", { province: "QC", cityId: "montreal" });
    expect(point.id).toBe("montreal");
    expect(point.name).toBe("Montréal");
    expect(point.score).toBeGreaterThanOrEqual(40);
    expect(point.score).toBeLessThanOrEqual(100);
    expect(point.openings).toBeGreaterThan(0);
    expect(point.applicantsPerOpening).toBeGreaterThan(0);
    expect(point.intlShare).toBeGreaterThan(0);
    expect(point.intlShare).toBeLessThanOrEqual(100);
    expect(["Très élevée", "Élevée", "Modérée", "Faible"]).toContain(point.label);
  });

  it("ranks nurses above accountants in the same Quebec city", () => {
    const nurse = demandFor("Infirmier(ère)", { province: "QC", cityId: "montreal" });
    const accountant = demandFor("Comptable", { province: "QC", cityId: "montreal" });
    expect(nurse.score).toBeGreaterThan(accountant.score);
  });

  it("gives a province-level point when no city is chosen", () => {
    const point = demandFor("Développeur logiciel", { province: "ON", cityId: ALL_CITIES });
    expect(point.id).toBe("ON");
    expect(point.name).toBe("Ontario");
  });

  it("gives a Canada-level point when neither filter is set", () => {
    const point = demandFor("Électricien", { province: ALL_PROVINCES, cityId: ALL_CITIES });
    expect(point.id).toBe("CA");
    expect(point.name).toBe("Canada");
  });

  it("covers every listed profession without throwing", () => {
    for (const profession of professions) {
      const point = demandFor(profession, { province: "QC", cityId: "quebec" });
      expect(point.score).toBeGreaterThan(0);
    }
  });
});

describe("demandLabel", () => {
  it("maps score bands used on the sales board", () => {
    expect(demandLabel(92)).toBe("Très élevée");
    expect(demandLabel(70)).toBe("Élevée");
    expect(demandLabel(55)).toBe("Modérée");
    expect(demandLabel(40)).toBe("Faible");
  });
});

describe("demandSeries", () => {
  it("compares every living city inside a province", () => {
    const series = demandSeries("Comptable", { province: "QC", cityId: ALL_CITIES });
    const ids = series.map((point) => point.id);
    const quebecIds = livingCities.filter((city) => city.province === "QC").map((city) => city.id);
    expect(ids).toEqual(expect.arrayContaining(quebecIds));
    expect(ids).toHaveLength(quebecIds.length);
    expect(series.every((point) => livingCities.some((city) => city.id === point.id && city.province === "QC"))).toBe(true);
    expect(ids).toEqual(expect.arrayContaining(["montreal", "quebec", "laval", "alma"]));
  });

  it("compares provinces when no province is chosen", () => {
    const series = demandSeries("Infirmier(ère)", { province: ALL_PROVINCES, cityId: ALL_CITIES });
    const ids = series.map((point) => point.id);
    expect(ids).toEqual(expect.arrayContaining(Object.keys(provinceData)));
  });
});

describe("featuredCitiesFor", () => {
  it("returns the sales cities for Quebec", () => {
    expect(featuredCitiesFor("QC").map((city) => city.id)).toEqual(
      expect.arrayContaining(["montreal", "quebec", "laval", "longueuil", "gatineau"]),
    );
  });
});
