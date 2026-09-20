## TDD

### RED

Commande :

```bash
npx vitest run src/features/profile.test.ts
```

Sortie :

```text
npm warn Unknown env config "devdir". This will stop working in the next major version of npm.

 RUN  v3.2.7 C:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme

 ❯ src/features/profile.test.ts (13 tests | 2 failed) 236ms
   ✓ profile shader banners > uses the IR water shader on Candidat and Conjoint headers 20ms
   ✓ profile shader banners > exposes a polygamous household with two wife cards 5ms
   ✓ principal mode chips > stretches Auto / applicant / spouse chips to the Profil retenu width 6ms
   ✓ principal mode chips > lets Chip accept a className so mode chips can fill their column 3ms
   ✓ principal panel scroll > scrolls the inner column without a visible scrollbar 8ms
   ✓ profile form column scroll > lets the main column scroll on desktop without a visible scrollbar 7ms
   ✓ profile form column scroll > lets stacked layouts scroll the profile grid without a visible scrollbar 3ms
   ✓ principal panel readability > uses larger, higher-contrast type on PrincipalPanel copy 2ms
   ✓ principal panel readability > uses larger, higher-contrast type on PanelBlock, FactRow, ScoreBar, and ScorePick 4ms
   ✓ country of origin flags > shows a flag next to the selected country and each option 2ms
   ✓ principal panel provincial lever > shows a linguistic qualification lever instead of salary vs local median 1ms
   × profile file import and export > places Importer un profil client above Enregistrer 55ms
     → expected -1 to be greater than -1
   × profile file import and export > downloads a portable profile file on save 83ms
     → expected 'function ProfileForm() {\\r\\n  const d…' to contain 'serializeProfileFile'
```

### GREEN (tests ciblés)

Commande :

```bash
npx vitest run src/features/profile.test.ts src/lib/profile-file.test.ts src/store/profile.test.ts
```

Sortie :

```text
npm warn Unknown env config \"devdir\". This will stop working in the next major version of npm.

 RUN  v3.2.7 C:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme

 ✓ src/features/profile.test.ts (13 tests) 4ms
 ✓ src/store/profile.test.ts (4 tests) 3ms
 ✓ src/lib/profile-file.test.ts (8 tests) 4ms

 Test Files  3 passed (3)
      Tests  25 passed (25)
   Start at  10:58:15
   Duration  2.40s (transform 99ms, setup 0ms, collect 233ms, tests 11ms, environment 4.76s, prepare 635ms)
```

### GREEN (suite complète)

Commande :

```bash
npx vitest run
```

Sortie :

```text
npm warn Unknown env config \"devdir\". This will stop working in the next major version of npm.

 RUN  v3.2.7 C:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme

 ✓ src/components/brand/BrandLogo.test.ts (5 tests) 333ms
 ✓ src/assets/logos/logos.test.ts (3 tests) 7ms
 ✓ src/components/layout/FullscreenButton.test.ts (1 test) 4ms
 ✓ src/components/layout/WorkspaceHeader.test.ts (1 test) 5ms
 ✓ src/features/market.test.ts (8 tests) 9ms
 ✓ src/features/pitch-deck.test.ts (2 tests) 5ms
 ✓ src/lib/fullscreen.test.ts (3 tests) 26ms
 ✓ src/lib/storage.test.ts (5 tests) 30ms
 ✓ src/lib/principal.test.ts (6 tests) 27ms
 ✓ src/lib/format.test.ts (2 tests) 49ms
 ✓ src/lib/smart-copy.test.ts (1 test) 40ms
 ✓ src/data/country-flags.test.ts (3 tests) 25ms
 ✓ src/lib/household-market.test.ts (3 tests) 24ms
 ✓ src/components/brand/BrandLogo.test.tsx (2 tests) 49ms
 ✓ src/components/ui/cards.test.tsx (1 test) 148ms
 ✓ src/data/canada-places.test.ts (18 tests) 45ms
 ✓ src/data/pitch.test.ts (5 tests) 10ms
 ✓ src/data/canada-live.test.ts (10 tests) 14ms
 ✓ src/data/canada-live-media.test.ts (20 tests) 52ms
 ✓ src/lib/province-lever.test.ts (6 tests) 4ms
 ✓ src/lib/finance.test.ts (5 tests) 3ms
 ✓ src/index.css.test.ts (2 tests) 3ms
 ✓ src/lib/season.test.ts (1 test) 3ms
 ✓ src/lib/profile-file.test.ts (8 tests) 6ms
 ✓ src/components/layout/DeckFooter.test.ts (2 tests) 2ms
 ✓ src/features/profile.test.ts (13 tests) 6ms
 ✓ src/store/profile.test.ts (4 tests) 3ms

 Test Files  27 passed (27)
      Tests  140 passed (140)
   Start at  10:59:07
   Duration  13.57s (transform 5.18s, setup 0ms, collect 16.97s, tests 930ms, environment 188.68s, prepare 7.50s)
```

## Fichiers modifiés

- `src/features/profile.test.ts` : réécriture propre du fichier de test existant pour enlever les marqueurs de lignes intégrés, puis ajout du nouveau bloc `describe("profile file import and export", ...)` vérifiant la présence du bouton « Importer un profil client », de l’input fichier caché et du helper `downloadJson` lié aux fonctions `parseProfileFile`, `serializeProfileFile`, `profileFileName` et `importDraft`.
- `src/features/profile.tsx` :
  - Ajout des imports `ChangeEvent`, `RefObject`, `Upload` et des helpers de fichier profil `parseProfileFile`, `profileFileName`, `serializeProfileFile`.
  - Dans `ProfileForm`, ajout de `importDraft`, d’un `fileRef` vers l’`input` fichier, des états `imported` et `importError`, du helper `downloadJson` appelé dans `save`, de la logique `onImportFile` qui lit le fichier JSON, utilise `parseProfileFile` et appelle `importDraft` en cas de succès, avec gestion d’erreur et de timeout visuel pour `imported`.
  - Passage des nouvelles props à `PrincipalPanel` : `imported`, `importError`, `fileRef`, `onImportFile`, `onImport={() => fileRef.current?.click()}` tout en conservant `saved` / `onSave`.
  - Extension des props et de la signature de `PrincipalPanel` pour accepter ces nouveaux champs.
  - Remplacement du bouton unique « Enregistrer » par un bloc contenant : un paragraphe d’erreur conditionnel en rouge pâle, un input fichier caché (`type="file"`, `accept=".json,application/json"`, `className="hidden"`, `aria-label="Importer un profil client"`), un bouton d’import avec icône `Upload` / `Check` et labels « Importer un profil client » / « Importé », puis le bouton d’enregistrement existant (texte et styles inchangés).
  - Ajout de la fonction utilitaire `downloadJson` qui crée un `Blob` JSON, un lien temporaire et déclenche le téléchargement avec le bon `filename` et le `type: "application/json"`.

## Auto‑revue

- La contrainte TDD est respectée : les tests d’import/export ont été ajoutés en premier, exécutés (RED), puis l’implémentation a été faite jusqu’à obtention du GREEN sur les tests ciblés, puis sur toute la suite.
- Les modifications dans `PrincipalPanel` sont limitées à l’ajout des nouveaux contrôles d’import (input caché, message d’erreur, bouton Importer) et au wrap du bouton « Enregistrer » dans un bloc, sans changer les classes, la copie ni la structure des autres sections (bannières shader, chips, scroll, levier provincial, etc.).
- L’`input` fichier `type="file"` réside bien dans `PrincipalPanel` et expose les attributs exacts demandés, ce qui devrait satisfaire le test d’inspection de source et ne pas perturber l’accessibilité.
- `save()` continue d’appeler `commit()` comme avant, avec en plus le téléchargement du fichier profil via `downloadJson(profileFileName(draft), serializeProfileFile(draft))`, ce qui respecte le format portable défini dans `src/lib/profile-file.ts`.
- Les effets de timeout pour `saved` et `imported` sont symétriques (1800 ms) et n’introduisent pas de dépendance circulaire ; ils ne modifient pas la logique métier existante du store.
- Aucune commande git n’a été exécutée et aucun changement de style global ou de texte utilisateur existant n’a été introduit en dehors des nouveaux éléments d’import/export spécifiés dans le brief.

