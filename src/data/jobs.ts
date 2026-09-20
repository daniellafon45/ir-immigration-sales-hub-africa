export type Job = {
  title: string;
  company: string;
  city: string;
  salary: string;
  intl: boolean;
  profession: string;
};

export const jobs: Job[] = [
  {
    title: "Comptable",
    company: "Groupe Services Nord",
    city: "Montréal, QC",
    salary: "70 000 $ à 86 000 $",
    intl: true,
    profession: "Comptable",
  },
  {
    title: "Technicien comptable",
    company: "Finances Horizon",
    city: "Laval, QC",
    salary: "28 $ à 34 $ / h",
    intl: false,
    profession: "Comptable",
  },
  {
    title: "Analyste financier",
    company: "Prairies Énergie",
    city: "Calgary, AB",
    salary: "82 000 $ à 103 000 $",
    intl: true,
    profession: "Comptable",
  },
  {
    title: "Commis comptable",
    company: "Atlantique Distribution",
    city: "Moncton, NB",
    salary: "25 $ à 30 $ / h",
    intl: true,
    profession: "Comptable",
  },
  {
    title: "Contrôleur adjoint",
    company: "Ontario Manufacturing",
    city: "Ottawa, ON",
    salary: "88 000 $ à 110 000 $",
    intl: false,
    profession: "Comptable",
  },
  {
    title: "Développeur logiciel",
    company: "Nexora Labs",
    city: "Montréal, QC",
    salary: "85 000 $ à 110 000 $",
    intl: true,
    profession: "Développeur logiciel",
  },
  {
    title: "Développeur full-stack",
    company: "Horizon Numérique",
    city: "Toronto, ON",
    salary: "92 000 $ à 125 000 $",
    intl: true,
    profession: "Développeur logiciel",
  },
  {
    title: "Intégrateur web",
    company: "Atelier Local",
    city: "Québec, QC",
    salary: "32 $ à 42 $ / h",
    intl: false,
    profession: "Développeur logiciel",
  },
  {
    title: "Infirmier(ère) clinicien",
    company: "Réseau Santé Québec",
    city: "Montréal, QC",
    salary: "76 000 $ à 94 000 $",
    intl: true,
    profession: "Infirmier(ère)",
  },
  {
    title: "Infirmier(ère) en CHSLD",
    company: "Maison des Pins",
    city: "Laval, QC",
    salary: "38 $ à 46 $ / h",
    intl: false,
    profession: "Infirmier(ère)",
  },
];
