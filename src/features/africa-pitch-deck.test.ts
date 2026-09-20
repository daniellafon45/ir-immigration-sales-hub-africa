import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { africaPitchSlides } from "@/data/pitch-africa";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "africa-pitch-deck.tsx"), "utf8");

describe("AfricaPitchDeck", () => {
  it("implements africa-* layouts without commercial HeroSlide/StatsSlide", () => {
    expect(source).toContain("africa-hero");
    expect(source).toContain("africa-links");
    expect(source).toContain("africa-traps");
    expect(source).toContain("africa-cta");
    expect(source).not.toContain("function HeroSlide");
    expect(source).not.toContain("function StatsSlide");
    expect(source).not.toContain("function ProblemsSlide");
  });

  it("uses a split hero with bottom photo band, not full-bleed couple skyline", () => {
    expect(source).toContain("function AfricaHero");
    expect(source).toMatch(/function AfricaHero[\s\S]*lg:grid-cols-/);
  });

  it("keeps africa-promises in the deck", () => {
    expect(africaPitchSlides.find((s) => s.layout === "africa-promises")).toBeTruthy();
  });

  it("emphasizes promises over refusals in AfricaPromises with aligned equal-height cards", () => {
    expect(source).toContain("function AfricaPromises");
    expect(source).toMatch(/function AfricaPromises[\s\S]*from-primary to-ir-deep/);
    expect(source).toMatch(/function AfricaPromises[\s\S]*sm:grid-cols-2/);
    expect(source).toMatch(/function AfricaPromises[\s\S]*items-stretch/);
    expect(source).toContain("Nous promettons");
    expect(source).toContain("Nous ne promettons pas");
  });

  it("makes africa-mosaic cards open a proof drawer with stats and press", () => {
    expect(source).toContain("opportunityPanel");
    expect(source).toContain("pitchMosaicTheme");
    expect(source).toContain("ProofDrawer");
    expect(source).toContain("aria-expanded");
    expect(source).toContain("Voir preuves");
  });

  it("makes africa-links cards open a site drawer with iframe and new-tab action", () => {
    expect(source).toContain("function AfricaLinks");
    expect(source).toContain("SiteDrawer");
    expect(source).toMatch(/function AfricaLinks[\s\S]*setOpenUrl/);
    expect(source).toMatch(/function AfricaLinks[\s\S]*type="button"/);
    expect(source).toMatch(/function AfricaLinks[\s\S]*openUrl/);
  });

  it("places a soft Canadian house background behind africa-welcome", () => {
    expect(source).toContain("function AfricaWelcome");
    expect(source).toMatch(/function AfricaWelcome[\s\S]*bg-\[#f7fafc\]\/58/);
    expect(source).toMatch(/function AfricaWelcome[\s\S]*bg-white\/85/);
    expect(source).toMatch(/function AfricaWelcome[\s\S]*mx-auto[\s\S]*text-center/);
    expect(source).not.toMatch(/function AfricaWelcome[\s\S]*slide\.kicker/);
    const welcome = africaPitchSlides.find((s) => s.layout === "africa-welcome");
    expect(String(welcome?.image)).toMatch(/welcome-bg-house/);
    expect(welcome?.kicker).toBeUndefined();
  });

  it("assigns atmospheric backgroundImage on light slides 3–5 and 8–10", () => {
    const trio = africaPitchSlides.find((s) => s.layout === "africa-trio");
    const focus = africaPitchSlides.find((s) => s.layout === "africa-focus");
    const mosaic = africaPitchSlides.find((s) => s.layout === "africa-mosaic");
    const proof = africaPitchSlides.find((s) => s.layout === "africa-proof");
    const links = africaPitchSlides.find((s) => s.layout === "africa-links");
    const journey = africaPitchSlides.find((s) => s.layout === "africa-journey");
    expect(trio?.backgroundImage).toBeTruthy();
    expect(focus?.backgroundImage).toBeTruthy();
    expect(String(focus?.backgroundImage)).toMatch(/focus-project/);
    expect(mosaic?.backgroundImage).toBeTruthy();
    expect(proof?.backgroundImage).toBeTruthy();
    expect(String(proof?.backgroundImage)).toMatch(/proof-network/);
    expect(links?.backgroundImage).toBeTruthy();
    expect(String(links?.backgroundImage)).toMatch(/mosaic-business/);
    expect(journey?.backgroundImage).toBeTruthy();
    expect(String(journey?.backgroundImage)).toMatch(/proof-departure/);
    expect(source).toContain("backgroundImage");
    expect(source).toContain("lightShellPhoto");
  });
});
