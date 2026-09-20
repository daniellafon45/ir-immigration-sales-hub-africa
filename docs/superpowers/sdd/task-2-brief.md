# Task 2 brief — Wire themed gallery and hero into Canada Live pages

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
- `heroPlace` is a free French overlay string (no longer limited to Banff|Québec|Toronto|Montréal). Type it as `string`.
- Do not change Profile's `HoverRevealCards items={canadaPlacesFor()}`.
- Do not change Canada Live copy except `heroPlace` values specified below.
- No em-dashes in new user-facing strings.

## Task 2: Wire themed gallery and hero into Canada Live pages

**Files:**
- Modify: `src/data/canada-live.ts`
- Modify: `src/features/canada.tsx`
- Test: `src/data/canada-live.test.ts`

**Interfaces:**
- Consumes: `canadaLiveGallery` and `canadaLiveHero` from `@/data/canada-live-media` (Task 1, already implemented and reviewed).
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

Do not change Profile. Do not change Canada Live coaching/copy except heroPlace.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/data/canada-live.test.ts src/data/canada-live-media.test.ts`

Expected: PASS.

Also run: `npm test`

Expected: full suite PASS.

- [ ] **Step 5: Commit**

Skip. Global constraint: do not run git, do not commit.
