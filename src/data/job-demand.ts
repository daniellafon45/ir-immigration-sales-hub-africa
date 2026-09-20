import { livingCities, type LivingCity } from "@/data/cost-of-living";
import { provinceData } from "@/data/provinces";

export const ALL_PROVINCES = "all";
export const ALL_CITIES = "all";

export type DemandLevel = "Très élevée" | "Élevée" | "Modérée" | "Faible";

export type DemandPoint = {
  id: string;
  name: string;
  score: number;
  label: DemandLevel;
  openings: number;
  applicantsPerOpening: number;
  intlShare: number;
};

type ProfessionDemand = {
  tightness: number;
  openings: number;
  intl: number;
};

const PROFESSION_DEMAND: Record<string, ProfessionDemand> = {
  Comptable: { tightness: 68, openings: 3100, intl: 38 },
  "Analyste financier": { tightness: 62, openings: 1800, intl: 32 },
  "Infirmier(ère)": { tightness: 91, openings: 8400, intl: 62 },
  "Aide-soignant(e)": { tightness: 89, openings: 9200, intl: 55 },
  "Développeur logiciel": { tightness: 74, openings: 6100, intl: 50 },
  "Analyste en TI": { tightness: 71, openings: 2800, intl: 42 },
  Électromécanicien: { tightness: 84, openings: 2800, intl: 45 },
  Électricien: { tightness: 86, openings: 4100, intl: 48 },
  Ingénieur: { tightness: 76, openings: 3200, intl: 44 },
  "Enseignant(e)": { tightness: 70, openings: 2600, intl: 35 },
  "Cuisinier(ère)": { tightness: 81, openings: 5600, intl: 58 },
  Chauffeur: { tightness: 80, openings: 4700, intl: 52 },
  "Représentant(e) commercial": { tightness: 58, openings: 2200, intl: 28 },
  "Technicien en maintenance": { tightness: 78, openings: 2400, intl: 40 },
  Autre: { tightness: 55, openings: 1500, intl: 30 },
};

const FEATURED_CITY_IDS: Record<string, string[]> = {
  QC: ["montreal", "quebec", "laval", "longueuil", "gatineau", "sherbrooke", "trois-rivieres", "saguenay"],
  ON: ["toronto", "ottawa", "mississauga", "hamilton", "kitchener", "london", "windsor", "brampton"],
  AB: ["calgary", "edmonton", "red-deer", "lethbridge", "grande-prairie"],
  MB: ["winnipeg", "brandon", "steinbach"],
  NB: ["moncton", "fredericton", "saint-john", "dieppe"],
  BC: ["vancouver", "surrey", "victoria", "kelowna", "burnaby"],
  SK: ["saskatoon", "regina", "prince-albert"],
  NS: ["halifax", "cape-breton", "truro"],
  PE: ["charlottetown", "summerside"],
  NL: ["st-johns", "corner-brook"],
  YT: ["whitehorse"],
  NT: ["yellowknife"],
  NU: ["iqaluit"],
};

const TOTAL_VACANCIES = Object.values(provinceData).reduce((sum, province) => sum + province.vacancies, 0);

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function hash(value: string) {
  let total = 0;
  for (let index = 0; index < value.length; index += 1) {
    total = (total * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(total);
}

function professionBase(profession: string) {
  return PROFESSION_DEMAND[profession] ?? PROFESSION_DEMAND.Autre;
}

function cityById(id: string) {
  return livingCities.find((city) => city.id === id);
}

function provinceShift(code: string) {
  const unemployment = provinceData[code]?.unemployment ?? 6.5;
  return Math.round((6.5 - unemployment) * 2.2);
}

function cityShift(city: LivingCity | undefined, profession: string) {
  if (!city) return 0;
  let shift = 0;
  if (city.housing2 >= 2500) shift -= 3;
  else if (city.housing2 >= 1900) shift -= 1;
  else if (city.housing2 <= 1300) shift += 6;
  else shift += 2;

  if (profession === "Infirmier(ère)" || profession === "Aide-soignant(e)") shift += 4;

  const trades =
    profession === "Électricien" ||
    profession === "Électromécanicien" ||
    profession === "Technicien en maintenance";
  if (trades && (city.province === "AB" || city.housing2 <= 1400)) shift += 5;

  if (profession === "Enseignant(e)" && city.province !== "QC") shift += 8;

  const tech = profession === "Développeur logiciel" || profession === "Analyste en TI";
  if (tech && ["montreal", "toronto", "vancouver", "ottawa", "calgary"].includes(city.id)) shift += 3;
  if (tech && city.housing2 <= 1400) shift -= 4;

  shift += (hash(`${city.id}:${profession}`) % 7) - 3;
  return shift;
}

function openingsFor(base: number, province: string, city?: LivingCity) {
  if (province === ALL_PROVINCES) return base;
  const vacancies = provinceData[province]?.vacancies ?? 0;
  const provinceOpenings = base * (vacancies / TOTAL_VACANCIES) * 4.2;
  if (!city) return Math.max(40, Math.round(provinceOpenings));
  const peers = livingCities.filter((item) => item.province === province);
  const weight = peers.reduce((sum, item) => sum + item.housing2, 0) || 1;
  return Math.max(12, Math.round(provinceOpenings * (city.housing2 / weight) * peers.length * 0.35));
}

function intlShareFor(base: number, province: string, city?: LivingCity) {
  let share = base;
  if (province !== ALL_PROVINCES) share += provinceShift(province) * 0.8;
  if (city && city.housing2 <= 1300) share += 8;
  if (city && ["montreal", "toronto", "vancouver"].includes(city.id)) share += 4;
  return clamp(share);
}

function applicantsPerOpening(score: number) {
  return Math.round((15 - score * 0.12) * 10) / 10;
}

export function demandLabel(score: number): DemandLevel {
  if (score >= 80) return "Très élevée";
  if (score >= 65) return "Élevée";
  if (score >= 50) return "Modérée";
  return "Faible";
}

function point(id: string, name: string, profession: string, province: string, city?: LivingCity): DemandPoint {
  const base = professionBase(profession);
  const score = clamp(base.tightness + (province === ALL_PROVINCES ? 0 : provinceShift(province)) + cityShift(city, profession));
  return {
    id,
    name,
    score,
    label: demandLabel(score),
    openings: openingsFor(base.openings, province, city),
    applicantsPerOpening: applicantsPerOpening(score),
    intlShare: intlShareFor(base.intl, province, city),
  };
}

export function featuredCitiesFor(province: string) {
  const ids = FEATURED_CITY_IDS[province] ?? [];
  return ids
    .map((id) => cityById(id))
    .filter((city): city is LivingCity => Boolean(city));
}

export function demandFor(
  profession: string,
  options?: { province?: string; cityId?: string },
): DemandPoint {
  const province = options?.province ?? ALL_PROVINCES;
  const cityId = options?.cityId ?? ALL_CITIES;
  if (cityId !== ALL_CITIES) {
    const city = cityById(cityId);
    if (city) return point(city.id, city.name, profession, city.province, city);
  }
  if (province !== ALL_PROVINCES) {
    const name = provinceData[province]?.name ?? province;
    return point(province, name, profession, province);
  }
  return point("CA", "Canada", profession, ALL_PROVINCES);
}

export function demandSeries(
  profession: string,
  options?: { province?: string; cityId?: string },
): DemandPoint[] {
  const cityId = options?.cityId ?? ALL_CITIES;
  let province = options?.province ?? ALL_PROVINCES;
  if (province === ALL_PROVINCES && cityId !== ALL_CITIES) {
    province = cityById(cityId)?.province ?? ALL_PROVINCES;
  }
  if (province === ALL_PROVINCES) {
    return Object.keys(provinceData)
      .map((code) => demandFor(profession, { province: code, cityId: ALL_CITIES }))
      .sort((left, right) => right.score - left.score);
  }
  return livingCities
    .filter((city) => city.province === province)
    .map((city) => demandFor(profession, { province: city.province, cityId: city.id }))
    .sort((left, right) => right.score - left.score);
}
