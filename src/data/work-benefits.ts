export type WorkBenefitId =
  | "sante"
  | "complements"
  | "conges"
  | "parental"
  | "retraite"
  | "emploi"
  | "famille";

export type WorkBenefit = {
  id: WorkBenefitId;
  title: string;
  body: string;
};

function isQuebec(province: string) {
  return province.trim().toLowerCase().startsWith("québec") || province.trim().toLowerCase().startsWith("quebec");
}

export function workBenefitsFor(province: string, hasChildren: boolean): WorkBenefit[] {
  const quebec = isQuebec(province);
  const benefits: WorkBenefit[] = [
    {
      id: "sante",
      title: "Assurance maladie",
      body: quebec
        ? "RAMQ : médecin, hôpital et soins essentiels, sans facture au patient."
        : "Carte santé provinciale : médecin et hôpital couverts.",
    },
    {
      id: "complements",
      title: "Médicaments et dentaire",
      body: quebec
        ? "Régime public d’assurance médicaments, souvent complété par l’employeur (dentaire, vision)."
        : "La plupart des employeurs ajoutent médicaments, dentaire et vision.",
    },
    {
      id: "conges",
      title: "Congés payés",
      body: "Vacances légales, jours fériés et congés maladie. Beaucoup d’employeurs vont plus loin.",
    },
    {
      id: "parental",
      title: "Congé parental",
      body: quebec
        ? "RQAP : prestations parentales jusqu’à 18 mois, parmi les plus généreuses au pays."
        : "Prestations parentales via l’assurance-emploi, jusqu’à 18 mois.",
    },
    {
      id: "retraite",
      title: "Retraite",
      body: quebec
        ? "RRQ, plus souvent un régime d’employeur en plus."
        : "RPC, plus souvent un régime d’employeur en plus.",
    },
    {
      id: "emploi",
      title: "Assurance-emploi",
      body: "Filet si le contrat s’arrête : chômage, maladie, compassion.",
    },
  ];

  if (hasChildren) {
    benefits.push({
      id: "famille",
      title: "Prestations familiales",
      body: "Allocation canadienne pour enfants, versée chaque mois selon le revenu du foyer.",
    });
  }

  return benefits;
}
