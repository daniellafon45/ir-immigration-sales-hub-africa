# Review branche — Layout fluide, clipping et boutons alignés

**Ready to merge?** Yes (no git) — **ready to merge**

- Spec / plan : ✅ (6/6 tâches dans l’arbre)
- Critical : 0
- Important : 0
- Qualité tâches 1–6 : Approved (T3 après correctif ChoiceTile / polygame)
- Tests : non relancés ici (consigne inspection) ; Task 6 a reproduit **61 fichiers / 524 tests** verts
- Navigateur : hors de cette revue

Filtre de confiance : uniquement les écarts que je bloquerais au merge (confiance ≥ 80). Aucun.

Arbre non muté hors ce fichier. Pas de git.

---

## Ce qui a été relu

Revue merge-gate de toute la passe, fichiers listés comme changement de branche, confrontés au plan `docs/superpowers/plans/2026-09-19-layout-responsive-boutons.md` et aux contraintes globales.

**Shell**

- `src/App.tsx`
- `src/index.css` (`.page-shell*` + utilitaires de grilles en fin de fichier)
- `src/components/layout/Stage.tsx`, `SideNav.tsx`
- `src/components/layout/PageShell.test.ts`, `Stage.test.ts`, `SideNav.test.ts`
- `src/components/layout/PageShell.tsx` (contrat CSS, inchangé structurellement)

**Features**

- `src/features/profile.tsx` + `profile.test.ts`
- `src/features/market.tsx` + `market.test.ts`
- `src/features/immigration.tsx` + `immigration.test.ts`
- `src/features/sales.tsx` + `sales.test.ts`
- `src/features/canada.tsx` + `canada.test.ts`
- `src/index.css.test.ts`

**Pitch (non-régression, pas dans le diff attendu)**

- `src/features/pitch.tsx` / `pitch-deck.tsx` : pas de greffe `ir-option-grid` / pas de redesign. Stage saute le gutter (`section.id !== "pitch"`).

**Ledger**

- `docs/superpowers/sdd/progress-layout-responsive.md` est **périmé** (T4 « in progress », T5–T6 pending) alors que T4–T6 sont dans l’arbre et ont des rapports/revues. Ça n’affecte pas le merge du code.

---

## Les six tâches closent

| Tâche | Contrat | Dans l’arbre |
|---|---|---|
| 1 Shell | Plus de clip page-shell ; gutter Stage hors pitch ; tooltip seul en `z-50` | Oui |
| 2 CSS | `.ir-option-grid` / `.ir-option-btn` / `.ir-equal-row` uniques, après `.ir-auto-grid-sm` | Oui |
| 3 Profil | Picks + famille + objectif/destination + `min-w-0` cartes | Oui (y compris ChoiceTile `w-full min-w-0`) |
| 4 Marché | Triplets `ir-equal-row` ; villes `ir-option-grid` ; pas de translate hover sur PersonMarketCard | Oui |
| 5 Immig / ventes / Canada | BandMini `ir-equal-row` ; comparateur `ir-option-grid` ; piliers `@min-` + `min-w-0` ; stats `ir-equal-row` 8rem | Oui |
| 6 Contrôle | Vitest vert ; leftovers grep ≠ groupes de choix | Oui (rapport + revue T6) |

---

## Contraintes — confirmations (file:line)

**Pas de logique métier / copies FR / identité IR**

- Picks Profil : mêmes couleurs sélection (`bg-primary` + ombre) / repos (`bg-secondary text-primary`) — `profile.tsx:1154-1158` et équivalents Appearance/Language.
- Cartes : `rounded-[1.2rem]`, ombres `0_8px_24px` / hover ombre — Surface profil `profile.tsx:1248-1251`, Surface marché `market.tsx:556-561`.
- Band / BandMini : featured = bordure primary + fond secondary, pas un nouveau look — `immigration.tsx:927`.
- Pitch : `PitchSection` → `PitchDeck` inchangé — `pitch.tsx:9-13` ; padding interne conservé, pas de gutter Stage — `Stage.tsx:16,23`.

**Aucun passage sous SideNav ; pas de `position: fixed` sur la barre**

- Root flex : `SideNav` puis `main` `flex-1 min-w-0` — `App.tsx:28-30`.
- Aside : `shrink-0 … md:w-14 md:flex-col`, pas de `fixed`, pas de `z-50` — `SideNav.tsx:12-13`.
- `main` : `relative z-0 min-w-0 isolate` — `App.tsx:30`.

**Ombres / `ring-2` : clip à l’extérieur du padding de page**

- `--page-pad-x: clamp(1rem, 2vw, 2rem)` — `index.css:145`.
- `.page-shell { overflow: visible }` — `index.css:157`.
- Frame / split main : `overflow-x: visible` — `index.css:172,240,245`.
- Split main : `padding-inline: 2px; margin-inline: -2px` pour le ring — `index.css:247-249`.
- Stage scroller : `overflow-x-clip` + `px-3 md:px-6` (hors pitch) — `Stage.tsx:22-23`.
- PersonCard / PersonMarketCard : `ring-2` sur Surface, `overflow-hidden` sur l’inner photo — `profile.tsx:965-966`, `market.tsx:376-382`.

**Groupes de choix : cellules égales via helpers**

- Sexe / apparence / langues : `ir-option-grid` + `ir-option-btn` — `profile.tsx:1144-1155`, `1182-1193`, `1220-1231`.
- Tuiles famille : `ir-option-grid` `--ir-option-min: 6.5rem` + ChoiceTile `w-full min-w-0 min-h-[52px]` — `profile.tsx:292-301`, `1287-1288`.
- Objectif / Destination : `ir-option-grid` + Chip `w-full min-w-0 justify-center` — `profile.tsx:306-336`.
- Bas / Médian / Élevé marché : `ir-equal-row` — `market.tsx:404,1029,1072`.
- Villes : `ir-option-grid` + `ir-option-btn` — `market.tsx:1498-1513`.
- BandMini Voies : `ir-equal-row` (études, travail, affaires, famille) — `immigration.tsx:270,291,451,724,858`.
- Comparateur : `ir-option-grid` + `ir-option-btn` — `immigration.tsx:1049-1061`.
- Stats Canada : `ir-equal-row` + `--ir-equal-min: 8rem` — `canada.tsx:102-105`.

**Breakpoints dans une carte : `@min-[…]` / helpers, pas `sm:` / `min-[420px]` sur les groupes visés**

- Candidat/Conjoint : `@min-[34rem]:grid-cols-2` + `min-w-0` — `profile.tsx:381,408`.
- Piliers écosystème : `@min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3` + `min-w-0` — `sales.tsx:170`.
- `min-[420px]` : **aucun hit** dans profile / market / immigration / sales / canada.
- `sm:grid-cols-3` restant : `RouteSteps` timeline (`immigration.tsx:937`) — pas un groupe de choix.
- `grid grid-cols-3` nu : **aucun** (hors DemandStat métriques `grid-cols-3` à `market.tsx:822`, lecture seule).

**Helpers plutôt que `grid-cols-N` dupliqués**

- `.ir-auto-grid` / `.ir-auto-grid-sm` conservés — `index.css:314-324`.
- Option/salaire : une définition chacun — `index.css:326-354` ; test d’unicité — `index.css.test.ts:66-76`.
- Province bands : `ir-auto-grid-sm` réutilisé — `market.tsx:1034`.

**Tooltips SideNav**

- `left-[52px] z-50` uniquement sur le span — `SideNav.tsx:38`.
- Aside sans `z-50` — `SideNav.tsx:12-13`.

**Animation gauche**

- `.slide-enter.from-left { --slide-from: 0px; }` — `index.css:125-127` (fade conservé via keyframes `opacity`).

**Aucun scroll horizontal de page**

- `html { overflow-x: clip }` — `index.css:83-85`.
- Root App `overflow-hidden` — `App.tsx:28`.
- Stage scroller `overflow-x-clip` — `Stage.tsx:22`.
- Table villes : scroll **local** `overflow-x-auto` sur la Surface — `market.tsx:1525` (pas un overflow de page).

---

## Findings

### Critical

Aucun.

### Important

Aucun. Rien que je bloquerais au merge à ≥ 80 %.

Les correctifs qui avaient bloqué des gates de tâche sont dans l’arbre :

- ChoiceTile `w-full min-w-0` — `profile.tsx:1288`.
- Grille polygame `min-w-0` — `profile.tsx:381`.
- CSS option-grid : une seule copie propre, wrap plutôt qu’ellipsis (aligné sur le test actuel) — `index.css:333-347`.

---

## Triage des mineurs déjà enregistrés

Aucun n’est requis avant de considérer la passe livrable.

### 1. Brittleness des tests CSS PageShell — **peut attendre**

`PageShell.test.ts` découpe les blocs par `indexOf` / première `}`. Un refactor (sélecteur groupé, commentaire, règle imbriquée) casserait le test sans casser le layout. Le contrat actuel (overflow visible, pad-x ≥ 1rem) est bien dans le CSS.

### 2. Stage outer `overflow-hidden` — **peut attendre**

`Stage.tsx:19` garde `overflow-hidden` sur le `<section>`. Le scroller interne a le gutter + `overflow-x-clip`. Les cartes et ombres sont à l’intérieur du padding ; le bug « bord gauche Candidat rogné » n’a plus la chaîne page-shell `overflow: hidden` + frame `overflow-x: hidden` + gutter conditionnel. Revisit si un décor doit déborder du Stage.

### 3. Strictness snapshot des utilitaires — **peut attendre**

`.ir-option-btn` a `padding-block`, `border-radius`, `line-height`, `white-space: normal` (pas `nowrap` + ellipsis du snippet initial Task 2). Les tests **interdisent** désormais nowrap/ellipsis — `index.css.test.ts:47-48`. C’est le bon contrat pour cellules égales + texte lisible. Un snapshot caractère-pour-caractère n’apporterait rien de plus.

### 4. Encodage dans un nom de test — **peut attendre**

Le `it("defines .ir-equal-row for Bas/Médian/Élevé triplets")` est lisible en UTF-8 dans le fichier actuel. Si un terminal a déjà montré `MÃ©dian`, c’est cosmétique.

---

## Hors revue (non bloquant)

Nits vus à la relecture croisée ; **pas des veto merge**.

- **Comparateur `justify-start`** sur les pills (`immigration.tsx:1061`) : le helper CSS force déjà `justify-content: center` (CSS non-layeré vs utilitaires Tailwind). Cellules égales. Alignement interne checkbox + libellé = choix UX, pas un reliquat `flex-wrap`.
- **Aside profil `modeCols` / `scoreCols`** encore en `grid-cols-2|3` selon le *nombre* d’adultes (`profile.tsx:546-547,579`) — pas un breakpoint viewport, hors liste T3. Les Chip ont déjà `ir-option-btn`.
- **`nav` `md:overflow-x-hidden`** (`SideNav.tsx:19`) : préexistant ; le z-index du tooltip a été déplacé comme demandé. Si un tooltip était déjà rogné par ce overflow, ce n’est pas une régression de cette passe.
- **`hover:-translate-y-0.5`** reste sur ChoiceTile et les tuiles destination Opportunités (`profile.tsx:1291`, `market.tsx:260`). T4 ne l’exigeait que sur PersonMarketCard (retiré). Risque de clip 2px négligeable vs le bug d’origine.
- **Grep T6** : `flex flex-wrap gap-1.5` restants = MetaPills / badges lecture seule (classés OK en T6). `sm:` headers (`sm:px-6`) hors groupes de choix.
- **Tests BandMini** : le describe Voies verrouille `StudyClosingCards` ; travail / affaires / famille utilisent le même helper mais sans assertion dédiée.
- **Vitest** : non relancé dans cette revue (contrôleur / T6).
- **Ledger** : à mettre à jour (T1–T6 complete) — docs only.

---

## Verdict

**Ready to merge.** Le shell ne clippe plus les cartes contre la nav (overflow visible + pad-x ≥ 1rem + gutter Stage hors pitch + slide gauche à 0px). Les groupes de choix visés (picks, famille, objectif/destination, salaires, villes, comparateur, stats Canada, piliers) passent par `ir-option-grid` / `ir-equal-row` / `@min-[…]`, sans `min-[420px]` ni `sm:grid-cols-3` sur ces groupes. Pitch non redessiné. SideNav reste dans le flux `md:w-14`. Aucun Critical / Important à ≥ 80 %. Les mineurs déjà notés peuvent attendre.
