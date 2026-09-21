import {
  countryCompareAxisLabel,
  countryComparePressFor,
  type CountryCompareAxisId,
  type CountryComparePressArticle,
} from "@/data/country-compare-proof";
import { irccTimeFor } from "@/data/ircc-times";
import type { Profile } from "@/data/profile";
import { compareFactsFor } from "@/lib/country-compare-facts";
import { money } from "@/lib/format";
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

/** Shared shape for proof aside (comparaison pays). */
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

function salaryPanelOverride(
  profile: Profile,
  originMinCad: number,
  originLabel: string,
  contrastStat: CountryCompareStat,
): { stats: CountryCompareStat[]; chart: CountryCompareChart } {
  const living = householdLiving(profile);
  const salaries = householdSalaries(profile);
  const primary = salaries.groups[0];

  const stats: CountryCompareStat[] = [
    { label: "Net mensuel foyer CA", value: money(living.combinedNetMonthly) },
    { label: "Loyer indicatif CA", value: money(living.rent) },
    contrastStat,
    { label: "Reste estimatif CA", value: money(living.remainder) },
  ].slice(0, 4);

  const bars = [
    { label: "Net foyer CA", value: living.combinedNetMonthly },
    { label: "Loyer CA", value: living.rent },
    { label: `Min. ${originLabel}`, value: originMinCad },
    ...(primary ? [{ label: primary.heading, value: primary.netMonthly }] : []),
  ].slice(0, 4);

  return {
    stats,
    chart: {
      label: `Budget CA vs min. ${originLabel} (CAD)`,
      unit: "CAD",
      bars,
    },
  };
}

function nationalityPanelMerge(
  base: { stats: CountryCompareStat[]; chart: CountryCompareChart },
): { stats: CountryCompareStat[]; chart: CountryCompareChart } {
  const ee = irccTimeFor("ee");
  const stats: CountryCompareStat[] = [
    base.stats[0]!,
    { label: "Traitement RP (indicatif)", value: ee.headline },
    base.stats[1] ?? { label: "Présence physique", value: "1 095 jours / 5 ans" },
    base.stats[2] ?? { label: "Après la RP", value: "Citoyenneté possible sous conditions" },
  ].slice(0, 4);

  return {
    stats,
    chart: base.chart,
  };
}

export function countryComparePanel(
  axisId: CountryCompareAxisId,
  profile: Profile,
): CountryComparePanel {
  const facts = compareFactsFor(profile.country);
  const axis = facts.axes[axisId];
  let built = { stats: axis.stats, chart: axis.chart };

  if (axisId === "salary") {
    built = salaryPanelOverride(profile, facts.origin.minWageMonthlyCad, facts.country, axis.stats[0]!);
  } else if (axisId === "nationality") {
    built = nationalityPanelMerge(built);
  }

  return {
    theme: axisId,
    title: countryCompareAxisLabel(axisId),
    stats: built.stats.slice(0, 4),
    chart: built.chart,
    articles: countryComparePressFor(axisId),
    disclaimer: `Sources publiques. ${facts.sourceNote} Aperçu de démonstration, pas un diagnostic.`,
  };
}
