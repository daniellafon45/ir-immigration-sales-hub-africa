# Closing lenses (Travail / Visite / Affaires / Regroupement)

> Études is already shipped. Tasks 1–4 are independent new-file data layers (parallel-safe). Tasks 5+ integrate UI sequentially.

**Goal:** Helpers + IRCC-sourced catalogs so each objective can close with real FEER / fonds / capital / MNI numbers.

**Global constraints:**
- Workspace: `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`
- No git. No commits. Do not touch `C:/Users/Admin/.git`
- English code/tests. French UI strings use apostrophe U+2019
- Pitch unchanged. Do not edit `src/data/pitch.ts` or `src/features/pitch.tsx`
- Tasks 1–4: NEW files under `src/data/` and `src/lib/` (+ tests) only
- Do not edit `profile.ts`, `storage.ts`, `immigration.tsx`, `market.tsx`, `canada-live.ts`, `household-salaries.ts`, `profile.tsx`, `sales.tsx`, `canada.tsx`
- Profile fields already exist: `workNocCode`, `workPermitKind`, `workHasOffer`, `visitPurpose`, `visitDuration`, `businessPath`, `familyLink`, `sponsorStatus`
- TDD: failing test first, then minimal code. `npx vitest run <testfile>`
- Demo disclaimer later in UI; helpers still use sourced IRCC numbers with `sourceUrl` + `retrievedAt: "2026-09-19"`

---

### Task 1: Travail data — FEER search, permits, pathways, cost

### Task 2: Visite data — purpose, duration, fees, stay cost, funds

### Task 3: Affaires data — paths, provincial thresholds, capital

### Task 4: Regroupement data — links, LICO/MNI, fees, reunited household
