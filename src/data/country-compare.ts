export type CountryCompareAxis = {
  id: string;
  label: string;
  canada: string;
  origin: string;
};

export const countryCompareAxes: CountryCompareAxis[] = [
  {
    id: "credit",
    label: "Accès au crédit",
    canada: "Historique de crédit, prêts hypothécaires et outils bancaires accessibles avec un statut stable.",
    origin: "Souvent plus restrictif, taux élevés, garanties familiales fréquentes.",
  },
  {
    id: "equality",
    label: "Égalité des chances",
    canada: "Cadre légal fort contre la discrimination ; règles transparentes sur le marché du travail.",
    origin: "Réseaux et relations pèsent parfois plus que les compétences.",
  },
  {
    id: "quality",
    label: "Qualité de vie",
    canada: "Services publics, sécurité, espaces verts, équilibre travail-vie selon la province.",
    origin: "Variable selon la ville ; stress lié aux infrastructures et à l’incertitude.",
  },
  {
    id: "salary",
    label: "Niveau de salaire",
    canada: "Salaires médians plus élevés dans beaucoup de métiers, avec cotisations et protections.",
    origin: "Pouvoir d’achat souvent limité malgré un coût de vie local plus bas.",
  },
  {
    id: "entrepreneurship",
    label: "Écosystème entrepreneurial",
    canada: "Incubateurs, financement, partenaires et cadre clair pour créer.",
    origin: "Opportunités réelles, mais accès au capital et formalités plus fragiles.",
  },
  {
    id: "education",
    label: "Qualité de l’éducation",
    canada: "Écoles publiques solides, cégeps/universités reconnus, passerelles vers l’emploi.",
    origin: "Bonnes formations locales, reconnaissance internationale parfois limitée.",
  },
  {
    id: "nationality",
    label: "Chemin vers la nationalité",
    canada: "Résidence permanente puis citoyenneté possible après les délais légaux.",
    origin: "Rester citoyen du pays d’origine ; le projet Canada ouvre une seconde option.",
  },
];

export function countryCompareTitle(country: string) {
  const name = country.trim() || "votre pays";
  return `Canada vs ${name}`;
}

export function countryCompareLead(country: string) {
  const name = country.trim() || "votre pays d’origine";
  return `Ce n’est pas « mieux partout ». C’est un projet de vie à comparer honnêtement avec ${name}.`;
}
