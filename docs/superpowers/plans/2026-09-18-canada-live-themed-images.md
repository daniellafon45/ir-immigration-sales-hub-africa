# Canada Live page-themed images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the same four tourism photos on every Canada Live page with a gallery (and hero) that matches the slide: landmarks on overview, care/family on demography, Canadian workers on employment, project/career on the closing bridge.

**Architecture:** Keep seasonal landmark photos for `vue` via existing `canadaPlacesFor()`. Add local rasters under `src/assets/canada-live/` and a helper `canadaLiveGallery(pageId)` that returns four `CardItem`s. Each `CanadaLivePage` gets `gallery` plus a theme-matching `heroImage` / `heroPlace`. `CanadaLiveView` renders `page.gallery` in `HoverRevealCards`. Profile stays on `canadaPlacesFor()`.

**Tech Stack:** React 19, Vite asset imports, Vitest file/source tests (same pattern as `canada-places.test.ts` and `canada-live.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- User-facing labels stay French. Code and test names stay English.
- Images must be local rasters (jpg/png), not Unsplash/Pexels URLs in the shipped app. Same rule as `canada-places.test.ts` (`not.toMatch(/unsplash/i)`).
- Each themed raster file must be a real jpeg/png larger than 20_000 bytes.
- Overview page `vue` keeps the four seasonal landmark cards from `canadaPlacesFor()`.
- Employment page must show workers (health, construction, office, trades), not Château Frontenac / Vieux-Port / Tour CN / Lac Moraine.
- Demography page must show aging / family / care / school scenes, not tourism landmarks.
- Bridge page `pont` must show career/project scenes (meeting, métier, city work, installation), not tourism landmarks.
- Hero photo on emploi / demographie / pont must match the page theme (not the Toronto/Québec/Montréal landmark files).
- `heroPlace` is a free French overlay string (no longer limited to Banff|Québec|Toronto|Montréal).
- Do not change Profile's `HoverRevealCards items={canadaPlacesFor()}`.
- Do not change Canada Live copy except `heroPlace` values specified below.
- No em-dashes in new user-facing strings.

---

### Task 1: Local themed rasters + gallery helper

**Files:**
- Create: `src/assets/canada-live/*.jpg` (15 files listed below)
- Create: `src/data/canada-live-media.ts`
- Test: `src/data/canada-live-media.test.ts`

**Interfaces:**
- Consumes: `CardItem` from `@/components/ui/cards`; `canadaPlacesFor` from `@/data/canada-places`
- Produces:
  - `export function canadaLiveGallery(pageId: string): CardItem[]`
  - `export function canadaLiveHero(pageId: string): { place: string; image: string }`
  - Four items per page. `vue` delegates to `canadaPlacesFor()`.

**Image files to download into `src/assets/canada-live/`** (PowerShell, from the project root). If a URL fails, retry once; do not ship an HTML error page (check jpeg magic `FF D8 FF` or png `89 50 4E 47`).

```
emploi-hero.jpg          https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80
emploi-sante.jpg         https://images.unsplash.com/photo-1579684385127-1acf24ce57ae?auto=format&fit=crop&w=1600&q=80
emploi-construction.jpg  https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80
emploi-bureau.jpg        https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80
emploi-metiers.jpg       https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80
demo-hero.jpg            https://images.unsplash.com/photo-1576763358540-2b9c5c0f0b0b?auto=format&fit=crop&w=1600&q=80
demo-aines.jpg           https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?auto=format&fit=crop&w=1600&q=80
demo-famille.jpg         https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80
demo-soins.jpg           https://images.unsplash.com/photo-1576091160550-112ba8d25d1f?auto=format&fit=crop&w=1600&q=80
demo-ecole.jpg           https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80
pont-hero.jpg            https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80
pont-metier.jpg          https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80
pont-ville.jpg           https://images.unsplash.com/photo-1486406149926-2dd9b5c2e8e3?auto=format&fit=crop&w=1600&q=80
pont-equipe.jpg          https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80
pont-installation.jpg    https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80
```

If `demo-hero.jpg` or `demo-soins.jpg` 404 (placeholder IDs), use instead:
- demo-hero: `https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?auto=format&fit=crop&w=1600&q=80` (same as aines is OK only as last resort; prefer `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80` only if nothing else works)
- demo-soins: `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80`

Download example:

```powershell
New-Item -ItemType Directory -Force -Path src/assets/canada-live | Out-Null
Invoke-WebRequest -Uri "URL" -OutFile "src/assets/canada-live/FILE.jpg" -UseBasicParsing
```

- [ ] **Step 1: Write the failing test**

Create `src/data/canada-live-media.test.ts`:

```ts
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canadaLiveGallery, canadaLiveHero } from "@/data/canada-live-media";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const mediaDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/canada-live");
const files = [
  "emploi-hero.jpg",
  "emploi-sante.jpg",
  "emploi-construction.jpg",
  "emploi-bureau.jpg",
  "emploi-metiers.jpg",
  "demo-hero.jpg",
  "demo-aines.jpg",
  "demo-famille.jpg",
  "demo-soins.jpg",
  "demo-ecole.jpg",
  "pont-hero.jpg",
  "pont-metier.jpg",
  "pont-ville.jpg",
  "pont-equipe.jpg",
  "pont-installation.jpg",
];

function isRaster(bytes: Buffer) {
  return bytes.subarray(0, 3).equals(jpegMagic) || bytes.subarray(0, 4).equals(pngMagic);
}

describe("canada live themed media", () => {
  it.each(files)("ships a local raster for %s", (file) => {
    const path = join(mediaDir, file);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(isRaster(bytes)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(20_000);
  });

  it("keeps landmark photos on the overview page", () => {
    const gallery = canadaLiveGallery("vue");
    expect(gallery.map((item) => item.title)).toEqual(["Québec", "Montréal", "Toronto", "Banff"]);
  });

  it("shows Canadian workers on the employment page", () => {
    const gallery = canadaLiveGallery("emploi");
    expect(gallery).toHaveLength(4);
    expect(gallery.map((item) => item.title)).toEqual(["Santé", "Construction", "Bureaux", "Métiers"]);
    expect(gallery.map((item) => item.subtitle)).toEqual([
      "Soins et recrutement",
      "Chantiers ouverts",
      "Services et TI",
      "Métiers en demande",
    ]);
    for (const item of gallery) {
      expect(item.imageUrl).not.toMatch(/unsplash/i);
      expect(item.imageUrl).toMatch(/emploi-(sante|construction|bureau|metiers)/i);
    }
    const hero = canadaLiveHero("emploi");
    expect(hero.place).toBe("Marché du travail");
    expect(hero.image).toMatch(/emploi-hero/i);
    expect(hero.image).not.toMatch(/toronto-/i);
  });

  it("shows care and family scenes on the demography page", () => {
    const gallery = canadaLiveGallery("demographie");
    expect(gallery.map((item) => item.title)).toEqual(["Aînés", "Famille", "Soins", "École"]);
    const hero = canadaLiveHero("demographie");
    expect(hero.place).toBe("Relève");
    expect(hero.image).toMatch(/demo-hero/i);
  });

  it("shows project and career scenes on the bridge page", () => {
    const gallery = canadaLiveGallery("pont");
    expect(gallery.map((item) => item.title)).toEqual(["Métier", "Ville", "Équipe", "Installation"]);
    const hero = canadaLiveHero("pont");
    expect(hero.place).toBe("Votre projet");
    expect(hero.image).toMatch(/pont-hero/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/canada-live-media.test.ts`

Expected: FAIL (module missing and/or files missing).

- [ ] **Step 3: Download images and write the helper**

Download the 15 rasters as specified. Then create `src/data/canada-live-media.ts`:

```ts
import type { CardItem } from "@/components/ui/cards";
import { canadaPlacesFor } from "@/data/canada-places";
import emploiHero from "@/assets/canada-live/emploi-hero.jpg";
import emploiSante from "@/assets/canada-live/emploi-sante.jpg";
import emploiConstruction from "@/assets/canada-live/emploi-construction.jpg";
import emploiBureau from "@/assets/canada-live/emploi-bureau.jpg";
import emploiMetiers from "@/assets/canada-live/emploi-metiers.jpg";
import demoHero from "@/assets/canada-live/demo-hero.jpg";
import demoAines from "@/assets/canada-live/demo-aines.jpg";
import demoFamille from "@/assets/canada-live/demo-famille.jpg";
import demoSoins from "@/assets/canada-live/demo-soins.jpg";
import demoEcole from "@/assets/canada-live/demo-ecole.jpg";
import pontHero from "@/assets/canada-live/pont-hero.jpg";
import pontMetier from "@/assets/canada-live/pont-metier.jpg";
import pontVille from "@/assets/canada-live/pont-ville.jpg";
import pontEquipe from "@/assets/canada-live/pont-equipe.jpg";
import pontInstallation from "@/assets/canada-live/pont-installation.jpg";

const emploiGallery: CardItem[] = [
  { id: 1, title: "Santé", subtitle: "Soins et recrutement", imageUrl: emploiSante },
  { id: 2, title: "Construction", subtitle: "Chantiers ouverts", imageUrl: emploiConstruction },
  { id: 3, title: "Bureaux", subtitle: "Services et TI", imageUrl: emploiBureau },
  { id: 4, title: "Métiers", subtitle: "Métiers en demande", imageUrl: emploiMetiers },
];

const demoGallery: CardItem[] = [
  { id: 1, title: "Aînés", subtitle: "Un pays qui vieillit", imageUrl: demoAines },
  { id: 2, title: "Famille", subtitle: "Moins de naissances", imageUrl: demoFamille },
  { id: 3, title: "Soins", subtitle: "Besoin de relais", imageUrl: demoSoins },
  { id: 4, title: "École", subtitle: "La relève à bâtir", imageUrl: demoEcole },
];

const pontGallery: CardItem[] = [
  { id: 1, title: "Métier", subtitle: "Partir du profil", imageUrl: pontMetier },
  { id: 2, title: "Ville", subtitle: "Choisir la province", imageUrl: pontVille },
  { id: 3, title: "Équipe", subtitle: "Un projet accompagné", imageUrl: pontEquipe },
  { id: 4, title: "Installation", subtitle: "Arriver prêt", imageUrl: pontInstallation },
];

export function canadaLiveGallery(pageId: string): CardItem[] {
  if (pageId === "emploi") return emploiGallery;
  if (pageId === "demographie") return demoGallery;
  if (pageId === "pont") return pontGallery;
  return canadaPlacesFor();
}

export function canadaLiveHero(pageId: string): { place: string; image: string } {
  if (pageId === "emploi") return { place: "Marché du travail", image: emploiHero };
  if (pageId === "demographie") return { place: "Relève", image: demoHero };
  if (pageId === "pont") return { place: "Votre projet", image: pontHero };
  const [first] = canadaPlacesFor();
  return { place: first?.title ?? "Canada", image: first?.imageUrl ?? "" };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/data/canada-live-media.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Skip. Global constraint: do not run git, do not commit.

---

### Task 2: Wire themed gallery and hero into Canada Live pages

**Files:**
- Modify: `src/data/canada-live.ts`
- Modify: `src/features/canada.tsx`
- Test: `src/data/canada-live.test.ts`

**Interfaces:**
- Consumes: `canadaLiveGallery` and `canadaLiveHero` from `@/data/canada-live-media`
- Produces: each `CanadaLivePage` has `gallery: CardItem[]`; `heroImage` / `heroPlace` come from `canadaLiveHero(page.id)`; UI uses `page.gallery`

- [ ] **Step 1: Write the failing test**

In `src/data/canada-live.test.ts`, add to the existing "gives each page..." loop:

```ts
      expect(page.gallery).toHaveLength(4);
```

Add this test inside `describe("Canada Live briefing pages")`:

```ts
  it("adapts hero and gallery photos to each Canada Live page", () => {
    const vue = canadaLivePages.find((page) => page.id === "vue");
    const jobs = canadaLivePages.find((page) => page.id === "emploi");
    const aging = canadaLivePages.find((page) => page.id === "demographie");
    const bridge = canadaLivePages.find((page) => page.id === "pont");
    expect(vue?.gallery.map((item) => item.title)).toEqual(["Québec", "Montréal", "Toronto", "Banff"]);
    expect(jobs?.heroPlace).toBe("Marché du travail");
    expect(jobs?.heroImage).toMatch(/emploi-hero/i);
    expect(jobs?.gallery.map((item) => item.title)).toEqual(["Santé", "Construction", "Bureaux", "Métiers"]);
    expect(aging?.heroPlace).toBe("Relève");
    expect(aging?.gallery.map((item) => item.title)).toEqual(["Aînés", "Famille", "Soins", "École"]);
    expect(bridge?.heroPlace).toBe("Votre projet");
    expect(bridge?.gallery.map((item) => item.title)).toEqual(["Métier", "Ville", "Équipe", "Installation"]);
  });
```

In `describe("Canada Live layout")`, change the shell test so it no longer requires `canadaPlacesFor` in `canada.tsx`, and add:

```ts
  it("renders the page gallery in the photo strip instead of a fixed landmark set", () => {
    expect(feature).toContain("HoverRevealCards");
    expect(feature).toContain("page.gallery");
    expect(feature).not.toContain("canadaPlacesFor()");
  });
```

Keep the existing "reuses the profil client shell" test but remove:

```ts
    expect(feature).toContain("canadaPlacesFor");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/canada-live.test.ts`

Expected: FAIL — pages have no `gallery`; `canada.tsx` still calls `canadaPlacesFor()`.

- [ ] **Step 3: Minimal implementation**

In `src/data/canada-live.ts`:

1. Add `import type { CardItem } from "@/components/ui/cards";`
2. Add `import { canadaLiveGallery, canadaLiveHero } from "@/data/canada-live-media";`
3. Remove `import { canadaPlacesFor } from "@/data/canada-places";` and remove `heroImageFor`.
4. Change type:

```ts
  heroPlace: string;
  heroImage: string;
  gallery: CardItem[];
```

5. For each page, after `id`, compute:

```ts
    ...canadaLiveHero(pageId fields inline)
```

Concrete per page (use the page `id` string):

```ts
    heroPlace: canadaLiveHero("vue").place,
    heroImage: canadaLiveHero("vue").image,
    gallery: canadaLiveGallery("vue"),
```

Same for `"demographie"`, `"emploi"`, `"pont"`. Delete the old `heroPlace: "Banff"` / `heroImage: heroImageFor("Toronto")` etc. Keep existing `heroCaption` strings unchanged.

In `src/features/canada.tsx`:

- Remove `import { canadaPlacesFor } from "@/data/canada-places";`
- Replace `<HoverRevealCards items={canadaPlacesFor()} />` with `<HoverRevealCards items={page.gallery} />`

- [ ] **Step 4: Run tests**

Run: `npm test -- src/data/canada-live.test.ts src/data/canada-live-media.test.ts`

Expected: PASS.

Also run: `npm test`

Expected: full suite PASS.

- [ ] **Step 5: Commit**

Skip. Global constraint: do not run git, do not commit.
