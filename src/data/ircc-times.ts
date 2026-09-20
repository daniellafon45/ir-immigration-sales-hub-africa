export type IrccTrack = {
  label: string;
  value: string;
};

export type IrccTime = {
  routeId: string;
  headline: string;
  scope: string;
  note: string;
  sortDays: number;
  comparable: boolean;
  tracks?: IrccTrack[];
};

export const irccTimesMeta = {
  updatedLabel: "septembre 2026",
  sourceLabel: "IRCC",
  sourceUrl:
    "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/demande/verifier-delais-traitement.html",
};

const fallbackTime: IrccTime = {
  routeId: "unknown",
  headline: "Variable",
  scope: "Selon le volet et le pays",
  note: "Vérifiez le délai officiel IRCC avant de promettre une date.",
  sortDays: 9999,
  comparable: false,
};

export const irccTimes: Record<string, IrccTime> = {
  ee: {
    routeId: "ee",
    headline: "6-7 mois",
    scope: "Traitement IRCC après invitation",
    note: "Le temps en bassin n’est pas inclus. Environ 78 % des dossiers FEP et CEC reçoivent une décision en 6 mois ou moins.",
    sortDays: 195,
    comparable: true,
    tracks: [
      { label: "Expérience canadienne", value: "5-7 mois" },
      { label: "Travailleurs qualifiés", value: "6-7 mois" },
    ],
  },
  study: {
    routeId: "study",
    headline: "4-16 semaines",
    scope: "Nouvelle demande, selon le pays",
    note: "En février 2026, 80 % des nouvelles demandes étaient traitées en 28 jours ou moins. Le bureau des visas change le délai.",
    sortDays: 56,
    comparable: true,
    tracks: [
      { label: "Souvent observé", value: "environ 4 sem." },
      { label: "Fourchette pays", value: "4-16 semaines" },
    ],
  },
  pnp: {
    routeId: "pnp",
    headline: "7-16 mois",
    scope: "Étape fédérale après nomination",
    note: "La nomination provinciale s’ajoute. Via Entrée express: environ 7 mois. Hors Entrée express: environ 16 mois.",
    sortDays: 330,
    comparable: true,
    tracks: [
      { label: "Via Entrée express", value: "environ 7 mois" },
      { label: "Hors Entrée express", value: "environ 16 mois" },
    ],
  },
  work: {
    routeId: "work",
    headline: "1-6 mois",
    scope: "Selon le pays et le type de permis",
    note: "Les délais hors Canada varient selon le bureau. Prolongation au Canada: environ 15 semaines.",
    sortDays: 90,
    comparable: true,
    tracks: [
      { label: "Hors Canada", value: "1-6 mois" },
      { label: "Prolongation au Canada", value: "environ 15 sem." },
    ],
  },
  family: {
    routeId: "family",
    headline: "14-20 mois",
    scope: "Époux, conjoint ou enfant, hors Québec",
    note: "Environ 15 mois hors Québec (août 2025 à juillet 2026). Au Québec, compter plutôt autour de 36 mois.",
    sortDays: 480,
    comparable: true,
    tracks: [
      { label: "Hors Québec", value: "14-20 mois" },
      { label: "Québec", value: "environ 36 mois" },
    ],
  },
  business: {
    routeId: "business",
    headline: "Selon le volet",
    scope: "Visa démarrage en pause",
    note: "Le visa pour démarrage d’entreprise n’accepte plus de nouvelles demandes. Les autres volets affaires ont des délais propres.",
    sortDays: 400,
    comparable: false,
    tracks: [
      { label: "Visiteur d’affaires", value: "souvent des semaines" },
      { label: "Entrepreneur", value: "selon le programme" },
    ],
  },
  visit: {
    routeId: "visit",
    headline: "2-22 semaines",
    scope: "Selon le pays de demande",
    note: "IRCC publie un délai par pays, de quelques jours à plusieurs mois. Depuis le Canada: environ 11 jours.",
    sortDays: 70,
    comparable: true,
    tracks: [
      { label: "Hors Canada", value: "9-157 jours" },
      { label: "Depuis le Canada", value: "environ 11 jours" },
    ],
  },
  asylum: {
    routeId: "asylum",
    headline: "Souvent 2 ans et +",
    scope: "Audience et décision, selon le volume",
    note: "L’asile protège. Ce n’est pas une voie économique, ni un plan B de visa.",
    sortDays: 730,
    comparable: false,
    tracks: [
      { label: "Admissibilité", value: "souvent des semaines" },
      { label: "Audience CISR", value: "souvent 2 ans et +" },
    ],
  },
};

export function irccTimeFor(routeId: string) {
  return irccTimes[routeId] ?? { ...fallbackTime, routeId };
}

export function fastestRouteId(ids: string[]) {
  const ranked = ids
    .map(irccTimeFor)
    .filter((time) => time.comparable)
    .sort((a, b) => a.sortDays - b.sortDays);
  if (ranked.length < 2) return undefined;
  return ranked[0]?.routeId;
}
