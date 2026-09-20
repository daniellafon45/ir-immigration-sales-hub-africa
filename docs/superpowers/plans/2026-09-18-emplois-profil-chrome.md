# Emplois chrome profil client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyler Emplois sur le chrome Profil / Opportunités, lister les postes par adulte du foyer, et remplacer le coaching « Le commercial… » par des messages de closing adressés au prospect.

**Architecture:** Étendre `Job` avec `profession`. Helper pur `householdJobs(profile, options)` groupe les postes par adulte de `householdMarket`. Réécrire `JobsSection` avec `OpportunitiesShell` et un panneau de talks. Salaires / provinces inchangés.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- User-facing language stays French. Code, types, and test names stay in English.
- Keep catalog `emplois.slideCount` at `2`.
- Do not modify `OpportunitiesSection`, `SalariesSection`, `CalculatorsSection`, or `ProvincesSection` behavior.
- Reuse existing `OpportunitiesShell`, `Surface`, `SectionLabel`, `MetaPill`, `PanelBlock`, `FactRow` in `market.tsx`. Do not add `HoverRevealCards`.
- Fields are read-only. Do not call profile store setters.
- Forbidden in new Jobs copy: `Le commercial`, `le commercial`, `Dans la version connectée`, `version connectée`.
- Exact copy:
  - Slide 1 kicker `Emplois`
  - Slide 1 title `Voyons les postes disponibles aujourd’hui.`
  - Slide 1 lead `Un employeur, un lieu, un salaire. C’est ça, un marché réel.`
  - Slide 1 panel kicker `À retenir`
  - Talk 1 label `Preuve` body `Ces intitulés existent déjà. Le projet n’est plus une idée : il a des noms d’employeurs.`
  - Talk 3 label `Nuance` body `Un poste local n’embauche pas depuis l’étranger. Il reste utile une fois arrivé.`
  - Slide 1 ask `Lequel de ces employeurs vous projette déjà au Canada ?`
  - Slide 2 kicker `Emplois · International`
  - Slide 2 title `Tous les employeurs n’embauchent pas depuis l’étranger.`
  - Slide 2 lead `Les postes internationaux ouvrent une porte maintenant. Les postes locaux attendent l’arrivée.`
  - Talk I label `Filtre` body `International, ce n’est pas un badge de prestige. C’est un employeur qui peut vous parler avant le visa.`
  - Talk I2 label `Piège` body `Un beau salaire local peut faire rêver trop tôt. S’il n’embauche pas à l’étranger, il n’avance pas le dossier aujourd’hui.`
  - Talk I3 label `Suite` body `Une fois le bon type de poste isolé, on parle salaire net et province. Pas avant.`
  - Slide 2 ask `Parmi les postes internationaux, lequel justifie de continuer le dossier ?`
  - Empty state `Pas encore de postes de démonstration pour ce métier.`
  - Foyer couple body uses first names: `{principal} et {accompagnant} n’ont pas le même marché. Deux métiers, deux listes.`
  - Foyer solo body: `Le métier de {principal} se relie déjà à des postes ouverts.`
  - Foyer talk label `Foyer`
  - Chip `International` `Temps plein`
  - Table headers `Poste` `Employeur` `Lieu` `Salaire`
  - Badges `International` `Local`
- Keep the original 5 accounting jobs’ title, company, city, salary, intl values unchanged; only add `profession: "Comptable"`.
- Follow Vitest source-read pattern in `src/features/market.test.ts`.
- Skip git commits; status DONE still applies.

## File structure

- Modify: `src/data/jobs.ts`
- Create: `src/lib/household-jobs.ts`
- Create: `src/lib/household-jobs.test.ts`
- Modify: `src/features/market.tsx` (`JobsSection` only)
- Modify: `src/features/market.test.ts`

---

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

### Task 2: JobsSection chrome + commercial messages

**Files:**
- Modify: `src/features/market.tsx` (replace `JobsSection` only)
- Modify: `src/features/market.test.ts`

**Interfaces:**
- Consumes: `householdJobs` from Task 1; `householdMarket`; existing `OpportunitiesShell` / `Surface` / `SectionLabel` / `MetaPill` / `PanelBlock` / `BrandLogo`
- Produces: `JobsSection` on Canada Live chrome for both slides, prospect-facing talks, no `Slide`

- [ ] **Step 1: Write the failing test**

In `src/features/market.test.ts`, **replace** the test `leaves JobsSection on the Slide primitive` and **add** these describes (keep all existing opportunities tests):

```ts
describe("jobs catalog", () => {
  it("keeps two employment slides", () => {
    expect(sections.find((section) => section.id === "emplois")?.slideCount).toBe(2);
  });
});

describe("jobs chrome", () => {
  it("reuses the profil client shell on JobsSection", () => {
    expect(source).toContain("export function JobsSection");
    expect(source).toContain("householdJobs");
    expect(source).toContain("À retenir");
    expect(source).toContain("Voyons les postes disponibles aujourd’hui.");
    expect(source).toContain("Un employeur, un lieu, un salaire. C’est ça, un marché réel.");
    expect(source).toContain("Tous les employeurs n’embauchent pas depuis l’étranger.");
    expect(source).toContain("La question");
    expect(source).not.toContain("Le commercial");
    expect(source).not.toContain("version connectée");
  });

  it("keeps coaching copy out of JobsSection", () => {
    const jobs = extractFunction("JobsSection");
    expect(jobs).not.toContain("Le commercial");
    expect(jobs).not.toContain("version connectée");
  });
});

describe("jobs household boards", () => {
  it("renders a job table per adult group", () => {
    expect(source).toContain("JobsBoard");
    expect(source).toContain("Pas encore de postes de démonstration pour ce métier.");
    expect(source).toContain("n’ont pas le même marché. Deux métiers, deux listes.");
    expect(source).toContain("Le métier de ");
    expect(source).toContain("se relie déjà à des postes ouverts.");
  });
});
```

Remove the old test that expected `kicker={slide === 0 ? "Emplois" : "Emplois · International"}` and JobsSection on `<Slide`. Other sections may still use `<Slide` — do not assert that JobsSection uses it.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/market.test.ts`
Expected: FAIL on jobs chrome / householdJobs / forbidden coaching still present.

- [ ] **Step 3: Write minimal implementation**

1. Add import:

```ts
import { householdJobs } from "@/lib/household-jobs";
```

Keep `jobs` import only if still used; after rewrite it is not needed in `market.tsx` — remove `{ jobs }` from `@/data/jobs` if unused. Keep `Badge`.

2. Replace `export function JobsSection` through the closing `}` before `export function SalariesSection` with:

```tsx
export function JobsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const view = householdJobs(profile, { intlOnly: slide === 1 });
  if (slide === 1) return <JobsIntl market={market} view={view} />;
  return <JobsToday market={market} view={view} />;
}

function JobsToday({
  market,
  view,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdJobs>;
}) {
  const other = market.accompanying?.member.firstName;
  const principalName = market.principal.member.firstName || "Le candidat";
  const foyerBody = other
    ? `${principalName} et ${other} n’ont pas le même marché. Deux métiers, deux listes.`
    : `Le métier de ${principalName} se relie déjà à des postes ouverts.`;
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Emplois"
      title="Voyons les postes disponibles aujourd’hui."
      lead="Un employeur, un lieu, un salaire. C’est ça, un marché réel."
      pills={pills}
      panel={
        <JobsBriefingPanel
          kicker="À retenir"
          title={principalName}
          subtitle={market.family}
          talks={[
            {
              label: "Preuve",
              body: "Ces intitulés existent déjà. Le projet n’est plus une idée : il a des noms d’employeurs.",
            },
            { label: "Foyer", body: foyerBody },
            {
              label: "Nuance",
              body: "Un poste local n’embauche pas depuis l’étranger. Il reste utile une fois arrivé.",
            },
          ]}
          ask="Lequel de ces employeurs vous projette déjà au Canada ?"
        />
      }
    >
      <JobsBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function JobsIntl({
  market,
  view,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdJobs>;
}) {
  const chips = ["International", market.province, ...market.adults.map((adult) => adult.member.profession), "Temps plein"];
  return (
    <OpportunitiesShell
      kicker="Emplois · International"
      title="Tous les employeurs n’embauchent pas depuis l’étranger."
      lead="Les postes internationaux ouvrent une porte maintenant. Les postes locaux attendent l’arrivée."
      pills={chips}
      panel={
        <JobsBriefingPanel
          kicker="À retenir"
          title={market.principal.member.firstName || "Dossier"}
          subtitle={market.family}
          talks={[
            {
              label: "Filtre",
              body: "International, ce n’est pas un badge de prestige. C’est un employeur qui peut vous parler avant le visa.",
            },
            {
              label: "Piège",
              body: "Un beau salaire local peut faire rêver trop tôt. S’il n’embauche pas à l’étranger, il n’avance pas le dossier aujourd’hui.",
            },
            {
              label: "Suite",
              body: "Une fois le bon type de poste isolé, on parle salaire net et province. Pas avant.",
            },
          ]}
          ask="Parmi les postes internationaux, lequel justifie de continuer le dossier ?"
        />
      }
    >
      <JobsBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function JobsBoard({ groups }: { groups: ReturnType<typeof householdJobs>["groups"] }) {
  return (
    <div className="grid shrink-0 gap-3">
      {groups.map((group) => (
        <Surface key={group.adult.role} className="p-3 sm:px-4 sm:py-3">
          <SectionLabel>
            {group.adult.label} · {group.adult.member.profession}
          </SectionLabel>
          {group.jobs.length === 0 ? (
            <p className="mt-2 text-[13px] text-muted-foreground">Pas encore de postes de démonstration pour ce métier.</p>
          ) : (
            <JobTable jobs={group.jobs} />
          )}
        </Surface>
      ))}
    </div>
  );
}

function JobTable({ jobs }: { jobs: Array<{ title: string; company: string; city: string; salary: string; intl: boolean }> }) {
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-1.5 text-[11px]">
        <thead>
          <tr className="text-left text-[9px] tracking-wide text-[#89929f] uppercase">
            <th className="px-2.5">Poste</th>
            <th className="px-2.5">Employeur</th>
            <th className="px-2.5">Lieu</th>
            <th className="px-2.5">Salaire</th>
            <th className="px-2.5" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.title + job.company}>
              <td className="rounded-l-[9px] border border-r-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5 font-semibold">{job.title}</td>
              <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5">{job.company}</td>
              <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5">{job.city}</td>
              <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5">{job.salary}</td>
              <td className="rounded-r-[9px] border border-l-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5">
                <Badge tone={job.intl ? "good" : "muted"}>{job.intl ? "International" : "Local"}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JobsBriefingPanel({
  kicker,
  title,
  subtitle,
  talks,
  ask,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  talks: Array<{ label: string; body: string }>;
  ask: string;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(0,82,164,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">{kicker}</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-[14px] text-white/85">{subtitle}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {talks.map((talk) => (
          <PanelBlock key={talk.label} title={talk.label}>
            <p className="text-[14px] leading-relaxed text-white/90">{talk.body}</p>
          </PanelBlock>
        ))}
        <PanelBlock title="La question">
          <p className="text-[14px] leading-snug font-medium text-white">{ask}</p>
        </PanelBlock>
      </div>
    </div>
  );
}
```

Keep `SalariesSection` and everything after it exactly as-is.

Note: `extractFunction("JobsSection")` slices until the next `\nfunction `, which will be `JobsToday`. The coaching-copy test on that short router is still valid (no coaching there). The full-source `not.toContain("Le commercial")` would fail if Opportunities or other strings contain it — grep first. If `market.tsx` still contains `Le commercial` in another section, **do not** assert `source).not.toContain("Le commercial")` on the whole file. Assert it on `JobsToday`, `JobsIntl`, and `JobsBriefingPanel` extracts instead:

```ts
for (const name of ["JobsToday", "JobsIntl", "JobsBriefingPanel"]) {
  const chunk = extractFunction(name);
  expect(chunk).not.toContain("Le commercial");
  expect(chunk).not.toContain("version connectée");
}
```

Use this loop in the jobs chrome tests rather than scanning the whole `market.tsx` file.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/features/market.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

Skip. Do not run git.

---

## Self-review

1. Spec coverage: professions + helper (Task 1), chrome + talks + household boards (Task 2).
2. Placeholder scan: foyer copy interpolates first names in UI, not `{principal}` visible.
3. Types: `HouseholdJobGroup` / `householdJobs` names match.
