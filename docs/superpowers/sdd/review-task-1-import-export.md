# Review package: Task 1 portable profile file codec

No git. New files only.

## Files changed

- Create: `src/lib/profile-file.ts`
- Create: `src/lib/profile-file.test.ts`

## Diff

### src/lib/profile-file.ts (added)

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

### src/lib/profile-file.test.ts (added)

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
