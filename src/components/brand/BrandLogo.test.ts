import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const brandDir = join(dirname(fileURLToPath(import.meta.url)), "../../assets/brand");
const publicLogo = join(dirname(fileURLToPath(import.meta.url)), "../../..", "public/logo-ir.png");

describe("official IR logos", () => {
  it.each(["logo-ir.png", "logo-ir-blanc.png", "logo-ir-noir.png"])(
    "ships %s as a real PNG",
    (file) => {
      const bytes = readFileSync(join(brandDir, file));
      expect(bytes.subarray(0, 8)).toEqual(pngMagic);
    },
  );

  it("uses the blue lockup as favicon source", () => {
    const brand = readFileSync(join(brandDir, "logo-ir.png"));
    const favicon = readFileSync(publicLogo);
    expect(favicon).toEqual(brand);
  });

  it("BrandLogo imports the official PNG lockup, not the fake SVG", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "BrandLogo.tsx"),
      "utf8",
    );
    expect(source).toContain("@/assets/brand/logo-ir.png");
    expect(source).toContain("@/assets/brand/logo-ir-blanc.png");
    expect(source).not.toContain("logo-ir.svg");
  });
});
