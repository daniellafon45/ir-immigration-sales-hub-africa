import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canadaLiveBanner, sectionBanners } from "@/data/section-banners";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const bannerDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/banners");
const files = ["jobs.jpg", "compare.jpg", "failures.jpg", "ecosystem.jpg", "canada.jpg"];

describe("section photo banners", () => {
  it.each(files)("ships a local JPEG for %s", (file) => {
    const path = join(bannerDir, file);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(20_000);
  });

  it("exposes a photo for every sales-hub section except profile", () => {
    expect(sectionBanners.opportunities).toMatch(/\.(jpg|jpeg)(?:\?|$)/i);
    expect(sectionBanners.jobs).toMatch(/jobs/i);
    expect(sectionBanners.salaries).toMatch(/salary-banner/i);
    expect(sectionBanners.calculators).toMatch(/salary-banner/i);
    expect(sectionBanners.provinces).toMatch(/salary-banner/i);
    expect(sectionBanners.routes).toMatch(/pont-installation/i);
    expect(sectionBanners.compare).toMatch(/compare/i);
    expect(sectionBanners.failures).toMatch(/failures/i);
    expect(sectionBanners.ecosystem).toMatch(/ecosystem/i);
    expect(sectionBanners.canada).toMatch(/canada/i);
    for (const src of Object.values(sectionBanners)) {
      expect(src).not.toMatch(/unsplash/i);
    }
  });

  it("picks a distinct Canada Live banner per briefing page", () => {
    expect(canadaLiveBanner("vue")).toMatch(/canada/i);
    expect(canadaLiveBanner("emploi")).toMatch(/emploi-construction/i);
    expect(canadaLiveBanner("demographie")).toMatch(/demo-aines/i);
    expect(canadaLiveBanner("pont")).toMatch(/pont-equipe/i);
  });
});
