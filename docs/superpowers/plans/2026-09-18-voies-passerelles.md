# Voies passerelles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Restyler Voies d’immigration : chrome foyer, passerelles avec conditions, vue détail.

**Architecture:** Étendre `routes` (conditions + visiteur + asile) et `routeBridges`. Helper pur `route-paths`. Réécrire `RoutesSection` avec `OpportunitiesShell` exporté. `slideCount` reste 3. `CompareSection` inchangé.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any git command. Do not commit.
- French UI. English code/types/tests. Apostrophe U+2019 in French UI.
- Keep catalog `voies.slideCount` at `3`.
- Do not modify CompareSection, Provinces, Calculators, Jobs, Salaries, Opportunities behavior (except exporting chrome helpers from market.tsx).
- Reuse `OpportunitiesShell`, `Surface`, `SectionLabel`. No `panel=`. No `JobsBriefingPanel`. No `À retenir`. No `La question`.
- No profile store setters. `setRoute` on the deck store is allowed.
- Forbidden copy: `Le commercial`, `le commercial`, `version connectée`, `conseil juridique automatisé`, `développeur d’affaires`.
- Exact copy:
  - Slide 1 kicker `Voies d’immigration`
  - Slide 1 title `Une destination. Plusieurs chemins.`
  - Slide 1 lead `Le chemin dépend du foyer et de l’objectif, pas d’une brochure.`
  - Badge `Objectif`
  - Slide 2 kicker `Voies · Passerelles`
  - Slide 2 title `Un statut n’est pas encore le suivant.`
  - Slide 2 lead `Chaque passerelle a des conditions. Les sauter coûte des années.`
  - Empty `Aucune passerelle pour ce point de départ.`
  - Slide 3 kicker `Voies · Détail`
  - Slide 3 lead prefix `Pour qui : `
  - Labels `Conditions` `Points positifs` `Points d’attention` `Étapes`
  - Disclaimer `Aperçu de démonstration. Pas un avis juridique.`
  - Asylum caution `L’asile protège. Ce n’est pas un plan B économique.`
- Skip git; DONE still applies.
- Vitest source-read pattern for UI tests.

## File structure

- Modify: `src/data/routes.ts`
- Create: `src/lib/route-paths.ts`
- Create: `src/lib/route-paths.test.ts`
- Modify: `src/features/market.tsx` (export OpportunitiesShell, Surface, SectionLabel only)
- Modify: `src/features/immigration.tsx` (`RoutesSection` only)
- Create: `src/features/immigration.test.ts`

---

### Task 1: routes, bridges, path helper

**Files:** `src/data/routes.ts`, `src/lib/route-paths.ts`, `src/lib/route-paths.test.ts`

- [ ] **Step 1: failing tests**

Create `src/lib/route-paths.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { routeBridges, routes } from "@/data/routes";
import { bridgesFrom, routeById, routeForObjective } from "@/lib/route-paths";

describe("routes", () => {
  it("lists eight demo pathways including visitor and asylum", () => {
    expect(routes).toHaveLength(8);
    expect(routes.map((route) => route.id)).toEqual([
      "ee",
      "study",
      "pnp",
      "work",
      "family",
      "business",
      "visit",
      "asylum",
    ]);
    expect(routes.every((route) => route.conditions.length > 0)).toBe(true);
  });
});

describe("routeBridges", () => {
  it("lists eight bridges and warns that asylum is not an economic plan B", () => {
    expect(routeBridges).toHaveLength(8);
    const asylum = routeBridges.find((bridge) => bridge.id === "visit-asylum");
    expect(asylum?.from).toBe("visit");
    expect(asylum?.to).toBe("asylum");
    expect(asylum?.caution).toBe("L’asile protège. Ce n’est pas un plan B économique.");
  });
});

describe("route paths", () => {
  it("maps the profile objective to a starting route", () => {
    expect(routeForObjective("Résidence permanente").id).toBe("ee");
    expect(routeForObjective("Études").id).toBe("study");
    expect(routeForObjective("Travail").id).toBe("work");
    expect(routeForObjective("Visite").id).toBe("visit");
    expect(routeForObjective("Affaires").id).toBe("business");
    expect(routeForObjective("Regroupement familial").id).toBe("family");
    expect(routeById("study")?.name).toBe("Permis d’études");
  });

  it("returns visitor bridges toward study, work and asylum", () => {
    expect(bridgesFrom("visit").map((bridge) => bridge.to)).toEqual(["study", "work", "asylum"]);
    expect(bridgesFrom("work").map((bridge) => bridge.to)).toEqual(["pnp", "ee"]);
    expect(bridgesFrom("family")).toEqual([]);
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/lib/route-paths.test.ts`

- [ ] **Step 3: implementation**

Replace `src/data/routes.ts` entirely with:

```ts
export type ImmigrationRoute = {
  id: string;
  name: string;
  tag: string;
  fit: string;
  conditions: string[];
  positives: string[];
  attention: string[];
  steps: string[];
};

export type RouteBridge = {
  id: string;
  from: string;
  to: string;
  title: string;
  conditions: string[];
  caution?: string;
};

export const routes: ImmigrationRoute[] = [
  {
    id: "ee",
    name: "Entrée express",
    tag: "Résidence permanente",
    fit: "Professionnels qualifiés",
    conditions: [
      "Profil compétitif au classement",
      "Tests de langue à jour",
      "Invitation reçue avant de déposer",
    ],
    positives: [
      "Voie directe vers la résidence permanente pour certains profils",
      "Le français peut être un avantage",
      "Projet familial possible selon la situation",
    ],
    attention: [
      "Système compétitif",
      "Tests linguistiques importants",
      "Invitation jamais garantie",
    ],
    steps: [
      "Évaluer le profil",
      "Passer les tests de langue",
      "Évaluer les diplômes si requis",
      "Créer le profil",
      "Recevoir une invitation éventuelle",
      "Déposer le dossier",
      "Traitement et décision",
    ],
  },
  {
    id: "study",
    name: "Permis d’études",
    tag: "Études",
    fit: "Projet de formation canadienne",
    conditions: [
      "Lettre d’admission d’un établissement désigné",
      "Preuve de fonds pour scolarité et vie",
      "Respect des heures de travail autorisées",
    ],
    positives: [
      "Diplôme canadien",
      "Réseau local",
      "Expérience canadienne possible selon les règles",
    ],
    attention: [
      "Investissement important",
      "Le choix du programme est critique",
      "Les règles après diplôme peuvent changer",
    ],
    steps: [
      "Définir le projet",
      "Choisir le programme",
      "Obtenir l’admission",
      "Préparer les autorisations",
      "Déposer le permis",
      "Préparer l’arrivée",
      "Étudier et bâtir la carrière",
    ],
  },
  {
    id: "pnp",
    name: "Programme provincial",
    tag: "Résidence permanente",
    fit: "Profils alignés aux besoins régionaux",
    conditions: [
      "Volet ouvert dans la province visée",
      "Métier ou offre alignés au volet",
      "Étape fédérale après une nomination",
    ],
    positives: [
      "Approche régionale",
      "Peut valoriser certains métiers",
      "Plusieurs provinces à explorer",
    ],
    attention: [
      "Critères propres à chaque province",
      "Offre d’emploi parfois requise",
      "Volets peuvent ouvrir ou fermer",
    ],
    steps: [
      "Choisir la province",
      "Vérifier le volet",
      "Préparer le profil",
      "Soumettre la demande",
      "Nomination éventuelle",
      "Étape fédérale",
      "Décision",
    ],
  },
  {
    id: "work",
    name: "Permis de travail",
    tag: "Travail",
    fit: "Projet professionnel temporaire",
    conditions: [
      "Offre et type de permis alignés",
      "EIMT ou exemption selon le cas",
      "Ne pas commencer avant l’approbation",
    ],
    positives: [
      "Expérience canadienne",
      "Revenus au Canada",
      "Développement du réseau",
    ],
    attention: [
      "Certains permis sont liés à un employeur",
      "Une offre ne garantit pas un permis",
      "Conditions variables",
    ],
    steps: [
      "Identifier l’emploi",
      "Vérifier le permis applicable",
      "Préparer employeur et documents",
      "Déposer la demande",
      "Décision",
      "Arrivée et emploi",
    ],
  },
  {
    id: "family",
    name: "Regroupement familial",
    tag: "Famille",
    fit: "Réunification familiale",
    conditions: [
      "Lien familial admissible",
      "Répondant résident ou citoyen",
      "Engagements financiers possibles",
    ],
    positives: [
      "Projet centré sur la famille",
      "Voies dédiées selon le lien familial",
    ],
    attention: [
      "Admissibilité spécifique",
      "Engagements possibles",
      "Délais variables",
    ],
    steps: [
      "Vérifier le lien admissible",
      "Préparer le répondant",
      "Constituer les preuves",
      "Déposer",
      "Suivi",
      "Décision",
    ],
  },
  {
    id: "business",
    name: "Affaires",
    tag: "Entrepreneuriat",
    fit: "Entrepreneurs et gens d’affaires",
    conditions: [
      "Projet d’affaires crédible",
      "Capacité financière démontrable",
      "Volet entrepreneur ou visiteur d’affaires selon le cas",
    ],
    positives: [
      "Développement commercial",
      "Accès à un réseau canadien",
      "Voies variées selon projet",
    ],
    attention: [
      "Critères financiers et d’expérience",
      "Projet d’affaires crédible",
      "Programmes variables",
    ],
    steps: [
      "Clarifier le projet",
      "Choisir la voie",
      "Préparer le dossier",
      "Structurer le voyage ou projet",
      "Déposer",
      "Développer le réseau",
    ],
  },
  {
    id: "visit",
    name: "Visa visiteur",
    tag: "Visite",
    fit: "Séjour temporaire",
    conditions: [
      "Intention temporaire démontrable",
      "Preuve de fonds et d’attaches",
      "Pas de travail ni d’études sans permis",
    ],
    positives: [
      "Découvrir le pays avant un projet plus long",
      "Rencontrer de la famille ou un réseau",
    ],
    attention: [
      "Un visa visiteur n’autorise pas à travailler",
      "Changer de statut n’est jamais automatique",
      "Durée limitée",
    ],
    steps: [
      "Clarifier le motif du voyage",
      "Réunir fonds et attaches",
      "Déposer la demande",
      "Voyager si approuvé",
      "Respecter les conditions du séjour",
    ],
  },
  {
    id: "asylum",
    name: "Asile et protection",
    tag: "Protection",
    fit: "Crainte fondée de persécution",
    conditions: [
      "Crainte fondée de persécution",
      "Demande faite au Canada",
      "Récit et preuves cohérents",
    ],
    positives: [
      "Protection si la crainte est établie",
      "Accès possible à un statut durable ensuite",
    ],
    attention: [
      "Ce n’est pas une voie d’immigration économique",
      "Délais longs et incertains",
      "Voyager peut être restreint pendant la procédure",
    ],
    steps: [
      "Évaluer si la crainte est fondée",
      "Déposer la demande au Canada",
      "Préparer le récit et les preuves",
      "Audience ou étude du dossier",
      "Décision et suite de statut",
    ],
  },
];

export const routeBridges: RouteBridge[] = [
  {
    id: "visit-study",
    from: "visit",
    to: "study",
    title: "Visiteur vers permis d’études",
    conditions: [
      "Lettre d’admission d’un établissement désigné",
      "Preuve de fonds pour scolarité et vie",
      "Intention réelle d’étudier",
      "Ne pas étudier avant l’approbation",
    ],
  },
  {
    id: "visit-work",
    from: "visit",
    to: "work",
    title: "Visiteur vers permis de travail",
    conditions: [
      "Offre d’emploi correspondant au permis",
      "EIMT ou exemption selon le cas",
      "Ne pas commencer à travailler avant l’approbation",
      "Permis fermé ou ouvert selon le programme",
    ],
  },
  {
    id: "visit-asylum",
    from: "visit",
    to: "asylum",
    title: "Visiteur vers asile",
    conditions: [
      "Crainte fondée de persécution",
      "Demande faite au Canada",
      "Preuves et récit cohérents",
    ],
    caution: "L’asile protège. Ce n’est pas un plan B économique.",
  },
  {
    id: "study-work",
    from: "study",
    to: "work",
    title: "Études vers permis de travail",
    conditions: [
      "Programme admissible au permis postdiplôme, si visé",
      "Respect des heures de travail pendant les études",
      "Permis d’études encore valide au dépôt",
      "Le droit de travailler n’est pas automatique",
    ],
  },
  {
    id: "study-ee",
    from: "study",
    to: "ee",
    title: "Études vers Entrée express",
    conditions: [
      "Diplôme et expérience qui comptent au classement",
      "Tests de langue à jour",
      "Invitation jamais garantie",
    ],
  },
  {
    id: "work-pnp",
    from: "work",
    to: "pnp",
    title: "Travail vers programme provincial",
    conditions: [
      "Emploi et province alignés au volet",
      "Offre ou expérience parfois exigée",
      "Les volets ouvrent et ferment",
    ],
  },
  {
    id: "work-ee",
    from: "work",
    to: "ee",
    title: "Travail vers Entrée express",
    conditions: [
      "Expérience canadienne ou étrangère admissible",
      "Langue et études évaluées",
      "Invitation jamais garantie",
    ],
  },
  {
    id: "ee-family",
    from: "ee",
    to: "family",
    title: "Résidence permanente vers regroupement",
    conditions: [
      "Statut de résident ou citoyen du répondant",
      "Lien familial admissible",
      "Engagements financiers possibles",
    ],
  },
];
```

Create `src/lib/route-paths.ts`:

```ts
import { routeBridges, routes } from "@/data/routes";

const OBJECTIVE_ROUTE: Record<string, string> = {
  "Résidence permanente": "ee",
  "Études": "study",
  "Travail": "work",
  "Visite": "visit",
  "Affaires": "business",
  "Regroupement familial": "family",
};

export function routeById(id: string) {
  return routes.find((route) => route.id === id) ?? routes[0];
}

export function routeForObjective(objective: string) {
  return routeById(OBJECTIVE_ROUTE[objective] ?? "ee");
}

export function bridgesFrom(routeId: string) {
  return routeBridges.filter((bridge) => bridge.from === routeId);
}
```

- [ ] **Step 4: GREEN** `npx vitest run src/lib/route-paths.test.ts`

- [ ] **Step 5: no commit**

---

### Task 2: RoutesSection chrome + passerelles + détail

**Files:** `src/features/market.tsx`, `src/features/immigration.tsx`, `src/features/immigration.test.ts`

- [ ] **Step 1: failing tests**

Create `src/features/immigration.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "immigration.tsx"), "utf8");
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

describe("voies catalog", () => {
  it("keeps three pathway slides", () => {
    expect(sections.find((section) => section.id === "voies")?.slideCount).toBe(3);
  });
});

describe("voies chrome", () => {
  it("reuses the profil client shell on RoutesSection", () => {
    expect(source).toContain("export function RoutesSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Une destination. Plusieurs chemins.");
    expect(source).toContain("Le chemin dépend du foyer et de l’objectif, pas d’une brochure.");
    expect(source).toContain("Un statut n’est pas encore le suivant.");
    expect(source).toContain("Chaque passerelle a des conditions. Les sauter coûte des années.");
    expect(market).toContain("export function OpportunitiesShell");
  });

  it("keeps coaching copy out of Routes helpers", () => {
    for (const name of ["RoutesSection", "RoutesOverview", "RoutesBridges", "RoutesDetail"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("conseil juridique automatisé");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("voies boards", () => {
  it("renders bridges with conditions and a detail view", () => {
    expect(source).toContain("Objectif");
    expect(source).toContain("Aucune passerelle pour ce point de départ.");
    expect(source).toContain("Voies · Détail");
    expect(source).toContain("Aperçu de démonstration. Pas un avis juridique.");
    expect(source).toContain("routeForObjective");
    expect(source).toContain("bridgesFrom");
    expect(source).toContain("Pour qui :");
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/features/immigration.test.ts`

- [ ] **Step 3: export chrome then rewrite RoutesSection**

In `src/features/market.tsx`, change only these signatures to export:

`export function OpportunitiesShell`
`export function Surface`
`export function SectionLabel`

Leave `CompareSection` in immigration.tsx untouched.

Replace `RoutesSection` (keep `CompareSection` after it) in `src/features/immigration.tsx` with:

```tsx
import { useState } from "react";
import { Timeline } from "@/components/deck/primitives";
import { Card } from "@/components/ui/card";
import { routeBridges, routes } from "@/data/routes";
import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";
import { householdMarket } from "@/lib/household-market";
import { bridgesFrom, routeById, routeForObjective } from "@/lib/route-paths";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function RoutesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  const selectedRoute = useDeckStore((s) => s.selectedRoute);
  const setRoute = useDeckStore((s) => s.setRoute);
  const aligned = routeForObjective(profile.objective);
  const route = routeById(selectedRoute);
  if (slide === 1) {
    return (
      <RoutesBridges
        market={market}
        objective={profile.objective}
        alignedId={aligned.id}
        onOpen={setRoute}
      />
    );
  }
  if (slide === 2) {
    return <RoutesDetail market={market} route={route} />;
  }
  return (
    <RoutesOverview
      market={market}
      objective={profile.objective}
      selectedId={route.id}
      alignedId={aligned.id}
      onSelect={setRoute}
    />
  );
}

function RoutesOverview({
  market,
  objective,
  selectedId,
  alignedId,
  onSelect,
}: {
  market: ReturnType<typeof householdMarket>;
  objective: string;
  selectedId: string;
  alignedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <OpportunitiesShell
      kicker="Voies d’immigration"
      title="Une destination. Plusieurs chemins."
      lead="Le chemin dépend du foyer et de l’objectif, pas d’une brochure."
      pills={[market.family, market.province, objective]}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {routes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "rounded-[14px] border bg-white p-4 text-left transition-shadow",
              item.id === selectedId
                ? "border-primary shadow-[0_8px_20px_rgba(11,57,121,.08)]"
                : "border-border hover:border-[#9dbbe0]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-extrabold text-primary uppercase">{item.tag}</span>
              {item.id === alignedId ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Objectif
                </span>
              ) : null}
            </span>
            <strong className="mt-1.5 block text-base">{item.name}</strong>
            <small className="mt-1.5 block text-[#788291]">{item.fit}</small>
          </button>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function RoutesBridges({
  market,
  objective,
  alignedId,
  onOpen,
}: {
  market: ReturnType<typeof householdMarket>;
  objective: string;
  alignedId: string;
  onOpen: (id: string) => void;
}) {
  const starts = [...new Set(routeBridges.map((bridge) => bridge.from))];
  const [fromId, setFromId] = useState(alignedId);
  const selectedFrom = starts.includes(fromId) ? fromId : starts[0];
  const bridges = bridgesFrom(selectedFrom);
  return (
    <OpportunitiesShell
      kicker="Voies · Passerelles"
      title="Un statut n’est pas encore le suivant."
      lead="Chaque passerelle a des conditions. Les sauter coûte des années."
      pills={[market.family, objective]}
    >
      <div className="flex flex-wrap gap-2">
        {starts.map((id) => {
          const route = routeById(id);
          const on = id === selectedFrom;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFromId(id)}
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
      {bridges.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">Aucune passerelle pour ce point de départ.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {bridges.map((bridge) => {
            const from = routeById(bridge.from);
            const to = routeById(bridge.to);
            return (
              <button
                key={bridge.id}
                type="button"
                onClick={() => onOpen(bridge.to)}
                className="rounded-[14px] border border-border bg-white p-4 text-left transition hover:border-primary"
              >
                <span className="text-[10px] uppercase text-muted-foreground">
                  {from.name} → {to.name}
                </span>
                <strong className="mt-1 block text-[15px]">{bridge.title}</strong>
                <ul className="mt-2 space-y-1 text-[12px] text-[#3d4b5c]">
                  {bridge.conditions.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
                {bridge.caution ? (
                  <p className="mt-3 rounded-xl bg-[#fff6e8] px-3 py-2 text-[12px] font-medium text-[#8c5a1d]">
                    {bridge.caution}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </OpportunitiesShell>
  );
}

function RoutesDetail({
  market,
  route,
}: {
  market: ReturnType<typeof householdMarket>;
  route: ReturnType<typeof routeById>;
}) {
  return (
    <OpportunitiesShell
      kicker="Voies · Détail"
      title={route.name}
      lead={`Pour qui : ${route.fit}.`}
      pills={[market.family, route.tag]}
    >
      <div className="grid min-h-0 gap-3 lg:grid-cols-2">
        <Surface className="p-4">
          <SectionLabel>Conditions</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
            {route.conditions.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Points positifs</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#295f43]">
            {route.positives.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Points d’attention</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#8c5a1d]">
            {route.attention.map((item) => (
              <li key={item}>⚠ {item}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Étapes</SectionLabel>
          <div className="mt-3">
            <Timeline steps={route.steps} />
          </div>
        </Surface>
      </div>
      <p className="text-[12px] text-muted-foreground">Aperçu de démonstration. Pas un avis juridique.</p>
    </OpportunitiesShell>
  );
}
```

Keep the existing `CompareSection` function after these helpers. Remove unused `Slide` import if CompareSection still needs `Slide` and `Card` — CompareSection still uses `Slide` and `Card` and `smart`. Keep those imports.

If `Card` becomes unused in Routes helpers, CompareSection still uses it.

- [ ] **Step 4: GREEN** `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts`

- [ ] **Step 5: no commit**

Note: `extractFunction` must find `export function RoutesSection` — the test helper already falls back to `export function`.

If CompareSection import of Slide remains, do not delete Slide import.
