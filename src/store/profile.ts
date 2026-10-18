import { create } from "zustand";
import {
  appearanceFromCountry,
  createChild,
  createExtraSpouse,
  defaultProfile,
  extraSpouseId,
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  type AdultMember,
  type ChildMember,
  type ExtraSpouse,
  type PrincipalMode,
  type Profile,
} from "@/data/profile";
import { eeRoundsSnapshot, latestCutoffs } from "@/data/ee-rounds";
import { findBestPrograms } from "@/lib/best-programs";
import { toEngineProfile } from "@/lib/engine-profile";

type ProfileState = {
  profile: Profile;
  draft: Profile;
  importDraft: (profile: Profile) => void;
  setProject: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
  /** Destination « Toutes » : la province suit les pistes du profil. */
  setAllProvinces: () => void;
  setPrincipalMode: (mode: PrincipalMode) => void;
  patchApplicant: (patch: Partial<AdultMember>) => void;
  patchSpouse: (patch: Partial<AdultMember>) => void;
  addExtraSpouse: () => void;
  patchExtraSpouse: (id: string, patch: Partial<AdultMember>) => void;
  removeExtraSpouse: (id: string) => void;
  addChild: () => void;
  patchChild: (id: string, patch: Partial<ChildMember>) => void;
  removeChild: (id: string) => void;
  commit: () => void;
  reset: () => void;
};

function familyAfterChild(family: string) {
  if (familyHasChildren(family)) return family;
  if (familyIsPolygamous(family)) return family;
  return familyHasSpouse(family) ? "Couple + enfant(s)" : "Parent seul + enfant(s)";
}

function draftWithFamily(draft: Profile, family: string): Profile {
  const next: Profile = { ...draft, family };
  if (familyIsPolygamous(family) && next.extraSpouses.length === 0) {
    next.extraSpouses = [createExtraSpouse()];
  }
  if (!familyIsPolygamous(family)) {
    const extraId = extraSpouseId(next.principalMode);
    if (extraId) next.principalMode = "auto";
  }
  return next;
}

const snapshotCutoffs = latestCutoffs(eeRoundsSnapshot.rounds);

/** En mode « Toutes », remplace la province par celle de la meilleure piste. */
export function resolveProvince(draft: Profile): Profile {
  if (draft.provinceMode !== "all") return draft;
  const suggested = findBestPrograms(toEngineProfile(draft), { cutoffs: snapshotCutoffs }).suggestedProvince;
  return suggested === draft.province ? draft : { ...draft, province: suggested };
}

export const useProfileStore = create<ProfileState>((rawSet, get) => {
  // Toute mise à jour du brouillon repasse par resolveProvince.
  const set = (update: Partial<ProfileState> | ((state: ProfileState) => Partial<ProfileState>)) =>
    rawSet((state) => {
      const next = typeof update === "function" ? update(state) : update;
      return next.draft ? { ...next, draft: resolveProvince(next.draft) } : next;
    });
  return {
  profile: structuredClone(defaultProfile),
  draft: structuredClone(defaultProfile),
  setProject: (key, value) =>
    set((state) => {
      if (key === "family") {
        return { draft: draftWithFamily(state.draft, String(value)) };
      }
      if (key === "country") {
        const look = appearanceFromCountry(String(value));
        return {
          draft: {
            ...state.draft,
            country: String(value),
            applicant: { ...state.draft.applicant, look },
            spouse: { ...state.draft.spouse, look },
            extraSpouses: state.draft.extraSpouses.map((spouse) => ({ ...spouse, look })),
          },
        };
      }
      if (key === "province") {
        return { draft: { ...state.draft, province: String(value), provinceMode: "chosen" } };
      }
      return { draft: { ...state.draft, [key]: value } };
    }),
  setAllProvinces: () => set((state) => ({ draft: { ...state.draft, provinceMode: "all" } })),
  setPrincipalMode: (mode) =>
    set((state) => ({
      draft: { ...state.draft, principalMode: mode },
      profile: { ...state.profile, principalMode: mode },
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
    // in-memory commit only
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
};
});
