# Official IR Immigration Logos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fake SVG mark with the three official IR Immigration PNG lockups supplied by the user, saved as brand assets and rendered in the app.

**Architecture:** Copy the three user PNG files byte-for-byte into `src/assets/brand/` and `public/`. `BrandLogo` renders the blue lockup by default and the white lockup when inverted. No SVG recreation, tracing, upscale, or AI redraw.

**Tech Stack:** React 19, Vite 7, Vitest, TypeScript.

## Global Constraints

- Use the user-supplied PNG files **byte-for-byte**. Do not recreate, trace, vectorize, crop, upscale, or generate a substitute logo.
- Default visible logo is the **blue** official lockup (maple leaf + outlined IR + IMMIGRATION / INTÉGRATION on blue).
- `inverted` uses the **blanc** official lockup (white IR on black).
- The **noir** official lockup is saved as a brand asset even if unused in the default UI.
- Delete `src/assets/brand/logo-ir.svg` (fake “IR” square).
- Do **not** create a git commit.

## File map

- `src/assets/brand/logo-ir.png` — official blue lockup (from `logo_Ir_immigration-037e95ac-7952-4627-9d82-5289c51f64c4.png`)
- `src/assets/brand/logo-ir-blanc.png` — official white lockup (from `Logos_IR_immigration_blanc-9c680c19-810b-4141-a49c-72df7d915700.png`)
- `src/assets/brand/logo-ir-noir.png` — official black lockup (from `logo_IR_Immigration_noir-276ed43b-ecab-4b56-9a31-3475c3fc781e.png`)
- `public/logo-ir.png` — same bytes as the blue lockup (favicon)
- `src/components/brand/BrandLogo.tsx` — render PNG, not SVG
- `src/components/brand/BrandLogo.test.ts` — files are real PNGs and BrandLogo imports PNG

## Source files (Cursor assets)

Directory: `C:/Users/Admin/.cursor/projects/c-Users-Admin-Documents-Projets-Projets-Vibe-coding-IR-Immigration-Sale-plateforme/assets`

- Blue: `c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_logo_Ir_immigration-037e95ac-7952-4627-9d82-5289c51f64c4.png` (22650 bytes)
- Blanc: `c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_Logos_IR_immigration_blanc-9c680c19-810b-4141-a49c-72df7d915700.png` (22453 bytes)
- Noir: `c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_logo_IR_Immigration_noir-276ed43b-ecab-4b56-9a31-3475c3fc781e.png` (18939 bytes)

Copy with Node `fs.copyFileSync` from that directory (Windows long paths). Do not open/re-encode with Pillow or sharp.

---

## Task 1: Save official PNGs and wire BrandLogo

**Files:**
- Create: `src/assets/brand/logo-ir.png`
- Create: `src/assets/brand/logo-ir-blanc.png`
- Create: `src/assets/brand/logo-ir-noir.png`
- Create: `public/logo-ir.png`
- Create: `src/components/brand/BrandLogo.test.ts`
- Modify: `src/components/brand/BrandLogo.tsx`
- Delete: `src/assets/brand/logo-ir.svg`

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const brandDir = join(dirname(fileURLToPath(import.meta.url)), "../../assets/brand");
const publicLogo = join(dirname(fileURLToPath(import.meta.url)), "../../..", "public/logo-ir.png");

describe("official IR logos", () => {
  it.each(["logo-ir.png", "logo-ir-blanc.png", "logo-ir-noir.png"])(
    "ships %s as a real PNG",
    (file) => {
      const bytes = readFileSync(join(brandDir, file));
      expect(bytes.subarray(0, 8)).toEqual(pngMagic);
    },
  );

  it("uses the blue lockup as favicon source", () => {
    const brand = readFileSync(join(brandDir, "logo-ir.png"));
    const favicon = readFileSync(publicLogo);
    expect(favicon).toEqual(brand);
  });

  it("BrandLogo imports the official PNG lockup, not the fake SVG", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "BrandLogo.tsx"),
      "utf8",
    );
    expect(source).toContain("@/assets/brand/logo-ir.png");
    expect(source).toContain("@/assets/brand/logo-ir-blanc.png");
    expect(source).not.toContain("logo-ir.svg");
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/components/brand/BrandLogo.test.ts`

Expected: FAIL because the PNG files are missing and BrandLogo still imports `logo-ir.svg`.

- [ ] **Step 3: Copy the three official PNGs byte-for-byte**

From the Cursor assets directory listed above, copy:

| Source filename contains | Destination |
|---|---|
| `logo_Ir_immigration-037e95ac` | `src/assets/brand/logo-ir.png` AND `public/logo-ir.png` |
| `Logos_IR_immigration_blanc-9c680c19` | `src/assets/brand/logo-ir-blanc.png` |
| `logo_IR_Immigration_noir-276ed43b` | `src/assets/brand/logo-ir-noir.png` |

Verify copied sizes stay 22650 / 22453 / 18939 bytes.

- [ ] **Step 4: Update BrandLogo to render the official PNGs**

```tsx
import { cn } from "@/lib/utils";
import logoIr from "@/assets/brand/logo-ir.png";
import logoIrBlanc from "@/assets/brand/logo-ir-blanc.png";

export function BrandLogo({
  className,
  alt = "IR Immigration Intégration",
  inverted = false,
}: {
  className?: string;
  alt?: string;
  inverted?: boolean;
}) {
  return (
    <img
      src={inverted ? logoIrBlanc : logoIr}
      alt={alt}
      className={cn("shrink-0 overflow-hidden object-cover", className)}
    />
  );
}

export function ModuleLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <BrandLogo
      inverted={inverted}
      className={cn(
        "pointer-events-none absolute top-4 right-4 z-10 size-[4.25rem] rounded-[1.05rem] shadow-[0_10px_24px_rgba(0,48,95,.18)] sm:top-6 sm:right-7 sm:size-[4.75rem]",
        inverted && "ring-2 ring-white/25",
        className,
      )}
    />
  );
}
```

- [ ] **Step 5: Delete `src/assets/brand/logo-ir.svg`**

- [ ] **Step 6: Re-run the test and make sure it passes**

Run: `npx vitest run src/components/brand/BrandLogo.test.ts`

Then run: `npx vitest run`

- [ ] **Step 7: Do not commit**
