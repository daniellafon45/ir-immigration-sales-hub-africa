import { describe, expect, it } from "vitest";
import { countries } from "@/data/countries";
import {
  countryCompareRegionByCountry,
  compareRegionFor,
  missingCompareRegions,
} from "@/data/country-compare-regions";

describe("country-compare-regions", () => {
  it("maps every country in the list to a region", () => {
    expect(missingCompareRegions()).toEqual([]);
    expect(Object.keys(countryCompareRegionByCountry)).toHaveLength(countries.length);
    for (const country of countries) {
      expect(compareRegionFor(country)).toBeTruthy();
    }
  });

  it("places Bénin in UEMOA and France in western Europe", () => {
    expect(compareRegionFor("Bénin")).toBe("uemoa");
    expect(compareRegionFor("France")).toBe("europe_west");
    expect(compareRegionFor("Nigeria")).toBe("west_africa_other");
  });

  it("falls back for unknown names", () => {
    expect(compareRegionFor("Pays inventé")).toBe("west_africa_other");
  });
});
