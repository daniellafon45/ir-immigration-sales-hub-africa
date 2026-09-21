import { describe, expect, it } from "vitest";
import { COUNTRY_COMPARE_AXIS_IDS } from "@/data/country-compare-proof";
import { defaultProfile } from "@/data/profile";
import { countryComparePanel } from "@/lib/country-compare-panel";

describe("countryComparePanel", () => {
  it("returns title, ≤4 stats, a chart, two articles and a demo disclaimer for every axis", () => {
    for (const axisId of COUNTRY_COMPARE_AXIS_IDS) {
      const panel = countryComparePanel(axisId, defaultProfile);
      expect(panel.theme).toBe(axisId);
      expect(panel.title.length).toBeGreaterThan(2);
      expect(panel.stats.length).toBeGreaterThanOrEqual(3);
      expect(panel.stats.length).toBeLessThanOrEqual(4);
      expect(panel.chart.label.length).toBeGreaterThan(2);
      expect(panel.chart.bars.length).toBeGreaterThanOrEqual(2);
      expect(panel.chart.bars.every((bar) => bar.label && Number.isFinite(bar.value))).toBe(true);
      expect(panel.articles).toHaveLength(2);
      expect(panel.articles.every((a) => a.theme === axisId)).toBe(true);
      expect(panel.disclaimer).toMatch(/Aperçu de démonstration, pas un diagnostic/);
    }
  });

  it("surfaces Canada vs origin contrast in stats and charts", () => {
    for (const axisId of COUNTRY_COMPARE_AXIS_IDS) {
      const panel = countryComparePanel(axisId, { ...defaultProfile, country: "Bénin" });
      const blob = JSON.stringify(panel);
      expect(blob).toMatch(/Canada/i);
      expect(blob).toMatch(/Bénin/i);
      expect(panel.stats.some((s) => /\d/.test(s.value))).toBe(true);
    }
  });

  it("builds credit panel with taux contrast Canada vs origin", () => {
    const panel = countryComparePanel("credit", { ...defaultProfile, country: "Bénin" });
    expect(panel.stats.some((s) => /taux|hypothèque|crédit/i.test(`${s.label} ${s.value}`))).toBe(true);
    expect(panel.stats.some((s) => /%/.test(s.value))).toBe(true);
    expect(panel.chart.label).toMatch(/Canada vs Bénin/i);
    expect(panel.chart.bars.some((b) => /Canada/i.test(b.label))).toBe(true);
    expect(panel.chart.bars.some((b) => /Bénin/i.test(b.label))).toBe(true);
  });

  it("builds salary budget with origin minimum contrast", () => {
    const panel = countryComparePanel("salary", { ...defaultProfile, country: "Bénin" });
    expect(panel.stats.some((s) => /net|loyer|reste|min/i.test(s.label))).toBe(true);
    expect(panel.chart.bars.some((b) => /net|loyer/i.test(b.label))).toBe(true);
    expect(panel.chart.bars.some((b) => /Bénin/i.test(b.label))).toBe(true);
  });

  it("builds nationality timeline without promising automatic citizenship", () => {
    const panel = countryComparePanel("nationality", defaultProfile);
    expect(panel.stats.some((s) => /présence|citoyenneté|RP|résidence|passeport/i.test(`${s.label} ${s.value}`))).toBe(
      true,
    );
    expect(panel.chart.bars.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(panel)).not.toMatch(/garantie|automatique.*oui/i);
  });
});
