# Africa Préparation + UX Opportunités Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrichir l’étape Préparation (TEF/TCF, emploi…) et redesign Opportunités + parcours pour que le closing Afrique fasse saisir l’opportunité.

**Architecture:** Données dans `ecosystem.ts` (`items` optionnels sur `JourneyStep`) ; UI dans `africa.tsx` (Emploi vedette + checklist Préparation). Pas de nouvelle section catalogue.

**Tech Stack:** React, TypeScript, Vitest, Tailwind (patterns `@min-[…]` existants).

## Global Constraints

- Exactement 4 items sur `prepare` : `Test de français (TEF / TCF)`, `CV & positionnement emploi`, `Documents & preuves`, `Calendrier cohérent`
- IDs parcours inchangés : `diagnostic`, `strategy`, `prepare`, `file`, `settle`
- Conserver drawer preuves + `OPPORTUNITY_THEMES` ; Emploi en carte vedette (span 2 cols dès `@min-[36rem]`)
- Pas d’emploi « garanti », pas de nouvelle slide, pas d’honoraires
- Commits uniquement sur les fichiers de cette feature (ne pas tout stager)

---

### Task 1: Données journeySteps — items Préparation

**Files:**
- Modify: `src/data/ecosystem.ts`
- Modify: `src/data/africa-funnel.test.ts`
- Modify: `src/data/ecosystem.test.ts` (ajouter assertion items si pertinent)

**Interfaces:**
- Produces: `JourneyStep` avec `items?: string[]` ; `journeySteps` où `prepare.items` a longueur 4

- [ ] **Step 1: Write the failing test**

Dans `src/data/africa-funnel.test.ts`, étendre le test journey :

```ts
const prepare = journeySteps.find((s) => s.id === "prepare");
expect(prepare?.body).toMatch(/Langue|emploi|preuves/i);
expect(prepare?.items).toEqual([
  "Test de français (TEF / TCF)",
  "CV & positionnement emploi",
  "Documents & preuves",
  "Calendrier cohérent",
]);
expect(journeySteps.filter((s) => s.items?.length).map((s) => s.id)).toEqual(["prepare"]);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/africa-funnel.test.ts`
Expected: FAIL (items undefined)

- [ ] **Step 3: Write minimal implementation**

Dans `src/data/ecosystem.ts` :

```ts
export type JourneyStep = {
  id: string;
  title: string;
  body: string;
  items?: string[];
};

export const journeySteps: JourneyStep[] = [
  { id: "diagnostic", title: "Diagnostic", body: "Comprendre le profil, les objectifs et les contraintes du foyer." },
  { id: "strategy", title: "Stratégie", body: "Choisir une voie réaliste — le détail se construit en consultation." },
  {
    id: "prepare",
    title: "Préparation",
    body: "Langue, emploi et preuves — avant le dépôt.",
    items: [
      "Test de français (TEF / TCF)",
      "CV & positionnement emploi",
      "Documents & preuves",
      "Calendrier cohérent",
    ],
  },
  { id: "file", title: "Dépôt & suivi", body: "Coordination du dossier et réponses aux autorités." },
  { id: "settle", title: "Installation", body: "Emploi, logement et repères dès l’arrivée." },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/africa-funnel.test.ts src/data/ecosystem.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/ecosystem.ts src/data/africa-funnel.test.ts src/data/ecosystem.test.ts
git commit -m "feat(africa): checklist Préparation TEF/TCF et emploi"
```

---

### Task 2: UI Opportunités vedette + parcours checklist

**Files:**
- Modify: `src/features/africa.tsx` (`AfricaOpportunitiesSection`, `AfricaEcosystemSection`)
- Modify: `src/features/africa.test.ts` (smoke si utile ; sinon garder registry)

**Interfaces:**
- Consumes: `journeySteps` avec `items?` ; `OPPORTUNITY_THEMES`
- Produces: Emploi span-2 ; étape prepare rend `items` en liste

- [ ] **Step 1: Write the failing test**

Dans `src/features/africa.test.ts`, ajouter :

```ts
import { journeySteps } from "@/data/ecosystem";
import { OPPORTUNITY_THEMES } from "@/data/opportunity-proof";

it("features employment opportunity and prepare checklist data for UI", () => {
  expect(OPPORTUNITY_THEMES.some((t) => t.id === "employment")).toBe(true);
  expect(journeySteps.find((s) => s.id === "prepare")?.items?.length).toBe(4);
});
```

(Le rendu JSX se valide manuellement / via review ; le contrat données+registry suffit.)

- [ ] **Step 2: Run test — may pass on data alone; then implement UI**

- [ ] **Step 3: Implement UI**

**Opportunités** — séparer `employment` des autres :

```tsx
const featured = OPPORTUNITY_THEMES.find((t) => t.id === "employment")!;
const rest = OPPORTUNITY_THEMES.filter((t) => t.id !== "employment");
```

Rendre `featured` dans un bouton avec `className` incluant `@min-[36rem]:col-span-2` à l’intérieur d’une grille `grid gap-3 @min-[36rem]:grid-cols-2` (ou `@min-[36rem]:grid-cols-3` pour le reste). Aide : `Cliquez une carte pour voir les preuves liées au profil.`

**Parcours** — pour chaque step, si `step.items?.length`, afficher :

```tsx
<ul className="mt-2 space-y-1">
  {step.items.map((item) => (
    <li key={item} className="text-[11px] leading-snug text-[#1a2332]">• {item}</li>
  ))}
</ul>
```

Sur `prepare`, Surface avec `className` incluant `border-primary/25 bg-secondary/50`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/features/africa.test.ts src/data/africa-funnel.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/africa.tsx src/features/africa.test.ts
git commit -m "feat(africa): Emploi vedette et checklist visible au parcours"
```
