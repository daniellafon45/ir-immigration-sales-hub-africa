import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "PageShell.tsx"), "utf8");
const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../index.css"), "utf8");

describe("PageShell", () => {
  it("exposes a shared two-pane frame driven by CSS, not a fixed 1280px grid", () => {
    expect(source).toContain("page-shell");
    expect(source).toContain("page-shell__frame");
    expect(source).toContain("page-shell__frame--split");
    expect(source).toContain("page-shell__main");
    expect(source).toContain("page-shell__aside");
    expect(source).not.toContain("max-w-[1280px]");
    expect(source).not.toContain("xl:grid-cols-[minmax(0,1fr)_300px]");
  });
});

describe("fluid layout system", () => {
  it("sizes the split from the stage container so the sidebar never sits on overflowing cards", () => {
    expect(css).toContain("container-name: page");
    expect(css).toContain("container-name: page-main");
    expect(css).toContain("minmax(0, 1fr) var(--page-sidebar)");
    expect(css).toContain("--page-sidebar:");
    expect(css).toContain("@container page");
    expect(css).toContain("isolation: isolate");
    expect(css).not.toContain("max-w-[1280px]");
  });

  it("stops clipping cards at the page shell level while keeping a horizontal page gutter", () => {
    const shellStart = css.indexOf(".page-shell");
    expect(shellStart).toBeGreaterThan(-1);
    const shellEnd = css.indexOf("}", shellStart);
    const shellBlock = css.slice(shellStart, shellEnd);

    expect(shellBlock).toContain("--page-pad-x: clamp(");
    expect(shellBlock).toContain("overflow: visible");
    expect(shellBlock).not.toContain("overflow: hidden");

    const frameStart = css.indexOf(".page-shell__frame");
    expect(frameStart).toBeGreaterThan(-1);
    const frameEnd = css.indexOf("}", frameStart);
    const frameBlock = css.slice(frameStart, frameEnd);

    expect(frameBlock).toContain("overflow-x: visible");
    expect(frameBlock).toContain("overflow-y: auto");
    expect(frameBlock).not.toContain("overflow-x: hidden");

    const splitMainStart = css.indexOf(".page-shell__frame--split .page-shell__main");
    expect(splitMainStart).toBeGreaterThan(-1);
    const splitMainEnd = css.indexOf("}", splitMainStart);
    const splitMainBlock = css.slice(splitMainStart, splitMainEnd);

    expect(splitMainBlock).toContain("overflow-x: visible");
    expect(splitMainBlock).toContain("overflow-y: auto");
    expect(splitMainBlock).toContain("padding-inline: 2px");
    expect(splitMainBlock).toContain("margin-inline: -2px");
    expect(splitMainBlock).not.toContain("overflow-x: hidden");

    expect(css).toMatch(/--page-pad-x:\s*clamp\(\s*1rem\b/);
  });

  it("lets non-split pages grow with their boards so long lists can scroll", () => {
    expect(css).toContain(".page-shell__frame:not(.page-shell__frame--split) .page-shell__main");
    expect(css).toContain("min-height: min-content");
  });

  it("hides native scrollbars everywhere while keeping overflow", () => {
    expect(css).toContain("scrollbar-width: none");
    expect(css).toContain("-ms-overflow-style: none");
    expect(css).toContain("*::-webkit-scrollbar");
    expect(css).toContain("display: none");
  });

  it("keeps the place strip inside the main column on every width", () => {
    expect(css).toContain(".ir-auto-grid");
    expect(css).toContain(".ir-auto-grid-sm");
    expect(css).toContain(".place-strip");
    expect(css).toContain("repeat(2, minmax(0, 1fr))");
    expect(css).toContain("@container page-main");
    expect(css).toContain("flex: 1 1 0%");
  });
});
