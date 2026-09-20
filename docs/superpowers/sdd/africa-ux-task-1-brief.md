# Task 1 Brief — Données journeySteps items Préparation

Read full requirements from plan Task 1 in:
`docs/superpowers/plans/2026-09-19-africa-prepare-opportunities-ux.md`

## Exact deliverables

1. Extend `JourneyStep` with optional `items?: string[]` in `src/data/ecosystem.ts`
2. Update `prepare` step:
   - body: `Langue, emploi et preuves — avant le dépôt.`
   - items (exactly these 4 strings):
     - `Test de français (TEF / TCF)`
     - `CV & positionnement emploi`
     - `Documents & preuves`
     - `Calendrier cohérent`
3. Keep ids: diagnostic, strategy, prepare, file, settle
4. TDD in `src/data/africa-funnel.test.ts` as specified in the plan
5. Commit only: ecosystem.ts, africa-funnel.test.ts, ecosystem.test.ts (if touched)

## Global Constraints

- Exactement 4 items sur prepare with the strings above
- No employment "garanti"
- Commit only feature files
