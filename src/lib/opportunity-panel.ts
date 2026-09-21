import { ALL_CITIES } from "@/data/job-demand";
import { irccTimeFor } from "@/data/ircc-times";
import type { Profile } from "@/data/profile";
import { provinceCode, provinceData } from "@/data/provinces";
import {
  opportunityPressFor,
  opportunityThemeLabel,
  type OpportunityPressArticle,
  type OpportunityThemeId,
} from "@/data/opportunity-proof";
import { money } from "@/lib/format";
import { householdDemand } from "@/lib/household-demand";
import { householdLiving } from "@/lib/household-living";
import { householdSalaries } from "@/lib/household-salaries";
import { studyCost } from "@/lib/study-cost";

export type OpportunityStat = {
  label: string;
  value: string;
};

export type OpportunityChartBar = {
  label: string;
  value: number;
};

export type OpportunityChart = {
  label: string;
  unit?: string;
  bars: OpportunityChartBar[];
};

export type OpportunityPanel = {
  theme: OpportunityThemeId;
  title: string;
  stats: OpportunityStat[];
  chart: OpportunityChart;
  articles: OpportunityPressArticle[];
  disclaimer: string;
};

const DISCLAIMER = "Sources publiques. Aperçu de démonstration, pas un diagnostic.";

function topProvinces(limit = 5) {
  return Object.entries(provinceData).slice(0, limit);
}

function studyPanel(profile: Profile): Pick<OpportunityPanel, "stats" | "chart"> {
  const cost = studyCost(profile);
  const time = irccTimeFor("study");
  const stats: OpportunityStat[] = [
    { label: "Programme", value: cost.programName ?? "À préciser en RDV" },
    { label: "Scolarité indicative", value: money(cost.tuition) },
    { label: "Preuve de fonds", value: money(cost.proofOfFunds) },
    { label: "Délai permis d’études", value: time.headline },
  ].slice(0, 4);
  const levelKey = cost.programLevel?.toLowerCase().includes("cégep") ? "cegep" : "university";
  const bars = topProvinces(5).map(([code, province]) => {
    const row = cost.grid.find((item) => item.code === code);
    const value = levelKey === "cegep" ? (row?.cegep ?? 0) : (row?.university ?? 0);
    return { label: province.name, value };
  });
  return {
    stats,
    chart: { label: "Frais de scolarité indicatifs (CAD / an)", unit: "CAD", bars },
  };
}

function demandLevel(score: number | undefined) {
  if (score == null) return "À confirmer en RDV";
  if (score >= 75) return "Élevée";
  if (score >= 55) return "Solide";
  if (score >= 40) return "Modérée";
  return "À confirmer en RDV";
}

function employmentPanel(profile: Profile): Pick<OpportunityPanel, "stats" | "chart"> {
  const code = provinceCode(profile.province);
  const demand = householdDemand(profile, { province: code, cityId: ALL_CITIES });
  const first = demand.groups[0];
  const métiers = demand.groups
    .map((group) => group.adult.member.profession)
    .filter(Boolean)
    .join(" · ");
  const stats: OpportunityStat[] = [
    { label: "Métier du foyer", value: métiers || "À préciser en RDV" },
    { label: "Accès", value: "Via IR recrutement / Industrielle RH" },
    {
      label: "Demande métier",
      value: demandLevel(first?.current.score),
    },
    { label: "Lieu", value: demand.placeLabel },
  ].slice(0, 4);
  const bars = demand.groups.map((group) => ({
    label: group.adult.label,
    value: group.current.score,
  }));
  if (bars.length < 2 && first) {
    bars.push(
      { label: "Part intl.", value: Math.round(first.current.intlShare) },
      { label: "Canada", value: Math.round((first.current.score + first.current.intlShare) / 2) },
    );
  }
  return {
    stats,
    chart: { label: "Indice de demande (0–100)", bars: bars.slice(0, 5) },
  };
}

function salaryPanel(profile: Profile): Pick<OpportunityPanel, "stats" | "chart"> {
  const living = householdLiving(profile);
  const salaries = householdSalaries(profile);
  const primary = salaries.groups[0];
  const stats: OpportunityStat[] = [
    { label: "Net mensuel foyer", value: money(living.combinedNetMonthly) },
    { label: "Loyer indicatif", value: money(living.rent) },
    { label: "Reste estimatif", value: money(living.remainder) },
    { label: "Province", value: living.province },
  ].slice(0, 4);
  return {
    stats,
    chart: {
      label: "Budget mensuel indicatif",
      unit: "CAD",
      bars: [
        { label: "Net mensuel", value: living.combinedNetMonthly },
        { label: "Loyer", value: living.rent },
        { label: "Autres", value: living.other },
        ...(primary ? [{ label: primary.heading, value: primary.netMonthly }] : []),
      ].slice(0, 4),
    },
  };
}

function nationalityPanel(profile: Profile): Pick<OpportunityPanel, "stats" | "chart"> {
  const ee = irccTimeFor("ee");
  const stats: OpportunityStat[] = [
    { label: "Traitement RP (indicatif)", value: ee.headline },
    { label: "Présence physique", value: "2 à 3 ans" },
    { label: "Après la RP", value: "Citoyenneté possible sous conditions" },
    { label: "Province actuelle", value: profile.province || "—" },
  ];
  return {
    stats,
    chart: {
      label: "Jalons indicatifs (mois)",
      bars: [
        { label: "RP (après invitation)", value: Math.round(ee.sortDays / 30) || 7 },
        { label: "Présence physique", value: 30 },
        { label: "Citoyenneté (traitement)", value: 12 },
      ],
    },
  };
}

function businessPanel(profile: Profile): Pick<OpportunityPanel, "stats" | "chart"> {
  const province = profile.province?.trim() || "À préciser en RDV";
  const stats: OpportunityStat[] = [
    { label: "Prêts", value: "Sans caution familiale fréquente" },
    { label: "Taux d’intérêt", value: "À partir de 0,5 % selon les cas" },
    { label: "Écosystème", value: "Incubateurs, financement, partenaires" },
    { label: "Province cible", value: province },
  ];
  return {
    stats,
    chart: {
      label: "Atouts pour entreprendre (0–100)",
      bars: [
        { label: "Accès au crédit", value: 84 },
        { label: "Taux favorables", value: 78 },
        { label: "Écosystème", value: 88 },
        { label: "Formalités", value: 74 },
        { label: "Réseau partenaires", value: 90 },
      ],
    },
  };
}

function flexibilityPanel(_profile: Profile): Pick<OpportunityPanel, "stats" | "chart"> {
  const stats: OpportunityStat[] = [
    { label: "Études + travail", value: "Combinables selon le permis" },
    { label: "Conjoint", value: "Permis ouvert selon le volet" },
    { label: "Pivot", value: "Emploi, études ou affaires" },
    { label: "Suite du projet", value: "Se construit en rendez-vous" },
  ];
  return {
    stats,
    chart: {
      label: "Leviers de flexibilité (0–100)",
      bars: [
        { label: "Études + travail", value: 82 },
        { label: "Conjoint", value: 76 },
        { label: "Pivot métier", value: 80 },
        { label: "Entreprendre", value: 74 },
        { label: "Passage RP", value: 70 },
      ],
    },
  };
}

const builders: Record<OpportunityThemeId, (profile: Profile) => Pick<OpportunityPanel, "stats" | "chart">> = {
  study: studyPanel,
  employment: employmentPanel,
  salary: salaryPanel,
  nationality: nationalityPanel,
  business: businessPanel,
  flexibility: flexibilityPanel,
};

export function opportunityPanel(theme: OpportunityThemeId, profile: Profile): OpportunityPanel {
  const built = builders[theme](profile);
  return {
    theme,
    title: opportunityThemeLabel(theme),
    stats: built.stats.slice(0, 4),
    chart: built.chart,
    articles: opportunityPressFor(theme),
    disclaimer: DISCLAIMER,
  };
}
