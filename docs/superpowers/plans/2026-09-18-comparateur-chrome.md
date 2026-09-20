# Comparateur chrome Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Restyler le comparateur de procédures sur le chrome Profil client, copy prospect, scénario foyer.

**Architecture:** Helper `recommendedScenarioId`. Réécrire `CompareSection` avec `OpportunitiesShell`. `slideCount` reste 2. `RoutesSection` inchangé.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any git command. Do not commit.
- French UI. English code/types/tests. Apostrophe U+2019 in French UI.
- Keep catalog `comparateur.slideCount` at `2`.
- Do not modify RoutesSection, Provinces, Calculators, Jobs, Salaries, Opportunities behavior.
- Reuse `OpportunitiesShell`, `Surface`, `SectionLabel`. No `panel=`.
- No profile store setters. `toggleCompare` on the deck store is allowed.
- Forbidden copy: `Le commercial`, `le commercial`, `version connectée`, `aider le prospect`.
- Exact copy:
  - Slide 1 kicker `Comparateur`
  - Slide 1 title `Comparer les voies côte à côte.`
  - Slide 1 lead `Trois procédures maximum. Celle qui colle au foyer, pas à la brochure.`
  - Empty `Choisissez jusqu’à trois voies pour comparer.`
  - Row labels `Objectif` `Profil type` `Condition` `Point fort` `Attention`
  - Slide 2 kicker `Comparateur · Scénarios`
  - Slide 2 title via smart `Quel scénario correspond le mieux à {name} ?`
  - Slide 2 lead `On choisit une logique de projet, pas un programme au hasard.`
  - Badge `Foyer`
  - Scenarios A `Aller vers la résidence permanente` / `Explorer d’abord les voies économiques directes.`
  - B `Construire une expérience canadienne` / `Études ou travail selon les conditions applicables.`
  - C `Maximiser l’employabilité` / `Province + métier + carrière + immigration.`
  - D `Partir en famille` / `Comparer coût, emploi du conjoint et installation.`
- Skip git; DONE still applies.
- Vitest source-read pattern for UI tests.

## File structure

- Modify: `src/lib/route-paths.ts`
- Modify: `src/lib/route-paths.test.ts`
- Modify: `src/features/immigration.tsx` (`CompareSection` only)
- Modify: `src/features/immigration.test.ts`

---

### Task 1: recommendedScenarioId helper

**Files:** `src/lib/route-paths.ts`, `src/lib/route-paths.test.ts`

- [ ] **Step 1: failing tests**

Append to `src/lib/route-paths.test.ts`:

```ts
import { defaultProfile, emptyAdult } from "@/data/profile";
import { recommendedScenarioId } from "@/lib/route-paths";

describe("recommendedScenarioId", () => {
  it("picks a household scenario from the profile", () => {
    expect(recommendedScenarioId(defaultProfile)).toBe("A");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Études" })).toBe("B");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Travail" })).toBe("B");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Visite" })).toBe("B");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Affaires" })).toBe("C");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Regroupement familial" })).toBe("D");
    expect(
      recommendedScenarioId({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
      }),
    ).toBe("D");
    expect(recommendedScenarioId({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult, objective: "Affaires" })).toBe("C");
  });
});
```

Keep existing imports; add the new ones. Do not remove existing tests.

- [ ] **Step 2: RED** `npx vitest run src/lib/route-paths.test.ts`

- [ ] **Step 3: implementation**

Append to `src/lib/route-paths.ts`:

```ts
import { familyHasChildren, type Profile } from "@/data/profile";

export function recommendedScenarioId(profile: Profile) {
  if (familyHasChildren(profile.family) || profile.objective === "Regroupement familial") return "D";
  if (profile.objective === "Études" || profile.objective === "Travail" || profile.objective === "Visite") return "B";
  if (profile.objective === "Résidence permanente") return "A";
  return "C";
}
```

Merge imports at top of the file (single import from `@/data/profile`).

- [ ] **Step 4: GREEN** `npx vitest run src/lib/route-paths.test.ts`

- [ ] **Step 5: no commit**

---

### Task 2: CompareSection chrome

**Files:** `src/features/immigration.tsx`, `src/features/immigration.test.ts`

- [ ] **Step 1: failing tests**

Append to `src/features/immigration.test.ts`:

```ts
describe("comparateur catalog", () => {
  it("keeps two comparator slides", () => {
    expect(sections.find((section) => section.id === "comparateur")?.slideCount).toBe(2);
  });
});

describe("comparateur chrome", () => {
  it("reuses the profil client shell on CompareSection", () => {
    expect(source).toContain("export function CompareSection");
    expect(source).toContain("Comparer les voies côte à côte.");
    expect(source).toContain("Trois procédures maximum. Celle qui colle au foyer, pas à la brochure.");
    expect(source).toContain("Quel scénario correspond le mieux à {name} ?");
    expect(source).toContain("On choisit une logique de projet, pas un programme au hasard.");
  });

  it("keeps coaching copy out of Compare helpers", () => {
    for (const name of ["CompareSection", "CompareTable", "CompareScenarios"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("aider le prospect");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("comparateur boards", () => {
  it("compares up to three routes and highlights the household scenario", () => {
    expect(source).toContain("Choisissez jusqu’à trois voies pour comparer.");
    expect(source).toContain("Profil type");
    expect(source).toContain("Condition");
    expect(source).toContain("Point fort");
    expect(source).toContain("recommendedScenarioId");
    expect(source).toContain("Foyer");
    expect(source).toContain("toggleCompare");
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/features/immigration.test.ts`

- [ ] **Step 3: rewrite CompareSection**

Replace `export function CompareSection` through the end of the file. Keep everything above it (`RoutesSection` and helpers) unchanged.

```tsx
export function CompareSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const compareSelected = useDeckStore((s) => s.compareSelected);
  const toggleCompare = useDeckStore((s) => s.toggleCompare);
  if (slide === 1) return <CompareScenarios market={market} profile={profile} />;
  return (
    <CompareTable
      market={market}
      profile={profile}
      selectedIds={compareSelected}
      onToggle={toggleCompare}
    />
  );
}

function CompareTable({
  market,
  profile,
  selectedIds,
  onToggle,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const selected = routes.filter((route) => selectedIds.includes(route.id)).slice(0, 3);
  const rows = [
    ["Objectif", ...selected.map((route) => route.tag)],
    ["Profil type", ...selected.map((route) => route.fit)],
    ["Condition", ...selected.map((route) => route.conditions[0] ?? "—")],
    ["Point fort", ...selected.map((route) => route.positives[0])],
    ["Attention", ...selected.map((route) => route.attention[0])],
  ];
  return (
    <OpportunitiesShell
      kicker="Comparateur"
      title="Comparer les voies côte à côte."
      lead="Trois procédures maximum. Celle qui colle au foyer, pas à la brochure."
      pills={[market.family, market.province, profile.objective]}
    >
      <div className="flex flex-wrap gap-2">
        {routes.map((route) => {
          const on = selectedIds.includes(route.id);
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onToggle(route.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                on ? "border-primary bg-primary text-white" : "border-border bg-white text-[#1a2332]",
              )}
            >
              {route.name}
            </button>
          );
        })}
      </div>
      {selected.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">Choisissez jusqu’à trois voies pour comparer.</p>
      ) : (
        <Surface className="overflow-x-auto p-3">
          <table className="w-full border-separate border-spacing-y-1.5 text-[11px]">
            <thead>
              <tr className="text-left text-[9px] tracking-wide text-[#89929f] uppercase">
                <th className="px-2.5">Critère</th>
                {selected.map((route) => (
                  <th key={route.id} className="px-2.5">
                    {route.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td
                      key={`${row[0]}-${index}`}
                      className={cn(
                        "bg-[#f7fafc] px-2.5 py-2.5",
                        index === 0 ? "rounded-l-[9px] border border-r-0 border-[#e4e8ee] font-semibold" : "border-y border-[#e4e8ee]",
                        index === row.length - 1 ? "rounded-r-[9px] border border-l-0 border-[#e4e8ee]" : "",
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      )}
    </OpportunitiesShell>
  );
}

function CompareScenarios({
  market,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
}) {
  const featured = recommendedScenarioId(profile);
  const scenarios = [
    ["A", "Aller vers la résidence permanente", "Explorer d’abord les voies économiques directes."],
    ["B", "Construire une expérience canadienne", "Études ou travail selon les conditions applicables."],
    ["C", "Maximiser l’employabilité", "Province + métier + carrière + immigration."],
    ["D", "Partir en famille", "Comparer coût, emploi du conjoint et installation."],
  ] as const;
  return (
    <OpportunitiesShell
      kicker="Comparateur · Scénarios"
      title={smart("Quel scénario correspond le mieux à {name} ?", profile)}
      lead="On choisit une logique de projet, pas un programme au hasard."
      pills={[market.family, profile.objective]}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {scenarios.map(([id, title, copy]) => (
          <Surface key={id} className={cn("p-4", id === featured && "border-primary")}>
            <span className="flex items-center justify-between gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
                {id}
              </span>
              {id === featured ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Foyer
                </span>
              ) : null}
            </span>
            <h3 className="mt-3 mb-2 text-base font-semibold">{title}</h3>
            <p className="text-[12px] leading-relaxed text-[#707987]">{copy}</p>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}
```

Add imports if missing: `Profile` from `@/data/profile`, `recommendedScenarioId` from `@/lib/route-paths`. `OpportunitiesShell`, `Surface`, `householdMarket`, `cn`, `smart` already exist in the file.

Remove unused `Slide` and `Card` imports if nothing else uses them.

- [ ] **Step 4: GREEN** `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts`

- [ ] **Step 5: no commit**
