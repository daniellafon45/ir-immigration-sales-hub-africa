# Import / Export Profil Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enregistrer télécharge un fichier JSON réimportable ; Importer applique ce fichier au formulaire et à toute la plateforme, sans `localStorage`.

**Architecture:** Module pur `src/lib/profile-file.ts` (sérialiser / parser / nommer). Le store Zustand applique le profil en mémoire (`commit`, `importDraft`, `reset`) sans `saveProfile` / `loadProfile`. L’UI du panneau principal ajoute le bouton Importer au-dessus d’Enregistrer et déclenche le téléchargement.

**Tech Stack:** React 19, TypeScript, Zustand, Vitest (tests unitaires du parser + inspection source comme `src/features/profile.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- Report file goes next to the brief. Skip git commits; status DONE still applies.
- User-facing language stays French. Code, types, and test names stay in the existing English style.
- Portable file `kind` is exactly `ir-sales-hub-profile`. `version` is exactly `1`.
- Error strings are exactly `Fichier JSON invalide.` and `Ce fichier n'est pas un profil IR Sales Hub.`
- Import button label is exactly `Importer un profil client`. Success label is exactly `Importé`.
- Save still shows `Enregistrer` / `Enregistré` with the existing 1800 ms check state.
- Import applies `draft` **and** `profile` immediately (pitch / opportunités / immigration / closing update without a second save).
- Store init uses `structuredClone(defaultProfile)`, not `loadProfile()`.
- `commit` and `reset` must not call `saveProfile`.
- `profile-file.ts` has no DOM (`document`, `Blob`, `URL`, `localStorage`).
- Do not add a profile library, CSV, or confirmation dialog.
- Follow existing Vitest patterns. Parser tests import and call functions. UI tests read `profile.tsx` / `profile.ts` source.
- Reuse `normalizeProfile` from `@/lib/storage` on import.

## File structure

- Create: `src/lib/profile-file.ts` — serialize, parse, filename.
- Create: `src/lib/profile-file.test.ts`
- Modify: `src/store/profile.ts` — drop localStorage I/O; add `importDraft`.
- Create: `src/store/profile.test.ts` — store behavior + source inspection.
- Modify: `src/features/profile.tsx` — import button, file input, download on save.
- Modify: `src/features/profile.test.ts` — source inspection for import/export UI.

---

### Task 1: Portable profile file codec

**Files:**
- Create: `src/lib/profile-file.ts`
- Test: `src/lib/profile-file.test.ts`

**Interfaces:**
- Consumes: `Profile` from `@/data/profile`; `normalizeProfile` from `@/lib/storage`
- Produces:
  - `export const PROFILE_FILE_KIND = "ir-sales-hub-profile"`
  - `export const PROFILE_FILE_VERSION = 1`
  - `export type ProfileFileDocument = { kind: typeof PROFILE_FILE_KIND; version: typeof PROFILE_FILE_VERSION; exportedAt: string; profile: Profile }`
  - `export type ParseProfileFileResult = { ok: true; profile: Profile } | { ok: false; error: string }`
  - `export function serializeProfileFile(profile: Profile, exportedAt?: string): string`
  - `export function parseProfileFile(text: string): ParseProfileFileResult`
  - `export function profileFileName(profile: Profile): string`

- [ ] **Step 1: Write the failing test**

Create `src/lib/profile-file.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import {
  PROFILE_FILE_KIND,
  PROFILE_FILE_VERSION,
  parseProfileFile,
  profileFileName,
  serializeProfileFile,
} from "@/lib/profile-file";

describe("profileFileName", () => {
  it("slugs the applicant first name", () => {
    expect(profileFileName(defaultProfile)).toBe("profil-loriane.json");
  });

  it("falls back when the first name is blank", () => {
    const profile = structuredClone(defaultProfile);
    profile.applicant.firstName = "  ";
    expect(profileFileName(profile)).toBe("profil-client.json");
  });

  it("strips accents", () => {
    const profile = structuredClone(defaultProfile);
    profile.applicant.firstName = "Aïcha";
    expect(profileFileName(profile)).toBe("profil-aicha.json");
  });
});

describe("serializeProfileFile / parseProfileFile", () => {
  it("round-trips the default profile", () => {
    const text = serializeProfileFile(defaultProfile, "2026-09-18T14:30:00.000Z");
    const parsed = JSON.parse(text) as Record<string, unknown>;
    expect(parsed.kind).toBe(PROFILE_FILE_KIND);
    expect(parsed.version).toBe(PROFILE_FILE_VERSION);
    expect(parsed.exportedAt).toBe("2026-09-18T14:30:00.000Z");
    const result = parseProfileFile(text);
    expect(result).toEqual({ ok: true, profile: defaultProfile });
  });

  it("round-trips extra spouses and children", () => {
    const profile = structuredClone(defaultProfile);
    profile.family = "Polygame";
    profile.extraSpouses = [
      {
        id: "spouse-awa",
        firstName: "Awa",
        age: 28,
        jobTitle: "",
        profession: "Infirmier(ère)",
        sector: "Santé",
        salary: "Bonne",
        experience: 6,
        education: "Baccalauréat / Licence",
        french: "Avancé",
        english: "Intermédiaire",
      },
    ];
    profile.children = [{ id: "child-1", firstName: "Noah", age: 6 }];
    const result = parseProfileFile(serializeProfileFile(profile, "2026-09-18T14:30:00.000Z"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.family).toBe("Polygame");
    expect(result.profile.extraSpouses[0]?.firstName).toBe("Awa");
    expect(result.profile.children[0]).toEqual({ id: "child-1", firstName: "Noah", age: 6 });
  });

  it("normalizes a partial wrapped profile", () => {
    const text = JSON.stringify({
      kind: PROFILE_FILE_KIND,
      version: PROFILE_FILE_VERSION,
      exportedAt: "2026-09-18T14:30:00.000Z",
      profile: { applicant: { firstName: "Awa" } },
    });
    const result = parseProfileFile(text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.applicant.firstName).toBe("Awa");
    expect(result.profile.country).toBe(defaultProfile.country);
  });

  it("rejects invalid JSON", () => {
    expect(parseProfileFile("")).toEqual({ ok: false, error: "Fichier JSON invalide." });
    expect(parseProfileFile("{")).toEqual({ ok: false, error: "Fichier JSON invalide." });
  });

  it("rejects documents that are not IR profile files", () => {
    const error = { ok: false, error: "Ce fichier n'est pas un profil IR Sales Hub." };
    expect(parseProfileFile("{}")).toEqual(error);
    expect(parseProfileFile(JSON.stringify({ kind: "other", profile: {} }))).toEqual(error);
    expect(parseProfileFile(JSON.stringify({ kind: PROFILE_FILE_KIND }))).toEqual(error);
    expect(parseProfileFile("null")).toEqual(error);
    expect(parseProfileFile("[]")).toEqual(error);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/profile-file.test.ts`

Expected: FAIL because `@/lib/profile-file` is not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/profile-file.ts`:

```ts
import type { Profile } from "@/data/profile";
import { normalizeProfile } from "@/lib/storage";

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

export function serializeProfileFile(profile: Profile, exportedAt = new Date().toISOString()): string {
  const document: ProfileFileDocument = {
    kind: PROFILE_FILE_KIND,
    version: PROFILE_FILE_VERSION,
    exportedAt,
    profile,
  };
  return `${JSON.stringify(document, null, 2)}\n`;
}

export function parseProfileFile(text: string): ParseProfileFileResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Fichier JSON invalide." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Ce fichier n'est pas un profil IR Sales Hub." };
  }
  const doc = parsed as Record<string, unknown>;
  if (
    doc.kind !== PROFILE_FILE_KIND ||
    !doc.profile ||
    typeof doc.profile !== "object" ||
    Array.isArray(doc.profile)
  ) {
    return { ok: false, error: "Ce fichier n'est pas un profil IR Sales Hub." };
  }
  return { ok: true, profile: normalizeProfile(doc.profile as Record<string, unknown>) };
}

export function profileFileName(profile: Profile): string {
  const raw = profile.applicant.firstName.trim();
  if (!raw) return "profil-client.json";
  const slug = raw
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `profil-${slug}.json` : "profil-client.json";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/profile-file.test.ts`

Expected: PASS

- [ ] **Step 5: Skip commit**

Do not run git. Write the report file.

---

### Task 2: Store import and in-memory commit

**Files:**
- Modify: `src/store/profile.ts`
- Create: `src/store/profile.test.ts`

**Interfaces:**
- Consumes: `serialize`/`parse` from Task 1 are **not** imported here. Consumes `defaultProfile` and profile types. Stops importing `loadProfile` / `saveProfile`.
- Produces: `importDraft: (profile: Profile) => void` on `ProfileState`. `commit()` copies `draft` → `profile` in memory only. `reset()` restores `defaultProfile` in memory only. Initial state is `structuredClone(defaultProfile)` for both `profile` and `draft`.

- [ ] **Step 1: Write the failing test**

Create `src/store/profile.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import { useProfileStore } from "@/store/profile";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "profile.ts"), "utf8");

describe("profile store source", () => {
  it("does not persist commit or reset to localStorage", () => {
    expect(source).not.toContain("loadProfile");
    expect(source).not.toContain("saveProfile");
    expect(source).toContain("importDraft");
  });
});

describe("profile store", () => {
  beforeEach(() => {
    useProfileStore.setState({
      profile: structuredClone(defaultProfile),
      draft: structuredClone(defaultProfile),
    });
  });

  it("commit copies draft onto profile without requiring a file", () => {
    useProfileStore.getState().patchApplicant({ firstName: "Awa" });
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Loriane");
    useProfileStore.getState().commit();
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Awa");
    expect(useProfileStore.getState().draft.applicant.firstName).toBe("Awa");
  });

  it("importDraft sets draft and live profile immediately", () => {
    const next = structuredClone(defaultProfile);
    next.applicant.firstName = "Nadia";
    next.province = "Ontario";
    useProfileStore.getState().importDraft(next);
    expect(useProfileStore.getState().draft.applicant.firstName).toBe("Nadia");
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Nadia");
    expect(useProfileStore.getState().profile.province).toBe("Ontario");
    expect(useProfileStore.getState().draft.province).toBe("Ontario");
  });

  it("reset restores the default profile in memory", () => {
    useProfileStore.getState().patchApplicant({ firstName: "Awa" });
    useProfileStore.getState().commit();
    useProfileStore.getState().reset();
    expect(useProfileStore.getState().profile).toEqual(defaultProfile);
    expect(useProfileStore.getState().draft).toEqual(defaultProfile);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/store/profile.test.ts`

Expected: FAIL — source still contains `loadProfile` / `saveProfile`, and `importDraft` is missing.

- [ ] **Step 3: Write minimal implementation**

In `src/store/profile.ts`:

1. Remove the `loadProfile, saveProfile` import from `@/lib/storage`.
2. Add `importDraft: (profile: Profile) => void;` to `ProfileState`.
3. Replace initial state and persistence methods with:

```ts
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: structuredClone(defaultProfile),
  draft: structuredClone(defaultProfile),
  setProject: (key, value) =>
    set((state) => ({
      draft:
        key === "family"
          ? draftWithFamily(state.draft, String(value))
          : { ...state.draft, [key]: value },
    })),
  patchApplicant: (patch) =>
    set((state) => ({
      draft: { ...state.draft, applicant: { ...state.draft.applicant, ...patch } },
    })),
  patchSpouse: (patch) =>
    set((state) => ({
      draft: { ...state.draft, spouse: { ...state.draft.spouse, ...patch } },
    })),
  addExtraSpouse: () =>
    set((state) => {
      if (state.draft.extraSpouses.length >= 2) return state;
      return {
        draft: {
          ...state.draft,
          family: familyIsPolygamous(state.draft.family) ? state.draft.family : "Polygame",
          extraSpouses: [...state.draft.extraSpouses, createExtraSpouse()],
        },
      };
    }),
  patchExtraSpouse: (id, patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        extraSpouses: state.draft.extraSpouses.map((spouse) =>
          spouse.id === id ? ({ ...spouse, ...patch } satisfies ExtraSpouse) : spouse,
        ),
      },
    })),
  removeExtraSpouse: (id) =>
    set((state) => {
      const extraSpouses = state.draft.extraSpouses.filter((spouse) => spouse.id !== id);
      const principalMode =
        extraSpouseId(state.draft.principalMode) === id ? "auto" : state.draft.principalMode;
      return {
        draft: {
          ...state.draft,
          extraSpouses:
            familyIsPolygamous(state.draft.family) && extraSpouses.length === 0
              ? [createExtraSpouse()]
              : extraSpouses,
          principalMode,
        },
      };
    }),
  addChild: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        family: familyAfterChild(state.draft.family),
        children: [...state.draft.children, createChild()],
      },
    })),
  patchChild: (id, patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        children: state.draft.children.map((child) =>
          child.id === id ? { ...child, ...patch } : child,
        ),
      },
    })),
  removeChild: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        children: state.draft.children.filter((child) => child.id !== id),
      },
    })),
  commit: () => {
    const { draft } = get();
    set({ profile: draft, draft });
  },
  importDraft: (profile) => {
    const next = structuredClone(profile);
    set({ profile: next, draft: structuredClone(next) });
  },
  reset: () => {
    const next = structuredClone(defaultProfile);
    set({ profile: next, draft: structuredClone(next) });
  },
}));
```

Keep `setProject`, family helpers, and extra-spouse/child methods unchanged besides the persistence edits above. Do not rewrite unrelated store logic.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/store/profile.test.ts src/lib/storage.test.ts src/lib/profile-file.test.ts`

Expected: PASS. `storage.test.ts` still covers `normalizeProfile` / `loadProfile` / `saveProfile` as library helpers.

- [ ] **Step 5: Skip commit**

Do not run git. Write the report file.

---

### Task 3: Import button and download on save

**Files:**
- Modify: `src/features/profile.tsx`
- Modify: `src/features/profile.test.ts`

**Interfaces:**
- Consumes: `parseProfileFile`, `serializeProfileFile`, `profileFileName` from `@/lib/profile-file`; `importDraft` from `useProfileStore`
- Produces: `PrincipalPanel` receives `imported: boolean`, `importError: string | null`, `onImport: () => void` in addition to existing `saved` / `onSave`. Hidden file input `type="file"` `accept=".json,application/json"` `className="hidden"` `aria-label="Importer un profil client"`. Import button sits immediately above Enregistrer.

- [ ] **Step 1: Write the failing test**

Append to `src/features/profile.test.ts`:

```ts
describe("profile file import and export", () => {
  it("places Importer un profil client above Enregistrer", () => {
    const panel = extractFunction("PrincipalPanel");
    const importAt = panel.indexOf("Importer un profil client");
    const saveAt = panel.indexOf("Enregistrer");
    expect(importAt).toBeGreaterThan(-1);
    expect(saveAt).toBeGreaterThan(importAt);
    expect(panel).toContain('type="file"');
    expect(panel).toContain('accept=".json,application/json"');
    expect(panel).toContain('className="hidden"');
    expect(panel).toContain('aria-label="Importer un profil client"');
    expect(panel).toContain("Upload");
    expect(panel).toContain("Importé");
    expect(panel).toContain("importError");
    expect(panel).toContain("text-[#ffd4d4]");
  });

  it("downloads a portable profile file on save", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("serializeProfileFile");
    expect(form).toContain("profileFileName");
    expect(form).toContain("parseProfileFile");
    expect(form).toContain("importDraft");
    expect(form).toContain("downloadJson");
    expect(source).toContain("function downloadJson");
    expect(source).toContain('type: "application/json"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/profile.test.ts`

Expected: FAIL because `PrincipalPanel` has no import button / file input, and `ProfileForm.save` does not download.

- [ ] **Step 3: Write minimal implementation**

In `src/features/profile.tsx`:

1. Add `Upload` to the lucide-react import list.
2. Add `type ChangeEvent` to the react import.
3. Add:

```ts
import { parseProfileFile, profileFileName, serializeProfileFile } from "@/lib/profile-file";
```

4. Add this helper near the other local helpers (after `initials` is fine):

```ts
function downloadJson(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
```

5. In `ProfileForm`, add `importDraft`, file ref, import UI state, and wire save/import:

```ts
  const commit = useProfileStore((s) => s.commit);
  const importDraft = useProfileStore((s) => s.importDraft);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [imported, setImported] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  function save() {
    commit();
    downloadJson(profileFileName(draft), serializeProfileFile(draft));
    setSaved(true);
  }

  async function onImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const text = await file.text();
    const result = parseProfileFile(text);
    if (!result.ok) {
      setImportError(result.error);
      setImported(false);
      return;
    }
    importDraft(result.profile);
    setImportError(null);
    setImported(true);
  }
```

Keep the existing `saved` timeout `useEffect`. Add a second effect for `imported` with the same 1800 ms delay.

6. Pass new props into `PrincipalPanel`:

```tsx
            <PrincipalPanel
              draft={draft}
              analysis={analysis}
              principal={principal}
              showSpouse={showSpouse}
              polygamous={polygamous}
              saved={saved}
              imported={imported}
              importError={importError}
              fileRef={fileRef}
              onImportFile={onImportFile}
              onImport={() => fileRef.current?.click()}
              onSave={save}
              onMode={(mode) => setProject("principalMode", mode)}
            />
```

7. Extend `PrincipalPanel` props and replace the single Enregistrer button with:

```tsx
      <div className="mt-3 shrink-0 space-y-2">
        {importError ? (
          <p className="text-[12px] leading-snug text-[#ffd4d4]">{importError}</p>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          aria-label="Importer un profil client"
          onChange={onImportFile}
        />
        <Button
          className="relative h-10 w-full rounded-xl bg-white/10 text-white hover:bg-white/16"
          onClick={onImport}
        >
          {imported ? <Check className="size-4" /> : <Upload className="size-4" />}
          {imported ? "Importé" : "Importer un profil client"}
        </Button>
        <Button
          className={cn(
            "relative h-10 w-full rounded-xl bg-white text-primary hover:bg-secondary",
            saved && "bg-[#e8f6ee] text-[#176b3a] hover:bg-[#e8f6ee]",
          )}
          onClick={onSave}
        >
          {saved ? <Check className="size-4" /> : null}
          {saved ? "Enregistré" : "Enregistrer"}
        </Button>
      </div>
```

Add the matching props to the `PrincipalPanel` function signature:

```ts
  saved,
  imported,
  importError,
  fileRef,
  onImportFile,
  onImport,
  onSave,
  onMode,
}: {
  draft: Profile;
  analysis: ReturnType<typeof recommendPrincipal>;
  principal: AdultMember;
  showSpouse: boolean;
  polygamous: boolean;
  saved: boolean;
  imported: boolean;
  importError: string | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onSave: () => void;
  onMode: (mode: PrincipalMode) => void;
}
```

If `React.RefObject` needs an import, use `import { ..., type ChangeEvent, type RefObject }` and type `fileRef: RefObject<HTMLInputElement | null>`.

Do not restyle the rest of `PrincipalPanel`. Do not add a confirmation dialog.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/profile.test.ts src/lib/profile-file.test.ts src/store/profile.test.ts`

Expected: PASS

Then run: `npx vitest run`

Expected: full suite PASS

- [ ] **Step 5: Skip commit**

Do not run git. Write the report file.

---

## Self-review vs spec

- Portable JSON kind/version/filename/errors → Task 1
- Stop localStorage on commit/reset/init; import applies draft+profile → Task 2
- Button above Enregistrer, download on save, hidden file input, Importé/error states → Task 3
- No placeholders. Types match across tasks (`importDraft(profile: Profile)`, `ParseProfileFileResult`).
