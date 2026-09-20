# Task 1 brief — Travail data (FEER, permis, renouvellement, RP)

Read this first — it is your requirements, with the exact values to use verbatim.

**Plan:** `docs/superpowers/plans/2026-09-19-closing-lenses.md`
**Design:** `c:\Users\Admin\.cursor\plans\travail_closing_deck_7c4e91ab.plan.md`

## Where this fits

Études closing is already in the deck. This task ships the **Travail data layer only**: CNP/FEER search, IRCC permit rules, renewal, PR-after-period, and year-1 cost. UI comes later.

## Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- English identifiers. French copy uses apostrophe U+2019
- NEW files only under `src/data/` and `src/lib/` plus colocated `*.test.ts`
- Do NOT edit profile.ts, storage.ts, immigration.tsx, market.tsx, canada-live.ts, household-salaries.ts, profile.tsx, pitch files
- Profile already has `workNocCode`, `workPermitKind`, `workHasOffer`
- Follow `src/lib/study-cost.ts` style (pure functions, vitest)

## TDD

Write tests first, watch RED, then implement.

RED/GREEN: `npx vitest run src/lib/noc-search.test.ts src/lib/work-pathways.test.ts src/lib/work-cost.test.ts src/data/work-permits.test.ts`

## Files to create

### `src/data/noc-2021.ts`

CNP 2021 **groupes de base** (5-digit). At least **80** occupations, French titles, covering every `professions` entry in `src/data/profile.ts` plus common titles (infirmier, développeur, cuisinier, chauffeur, électricien, enseignant, comptable, aide-soignant, ingénieur, etc.).

```ts
export type Teer = 0 | 1 | 2 | 3 | 4 | 5;
export type NocUnit = { code: string; title: string; teer: Teer };
export const noc2021: NocUnit[];
export const nocIngestedAt = "2026-09-19";
export const nocSourceUrl =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/trouver-classification-nationale-professions.html";
export function nocByCode(code: string): NocUnit | undefined;
export function teerOf(code: string): Teer | null; // 2nd digit of CNP 2021, or catalog teer
```

Must include: `11100` Comptable FEER 1, `31301` Infirmier FEER 1, `33102` Aide-soignant FEER 3, `21232` Développeurs logiciels et programmeurs FEER 1.

### `src/data/profession-noc.ts`

Map each `professions` string → default 5-digit code. `professionNoc("Comptable") === "11100"`.

### `src/lib/noc-search.ts`

```ts
searchNoc(query: string, limit = 8): NocUnit[]
```

From 2 characters: accent-insensitive substring on title OR code. Rank: exact code, code prefix, title starts with, title contains.

### `src/data/work-permits.ts`

5 kinds: `lmia` (closed, needs offer), `imp` (closed, needs offer), `open` (open, no offer), `ict` (closed, needs offer), `iec` (openVsClosed: `"varies"`).

Fields: `id`, `name` (French), `employerTied`, `needsOffer`, `openVsClosed: "closed" | "open" | "varies"`.

`workPermitById(id)`

### `src/data/work-fees.ts`

From IRCC prolongation page retrieved 2026-09-19:
- `workPermitFee = 155`
- `openHolderFee = 100`
- `biometricsSolo = 85`
- `biometricsFamilyCap = 170`
- `sourceUrl` = `https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada/prolongez-modifiez/presenter-demande.html`

`workFeesFor(kind, familySize)` → `{ permit, openHolder, biometrics, total }`

### `src/data/ircc-work-rules.ts`

```ts
export const irccRetrievedAt = "2026-09-19";
export const cecHours = 1560; // 1 year × 30h
export const cecYearsWindow = 3;
export const cecEligibleTeer = [0, 1, 2, 3] as const;
export const sowpMinMonthsLeft = 6;
export const sowpSelectedTeer23: ReadonlySet<string>; // include 33102, 33100, 33101, 33103, 22211, 22212 at minimum
export const irccSources = {
  noc: "...trouver-classification-nationale-professions.html",
  cec: "...categorie-experience-canadienne.html",
  renew: "...prolongez-modifiez/presenter-demande.html",
  family: "...epoux-enfant-charge/admissibilite.html",
  openHelp: "https://ircc.canada.ca/Francais/centre-aide/reponse.asp?qnum=176",
};
```

FEER legend strings (French) for 0–5 as in the Travail plan.

### `src/lib/work-pathways.ts`

`workPathways(profile: Profile)` returns:

- `noc`, `teer`, `title`
- `permits`: array of `{ kind, openVsClosed, possible: boolean, reason: string }` for the 5 kinds
- `renewal`: `{ applyBeforeExpiry: true, impliedStatus: true, closedKeepsSameEmployer: boolean, openCanChangeEmployer: boolean, fees }`
- `prAfter`: `{ cecEligible: boolean, months: 12 | null, label: string }` — CEC if teer 0–3 else months null and label that CEC does not apply (PCP)
- `spouseOpen`: `{ eligible: boolean, reason: string } | undefined` — undefined if no spouse
  - eligible if teer 0 or 1, OR code in `sowpSelectedTeer23`, OR `workPermitKind === "open"` is NOT enough alone
  - teer 4–5: not eligible unless you only mention PR pathway in reason, `eligible: false`

### `src/lib/work-cost.ts`

Mirror studyCost. `workCost(profile)`:

- `livingAnnual` from `livingBasket(profile, defaultCityId(profile)).total * 12`
- `settlementFunds` = 3 months of monthly basket
- `fees` from `workFeesFor`
- `salary` from `salaryForProfession(applicant.profession, province)` mid/low/high + net via `netEstimate`
- `gapMonthly` = net monthly − basket.total
- `spouse` outcome if `familyHasSpouse` AND `workPathways(profile).spouseOpen?.eligible` — else undefined
- Use `demandFor` + `demandLabel` like studyCost

## Tests (must include)

- `searchNoc("21232")` returns FEER 1 software developers
- `searchNoc("infirm")` returns at least one 313xx or 33102
- `workPathways` FEER 1 couple → cecEligible true, months 12, spouseOpen.eligible true
- `workPathways` code `75110` or any teer 5 in catalog, couple → cecEligible false, spouseOpen.eligible false
- `workCost` solo vs couple SOWP vs couple ineligible
- work permit catalog length 5

## Report

Write `docs/superpowers/sdd/closing-task-1-travail-report.md`

Return under 15 lines: Status, commits none, test summary, concerns, report path.
