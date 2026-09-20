# Review branche — Guide salarial chrome profil (no git)

**Merge base:** none (pas de git projet)  
**Head:** working tree  
**Commits:** none (git interdit)

## Portée

Restyler le Guide salarial (2 slides) sur le chrome Profil / Emplois, avec boards Bas / Médian / Élevé et net **par adulte du foyer**.

Références :

- Spec : `docs/superpowers/specs/2026-09-18-salaires-profil-design.md`
- Plan : `docs/superpowers/plans/2026-09-18-salaires-profil-chrome.md`
- Ledger : `docs/superpowers/sdd/progress-salaires.md`
- Amendement binding Task 2 : `docs/superpowers/sdd/salaires-task-2-resolution.md` — Emplois n’a plus de panneau latéral ; Salaires doit matcher (pas de `JobsBriefingPanel`, pas de `panel=`, pas de `À retenir`).

## Fichiers examinés (lecture, pas de git)

```
A  src/lib/household-salaries.ts
A  src/lib/household-salaries.test.ts
M  src/features/market.tsx          (SalariesSection → SalariesNetBoard ; imports)
M  src/features/market.test.ts      (describes salaries catalog / chrome / household boards)
```

`JobsSection` (l.497–594), `OpportunitiesSection` (l.32+) et `ProvincesSection` (l.707+) relus pour confirmer qu’ils ne sont pas le lieu du restyle salaires.

## Mineurs déjà acceptés (triage, non bloquants)

Hérités du travail Emplois, toujours vrais ici, **ne bloquent pas le merge** :

- correspondance exacte de `profession` sur `salaryData` (`household-salaries.ts:24`) ;
- tests UI par lecture de source (`market.test.ts:7,161–197`) ;
- collision de `key={pill}` dans `OpportunitiesShell` si deux adultes ont le même métier (`market.tsx:205–207`, pills salaires l.618 et l.638).

---

### Spec Compliance

✅ **Conforme à la spec telle qu’amendée par la résolution Task 2.**

| Exigence | Statut | Preuve |
|---|---|---|
| Helper `householdSalaries(profile)` par adulte de `householdMarket` | ✅ | `household-salaries.ts:20–33` |
| `bands` = `salaryData[profession] ?? salaryData.Comptable` | ✅ | `household-salaries.ts:24` |
| `netAnnual` = `netEstimate(mid, provinceCode)` ; `netMonthly` = `Math.round(netAnnual / 12)` | ✅ | `household-salaries.ts:25–31` |
| `slideCount` salaires = 2 | ✅ | `catalog.ts` + `market.test.ts:161–164` |
| Chrome `OpportunitiesShell` + `Surface` + `SectionLabel` + `MetaPill` (via pills) + `Band` | ✅ | `market.tsx:620–672,755` |
| Pas de `HoverRevealCards`, pas d’édition de profil | ✅ | chunk Salaries : aucun `HoverRevealCards` / `onChange` / `setPrincipalMode` |
| Copy slide 1 : kicker, titre `smart(...)`, leads couple/solo, pills family/province/métiers | ✅ | `market.tsx:614–627` |
| Une Surface par adulte, Bandes Bas / Médian (featured) / Élevé + pastilles médian province | ✅ | `market.tsx:651–675` |
| Copy slide 2 : kicker Net, titre, lead, labels net, disclaimer | ✅ | `market.tsx:640–648,686–700` |
| Copy prospect : pas de « Le commercial » / « version connectée » | ✅ | scan du chunk Salaries |
| **Amendement :** pas de `JobsBriefingPanel`, pas de `panel=`, pas de `À retenir` / `La question` | ✅ | `market.tsx:620–648` ; scan chunk ; tests jobs+salaires |
| Hors scope Emplois / Opportunités / Provinces | ✅ à la lecture | Jobs sans panneau ; Opportunités garde `panel=` / `MarketPanel` / `setPrincipalMode` ; Provinces reste sur `Slide` |

**Écart volontaire vs spec originale (non-défaut) :** la spec initiale demandait `JobsBriefingPanel`, kicker `À retenir`, talks Ancrage / Foyer / Province / Écart / Honnêteté et panneau « La question ». La résolution Task 2 **annule** ce chrome pour aligner Emplois. L’ancrage visuel (Band Médian `featured`), le contrast foyer (une carte par adulte), le net (slide 2) et l’honnêteté (`Estimation de démonstration.`) restent dans les boards.

⚠️ **Non vérifiable sans git :** l’ordre RED/GREEN TDD, et qu’aucun octet d’Emplois / Opportunités / Provinces n’a bougé hors imports. La lecture actuelle est cohérente avec le chrome Emplois déjà livré.

### Strengths

- Helper pur, typé, collé au brief Task 1 : mêmes exports, même mapping, mêmes assertions couple / `Seul(e)` / fallback Comptable / taux Ontario (`household-salaries.ts`, `household-salaries.test.ts`).
- UI bornée : `SalariesSection` → `SalariesBands` / `SalariesNet` → `SalariesBoard` / `SalariesNetBoard` (`market.tsx:596–705`). Pas de `Slide` dans les helpers salaires. `Band` et `Hero` restent partagés en bas de fichier.
- Alignement chrome Emplois : même `OpportunitiesShell` sans `panel`, mêmes pills foyer, même `Surface` + `SectionLabel` par adulte (`JobsToday` l.515–522 vs `SalariesBands` l.620–627).
- Psychologie de closing encore portée par les boards : médian featured (`market.tsx:661`), deux médianes foyer, brut → net annuel → net mensuel, disclaimer de démo (`market.tsx:700`).
- Apostrophes U+2019 dans `n’est` / `l’histoire` / `c’est`, comme exigé par la résolution.
- Tests salaires appendus après les describes jobs, sans casser le pattern `extractFunction` existant. Suite ciblée : **23/23 verts** (`market.test.ts` 19, `household-salaries.test.ts` 4).

### Issues

#### Critical (Must Fix)

Aucune.

#### Important (Should Fix)

Aucune.

#### Minor (Nice to Have)

Aucun **nouveau** mineur bloquant ou à traiter avant merge.

Les trois mineurs Emplois rappelés en tête de revue restent vrais (match exact de profession, tests source-string, collision de keys de pills) et sont **déjà acceptés**.

### Recommendations

- Le plan `2026-09-18-salaires-profil-chrome.md` (Architecture + Task 2 verbatim + self-review « `JobsBriefingPanel` reused ») est **périmé** vis-à-vis de `salaires-task-2-resolution.md`. Le code suit l’amendement ; pas besoin de changer le code pour ça.
- Si un jour Emplois récupère un panneau, resynchroniser Salaires — aujourd’hui l’absence de panneau est la contrainte binding.

### Assessment

**Ready to merge?** Yes

**Reasoning:** Task 1 et Task 2 livrent le helper foyer et le chrome 2 slides demandés, avec la contrainte binding (pas de panneau, comme Emplois). Aucun Critical / Important. Les mineurs restants sont ceux déjà acceptés sur Emplois. Les tests ciblés passent (23/23).
