# Écosystème IR chrome — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Fusionner Écosystème IR en une page chrome Profil client, avec piliers, contact et CTA.

**Architecture:** Dataset `src/data/ecosystem.ts`. Réécrire `EcosystemSection`. Catalog `ecosysteme.slideCount` = 1. `FailuresSection` inchangé.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any git command. Do not commit.
- French UI. English code/types/tests. Apostrophe U+2019 in French UI, including « garanti ».
- Set catalog `ecosysteme.slideCount` to `1`.
- Do not modify FailuresSection, Comparateur, Voies, Provinces, Calculators, Jobs, Salaries, Opportunities, Canada Live, Pitch behavior.
- Reuse `OpportunitiesShell`, `Surface`, `SectionLabel`. No `panel=`.
- No profile store setters.
- Forbidden copy: `Le commercial`, `le commercial`, `version connectée`, `aider le prospect`.
- Exact copy in `docs/superpowers/specs/2026-09-19-ecosysteme-chrome.md`.
- Skip git; DONE still applies.
- Vitest source-read pattern for UI tests.

## File structure

- Create: `src/data/ecosystem.ts`
- Create: `src/data/ecosystem.test.ts`
- Modify: `src/catalog.ts` (`ecosysteme.slideCount` only)
- Modify: `src/features/sales.tsx` (`EcosystemSection` only)
- Modify: `src/features/sales.test.ts` (append ecosystem describes)

---

### Task 1: ecosystem dataset + catalog slideCount

**Files:** `src/data/ecosystem.ts`, `src/data/ecosystem.test.ts`, `src/catalog.ts`

- [ ] **Step 1: failing tests**

Create `src/data/ecosystem.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import {
  IR_CTA,
  IR_SITE_LABEL,
  IR_SITE_URL,
  IR_WHATSAPP_LABEL,
  IR_WHATSAPP_URL,
  ecosystemPillars,
} from "@/data/ecosystem";

describe("ecosystem catalog", () => {
  it("keeps a single ecosystem slide", () => {
    expect(sections.find((section) => section.id === "ecosysteme")?.slideCount).toBe(1);
  });
});

describe("ecosystemPillars", () => {
  it("lists immigration, recruitment and concierge", () => {
    expect(ecosystemPillars.map((pillar) => pillar.id)).toEqual(["immigration", "recruitment", "concierge"]);
    expect(ecosystemPillars.map((pillar) => pillar.title)).toEqual(["Immigration", "Recrutement", "Conciergerie"]);
    expect(ecosystemPillars[1]?.tag).toBe("Industrielle RH");
    expect(ecosystemPillars[1]?.body).toContain("garanti");
  });
});

describe("IR contact", () => {
  it("exposes the pitch site and WhatsApp action", () => {
    expect(IR_SITE_LABEL).toBe("ir-immigration.com");
    expect(IR_SITE_URL).toBe("https://ir-immigration.com");
    expect(IR_WHATSAPP_LABEL).toBe("WhatsApp 819 919 8683");
    expect(IR_WHATSAPP_URL).toBe("https://wa.me/18199198683");
    expect(IR_CTA).toBe("Parlons de votre projet");
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/data/ecosystem.test.ts`

- [ ] **Step 3: implementation**

Create `src/data/ecosystem.ts`:

```ts
export type EcosystemPillar = {
  id: "immigration" | "recruitment" | "concierge";
  tag: string;
  title: string;
  body: string;
};

export const ecosystemPillars: EcosystemPillar[] = [
  {
    id: "immigration",
    tag: "IR Immigration",
    title: "Immigration",
    body: "Stratégie et accompagnement. Le chemin du foyer, pas le visa le plus rapide.",
  },
  {
    id: "recruitment",
    tag: "Industrielle RH",
    title: "Recrutement",
    body: "Emploi, carrière et réseau. Un métier positionné, pas un emploi « garanti ».",
  },
  {
    id: "concierge",
    tag: "IR Conciergerie",
    title: "Conciergerie",
    body: "Logement, accueil et démarches. Arriver avec un toit, pas avec une recherche en urgence.",
  },
];

export const IR_SITE_LABEL = "ir-immigration.com";
export const IR_SITE_URL = "https://ir-immigration.com";
export const IR_WHATSAPP_LABEL = "WhatsApp 819 919 8683";
export const IR_WHATSAPP_URL = "https://wa.me/18199198683";
export const IR_CTA = "Parlons de votre projet";
```

In `src/catalog.ts`, change only:

```ts
{ id: "ecosysteme", label: "Écosystème IR", icon: Layers, slideCount: 1 },
```

Use U+2019 in `l’urgence` if present. The recruitment body uses French quotes « » around garanti.

- [ ] **Step 4: GREEN** `npx vitest run src/data/ecosystem.test.ts`

- [ ] **Step 5: no commit**

---

### Task 2: EcosystemSection one-page chrome

**Files:** `src/features/sales.tsx`, `src/features/sales.test.ts`

- [ ] **Step 1: failing tests**

Append to `src/features/sales.test.ts` (keep existing echecs tests):

```ts
describe("ecosystem catalog", () => {
  it("keeps a single ecosystem slide", () => {
    expect(sections.find((section) => section.id === "ecosysteme")?.slideCount).toBe(1);
  });
});

describe("ecosystem chrome", () => {
  it("reuses the profil client shell on EcosystemSection", () => {
    expect(source).toContain("export function EcosystemSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Un seul interlocuteur pour construire tout le projet.");
    expect(source).toContain("Immigration + Emploi + Installation = Projet Canada structuré");
    expect(source).toContain("Nous ne nous arrêtons pas au dossier.");
    expect(source).toContain("IR réunit immigration, emploi et installation dans une même logique de projet.");
    expect(source).toContain("Parlons du projet de {name}.");
    expect(source).toContain("Parlons de votre projet");
  });

  it("keeps coaching copy out of EcosystemSection", () => {
    const chunk = extractFunction("EcosystemSection");
    expect(chunk).not.toContain("Le commercial");
    expect(chunk).not.toContain("aider le prospect");
    expect(chunk).not.toContain("version connectée");
    expect(chunk).not.toContain("panel=");
    expect(chunk).not.toContain("useDeckStore");
  });
});

describe("ecosystem boards", () => {
  it("renders three pillars plus contact and WhatsApp CTA", () => {
    expect(source).toContain("ecosystemPillars");
    expect(source).toContain("Recrutement");
    expect(source).toContain("Conciergerie");
    expect(source).toContain("IR_WHATSAPP_URL");
    expect(source).toContain("IR_SITE_URL");
    expect(source).toContain("Contact");
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/features/sales.test.ts`

- [ ] **Step 3: rewrite EcosystemSection**

Replace `export function EcosystemSection` through end of file. Keep `FailuresSection` and its helpers unchanged.

```tsx
export function EcosystemSection() {
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  return (
    <OpportunitiesShell
      kicker="Écosystème IR"
      title="Un seul interlocuteur pour construire tout le projet."
      lead="Immigration + Emploi + Installation = Projet Canada structuré"
      pills={[market.family, market.province, profile.objective]}
    >
      <Surface className="p-4 sm:px-5 sm:py-4">
        <h2 className="text-base font-semibold">Nous ne nous arrêtons pas au dossier.</h2>
        <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
          IR réunit immigration, emploi et installation dans une même logique de projet.
        </p>
      </Surface>
      <div className="grid gap-3 md:grid-cols-3">
        {ecosystemPillars.map((pillar) => (
          <Surface key={pillar.id} className="p-4">
            <p className="text-[9px] font-extrabold tracking-wide text-primary uppercase">{pillar.tag}</p>
            <h3 className="mt-2 mb-1.5 text-base font-semibold">{pillar.title}</h3>
            <p className="text-[13px] leading-relaxed text-[#707987]">{pillar.body}</p>
          </Surface>
        ))}
      </div>
      <Surface className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionLabel>Contact</SectionLabel>
          <p className="mt-2 text-[15px] font-semibold text-[#1a2332]">{smart("Parlons du projet de {name}.", profile)}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            <a href={IR_SITE_URL} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
              {IR_SITE_LABEL}
            </a>
            <a href={IR_WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
              {IR_WHATSAPP_LABEL}
            </a>
          </div>
        </div>
        <a
          href={IR_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-ir-deep"
        >
          {IR_CTA}
        </a>
      </Surface>
    </OpportunitiesShell>
  );
}
```

Add imports: `ecosystemPillars`, `IR_CTA`, `IR_SITE_LABEL`, `IR_SITE_URL`, `IR_WHATSAPP_LABEL`, `IR_WHATSAPP_URL` from `@/data/ecosystem`, `smart` from `@/lib/smart-copy`.

Remove unused `Card`, `Quote`, `Slide` imports if nothing else uses them after this rewrite. Do not remove FailuresSection imports.

`EcosystemSection` must not call `useDeckStore` (single slide).

- [ ] **Step 4: GREEN** `npx vitest run src/features/sales.test.ts src/data/ecosystem.test.ts`

- [ ] **Step 5: no commit**
