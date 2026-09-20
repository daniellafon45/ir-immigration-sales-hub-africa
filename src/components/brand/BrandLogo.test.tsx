import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "./BrandLogo";

describe("BrandLogo", () => {
  it("imports an official PNG lockup instead of the SVG approximation", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/brand/BrandLogo.tsx"), "utf8");
    expect(source).not.toContain("logo-ir.svg");
    expect(source.includes("logo-ir-bleu.png") || source.includes("logo-ir.png")).toBe(true);
  });

  it("renders an img with the IR Immigration alt text", () => {
    const html = renderToStaticMarkup(<BrandLogo />);
    expect(html).toContain('alt="IR Immigration Intégration"');
    expect(html).toContain("<img");
  });
});
