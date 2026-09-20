export type VisitPurposeId = "family" | "tourism" | "business";

export type VisitPurpose = {
  id: VisitPurposeId;
  name: string;
  ties: string[];
  hostUseful: boolean;
};

export const visitPurposes: VisitPurpose[] = [
  {
    id: "family",
    name: "Visite familiale",
    ties: ["famille au pays", "emploi au pays", "biens", "billet retour"],
    hostUseful: true,
  },
  {
    id: "tourism",
    name: "Tourisme",
    ties: ["emploi au pays", "revenus stables", "biens", "billet retour"],
    hostUseful: false,
  },
  {
    id: "business",
    name: "Voyage d’affaires",
    ties: ["entreprise au pays", "mission courte", "contrats en cours", "billet retour"],
    hostUseful: false,
  },
];

export function visitPurposeById(id: string) {
  return visitPurposes.find((purpose) => purpose.id === id);
}
