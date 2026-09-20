import { describe, expect, it } from "vitest";
import {
  COUNTRY_COMPARE_AXIS_IDS,
  countryCompareAxisLabel,
  countryComparePress,
  countryComparePressFor,
  type CountryCompareAxisId,
} from "@/data/country-compare-proof";
import { countryCompareAxes } from "@/data/country-compare";

describe("country-compare-proof", () => {
  it("aligns press themes with the seven compare axes", () => {
    expect(COUNTRY_COMPARE_AXIS_IDS).toEqual(countryCompareAxes.map((a) => a.id));
    expect(countryCompareAxisLabel("credit")).toBe("Accès au crédit");
    expect(countryCompareAxisLabel("nationality")).toBe("Chemin vers la nationalité");
  });

  it("ships exactly two public press articles per axis", () => {
    const axes: CountryCompareAxisId[] = [...COUNTRY_COMPARE_AXIS_IDS];
    for (const axis of axes) {
      const articles = countryComparePressFor(axis);
      expect(articles).toHaveLength(2);
      for (const article of articles) {
        expect(article.theme).toBe(axis);
        expect(article.source.length).toBeGreaterThan(2);
        expect(article.title.length).toBeGreaterThan(10);
        expect(article.excerpt.length).toBeGreaterThan(20);
        expect(article.url).toMatch(/^https:\/\//);
        expect(article.image).toBeTruthy();
      }
    }
    expect(countryComparePress).toHaveLength(14);
    const urls = countryComparePress.map((a) => a.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
