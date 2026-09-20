# Task 5 brief — Menu Visite (Canada Live + pastilles) — Pitch intact

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-visite-closing-lens.md`
**Spec:** `docs/superpowers/specs/2026-09-19-visite-closing-lens.md`

## Where this fits

Profile fields, `visitCost`, Voies cards, and most menu recadrage in `market.tsx` already ship (WorkBenefits hidden, budget visit cards, jobs/salaries copy, provinces lead). This task adds the **Canada Live visit overlay** and leftover pills. Pitch stays untouched.

## Constraints

- Project folder: `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`
- No git. No commits. Do not touch `C:/Users/Admin/.git`
- English identifiers. French UI apostrophe U+2019
- Do **not** edit `src/data/pitch.ts` or `src/features/pitch.tsx`
- Do **not** implement Travail / Affaires / Regroupement overlays even if `canada-live.test.ts` also asserts them — those belong to another plan
- Do not change slide counts
- Do not touch layout-responsive files
- `s.draft` is already what these screens read
- Follow existing `studyOverlays` + `canadaLivePagesFor` pattern

## TDD

The visit test already exists and should fail until you overlay Visite:

`src/data/canada-live.test.ts` → `overlays visit pages with stay-only framing instead of work rights`

RED then GREEN (visit assertions must pass; ignore other-objective overlay failures in the same file):

```
npx vitest run src/data/canada-live.test.ts src/features/market.test.ts src/features/immigration.test.ts src/features/pitch.test.ts src/lib/visit-cost.test.ts
```

## Implementation

### 1. `canadaLivePagesFor` — Visite only

Today: `if (profile.objective !== "Études") return canadaLivePages`.

Keep Études branch. Add a Visite branch with `visitOverlays` (4 pages). RP / default objective must still return **the same array identity** as `canadaLivePages`.

Visit test contract (must pass):

```
pages.length === 4
pages[0].title matches /visite|séjour/i
pages[0].stats some visa|eTA
pages[2].lead contains "pas un droit de travailler"
pages[3].pills contains visitPurposeById("business").name  // "Voyage d’affaires"
JSON.stringify(pages) has no "—" and no "–"
```

Suggested themes (order-of-magnitude demo, septembre 2026 spirit, no invented refusal rates):

| page | theme |
|---|---|
| vue | visas / eTA / délais visite |
| demographie | séjour temporaire, attaches au pays |
| emploi | **pas un droit de travailler** (required in lead) |
| pont | motif du dossier + attaches ; inject purpose name when set |

Reuse IRCC visit delay already in `ircc-times` (2-22 semaines) as order of magnitude. 4 stats per overlaid page. `CanadaLivePage` shape unchanged.

### 2. Comparateur

`CompareSection` / `CompareScenarios` currently omit `closingDeckPills`. Add `...closingDeckPills(profile)` so a chosen visit purpose appears as a pill. `closingDeckPills` already lives in `src/lib/closing-pills.ts` — do not duplicate.

### 3. Emplois / Salaires / Provinces (only if missing)

- Jobs and Salaries copy already contains `pas un droit de travailler`. Also add a **pill** with the exact string `Pas un droit de travailler` when `objective === "Visite"` (both jobs slides and salaries slides).
- Provinces: if objective Visite, include a Visite pill (e.g. `profile.objective`) without breaking existing lead `ce que coûte un mois sur place, pas une installation`.

Do not remove the 2 jobs or 2 salaries slides. Do not render `WorkBenefitsSection` for Visite (already gated). Do not switch visit salary tracks to `accompanying` / `openWork`.

## Report

Write the full report to `docs/superpowers/sdd/visite-task-5-report.md`.

Then return ONLY:
- Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- Commits: SKIPPED_COMMIT
- One-line test summary (name which visit tests passed; mention leftover other-objective failures without “fixing” them)
- Concerns, if any
- Report file path
