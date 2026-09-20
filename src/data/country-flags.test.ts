import { describe, expect, it } from "vitest";
import { countries } from "@/data/countries";
import { countryFlagHeroSrcSet, countryFlagHeroUrl, countryFlagSrcSet, countryFlagUrl, countryIsoCode } from "@/data/country-flags";

describe("country flags", () => {
  it("maps every listed country to a two-letter ISO code", () => {
    for (const country of countries) {
      expect(countryIsoCode(country), country).toMatch(/^[a-z]{2}$/);
    }
  });

  it("builds a Flagcdn URL for Bénin", () => {
    expect(countryIsoCode("Bénin")).toBe("bj");
    expect(countryFlagUrl("Bénin")).toBe("https://flagcdn.com/w40/bj.png");
    expect(countryFlagSrcSet("Bénin")).toBe("https://flagcdn.com/w80/bj.png 2x");
    expect(countryFlagHeroUrl("Bénin")).toBe("https://flagcdn.com/w320/bj.png");
    expect(countryFlagHeroSrcSet("Bénin")).toBe("https://flagcdn.com/w640/bj.png 2x");
  });

  it("returns nothing for an unknown country", () => {
    expect(countryFlagUrl("Narnia")).toBeUndefined();
  });
});
