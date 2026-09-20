export const financialCapacities = ["Faible", "Moyenne", "Bonne", "Très bonne"] as const;
export type FinancialCapacity = (typeof financialCapacities)[number];

export const financialCapacityCad: Record<FinancialCapacity, number> = {
  Faible: 18000,
  Moyenne: 28000,
  Bonne: 48000,
  "Très bonne": 85000,
};

export const sexes = ["Femme", "Homme"] as const;
export type Sex = (typeof sexes)[number];

export const appearances = ["Noir", "Blanc", "Maghrébin", "Asiatique", "Latino"] as const;
export type Appearance = (typeof appearances)[number];

export type AdultMember = {
  firstName: string;
  sex: Sex;
  look: Appearance;
  age: number;
  jobTitle: string;
  profession: string;
  sector: string;
  salary: FinancialCapacity;
  experience: number;
  education: string;
  french: string;
  english: string;
};

export type ChildMember = {
  id: string;
  firstName: string;
  age: number;
};

export type ExtraSpouse = AdultMember & { id: string };

export type PrincipalMode = "auto" | "applicant" | "spouse" | `extra:${string}`;

export type Profile = {
  country: string;
  family: string;
  objective: string;
  budget: number;
  province: string;
  start: string;
  principalMode: PrincipalMode;
  studyLevel: string;
  studyProgramId: string;
  workNocCode: string;
  workPermitKind: string;
  workHasOffer: boolean;
  visitPurpose: string;
  visitDuration: string;
  businessPath: string;
  familyLink: string;
  sponsorStatus: string;
  applicant: AdultMember;
  spouse: AdultMember;
  extraSpouses: ExtraSpouse[];
  children: ChildMember[];
};

export const emptyAdult: AdultMember = {
  firstName: "",
  sex: "Homme",
  look: "Noir",
  age: 30,
  jobTitle: "",
  profession: "Autre",
  sector: "Autre",
  salary: "Faible",
  experience: 0,
  education: "Baccalauréat / Licence",
  french: "Intermédiaire",
  english: "Intermédiaire",
};

export const defaultApplicant: AdultMember = {
  firstName: "Aminata",
  sex: "Femme",
  look: "Noir",
  age: 32,
  jobTitle: "Comptable",
  profession: "Comptable",
  sector: "Finance et comptabilité",
  salary: "Moyenne",
  experience: 5,
  education: "Baccalauréat / Licence",
  french: "Avancé",
  english: "Intermédiaire",
};

export const defaultSpouse: AdultMember = {
  firstName: "Mamadou",
  sex: "Homme",
  look: "Noir",
  age: 36,
  jobTitle: "Développeur full-stack",
  profession: "Développeur logiciel",
  sector: "Technologies de l’information",
  salary: "Bonne",
  experience: 8,
  education: "Baccalauréat / Licence",
  french: "Intermédiaire",
  english: "Avancé",
};

export const defaultProfile: Profile = {
  country: "Bénin",
  family: "Couple",
  objective: "Résidence permanente",
  budget: 10000,
  province: "Québec",
  start: "3 à 6 mois",
  principalMode: "auto",
  studyLevel: "",
  studyProgramId: "",
  workNocCode: "",
  workPermitKind: "",
  workHasOffer: false,
  visitPurpose: "",
  visitDuration: "",
  businessPath: "",
  familyLink: "",
  sponsorStatus: "",
  applicant: defaultApplicant,
  spouse: defaultSpouse,
  extraSpouses: [],
  children: [],
};

export const professions = [
  "Comptable",
  "Analyste financier",
  "Infirmier(ère)",
  "Aide-soignant(e)",
  "Développeur logiciel",
  "Analyste en TI",
  "Électromécanicien",
  "Électricien",
  "Ingénieur",
  "Enseignant(e)",
  "Cuisinier(ère)",
  "Chauffeur",
  "Représentant(e) commercial",
  "Technicien en maintenance",
  "Autre",
] as const;

export const professionSector: Record<string, string> = {
  Comptable: "Finance et comptabilité",
  "Analyste financier": "Finance et comptabilité",
  "Infirmier(ère)": "Santé",
  "Aide-soignant(e)": "Santé",
  "Développeur logiciel": "Technologies de l’information",
  "Analyste en TI": "Technologies de l’information",
  Électromécanicien: "Construction et métiers",
  Électricien: "Construction et métiers",
  Ingénieur: "Ingénierie",
  "Enseignant(e)": "Éducation",
  "Cuisinier(ère)": "Restauration et hôtellerie",
  Chauffeur: "Transport et logistique",
  "Représentant(e) commercial": "Commerce et vente",
  "Technicien en maintenance": "Construction et métiers",
  Autre: "Autre",
};

export const sectors = [
  "Finance et comptabilité",
  "Santé",
  "Technologies de l’information",
  "Ingénierie",
  "Construction et métiers",
  "Éducation",
  "Restauration et hôtellerie",
  "Commerce et vente",
  "Transport et logistique",
  "Administration",
  "Agriculture",
  "Autre",
] as const;

export const educationLevels = [
  "Secondaire",
  "Formation professionnelle",
  "DEC / Collège",
  "Baccalauréat / Licence",
  "Maîtrise / Master",
  "Doctorat",
] as const;

export const languageLevels = ["Débutant", "Intermédiaire", "Avancé", "Bilingue"] as const;

export const familyOptions = [
  "Seul(e)",
  "Couple",
  "Couple + enfant(s)",
  "Parent seul + enfant(s)",
  "Polygame",
] as const;

export const objectives = [
  "Résidence permanente",
  "Études",
  "Travail",
  "Visite",
  "Affaires",
  "Regroupement familial",
] as const;

export const featuredProvinces = [
  "Québec",
  "Ontario",
  "Alberta",
  "Manitoba",
  "Nouveau-Brunswick",
] as const;

export const otherProvinces = [
  "Colombie-Britannique",
  "Saskatchewan",
  "Nouvelle-Écosse",
  "Île-du-Prince-Édouard",
  "Terre-Neuve-et-Labrador",
  "Yukon",
  "Territoires du Nord-Ouest",
  "Nunavut",
] as const;

export const provinces = [...featuredProvinces, ...otherProvinces] as const;

export const startOptions = [
  "Maintenant",
  "1 à 3 mois",
  "3 à 6 mois",
  "6 à 12 mois",
  "Plus tard",
] as const;

export function familyIsPolygamous(family: string) {
  return family === "Polygame";
}

export function familyHasSpouse(family: string) {
  return (
    family === "Couple" ||
    family === "Couple + enfant(s)" ||
    family === "Famille" ||
    familyIsPolygamous(family)
  );
}

export function familyHasChildren(family: string) {
  return (
    family === "Couple + enfant(s)" ||
    family === "Famille" ||
    family === "Parent seul + enfant(s)" ||
    familyIsPolygamous(family)
  );
}

export function extraPrincipalMode(id: string): `extra:${string}` {
  return `extra:${id}`;
}

export function extraSpouseId(mode: string) {
  return mode.startsWith("extra:") ? mode.slice("extra:".length) : null;
}

export function isFinancialCapacity(value: unknown): value is FinancialCapacity {
  return typeof value === "string" && (financialCapacities as readonly string[]).includes(value);
}

export function normalizeFinancialCapacity(value: unknown): FinancialCapacity {
  if (isFinancialCapacity(value)) return value;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Faible";
  if (amount >= 80000) return "Très bonne";
  if (amount >= 40000) return "Bonne";
  if (amount >= 20000) return "Moyenne";
  return "Faible";
}

export function financialCapacityAmount(level: string): number {
  return isFinancialCapacity(level) ? financialCapacityCad[level] : 0;
}

function createId(prefix: string) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${prefix}-${Date.now()}`;
  return id;
}

export function createChild(): ChildMember {
  return { id: createId("child"), firstName: "", age: 6 };
}

export function createExtraSpouse(): ExtraSpouse {
  return { id: createId("spouse"), ...emptyAdult, sex: "Femme" };
}

export function isSex(value: unknown): value is Sex {
  return value === "Femme" || value === "Homme";
}

export function isAppearance(value: unknown): value is Appearance {
  return appearances.includes(value as Appearance);
}

const maghrebinCountries = new Set([
  "Afghanistan",
  "Algérie",
  "Arabie saoudite",
  "Bahreïn",
  "Égypte",
  "Émirats arabes unis",
  "Irak",
  "Iran",
  "Jordanie",
  "Koweït",
  "Liban",
  "Libye",
  "Maroc",
  "Mauritanie",
  "Oman",
  "Palestine",
  "Qatar",
  "Soudan",
  "Syrie",
  "Tunisie",
  "Turquie",
  "Yémen",
]);

const blackCountries = new Set([
  "Afrique du Sud",
  "Angola",
  "Antigua-et-Barbuda",
  "Bahamas",
  "Barbade",
  "Bénin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cameroun",
  "Cap-Vert",
  "Comores",
  "Congo",
  "Côte d’Ivoire",
  "Djibouti",
  "Dominique",
  "Érythrée",
  "Eswatini",
  "Éthiopie",
  "Gabon",
  "Gambie",
  "Ghana",
  "Grenade",
  "Guinée",
  "Guinée-Bissau",
  "Guinée équatoriale",
  "Guyana",
  "Haïti",
  "Jamaïque",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Madagascar",
  "Malawi",
  "Mali",
  "Maurice",
  "Mozambique",
  "Namibie",
  "Niger",
  "Nigeria",
  "Ouganda",
  "République centrafricaine",
  "République démocratique du Congo",
  "Rwanda",
  "Saint-Kitts-et-Nevis",
  "Saint-Vincent-et-les-Grenadines",
  "Sainte-Lucie",
  "Sao Tomé-et-Principe",
  "Sénégal",
  "Seychelles",
  "Sierra Leone",
  "Somalie",
  "Soudan du Sud",
  "Suriname",
  "Tanzanie",
  "Tchad",
  "Togo",
  "Trinité-et-Tobago",
  "Zambie",
  "Zimbabwe",
]);

const asianCountries = new Set([
  "Bangladesh",
  "Bhoutan",
  "Birmanie",
  "Brunei",
  "Cambodge",
  "Chine",
  "Corée du Nord",
  "Corée du Sud",
  "Hong Kong",
  "Inde",
  "Indonésie",
  "Japon",
  "Laos",
  "Malaisie",
  "Maldives",
  "Mongolie",
  "Népal",
  "Pakistan",
  "Philippines",
  "Singapour",
  "Sri Lanka",
  "Taïwan",
  "Thaïlande",
  "Timor oriental",
  "Viêt Nam",
]);

const latinoCountries = new Set([
  "Argentine",
  "Belize",
  "Bolivie",
  "Brésil",
  "Chili",
  "Colombie",
  "Costa Rica",
  "Cuba",
  "Équateur",
  "Guatemala",
  "Honduras",
  "Mexique",
  "Nicaragua",
  "Panama",
  "Paraguay",
  "Pérou",
  "République dominicaine",
  "Salvador",
  "Uruguay",
  "Venezuela",
]);

export function appearanceFromCountry(country: string): Appearance {
  if (maghrebinCountries.has(country)) return "Maghrébin";
  if (blackCountries.has(country)) return "Noir";
  if (asianCountries.has(country)) return "Asiatique";
  if (latinoCountries.has(country)) return "Latino";
  return "Blanc";
}
