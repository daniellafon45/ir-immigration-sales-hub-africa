### Task 1: householdJobs helper + job professions

**Files:**
- Modify: `src/data/jobs.ts`
- Create: `src/lib/household-jobs.ts`
- Test: `src/lib/household-jobs.test.ts`

**Interfaces:**
- Consumes: `Job` / `jobs` from `@/data/jobs`; `householdMarket` from `@/lib/household-market`
- Produces: `Job.profession: string`; `export type HouseholdJobGroup`; `export type HouseholdJobs`; `export function householdJobs(profile: Profile, options?: { intlOnly?: boolean }): HouseholdJobs`

- [ ] **Step 1: Write the failing test**

Create `src/lib/household-jobs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { jobs } from "@/data/jobs";
import { householdJobs } from "@/lib/household-jobs";

describe("jobs professions", () => {
  it("tags the original five listings as Comptable without changing their demo copy", () => {
    const accountants = jobs.filter((job) => job.profession === "Comptable");
    expect(accountants).toHaveLength(5);
    expect(accountants.map((job) => job.title)).toEqual([
      "Comptable",
      "Technicien comptable",
      "Analyste financier",
      "Commis comptable",
      "Contrôleur adjoint",
    ]);
    expect(accountants.map((job) => job.intl)).toEqual([true, false, true, true, false]);
  });

  it("adds developer and nurse demo jobs", () => {
    expect(jobs.filter((job) => job.profession === "Développeur logiciel")).toHaveLength(3);
    expect(jobs.filter((job) => job.profession === "Infirmier(ère)")).toHaveLength(2);
  });
});

describe("householdJobs", () => {
  it("splits the default couple into Comptable and Développeur logiciel groups", () => {
    const view = householdJobs(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].adult.member.firstName).toBe("Loriane");
    expect(view.groups[0].jobs).toHaveLength(5);
    expect(view.groups[1].adult.member.firstName).toBe("Marc");
    expect(view.groups[1].jobs).toHaveLength(3);
    expect(view.totalCount).toBe(8);
    expect(view.intlCount).toBe(5);
  });

  it("keeps a single group when the family is Seul(e)", () => {
    const view = householdJobs({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].jobs).toHaveLength(5);
  });

  it("filters international jobs per adult", () => {
    const view = householdJobs(defaultProfile, { intlOnly: true });
    expect(view.groups[0].jobs).toHaveLength(3);
    expect(view.groups[1].jobs).toHaveLength(2);
    expect(view.groups.every((group) => group.jobs.every((job) => job.intl))).toBe(true);
    expect(view.totalCount).toBe(5);
    expect(view.intlCount).toBe(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/household-jobs.test.ts`
Expected: FAIL (missing module and/or `profession`).

- [ ] **Step 3: Write minimal implementation**

Replace `src/data/jobs.ts` with:

```ts
export type Job = {
  title: string;
  company: string;
  city: string;
  salary: string;
  intl: boolean;
  profession: string;
};

export const jobs: Job[] = [
  {
    title: "Comptable",
    company: "Groupe Services Nord",
    city: "Montréal, QC",
    salary: "70 000 $ à 86 000 $",
    intl: true,
    profession: "Comptable",
  },
  {
    title: "Technicien comptable",
    company: "Finances Horizon",
    city: "Laval, QC",
    salary: "28 $ à 34 $ / h",
    intl: false,
    profession: "Comptable",
  },
  {
    title: "Analyste financier",
    company: "Prairies Énergie",
    city: "Calgary, AB",
    salary: "82 000 $ à 103 000 $",
    intl: true,
    profession: "Comptable",
  },
  {
    title: "Commis comptable",
    company: "Atlantique Distribution",
    city: "Moncton, NB",
    salary: "25 $ à 30 $ / h",
    intl: true,
    profession: "Comptable",
  },
  {
    title: "Contrôleur adjoint",
    company: "Ontario Manufacturing",
    city: "Ottawa, ON",
    salary: "88 000 $ à 110 000 $",
    intl: false,
    profession: "Comptable",
  },
  {
    title: "Développeur logiciel",
    company: "Nexora Labs",
    city: "Montréal, QC",
    salary: "85 000 $ à 110 000 $",
    intl: true,
    profession: "Développeur logiciel",
  },
  {
    title: "Développeur full-stack",
    company: "Horizon Numérique",
    city: "Toronto, ON",
    salary: "92 000 $ à 125 000 $",
    intl: true,
    profession: "Développeur logiciel",
  },
  {
    title: "Intégrateur web",
    company: "Atelier Local",
    city: "Québec, QC",
    salary: "32 $ à 42 $ / h",
    intl: false,
    profession: "Développeur logiciel",
  },
  {
    title: "Infirmier(ère) clinicien",
    company: "Réseau Santé Québec",
    city: "Montréal, QC",
    salary: "76 000 $ à 94 000 $",
    intl: true,
    profession: "Infirmier(ère)",
  },
  {
    title: "Infirmier(ère) en CHSLD",
    company: "Maison des Pins",
    city: "Laval, QC",
    salary: "38 $ à 46 $ / h",
    intl: false,
    profession: "Infirmier(ère)",
  },
];
```

Create `src/lib/household-jobs.ts`:

```ts
import type { Job } from "@/data/jobs";
import { jobs } from "@/data/jobs";
import type { Profile } from "@/data/profile";
import { householdMarket, type HouseholdMarketAdult } from "@/lib/household-market";

export type HouseholdJobGroup = {
  adult: HouseholdMarketAdult;
  jobs: Job[];
};

export type HouseholdJobs = {
  groups: HouseholdJobGroup[];
  totalCount: number;
  intlCount: number;
};

export function householdJobs(profile: Profile, options?: { intlOnly?: boolean }): HouseholdJobs {
  const market = householdMarket(profile);
  const intlOnly = Boolean(options?.intlOnly);
  const groups = market.adults.map((adult) => {
    const matched = jobs.filter((job) => {
      if (job.profession !== adult.member.profession) return false;
      if (intlOnly && !job.intl) return false;
      return true;
    });
    return { adult, jobs: matched };
  });
  const listed = groups.flatMap((group) => group.jobs);
  return {
    groups,
    totalCount: listed.length,
    intlCount: listed.filter((job) => job.intl).length,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/household-jobs.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

Skip. Do not run git.

---
