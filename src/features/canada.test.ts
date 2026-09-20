import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "canada.tsx"), "utf8");

describe("Canada live layout", () => {
  it("uses the shared equal-row grid helper for stats, with an 8rem minimum cell", () => {
    expect(source).toContain("className=\"shrink-0 ir-equal-row\"");
    expect(source).toContain("--ir-equal-min");
    expect(source).toContain("8rem");
    expect(source).not.toContain("grid-cols-4");
    expect(source).toContain("page.stats.slice(0, 3)");
    expect(source).toContain("Province visée");
    expect(source).toContain("ALL_CANADA");
    expect(source).toContain("canadaLivePlaceOptions");
  });

  it("stretches the hero and press columns to a shared bottom", () => {
    expect(source).toContain("grid min-h-0 flex-1 items-stretch gap-3");
    expect(source).toContain("flex h-full flex-col p-3 sm:px-4 sm:py-3");
    expect(source).toContain("mt-auto pt-1.5 text-[12px] text-muted-foreground");
    expect(source).toContain("relative h-full min-h-[12rem] overflow-hidden p-0");
    expect(source).toContain("flex h-full min-h-0 flex-col p-3 sm:px-4 sm:py-3");
    expect(source).not.toContain("grid shrink-0 gap-3 @min-[40rem]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]");
  });
});

