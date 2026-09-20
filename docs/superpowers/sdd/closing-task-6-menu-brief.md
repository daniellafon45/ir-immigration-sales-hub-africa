# Task 6 brief — Menu lenses (Canada Live, calculateurs, emplois, salaires, échecs)

Read this first — it is your requirements, with the exact values to use verbatim.

**Design (menu sections only; Profile + Voies already shipped):**
- Travail: `c:\Users\Admin\.cursor\plans\travail_closing_deck_7c4e91ab.plan.md` § Autres rubriques
- Visite: `c:\Users\Admin\.cursor\plans\visite_closing_deck_3f8b2d16.plan.md` § Autres rubriques
- Affaires: `c:\Users\Admin\.cursor\plans\affaires_closing_deck_b91e04c3.plan.md` § Autres rubriques
- Regroupement: `c:\Users\Admin\.cursor\plans\regroupement_closing_deck_5a2d8e70.plan.md` § Autres rubriques

## Where this fits

Tasks 1–5 shipped data helpers + Profil fields + Voies cards. Études already overlays Canada Live / budget / jobs / salaries. This task extends the **same menu surfaces** to Travail / Visite / Affaires / Regroupement. Pitch stays untouched. RP objective keeps the default (non-overlay) briefing.

## Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- English identifiers. French UI strings use apostrophe U+2019
- Do not edit `src/data/pitch.ts` or `src/features/pitch.tsx`
- Do not redo Voies closing cards / NocSearchField / Profile extra fields (Task 5). You may **reuse** `closingPills` logic by extracting a small helper if that avoids copy-paste; do not change card layouts
- Read `s.draft` (already the case on these screens)
- Keep slide counts unchanged
- Do not invent IRCC numbers; use helpers (`workCost`, `visitCost`, `businessCost`, `familyCost`, `workPathways`, `irccTimeFor`)
- IEC treated as open for holder fee / renewal (helpers already)
- Empty `familyLink` does not simulate spouse
- Demo disclaimer already on several screens; do not add a new legal essay

## TDD

Failing tests first, then code.

RED/GREEN:
```
npx vitest run src/data/canada-live.test.ts src/lib/failure-press.test.ts src/lib/household-salaries.test.ts src/features/market.test.ts src/features/sales.test.ts
```

## Shared pills helper (recommended)

NEW `src/lib/closing-pills.ts`:

```ts
export function closingDeckPills(profile: Profile): string[]
```

- Études: keep using `studyDeckPills` (do not break it)
- Travail: if `workNocCode` selected, one pill `CNP · FEER n` (from `nocByCode` / `teerOf`)
- Visite: purpose `name` if set
- Affaires: path `name` if set
- Regroupement familial: link `name` if set
- Otherwise `[]`

Use this on Opportunités, Emplois, Salaires, Calculateurs, Provinces, Comparateur (immigration already has local `closingPills` — you may switch that to the helper **only if** the strings stay equivalent), Échecs, Écosystème. Do not duplicate four copies of the same switch.

## 1. Canada Live — `src/data/canada-live.ts` + `canada-live.test.ts`

Follow `studyOverlays` + `canadaLivePagesFor`. Keep **4** pages (`vue`, `demographie`, `emploi`, `pont`). Overlay when objective is Travail / Visite / Affaires / `Regroupement familial`. RP (`defaultProfile`) must still return the **same array identity** as `canadaLivePages`.

Stats: 4 per page, no `—` or `–` in JSON of overlaid pages (existing study test). Use order-of-magnitude figures already in this deck (IRCC delays, permit fees, levels plan) plus short French labels. `retrievedAt` spirit: septembre 2026. Include `sourceUrl` only if the type already has it — do not change `CanadaLivePage` shape.

Suggested themes (titles must clearly switch off RP wording):

| Objective | vue | emploi | pont |
|---|---|---|---|
| Travail | permis de travail / FEER / CEC 12 mois (invitation non garantie) | EIMT vs ouvert, renouvellement | CNP du dossier |
| Visite | visas / eTA / délais visite | pas un droit de travailler | motif + attaches |
| Affaires | C11 / PNP / **pause Start-up Visa** (`startupVisaNote`) | seuils / capital | volet du dossier |
| Regroupement | catégorie familiale | conjoint vs parents, QC ~ plus long | lien du dossier |

`canada.tsx` already calls `canadaLivePagesFor(profile)` on draft — do not change unless a type breaks.

## 2. Échecs — `src/lib/failure-press.ts`

`highlightedFailureIds` still max 3.

Current: `housing`, `job-myth`, then `money` if spouse/children, then objective spice (`employability` / `program` / `counsel`).

Add:
- `Affaires` → always include `money` (even Seul(e))
- `Regroupement familial` → always include `money` (even Seul(e))
- `Travail` already has `employability` when there is room; keep `job-myth`
- `Visite` already has `counsel`; keep `job-myth` visible in the list (it already is in the base two)

If the 3-slot cap would drop `money` on Affaires/Regroupement, **prefer money over the objective spice** (housing, job-myth, money).

Tests in `failure-press.test.ts`: Seul + Affaires includes `money`; Seul + Regroupement includes `money`. Keep existing Travail/Études/Visite cases green.

## 3. Calculateurs · Budget — `CalculatorsBudget` in `src/features/market.tsx`

Keep Études three cards. Add (mutually exclusive, Études first):

| Objective | cards |
|---|---|
| Travail | `Frais de permis` (`workCost.fees.total`) · `Coût de vie (année 1)` · `Fonds jusqu’au 1er salaire` (`settlementFunds`) |
| Visite | `Frais de visa` · `Coût du séjour` · `Fonds à démontrer` |
| Affaires + path `visitor` | `Frais de voyage` · `Coût du séjour` (`stayShort`) · `Fonds à démontrer` (`capitalToShow`) |
| Affaires other / empty | `Investissement` · `Coût de vie (année 1)` · `Capital à démontrer` |
| Regroupement familial | `Frais de parrainage` · `Revenu exigé (MNI)` · `Coût de vie (foyer réuni)` |

Fallback (RP and anything else): keep Honoraires IR / Démarches / Installation / Fonds de sécurité.

Source tests must `toContain` the new labels + `workCost` / `visitCost` / `businessCost` / `familyCost`.

## 4. Opportunités — `WorkBenefitsSection` gating

`OpportunitiesMarket` currently always renders `WorkBenefitsSection`.

- **Visite**: do **not** render `WorkBenefitsSection`. Render 3 short bullets instead, exact copy:
  1. `Un visa visiteur autorise le séjour, pas un emploi.`
  2. `Pas d’études sans permis d’études.`
  3. `Le conjoint voyage comme visiteur, pas comme travailleur.`
- **Affaires** + `businessPath === "visitor"`: hide `WorkBenefitsSection`; same 3 bullets (or the Affaires visitor caution). If path is `c11` / `ict` / `pnp-entrepreneur` or empty: **keep** WorkBenefits.
- **Travail**: keep WorkBenefits. Couple: do not promise SOWP in the title unless `workPathways(profile).spouseOpen?.eligible`.
- **Regroupement** + `familyLink === "parent"`: keep WorkBenefits but change the lead so it is **not** sold as an employment argument (réunification first). Spouse link: WorkBenefits “après l’arrivée” is OK.
- **Études**: unchanged.

Title/lead recadrage:
- Visite: not “le marché cherche votre métier”
- Affaires: “le projet doit être crédible ici”
- Regroupement: réunification first, not métier first
- Travail: may show CNP·FEER pill

Tests in `market.test.ts`: `WorkBenefitsSection` absent when objective Visite; present when Études/Travail; absent when Affaires + visitor; present when Affaires + c11.

These are source-string tests: assert the Visite branch does not call WorkBenefits, and the visitor-business branch likewise. Follow existing `extractFunction` / `toContain` style.

## 5. Emplois / Salaires — `householdSalaries` + jobs/salaries copy

`src/lib/household-salaries.ts`:

Keep Études student + accompanying.

Add:
- **Visite**: all adults stay `track: "market"` with a **single** market phase. Do **not** use `accompanying` / `openWork`. UI titles/leads in `JobsToday` / `SalariesBands` must include `pas un droit de travailler`.
- **Travail**: applicant `market`. Spouse group `accompanying` + `openWork` **only if** `workPathways(profile).spouseOpen?.eligible`; otherwise spouse stays `market` (or omit openWork hint). Do not drop the spouse group.
- **Affaires** `visitor`: same as Visite (no openWork). Other business paths: spouse `openWork` if `businessCost(profile).spouseOpen`.
- **Regroupement** + `familyLink === "spouse"` + spouse on file: two `market` groups (répondant + personne parrainée). Spouse heading like `Après l’arrivée · {profession}` — **not** `openWork`.
- **Regroupement** + `parent`: **one** group (applicant only), even if a spouse is on file. Do not invent a parent salary.

Jobs/Salaries UI (`JobsToday`, `JobsIntl`, `SalariesBands`): branch titles/leads like Études already does. Do not remove the 2 slides.

Tests:
- visit couple: 2 groups, both market, no openWork
- work FEER 1 couple (noc `21232`): spouse accompanying/openWork
- family parent Seul: 1 group
- family spouse couple: 2 market groups, spouse phase id not `openWork`

## 6. Provinces / Comparateur / Écosystème

- Provinces: keep living basket. Add `closingDeckPills`. Visite lead nuance: `ce que coûte un mois sur place, pas une installation` (source string).
- Comparateur: already draft-aligned; add purpose/path/link/CNP pill via helper if not already from Task 5 `closingPills`.
- Écosystème (`sales.tsx` `EcosystemSection`): pills = foyer / objective / `closingDeckPills` (and study pills). No extra pillars.

## Out of scope

- Pitch
- RP overlays
- New Voies cards
- Network calls, CRS, EIMT simulator
- Commits

## Done when

Focused vitest files green, Études overlays still work, RP default Canada Live identity preserved, report at `docs/superpowers/sdd/closing-task-6-menu-report.md`.
