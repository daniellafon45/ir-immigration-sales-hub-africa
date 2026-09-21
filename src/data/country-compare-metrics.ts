import type { CompareRegionId } from "@/data/country-compare-regions";

/** Indicative origin-side metrics used for Canada vs country contrast. */
export type OriginCompareMetrics = {
  /** Central bank / policy rate % */
  policyRatePct: number;
  /** Typical retail / consumer loan rate % */
  retailLoanRatePct: number;
  /** Typical mortgage / housing loan rate % when available */
  mortgageRatePct: number;
  /** Transparency / CPI-like 0–100 (higher = less corruption) */
  transparencyScore: number;
  /** Rule of law / equality proxy 0–100 */
  ruleOfLawScore: number;
  /** Human Development Index proxy 0–1 */
  hdi: number;
  /** Life expectancy years */
  lifeExpectancy: number;
  /** Safety proxy 0–100 (higher = safer) */
  safetyScore: number;
  /** Minimum wage monthly equivalent in CAD */
  minWageMonthlyCad: number;
  /** Days to start a business (indicative) */
  businessStartDays: number;
  /** Access to finance / credit for SMEs 0–100 */
  financeAccessScore: number;
  /** Education quality proxy (PISA-like) 0–600 */
  educationScore: number;
  /** Henley-like passport rank (1 = best) */
  passportRank: number;
};

export type CanadaCompareBaselines = {
  policyRatePct: number;
  mortgageFixed5yPct: number;
  retailLoanRatePct: number;
  transparencyScore: number;
  ruleOfLawScore: number;
  hdi: number;
  lifeExpectancy: number;
  safetyScore: number;
  /** Québec minimum wage hourly CAD */
  minWageHourlyCad: number;
  /** Approx full-time monthly min wage CAD */
  minWageMonthlyCad: number;
  /** Median hourly wage Québec CAD */
  medianHourlyCad: number;
  businessStartDays: number;
  financeAccessScore: number;
  educationScore: number;
  passportRank: number;
  sourceNote: string;
};

export const CANADA_COMPARE_BASELINES: CanadaCompareBaselines = {
  policyRatePct: 2.25,
  mortgageFixed5yPct: 4.2,
  retailLoanRatePct: 7.5,
  transparencyScore: 76,
  ruleOfLawScore: 82,
  hdi: 0.935,
  lifeExpectancy: 82,
  safetyScore: 78,
  minWageHourlyCad: 16.1,
  minWageMonthlyCad: 2800,
  medianHourlyCad: 33,
  businessStartDays: 5,
  financeAccessScore: 88,
  educationScore: 520,
  passportRank: 7,
  sourceNote: "BdC / StatCan / OCDE / Henley — indicatif 2025",
};

export const REGION_COMPARE_METRICS: Record<CompareRegionId, OriginCompareMetrics> = {
  uemoa: {
    policyRatePct: 3.25,
    retailLoanRatePct: 12,
    mortgageRatePct: 9,
    transparencyScore: 38,
    ruleOfLawScore: 42,
    hdi: 0.52,
    lifeExpectancy: 62,
    safetyScore: 48,
    minWageMonthlyCad: 120,
    businessStartDays: 18,
    financeAccessScore: 42,
    educationScore: 350,
    passportRank: 85,
  },
  cemac: {
    policyRatePct: 5,
    retailLoanRatePct: 14,
    mortgageRatePct: 11,
    transparencyScore: 28,
    ruleOfLawScore: 32,
    hdi: 0.55,
    lifeExpectancy: 60,
    safetyScore: 40,
    minWageMonthlyCad: 140,
    businessStartDays: 25,
    financeAccessScore: 35,
    educationScore: 340,
    passportRank: 90,
  },
  west_africa_other: {
    policyRatePct: 18,
    retailLoanRatePct: 22,
    mortgageRatePct: 18,
    transparencyScore: 32,
    ruleOfLawScore: 38,
    hdi: 0.55,
    lifeExpectancy: 63,
    safetyScore: 42,
    minWageMonthlyCad: 100,
    businessStartDays: 20,
    financeAccessScore: 40,
    educationScore: 355,
    passportRank: 92,
  },
  east_africa: {
    policyRatePct: 10,
    retailLoanRatePct: 16,
    mortgageRatePct: 13,
    transparencyScore: 34,
    ruleOfLawScore: 40,
    hdi: 0.55,
    lifeExpectancy: 65,
    safetyScore: 45,
    minWageMonthlyCad: 90,
    businessStartDays: 22,
    financeAccessScore: 44,
    educationScore: 360,
    passportRank: 88,
  },
  southern_africa: {
    policyRatePct: 8,
    retailLoanRatePct: 14,
    mortgageRatePct: 11.5,
    transparencyScore: 45,
    ruleOfLawScore: 48,
    hdi: 0.7,
    lifeExpectancy: 64,
    safetyScore: 42,
    minWageMonthlyCad: 280,
    businessStartDays: 16,
    financeAccessScore: 55,
    educationScore: 380,
    passportRank: 55,
  },
  maghreb: {
    policyRatePct: 3,
    retailLoanRatePct: 9,
    mortgageRatePct: 6.5,
    transparencyScore: 40,
    ruleOfLawScore: 45,
    hdi: 0.72,
    lifeExpectancy: 75,
    safetyScore: 55,
    minWageMonthlyCad: 320,
    businessStartDays: 12,
    financeAccessScore: 52,
    educationScore: 390,
    passportRank: 70,
  },
  middle_east: {
    policyRatePct: 5.5,
    retailLoanRatePct: 10,
    mortgageRatePct: 7,
    transparencyScore: 42,
    ruleOfLawScore: 48,
    hdi: 0.8,
    lifeExpectancy: 76,
    safetyScore: 58,
    minWageMonthlyCad: 450,
    businessStartDays: 10,
    financeAccessScore: 60,
    educationScore: 420,
    passportRank: 60,
  },
  south_asia: {
    policyRatePct: 6.5,
    retailLoanRatePct: 14,
    mortgageRatePct: 9,
    transparencyScore: 36,
    ruleOfLawScore: 42,
    hdi: 0.63,
    lifeExpectancy: 70,
    safetyScore: 48,
    minWageMonthlyCad: 150,
    businessStartDays: 18,
    financeAccessScore: 50,
    educationScore: 380,
    passportRank: 80,
  },
  east_asia: {
    policyRatePct: 2.5,
    retailLoanRatePct: 6,
    mortgageRatePct: 4,
    transparencyScore: 58,
    ruleOfLawScore: 65,
    hdi: 0.88,
    lifeExpectancy: 80,
    safetyScore: 72,
    minWageMonthlyCad: 900,
    businessStartDays: 8,
    financeAccessScore: 75,
    educationScore: 530,
    passportRank: 20,
  },
  se_asia: {
    policyRatePct: 4,
    retailLoanRatePct: 11,
    mortgageRatePct: 7.5,
    transparencyScore: 40,
    ruleOfLawScore: 48,
    hdi: 0.72,
    lifeExpectancy: 73,
    safetyScore: 55,
    minWageMonthlyCad: 250,
    businessStartDays: 14,
    financeAccessScore: 55,
    educationScore: 400,
    passportRank: 65,
  },
  europe_west: {
    policyRatePct: 2.5,
    retailLoanRatePct: 6.5,
    mortgageRatePct: 3.5,
    transparencyScore: 72,
    ruleOfLawScore: 80,
    hdi: 0.93,
    lifeExpectancy: 82,
    safetyScore: 75,
    minWageMonthlyCad: 2200,
    businessStartDays: 6,
    financeAccessScore: 82,
    educationScore: 500,
    passportRank: 8,
  },
  europe_east: {
    policyRatePct: 5,
    retailLoanRatePct: 10,
    mortgageRatePct: 6,
    transparencyScore: 50,
    ruleOfLawScore: 55,
    hdi: 0.82,
    lifeExpectancy: 76,
    safetyScore: 62,
    minWageMonthlyCad: 700,
    businessStartDays: 12,
    financeAccessScore: 62,
    educationScore: 460,
    passportRank: 30,
  },
  central_asia: {
    policyRatePct: 10,
    retailLoanRatePct: 16,
    mortgageRatePct: 14,
    transparencyScore: 32,
    ruleOfLawScore: 38,
    hdi: 0.72,
    lifeExpectancy: 72,
    safetyScore: 52,
    minWageMonthlyCad: 200,
    businessStartDays: 15,
    financeAccessScore: 45,
    educationScore: 400,
    passportRank: 75,
  },
  latam: {
    policyRatePct: 9,
    retailLoanRatePct: 18,
    mortgageRatePct: 12,
    transparencyScore: 38,
    ruleOfLawScore: 42,
    hdi: 0.76,
    lifeExpectancy: 75,
    safetyScore: 45,
    minWageMonthlyCad: 350,
    businessStartDays: 14,
    financeAccessScore: 50,
    educationScore: 410,
    passportRank: 45,
  },
  caribbean: {
    policyRatePct: 6,
    retailLoanRatePct: 12,
    mortgageRatePct: 8,
    transparencyScore: 42,
    ruleOfLawScore: 48,
    hdi: 0.74,
    lifeExpectancy: 74,
    safetyScore: 50,
    minWageMonthlyCad: 400,
    businessStartDays: 16,
    financeAccessScore: 48,
    educationScore: 390,
    passportRank: 50,
  },
  oceania: {
    policyRatePct: 4.35,
    retailLoanRatePct: 8,
    mortgageRatePct: 5.5,
    transparencyScore: 70,
    ruleOfLawScore: 78,
    hdi: 0.93,
    lifeExpectancy: 83,
    safetyScore: 76,
    minWageMonthlyCad: 2500,
    businessStartDays: 5,
    financeAccessScore: 85,
    educationScore: 510,
    passportRank: 6,
  },
  north_america: {
    policyRatePct: 4.5,
    retailLoanRatePct: 10,
    mortgageRatePct: 6.5,
    transparencyScore: 65,
    ruleOfLawScore: 72,
    hdi: 0.92,
    lifeExpectancy: 78,
    safetyScore: 65,
    minWageMonthlyCad: 1800,
    businessStartDays: 6,
    financeAccessScore: 80,
    educationScore: 490,
    passportRank: 5,
  },
};

/** Country-level overrides on top of regional defaults (partial). */
export const COUNTRY_COMPARE_OVERRIDES: Partial<Record<string, Partial<OriginCompareMetrics>>> = {
  Bénin: {
    policyRatePct: 3.25,
    retailLoanRatePct: 12,
    mortgageRatePct: 9.5,
    minWageMonthlyCad: 120,
    passportRank: 84,
    transparencyScore: 36,
  },
  Sénégal: {
    retailLoanRatePct: 11,
    mortgageRatePct: 8.5,
    minWageMonthlyCad: 140,
    passportRank: 82,
  },
  "Côte d’Ivoire": {
    retailLoanRatePct: 11.5,
    mortgageRatePct: 9,
    minWageMonthlyCad: 160,
    passportRank: 83,
  },
  Nigeria: {
    policyRatePct: 27,
    retailLoanRatePct: 28,
    mortgageRatePct: 22,
    minWageMonthlyCad: 80,
    passportRank: 95,
    transparencyScore: 25,
  },
  Ghana: {
    policyRatePct: 18,
    retailLoanRatePct: 24,
    mortgageRatePct: 20,
    minWageMonthlyCad: 110,
    passportRank: 86,
  },
  Cameroun: {
    retailLoanRatePct: 13,
    minWageMonthlyCad: 130,
    passportRank: 89,
  },
  Maroc: {
    policyRatePct: 2.75,
    retailLoanRatePct: 7.5,
    mortgageRatePct: 5.5,
    minWageMonthlyCad: 380,
    passportRank: 68,
    transparencyScore: 38,
  },
  Algérie: {
    retailLoanRatePct: 8,
    minWageMonthlyCad: 220,
    passportRank: 88,
  },
  Tunisie: {
    retailLoanRatePct: 10,
    minWageMonthlyCad: 280,
    passportRank: 72,
  },
  France: {
    policyRatePct: 2.5,
    retailLoanRatePct: 5.5,
    mortgageRatePct: 3.4,
    minWageMonthlyCad: 2100,
    passportRank: 4,
    transparencyScore: 71,
    ruleOfLawScore: 78,
    educationScore: 495,
  },
  "Royaume-Uni": {
    policyRatePct: 4.5,
    retailLoanRatePct: 8,
    mortgageRatePct: 4.5,
    minWageMonthlyCad: 2400,
    passportRank: 5,
  },
  Allemagne: {
    policyRatePct: 2.5,
    retailLoanRatePct: 6,
    mortgageRatePct: 3.5,
    minWageMonthlyCad: 2300,
    passportRank: 3,
  },
  "États-Unis": {
    policyRatePct: 4.5,
    retailLoanRatePct: 11,
    mortgageRatePct: 6.8,
    minWageMonthlyCad: 1600,
    passportRank: 6,
  },
  Inde: {
    policyRatePct: 6.5,
    retailLoanRatePct: 12,
    mortgageRatePct: 8.5,
    minWageMonthlyCad: 140,
    passportRank: 82,
  },
  Chine: {
    policyRatePct: 3.1,
    retailLoanRatePct: 5.5,
    mortgageRatePct: 3.5,
    minWageMonthlyCad: 550,
    passportRank: 60,
  },
  Brésil: {
    policyRatePct: 13.25,
    retailLoanRatePct: 25,
    mortgageRatePct: 11,
    minWageMonthlyCad: 320,
    passportRank: 18,
  },
  "Afrique du Sud": {
    policyRatePct: 7.5,
    retailLoanRatePct: 13,
    mortgageRatePct: 11,
    minWageMonthlyCad: 350,
    passportRank: 52,
  },
  Haïti: {
    retailLoanRatePct: 18,
    minWageMonthlyCad: 80,
    passportRank: 94,
    safetyScore: 28,
    transparencyScore: 17,
  },
  "République démocratique du Congo": {
    retailLoanRatePct: 20,
    minWageMonthlyCad: 70,
    passportRank: 96,
    safetyScore: 25,
  },
  Canada: {
    policyRatePct: 2.25,
    retailLoanRatePct: 7.5,
    mortgageRatePct: 4.2,
    minWageMonthlyCad: 2800,
    passportRank: 7,
    transparencyScore: 76,
    ruleOfLawScore: 82,
    educationScore: 520,
    financeAccessScore: 88,
    safetyScore: 78,
    hdi: 0.935,
    lifeExpectancy: 82,
    businessStartDays: 5,
  },
};

export function originMetricsFor(country: string, region: CompareRegionId): OriginCompareMetrics {
  const base = REGION_COMPARE_METRICS[region];
  const override = COUNTRY_COMPARE_OVERRIDES[country.trim()] ?? {};
  return { ...base, ...override };
}
