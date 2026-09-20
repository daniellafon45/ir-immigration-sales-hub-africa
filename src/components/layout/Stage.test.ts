import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "Stage.tsx"), "utf8");

describe("Stage slide arrows", () => {
  it("keeps arrows out of the content layer and hides them at the ends", () => {
    expect(source).toContain("slideIndex > 0");
    expect(source).toContain("slideIndex < section.slideCount - 1");
    expect(source).not.toContain("disabled:opacity-20");
    expect(source).toContain("relative z-0");
    expect(source).toContain('section.id !== "pitch"');
    expect(source).toContain("overflow-y-auto");
    expect(source).toContain("overflow-x-clip");
    expect(source).toContain("px-3 md:px-6");
    expect(source).not.toContain("overflow-x-hidden");
    expect(source).toContain('hasSlides && "pb-4"');
  });
});
