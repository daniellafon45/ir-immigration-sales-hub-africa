import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/components/brand/IrBlueSign.tsx"), "utf8");

describe("IrBlueSign", () => {
  it("uses the official blue IR lockup instead of the animated shader", () => {
    expect(source).toContain("@/assets/brand/logo-ir.png");
    expect(source).not.toContain("ShaderGradient");
    expect(source).toContain("aria-hidden");
    expect(source).toContain("absolute inset-0");
  });
});
