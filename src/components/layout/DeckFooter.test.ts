import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "DeckFooter.tsx"), "utf8");

describe("DeckFooter", () => {
  it("does not show a Quitter control or section counter", () => {
    expect(source).not.toContain("Quitter");
    expect(source).not.toContain("sections.length");
    expect(source).not.toContain("section.label");
  });

  it("keeps in-section slide progress", () => {
    expect(source).toContain("goToSlide");
    expect(source).toContain("section.slideCount");
    expect(source).toContain("slideIndex + 1");
    expect(source).toContain("relative z-0");
    expect(source).not.toContain("z-10");
  });
});
