# Import / export profil client

Date: 2026-09-18

## Décision

Le bouton **Enregistrer** télécharge un fichier JSON portable. Il n’écrit plus dans `localStorage`. Un bouton **Importer un profil client**, placé juste au-dessus, relit ce fichier et applique le profil tout de suite au formulaire **et** au reste de la plateforme (pitch, opportunités, immigration, closing). Un rechargement de page ramène `defaultProfile`.

## Contexte

Aujourd’hui `commit()` copie `draft` vers `profile` et appelle `saveProfile` (`localStorage` clé `irProfile`). Les autres sections lisent `profile`. Il n’existe ni téléchargement ni import fichier. Le type `Profile` inclut déjà candidat, conjoint, `extraSpouses`, enfants, `principalMode`.

## Format de fichier

Document JSON, UTF-8, extension `.json`.

```json
{
  "kind": "ir-sales-hub-profile",
  "version": 1,
  "exportedAt": "2026-09-18T14:30:00.000Z",
  "profile": { }
}
```

- `kind` : exactement `ir-sales-hub-profile`.
- `version` : exactement `1`.
- `exportedAt` : ISO-8601 au moment de l’export. Ignoré à l’import.
- `profile` : objet `Profile` complet (mêmes champs que le store : `country`, `family`, `objective`, `budget`, `province`, `start`, `principalMode`, `applicant`, `spouse`, `extraSpouses`, `children`).

Nom du fichier : `profil-{slug}.json`.

- `slug` = prénom du candidat (`applicant.firstName`), minuscule, accents retirés (NFD), caractères hors `[a-z0-9]+` remplacés par `-`, tirets collapsés.
- Si le prénom est vide : `profil-client.json`.
- Exemple : Loriane → `profil-loriane.json`.

## Modules

| Fichier | Rôle |
| --- | --- |
| `src/lib/profile-file.ts` | Sérialiser, parser, nommer le fichier. Aucun DOM. |
| `src/lib/storage.ts` | `normalizeProfile` reste la normalisation. Plus d’écriture `localStorage` depuis le store. |
| `src/store/profile.ts` | `commit` applique en mémoire seulement. Nouvel `importDraft(profile)` pose `draft` **et** `profile`. Init = `defaultProfile`, pas `loadProfile()`. |
| `src/features/profile.tsx` | Bouton importer + input fichier + téléchargement au clic Enregistrer. |

### API `profile-file.ts`

```ts
export const PROFILE_FILE_KIND = "ir-sales-hub-profile";
export const PROFILE_FILE_VERSION = 1;

export type ProfileFileDocument = {
  kind: typeof PROFILE_FILE_KIND;
  version: typeof PROFILE_FILE_VERSION;
  exportedAt: string;
  profile: Profile;
};

export type ParseProfileFileResult =
  | { ok: true; profile: Profile }
  | { ok: false; error: string };

export function serializeProfileFile(profile: Profile, exportedAt?: string): string;
export function parseProfileFile(text: string): ParseProfileFileResult;
export function profileFileName(profile: Profile): string;
```

`serializeProfileFile` produit le document ci-dessus (`JSON.stringify` avec indent 2). `exportedAt` optionnel pour les tests ; défaut = `new Date().toISOString()`.

`parseProfileFile` :

1. `JSON.parse` — échec → `{ ok: false, error: "Fichier JSON invalide." }`
2. La valeur n’est pas un objet, ou `kind` ≠ `ir-sales-hub-profile`, ou `profile` n’est pas un objet → `{ ok: false, error: "Ce fichier n'est pas un profil IR Sales Hub." }`
3. Succès → `{ ok: true, profile: normalizeProfile(raw.profile) }`

`version` n’est pas un motif de rejet pour `1` : un document `kind` correct avec un `profile` objet est accepté. Les champs manquants passent par `normalizeProfile` (même comportement que l’ancien `localStorage`).

## Flux

**Enregistrer**

1. `commit()` : `profile = draft` en mémoire. Pas de `saveProfile`.
2. Télécharger `serializeProfileFile(draft)` sous `profileFileName(draft)`.
3. Feedback bouton : `Enregistré` + icône check, 1,8 s (inchangé).

**Importer**

1. Clic → ouvre le sélecteur de fichiers (`accept=".json,application/json"`).
2. Lecture texte du premier fichier.
3. `parseProfileFile` : si `ok: false`, afficher `error` au-dessus des boutons, ne pas toucher au store.
4. Si `ok: true` : `importDraft(profile)` pose `draft` et `profile` à la copie importée. Pitch, opportunités, immigration et closing lisent déjà `profile` : mise à jour immédiate, sans second clic Enregistrer.
5. Vider l’input fichier pour pouvoir réimporter le même fichier.
6. Effacer le message d’erreur. Feedback court `Importé` (même durée que Enregistré).

**Démarrage**

Le store initialise `profile` et `draft` avec `structuredClone(defaultProfile)`. Il n’appelle plus `loadProfile()`. Un F5 perd le dossier en cours, sauf réimport du fichier.

`reset()` remet `defaultProfile` en mémoire et n’écrit plus dans `localStorage`.

## Interface

Dans `PrincipalPanel`, colonne des actions en bas :

1. Message d’erreur import, si présent : texte `[12px]`, couleur claire sur fond navy (`text-[#ffd4d4]`).
2. Bouton **Importer un profil client** : pleine largeur, `h-10`, `rounded-xl`, style outline blanc sur navy (`bg-white/10 text-white hover:bg-white/16`), icône `Upload`.
3. Bouton **Enregistrer** : inchangé (fond blanc, `Enregistré` / check).

Input fichier caché (`className="hidden"`), `aria-label="Importer un profil client"`. Pas de dialogue de confirmation : l’import écrase le draft courant.

## Erreurs

Libellés exacts :

| Cas | Message |
| --- | --- |
| JSON illisible / fichier vide | `Fichier JSON invalide.` |
| Objet sans `kind` IR, ou sans objet `profile` | `Ce fichier n'est pas un profil IR Sales Hub.` |

Pas de toast. Pas d’import partiel. Un échec laisse le dossier affiché tel quel.

## Tests

Vitest dans `src/lib/profile-file.test.ts` :

- Round-trip `serializeProfileFile` → `parseProfileFile` sur `defaultProfile` (prénoms, conjoint, `extraSpouses`, enfants, `principalMode`).
- Nom de fichier : Loriane → `profil-loriane.json` ; prénom vide → `profil-client.json` ; Aïcha → `profil-aicha.json`.
- Rejet : texte non JSON ; `{}` ; `{ kind: "other", profile: {} }` ; `{ kind: "ir-sales-hub-profile" }` sans `profile`.
- Document `kind` correct + `profile` partiel (ex. `{ applicant: { firstName: "Awa" } }`) → succès, `applicant.firstName === "Awa"`, reste normalisé.

`src/lib/storage.test.ts` : les tests `normalizeProfile` / `loadProfile` restent. Inspection source `src/store/profile.ts` : `commit` et `reset` n’appellent plus `saveProfile`.

Inspection source `src/features/profile.test.ts` :

- `PrincipalPanel` contient `Importer un profil client` au-dessus de `Enregistrer`.
- Input `type="file"` avec `accept` contenant `.json`.

## Hors scope

Bibliothèque de profils, CSV, confirmation avant écrasement, conservation `localStorage` après F5, commits git (pas de repo projet).
