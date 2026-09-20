import { salaryData, type SalaryBand } from "@/data/salaries";
import { provinceCode } from "@/data/provinces";

export const INTERNSHIP_SALARY_FACTOR = 0.48;

const NET_RATES: Record<string, number> = {
  QC: 0.7,
  ON: 0.73,
  AB: 0.75,
  MB: 0.72,
  NB: 0.71,
};

const OPPORTUNITY_BASE: Record<string, number> = {
  Comptable: 428,
  "Infirmier(ère)": 1120,
  "Développeur logiciel": 864,
  Électromécanicien: 612,
};

export function scaleSalaryBand([low, mid, high]: SalaryBand, factor: number): SalaryBand {
  const round = (value: number) => Math.round((value * factor) / 1000) * 1000;
  return [round(low), round(mid), round(high)];
}

export function salaryBandsFor(profession: string) {
  return salaryData[profession] ?? salaryData.Comptable;
}

export function internshipBandsFor(profession: string): Record<string, SalaryBand> {
  return Object.fromEntries(
    Object.entries(salaryBandsFor(profession)).map(([code, band]) => [
      code,
      scaleSalaryBand(band, INTERNSHIP_SALARY_FACTOR),
    ]),
  );
}

export function salaryForProfession(profession: string, province: string) {
  const data = salaryBandsFor(profession);
  return data[provinceCode(province)] ?? data.QC;
}

export function internshipSalaryForProfession(profession: string, province: string) {
  const data = internshipBandsFor(profession);
  return data[provinceCode(province)] ?? data.QC;
}

export function netEstimate(gross: number, province = "QC") {
  const rate = NET_RATES[province] ?? 0.72;
  return Math.round(gross * rate);
}

export function opportunityCount(profession: string) {
  return OPPORTUNITY_BASE[profession] ?? 520;
}

export function workingInvestment(budget: number) {
  return Math.min(Math.max(budget * 0.5, 5000), 12000);
}

export function installmentSplit(total: number) {
  const a = Math.round(total * 0.2);
  const b = Math.round(total * 0.2);
  const c = Math.round(total * 0.3);
  const d = total - a - b - c;
  return [
    { label: "Aujourd’hui", amount: a },
    { label: "Étape 2", amount: b },
    { label: "Étape 3", amount: c },
    { label: "Étape 4", amount: d },
  ];
}
