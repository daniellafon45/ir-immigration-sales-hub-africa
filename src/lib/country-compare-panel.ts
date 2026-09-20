import {
  countryCompareAxisLabel,
  countryComparePressFor,
  type CountryCompareAxisId,
  type CountryComparePressArticle,
} from "@/data/country-compare-proof";
import { irccTimeFor } from "@/data/ircc-times";
import type { Profile } from "@/data/profile";
import { money, moneyPair } from "@/lib/format";
import { householdLiving } from "@/lib/household-living";
import { householdSalaries } from "@/lib/household-salaries";

export type CountryCompareStat = {
  label: string;
  value: string;
};

export type CountryCompareChartBar = {
  label: string;
  value: number;
};

export type CountryCompareChart = {
  label: string;
  unit?: string;
  bars: CountryCompareChartBar[];
};

export type CountryComparePanel = {
  theme: CountryCompareAxisId;
  title: string;
  stats: CountryCompareStat[];
  chart: CountryCompareChart;
  articles: CountryComparePressArticle[];
  disclaimer: string;
};

/** Shared shape for ProofDrawer (opportunités + comparaison pays). */
export type ProofPanel = {
  title: string;
  stats: { label: string; value: string }[];
  chart: { label: string; unit?: string; bars: { label: string; value: number }[] };
  articles: {
    source: string;
    date: string;
    title: string;
    excerpt: string;
    url: string;
    image: string;
  }[];
  disclaimer: string;
};

const DISCLAIMER = "Sources publiques. Aperçu de démonstration, pas un diagnostic.";

function creditPanel(_profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  return {
    stats: [
      { label: "Prêts", value: "Sans caution familiale fréquente" },
      { label: "Taux d’intérêt", value: "Souvent plus bas qu’en Afrique" },
      { label: "Historique de crédit", value: "Se construit avec un statut stable" },
      { label: "Hypothèque", value: "Accessible après ancrage bancaire" },
    ],
    chart: {
      label: "Atouts crédit au Canada (0–100)",
      bars: [
        { label: "Prêts sans caution", value: 86 },
        { label: "Taux favorables", value: 80 },
        { label: "Outils bancaires", value: 88 },
        { label: "Hypothèque", value: 74 },
        { label: "Protection consommateur", value: 82 },
      ],
    },
  };
}

function equalityPanel(_profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  return {
    stats: [
      { label: "Cadre légal", value: "Droits opposables, pas le réseau" },
      { label: "Marché du travail", value: "Règles écrites et transparentes" },
      { label: "Recours", value: "Commissions et tribunaux" },
      { label: "Mérite", value: "Compétences > relations" },
    ],
    chart: {
      label: "Atouts égalité des chances (0–100)",
      bars: [
        { label: "Cadre légal", value: 84 },
        { label: "Recours", value: 78 },
        { label: "Transparence", value: 80 },
        { label: "Anti-discrimination", value: 76 },
      ],
    },
  };
}

function qualityPanel(profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  const province = profile.province?.trim() || "Selon la province";
  return {
    stats: [
      { label: "Santé", value: "Couverture publique selon province" },
      { label: "Sécurité", value: "Cadre urbain stable" },
      { label: "École des enfants", value: "Publique et structurée" },
      { label: "Province", value: province },
    ],
    chart: {
      label: "Atouts qualité de vie (0–100)",
      bars: [
        { label: "Santé", value: 82 },
        { label: "Sécurité", value: 80 },
        { label: "École", value: 84 },
        { label: "Équilibre", value: 76 },
        { label: "Espaces verts", value: 78 },
      ],
    },
  };
}

function salaryPanel(profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  const living = householdLiving(profile);
  const salaries = householdSalaries(profile);
  const primary = salaries.groups[0];
  const netPair = moneyPair(living.combinedNetMonthly, profile.country);
  const stats: CountryCompareStat[] = [
    { label: "Net mensuel foyer", value: money(living.combinedNetMonthly) },
    { label: "Loyer indicatif", value: money(living.rent) },
    { label: "Reste estimatif", value: money(living.remainder) },
    {
      label: "Équiv. devise locale",
      value: netPair.local ?? "Selon le pays du profil",
    },
  ].slice(0, 4);
  return {
    stats,
    chart: {
      label: "Budget mensuel indicatif (CAD)",
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

function entrepreneurshipPanel(_profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  return {
    stats: [
      { label: "Prêts", value: "Sans garantie familiale fréquente" },
      { label: "Taux d’intérêt", value: "À partir de 0,5 % selon les cas" },
      { label: "Écosystème", value: "Incubateurs, financement, partenaires" },
      { label: "Formalités", value: "Cadre clair pour créer" },
    ],
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

function educationPanel(_profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  return {
    stats: [
      { label: "Écoles publiques", value: "Parcours structurés pour les enfants" },
      { label: "Diplômes", value: "Reconnaissance internationale" },
      { label: "Passerelles", value: "Vers l’emploi et le PTPD" },
      { label: "Coût relatif", value: "Investissement, pas un frein absolu" },
    ],
    chart: {
      label: "Atouts éducation (0–100)",
      bars: [
        { label: "École publique", value: 86 },
        { label: "Reconnaissance", value: 88 },
        { label: "Passerelles emploi", value: 80 },
        { label: "Campus / réseau", value: 78 },
      ],
    },
  };
}

function nationalityPanel(_profile: Profile): Pick<CountryComparePanel, "stats" | "chart"> {
  const ee = irccTimeFor("ee");
  return {
    stats: [
      { label: "Traitement RP (indicatif)", value: ee.headline },
      { label: "Présence physique", value: "1 095 jours / 5 ans" },
      { label: "Après la RP", value: "Citoyenneté possible sous conditions" },
      { label: "Passeport", value: "Mobilité internationale renforcée" },
    ],
    chart: {
      label: "Jalons indicatifs (mois)",
      bars: [
        { label: "RP (après invitation)", value: Math.round(ee.sortDays / 30) || 7 },
        { label: "Présence physique", value: 36 },
        { label: "Citoyenneté (traitement)", value: 12 },
      ],
    },
  };
}

const builders: Record<
  CountryCompareAxisId,
  (profile: Profile) => Pick<CountryComparePanel, "stats" | "chart">
> = {
  credit: creditPanel,
  equality: equalityPanel,
  quality: qualityPanel,
  salary: salaryPanel,
  entrepreneurship: entrepreneurshipPanel,
  education: educationPanel,
  nationality: nationalityPanel,
};

export function countryComparePanel(
  axisId: CountryCompareAxisId,
  profile: Profile,
): CountryComparePanel {
  const built = builders[axisId](profile);
  return {
    theme: axisId,
    title: countryCompareAxisLabel(axisId),
    stats: built.stats.slice(0, 4),
    chart: built.chart,
    articles: countryComparePressFor(axisId),
    disclaimer: DISCLAIMER,
  };
}
