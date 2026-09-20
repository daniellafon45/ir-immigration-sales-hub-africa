import { describe, expect, it } from "vitest";
import { workBenefitsFor } from "@/data/work-benefits";

describe("workBenefitsFor", () => {
  it("names Quebec public coverage on a Quebec file", () => {
    const titles = workBenefitsFor("Québec", false).map((item) => item.title);
    const sante = workBenefitsFor("Québec", false).find((item) => item.id === "sante");
    expect(titles).toContain("Assurance maladie");
    expect(titles).toContain("Médicaments et dentaire");
    expect(sante?.body).toMatch(/RAMQ/);
    expect(titles).not.toContain("Prestations familiales");
  });

  it("adds child benefits when the household has children", () => {
    const titles = workBenefitsFor("Ontario", true).map((item) => item.title);
    expect(titles).toContain("Prestations familiales");
    const sante = workBenefitsFor("Ontario", true).find((item) => item.id === "sante");
    expect(sante?.body).toMatch(/Carte santé/);
  });
});
