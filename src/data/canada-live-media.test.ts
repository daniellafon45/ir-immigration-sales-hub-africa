import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canadaLiveGallery, canadaLiveHero } from "@/data/canada-live-media";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const mediaDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/canada-live");
const files = [
  "emploi-hero.jpg",
  "emploi-sante.jpg",
  "emploi-construction.jpg",
  "emploi-bureau.jpg",
  "emploi-metiers.jpg",
  "demo-hero.jpg",
  "demo-aines.jpg",
  "demo-famille.jpg",
  "demo-soins.jpg",
  "demo-ecole.jpg",
  "pont-hero.jpg",
  "pont-metier.jpg",
  "pont-ville.jpg",
  "pont-equipe.jpg",
  "pont-installation.jpg",
];

function isRaster(bytes: Buffer) {
  return bytes.subarray(0, 3).equals(jpegMagic) || bytes.subarray(0, 4).equals(pngMagic);
}

describe("canada live themed media", () => {
  it.each(files)("ships a local raster for %s", (file) => {
    const path = join(mediaDir, file);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(isRaster(bytes)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(20_000);
  });
 
  it("keeps each themed raster unique", () => {
    const hashes = files.map((file) => {
      const bytes = readFileSync(join(mediaDir, file));
      const digest = createHash("sha256").update(bytes).digest("hex");
      return digest + String(bytes.byteLength);
    });
    expect(new Set(hashes).size).toBe(files.length);
  });

  it("keeps landmark photos on the overview page", () => {
    const gallery = canadaLiveGallery("vue");
    expect(gallery.map((item) => item.title)).toEqual(["Québec", "Montréal", "Toronto", "Banff"]);
  });

  it("shows Canadian workers on the employment page", () => {
    const gallery = canadaLiveGallery("emploi");
    expect(gallery).toHaveLength(4);
    expect(gallery.map((item) => item.title)).toEqual(["Santé", "Construction", "Bureaux", "Métiers"]);
    expect(gallery.map((item) => item.subtitle)).toEqual([
      "Soins et recrutement",
      "Chantiers ouverts",
      "Services et TI",
      "Métiers en demande",
    ]);
    for (const item of gallery) {
      expect(item.imageUrl).not.toMatch(/unsplash/i);
      expect(item.imageUrl).toMatch(/emploi-(sante|construction|bureau|metiers)/i);
    }
    const hero = canadaLiveHero("emploi");
    expect(hero.place).toBe("Marché du travail");
    expect(hero.image).toMatch(/emploi-hero/i);
    expect(hero.image).not.toMatch(/toronto-/i);
  });

  it("shows care and family scenes on the demography page", () => {
    const gallery = canadaLiveGallery("demographie");
    expect(gallery.map((item) => item.title)).toEqual(["Aînés", "Famille", "Soins", "École"]);
    const hero = canadaLiveHero("demographie");
    expect(hero.place).toBe("Relève");
    expect(hero.image).toMatch(/demo-hero/i);
  });

  it("shows project and career scenes on the bridge page", () => {
    const gallery = canadaLiveGallery("pont");
    expect(gallery.map((item) => item.title)).toEqual(["Métier", "Ville", "Équipe", "Installation"]);
    const hero = canadaLiveHero("pont");
    expect(hero.place).toBe("Votre projet");
    expect(hero.image).toMatch(/pont-hero/i);
  });
});

