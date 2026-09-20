# Task 1 report — Local themed rasters + gallery helper

Status: DONE

Project: IR_Immigration_Sale_plateforme
Task brief: docs/superpowers/sdd/task-1-brief.md
Fix brief: docs/superpowers/sdd/task-1-fix-brief.md

## What was implemented

- `src/data/canada-live-media.ts` with `canadaLiveGallery` and `canadaLiveHero`.
- 15 unique local jpegs in `src/assets/canada-live/`.
- Tests in `src/data/canada-live-media.test.ts` including uniqueness (SHA256).
- Extra fetch scripts were removed.

`vue` still delegates to `canadaPlacesFor()`. emploi / demographie / pont return themed CardItems. Heroes: Marché du travail / Relève / Votre projet.

## TDD

RED: module missing (`Failed to resolve import "@/data/canada-live-media"`).
GREEN after helper + rasters.

Uniqueness RED was implied by four duplicate files (same 155776-byte doctor crop reused as emploi-sante, demo-hero, demo-aines; pont-ville copied pont-hero). After re-download: 15 unique hashes.

Final: `npm test -- src/data/canada-live-media.test.ts` — **20/20 passed**.

## Replacement URLs that succeeded

- emploi-sante.jpg: photo-1559839734-2b71ea197ec2 (médecin en blouse)
- demo-aines.jpg: photo-1566616213894-2d4e1baee5d8 (portrait aînée)
- demo-hero.jpg: photo-1756048997762-154abc8b8207 (aînée au déambulateur)
- pont-ville.jpg: photo-1517935706615-2717063c2225 (Toronto)

## Files

- Added: `src/data/canada-live-media.ts`
- Added: `src/data/canada-live-media.test.ts`
- Added: `src/assets/canada-live/*.jpg` (15 unique rasters)
- Did not modify `canada.tsx` or `canada-live.ts` (Task 2)
- No git / no commit

## Concerns

None remaining. Images are unique and themed. Task 2 must wire `page.gallery` in the UI.
