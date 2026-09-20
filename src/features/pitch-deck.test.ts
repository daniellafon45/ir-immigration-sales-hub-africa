import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "pitch-deck.tsx"), "utf8");

describe("PitchDeck layout", () => {
  it("lets oversized slides scroll instead of clipping titles", () => {
    expect(source).toContain("overflow-y-auto");
    expect(source).toContain("min-h-full");
    expect(source).not.toMatch(/function StatsSlide[\s\S]*flex h-full flex-col justify-center/);
    expect(source).not.toMatch(/function DoorsSlide[\s\S]*flex h-full flex-col justify-center/);
  });

  it("breaks the longest commercial titles onto two lines", () => {
    expect(source).toContain("LE CANADA CONTINUE D’ACCUEILLIR.\\nLA SÉLECTION EST PLUS CIBLÉE.");
    expect(source).toContain("ENTAMONS VOTRE PROJET\\nSANS PLUS TARDER");
  });

  it("swaps the opening hero photo from the live client profile", () => {
    expect(source).toContain("pitchHeroSources(profile)");
    expect(source).toContain("srcKey={heroKey}");
  });

  it("swaps the 90-days hero photo from the live client profile", () => {
    expect(source).toContain("pitchDaysImage(profile)");
  });

  it("puts a photo inside each targeting stat card", () => {
    expect(source).toContain("stat.image");
    expect(source).toMatch(/function StatsSlide[\s\S]*object-cover/);
  });

  it("puts a photo inside each project-risk card", () => {
    expect(source).toMatch(/function ProblemsSlide[\s\S]*item\.image/);
    expect(source).toMatch(/function ProblemsSlide[\s\S]*object-cover/);
  });

  it("swaps the forms-slide photos from the live client profile", () => {
    expect(source).toContain("pitchFormCards(profile)");
  });
});
