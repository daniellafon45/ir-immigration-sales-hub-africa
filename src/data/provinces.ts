export type Province = {
  name: string;
  unemployment: number;
  avgSalary: number;
  vacancies: number;
  rent: number;
  french: string;
  score: number;
};

export const provinceData: Record<string, Province> = {
  QC: {
    name: "Québec",
    unemployment: 5.6,
    avgSalary: 1292,
    vacancies: 104000,
    rent: 1710,
    french: "Très forte",
    score: 83,
  },
  ON: {
    name: "Ontario",
    unemployment: 6.9,
    avgSalary: 1384,
    vacancies: 172000,
    rent: 2350,
    french: "Variable",
    score: 78,
  },
  AB: {
    name: "Alberta",
    unemployment: 6.8,
    avgSalary: 1387,
    vacancies: 78000,
    rent: 1810,
    french: "Minoritaire",
    score: 86,
  },
  MB: {
    name: "Manitoba",
    unemployment: 5.0,
    avgSalary: 1258,
    vacancies: 28000,
    rent: 1480,
    french: "Présente",
    score: 81,
  },
  NB: {
    name: "Nouveau-Brunswick",
    unemployment: 7.1,
    avgSalary: 1246,
    vacancies: 18000,
    rent: 1390,
    french: "Forte",
    score: 84,
  },
  BC: {
    name: "Colombie-Britannique",
    unemployment: 5.8,
    avgSalary: 1350,
    vacancies: 95000,
    rent: 2400,
    french: "Minoritaire",
    score: 80,
  },
  SK: {
    name: "Saskatchewan",
    unemployment: 5.4,
    avgSalary: 1280,
    vacancies: 22000,
    rent: 1350,
    french: "Minoritaire",
    score: 79,
  },
  NS: {
    name: "Nouvelle-Écosse",
    unemployment: 6.4,
    avgSalary: 1180,
    vacancies: 20000,
    rent: 1650,
    french: "Présente",
    score: 77,
  },
  PE: {
    name: "Île-du-Prince-Édouard",
    unemployment: 7.0,
    avgSalary: 1120,
    vacancies: 4000,
    rent: 1400,
    french: "Présente",
    score: 74,
  },
  NL: {
    name: "Terre-Neuve-et-Labrador",
    unemployment: 9.8,
    avgSalary: 1250,
    vacancies: 8000,
    rent: 1300,
    french: "Minoritaire",
    score: 70,
  },
  YT: {
    name: "Yukon",
    unemployment: 3.5,
    avgSalary: 1450,
    vacancies: 2000,
    rent: 1600,
    french: "Minoritaire",
    score: 72,
  },
  NT: {
    name: "Territoires du Nord-Ouest",
    unemployment: 5.5,
    avgSalary: 1550,
    vacancies: 1500,
    rent: 1850,
    french: "Présente",
    score: 71,
  },
  NU: {
    name: "Nunavut",
    unemployment: 12.0,
    avgSalary: 1400,
    vacancies: 800,
    rent: 2500,
    french: "Présente",
    score: 65,
  },
};

const NAME_TO_CODE: Record<string, string> = {
  Québec: "QC",
  Ontario: "ON",
  Alberta: "AB",
  Manitoba: "MB",
  "Nouveau-Brunswick": "NB",
  "Colombie-Britannique": "BC",
  Saskatchewan: "SK",
  "Nouvelle-Écosse": "NS",
  "Île-du-Prince-Édouard": "PE",
  "Terre-Neuve-et-Labrador": "NL",
  Yukon: "YT",
  "Territoires du Nord-Ouest": "NT",
  Nunavut: "NU",
};

export const ALL_CANADA = "Tout le Canada";

export function isAllCanada(name: string) {
  return name === ALL_CANADA;
}

export function provinceCode(name: string) {
  return NAME_TO_CODE[name] ?? "QC";
}
