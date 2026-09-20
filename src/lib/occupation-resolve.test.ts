import { describe, expect, it } from "vitest";
import {
  applyOccupationPatch,
  canonicalizeOccupation,
  resolveProfession,
  resolveSector,
  searchOccupations,
} from "@/lib/occupation-resolve";
import { emptyAdult } from "@/data/profile";

describe("resolveProfession", () => {
  it("keeps catalog labels and expands gendered aliases", () => {
    expect(resolveProfession("Comptable")).toBe("Comptable");
    expect(resolveProfession("infirmière")).toBe("Infirmier(ère)");
    expect(resolveProfession("CPA")).toBe("Comptable");
    expect(resolveProfession("dev")).toBe("Développeur logiciel");
    expect(resolveProfession("camionneur")).toBe("Chauffeur");
  });

  it("maps a trade alias to the closest catalog métier", () => {
    expect(resolveProfession("Plombier")).toBe("Technicien en maintenance");
    expect(resolveProfession("plumber")).toBe("Technicien en maintenance");
  });

  it("uses a CNP title when the catalog name does not match", () => {
    expect(resolveProfession("Ingénieurs logiciels")).toBe("Développeur logiciel");
  });

  it("falls back to Autre when nothing matches", () => {
    expect(resolveProfession("Astronaute")).toBe("Autre");
    expect(resolveProfession("")).toBe("Autre");
  });
});

describe("resolveSector", () => {
  it("maps aliases and accents to catalog sectors", () => {
    expect(resolveSector("IT")).toBe("Technologies de l’information");
    expect(resolveSector("santé")).toBe("Santé");
    expect(resolveSector("chantier")).toBe("Construction et métiers");
    expect(resolveSector("Finance et comptabilité")).toBe("Finance et comptabilité");
  });

  it("falls back to Autre when nothing matches", () => {
    expect(resolveSector("Spatial")).toBe("Autre");
  });
});

describe("searchOccupations", () => {
  it("filters professions without waiting for an exact catalog label", () => {
    expect(searchOccupations("infirm", "profession")[0]).toBe("Infirmier(ère)");
    expect(searchOccupations("cpa", "profession")).toContain("Comptable");
  });

  it("returns catalog items when the query is too short", () => {
    expect(searchOccupations("i", "profession").length).toBeGreaterThan(0);
    expect(searchOccupations("i", "profession")).not.toContain("Autre");
  });
});

describe("applyOccupationPatch", () => {
  it("derives the sector when a métier is patched alone", () => {
    expect(applyOccupationPatch({ profession: "infirmière" })).toEqual({
      profession: "Infirmier(ère)",
      jobTitle: "Infirmier(ère)",
      sector: "Santé",
    });
  });

  it("keeps a custom title when the métier resolves to Autre", () => {
    expect(applyOccupationPatch({ profession: "Astronaute" })).toEqual({
      profession: "Autre",
      jobTitle: "Astronaute",
      sector: "Autre",
    });
  });

  it("resolves a sector patched on its own", () => {
    expect(applyOccupationPatch({ sector: "IT" })).toEqual({
      sector: "Technologies de l’information",
    });
  });
});

describe("canonicalizeOccupation", () => {
  it("resolves an unknown métier and derives its sector", () => {
    expect(
      canonicalizeOccupation({
        ...emptyAdult,
        profession: "Plombier",
        jobTitle: "",
        sector: "Santé",
      }),
    ).toEqual({
      profession: "Technicien en maintenance",
      jobTitle: "Plombier",
      sector: "Construction et métiers",
    });
  });

  it("keeps an independent sector when the métier is already in the catalog", () => {
    expect(
      canonicalizeOccupation({
        ...emptyAdult,
        profession: "Comptable",
        jobTitle: "Comptable",
        sector: "Santé",
      }),
    ).toEqual({
      profession: "Comptable",
      jobTitle: "Comptable",
      sector: "Santé",
    });
  });
});
