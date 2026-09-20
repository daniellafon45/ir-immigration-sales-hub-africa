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
    profile: normalizeProfile(profile as unknown as Record<string, unknown>),
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
  const versionOk = doc.version === undefined || doc.version === PROFILE_FILE_VERSION;
  if (
    doc.kind !== PROFILE_FILE_KIND ||
    !versionOk ||
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

