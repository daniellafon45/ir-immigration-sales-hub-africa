# Task 2 Report — SalariesSection chrome + commercial messages

## Scope

- Task 2 implemented in `src/features/market.tsx`
- Salaries tests updated in `src/features/market.test.ts`
- No git commands run
- `src/lib/household-salaries.ts` left unchanged

## TDD Evidence

### RED

1. Updated the appended salaries tests in `src/features/market.test.ts` to match the resolution:
   - no `JobsBriefingPanel`
   - no `panel=`
   - no `À retenir`
   - no `La question`
2. Ran:

```bash
npx vitest run src/features/market.test.ts
```

3. Observed expected failure before implementation:
   - `salaries chrome > reuses the profil client shell on SalariesSection`
   - `salaries chrome > keeps coaching copy out of SalariesSection and salaries chrome helpers`
   - `salaries household boards > renders salary bands and net cards per adult group`
4. Failure reason matched the missing implementation:
   - `householdSalaries` absent from `SalariesSection`
   - `SalariesBoard` absent
   - `SalariesBands` / `SalariesNet` helpers absent

### GREEN

1. Replaced only the salaries block in `src/features/market.tsx`:
   - `SalariesSection`
   - `SalariesBands`
   - `SalariesNet`
   - `SalariesBoard`
   - `SalariesNetBoard`
2. Added imports:
   - `import type { Profile } from "@/data/profile";`
   - `import { householdSalaries } from "@/lib/household-salaries";`
3. Removed unused old-salary imports after the rewrite:
   - `salaryData`
   - `netEstimate` / `salaryForProfession`
   - `pitchView`
4. Ran:

```bash
npx vitest run src/features/market.test.ts src/lib/household-salaries.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts
```

5. Result:
   - 4 test files passed
   - 28 tests passed
   - 0 failed

## What Changed

- Salaries now uses `OpportunitiesShell` like Jobs.
- Salary slides do not pass `panel=` and do not introduce `JobsBriefingPanel`.
- Slide 1 uses `householdSalaries(profile)` and renders one `Surface` per adult with:
  - `Bas`
  - `Médian`
  - `Élevé`
  - province median band cards
- Slide 2 renders one `Surface` per adult with:
  - `Salaire brut médian`
  - `Net annuel estimatif`
  - `Net mensuel`
  - `Estimation de démonstration.`
- French copy uses typographic apostrophes: `n’est`, `C’est`, `l’histoire`, `c’est`.

## Verification

- Target GREEN test suite passed.
- Cursor diagnostics check on:
  - `src/features/market.tsx`
  - `src/features/market.test.ts`
- Result: no linter errors found.

## Self-Review

- Constraint respected: only salaries code path was replaced before `ProvincesSection`.
- Constraint respected: Jobs and Opportunities behavior was not modified.
- Constraint respected: `householdSalaries` helper was imported and reused without modification.
- Constraint respected: no forbidden salary coaching chrome strings were introduced.

## Concerns

- None.
