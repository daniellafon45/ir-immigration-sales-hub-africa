# Closing Task 5 Report

## What I implemented

- Added `NocSearchField` in `src/features/noc-search-field.tsx` with:
  - placeholder `Titre d’emploi ou code CNP`
  - `searchNoc(query, 8)` from 2 characters
  - dropdown rows showing `CNP <code> · FEER <teer> · <title>`
  - `Enter` selects the first result
  - `Escape` closes the list
  - selected pill + clear button calling `onChange("")`
  - non-binding suggestion from `suggestionCode`

- Extended `src/features/profile.tsx` so only the applicant `PersonCard` receives objective-specific fields:
  - `Travail`: `NocSearchField`, permit chips from `workPermits`, `Offre d’emploi`
  - `Visite`: purpose chips from `visitPurposes`, duration chips
  - `Affaires`: path chips from `businessPaths`
  - `Regroupement familial`: `familyLink`, `sponsorStatus`, plus reminder copy for missing spouse/child

- Extended `src/features/immigration.tsx` with closing card blocks for:
  - `work` via `workCost(profile)` and `workPathways(profile)`
  - `visit` via `visitCost(profile)`
  - `business` via `businessCost(profile)`
  - `family` via `familyCost(profile)`

- Kept:
  - `StudyClosingCards` behavior intact
  - `sections` Voies `slideCount` at 2
  - legal line `Aperçu de démonstration. Pas un avis juridique.`

## TDD Evidence

### RED

Command run:

```bash
npx vitest run src/features/profile.test.ts src/features/immigration.test.ts
```

Reason for command shape:
- `src/features/noc-search-field.test.ts` was not added, so the optional third path was skipped as allowed by the brief.

Observed output:

```text
❯ src/features/profile.test.ts (21 tests | 4 failed)
× closing profile objective fields > shows work profile controls only for the applicant on Travail
× closing profile objective fields > shows visit profile controls only on Visite
× closing profile objective fields > shows business path chips on Affaires without a selectable startup path
× closing profile objective fields > shows family sponsorship controls and reminders only on Regroupement familial

❯ src/features/immigration.test.ts (16 tests | 4 failed)
× voies boards > embeds work permit closing cards with FEER and spouse gating
× voies boards > embeds visit closing cards with no-work copy and accompanying gating
× voies boards > embeds business closing cards with thresholds, pause copy and spouse gating
× voies boards > embeds family closing cards with four titles and a reminder state

Test Files  2 failed (2)
Tests  8 failed | 29 passed (37)
```

### GREEN

Command run:

```bash
npx vitest run src/features/profile.test.ts src/features/immigration.test.ts
```

Observed output:

```text
✓ src/features/profile.test.ts (21 tests)
✓ src/features/immigration.test.ts (16 tests)

Test Files  2 passed (2)
Tests  37 passed (37)
```

Final verification rerun after last label adjustments:

```text
✓ src/features/profile.test.ts (21 tests)
✓ src/features/immigration.test.ts (16 tests)

Test Files  2 passed (2)
Tests  37 passed (37)
```

## Files changed

- `src/features/noc-search-field.tsx`
- `src/features/profile.tsx`
- `src/features/immigration.tsx`
- `src/features/profile.test.ts`
- `src/features/immigration.test.ts`
- `docs/superpowers/sdd/closing-task-5-profile-voies-report.md`

## Self-review / concerns

- Focused TDD was followed: tests were added first, run red, then implementation was added until green.
- IDE diagnostics were checked with `ReadLints`; no linter errors were reported on edited files.
- I did not add `src/features/noc-search-field.test.ts`; `NocSearchField` behavior is currently covered indirectly by source-string expectations plus implementation review, not by a dedicated interaction test.
  
## Fix implemented (important findings)

TDD RED
- Command run:

```bash
npx vitest run src/features/immigration.test.ts
```

- Observed output: test run failed (exit code 1) after adding targeted assertions for:
  - absence of `?? pathways.permits[0]` and presence of the neutral prompt
  - absence of the hardcoded `"14-20 mois"` / `"environ 36 mois"` and use of `cost.delay.tracks` labels

GREEN
- Command run:

```bash
npx vitest run src/features/immigration.test.ts --reporter verbose
```

- Observed output (success excerpt):

```text
 RUN  v3.2.7 C:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme

 ✓ src/features/immigration.test.ts > voies catalog > keeps two pathway slides 1ms
 ✓ src/features/immigration.test.ts > voies chrome > reuses the profil client shell on RoutesSection 0ms
 ✓ src/features/immigration.test.ts > voies chrome > keeps coaching copy out of Routes helpers 0ms
 ✓ src/features/immigration.test.ts > voies boards > renders overview and a detail view 0ms
 ✓ src/features/immigration.test.ts > voies boards > embeds study tuition, funds, outcomes and a spouse card only when a partner is on file 0ms
 ✓ src/features/immigration.test.ts > voies boards > embeds work permit closing cards with FEER and spouse gating 0ms
 ✓ src/features/immigration.test.ts > voies boards > embeds visit closing cards with no-work copy and accompanying gating 0ms
 ✓ src/features/immigration.test.ts > voies boards > embeds business closing cards with thresholds, pause copy and spouse gating 0ms
 ✓ src/features/immigration.test.ts > voies boards > embeds family closing cards with four titles and a reminder state 0ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
```

Files changed for this fix:
- `src/features/immigration.test.ts` (added assertions enforcing the two Important findings)
- `src/features/immigration.tsx` (neutral prompt for work permits; family delays read by label from `cost.delay.tracks`)

Commands used:
- `npx vitest run src/features/immigration.test.ts`
- `npx vitest run src/features/immigration.test.ts --reporter verbose`

Output files appended: none (report updated in-place)
