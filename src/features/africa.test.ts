import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import { journeySteps } from "@/data/ecosystem";
import { OPPORTUNITY_THEMES } from "@/data/opportunity-proof";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "africa.tsx"), "utf8");
const registry = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "registry.tsx"), "utf8");

describe("Africa feature sections", () => {
  it("registers Africa views for the funnel catalog", () => {
    expect(registry).toContain("AfricaOpportunitiesSection");
    expect(registry).toContain("CountryCompareSection");
    expect(registry).toContain("PreuvesSection");
    expect(registry).toContain("RisksSection");
    expect(registry).toContain("WhyUsSection");
    expect(registry).toContain("AfricaEcosystemSection");
    expect(registry).toContain("RdvSection");
    expect(sections.map((s) => s.id)).toContain("rdv");
  });

  it("pushes RDV to the website, not a paid consultation", () => {
    expect(source).toContain("pillar.url");
    expect(source).toContain("pillar.image");
    expect(source).toContain("IR_SITE_URL");
    expect(source).toContain("Prendre rendez-vous");
    expect(source).not.toContain("déjà payée");
  });

  it("emphasizes the IR column in WhyUsSection", () => {
    expect(source).toContain("Projet complet");
    expect(source).toContain("emphasized");
    expect(source).toContain("border-primary/25");
    expect(source).toContain("ScoreBadge");
    expect(source).toContain("Inclus");
    expect(source).toContain("Hors offre");
    expect(source).toContain("Légende");
    expect(source).toContain("Critères de comparaison");
    expect(source).toContain("setActiveId");
    expect(source).toContain("LeaderboardPodium");
    expect(source).toContain("logoIr");
    expect(source).toContain("avatarUrl");
    expect(source).not.toContain("bg-rose-50");
    expect(source).not.toContain(
      "Un statut n’est pas encore une intégration. IR construit le projet au complet.",
    );
  });

  it("makes the six opportunity cards open a proof aside via PageShell split", () => {
    expect(source).toContain("OPPORTUNITY_THEMES");
    expect(source).toContain("opportunityPanel");
    expect(source).toContain('type="button"');
    expect(source).toContain("aria-expanded");
    expect(source).toContain("ProofAside");
    expect(source).toContain("panel={panel ? <ProofAside");
    expect(source).toContain("scrollIntoView");
    expect(source).toContain("Escape");
    expect(source).toContain("Lire l’article");
    expect(source).toContain("panel.disclaimer");
    const oppChunk = source.slice(
      source.indexOf("export function AfricaOpportunitiesSection"),
      source.indexOf("function ProofAside"),
    );
    expect(oppChunk).toContain("absolute inset-0");
    expect(oppChunk).toContain("card.image");
    expect(oppChunk).toContain("Voir preuves →");
  });

  it("makes country compare axes open the same proof aside", () => {
    expect(source).toContain("countryComparePanel");
    expect(source).toContain("CountryCompareAxisId");
    expect(source).toContain("openAxis");
    expect(source).toContain("Voir preuves →");
    const compareChunk = source.slice(
      source.indexOf("export function CountryCompareSection"),
      source.indexOf("export function PreuvesSection"),
    );
    expect(compareChunk).toContain("aria-expanded");
    expect(compareChunk).toContain("ProofAside");
    expect(compareChunk).toContain("panel={panel ? <ProofAside");
    expect(compareChunk).toContain("Escape");
    expect(compareChunk).not.toContain("absolute inset-0");
  });

  it("styles country compare as editorial rows with Canada accent vs muted origin", () => {
    const compareChunk = source.slice(
      source.indexOf("export function CountryCompareSection"),
      source.indexOf("export function PreuvesSection"),
    );
    expect(compareChunk).toContain("border-l-2 border-primary");
    expect(compareChunk).toContain("text-primary");
    expect(compareChunk).toContain("text-[#6b7c8f]");
    expect(compareChunk).toContain("Voir preuves →");
    expect(compareChunk).not.toContain("from-ir-navy");
    expect(compareChunk).not.toContain("bg-[#fff4e8]");
    expect(compareChunk).not.toContain("rounded-full bg-primary");
  });

  it("features employment opportunity and prepare checklist for UI", () => {
    expect(OPPORTUNITY_THEMES.some((t) => t.id === "employment")).toBe(true);
    expect(source).toContain('@min-[36rem]:col-span-2');
    expect(source).toContain('@min-[52rem]:col-span-3');
    expect(source).toContain('card.id === "flexibility"');
    expect(source).toContain("Opportunité centrale");
    expect(source).not.toContain("Cliquez une carte pour voir les preuves liées au profil.");
    expect(OPPORTUNITY_THEMES.every((t) => Boolean(t.image))).toBe(true);
    expect(journeySteps.find((s) => s.id === "prepare")?.items?.length).toBe(4);
    expect(source).toContain("step.items");
    expect(source).toContain("text-white");
    expect(source).toContain("bg-[#1f6b4a]");
    expect(source).toContain('settle: "bg-[#1f6b4a]');
    expect(source).toContain("prepare: \"bg-primary");
  });
});
