import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { closingDeckPills } from "@/lib/closing-pills";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "sales.tsx"), "utf8");
const market = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`) !== -1
    ? source.indexOf(`function ${name}`)
    : source.indexOf(`export function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const from = start;
  const nextFunction = source.indexOf("\nfunction ", from + 1);
  const nextExportFunction = source.indexOf("\nexport function ", from + 1);
  const candidates = [nextFunction, nextExportFunction].filter((index) => index !== -1);
  const next = candidates.length > 0 ? Math.min(...candidates) : -1;
  return source.slice(from, next === -1 ? undefined : next);
}

describe("echecs catalog", () => {
  it("surfaces risks as risques on the Africa catalog", () => {
    expect(sections.map((s) => s.id)).not.toContain("echecs");
    expect(sections.find((section) => section.id === "risques")?.slideCount).toBe(1);
  });
});

describe("echecs chrome", () => {
  it("reuses the profil client shell on FailuresSection", () => {
    expect(source).toContain("export function FailuresSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Les erreurs qui coûtent du temps, de l’argent et parfois plusieurs années.");
    expect(source).toContain("Arriver sans plan, c’est payer le prix du Canada avant d’en avoir les bénéfices.");
    expect(source).toContain("Le Canada n’est pas un échec. L’arrivée sans préparation, si.");
    expect(source).toContain("Logement, emploi, santé mentale : la presse raconte ce qui arrive quand le projet s’improvise.");
    expect(market).toContain("export function OpportunitiesShell");
    expect(source).toContain("hero={sectionBanners.failures}");
    expect(source).toContain("s.draft");
  });

  it("keeps coaching copy out of Failures helpers", () => {
    for (const name of ["FailuresSection", "FailuresRisks", "FailuresPress"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("aider le prospect");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("Cette section sert");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("echecs boards", () => {
  it("renders household risks and sourced press", () => {
    expect(source).toContain("highlightedFailureIds");
    expect(source).toContain("failureRisks");
    expect(source).toContain("risk.image");
    expect(source).toContain("failurePress");
    expect(source).toContain("Foyer");
    expect(source).toContain("Lire l’article");
    expect(source).toContain("article.image");
    expect(source).toContain("Sources publiques. Aperçu de démonstration, pas un diagnostic.");
    expect(source).toContain("Une bonne décision prise tôt coûte souvent moins cher qu’une mauvaise décision corrigée tard.");
    expect(source).toContain("Logement");
    expect(source).toContain("Emploi");
    expect(source).toContain("Détresse");
  });

  it("adds objective pills via the shared closing helper", () => {
    expect(extractFunction("FailuresRisks")).toContain("closingDeckPills(profile)");
  });
});

describe("ecosystem catalog", () => {
  it("keeps a single ecosystem slide", () => {
    expect(sections.find((section) => section.id === "ecosysteme")?.slideCount).toBe(1);
  });
});

describe("ecosystem chrome", () => {
  it("reuses the profil client shell on EcosystemSection", () => {
    expect(source).toContain("export function EcosystemSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Un seul interlocuteur pour construire tout le projet.");
    expect(source).toContain("Immigration + Emploi + Installation = Projet Canada structuré");
    expect(source).toContain("Nous ne nous arrêtons pas au dossier.");
    expect(source).toContain("IR réunit immigration, emploi et installation dans une même logique de projet.");
    expect(source).toContain("Parlons du projet de {name}.");
    expect(source).toContain("IR_CTA");
    expect(source).toContain("from-primary to-ir-deep");
    expect(source).toContain("hero={sectionBanners.ecosystem}");
  });

  it("keeps coaching copy out of EcosystemSection", () => {
    const chunk = extractFunction("EcosystemSection");
    expect(chunk).not.toContain("Le commercial");
    expect(chunk).not.toContain("aider le prospect");
    expect(chunk).not.toContain("version connectée");
    expect(chunk).not.toContain("panel=");
    expect(chunk).not.toContain("useDeckStore");
  });
});

describe("ecosystem boards", () => {
  it("renders three pillars plus contact and WhatsApp CTA", () => {
    expect(source).toContain("ecosystemPillars");
    expect(source).toContain("IR_CTA");
    expect(source).toContain("IR_WHATSAPP_URL");
    expect(source).toContain("IR_SITE_URL");
    expect(source).toContain("Contact");
  });

  it("closes with a profile-matched life photo strip under the CTA", () => {
    expect(source).toContain("HoverRevealCards");
    expect(source).toContain("ecosystemLifeCards(profile)");
    expect(source).toContain("place-strip-wrap");
    expect(source).toContain("Le projet, une fois structuré.");
  });

  it("keeps ecosystem pills limited to foyer, objective and closing lenses", () => {
    const chunk = extractFunction("EcosystemSection");
    expect(chunk).toContain("closingDeckPills(profile)");
    expect(chunk).not.toContain("ecosystemPillars.map((pillar) => pillar.tag)");
  });
});

describe("ecosystem layout grids", () => {
  it("keeps ecosystem pillars on container-query grids with min-w-0 instead of viewport sm: columns", () => {
    const chunk = extractFunction("EcosystemSection");
    expect(chunk).toContain("grid min-w-0 gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3");
    expect(chunk).not.toContain("sm:grid-cols");
  });
});

describe("closingDeckPills", () => {
  it("returns an empty array when no menu lens is selected", () => {
    expect(closingDeckPills(defaultProfile)).toEqual([]);
  });

  it("returns the selected visit, business and family lenses by name", () => {
    expect(closingDeckPills({ ...defaultProfile, objective: "Visite", visitPurpose: "business" })).toEqual(["Voyage d’affaires"]);
    expect(closingDeckPills({ ...defaultProfile, objective: "Affaires", businessPath: "visitor" })).toEqual(["Visiteur d’affaires"]);
    expect(closingDeckPills({ ...defaultProfile, objective: "Regroupement familial", familyLink: "parent" })).toEqual(["Parent"]);
  });

  it("formats work pills from the selected noc and FEER", () => {
    expect(closingDeckPills({ ...defaultProfile, objective: "Travail", workNocCode: "21232" })).toEqual(["CNP · FEER 1"]);
  });

  it("does not simulate a spouse lens when the link is empty", () => {
    expect(
      closingDeckPills({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Regroupement familial",
        familyLink: "",
      }),
    ).toEqual([]);
  });
});
