import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { livingCities } from "@/data/cost-of-living";
import { provinceData } from "@/data/provinces";
import {
  citiesForProvince,
  defaultCityId,
  defaultProvinceCode,
  defaultCompareIds,
  livingBasket,
  withLivingOverrides,
} from "@/lib/living-basket";

describe("livingCities", () => {
  it("covers every Canadian province and territory with a national city list", () => {
    const ids = livingCities.map((city) => city.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(livingCities.length).toBeGreaterThanOrEqual(160);
    for (const code of Object.keys(provinceData)) {
      expect(citiesForProvince(code).length, code).toBeGreaterThanOrEqual(2);
    }
  });

  it("includes the main Quebec and Ontario settlement cities in the dropdown", () => {
    expect(citiesForProvince("QC").map((city) => city.id)).toEqual(
      expect.arrayContaining([
        "montreal",
        "quebec",
        "laval",
        "longueuil",
        "gatineau",
        "sherbrooke",
        "trois-rivieres",
        "saguenay",
        "saint-jerome",
        "rimouski",
      ]),
    );
    expect(citiesForProvince("ON").map((city) => city.id)).toEqual(
      expect.arrayContaining(["toronto", "ottawa", "mississauga", "brampton", "hamilton", "london", "kitchener"]),
    );
  });
});

describe("livingBasket", () => {
  it("uses a two-bedroom basket for the default couple in Montreal", () => {
    const view = livingBasket(defaultProfile, "montreal");
    expect(view.city.name).toBe("Montréal");
    expect(view.adults).toBe(2);
    expect(view.kids).toBe(0);
    expect(view.housing).toBe(2100);
    expect(view.grocery).toBe(840);
    expect(view.transport).toBe(300);
    expect(view.utilities).toBe(220);
    expect(view.childcare).toBe(0);
    expect(view.total).toBe(3460);
    expect(view.netMonthly).toBe(9450);
    expect(view.remainder).toBe(5990);
  });

  it("uses a one-bedroom basket when the family is Seul(e)", () => {
    const view = livingBasket({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult }, "montreal");
    expect(view.adults).toBe(1);
    expect(view.housing).toBe(1650);
    expect(view.grocery).toBe(420);
    expect(view.transport).toBe(150);
    expect(view.total).toBe(2440);
    expect(view.netMonthly).toBe(4200);
    expect(view.remainder).toBe(1760);
  });

  it("counts an extra adult for a reunited parent without inventing a profile card", () => {
    const view = livingBasket(
      { ...defaultProfile, family: "Seul(e)", spouse: emptyAdult },
      "montreal",
      { extraAdults: 1 },
    );
    expect(view.adults).toBe(2);
    expect(view.housing).toBe(2100);
    expect(view.grocery).toBe(840);
    expect(view.transport).toBe(300);
    expect(view.total).toBe(3460);
  });

  it("adds child grocery and childcare when the household has a child", () => {
    const view = livingBasket(
      {
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
      },
      "montreal",
    );
    expect(view.kids).toBe(1);
    expect(view.housing).toBe(2100);
    expect(view.grocery).toBe(1050);
    expect(view.childcare).toBe(900);
    expect(view.total).toBe(4570);
    expect(view.remainder).toBe(4880);
  });
});

describe("withLivingOverrides", () => {
  it("recalculates the Montreal couple basket when housing is edited to 2500", () => {
    const view = withLivingOverrides(livingBasket(defaultProfile, "montreal"), { housing: 2500 });
    expect(view.housing).toBe(2500);
    expect(view.grocery).toBe(840);
    expect(view.transport).toBe(300);
    expect(view.utilities).toBe(220);
    expect(view.total).toBe(3860);
    expect(view.netMonthly).toBe(9450);
    expect(view.remainder).toBe(5590);
  });
});

describe("city defaults", () => {
  it("picks the first city of the profile province and a three-city contrast set", () => {
    expect(citiesForProvince("QC")[0]?.id).toBe("montreal");
    expect(defaultCityId(defaultProfile)).toBe("montreal");
    expect(defaultCompareIds(defaultProfile)).toEqual(["montreal", "toronto", "moncton"]);
  });

  it("uses the profile province when it has cities, otherwise the fallback city province", () => {
    expect(defaultProvinceCode(defaultProfile)).toBe("QC");
    expect(defaultProvinceCode({ ...defaultProfile, province: "Ontario" })).toBe("ON");
    expect(defaultProvinceCode({ ...defaultProfile, province: "Saskatchewan" })).toBe("SK");
  });
});
