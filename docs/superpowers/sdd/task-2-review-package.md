# Review package — Task 2 wire Canada Live galleries

No git. In-place workspace.

## Files in scope

- src/data/canada-live.ts — heroPlace: string; gallery: CardItem[]; canadaLiveHero/Gallery per page
- src/features/canada.tsx — HoverRevealCards items={page.gallery}; no canadaPlacesFor
- src/data/canada-live.test.ts — gallery length, themed titles, layout test

## Out of scope Extra (controller note)

- src/features/market.tsx — foyerLabel extract in MarketPanel to satisfy a pre-existing string test. Not requested by Task 2.

## Tests claimed

- npm test -- src/data/canada-live.test.ts src/data/canada-live-media.test.ts → 30/30
- npm test → 131/131

## canada.tsx (relevant)

CanadaLiveView uses page.heroImage, page.heroPlace, HoverRevealCards items={page.gallery}.
Profile is not in this file.

## canada-live.ts (relevant)

Each of vue / demographie / emploi / pont sets:
heroPlace: canadaLiveHero(id).place
heroImage: canadaLiveHero(id).image
gallery: canadaLiveGallery(id)

heroPlace typed as string.
No canadaPlacesFor import.
No heroImageFor.

Read those three files for the full diff view. Do not treat market.tsx as in-scope unless judging Extra.
