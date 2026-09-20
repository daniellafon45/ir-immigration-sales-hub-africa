# Levier provincial de qualification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le bloc « Levier {province} » du panneau Demandeur principal (capacité financière vs médiane salariale locale) par un levier linguistique de qualification commerciale.

**Architecture:** Extraire un helper pur `provinceLever(member, province)` qui compare le niveau de langue du demandeur retenu à l’exigence de la destination (français au Québec, anglais ailleurs). Le `PrincipalPanel` affiche ce levier à la place du comparatif salarial. Le champ formulaire « Capacité financière » et la barre de score « Capacité » restent inchangés.

**Tech Stack:** React 19, TypeScript, Vitest (tests unitaires du helper + inspection source de `PrincipalPanel` comme `src/features/profile.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- User-facing language stays French. Code, types, and test names stay in the existing English style.
- Keep the `PanelBlock` title exactly `` `Levier ${draft.province}` ``.
- Do not change the PersonCard form field labeled "Capacité financière".
- Do not change `SCORE_BARS` (the "Capacité" score bar stays).
- Do not restyle the sidebar beyond the three rows inside this `PanelBlock`.
- Verdict copy must use these exact French strings:
  - Québec + Bilingue: `Atout francophone — qualification renforcée`
  - Québec + Avancé: `Atout francophone — levier de qualification`
  - Québec + Intermédiaire: `Seuil possible — consolider le français`
  - Québec + Débutant (and any other weak FR): `Frein linguistique — qualifier le FR d'abord`
  - Hors Québec + Bilingue EN: `Anglais bilingue — levier d'employabilité`
  - Hors Québec + Avancé EN: `Anglais solide — levier d'employabilité`
  - Hors Québec + Intermédiaire EN: `Anglais utile — à confirmer en entretien`
  - Hors Québec + Débutant EN (and any other weak EN): `Frein linguistique — anglais à qualifier`
- Québec labels: `Exigence FR` / province `french` field / `Français` / candidate `french`.
- Other provinces: `Langue prioritaire` / `Anglais` / `Anglais` / candidate `english`.
- `positive` is true only for `Avancé` and `Bilingue`.
- Follow existing Vitest patterns. Helper tests import and call the function. UI tests use `extractFunction("PrincipalPanel")` in `src/features/profile.test.ts`.
- Remove unused `salaryForProfession`, `money`, and `financialCapacityAmount` imports/usages from `src/features/profile.tsx` once the old block is gone.

---

### Task 1: provinceLever helper

**Files:**
- Create: `src/lib/province-lever.ts`
- Test: `src/lib/province-lever.test.ts`

**Interfaces:**
- Consumes: `AdultMember` from `@/data/profile`; `provinceCode` and `provinceData` from `@/data/provinces`
- Produces: `export type ProvinceLever` and `export function provinceLever(member: AdultMember, province: string): ProvinceLever`

- [ ] **Step 1: Write the failing test**

Create `src/lib/province-lever.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultApplicant, defaultSpouse } from "@/data/profile";
import { provinceLever } from "@/lib/province-lever";

describe("provinceLever", () => {
  it("uses French vs Quebec requirement for a strong francophone", () => {
    const lever = provinceLever(defaultApplicant, "Québec");
    expect(lever).toEqual({
      requirementLabel: "Exigence FR",
      requirementValue: "Très forte",
      candidateLabel: "Français",
      candidateValue: "Avancé",
      verdict: "Atout francophone — levier de qualification",
      positive: true,
    });
  });

  it("flags weak French in Quebec as a qualification brake", () => {
    const lever = provinceLever({ ...defaultApplicant, french: "Débutant" }, "Québec");
    expect(lever.verdict).toBe("Frein linguistique — qualifier le FR d'abord");
    expect(lever.positive).toBe(false);
    expect(lever.candidateValue).toBe("Débutant");
  });

  it("treats intermediate French in Quebec as a threshold to strengthen", () => {
    const lever = provinceLever({ ...defaultApplicant, french: "Intermédiaire" }, "Québec");
    expect(lever.verdict).toBe("Seuil possible — consolider le français");
    expect(lever.positive).toBe(false);
  });

  it("treats bilingual French in Quebec as a reinforced asset", () => {
    const lever = provinceLever({ ...defaultApplicant, french: "Bilingue" }, "Québec");
    expect(lever.verdict).toBe("Atout francophone — qualification renforcée");
    expect(lever.positive).toBe(true);
  });

  it("uses English as the sales lever outside Quebec", () => {
    const lever = provinceLever(defaultSpouse, "Ontario");
    expect(lever).toEqual({
      requirementLabel: "Langue prioritaire",
      requirementValue: "Anglais",
      candidateLabel: "Anglais",
      candidateValue: "Avancé",
      verdict: "Anglais solide — levier d'employabilité",
      positive: true,
    });
  });

  it("flags weak English outside Quebec", () => {
    const lever = provinceLever({ ...defaultSpouse, english: "Débutant" }, "Alberta");
    expect(lever.verdict).toBe("Frein linguistique — anglais à qualifier");
    expect(lever.positive).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/province-lever.test.ts`

Expected: FAIL because `src/lib/province-lever.ts` does not exist (cannot find module).

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/province-lever.ts`:

```ts
import type { AdultMember } from "@/data/profile";
import { provinceCode, provinceData } from "@/data/provinces";

const STRONG_LANG = new Set(["Avancé", "Bilingue"]);

export type ProvinceLever = {
  requirementLabel: "Exigence FR" | "Langue prioritaire";
  requirementValue: string;
  candidateLabel: "Français" | "Anglais";
  candidateValue: string;
  verdict: string;
  positive: boolean;
};

export function provinceLever(member: AdultMember, province: string): ProvinceLever {
  if (province === "Québec") {
    const candidateValue = member.french;
    return {
      requirementLabel: "Exigence FR",
      requirementValue: (provinceData[provinceCode(province)] ?? provinceData.QC).french,
      candidateLabel: "Français",
      candidateValue,
      verdict: quebecFrenchVerdict(candidateValue),
      positive: STRONG_LANG.has(candidateValue),
    };
  }

  const candidateValue = member.english;
  return {
    requirementLabel: "Langue prioritaire",
    requirementValue: "Anglais",
    candidateLabel: "Anglais",
    candidateValue,
    verdict: englishVerdict(candidateValue),
    positive: STRONG_LANG.has(candidateValue),
  };
}

function quebecFrenchVerdict(level: string) {
  if (level === "Bilingue") return "Atout francophone — qualification renforcée";
  if (level === "Avancé") return "Atout francophone — levier de qualification";
  if (level === "Intermédiaire") return "Seuil possible — consolider le français";
  return "Frein linguistique — qualifier le FR d'abord";
}

function englishVerdict(level: string) {
  if (level === "Bilingue") return "Anglais bilingue — levier d'employabilité";
  if (level === "Avancé") return "Anglais solide — levier d'employabilité";
  if (level === "Intermédiaire") return "Anglais utile — à confirmer en entretien";
  return "Frein linguistique — anglais à qualifier";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/province-lever.test.ts`

Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

Skip. Global constraint: do not run git, do not commit. Write the report file only.

---

### Task 2: Wire provinceLever into PrincipalPanel

**Files:**
- Modify: `src/features/profile.tsx`
- Test: `src/features/profile.test.ts`

**Interfaces:**
- Consumes: `provinceLever` from `@/lib/province-lever` (`ProvinceLever` as returned by Task 1)
- Produces: `PrincipalPanel` renders requirement, candidate language, and verdict instead of salary vs local median

- [ ] **Step 1: Write the failing test**

Append to `src/features/profile.test.ts` (keep existing describes):

```ts
describe("principal panel provincial lever", () => {
  it("shows a linguistic qualification lever instead of salary vs local median", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain("provinceLever");
    expect(panel).toContain("lever.requirementLabel");
    expect(panel).toContain("lever.candidateLabel");
    expect(panel).toContain("lever.verdict");
    expect(panel).not.toContain("Médiane locale");
    expect(panel).not.toContain("salaryForProfession");
    expect(panel).not.toContain("salaryLift");
    expect(panel).not.toContain("financialCapacityAmount");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/profile.test.ts`

Expected: FAIL — `PrincipalPanel` still contains `Médiane locale` / `salaryForProfession` / `salaryLift` and does not contain `provinceLever`.

- [ ] **Step 3: Write minimal implementation**

In `src/features/profile.tsx`:

Remove these imports if they become unused:

```ts
  financialCapacityAmount,
```

from the `@/data/profile` import, and remove:

```ts
import { salaryForProfession } from "@/lib/finance";
import { money } from "@/lib/format";
```

Add:

```ts
import { provinceLever } from "@/lib/province-lever";
```

In `PrincipalPanel`, replace:

```ts
  const salaryBand = salaryForProfession(principal.profession, draft.province) ?? [0, 0, 0];
  const medianSalary = salaryBand[1] ?? 0;
  const currentCapacity = financialCapacityAmount(principal.salary);
  const salaryLift = Math.max(0, medianSalary - currentCapacity);
```

with:

```ts
  const lever = provinceLever(principal, draft.province);
```

Replace the `PanelBlock` body titled `` `Levier ${draft.province}` `` with:

```tsx
        <PanelBlock title={`Levier ${draft.province}`}>
          <FactRow label={lever.requirementLabel} value={lever.requirementValue} />
          <FactRow label={lever.candidateLabel} value={lever.candidateValue} />
          {lever.positive ? (
            <p className="pt-0.5 text-[12px] font-semibold text-white">
              {lever.verdict}
            </p>
          ) : (
            <p className="pt-0.5 text-[12px] text-white/80">
              {lever.verdict}
            </p>
          )}
        </PanelBlock>
```

Do not change the title. Keep the existing positive/muted typography split (semibold white vs `text-white/80`) so a qualification brake is visually quieter than an asset.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/features/profile.test.ts src/lib/province-lever.test.ts`

Expected: PASS.

Also run: `npm test`

Expected: full suite PASS.

- [ ] **Step 5: Commit**

Skip. Global constraint: do not run git, do not commit. Write the report file only.
