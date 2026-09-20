# Vrais logos IR Immigration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enregistrer les 3 fichiers PNG officiels fournis par le client dans `src/assets/logos/` et les afficher tels quels dans l’application, à la place du SVG approximatif.

**Architecture:** Les 3 variantes officielles (bleu, blanc, noir) sont copiées byte-for-byte dans un dossier `logos`. `BrandLogo` importe exclusivement le lockup bleu officiel. Le favicon pointe vers la même image.

**Tech Stack:** React 19, Vite 7, Vitest 3, TypeScript.

## Global Constraints

- Copier les PNG officiels **byte-for-byte**. Interdit : recréer un SVG, upscaler, recadrer, retracer, ou réutiliser `src/assets/brand/logo-ir.svg`.
- Dossier canonique : `src/assets/logos/` avec exactement ces noms : `logo-ir-bleu.png`, `logo-ir-blanc.png`, `logo-ir-noir.png`.
- `BrandLogo` doit importer `@/assets/logos/logo-ir-bleu.png`.
- Favicon : `public/logo-ir.png` est une copie de `logo-ir-bleu.png`.
- Ne pas créer de commit git.
- Ne pas installer de nouvelles dépendances.
- Réponses et commentaires en français si besoin ; le code reste en anglais.

---

### Task 1: Enregistrer et brancher les 3 logos officiels

**Files:**
- Create: `src/assets/logos/logo-ir-bleu.png`
- Create: `src/assets/logos/logo-ir-blanc.png`
- Create: `src/assets/logos/logo-ir-noir.png`
- Create: `src/assets/logos/logos.test.ts`
- Create: `src/components/brand/BrandLogo.test.tsx`
- Modify: `src/components/brand/BrandLogo.tsx`
- Modify: `public/logo-ir.png`
- Delete usage of: `src/assets/brand/logo-ir.svg`

**Interfaces:**
- Consumes: les 3 fichiers source listés ci-dessous
- Produces: `BrandLogo` rend `<img src={logoIrBleu} alt="IR Immigration Intégration" />` où `logoIrBleu` est l’import Vite de `src/assets/logos/logo-ir-bleu.png`

**Source files (chemins exacts, copie Node `fs.copyFileSync` uniquement) :**

```
ASSETS = C:/Users/Admin/.cursor/projects/c-Users-Admin-Documents-Projets-Projets-Vibe-coding-IR-Immigration-Sale-plateforme/assets

bleu  = ASSETS/c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_logo_Ir_immigration-037e95ac-7952-4627-9d82-5289c51f64c4.png
blanc = ASSETS/c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_Logos_IR_immigration_blanc-9c680c19-810b-4141-a49c-72df7d915700.png
noir  = ASSETS/c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_logo_IR_Immigration_noir-276ed43b-ecab-4b56-9a31-3475c3fc781e.png
```

- [ ] **Step 1: Write the failing tests**

Create `src/assets/logos/logos.test.ts`:

```ts
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const logosDir = dirname(fileURLToPath(import.meta.url));
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const files = ["logo-ir-bleu.png", "logo-ir-blanc.png", "logo-ir-noir.png"] as const;

describe("official IR logos", () => {
  it.each(files)("stores %s as a real PNG", (name) => {
    const path = resolve(logosDir, name);
    expect(existsSync(path)).toBe(true);
    const buf = readFileSync(path);
    expect(buf.subarray(0, 8).equals(PNG_MAGIC)).toBe(true);
    expect(buf.byteLength).toBeGreaterThan(8_000);
  });
});
```

Create `src/components/brand/BrandLogo.test.tsx`:

```tsx
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "./BrandLogo";

describe("BrandLogo", () => {
  it("imports the official blue lockup PNG instead of the SVG approximation", () => {
    const source = readFileSync(fileURLToPath(new URL("./BrandLogo.tsx", import.meta.url)), "utf8");
    expect(source).toContain("@/assets/logos/logo-ir-bleu.png");
    expect(source).not.toContain("logo-ir.svg");
  });

  it("renders an img with the IR Immigration alt text", () => {
    const html = renderToStaticMarkup(<BrandLogo />);
    expect(html).toContain('alt="IR Immigration Intégration"');
    expect(html).toContain("<img");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/assets/logos/logos.test.ts src/components/brand/BrandLogo.test.tsx`

Expected: FAIL because `src/assets/logos/` n’existe pas encore et `BrandLogo` importe encore `logo-ir.svg`.

- [ ] **Step 3: Copy the three official PNGs, then update BrandLogo**

From the project root, copy with Node (do not open/re-encode the images):

```js
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const assets = "C:/Users/Admin/.cursor/projects/c-Users-Admin-Documents-Projets-Projets-Vibe-coding-IR-Immigration-Sale-plateforme/assets";
const root = "c:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme";
const dest = resolve(root, "src/assets/logos");
mkdirSync(dest, { recursive: true });

const map = {
  "logo-ir-bleu.png": "c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_logo_Ir_immigration-037e95ac-7952-4627-9d82-5289c51f64c4.png",
  "logo-ir-blanc.png": "c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_Logos_IR_immigration_blanc-9c680c19-810b-4141-a49c-72df7d915700.png",
  "logo-ir-noir.png": "c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_33ecf6ba15cff701238c64ae6a56a1a9_images_logo_IR_Immigration_noir-276ed43b-ecab-4b56-9a31-3475c3fc781e.png",
};

for (const [name, source] of Object.entries(map)) {
  copyFileSync(resolve(assets, source), resolve(dest, name));
}
copyFileSync(resolve(dest, "logo-ir-bleu.png"), resolve(root, "public/logo-ir.png"));
```

Replace `src/components/brand/BrandLogo.tsx` with:

```tsx
import { cn } from "@/lib/utils";
import logoIrBleu from "@/assets/logos/logo-ir-bleu.png";

export function BrandLogo({
  className,
  alt = "IR Immigration Intégration",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logoIrBleu}
      alt={alt}
      className={cn("shrink-0 overflow-hidden object-cover", className)}
    />
  );
}

export function ModuleLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <BrandLogo
      className={cn(
        "pointer-events-none absolute top-4 right-4 z-10 size-[4.25rem] rounded-[1.05rem] shadow-[0_10px_24px_rgba(0,48,95,.18)] sm:top-6 sm:right-7 sm:size-[4.75rem]",
        inverted && "ring-2 ring-white/25",
        className,
      )}
    />
  );
}
```

Leave `index.html` favicon as `/logo-ir.png` if it already points there.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/assets/logos/logos.test.ts src/components/brand/BrandLogo.test.tsx`

Expected: PASS (2 files, 5 tests : 3 PNG + 2 BrandLogo).

Then run: `npx vitest run`

Expected: full suite PASS.

- [ ] **Step 5: Do not commit**

Do not run `git commit`. Report files changed only.
