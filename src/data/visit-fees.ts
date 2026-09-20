export const visitorVisa = 100;
export const eta = 7;
export const biometricsSolo = 85;
export const biometricsFamilyCap = 170;
export const sourceUrl =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/visiter-canada/frais.html";
export const etaLikelyCountries = ["France", "Allemagne", "Japon"] as const;

export type VisitDocumentType = "visa" | "eta";

export type VisitFees = {
  documentType: VisitDocumentType;
  documentPerPerson: number;
  documentTotal: number;
  biometricsTotal: number;
  people: number;
  total: number;
};

function normalizedPeople(people: number) {
  return Math.max(1, Math.floor(people));
}

function usesEta(country: string) {
  return etaLikelyCountries.includes(country.trim() as (typeof etaLikelyCountries)[number]);
}

export function visitFeesFor(country: string, people: number): VisitFees {
  const travelers = normalizedPeople(people);
  const documentType: VisitDocumentType = usesEta(country) ? "eta" : "visa";
  const documentPerPerson = documentType === "eta" ? eta : visitorVisa;
  const documentTotal = documentPerPerson * travelers;
  const biometricsTotal = Math.min(travelers * biometricsSolo, biometricsFamilyCap);

  return {
    documentType,
    documentPerPerson,
    documentTotal,
    biometricsTotal,
    people: travelers,
    total: documentTotal + biometricsTotal,
  };
}
