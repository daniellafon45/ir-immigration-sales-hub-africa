import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "SideNav.tsx"), "utf8");

describe("SideNav", () => {
  it("exposes a fullscreen control", () => {
    expect(source).toContain("FullscreenButton");
  });

  it("keeps the sidebar in the flow while only raising the tooltip above the stage", () => {
    const lines = source.split("\n");
    const asideLine = lines.find((line) => line.includes("<aside"));
    expect(asideLine).toBeDefined();
    expect(asideLine).not.toContain("z-50");

    const tooltipLine = lines.find((line) => line.includes("group-hover:opacity-100"));
    expect(tooltipLine).toBeDefined();
    expect(tooltipLine).toContain("z-50");
  });
});
