import { describe, expect, it } from "vitest";
import { COUNTRY_COMPARE_AXIS_IDS } from "@/data/country-compare-proof";
import { defaultProfile } from "@/data/profile";
import { countryComparePanel } from "@/lib/country-compare-panel";

describe("countryComparePanel", () => {
  it("returns title, ≤4 stats, a chart, two articles and the disclaimer for every axis", () => {
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
      expect(panel.disclaimer).toBe("Sources publiques. Aperçu de démonstration, pas un diagnostic.");
    }
  });

  it("never surfaces a pays comparé card", () => {
    for (const axisId of COUNTRY_COMPARE_AXIS_IDS) {
      const panel = countryComparePanel(axisId, { ...defaultProfile, country: "Bénin" });
      expect(panel.stats.every((s) => !/pays comparé|pays d’origine/i.test(s.label))).toBe(true);
      expect(panel.chart.bars.every((b) => !/Bénin|Sénégal|pays d’origine/i.test(b.label))).toBe(true);
    }
  });

  it("builds credit panel around prêts, taux and historique — not Canada vs origin", () => {
    const panel = countryComparePanel("credit", { ...defaultProfile, country: "Bénin" });
    expect(panel.stats.some((s) => /prêt|taux|historique|hypothèque/i.test(`${s.label} ${s.value}`))).toBe(
      true,
    );
    expect(panel.chart.label).toMatch(/crédit|atouts/i);
    expect(panel.chart.bars.length).toBeGreaterThanOrEqual(3);
    expect(panel.chart.bars.map((b) => b.label)).not.toEqual(expect.arrayContaining(["Canada", "Bénin"]));
  });

  it("builds salary budget from household living without origin contrast bars", () => {
    const panel = countryComparePanel("salary", { ...defaultProfile, country: "Bénin" });
    expect(panel.stats.some((s) => /net|loyer|reste/i.test(s.label))).toBe(true);
    expect(panel.chart.bars.some((b) => /net|loyer|autres/i.test(b.label))).toBe(true);
    expect(panel.chart.bars.every((b) => !/Bénin/i.test(b.label))).toBe(true);
  });

  it("builds nationality timeline without promising automatic citizenship", () => {
    const panel = countryComparePanel("nationality", defaultProfile);
    expect(panel.stats.some((s) => /présence|citoyenneté|RP|résidence|passeport/i.test(`${s.label} ${s.value}`))).toBe(
      true,
    );
    expect(panel.chart.bars.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(panel)).not.toMatch(/garantie|automatique.*oui/i);
  });
});
