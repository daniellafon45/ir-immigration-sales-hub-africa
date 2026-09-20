import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "FullscreenButton.tsx"), "utf8");

describe("FullscreenButton", () => {
  it("toggles presentation fullscreen", () => {
    expect(source).toContain("toggleFullscreen");
    expect(source).toContain("Plein écran");
    expect(source).toContain("Quitter le plein écran");
  });
});
