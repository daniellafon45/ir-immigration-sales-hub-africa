export type BusinessPathId = "visitor" | "c11" | "ict" | "pnp-entrepreneur";

export type BusinessPath = {
  id: BusinessPathId;
  name: string;
  needsInvestment: boolean;
  spouseOpenEligible: boolean;
  workAllowed: boolean;
  caution: string;
};

export const businessPaths: BusinessPath[] = [
  {
    id: "visitor",
    name: "Visiteur d’affaires",
    needsInvestment: false,
    spouseOpenEligible: false,
    workAllowed: false,
    caution: "visiteur d’affaires, pas d’exploitation quotidienne",
  },
  {
    id: "c11",
    name: "C11",
    needsInvestment: true,
    spouseOpenEligible: true,
    workAllowed: true,
    caution: "avantage notable à démontrer",
  },
  {
    id: "ict",
    name: "ICT",
    needsInvestment: false,
    spouseOpenEligible: true,
    workAllowed: true,
    caution: "mutation, pas un seuil d’investissement",
  },
  {
    id: "pnp-entrepreneur",
    name: "Entrepreneur provincial",
    needsInvestment: true,
    spouseOpenEligible: true,
    workAllowed: true,
    caution: "volets provinciaux variables",
  },
];

export const startupVisaPaused = true;
export const startupVisaRetrievedAt = "2026-09-19";
export const startupVisaNote =
  "Le visa pour démarrage d’entreprise n’accepte plus de nouvelles demandes.";

export function businessPathById(id: string) {
  return businessPaths.find((path) => path.id === id);
}
