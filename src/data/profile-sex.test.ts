import { describe, expect, it } from "vitest";
import {
  appearanceFromCountry,
  appearances,
  createExtraSpouse,
  defaultApplicant,
  defaultSpouse,
  emptyAdult,
  sexes,
} from "@/data/profile";
import { countries as countryList } from "@/data/countries";

describe("adult sex", () => {
  it("offers Femme and Homme", () => {
    expect(sexes).toEqual(["Femme", "Homme"]);
  });

  it("defaults Aminata to Femme and Mamadou to Homme", () => {
    expect(defaultApplicant.sex).toBe("Femme");
    expect(defaultSpouse.sex).toBe("Homme");
  });

  it("starts extra spouses as Femme", () => {
    expect(emptyAdult.sex).toBe("Homme");
    expect(createExtraSpouse().sex).toBe("Femme");
  });
});

describe("adult appearance", () => {
  it("offers Noir, Blanc, Maghrébin, Asiatique and Latino", () => {
    expect(appearances).toEqual(["Noir", "Blanc", "Maghrébin", "Asiatique", "Latino"]);
  });

  it("defaults the household to Noir", () => {
    expect(defaultApplicant.look).toBe("Noir");
    expect(defaultSpouse.look).toBe("Noir");
    expect(emptyAdult.look).toBe("Noir");
  });

  it("maps origin countries to a matching appearance", () => {
    expect(appearanceFromCountry("Bénin")).toBe("Noir");
    expect(appearanceFromCountry("Haïti")).toBe("Noir");
    expect(appearanceFromCountry("France")).toBe("Blanc");
    expect(appearanceFromCountry("Chine")).toBe("Asiatique");
    expect(appearanceFromCountry("Japon")).toBe("Asiatique");
    expect(appearanceFromCountry("Inde")).toBe("Asiatique");
    expect(appearanceFromCountry("Mexique")).toBe("Latino");
    expect(appearanceFromCountry("Brésil")).toBe("Latino");
    expect(appearanceFromCountry("Maroc")).toBe("Maghrébin");
    expect(appearanceFromCountry("Algérie")).toBe("Maghrébin");
  });

  it("covers every listed country", () => {
    for (const country of countryList) {
      expect(appearances, country).toContain(appearanceFromCountry(country));
    }
  });
});
