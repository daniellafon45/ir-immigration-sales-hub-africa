# Review package: working-tree Task 1 (no git)

Base: none (files did not exist)
Head: working tree after Task 1

## Commits

none (git forbidden)

## Files changed

```
src/lib/province-lever.ts       | created
src/lib/province-lever.test.ts  | created
```

## Diff

### Added: src/lib/province-lever.ts

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

### Added: src/lib/province-lever.test.ts

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
