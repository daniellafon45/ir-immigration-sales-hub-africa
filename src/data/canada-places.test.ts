import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canadaPlacesFor } from "@/data/canada-places";
import { SEASONS } from "@/lib/season";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const placesDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/places");
const slugs = ["quebec", "montreal", "toronto", "banff"] as const;

function isRaster(bytes: Buffer) {
  return bytes.subarray(0, 3).equals(jpegMagic) || bytes.subarray(0, 4).equals(pngMagic);
}

describe("seasonal Canada place photos", () => {
  it.each(slugs.flatMap((slug) => SEASONS.map((season) => [slug, season] as const)))(
    "ships a local raster for %s %s",
    (slug, season) => {
      const jpg = join(placesDir, `${slug}-${season}.jpg`);
      const png = join(placesDir, `${slug}-${season}.png`);
      const path = existsSync(jpg) ? jpg : png;
      expect(existsSync(path), path).toBe(true);
      const bytes = readFileSync(path);
      expect(isRaster(bytes)).toBe(true);
      expect(bytes.byteLength).toBeGreaterThan(20_000);
    },
  );

  it("selects the fall photo on 18 September", () => {
    const places = canadaPlacesFor(new Date(2026, 8, 18));
    expect(places).toHaveLength(4);
    for (const place of places) {
      expect(place.imageUrl).toMatch(/-fall\.(jpg|png|jpeg)(?:\?|$)/i);
      expect(place.imageUrl).not.toMatch(/unsplash/i);
      expect(place.imageFallbacks.length).toBeGreaterThan(0);
    }
  });

  it("keeps a fallback chain so a missing photo never blanks the card", () => {
    const [quebec] = canadaPlacesFor(new Date(2026, 0, 10));
    expect(quebec.imageUrl).toMatch(/quebec-winter/i);
    expect(quebec.imageFallbacks.some((url) => /quebec-summer/i.test(url))).toBe(true);
  });
});
