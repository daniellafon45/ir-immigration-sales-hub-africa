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
});

