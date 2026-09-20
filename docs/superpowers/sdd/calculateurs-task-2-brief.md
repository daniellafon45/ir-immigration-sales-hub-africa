# Task 2 brief — CalculatorsSection + catalog

Read this first — exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-18-calculateurs-profil-chrome.md` (Task 2)
**Spec:** `docs/superpowers/specs/2026-09-18-calculateurs-profil-design.md`
**Resolution from Jobs/Salaires:** no side panel. Do not add `panel=`, `JobsBriefingPanel`, `À retenir`, or `La question`.

## Context

Task 1 shipped `householdLiving` and `draftNet` in `src/lib/household-living.ts`. Reuse them. Do not change the helper.

Insert Calculateurs in the nav **after Guide salarial, before Provinces**. Restyle like current Jobs/Salaires: `OpportunitiesShell` without panel, Surfaces, prospect copy.

## Global constraints

- Work only in the project folder. No git. No commits.
- `calculateurs.slideCount` = 3.
- Do not modify OpportunitiesSection, JobsSection, SalariesSection, or ProvincesSection behavior.
- No profile store setters. Drafts are local useState.
- Forbidden: `Le commercial`, `le commercial`, `version connectée`.
- U+2019 apostrophes.
- Follow existing extractFunction tests in market.test.ts.

## Exact copy (verbatim)

- Slide 1 kicker `Calculateur · Salaire net`
- Slide 1 title `Combien reste-t-il réellement après les retenues ?`
- Slide 1 lead couple `Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes.`
- Slide 1 lead solo `Le brut impressionne. Le net, c’est ça qui paie le loyer.`
- Labels `Salaire annuel brut` `Province` `Net annuel estimatif`
- Monthly: `≈ {money} / mois`
- Slide 2 kicker `Calculateur · Coût de la vie`
- Slide 2 title `smart("Que vaut ce salaire à {province} ?", profile)`
- Slide 2 lead `Un salaire n’existe pas tout seul. Il se mesure au loyer.`
- Labels `Net mensuel` `Loyer indicatif` `Autres dépenses estimées` `Reste estimatif`
- Slide 3 kicker `Calculateur · Budget projet`
- Slide 3 title `Combien faut-il préparer pour démarrer ?`
- Slide 3 lead `Un projet Canada, ce n’est pas seulement des honoraires.`
- Cards `Honoraires IR` `Démarches & tests` `Installation` `Fonds de sécurité`
- Placeholders `À estimer` `À prévoir`
- Honoraires: `Math.min(profile.budget || 5000, 5000)`

## TDD

### Step 1 — append tests to `src/features/market.test.ts` (keep existing tests)

Use the test block from the plan Task 2 (calculators catalog / chrome / household boards).

### Step 2 RED

`npx vitest run src/features/market.test.ts`

### Step 3 implementation

**catalog.ts:** add `"calculateurs"` to SectionId; import `Calculator` from lucide-react; insert `{ id: "calculateurs", label: "Calculateurs", icon: Calculator, slideCount: 3 }` immediately after salaires.

**registry.tsx:** import CalculatorsSection from market; add `calculateurs: CalculatorsSection` after salaires.

**market.tsx:** add `import { draftNet, householdLiving } from "@/lib/household-living";`

Insert the CalculatorsSection block from the plan **immediately before** `export function ProvincesSection`. Do not change ProvincesSection, Band, or Hero.

`Input` and `Select` and `useState` are already imported. `Profile` type is already imported. `provinceCode` / `provinceData` already imported.

Use the exact TSX from the plan Task 2 step 3.

### Step 4 GREEN

`npx vitest run src/features/market.test.ts src/lib/household-living.test.ts src/lib/household-salaries.test.ts`

### Step 5 no git

## Report

`c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme\docs\superpowers\sdd\calculateurs-task-2-report.md`
