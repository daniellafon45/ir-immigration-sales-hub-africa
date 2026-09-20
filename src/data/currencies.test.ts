import { describe, expect, it } from "vitest";
import { countryCurrencies, currencyForCountry } from "@/data/currencies";
import { countries } from "@/data/countries";

describe("countryCurrencies", () => {
  it("covers key West and Central African markets", () => {
    for (const name of ["Bénin", "Sénégal", "Côte d’Ivoire", "Cameroun", "Maroc", "Nigeria"]) {
      expect(currencyForCountry(name), name).not.toBeNull();
    }
  });

  it("only maps countries that exist in the country list (or known aliases)", () => {
    const aliases = new Set(["Côte d'Ivoire"]);
    for (const name of Object.keys(countryCurrencies)) {
      expect(countries.includes(name) || aliases.has(name), name).toBe(true);
    }
  });
});
