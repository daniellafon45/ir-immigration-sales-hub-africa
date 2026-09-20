# Task 5 brief — Profile UI + Voies closing cards

Read this first — it is your requirements, with the exact values to use verbatim.

**Design sources (UI only; data already shipped):**
- `c:\Users\Admin\.cursor\plans\travail_closing_deck_7c4e91ab.plan.md` (sections Modèle profil, Moteur FEER UI, Fiche Permis de travail)
- `c:\Users\Admin\.cursor\plans\visite_closing_deck_3f8b2d16.plan.md` (Profil + Fiche Visa visiteur)
- `c:\Users\Admin\.cursor\plans\affaires_closing_deck_b91e04c3.plan.md` (Profil + Fiche Affaires)
- `c:\Users\Admin\.cursor\plans\regroupement_closing_deck_5a2d8e70.plan.md` (Profil + Fiche Regroupement)

## Where this fits

Data helpers already exist (`workCost`/`workPathways`, `visitCost`, `businessCost`, `familyCost`). Études UI already exists (`StudyFields` + `StudyClosingCards` in `src/features/profile.tsx` and `src/features/immigration.tsx`). This task grafts the same contract onto Travail / Visite / Affaires / Regroupement: **Profil fields on the Candidat** + **Voies detail cards**. Menu (Canada Live, calculateurs, emplois, salaires, échecs, opportunités) is Task 6 — do not do it here.

## Constraints

- Project folder only. No git. No commits. Do not touch `C:/Users/Admin/.git`
- English identifiers. French UI strings use apostrophe U+2019 (e.g. d’emploi, d’affaires)
- Pitch unchanged. Do not edit `src/data/pitch.ts` or `src/features/pitch.tsx`
- Do NOT edit `src/features/market.tsx`, `src/data/canada-live.ts`, `src/lib/household-salaries.ts`, `src/lib/failure-press.ts`, `src/features/sales.tsx`, `src/features/canada.tsx`
- Do NOT add profile fields. They already exist and are normalized in storage: `workNocCode`, `workPermitKind`, `workHasOffer`, `visitPurpose`, `visitDuration`, `businessPath`, `familyLink`, `sponsorStatus`
- `sections` Voies `slideCount` stays **2**
- Reuse `s.draft` (already used by RoutesDetail). Reuse `Surface` / `SectionLabel` / `FactLine` / `BandMini` patterns from `StudyClosingCards`
- Do not invent IRCC numbers in the UI — read helpers/catalogs
- IEC (from Task 1 review): sales-deck default treats IEC like open for the +100 $ holder fee and renewal “can change employer”. Do not relabel IEC as closed
- Empty `familyLink`: `familyCost` returns `link: undefined` — never simulate spouse. Show the three link rows; do not invent a conjoint card of numbers

## TDD

Source-string tests first (same style as existing `profile.test.ts` / `immigration.test.ts`), watch RED, then implement.

RED/GREEN: `npx vitest run src/features/profile.test.ts src/features/immigration.test.ts src/features/noc-search-field.test.ts`

If you add a small unit test for `NocSearchField` behavior (query → searchNoc), keep it colocated.

## Files to create / edit

### NEW `src/features/noc-search-field.tsx` (+ optional colocated test)

Shared component used in **two** places: Profil Candidat and Voies fiche Permis de travail.

```ts
export function NocSearchField({
  value,
  onChange,
  suggestionCode,
}: {
  value: string; // workNocCode
  onChange: (code: string) => void;
  suggestionCode?: string | null; // professionNoc(applicant.profession), never auto-written
})
```

Behavior:
- Single input, placeholder exactly `Titre d’emploi ou code CNP` (apostrophe U+2019)
- Call `searchNoc(query, 8)` from 2 characters
- Dropdown under the field, max 8 rows: `CNP · FEER n · Titre` (use `item.code`, `item.teer`, `item.title`)
- Enter selects the first result; Escape closes the list
- Selected state: pill `CNP · FEER n · titre` + clear button that calls `onChange("")`
- If `value` is empty and `suggestionCode` is a known CNP, show a non-binding hint (text only). Do **not** write it until the closer picks a result
- Do not auto-overwrite `applicant.profession` when a CNP is chosen

### Edit `src/features/profile.tsx`

Show extra fields **only on the Candidat** `PersonCard` (same two call sites that already pass `study={applicantStudy}`). Spouse / extra spouse cards never get these fields.

| Objective | Fields |
|---|---|
| `Travail` | `NocSearchField` bound to `workNocCode` (suggestion = `professionNoc(draft.applicant.profession)`). Then permit kind chips from `workPermits` writing `workPermitKind`. Then checkbox/chip `Offre d’emploi` writing `workHasOffer` |
| `Visite` | purpose chips from `visitPurposes` → `visitPurpose`. Duration chips: `15d` = `15 jours`, `1m` = `1 mois`, `3m` = `3 mois`, `6m` = `6 mois` → `visitDuration` |
| `Affaires` | path chips from `businessPaths` → `businessPath`. No Start-up Visa option |
| `Regroupement familial` | link chips from `familyLinks` → `familyLink`. Status chips: `pr` = `Résident permanent`, `citizen` = `Citoyen` → `sponsorStatus`. If `familyLink === "spouse"` and no spouse on file, reminder `ajoutez le conjoint au dossier`. If `child` and no children, reminder `ajoutez un enfant`. `parent` allowed in Seul(e) |

Use `setProject` for all of these (already typed as `keyof Profile`).

Follow `StudyFields` / `applicantStudy` wiring. Keep Études behavior intact.

### Edit `src/features/immigration.tsx`

In `RoutesDetail`, keep `StudyClosingCards` when `route.id === "study"`. Add sibling closing blocks (do not raise `slideCount`):

1. `route.id === "work"` → FEER bar + work cards via `workCost(profile)` / `workPathways`
2. `route.id === "visit"` → visit cards via `visitCost(profile)`
3. `route.id === "business"` → business cards via `businessCost(profile)`
4. `route.id === "family"` → family cards via `familyCost(profile)`

Pills: keep `studyDeckPills`. You may add a compact pill for CNP/FEER, visit purpose, business path, or family link **when set** — optional, do not invent a new helper file unless a 10-line function next to the cards is cleaner.

Existing Conditions / Positifs / Attention / Étapes stay below the closing cards.

Legal line already present: `Aperçu de démonstration. Pas un avis juridique.` Keep it. Work cards may add `Vérifiez sur IRCC.` nearby plus an IRCC link (`pathways.sources.noc` / `irccSources.noc`) labeled `Trouver votre CNP` or `Voir sur IRCC`.

## Work cards (`route.id === "work"`)

**Barre FEER** (full width, always):
- `NocSearchField` bound to `useProfileStore` `setProject("workNocCode", …)`
- Suggestion from `professionNoc` not written until picked
- Under the bar when a code is selected: `CNP · FEER n · titre` + one-line legend from `feerLegend[teer]` + link IRCC

**Permis · Ouvert ou fermé**
- Pastilles for each `workPermits` entry: possible vs greyed with `reason` from `pathways.permits`
- Offre requise from `workHasOffer` / permit `needsOffer`
- Frais: traitement 155 $ ; +100 $ détenteur ouvert when `workPermitKind` is `open` **or** `iec` (already in `workFeesFor`)

**Renouvellement**
- Three lines: *Quand déposer* (avant l’échéance, statut conservé) · *Ce qui reste permis en attendant* (fermé = mêmes conditions ; ouvert/IEC = changement d’employeur possible) · *Frais* (`pathways.renewal.fees`)

**Vers la RP · Après une période**
- Use `pathways.prAfter`: CEC 12 mois if FEER 0–3 ; otherwise CEC non, voir PCP
- Mention invitation non garantie
- Link CEC (`irccSources.cec`)

**Année 1 · Foyer**
- Salaire net mensuel approx (`cost.salary.net / 12`), panier annuel, fonds 3 mois (`cost.settlementFunds`), frais, écart `le métier paie X · vivre coûte Y` using `cost.gapMonthly` / living vs salary as already computed

**Pendant le permis · Conjoint** only if `cost.spouse` is defined (helper already gates on SOWP eligible + spouse on file). Seul(e) / parent seul: no card. If spouse on file but SOWP not eligible, you may show a short attention card using `pathways.spouseOpen.reason` — only when a spouse exists.

## Visit cards (`route.id === "visit"`)

Always three cards; fourth only if `cost.accompanying` is defined.

**Frais de voyage · Visa / eTA / biométrie**
- Rows: Visa visiteur | eTA | Biométrie
- Use `visitFeesFor(profile.country, people)` for amounts; people = accompanying adults+kids or 1
- Country pill; short eTA vs visa mention (`documentType`)

**Séjour · Foyer**
- Durée (label 15 jours / 1 mois / 3 mois / 6 mois). If `assumedDuration`, mark aperçu
- Coût du séjour `cost.stayCost` (not annualized)
- Fonds à démontrer `cost.fundsRequired`
- Frais de demande foyer `cost.feesTotal`
- Aller-retour `cost.ticketsDemo`
- Écart: `IRCC n’a pas de grille unique · un séjour de cette durée coûte environ Y`

**Motif et attaches**
- Chosen purpose name, or the 3 purpose names as bullets if assumed
- Ties from `visitPurposeById`
- If purpose `family`: invitation / hôte utile
- Explicit: `un visa visiteur n’autorise pas à travailler ni à étudier`
- `canWork` is always false — never show a salary

**Accompagnants** (only if `cost.accompanying`)
- Who travels (adults / kids counts)
- Statut visiteur
- Mention: pas de permis de travail, pas d’école sans permis d’études

## Business cards (`route.id === "business"`)

Always three cards; fourth if spouse on file (`familyHasSpouse`).

**Volets · Seuils d’investissement**
- 13 provinces/territories from `business-thresholds` (`c11WorkingCapital` + `pnpEntrepreneur`)
- Columns: C11 / fonds de roulement | Entrepreneur provincial
- Highlight dossier province
- 4 path pills above; visa démarrage = `pause IRCC, pas de nouvelles demandes` using `startupVisaNote` / `startupVisaPaused` — not a selectable path
- If a path is chosen: name + seuil or `pas un seuil d’investissement` for visitor / ICT

**Année 1 · Capital**
- Investissement if applicable (`cost.investment`)
- Vie annuelle or séjour court (`livingAnnual` / `stayShort`)
- Fonds personnels `cost.personalFunds`
- Capital à démontrer `cost.capitalToShow`
- Écart: `le volet demande X · la capacité affichée est Y`

**Projet · Crédibilité**
- Expérience (applicant `experienceYears`)
- Capacité (`applicant.salary` label + `personalFunds`)
- Province / volet
- `path.caution` if path chosen

**Pendant le projet · Conjoint** if spouse on file:
- If `cost.spouseOpen`: métier + mention permis ouvert (you may use `salaryForProfession` for the spouse here, or a short qualitative line — do not invent SOWP when `spouseOpen` is false)
- If visitor: `visite, pas un permis de travail`

## Family cards (`route.id === "family"`)

Always three cards + a fourth “personne parrainée”.

**Liens admissibles · Délais**
- Rows: Conjoint / partenaire | Enfant à charge | Parent / grand-parent
- Columns: Engagement (années from `familyLinks`) | Délai hors Québec | Délai Québec
- Use `irccTimeFor("family")` and Québec ~36 months already in `ircc-times` / `cost.delay`
- Highlight selected link if `cost.link` is defined
- Sponsor status pill (RP / citoyen) if set
- If parent: pill `super visa possible en parallèle`

**Engagement · Revenu**
- Taille `cost.familySize`
- Revenu exigé `cost.incomeRequired`
- Revenu approx répondant `cost.sponsorMid`
- Durée `cost.undertakingYears` (omit if no link)
- Écart: `le seuil demande X · le métier paie Y`

**Frais et vie · Foyer réuni**
- Frais `cost.feesTotal`
- Coût de vie annuel réuni `cost.livingReunitedAnnual`
- If Québec: mention délai plus long + frais MIFI d’ordre de grandeur already inside `familyFeesFor` if present — do not invent a new MIFI number

**Personne parrainée**
- `spouse` + spouse on file: `cost.sponsored` métier / bas / médian / élevé / employabilité + `après l’arrivée : RP, droit de travailler`
- `spouse` + Seul(e): reminder card (`cost.reminder`), no invented spouse numbers
- `child`: prénom / âge from `profile.children`; if age < 18 école ; if ≥ 18 no invented profession band
- `parent`: no salary; super visa vs parrainage; engagement long
- Empty link: fourth card is a prompt to choose a link — **not** a spouse simulation

## Tests to add (fail first)

`src/features/profile.test.ts`
- Travail: `NocSearchField`, placeholder `Titre d’emploi ou code CNP`, `workPermitKind`, `workHasOffer`, fields gated on `draft.objective === "Travail"`
- Visite: `visitPurpose`, `visitDuration`, gated on Visite
- Affaires: `businessPath`, gated on Affaires; source does **not** offer a selectable `startup` path
- Regroupement: `familyLink`, `sponsorStatus`, gated on `Regroupement familial`; reminder strings above

`src/features/immigration.test.ts`
- Keep existing study tests passing
- Work: `NocSearchField`, `workCost`, cards titles `Permis · Ouvert ou fermé`, `Renouvellement`, `Vers la RP · Après une période`, `Année 1 · Foyer`, conjoint card gated on `cost.spouse`
- Visit: `visitCost`, `Frais de voyage`, `Séjour · Foyer`, `Motif et attaches`, `canWork` / no-work copy, accompanying gated on `cost.accompanying`
- Business: `businessCost`, thresholds table, `pause IRCC`, conjoint gated on spouse
- Family: `familyCost`, four card titles, reminder when `cost.reminder`
- `slideCount` still 2
- Pitch files unedited: do not import pitch in these tests; simply do not touch pitch files

## Out of scope

- Pitch
- RP objective
- Canada Live / calculateurs / emplois / salaires / échecs / WorkBenefitsSection (Task 6)
- Network calls, EIMT simulator, CRS score
- Commits / git
- Rewriting data helpers unless a tiny display adapter is unavoidable — prefer formatting in the cards

## Done when

- Four objectives show Candidat fields on Profil
- Four corresponding Voies detail grids render from helpers
- Études cards still work
- Focused vitest files green
- Report written to `docs/superpowers/sdd/closing-task-5-profile-voies-report.md`
