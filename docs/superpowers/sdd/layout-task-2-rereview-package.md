# Review package: Task 2 after fix

===== FILE: src/index.css.test.ts =====

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "index.css"), "utf8");

describe("app sans font", () => {
  it("loads Open Sans from Google Fonts and uses it as --font-sans", () => {
    expect(css).toContain('family=Open+Sans:wght@400;500;600;700');
    expect(css).toContain('--font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;');
  });

  it("does not keep Inter as the app font", () => {
    expect(css).not.toContain("family=Inter");
    expect(css).not.toContain('"Inter"');
  });
});

describe("option grid utilities", () => {
  it("defines .ir-option-grid after .ir-auto-grid-sm", () => {
    expect(css.indexOf(".ir-auto-grid-sm")).toBeLessThan(css.indexOf(".ir-option-grid"));
    expect(css).toContain(".ir-option-grid {");
    expect(css).toContain("display: grid;");
    expect(css).toMatch(/\.ir-option-grid\s*\{[\s\S]*?width: 100%;/);
    expect(css).toMatch(/\.ir-option-grid\s*\{[\s\S]*?gap: 0\.25rem;/);
    expect(css).toContain(
      "grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-option-min, 5.5rem)), 1fr));",
    );
  });

  it("defines .ir-option-btn for equal option chips", () => {
    expect(css).toContain(".ir-option-btn {");
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?display: flex;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?min-width: 0;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?width: 100%;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?min-height: 2rem;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?align-items: center;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?justify-content: center;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?padding-inline: 0\.25rem;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?text-align: center;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?overflow: hidden;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?text-overflow: ellipsis;/);
    expect(css).toMatch(/\.ir-option-btn\s*\{[\s\S]*?white-space: nowrap;/);
  });

  it("defines .ir-equal-row for Bas/MÃ©dian/Ã‰levÃ© triplets", () => {
    expect(css).toContain(".ir-equal-row {");
    expect(css).toMatch(/\.ir-equal-row\s*\{[\s\S]*?display: grid;/);
    expect(css).toMatch(/\.ir-equal-row\s*\{[\s\S]*?width: 100%;/);
    expect(css).toMatch(/\.ir-equal-row\s*\{[\s\S]*?gap: 0\.5rem;/);
    expect(css).toContain(
      "grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-equal-min, 7rem)), 1fr));",
    );
  });

  it("keeps existing .ir-auto-grid and .ir-auto-grid-sm", () => {
    expect(css).toContain(".ir-auto-grid {");
    expect(css).toContain(".ir-auto-grid-sm {");
  });

  it("does not duplicate option grid helpers", () => {
    const optionGridMatches = css.match(/\.ir-option-grid\s*\{/g) ?? [];
    const optionBtnMatches = css.match(/\.ir-option-btn\s*\{/g) ?? [];
    const equalRowMatches = css.match(/\.ir-equal-row\s*\{/g) ?? [];
    const autoGridSmMatches = css.match(/\.ir-auto-grid-sm\s*\{/g) ?? [];

    expect(optionGridMatches.length).toBe(1);
    expect(optionBtnMatches.length).toBe(1);
    expect(equalRowMatches.length).toBe(1);
    expect(autoGridSmMatches.length).toBe(1);
  });
});


===== FILE: src/index.css from .ir-auto-grid to EOF =====

.ir-auto-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15.5rem), 1fr));
}

.ir-auto-grid-sm {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr));
}

.ir-option-grid {
  display: grid;
  width: 100%;
  gap: 0.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-option-min, 5.5rem)), 1fr));
}

.ir-option-btn {
  display: flex;
  min-width: 0;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  padding-inline: 0.25rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ir-equal-row {
  display: grid;
  width: 100%;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ir-equal-min, 7rem)), 1fr));
}

