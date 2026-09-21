import {
  CANADA_COMPARE_BASELINES,
  originMetricsFor,
  type CanadaCompareBaselines,
  type OriginCompareMetrics,
} from "@/data/country-compare-metrics";
import { compareRegionFor } from "@/data/country-compare-regions";
import type { CountryCompareAxisId } from "@/data/country-compare-proof";

export type CompareAxisCopy = {
  id: CountryCompareAxisId;
  label: string;
  canada: string;
  origin: string;
};

export type CompareFactStat = {
  label: string;
  value: string;
};

export type CompareFactChart = {
  label: string;
  unit?: string;
  bars: { label: string; value: number }[];
};

export type CompareAxisFacts = {
  copy: CompareAxisCopy;
  stats: CompareFactStat[];
  chart: CompareFactChart;
};

export type CountryCompareFacts = {
  country: string;
  region: ReturnType<typeof compareRegionFor>;
  canada: CanadaCompareBaselines;
  origin: OriginCompareMetrics;
  sourceNote: string;
  axes: Record<CountryCompareAxisId, CompareAxisFacts>;
};

const AXIS_LABELS: Record<CountryCompareAxisId, string> = {
  credit: "Accès au crédit",
  equality: "Égalité des chances",
  quality: "Qualité de vie",
  salary: "Niveau de salaire",
  entrepreneurship: "Écosystème entrepreneurial",
  education: "Qualité de l’éducation",
  nationality: "Chemin vers la nationalité",
};

function pct(n: number, digits = 1) {
  return `${n.toFixed(digits).replace(/\.0$/, "")} %`;
}

function cad(n: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

function originName(country: string) {
  return country.trim() || "Pays d’origine";
}

function creditFacts(country: string, ca: CanadaCompareBaselines, o: OriginCompareMetrics): CompareAxisFacts {
  const name = originName(country);
  return {
    copy: {
      id: "credit",
      label: AXIS_LABELS.credit,
      canada: `Taux directeur ~${pct(ca.policyRatePct)} ; hypothèque fixe 5 ans ~${pct(ca.mortgageFixed5yPct)} ; prêts sans caution familiale typique.`,
      origin: `Taux directeur ~${pct(o.policyRatePct)} ; crédit conso ~${pct(o.retailLoanRatePct)} ; hypothèque ~${pct(o.mortgageRatePct)} — caution familiale fréquente.`,
    },
    stats: [
      {
        label: "Taux directeur",
        value: `Canada ${pct(ca.policyRatePct)} · ${name} ${pct(o.policyRatePct)}`,
      },
      {
        label: "Hypothèque / habitat",
        value: `Canada ~${pct(ca.mortgageFixed5yPct)} · ${name} ~${pct(o.mortgageRatePct)}`,
      },
      {
        label: "Crédit conso",
        value: `Canada ~${pct(ca.retailLoanRatePct)} · ${name} ~${pct(o.retailLoanRatePct)}`,
      },
      {
        label: "Caution familiale",
        value: "Canada : rare · Origine : souvent exigée",
      },
    ],
    chart: {
      label: `Taux indicatifs (%) — Canada vs ${name}`,
      unit: "%",
      bars: [
        { label: "Canada hyp.", value: ca.mortgageFixed5yPct },
        { label: `${name} hyp.`, value: o.mortgageRatePct },
        { label: "Canada conso", value: ca.retailLoanRatePct },
        { label: `${name} conso`, value: o.retailLoanRatePct },
      ],
    },
  };
}

function equalityFacts(country: string, ca: CanadaCompareBaselines, o: OriginCompareMetrics): CompareAxisFacts {
  const name = originName(country);
  return {
    copy: {
      id: "equality",
      label: AXIS_LABELS.equality,
      canada: `État de droit ~${ca.ruleOfLawScore}/100 ; transparence ~${ca.transparencyScore}/100 — cadre anti-discrimination opposable.`,
      origin: `État de droit ~${o.ruleOfLawScore}/100 ; transparence ~${o.transparencyScore}/100 — réseaux et relations pèsent souvent plus.`,
    },
    stats: [
      {
        label: "État de droit",
        value: `Canada ${ca.ruleOfLawScore} · ${name} ${o.ruleOfLawScore}`,
      },
      {
        label: "Transparence",
        value: `Canada ${ca.transparencyScore} · ${name} ${o.transparencyScore}`,
      },
      {
        label: "Écart",
        value: `+${ca.ruleOfLawScore - o.ruleOfLawScore} pts pour le Canada`,
      },
      {
        label: "Recours",
        value: "Canada : commissions / tribunaux écrits",
      },
    ],
    chart: {
      label: `Scores (0–100) — Canada vs ${name}`,
      bars: [
        { label: "Canada droit", value: ca.ruleOfLawScore },
        { label: `${name} droit`, value: o.ruleOfLawScore },
        { label: "Canada transp.", value: ca.transparencyScore },
        { label: `${name} transp.`, value: o.transparencyScore },
      ],
    },
  };
}

function qualityFacts(country: string, ca: CanadaCompareBaselines, o: OriginCompareMetrics): CompareAxisFacts {
  const name = originName(country);
  return {
    copy: {
      id: "quality",
      label: AXIS_LABELS.quality,
      canada: `Espérance de vie ~${ca.lifeExpectancy} ans ; IDH ~${ca.hdi.toFixed(2)} ; sécurité ~${ca.safetyScore}/100.`,
      origin: `Espérance de vie ~${o.lifeExpectancy} ans ; IDH ~${o.hdi.toFixed(2)} ; sécurité ~${o.safetyScore}/100.`,
    },
    stats: [
      {
        label: "Espérance de vie",
        value: `Canada ${ca.lifeExpectancy} ans · ${name} ${o.lifeExpectancy} ans`,
      },
      {
        label: "IDH",
        value: `Canada ${ca.hdi.toFixed(2)} · ${name} ${o.hdi.toFixed(2)}`,
      },
      {
        label: "Sécurité",
        value: `Canada ${ca.safetyScore}/100 · ${name} ${o.safetyScore}/100`,
      },
      {
        label: "Services",
        value: "Canada : santé / école publiques structurées",
      },
    ],
    chart: {
      label: `Indicateurs — Canada vs ${name}`,
      bars: [
        { label: "Canada vie", value: ca.lifeExpectancy },
        { label: `${name} vie`, value: o.lifeExpectancy },
        { label: "Canada séc.", value: ca.safetyScore },
        { label: `${name} séc.`, value: o.safetyScore },
      ],
    },
  };
}

function salaryFacts(country: string, ca: CanadaCompareBaselines, o: OriginCompareMetrics): CompareAxisFacts {
  const name = originName(country);
  const ratio = o.minWageMonthlyCad > 0 ? Math.round(ca.minWageMonthlyCad / o.minWageMonthlyCad) : 0;
  return {
    copy: {
      id: "salary",
      label: AXIS_LABELS.salary,
      canada: `Salaire min. QC ~${ca.minWageHourlyCad.toFixed(2)} $/h (~${cad(ca.minWageMonthlyCad)}/mois) ; médiane ~${ca.medianHourlyCad} $/h.`,
      origin: `Salaire min. indicatif ~${cad(o.minWageMonthlyCad)}/mois — souvent ${ratio}× plus bas qu’au Canada.`,
    },
    stats: [
      {
        label: "Salaire min. mensuel",
        value: `Canada ~${cad(ca.minWageMonthlyCad)} · ${name} ~${cad(o.minWageMonthlyCad)}`,
      },
      {
        label: "Médiane horaire QC",
        value: `~${ca.medianHourlyCad} $ CAD/h`,
      },
      {
        label: "Écart min.",
        value: ratio > 1 ? `Canada ~${ratio}× plus élevé` : "Écart faible",
      },
      {
        label: "Protections",
        value: "Canada : cotisations, normes du travail",
      },
    ],
    chart: {
      label: `Salaire min. mensuel (CAD) — Canada vs ${name}`,
      unit: "CAD",
      bars: [
        { label: "Canada", value: ca.minWageMonthlyCad },
        { label: name, value: o.minWageMonthlyCad },
      ],
    },
  };
}

function entrepreneurshipFacts(
  country: string,
  ca: CanadaCompareBaselines,
  o: OriginCompareMetrics,
): CompareAxisFacts {
  const name = originName(country);
  return {
    copy: {
      id: "entrepreneurship",
      label: AXIS_LABELS.entrepreneurship,
      canada: `Création ~${ca.businessStartDays} jours ; accès financement ~${ca.financeAccessScore}/100 ; incubateurs et prêts structurés.`,
      origin: `Création ~${o.businessStartDays} jours ; accès financement ~${o.financeAccessScore}/100 — capital souvent familial.`,
    },
    stats: [
      {
        label: "Délai création",
        value: `Canada ~${ca.businessStartDays} j · ${name} ~${o.businessStartDays} j`,
      },
      {
        label: "Accès financement",
        value: `Canada ${ca.financeAccessScore} · ${name} ${o.financeAccessScore}`,
      },
      {
        label: "Crédit PME",
        value: `Canada ~${pct(ca.retailLoanRatePct)} · ${name} ~${pct(o.retailLoanRatePct)}`,
      },
      {
        label: "Cadre",
        value: "Canada : formalités claires, partenaires",
      },
    ],
    chart: {
      label: `Accès financement PME (0–100) — Canada vs ${name}`,
      bars: [
        { label: "Canada", value: ca.financeAccessScore },
        { label: name, value: o.financeAccessScore },
      ],
    },
  };
}

function educationFacts(country: string, ca: CanadaCompareBaselines, o: OriginCompareMetrics): CompareAxisFacts {
  const name = originName(country);
  return {
    copy: {
      id: "education",
      label: AXIS_LABELS.education,
      canada: `Score éducation ~${ca.educationScore} ; diplômes reconnus internationalement ; passerelles emploi / PTPD.`,
      origin: `Score éducation ~${o.educationScore} ; bonnes formations locales, reconnaissance internationale plus limitée.`,
    },
    stats: [
      {
        label: "Score qualité",
        value: `Canada ${ca.educationScore} · ${name} ${o.educationScore}`,
      },
      {
        label: "Écart",
        value: `+${ca.educationScore - o.educationScore} pts Canada`,
      },
      {
        label: "Reconnaissance",
        value: "Canada : diplômes à portée mondiale",
      },
      {
        label: "École publique",
        value: "Canada : parcours structurés pour enfants",
      },
    ],
    chart: {
      label: `Score éducation — Canada vs ${name}`,
      bars: [
        { label: "Canada", value: ca.educationScore },
        { label: name, value: o.educationScore },
      ],
    },
  };
}

function nationalityFacts(country: string, ca: CanadaCompareBaselines, o: OriginCompareMetrics): CompareAxisFacts {
  const name = originName(country);
  return {
    copy: {
      id: "nationality",
      label: AXIS_LABELS.nationality,
      canada: `Passeport rang ~#${ca.passportRank} ; après RP : 1 095 jours / 5 ans puis citoyenneté possible.`,
      origin: `Passeport rang ~#${o.passportRank} ; rester citoyen de ${name} — le projet Canada ouvre une 2ᵉ option.`,
    },
    stats: [
      {
        label: "Rang passeport",
        value: `Canada #${ca.passportRank} · ${name} #${o.passportRank}`,
      },
      {
        label: "Présence physique",
        value: "1 095 jours / 5 ans après RP",
      },
      {
        label: "Après RP",
        value: "Citoyenneté possible sous conditions",
      },
      {
        label: "Mobilité",
        value: `Écart de rang : ${o.passportRank - ca.passportRank} places`,
      },
    ],
    chart: {
      label: `Rang passeport (plus bas = mieux) — Canada vs ${name}`,
      bars: [
        { label: "Canada", value: ca.passportRank },
        { label: name, value: o.passportRank },
      ],
    },
  };
}

export function compareFactsFor(country: string): CountryCompareFacts {
  const name = originName(country);
  const region = compareRegionFor(name);
  const canada = CANADA_COMPARE_BASELINES;
  const origin = originMetricsFor(name, region);
  const sourceNote = `${canada.sourceNote} ; métriques origine régionales / indicatives.`;

  return {
    country: name,
    region,
    canada,
    origin,
    sourceNote,
    axes: {
      credit: creditFacts(name, canada, origin),
      equality: equalityFacts(name, canada, origin),
      quality: qualityFacts(name, canada, origin),
      salary: salaryFacts(name, canada, origin),
      entrepreneurship: entrepreneurshipFacts(name, canada, origin),
      education: educationFacts(name, canada, origin),
      nationality: nationalityFacts(name, canada, origin),
    },
  };
}

export function countryCompareAxesFor(country: string): CompareAxisCopy[] {
  const facts = compareFactsFor(country);
  return Object.values(facts.axes).map((a) => a.copy);
}
