# Échecs fréquents chrome + presse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Restyler Échecs fréquents sur le chrome Profil client et ajouter six articles de presse réels (logement, chômage, détresse).

**Architecture:** Dataset `src/data/failures.ts`. Helper `highlightedFailureIds`. Réécrire `FailuresSection` avec `OpportunitiesShell`. `slideCount` reste 2. `EcosystemSection` inchangé.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any git command. Do not commit.
- French UI. English code/types/tests. Apostrophe U+2019 in French UI.
- Keep catalog `echecs.slideCount` at `2`.
- Do not modify EcosystemSection, Comparateur, Voies, Provinces, Calculators, Jobs, Salaries, Opportunities, Canada Live behavior.
- Reuse `OpportunitiesShell`, `Surface`, `SectionLabel`. No `panel=`.
- No profile store setters.
- Forbidden copy: `Le commercial`, `le commercial`, `version connectée`, `aider le prospect`, `Cette section sert`.
- Exact copy listed in the spec `docs/superpowers/specs/2026-09-18-echecs-presse.md`.
- Skip git; DONE still applies.
- Vitest source-read pattern for UI tests.

## File structure

- Create: `src/data/failures.ts`
- Create: `src/lib/failure-press.ts`
- Create: `src/lib/failure-press.test.ts`
- Modify: `src/features/sales.tsx` (`FailuresSection` only)
- Create: `src/features/sales.test.ts`

---

### Task 1: failures dataset + highlightedFailureIds

**Files:** `src/data/failures.ts`, `src/lib/failure-press.ts`, `src/lib/failure-press.test.ts`

- [ ] **Step 1: failing tests**

Create `src/lib/failure-press.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { failurePress, failureRisks } from "@/data/failures";
import { highlightedFailureIds } from "@/lib/failure-press";

describe("failureRisks", () => {
  it("lists eight prospect-facing risks", () => {
    expect(failureRisks.map((risk) => risk.id)).toEqual([
      "program",
      "rush",
      "money",
      "employability",
      "housing",
      "job-myth",
      "counsel",
      "urgent",
    ]);
    expect(failureRisks.find((risk) => risk.id === "housing")?.label).toBe("Arriver sans logement préparé");
    expect(failureRisks.find((risk) => risk.id === "job-myth")?.cost).toBe("Personne n’embauche sur un souhait.");
  });
});

describe("failurePress", () => {
  it("lists six sourced articles across housing, jobs and distress", () => {
    expect(failurePress).toHaveLength(6);
    expect(failurePress.filter((article) => article.theme === "housing")).toHaveLength(2);
    expect(failurePress.filter((article) => article.theme === "jobs")).toHaveLength(2);
    expect(failurePress.filter((article) => article.theme === "distress")).toHaveLength(2);
    expect(failurePress.every((article) => article.url.startsWith("https://"))).toBe(true);
  });
});

describe("highlightedFailureIds", () => {
  it("picks up to three household risks", () => {
    expect(highlightedFailureIds(defaultProfile)).toEqual(["housing", "job-myth", "money"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Travail",
      }),
    ).toEqual(["housing", "job-myth", "employability"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Études",
      }),
    ).toEqual(["housing", "job-myth", "program"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Visite",
      }),
    ).toEqual(["housing", "job-myth", "counsel"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
        objective: "Travail",
      }),
    ).toEqual(["housing", "job-myth", "money"]);
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/lib/failure-press.test.ts`

- [ ] **Step 3: implementation**

Create `src/data/failures.ts` with types `FailureRisk` and `FailurePressArticle` (`theme`: `"housing" | "jobs" | "distress"`). Export `failureRisks` (8) and `failurePress` (6) with exact labels/costs from the spec.

Press articles (keep these URLs):

1. housing — Radio-Canada — fév. 2024 — `Plusieurs étudiants étrangers vivent dans la pauvreté` — `Logement saturé, horaires plafonnés, santé mentale touchée. Un visa d’études n’est pas un toit.` — `https://ici.radio-canada.ca/nouvelle/2048670/etudiants-etrangers-pauvrete-logement-brampton-mississauga`
2. housing — Directeur parlementaire du budget — 2024 — `Le plan d’immigration 2025-2027 et l’écart de logements` — `Même avec des cibles plus basses, l’écart reste de centaines de milliers d’unités. Arriver sans adresse, c’est arriver dans un marché déjà tendu.` — `https://www.pbo-dpb.ca/fr/additional-analyses--analyses-complementaires/BLOG-2425-006--impact-2025-2027-immigration-levels-plan-canada-housing-gap--repercussions-plan-niveaux-immigration-2025-2027-ecart-offre-logement-canada`
3. jobs — Statistique Canada — oct. 2025 — `34,7 % des immigrants récents se disent surqualifiés` — `Un diplôme ne garantit pas un poste à la mesure du profil. Le sous-emploi est devenu plus fréquent chez les arrivants récents.` — `https://www150.statcan.gc.ca/n1/daily-quotidien/251010/dq251010a-fra.htm`
4. jobs — Institut du Québec — 2025 — `Les immigrants temporaires : un chômage près de trois fois plus élevé` — `11,7 % chez les temporaires, contre 4,1 % chez les natifs au Québec. Un permis n’est pas un emploi.` — `https://institutduquebec.ca/publications/bilan-2024-de-l-emploi-au-quebec`
5. distress — Radio-Canada — janv. 2024 — `Dépression et anxiété chez les nouveaux arrivants` — `21 % des personnes immigrées depuis 6 à 15 ans déclarent des symptômes d’anxiété. L’isolement et le déclassement pèsent.` — `https://ici.radio-canada.ca/nouvelle/2038351/sante-mentale-immigrants-canada-emploi`
6. distress — Radio-Canada — janv. 2024 — `Quand le rêve canadien se transforme en cauchemar` — `Arriver sans réseau, sans logement et sans emploi correspondant au profil : le choc n’est pas rare.` — `https://ici.radio-canada.ca/nouvelle/2038406/immigration-canada-sante-mentale`

Create `src/lib/failure-press.ts`:

```ts
import { familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";

export function highlightedFailureIds(profile: Profile): string[] {
  const ids: string[] = ["housing", "job-myth"];
  if (familyHasSpouse(profile.family) || familyHasChildren(profile.family)) ids.push("money");
  if (profile.objective === "Travail") ids.push("employability");
  else if (profile.objective === "Études") ids.push("program");
  else if (profile.objective === "Visite") ids.push("counsel");
  return [...new Set(ids)].slice(0, 3);
}
```

- [ ] **Step 4: GREEN** `npx vitest run src/lib/failure-press.test.ts`

- [ ] **Step 5: no commit**

---

### Task 2: FailuresSection chrome + presse

**Files:** `src/features/sales.tsx`, `src/features/sales.test.ts`

- [ ] **Step 1: failing tests**

Create `src/features/sales.test.ts` using the immigration.test.ts source-read helper (`extractFunction`, cut on `\nfunction ` and `\nexport function `). Read `sales.tsx` and `market.tsx`.

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "sales.tsx"), "utf8");
const market = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`) !== -1
    ? source.indexOf(`function ${name}`)
    : source.indexOf(`export function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const from = start;
  const nextFunction = source.indexOf("\nfunction ", from + 1);
  const nextExportFunction = source.indexOf("\nexport function ", from + 1);
  const candidates = [nextFunction, nextExportFunction].filter((index) => index !== -1);
  const next = candidates.length > 0 ? Math.min(...candidates) : -1;
  return source.slice(from, next === -1 ? undefined : next);
}

describe("echecs catalog", () => {
  it("keeps two failure slides", () => {
    expect(sections.find((section) => section.id === "echecs")?.slideCount).toBe(2);
  });
});

describe("echecs chrome", () => {
  it("reuses the profil client shell on FailuresSection", () => {
    expect(source).toContain("export function FailuresSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Les erreurs qui coûtent du temps, de l’argent et parfois plusieurs années.");
    expect(source).toContain("Arriver sans plan, c’est payer le prix du Canada avant d’en avoir les bénéfices.");
    expect(source).toContain("Le Canada n’est pas un échec. L’arrivée sans préparation, si.");
    expect(source).toContain("Logement, emploi, santé mentale : la presse raconte ce qui arrive quand le projet s’improvise.");
    expect(market).toContain("export function OpportunitiesShell");
  });

  it("keeps coaching copy out of Failures helpers", () => {
    for (const name of ["FailuresSection", "FailuresRisks", "FailuresPress"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("aider le prospect");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("Cette section sert");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("echecs boards", () => {
  it("renders household risks and sourced press", () => {
    expect(source).toContain("highlightedFailureIds");
    expect(source).toContain("failureRisks");
    expect(source).toContain("failurePress");
    expect(source).toContain("Foyer");
    expect(source).toContain("Lire l’article");
    expect(source).toContain("Sources publiques. Aperçu de démonstration, pas un diagnostic.");
    expect(source).toContain("Une bonne décision prise tôt coûte souvent moins cher qu’une mauvaise décision corrigée tard.");
    expect(source).toContain("Logement");
    expect(source).toContain("Emploi");
    expect(source).toContain("Détresse");
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/features/sales.test.ts`

- [ ] **Step 3: rewrite FailuresSection**

Replace `export function FailuresSection` only. Keep `EcosystemSection` unchanged.

```tsx
export function FailuresSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  if (slide === 1) return <FailuresPress market={market} />;
  return <FailuresRisks market={market} profile={profile} />;
}

function FailuresRisks({
  market,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
}) {
  const featured = highlightedFailureIds(profile);
  return (
    <OpportunitiesShell
      kicker="Échecs fréquents"
      title="Les erreurs qui coûtent du temps, de l’argent et parfois plusieurs années."
      lead="Arriver sans plan, c’est payer le prix du Canada avant d’en avoir les bénéfices."
      pills={[market.family, market.province, profile.objective]}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {failureRisks.map((risk) => (
          <Surface key={risk.id} className={cn("p-4", featured.includes(risk.id) && "border-primary")}>
            <span className="flex items-center justify-between gap-2">
              <b className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#fff0f2] text-lg text-destructive">×</b>
              {featured.includes(risk.id) ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">Foyer</span>
              ) : null}
            </span>
            <h3 className="mt-3 mb-1.5 text-[13px] leading-snug font-semibold">{risk.label}</h3>
            <p className="text-[12px] leading-relaxed text-[#707987]">{risk.cost}</p>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

const PRESS_THEMES = [
  ["housing", "Logement"],
  ["jobs", "Emploi"],
  ["distress", "Détresse"],
] as const;

function FailuresPress({ market }: { market: ReturnType<typeof householdMarket> }) {
  const profile = useProfileStore((s) => s.profile);
  return (
    <OpportunitiesShell
      kicker="Échecs fréquents · Presse"
      title="Le Canada n’est pas un échec. L’arrivée sans préparation, si."
      lead="Logement, emploi, santé mentale : la presse raconte ce qui arrive quand le projet s’improvise."
      pills={[market.family, market.province, profile.objective]}
    >
      <p className="text-[12px] text-muted-foreground">Sources publiques. Aperçu de démonstration, pas un diagnostic.</p>
      <div className="grid gap-3 lg:grid-cols-3">
        {PRESS_THEMES.map(([theme, label]) => (
          <div key={theme} className="flex min-w-0 flex-col gap-2">
            <SectionLabel>{label}</SectionLabel>
            {failurePress
              .filter((article) => article.theme === theme)
              .map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-[14px] border border-border bg-white p-4 transition hover:border-primary/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">{article.source}</p>
                    <p className="text-[11px] text-muted-foreground">{article.date}</p>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug font-semibold text-[#1a2332] group-hover:text-primary">{article.title}</p>
                  <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                    Lire l’article
                    <ExternalLink className="size-3" />
                  </span>
                </a>
              ))}
          </div>
        ))}
      </div>
      <Surface className="p-4">
        <p className="text-[15px] leading-relaxed font-semibold text-[#1a2332]">
          Une bonne décision prise tôt coûte souvent moins cher qu’une mauvaise décision corrigée tard.
        </p>
      </Surface>
    </OpportunitiesShell>
  );
}
```

Imports for FailuresSection: `ExternalLink` from lucide-react, `Profile` from `@/data/profile`, `failurePress` `failureRisks` from `@/data/failures`, `OpportunitiesShell` `SectionLabel` `Surface` from `@/features/market`, `householdMarket` from `@/lib/household-market`, `highlightedFailureIds` from `@/lib/failure-press`, `cn` from `@/lib/utils`, `useProfileStore`. Keep existing `Card` `Quote` `Slide` `RiskGrid` `useDeckStore` if `EcosystemSection` still needs them. `RiskGrid` may become unused in this file — remove that import if unused. Do not delete `RiskGrid` from `pitch.tsx`.

`FailuresPress` already receives `market`; pass `profile` as prop instead of a second `useProfileStore` if cleaner, but tests only check source strings. Prefer passing `profile` from `FailuresSection` like CompareSection.

- [ ] **Step 4: GREEN** `npx vitest run src/features/sales.test.ts src/lib/failure-press.test.ts`

- [ ] **Step 5: no commit**
