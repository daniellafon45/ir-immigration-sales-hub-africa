### Spec Compliance

Approuvé — l'élément Important (suppression de `market.province` dans `EcosystemSection`) a été corrigé et n'est plus présent dans `EcosystemSection`.

### Strengths

- La correction ciblée a été appliquée uniquement à `EcosystemSection` : la liste `pills` y contient désormais `market.family`, `profile.objective`, `...studyDeckPills(profile).filter(...)` et `...closingDeckPills(profile)` conformément au cahier des charges.
- L'implémenteur a fourni un rapport de tests local montrant 14/14 pour `src/features/sales.test.ts` après la modification.
- Aucun changement d'identité RP, pas de reconstruction des Voies (Task 5), et les contraintes globales signalées ont été respectées.

### Issues (Critical / Important / Minor)

Critical:
- Aucun.

Important:
- Aucun — la seule réclamation Important (présence de `market.province` dans `EcosystemSection`) a été traitée.

Minor:
- Les items mineurs identifiés lors de la première revue restent déférés par décision de scope. Aucun de ces mineurs ne bloque la confiance dans la correction ciblée.

### Assessment
**Task quality:** Approved
**Reasoning:** La correction demandée (retirer `market.province` de `EcosystemSection`) est présente dans le code lu et les tests rapportés par l'implémenteur passent localement ; les autres usages de `market.province` (par ex. dans `FailuresRisks`) restent intentionnels et hors périmètre.

### Spec Compliance
- ❌ `src/features/sales.tsx:149-155` — `EcosystemSection` ajoute encore `market.province` aux pills, alors que le brief limite cette surface a foyer + objectif + `studyDeckPills` eventuels + `closingDeckPills`.
- ✅ `src/data/canada-live.ts:796-818`, `src/catalog.ts:41` — `canadaLivePagesFor()` conserve bien l'identite de `canadaLivePages` pour la RP et garde 4 pages.
- ✅ `src/data/canada-live.ts:460-793` — les overlays Travail / Visite / Affaires / Regroupement familial sont bien presents et recadres selon l'objectif demande.
- ✅ `src/lib/failure-press.ts:3-15` — `highlightedFailureIds()` reste plafonne a 3 et priorise bien `money` pour Affaires / Regroupement familial, y compris en solo.
- ✅ `src/lib/household-salaries.ts:97-177` — les tracks foyer suivent le brief pour Visite, Travail, Affaires et Regroupement.
- ✅ `src/features/market.tsx:82-168`, `src/features/market.tsx:647-727`, `src/features/market.tsx:926-960`, `src/features/market.tsx:1250-1366` — le gating de `WorkBenefitsSection`, la copy Visite, les cartes budget et le lead Provinces sont alignes sur la spec.
- ✅ `src/features/immigration.tsx:980-986`, `src/features/immigration.tsx:1240-1245` — le Comparateur reprend bien `closingDeckPills(profile)`.
- ✅ `docs/superpowers/sdd/closing-task-6-menu-review-package.md:9-24`, `src/catalog.ts:40-50` — les fichiers Pitch ne font pas partie du package modifie et les compteurs de slides restent inchanges.
- ⚠️ Cannot verify from diff: le `81/81` Vitest annonce dans `docs/superpowers/sdd/closing-task-6-menu-report.md` n'a pas ete relance, conformement a l'instruction.

### Strengths
- `closingDeckPills()` est une bonne extraction: petite API, branches explicites, et reutilisation coherente dans `market`, `sales` et `immigration`.
- Les overlays Canada Live sont construits par composition sur la base RP plutot que par duplication complete, ce qui limite le risque de casser l'identite RP.
- Les regles les plus fragiles du brief sont codees dans des helpers testables (`highlightedFailureIds`, `householdSalaries`) au lieu d'etre dispersees dans le JSX.

### Issues
#### Critical
- Aucun.

#### Important
- `src/features/sales.tsx:149-155` — la pill `market.province` dans `EcosystemSection` enfreint directement le contrat de la section. Le brief demandait un ensemble limite a foyer / objectif / lens pills, sans pill additionnelle de province.

#### Minor
- `src/features/sales.test.ts:116-120` — la couverture du cas Ecosysteme verifie la presence de `closingDeckPills(profile)` et l'absence de tags de piliers, mais pas la composition exacte des pills. C'est ce qui a laisse passer la regression ci-dessus.

### Assessment
**Task quality:** Needs fixes
**Reasoning:** L'implementation est globalement propre et couvre bien presque tout le brief, mais elle ne passe pas la gate tant que `EcosystemSection` affiche une pill supplementaire interdite par la spec. Le correctif parait local et peu risque.
