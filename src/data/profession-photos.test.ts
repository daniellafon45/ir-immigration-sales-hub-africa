import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { allProfessionPhotoSets, professionPhotosFor } from "@/data/profession-photos";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const dir = join(dirname(fileURLToPath(import.meta.url)), "../assets/professions");
const files = [
  "finance-1.jpg",
  "tech-1.jpg",
  "sante-1.jpg",
  "metiers-1.jpg",
  "ingenierie-1.jpg",
  "education-1.jpg",
  "resto-1.jpg",
  "transport-1.jpg",
  "commerce-1.jpg",
  "autre-1.jpg",
] as const;

describe("profession photos", () => {
  it.each(files)("ships a local JPEG for %s", (name) => {
    const path = join(dir, name);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(8_000);
  });

  it("returns one finance photo for Comptable", () => {
    expect(professionPhotosFor("Comptable")).toHaveLength(1);
  });

  it("returns one tech photo for Développeur logiciel", () => {
    expect(professionPhotosFor("Développeur logiciel")).toHaveLength(1);
  });

  it("covers every listed profession", () => {
    for (const { profession, photos } of allProfessionPhotoSets()) {
      expect(photos.length, profession).toBeGreaterThan(0);
    }
  });
});
