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
