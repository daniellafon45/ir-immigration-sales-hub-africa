# Review package: Task 3 import button and download on save

No git. Relevant hunks in `src/features/profile.tsx` and tests in `src/features/profile.test.ts`.

## Files changed

- Modify: `src/features/profile.tsx`
- Modify: `src/features/profile.test.ts`

## Diff (functional hunks)

### Imports (profile.tsx)

- `ChangeEvent`, `RefObject` from react
- `Upload` from lucide-react
- `parseProfileFile, profileFileName, serializeProfileFile` from `@/lib/profile-file`

### ProfileForm

- `importDraft` from store
- `fileRef`, `imported`, `importError`
- `save()` calls `commit()` then `downloadJson(profileFileName(draft), serializeProfileFile(draft))`
- `onImportFile` reads file text, `parseProfileFile`, on failure sets `importError`, on success `importDraft` + `imported`
- imported timeout 1800 ms
- PrincipalPanel receives `imported`, `importError`, `fileRef`, `onImportFile`, `onImport`, `onSave`

### downloadJson (after ProfileForm)

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

### PrincipalPanel footer

Import error `text-[#ffd4d4]`, hidden file input `accept=".json,application/json"` `className="hidden"` `aria-label="Importer un profil client"`, button `Importer un profil client` / `Importé` with Upload/Check, then `Enregistrer`.

### Tests appended

`describe("profile file import and export")` with two source-inspection tests matching the brief.
