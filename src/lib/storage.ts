import {
  createChild,
  createExtraSpouse,
  defaultProfile,
  educationLevels,
  emptyAdult,
  extraSpouseId,
  familyHasChildren,
  familyIsPolygamous,
  familyOptions,
  isAppearance,
  isSex,
  languageLevels,
  normalizeFinancialCapacity,
  objectives,
  provinces,
  type AdultMember,
  type ChildMember,
  type ExtraSpouse,
  type PrincipalMode,
  type Profile,
} from "@/data/profile";
import { isStudyLevel, studyProgramById } from "@/data/study-programs";
import { canonicalizeOccupation } from "@/lib/occupation-resolve";

const extraAdultBase: AdultMember = { ...emptyAdult, sex: "Femme" };

export const PROFILE_STORAGE_KEY = "irProfile";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return structuredClone(defaultProfile);
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return structuredClone(defaultProfile);
    return normalizeProfile(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return structuredClone(defaultProfile);
  }
}

export function saveProfile(profile: Profile) {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function normalizeProfile(raw: Record<string, unknown>): Profile {
  const legacy = raw as Record<string, unknown> & Partial<AdultMember> & Partial<Profile>;
  const applicant = mergeAdult(
    defaultProfile.applicant,
    (legacy.applicant as Partial<AdultMember> | undefined) ??
      (legacy.firstName
        ? {
            firstName: String(legacy.firstName),
            age: Number(legacy.age ?? defaultProfile.applicant.age),
            profession: String(legacy.profession ?? defaultProfile.applicant.profession),
            experience: Number(legacy.experience ?? defaultProfile.applicant.experience),
            education: String(legacy.education ?? defaultProfile.applicant.education),
            french: String(legacy.french ?? defaultProfile.applicant.french),
            english: String(legacy.english ?? defaultProfile.applicant.english),
          }
        : undefined),
  );

  const familyRaw = legacy.family === "Famille" ? "Couple + enfant(s)" : legacy.family;
  const profile: Profile = {
    ...structuredClone(defaultProfile),
    country: String(legacy.country ?? defaultProfile.country),
    family: oneOfOr(familyRaw, familyOptions, defaultProfile.family),
    objective: oneOfOr(legacy.objective, objectives, defaultProfile.objective),
    budget: Number(legacy.budget ?? defaultProfile.budget),
    province: oneOfOr(legacy.province, provinces, defaultProfile.province),
    start: String(legacy.start ?? defaultProfile.start),
    principalMode: normalizePrincipalMode(legacy.principalMode),
    studyLevel: isStudyLevel(legacy.studyLevel) ? legacy.studyLevel : "",
    studyProgramId: normalizeStudyProgramId(legacy.studyProgramId, legacy.studyLevel),
    workNocCode: normalizeWorkNocCode(legacy.workNocCode),
    workPermitKind: normalizeWorkPermitKind(legacy.workPermitKind),
    workHasOffer: legacy.workHasOffer === true,
    visitPurpose: normalizeVisitPurpose(legacy.visitPurpose),
    visitDuration: normalizeVisitDuration(legacy.visitDuration),
    businessPath: normalizeBusinessPath(legacy.businessPath),
    familyLink: normalizeFamilyLink(legacy.familyLink),
    sponsorStatus: normalizeSponsorStatus(legacy.sponsorStatus),
    applicant,
    spouse: mergeAdult(emptyAdult, legacy.spouse as Partial<AdultMember> | undefined),
    extraSpouses: Array.isArray(legacy.extraSpouses)
      ? (legacy.extraSpouses as ExtraSpouse[]).map((spouse, index) => ({
          ...mergeAdult(extraAdultBase, spouse),
          id: spouse.id || `spouse-${index}`,
        }))
      : [],
    children: Array.isArray(legacy.children)
      ? (legacy.children as ChildMember[]).map((child, index) => ({
          id: child.id || `child-${index}`,
          firstName: child.firstName ?? "",
          age: Number(child.age || 0),
        }))
      : [],
  };

  if (familyIsPolygamous(profile.family) && profile.extraSpouses.length === 0) {
    const extra = createExtraSpouse();
    profile.extraSpouses = [{ ...mergeAdult(extraAdultBase, extra), id: extra.id }];
  }
  if (familyHasChildren(profile.family) && !familyIsPolygamous(profile.family) && profile.children.length === 0) {
    profile.children = [createChild()];
  }
  const extraId = extraSpouseId(profile.principalMode);
  if (extraId && !profile.extraSpouses.some((spouse) => spouse.id === extraId)) {
    profile.principalMode = "auto";
  }
  return profile;
}

const WORK_PERMIT_KINDS = new Set(["lmia", "imp", "open", "ict", "iec"]);
const VISIT_PURPOSES = new Set(["family", "tourism", "business"]);
const VISIT_DURATIONS = new Set(["15d", "1m", "3m", "6m"]);
const BUSINESS_PATHS = new Set(["visitor", "c11", "ict", "pnp-entrepreneur"]);
const FAMILY_LINKS = new Set(["spouse", "child", "parent"]);
const SPONSOR_STATUSES = new Set(["pr", "citizen"]);

function normalizeWorkNocCode(value: unknown) {
  if (typeof value !== "string") return "";
  return /^\d{5}$/.test(value) ? value : "";
}

function oneOf(value: unknown, allowed: Set<string>) {
  return typeof value === "string" && allowed.has(value) ? value : "";
}

function oneOfOr<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function normalizeWorkPermitKind(value: unknown) {
  return oneOf(value, WORK_PERMIT_KINDS);
}

function normalizeVisitPurpose(value: unknown) {
  return oneOf(value, VISIT_PURPOSES);
}

function normalizeVisitDuration(value: unknown) {
  return oneOf(value, VISIT_DURATIONS);
}

function normalizeBusinessPath(value: unknown) {
  return oneOf(value, BUSINESS_PATHS);
}

function normalizeFamilyLink(value: unknown) {
  return oneOf(value, FAMILY_LINKS);
}

function normalizeSponsorStatus(value: unknown) {
  return oneOf(value, SPONSOR_STATUSES);
}

function normalizeStudyProgramId(value: unknown, level: unknown) {
  if (typeof value !== "string" || !value) return "";
  const program = studyProgramById(value);
  if (!program) return "";
  if (isStudyLevel(level) && program.level !== level) return "";
  return program.id;
}

function normalizePrincipalMode(value: unknown): PrincipalMode {
  if (value === "applicant" || value === "spouse") return value;
  if (typeof value === "string" && extraSpouseId(value)) return value as PrincipalMode;
  return "auto";
}

function mergeAdult(base: AdultMember, patch?: Partial<AdultMember>): AdultMember {
  const merged: AdultMember = patch
    ? {
        ...base,
        ...patch,
        firstName: patch.firstName !== undefined ? String(patch.firstName) : base.firstName,
        jobTitle: String(patch.jobTitle ?? base.jobTitle ?? ""),
        age: Number(patch.age ?? base.age),
        salary: normalizeFinancialCapacity(patch.salary ?? base.salary),
        experience: Number(patch.experience ?? base.experience),
        sex: isSex(patch.sex) ? patch.sex : base.sex,
        look: isAppearance(patch.look) ? patch.look : base.look,
      }
    : { ...base };
  return canonicalizeAdult(merged);
}

function canonicalizeAdult(member: AdultMember): AdultMember {
  const occupation = canonicalizeOccupation(member);
  const education = oneOfOr(member.education, educationLevels, "Baccalauréat / Licence");
  const french = oneOfOr(member.french, languageLevels, "Intermédiaire");
  const english = oneOfOr(member.english, languageLevels, "Intermédiaire");
  return {
    ...member,
    ...occupation,
    education,
    french,
    english,
    salary: normalizeFinancialCapacity(member.salary),
    age: Number(member.age),
    experience: Number(member.experience),
  };
}
