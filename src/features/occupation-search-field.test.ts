import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "occupation-search-field.tsx"),
  "utf8",
);

describe("OccupationSearchField", () => {
  it("lets the user type a métier or secteur and commit a resolved catalog value", () => {
    expect(source).toContain("export function OccupationSearchField");
    expect(source).toContain("searchOccupations");
    expect(source).toContain("resolveProfession");
    expect(source).toContain("resolveSector");
    expect(source).toContain("onChange: (resolved: string, typed: string) => void");
    expect(source).toContain("<Input");
  });
});
