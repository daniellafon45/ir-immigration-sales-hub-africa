import { describe, expect, it } from "vitest";
import { compareFactsFor, countryCompareAxesFor } from "@/lib/country-compare-facts";

describe("compareFactsFor", () => {
  it("builds numbered Canada vs Bénin copy on every axis", () => {
    const facts = compareFactsFor("Bénin");
    expect(facts.region).toBe("uemoa");
    expect(facts.origin.retailLoanRatePct).toBeGreaterThan(facts.canada.policyRatePct);
    for (const axis of Object.values(facts.axes)) {
      expect(axis.copy.canada).toMatch(/\d/);
      expect(axis.copy.origin).toMatch(/\d/);
      expect(axis.stats.every((s) => s.value.length > 4)).toBe(true);
      expect(axis.stats.some((s) => /\d/.test(s.value))).toBe(true);
      expect(axis.chart.bars.length).toBeGreaterThanOrEqual(2);
      expect(axis.chart.bars.some((b) => /Canada/i.test(b.label))).toBe(true);
      expect(axis.chart.bars.some((b) => /Bénin/i.test(b.label))).toBe(true);
    }
  });

  it("uses western europe metrics for France and regional defaults for a country without override", () => {
    const france = compareFactsFor("France");
    expect(france.region).toBe("europe_west");
    expect(france.origin.passportRank).toBeLessThan(20);

    const fiji = compareFactsFor("Fidji");
    expect(fiji.region).toBe("oceania");
    expect(fiji.axes.credit.copy.canada).toMatch(/hypothèque/i);
    expect(fiji.axes.credit.stats[0]?.value).toMatch(/Canada/);
  });

  it("exposes seven axes for any country", () => {
    expect(countryCompareAxesFor("Sénégal")).toHaveLength(7);
    expect(countryCompareAxesFor("Sénégal").map((a) => a.id)).toContain("credit");
  });
});
