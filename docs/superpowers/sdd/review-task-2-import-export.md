# Review package: Task 2 store import and in-memory commit

No git. Modified/created files.

## Files changed

- Modify: `src/store/profile.ts`
- Create: `src/store/profile.test.ts`

## Diff (full current files)

### src/store/profile.ts

```ts
import { create } from "zustand";
import {
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
  type Profile,
} from "@/data/profile";

type ProfileState = {
  profile: Profile;
  draft: Profile;
  importDraft: (profile: Profile) => void;
  setProject: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
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
}));
```

### src/store/profile.test.ts (added)

Full file at `src/store/profile.test.ts` — source inspection forbids `loadProfile`/`saveProfile`, runtime tests for commit, importDraft, reset.
