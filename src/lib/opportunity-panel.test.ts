import { describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import { opportunityPanel } from "@/lib/opportunity-panel";

const studyProfile = {
  ...defaultProfile,
  objective: "Études" as const,
  studyLevel: "bachelor",
  studyProgramId: "bac-nursing",
};

describe("opportunityPanel", () => {
  it("returns title, 3–4 stats, a chart series, two articles and the disclaimer", () => {
    const panel = opportunityPanel("employment", defaultProfile);
    expect(panel.title).toBe("Emploi");
    expect(panel.stats.length).toBeGreaterThanOrEqual(3);
    expect(panel.stats.length).toBeLessThanOrEqual(4);
    expect(panel.chart.label.length).toBeGreaterThan(2);
    expect(panel.chart.bars.length).toBeGreaterThanOrEqual(2);
    expect(panel.chart.bars.every((bar) => bar.label && Number.isFinite(bar.value))).toBe(true);
    expect(panel.articles).toHaveLength(2);
    expect(panel.articles.every((a) => a.theme === "employment")).toBe(true);
    expect(panel.disclaimer).toBe("Sources publiques. Aperçu de démonstration, pas un diagnostic.");
  });

  it("builds employment stats as qualitative pitch signals, not raw offer counts", () => {
    const panel = opportunityPanel("employment", defaultProfile);
    expect(panel.stats.some((s) => /offres liées|ouvertes à l/i.test(s.label))).toBe(false);
    expect(panel.stats.every((s) => !/^\d+$/.test(s.value) && !/\/100$/.test(s.value))).toBe(true);
    expect(panel.stats.some((s) => /métier|demande|réseau|accès/i.test(`${s.label} ${s.value}`))).toBe(true);
    expect(panel.stats.some((s) => s.label === "Lieu")).toBe(true);
    expect(panel.chart.label).toMatch(/demande/i);
  });

  it("builds study stats from studyCost when objective is Études", () => {
    const panel = opportunityPanel("study", studyProfile);
    expect(panel.title).toBe("Études");
    expect(panel.stats.some((s) => /fonds|scolarité|programme|délai/i.test(s.label))).toBe(true);
    expect(panel.chart.bars.length).toBeGreaterThanOrEqual(3);
  });

  it("builds salary chart as net / rent / other split", () => {
    const panel = opportunityPanel("salary", defaultProfile);
    expect(panel.chart.bars.map((b) => b.label)).toEqual(
      expect.arrayContaining(["Net mensuel", "Loyer", "Autres"]),
    );
  });

  it("builds nationality timeline without promising automatic citizenship", () => {
    const panel = opportunityPanel("nationality", defaultProfile);
    expect(panel.stats.some((s) => /présence|citoyenneté|RP|résidence/i.test(`${s.label} ${s.value}`))).toBe(
      true,
    );
    expect(panel.chart.bars.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(panel)).not.toMatch(/garantie|automatique.*oui/i);
  });

  it("builds business panel around crédit, taux and ecosystem — not C11 thresholds", () => {
    const business = opportunityPanel("business", { ...defaultProfile, businessPath: "c11", objective: "Affaires" });
    expect(business.stats.some((s) => /prêt|taux|écosystème/i.test(`${s.label} ${s.value}`))).toBe(true);
    expect(business.chart.label).toMatch(/entreprendre|atouts/i);
    expect(business.chart.bars.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(business.chart)).not.toMatch(/C11|PNP|seuil/i);

    const flex = opportunityPanel("flexibility", defaultProfile);
    expect(flex.stats.some((s) => /études|conjoint|pivot/i.test(`${s.label} ${s.value}`))).toBe(true);
    expect(flex.chart.bars.length).toBeGreaterThanOrEqual(3);
    expect(flex.chart.bars.every((bar) => bar.value > 0)).toBe(true);
  });
});
