# Review branche — Closing lenses (Travail / Visite / Affaires / Regroupement familial)

**Ready to merge?** Yes (no git) — **SHIP**

- Spec: ✅ (les quatre objectifs closent via helpers + champs Profil + cartes Voies + overlays menu)
- Critical: 0
- Important: 0
- Qualité tâches 1–6: déjà Approved (re-reviews comprises)
- Tests: non relancés ici (consigne) ; rapports d’implémentation T1–T6 verts
- Navigateur: hors de cette revue (ledger: pending côté contrôleur)

Filtre de confiance: uniquement les écarts que je bloquerais au merge (confiance ≥ 80). Aucun.

---

## Ce qui a été relu

Revue merge-gate de toute la passe, après les gates par tâche. Pas de git. Arbre non muté hors ce fichier. Suite Vitest non relancée.

**Package / ledger / specs / briefs**

- `docs/superpowers/sdd/review-branch-closing-lenses-package.md`
- `docs/superpowers/sdd/progress-closing-lenses.md`
- Specs `docs/superpowers/specs/2026-09-19-{travail,visite,affaires,regroupement}-closing-lens.md`
- Plan `docs/superpowers/plans/2026-09-19-closing-lenses.md`
- Briefs + reviews + re-reviews tâches 1–6

**Data**

`src/data/noc-2021.ts`, `profession-noc.ts`, `work-permits.ts`, `work-fees.ts`, `ircc-work-rules.ts`, `visit-purposes.ts`, `visit-fees.ts`, `visit-funds.ts`, `business-paths.ts`, `business-thresholds.ts`, `family-links.ts`, `family-lico.ts`, `family-fees.ts`, `canada-live.ts`, `profile.ts`, `ircc-times.ts` (délais famille lus par les cartes)

**Libs**

`src/lib/noc-search.ts`, `work-pathways.ts`, `work-cost.ts`, `visit-cost.ts`, `business-cost.ts`, `family-cost.ts`, `closing-pills.ts`, `failure-press.ts`, `household-salaries.ts`, `storage.ts` (normalize)

**UI**

`src/features/noc-search-field.tsx`, `profile.tsx`, `immigration.tsx`, `market.tsx`, `sales.tsx`, `canada.tsx` (consommateur `canadaLivePagesFor`)

**Hors-passe à confirmer**

`src/data/pitch.ts`, `src/features/pitch.tsx`, `src/catalog.ts` (`slideCount`)

Tests colocalisés lus en appui (pas exécutés): `work-pathways.test.ts`, `work-permits.test.ts` / `work-fees`, `visit-cost.test.ts`, `family-cost.test.ts`, `canada-live.test.ts`, `profile.test.ts`, `immigration.test.ts`, `sales.test.ts`, `household-salaries.test.ts`, `failure-press.test.ts`, `market.test.ts`.

---

## Les quatre objectifs closent

Études était déjà livré (`StudyFields` / `StudyClosingCards` / `studyOverlays` / `studyDeckPills`) et reste en place.

| Objectif | Helper | Profil (Candidat seulement) | Voies (`slideCount` 2) | Menu |
|---|---|---|---|---|
| Travail | `workPathways` + `workCost` | CNP/FEER, permis, offre | `WorkClosingCards` | overlay Canada Live, budget permis/vie/fonds, SOWP si admissible, pastille `CNP · FEER n` |
| Visite | `visitCost` (`canWork: false`) | motif, durée | `VisitClosingCards` | overlay séjour, pas `WorkBenefits`, budget visa/séjour/fonds, copy « pas un droit de travailler » |
| Affaires | `businessCost` | 4 volets, pas de Start-up sélectionnable | `BusinessClosingCards` + grille 13 + pause SUV | overlay C11/PNP/pause, budget selon visiteur vs autre, `WorkBenefits` masqué si `visitor` |
| Regroupement | `familyCost` (`link` undefined si vide) | lien + statut répondant | `FamilyClosingCards` (4 cartes, prompt si pas de lien) | overlay catégorie familiale, MNI + foyer réuni, `money` même en Seul(e) |

RP reste l’identité Canada Live par défaut. Pitch n’est pas greffé.

---

## Contraintes — confirmations (file:line)

**Helpers + catalogues sourcés (pas de nombres IRCC inventés dans l’UI)**

- Travail: frais 155 / +100 ouvert-IEC / biométrie 85–170 — `src/data/work-fees.ts:3-28`. UI lit `cost.fees` / `pathways.renewal.fees` — `src/features/immigration.tsx:387-408`.
- IEC traité comme ouvert pour le +100 $ et le renouvellement « changement d’employeur » — `src/data/work-fees.ts:20-21`, `src/lib/work-pathways.ts:136-153`. Catalogue IEC reste `openVsClosed: "varies"` — `src/data/work-permits.ts:41-47`.
- Visite: séjour = panier mensuel × facteur (pas annualisé) ; `canWork: false` — `src/lib/visit-cost.ts:22-27,56,72`. Copy no-work — `src/features/immigration.tsx:575-576`. `WorkBenefitsSection` masqué si Visite ou Affaires+visitor — `src/features/market.tsx:78-82,148-168`.
- Affaires: 4 volets, `startupVisaPaused: true`, pas d’id `startup` — `src/data/business-paths.ts:12-50`. 13 codes QC…NU — `src/data/business-thresholds.ts:1-53` alignés sur `provinceData` (`src/data/provinces.ts:12-120`).
- Famille: `familyLinkById("")` → `undefined` ; `familyCost` ne simule pas un conjoint — `src/data/family-links.ts:35-37`, `src/lib/family-cost.ts:17-21,47`. Carte 4 = prompt — `src/features/immigration.tsx:890-894`. Délais lus depuis `cost.delay.tracks` (pas de littéraux `14-20 mois` / `36 mois` dans l’UI) — `src/features/immigration.tsx:783-790`.
- Chips Profil Candidat seulement (conjoint / épouses sans `work`/`visit`/`business`/`family`) — `src/features/profile.tsx:149-193,358-430`.
- Permis Voies neutre si `workPermitKind` vide — `src/features/immigration.tsx:394-397`.
- `closingDeckPills` partagé (Voies, Comparateur, menu, Échecs, Écosystème) — `src/lib/closing-pills.ts:7-25`.
- Échecs: `money` forcé Affaires / Regroupement, y compris Seul(e), cap 3 — `src/lib/failure-press.ts:3-16`.
- Emplois/salaires: Visite = market only ; Travail SOWP seulement si `spouseOpen.eligible` ; parent = 1 groupe ; conjoint parrainé = 2× market, pas `openWork` — `src/lib/household-salaries.ts:104-133`.
- Calculateurs: branches mutuellement exclusives, Études d’abord, fallback RP — `src/features/market.tsx:1271-1320`.
- Apostrophe U+2019 dans les chaînes UI neuves (ex. placeholder CNP) — `src/features/noc-search-field.tsx:67`.

**Pitch intact (inspection, pas de git)**

- `src/features/pitch.tsx` reste un `PitchDeck` sur `pitchSlides` ; aucun import `workCost` / `visitCost` / `businessCost` / `familyCost` / `closingDeckPills` / `NocSearchField`.
- `src/data/pitch.ts` n’expose pas les catalogues de closing. Mapping d’héros par objectif (l.160-163) = visuel Pitch, pas une fiche de closing.

**RP = identité Canada Live par défaut**

- `defaultProfile.objective === "Résidence permanente"` — `src/data/profile.ts:114`.
- `canadaLivePagesFor` retourne `canadaLivePages` (même référence) si RP — `src/data/canada-live.ts:796-797`.
- Test d’identité — `src/data/canada-live.test.ts:117-120`.
- Consommateur: `canadaLivePagesFor(s.draft)` — `src/features/canada.tsx:16-18`.
- Overlays Travail / Visite / Affaires / Regroupement + Études déjà là ; 4 pages conservées — `src/data/canada-live.ts:462-819`, `src/catalog.ts:41`.

**Voies `slideCount` 2**

- `src/catalog.ts:47`. Cartes de closing dans le détail existant, pas de 3ᵉ slide — `src/features/immigration.tsx:67-68,159-163`.

**Champs profil déjà normalisés**

- Types + défauts vides — `src/data/profile.ts:52-59,121-128`.
- `normalizeProfile` allow-list (CNP 5 chiffres, permis, motif, durée, volet, lien, statut) ; `startup` / lien inconnu → `""` — `src/lib/storage.ts:64-71,95-132`.

---

## Findings

### Critical

Aucun.

### Important

Aucun. Rien que je bloquerais au merge à ≥ 80 % de confiance.

Les deux correctifs qui avaient bloqué des gates de tâche sont bien dans l’arbre actuel:

- Permis Voies: plus de fallback `pathways.permits[0]` ; invite « Choisissez un type de permis » — `src/features/immigration.tsx:394-397`.
- Délais famille: `cost.delay.tracks` par libellé — `src/features/immigration.tsx:783-790`.
- Écosystème: plus de `market.province` dans `EcosystemSection` — `src/features/sales.tsx:156-161` (la pill province reste volontairement sur Échecs — `src/features/sales.tsx:47-52`).

---

## Triage des mineurs différés

Aucun de ces trois points n’est requis avant de considérer la passe livrable. Ce sont des trous de couverture, pas des bugs produit observables dans le code actuel.

### 1. Test Affaires « pas de startup » = chaîne de commentaire — **peut attendre**

- Test: `src/features/profile.test.ts:202` exige `path.id !== "startup"`.
- Le composant satisfait ça via un commentaire — `src/features/profile.tsx:845-850`.
- Le vrai contrat tient: `businessPaths` n’a que `visitor | c11 | ict | pnp-entrepreneur` — `src/data/business-paths.ts:12-45` ; les chips mappent ce catalogue ; `normalizeBusinessPath` refuse `startup` — `src/lib/storage.ts:98,123-125`.
- Risque futur seulement: si un id `startup` entre dans le catalogue, le commentaire continuerait de faire passer le test. Serrer le test plus tard (`businessPaths.map(p => p.id)` ne contient pas `startup`, ou assertion sur le rendu). **Ne bloque pas le ship.**

### 2. Pas de test d’interaction `NocSearchField` — **peut attendre**

- Aucun `noc-search-field.test.ts`. Les suites Profil/Voies font du `readFileSync` / `toContain`.
- Le composant implémente le contrat: seuil 2 caractères, 8 résultats, Enter = 1er, Escape ferme, pastille + Effacer, suggestion non écrite — `src/features/noc-search-field.tsx:25-115`. Branché Profil + Voies — `src/features/profile.tsx:761-765`, `src/features/immigration.tsx:329-333`.
- Ajouter un test d’interaction plus tard. **Ne bloque pas le ship.**

### 3. Test pills Écosystème sans `not.toContain("market.province")` — **peut attendre**

- Test actuel: `src/features/sales.test.ts:116-120` (présence `closingDeckPills`, absence tags piliers).
- L’UI est déjà conforme: foyer + objectif + study + closing, pas de province — `src/features/sales.tsx:156-161`.
- Serrer le test en post-merge pour éviter une régression. **Ne bloque pas le ship.**

---

## Hors revue (non bloquant)

- Suite Vitest complète: non relancée (contrôleur).
- Vérif navigateur des 4 objectifs: pending (ledger).
- Sans git, « Pitch untouched » = inspection d’absence de greffe closing, pas un diff d’octets.
- Polish non bloquant (vide Travail: renouvellement retombe sur fermé si aucun permis ; `prAfter` affiche `FEER ?` sans CNP). Visite marque déjà ces vides en « aperçu ». Confiance trop basse pour un veto merge.

---

## Verdict

**SHIP.** Les quatre objectifs (Travail / Visite / Affaires / Regroupement familial) closent par helpers sourcés, champs Profil Candidat, cartes Voies dans `slideCount` 2, et overlays menu. Études inchangé. Pitch non greffé. RP conserve l’identité `canadaLivePages`. IEC ouvert pour +100 $ / renouvellement. Visite `canWork: false` + `WorkBenefits` masqué. `familyLink` vide ne simule pas un conjoint. Aucun Critical / Important à ≥ 80 %. Les mineurs différés peuvent attendre.
