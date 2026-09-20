import { describe, expect, it } from "vitest";
import {
  competitorArchetypes,
  competitorCriteria,
  competitorPitch,
  scoreLabel,
} from "@/data/competitors";
import { countryCompareAxes, countryCompareTitle } from "@/data/country-compare";
import { ecosystemPartners, journeySteps, IR_CTA, IR_FEES_NOTE } from "@/data/ecosystem";

describe("Africa comparison data", () => {
  it("compares IR against anonymous archetypes", () => {
    expect(competitorArchetypes.map((a) => a.id)).toEqual(["ir", "visa-only", "local", "freelance", "diy"]);
    expect(competitorArchetypes.every((a) => a.blurb.length > 0)).toBe(true);
    expect(competitorCriteria.length).toBeGreaterThanOrEqual(5);
    expect(competitorCriteria.every((row) => row.scores.ir === true)).toBe(true);
    expect(competitorPitch).toMatch(/réussir/i);
    expect(scoreLabel(true)).toBe("Inclus");
    expect(scoreLabel("partial")).toBe("Limité");
    expect(scoreLabel(false)).toBe("Hors offre");
  });

  it("lists Canada vs origin axes", () => {
    expect(countryCompareAxes.map((a) => a.id)).toContain("salary");
    expect(countryCompareAxes.map((a) => a.id)).toContain("nationality");
    expect(countryCompareTitle("Bénin")).toBe("Canada vs Bénin");
  });

  it("exposes partners, journey and RDV CTA copy", () => {
    expect(ecosystemPartners.length).toBeGreaterThanOrEqual(5);
    expect(journeySteps.map((s) => s.id)).toEqual(["diagnostic", "strategy", "prepare", "file", "settle"]);
    const prepare = journeySteps.find((s) => s.id === "prepare");
    expect(prepare?.body).toMatch(/Langue|emploi|preuves/i);
    expect(prepare?.items).toEqual([
      "Test de français (TEF / TCF)",
      "CV & positionnement emploi",
      "Documents & preuves",
      "Calendrier cohérent",
    ]);
    expect(journeySteps.filter((s) => s.items?.length).map((s) => s.id)).toEqual(["prepare"]);
    expect(IR_CTA).toBe("Prendre rendez-vous");
    expect(IR_FEES_NOTE).toMatch(/rendez-vous/i);
  });
});
