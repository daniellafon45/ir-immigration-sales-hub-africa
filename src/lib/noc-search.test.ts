import { describe, expect, it } from "vitest";
import { noc2021, nocByCode, teerOf } from "@/data/noc-2021";
import { professionNoc } from "@/data/profession-noc";
import { searchNoc } from "@/lib/noc-search";

describe("noc2021 catalog", () => {
  it("contains at least 80 five-digit occupations and the required seeded entries", () => {
    expect(noc2021.length).toBeGreaterThanOrEqual(80);
    expect(nocByCode("11100")).toMatchObject({ code: "11100", teer: 1, title: "Comptable" });
    expect(nocByCode("31301")).toMatchObject({ code: "31301", teer: 1, title: "Infirmier" });
    expect(nocByCode("33102")).toMatchObject({ code: "33102", teer: 3, title: "Aide-soignant" });
    expect(nocByCode("21232")).toMatchObject({
      code: "21232",
      teer: 1,
      title: "Développeurs logiciels et programmeurs",
    });
  });

  it("maps every profile profession to a default code", () => {
    expect(professionNoc("Comptable")).toBe("11100");
    expect(professionNoc("Infirmier(ère)")).toBe("31301");
    expect(professionNoc("Aide-soignant(e)")).toBe("33102");
    expect(professionNoc("Développeur logiciel")).toBe("21232");
    expect(professionNoc("Autre")).toBeNull();
  });

  it("derives FEER from the code second digit when needed", () => {
    expect(teerOf("21232")).toBe(1);
    expect(teerOf("75110")).toBe(5);
    expect(teerOf("999")).toBeNull();
  });
});

describe("searchNoc", () => {
  it("returns FEER 1 software developers for 21232", () => {
    const results = searchNoc("21232");
    expect(results[0]).toMatchObject({
      code: "21232",
      teer: 1,
      title: "Développeurs logiciels et programmeurs",
    });
  });

  it("finds nursing titles accent-insensitively", () => {
    const results = searchNoc("infirm");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((item) => item.code.startsWith("313") || item.code === "33102")).toBe(true);
  });

  it("waits for at least two characters before returning results", () => {
    expect(searchNoc("i")).toEqual([]);
  });
});
