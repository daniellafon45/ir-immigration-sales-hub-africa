# Open Sans + lisibilité sidebar demandeur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre les textes de la carte « Demandeur principal » lisibles en passant l’app sur Open Sans et en augmentant un peu la taille (et le contraste) de la typographie de cette sidebar.

**Architecture:** La police app est centralisée dans `src/index.css` via `--font-sans` (aujourd’hui Inter). On la remplace par Open Sans (Google Fonts, mêmes graisses). Les tailles trop petites et les opacités `white/55`–`white/70` vivent dans `PrincipalPanel` et ses helpers (`PanelBlock`, `FactRow`, `ScoreBar`, `ScorePick`) : on les remonte d’environ 2px et on passe les textes secondaires à `white/80`–`white/85`.

**Tech Stack:** React 19, Tailwind CSS 4, Google Fonts Open Sans, Vitest source-inspection tests (même pattern que `src/features/profile.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- Font family change is global via `--font-sans` only. Do not add extra `font-family` rules on individual components.
- Use Open Sans exactly: Google Fonts import `family=Open+Sans:wght@400;500;600;700` and `--font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;`.
- Remove the Inter import. Do not keep Inter as a fallback.
- Sidebar type bump is +2px on the small/muted texts of `PrincipalPanel`, `PanelBlock`, `FactRow`, `ScoreBar`, and `ScorePick` name. Do not change the 24px first-name heading.
- Raise muted white opacities on that sidebar: `/55` and `/70` labels become `/80` and `/85` as specified in Task 2. Do not change form-field labels elsewhere (`LanguagePicks`, `NumberField`, etc.).
- Do not restyle `Chip` (shared with Objectif / Destination).
- Do not change layout, spacing, colors of the blue gradient, or the Enregistrer button.
- Follow existing `profile.test.ts` / file-read tests (`extractFunction` or `readFileSync`), not a new RTL suite.
- User-facing language stays French. Code and test names stay in the existing English style.

---

### Task 1: Switch the app sans font to Open Sans

**Files:**
- Modify: `src/index.css` (Google Fonts `@import` on line 1, `--font-sans` on line 6)
- Test: `src/index.css.test.ts` (create)

**Interfaces:**
- Consumes: Tailwind `@theme inline` `--font-sans` already applied by `body { font-family: var(--font-sans); }`
- Produces: `--font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;` with Open Sans loaded from Google Fonts weights 400, 500, 600, 700.

- [ ] **Step 1: Write the failing test**

Create `src/index.css.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/index.css.test.ts`

Expected: FAIL because `src/index.css` still imports Inter and sets `--font-sans: "Inter", ...`.

- [ ] **Step 3: Write minimal implementation**

In `src/index.css`, replace the first line:

```css
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap");
```

Replace the `--font-sans` declaration inside `@theme inline`:

```css
  --font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;
```

Leave every other token, keyframe, and `body { font-family: var(--font-sans); }` unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/index.css.test.ts`

Expected: PASS (2 tests).

Then run: `npm test`

Expected: all existing tests still pass.

- [ ] **Step 5: Do not commit**

Per Global Constraints: do not run git. Write the report file only.

---

### Task 2: Bump PrincipalPanel type size and contrast

**Files:**
- Modify: `src/features/profile.test.ts`
- Modify: `src/features/profile.tsx` (`PrincipalPanel` ~351-469, `PanelBlock` ~473-479, `FactRow` ~482-488, `ScoreBar` ~491-503, `ScorePick` name ~622)

**Interfaces:**
- Consumes: existing `PrincipalPanel`, `PanelBlock`, `FactRow`, `ScoreBar`, `ScorePick`
- Produces: the class strings listed in Step 3, verbatim. First-name heading stays `text-[24px]`. `Chip` unchanged.

- [ ] **Step 1: Write the failing tests**

Append to `src/features/profile.test.ts`:

```ts
describe("principal panel readability", () => {
  it("uses larger, higher-contrast type on PrincipalPanel copy", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain(
      'text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase',
    );
    expect(panel).toContain("text-[24px] leading-none font-semibold tracking-tight");
    expect(panel).toContain("mt-1 text-[14px] text-white/85");
    expect(panel).toContain("mt-3 shrink-0 text-[14px] leading-snug text-white/90");
    expect(panel).toContain("text-[14px] leading-relaxed text-white/85");
    expect(panel).toContain("pt-0.5 text-[14px] font-semibold text-white");
    expect(panel).toContain("pt-0.5 text-[14px] text-white/85");
  });

  it("uses larger, higher-contrast type on PanelBlock, FactRow, ScoreBar, and ScorePick", () => {
    expect(extractFunction("PanelBlock")).toContain(
      'text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase',
    );
    expect(extractFunction("FactRow")).toContain("shrink-0 text-[13px] text-white/80");
    expect(extractFunction("FactRow")).toContain("text-right text-[14px] leading-tight font-medium");
    expect(extractFunction("ScoreBar")).toContain(
      "mb-0.5 flex items-center justify-between text-[12px] text-white/80",
    );
    expect(extractFunction("ScorePick")).toContain(
      "mt-1 block w-full truncate text-[13px] tracking-wide uppercase opacity-75",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/profile.test.ts`

Expected: FAIL because the sidebar still uses `text-[10px]` / `text-[11px]` / `text-[12px]` and `text-white/55`–`text-white/70`.

- [ ] **Step 3: Write minimal implementation**

In `PrincipalPanel`, replace these class strings only:

1. Eyebrow « Demandeur principal »:
   - from `text-[10px] font-semibold tracking-[0.16em] text-white/70 uppercase`
   - to `text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase`

2. Family line under the first name:
   - from `mt-1 text-[12px] text-white/70`
   - to `mt-1 text-[14px] text-white/85`

3. Primary reason:
   - from `mt-3 shrink-0 text-[12px] leading-snug text-white/80`
   - to `mt-3 shrink-0 text-[14px] leading-snug text-white/90`

4. Extra reasons:
   - from `text-[12px] leading-relaxed text-white/70`
   - to `text-[14px] leading-relaxed text-white/85`

5. Salary lift:
   - from `pt-0.5 text-[12px] font-semibold text-white`
   - to `pt-0.5 text-[14px] font-semibold text-white`

6. Salary already-on-target:
   - from `pt-0.5 text-[12px] text-white/70`
   - to `pt-0.5 text-[14px] text-white/85`

Leave the first-name heading as `text-[24px] leading-none font-semibold tracking-tight`.

In `PanelBlock` title:

- from `text-[10px] font-semibold tracking-[0.14em] text-white/55 uppercase`
- to `text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase`

In `FactRow`:

- label: `shrink-0 text-[11px] text-white/55` → `shrink-0 text-[13px] text-white/80`
- value: `text-right text-[12px] leading-tight font-medium` → `text-right text-[14px] leading-tight font-medium`

In `ScoreBar` label row:

- from `mb-0.5 flex items-center justify-between text-[10px] text-white/65`
- to `mb-0.5 flex items-center justify-between text-[12px] text-white/80`

In `ScorePick` name:

- from `mt-1 block w-full truncate text-[11px] tracking-wide uppercase opacity-75`
- to `mt-1 block w-full truncate text-[13px] tracking-wide uppercase opacity-75`

Do not change `ScorePick` score `text-[15px]`, `Chip`, layout, or other sections of `profile.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/profile.test.ts`

Expected: PASS, including the new `principal panel readability` tests.

Then run: `npm test`

Expected: all tests pass.

- [ ] **Step 5: Do not commit**

Per Global Constraints: do not run git. Write the report file only.
