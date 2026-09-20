import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "site-drawer.tsx"), "utf8");

describe("SiteDrawer", () => {
  it("embeds the site in an iframe and offers a new-tab action", () => {
    expect(source).toContain("export function SiteDrawer");
    expect(source).toContain("<iframe");
    expect(source).toContain("Nouvel onglet");
    expect(source).toContain('target="_blank"');
    expect(source).toContain("aria-label");
  });
});
