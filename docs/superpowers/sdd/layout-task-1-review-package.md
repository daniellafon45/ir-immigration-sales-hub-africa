# Review package: Task 1 Shell (no git range)
# Files changed listed by implementer. Full current contents follow.



===== FILE: src/App.tsx =====

import { useEffect } from "react";
import { sections } from "@/catalog";
import { DeckFooter } from "@/components/layout/DeckFooter";
import { SideNav } from "@/components/layout/SideNav";
import { Stage } from "@/components/layout/Stage";
import { useDeckStore } from "@/store/deck";

export default function App() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const nextSection = useDeckStore((s) => s.nextSection);
  const prevSection = useDeckStore((s) => s.prevSection);
  const hasSlides = sections[sectionIndex].slideCount > 1;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowDown" && event.altKey) nextSection();
      if (event.key === "ArrowUp" && event.altKey) prevSection();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, nextSection, prevSection]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white md:flex-row">
      <SideNav />
      <main className="relative z-0 min-w-0 isolate flex min-h-0 flex-1 flex-col">
        <div className="h-[3px] shrink-0 bg-linear-to-r from-primary to-ir-blue2" />
        <Stage />
        {hasSlides ? <DeckFooter /> : null}
      </main>
    </div>
  );
}



===== FILE: src/components/layout/Stage.tsx =====

import { ChevronLeft, ChevronRight } from "lucide-react";
import { sections } from "@/catalog";
import { sectionViews } from "@/features/registry";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";

export function Stage() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const slideIndex = useDeckStore((s) => s.slideIndex);
  const direction = useDeckStore((s) => s.direction);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const section = sections[sectionIndex];
  const View = sectionViews[section.id];
  const hasSlides = section.slideCount > 1;
  const gutter = section.id !== "pitch";

  return (
    <section className="relative z-0 min-h-0 min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_70%_-10%,rgba(27,84,141,.07),transparent_38%)] bg-[#f4f7fb]" aria-live="polite">
      <div
        className={cn(
          "h-full min-h-0 min-w-0 overflow-y-auto overflow-x-clip",
          gutter && "px-3 md:px-6",
          hasSlides && "pb-4",
        )}
      >
        <div key={`${section.id}-${slideIndex}`} className={cn("slide-enter relative z-10 h-full min-h-0 min-w-0", direction === "left" && "from-left")}>
          <View />
        </div>
      </div>
      {hasSlides ? (
        <>
          {slideIndex > 0 ? (
            <button
              type="button"
              aria-label="Page prÃ©cÃ©dente"
              onClick={prevSlide}
              className="absolute top-1/2 left-2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,.10)] transition hover:scale-[1.04] hover:text-primary md:grid"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : null}
          {slideIndex < section.slideCount - 1 ? (
            <button
              type="button"
              aria-label="Page suivante"
              onClick={nextSlide}
              className="absolute top-1/2 right-2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,.10)] transition hover:scale-[1.04] hover:text-primary md:grid"
            >
              <ChevronRight className="size-6" />
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}



===== FILE: src/components/layout/SideNav.tsx =====

import { sections } from "@/catalog";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FullscreenButton } from "@/components/layout/FullscreenButton";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";

export function SideNav() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const goToSection = useDeckStore((s) => s.goToSection);

  return (
    <aside
      className="flex shrink-0 bg-white max-md:order-last max-md:h-[calc(3.6rem+env(safe-area-inset-bottom,0px))] max-md:w-full max-md:flex-row max-md:items-stretch max-md:border-t max-md:border-[#e7eaf0] max-md:pb-[env(safe-area-inset-bottom,0px)] md:h-auto md:w-14 md:flex-col md:border-r md:border-[#e7eaf0]"
      aria-label="Navigation principale"
    >
      <div className="hidden h-[62px] place-items-center md:grid">
        <BrandLogo className="size-10 rounded-lg" />
      </div>
      <nav className="flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none] max-md:items-center max-md:px-1 md:flex-col md:overflow-x-hidden md:overflow-y-auto">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const active = index === sectionIndex;
          return (
            <div key={section.id} className="relative mx-auto my-0.5 max-md:mx-0 max-md:shrink-0">
              <button
                type="button"
                onClick={() => goToSection(index)}
                aria-label={section.label}
                className={cn(
                  "group relative mx-auto grid size-11 place-items-center rounded-[10px] text-[#7b8492] transition-colors duration-180",
                  active ? "bg-secondary text-primary" : "hover:bg-accent hover:text-primary",
                )}
              >
                {active ? (
                  <span className="absolute rounded bg-primary max-md:right-2 max-md:bottom-0.5 max-md:left-2 max-md:h-[3px] md:top-2 md:bottom-2 md:-left-[7px] md:h-auto md:w-[3px]" />
                ) : null}
                <Icon className="size-[18px]" strokeWidth={1.8} />
                <span className="pointer-events-none absolute top-1/2 left-[52px] z-50 hidden -translate-y-1/2 rounded-md bg-[#0b1f3a] px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
                  {section.label}
                </span>
              </button>
            </div>
          );
        })}
      </nav>
      <div className="grid shrink-0 place-items-center max-md:w-12 md:h-[54px] md:border-t md:border-[#eef1f5]">
        <FullscreenButton />
      </div>
    </aside>
  );
}



===== FILE: src/components/layout/PageShell.test.ts =====

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
    expect(splitMainBlock).not.toContain("overflow-x: hidden");

    expect(css).toMatch(/--page-pad-x:\s*clamp\(\s*1rem\b/);
  });

  it("lets non-split pages grow with their boards so long lists can scroll", () => {
    expect(css).toContain(".page-shell__frame:not(.page-shell__frame--split) .page-shell__main");
    expect(css).toContain("min-height: min-content");
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



===== FILE: src/components/layout/Stage.test.ts =====

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



===== FILE: src/components/layout/SideNav.test.ts =====

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



===== FILE: src/index.css =====

@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Roboto+Condensed:wght@700&display=swap");
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;
  --font-pitch: "Roboto Condensed", "Open Sans", ui-sans-serif, sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-ir-deep: var(--ir-deep);
  --color-ir-blue2: var(--ir-blue2);
  --color-ir-navy: var(--ir-navy);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --animate-cell-ripple: cell-ripple var(--duration, 200ms) ease-out none 1 var(--delay, 0ms);

  @keyframes cell-ripple {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.4;
    }
  }
}

:root {
  --background: #f4f7fb;
  --foreground: #0d2744;
  --card: #ffffff;
  --card-foreground: #0d2744;
  --primary: #1b548d;
  --primary-foreground: #ffffff;
  --secondary: #e8eef4;
  --secondary-foreground: #0d2744;
  --muted: #eef3f8;
  --muted-foreground: #5b6b7c;
  --accent: #eef3f7;
  --accent-foreground: #1b548d;
  --border: #dde6ef;
  --input: #c9d6e4;
  --ring: #1b548d;
  --destructive: #c8102e;
  --radius: 0.75rem;
  --ir-navy: #12344f;
  --ir-deep: #143d67;
  --ir-blue2: #3a70a6;
  --ir-red: #e31c23;
  --ir-banner: linear-gradient(135deg, #1b548d 0%, #143d67 100%);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  height: 100%;
  min-width: 0;
}

html {
  overflow-x: clip;
}

body {
  font-family: var(--font-sans);
  background: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .slide-enter {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}

@keyframes slide-in {
  from {
    opacity: 0.35;
    transform: translateX(var(--slide-from, 16px));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-enter {
  animation: slide-in 280ms ease-out forwards;
}

.slide-enter.from-left {
  --slide-from: 0px;
}

@keyframes ir-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.ir-rise {
  animation: ir-rise 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.page-shell {
  --page-pad-x: clamp(1rem, 2vw, 2rem);
  --page-pad-y: clamp(0.65rem, 1.3vw, 1.15rem);
  --page-gap: clamp(0.65rem, 1.1vw, 0.85rem);
  --page-sidebar: clamp(16.25rem, 24cqi, 20.5rem);
  --page-max: 90rem;
  container-name: page;
  container-type: inline-size;
  display: flex;
  height: 100%;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
  overflow: visible;
}

.page-shell__frame {
  display: grid;
  min-height: 0;
  min-width: 0;
  width: 100%;
  max-width: min(100%, var(--page-max));
  flex: 1;
  align-content: start;
  align-items: stretch;
  gap: var(--page-gap);
  grid-template-columns: minmax(0, 1fr);
  margin-inline: auto;
  overflow-x: visible;
  overflow-y: auto;
  padding: var(--page-pad-y) var(--page-pad-x) calc(var(--page-pad-y) + 0.35rem);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-shell__frame::-webkit-scrollbar {
  display: none;
}

.page-shell__main {
  container-name: page-main;
  container-type: inline-size;
  position: relative;
  z-index: 1;
  isolation: isolate;
  display: flex;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
  gap: var(--page-gap);
}

.page-shell__main > * {
  min-width: 0;
}

.page-shell__frame:not(.page-shell__frame--split) {
  scrollbar-width: thin;
  scrollbar-color: #c9d6e4 transparent;
  -ms-overflow-style: auto;
}

.page-shell__frame:not(.page-shell__frame--split)::-webkit-scrollbar {
  display: block;
  width: 6px;
}

.page-shell__frame:not(.page-shell__frame--split)::-webkit-scrollbar-thumb {
  background: #c9d6e4;
  border-radius: 99px;
}

.page-shell__frame:not(.page-shell__frame--split) .page-shell__main {
  min-height: min-content;
}

.page-shell__aside {
  position: relative;
  z-index: 0;
  display: flex;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
}

.page-shell__aside > * {
  min-height: 12rem;
  min-width: 0;
  flex: 1 1 auto;
}

@container page (min-width: 50rem) {
  .page-shell__frame--split {
    grid-template-columns: minmax(0, 1fr) var(--page-sidebar);
    grid-template-rows: minmax(0, 1fr);
    align-content: stretch;
    overflow-x: visible;
    overflow-y: hidden;
  }

  .page-shell__frame--split .page-shell__main {
    overflow-x: visible;
    overflow-y: auto;
    padding-bottom: 0.15rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .page-shell__frame--split .page-shell__main::-webkit-scrollbar {
    display: none;
  }

  .page-shell__frame--split .page-shell__aside {
    height: 100%;
    min-height: 0;
  }

  .page-shell__frame--split .page-shell__aside > * {
    height: 100%;
    min-height: 0;
    flex: 1 1 0;
  }
}

.place-strip-wrap {
  display: flex;
  height: 16.75rem;
  min-height: 10.5rem;
  min-width: 0;
  width: 100%;
  flex-shrink: 0;
}

.place-strip {
  display: grid;
  height: 100%;
  min-height: 0;
  min-width: 0;
  width: 100%;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.place-strip > li {
  position: relative;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

@container page-main (min-width: 32rem) {
  .place-strip-wrap {
    height: clamp(10.5rem, 16cqi, 11.5rem);
  }

  .place-strip {
    display: flex;
  }

  .place-strip > li {
    flex: 1 1 0%;
  }

  .place-strip > li[data-active="true"] {
    flex: 2.2 1 0%;
  }
}

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

