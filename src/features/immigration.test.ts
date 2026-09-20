import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileCheck,
  FilePlus,
  FileText,
  GraduationCap,
  Languages,
  ListChecks,
  Mail,
  Plane,
  Scale,
  School,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import { routes } from "@/data/routes";
import { iconForStep } from "@/features/immigration";

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
  it("keeps two pathway slides", () => {
    expect(sections.find((section) => section.id === "voies")?.slideCount).toBe(2);
  });
});

describe("voies chrome", () => {
  it("reuses the profil client shell on RoutesSection", () => {
    expect(source).toContain("export function RoutesSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Une destination. Plusieurs chemins.");
    expect(source).toContain("Le chemin dépend du foyer et de l’objectif, pas d’une brochure.");
    expect(source).not.toContain("Un statut n’est pas encore le suivant.");
    expect(source).not.toContain("Chaque passerelle a des conditions. Les sauter coûte des années.");
    expect(market).toContain("export function OpportunitiesShell");
    expect(source).toContain("hero={sectionBanners.routes}");
    expect(source).toContain("hero={sectionBanners.compare}");
  });

  it("keeps coaching copy out of Routes helpers", () => {
    for (const name of ["RoutesSection", "RoutesOverview", "RoutesDetail"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("conseil juridique automatisé");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("voies boards", () => {
  it("renders overview and a detail view", () => {
    expect(source).toContain("Objectif");
    expect(source).not.toContain("Aucune passerelle pour ce point de départ.");
    expect(source).not.toContain("function RoutesBridges");
    expect(source).toContain("Voies · Détail");
    expect(source).toContain("Aperçu de démonstration. Pas un avis juridique.");
    expect(source).toContain("routeForObjective");
    expect(source).not.toContain("bridgesFrom");
    expect(source).toContain("Pour qui :");
    expect(source).toContain("function RouteSteps");
    expect(source).toContain("Points d’attention");
  });

  it("embeds study tuition, funds, outcomes and a spouse card only when a partner is on file", () => {
    expect(source).toContain("function StudyClosingCards");
    expect(source).toContain("Tarifs d’études internationaux · par année");
    expect(source).toContain("Cégep");
    expect(source).toContain("Université");
    expect(source).toContain("Année 1 · Foyer");
    expect(source).toContain("Preuve de fonds");
    expect(source).toContain("Après le diplôme · Programme");
    expect(source).toContain("Pendant les études · Conjoint parrainé");
    expect(source).toContain("Permis de travail ouvert pendant les études du candidat.");
    expect(source).toContain("cost.spouse");
    expect(source).toContain("studyCost");
    expect(source).toContain("s.draft");
    const detail = extractFunction("StudyClosingCards");
    expect(detail).toContain("cost.spouse ?");
    expect(source).not.toContain("slideCount: 3");
  });

  it("embeds work permit closing cards with FEER and spouse gating", () => {
    expect(source).toContain("function WorkClosingCards");
    expect(source).toContain("NocSearchField");
    expect(source).toContain("workCost");
    expect(source).toContain("workPathways");
    expect(source).toContain("Permis · Ouvert ou fermé");
    expect(source).toContain("Renouvellement");
    expect(source).toContain("Vers la RP · Après une période");
    expect(source).toContain("Année 1 · Foyer");
    expect(source).toContain("Vérifiez sur IRCC.");
    expect(source).toContain("Trouver votre CNP");
    expect(source).toContain("cost.spouse");
    expect(source).toContain("pathways.spouseOpen.reason");
    const detail = extractFunction("WorkClosingCards");
    expect(detail).toContain('className="p-4 lg:col-span-2"');
    expect(detail.match(/className="p-4 lg:col-span-2"/g)?.length).toBe(2);
    // Important: avoid falling back to the first permit when none selected
    expect(source).not.toContain("?? pathways.permits[0]");
    // UI should show a neutral prompt when no work permit kind is selected
    expect(source).toContain("Choisissez un type de permis");
  });

  it("embeds visit closing cards with no-work copy and accompanying gating", () => {
    expect(source).toContain("function VisitClosingCards");
    expect(source).toContain("visitCost");
    expect(source).toContain("Frais de voyage · Visa / eTA / biométrie");
    expect(source).toContain("Séjour · Foyer");
    expect(source).toContain("Motif et attaches");
    expect(source).toContain("cost.accompanying");
    expect(source).toContain("un visa visiteur n’autorise pas à travailler ni à étudier");
    expect(source).toContain("canWork");
    const detail = extractFunction("VisitClosingCards");
    expect(detail).toContain("Par personne");
    expect(detail).toContain("Foyer");
    expect(detail).toContain("Frais additionnels");
    expect(detail).toContain("etaLikelyCountries");
    expect(detail).toContain("Statut visiteur");
    expect(detail).toContain('firstName || "Enfant"');
  });

  it("embeds business closing cards with thresholds, pause copy and spouse gating", () => {
    expect(source).toContain("function BusinessClosingCards");
    expect(source).toContain("businessCost");
    expect(source).toContain("Volets · Seuils d’investissement");
    expect(source).toContain("13 provinces/territories");
    expect(source).toContain("pause IRCC");
    expect(source).toContain("startupVisaPaused");
    expect(source).toContain("Pendant le projet · Conjoint");
    expect(source).toContain("Fonds personnels approx");
    expect(source).toContain("businessThresholdsLabel");
    const detail = extractFunction("BusinessClosingCards");
    expect(detail).toContain("cost.spouse ?");
    expect(detail).toContain("cost.grid.map");
    expect(detail).toContain("cost.credibility");
    expect(detail).not.toContain("familyHasSpouse");
  });

  it("embeds family closing cards with four titles and a reminder state", () => {
    expect(source).toContain("function FamilyClosingCards");
    expect(source).toContain("familyCost");
    expect(source).toContain("Liens admissibles · Délais");
    expect(source).toContain("Engagement · Revenu");
    expect(source).toContain("Frais et vie · Foyer réuni");
    expect(source).toContain("Personne parrainée");
    expect(source).toContain("cost.reminder");
    expect(source).toContain("Résident ou citoyen");
    expect(source).toContain("Fonds / aisance");
    expect(source).toContain("cost.childSponsored");
    expect(source).toContain("études ou travail après l’arrivée");
    // Important: do not hardcode IRCC delays in the UI; read them from cost.delay.tracks by label
    expect(source).not.toContain('"14-20 mois"');
    expect(source).not.toContain('"environ 36 mois"');
    expect(source).toContain("cost.delay.tracks");
    expect(source).toContain("Hors Québec");
    expect(source).toContain("Québec");
  });
});

describe("comparateur catalog", () => {
  it("keeps two comparator slides", () => {
    expect(sections.find((section) => section.id === "comparateur")?.slideCount).toBe(2);
  });
});

describe("comparateur chrome", () => {
  it("reuses the profil client shell on CompareSection", () => {
    expect(source).toContain("export function CompareSection");
    expect(source).toContain("Comparer les voies côte à côte.");
    expect(source).toContain("Cochez jusqu’à trois voies. Les délais IRCC apparaissent en premier.");
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
    expect(source).toContain("role=\"checkbox\"");
    expect(source).not.toContain("disabled={locked}");
    expect(source).toContain("mt-auto shrink-0");
    expect(source).toContain("flex flex-1 flex-col gap-3 pb-1");
    expect(source).not.toContain("flex min-h-0 flex-1 flex-col gap-3 pb-1");
    expect(source).toContain("ir-auto-grid flex-1 items-stretch");
    expect(source).toContain("flex h-full min-h-min flex-col overflow-hidden");
    const compareColumn = extractFunction("CompareColumn");
    expect(compareColumn).toContain("min-h-min");
    expect(compareColumn).not.toContain("min-h-0");
  });

  it("puts current IRCC processing times first in the comparator", () => {
    expect(source).toContain("irccTimeFor");
    expect(source).toContain("Délais approximatifs");
    expect(source).toContain("Vérifier sur canada.ca");
    expect(source).toContain("Plus rapide");
    expect(source).toContain("DelayChip");
    expect(source).toContain("DelayBanner");
    expect(source).toContain("irccFundsFor");
    expect(source).toContain("FundsChip");
    expect(source).toContain("FundsBanner");
    expect(source).toContain("Preuve de fonds");
  });
});

const stepIcons: Record<string, LucideIcon> = {
  "Évaluer le profil": ClipboardCheck,
  "Passer les tests de langue": Languages,
  "Évaluer les diplômes si requis": GraduationCap,
  "Créer le profil": FilePlus,
  "Recevoir une invitation éventuelle": Mail,
  "Déposer le dossier": FileCheck,
  "Traitement et décision": Scale,
  "Définir le projet": Target,
  "Choisir le programme": ListChecks,
  "Obtenir l’admission": School,
  "Préparer les autorisations": ShieldCheck,
  "Déposer le permis": BadgeCheck,
  "Préparer l’arrivée": Plane,
  "Étudier et bâtir la carrière": BookOpen,
  "Choisir la province": ListChecks,
  "Vérifier le volet": ListChecks,
  "Préparer le profil": FilePlus,
  "Soumettre la demande": FileCheck,
  "Nomination éventuelle": Mail,
  "Étape fédérale": Scale,
  "Décision": Scale,
  "Identifier l’emploi": Briefcase,
  "Vérifier le permis applicable": BadgeCheck,
  "Préparer employeur et documents": Briefcase,
  "Déposer la demande": FileCheck,
  "Arrivée et emploi": Plane,
  "Vérifier le lien admissible": UsersRound,
  "Préparer le répondant": UsersRound,
  "Constituer les preuves": FileText,
  "Déposer": FileCheck,
  "Suivi": Search,
  "Clarifier le projet": Target,
  "Choisir la voie": Target,
  "Préparer le dossier": FileCheck,
  "Structurer le voyage ou projet": Plane,
  "Développer le réseau": UsersRound,
  "Clarifier le motif du voyage": Target,
  "Réunir fonds et attaches": Wallet,
  "Voyager si approuvé": Plane,
  "Respecter les conditions du séjour": ShieldCheck,
  "Évaluer si la crainte est fondée": ClipboardCheck,
  "Déposer la demande au Canada": FileCheck,
  "Préparer le récit et les preuves": FileText,
  "Audience ou étude du dossier": Scale,
  "Décision et suite de statut": Scale,
};

describe("pathway step icons", () => {
  it("covers every route step with a dedicated pictogram", () => {
    const steps = [...new Set(routes.flatMap((route) => route.steps))];
    expect(steps.sort()).toEqual(Object.keys(stepIcons).sort());
    for (const step of steps) {
      expect(iconForStep(step), step).toBe(stepIcons[step]);
    }
  });

  it("does not treat a professional network as a job briefcase", () => {
    expect(iconForStep("Développer le réseau")).toBe(UsersRound);
    expect(iconForStep("Développer le réseau")).not.toBe(Briefcase);
  });
});

describe("voies equal grids", () => {
  it("renders salary bands with the shared equal-row helper instead of bare grid-cols-3", () => {
    const chunk = extractFunction("StudyClosingCards");
    expect(chunk).toContain("BandMini label=\"Bas\"");
    expect(chunk).toContain("BandMini label=\"Médian\"");
    expect(chunk).toContain("BandMini label=\"Élevé\"");
    expect(chunk).toContain("ir-equal-row");
    expect(chunk).not.toContain("grid grid-cols-3");
  });

  it("uses the shared option-grid helper for route toggles in the comparator", () => {
    const chunk = extractFunction("CompareTable");
    expect(chunk).toContain("role=\"group\" aria-label=\"Voies à comparer\"");
    expect(chunk).toContain("ir-option-grid");
    expect(chunk).not.toContain("className=\"flex flex-wrap gap-1.5\"");
  });
});

