export type OfficialSource = {
  label: string;
  url: string;
  verifiedOn: string;
  updatedLabel: string;
};

/** Registre partagé des sources officielles utilisées par le Navigator. */
export const navigatorSources = {
  ripr179: {
    label: "RIPR — article 179 (visa de résident temporaire)",
    url: "https://laws-lois.justice.gc.ca/fra/reglements/DORS-2002-227/section-179.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  dualIntent: {
    label: "LIPR — double intention (art. 22)",
    url: "https://laws-lois.justice.gc.ca/fra/lois/i-2.5/section-22.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  misrepresentation: {
    label: "LIPR — fausse déclaration (art. 40)",
    url: "https://laws-lois.justice.gc.ca/fra/lois/i-2.5/section-40.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  visit: {
    label: "IRCC — Visiter le Canada",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/visiter-canada.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  study: {
    label: "IRCC — Étudier au Canada",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  studyFunds: {
    label: "IRCC — Preuve de soutien financier (études)",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/obtenir-documents.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  work: {
    label: "IRCC — Travailler au Canada",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  ee: {
    label: "IRCC — Entrée express",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  crs: {
    label: "IRCC — Grille des critères de sélection (Entrée express / CRS)",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/admissibilite/criteres-systeme-classement-global/grille.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  eeEligibility: {
    label: "IRCC — Qui peut présenter une demande (Entrée express)",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/qui-presenter-demande.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  settlementFunds: {
    label: "IRCC — Preuve de fonds (Entrée express)",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/documents/preuve-fonds-suffisants.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  pnp: {
    label: "IRCC — Programmes des candidats des provinces",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/candidats-provinces.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  quebec: {
    label: "Québec — Immigrer au Québec",
    url: "https://www.quebec.ca/immigration",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  ontario: {
    label: "Ontario — Immigrer en Ontario (OINP)",
    url: "https://www.ontario.ca/fr/page/immigrer-en-ontario",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  alberta: {
    label: "Alberta — Alberta Advantage Immigration Program",
    url: "https://www.alberta.ca/alberta-advantage-immigration-program",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  manitoba: {
    label: "Manitoba — Provincial Nominee Program",
    url: "https://www.immigratemanitoba.com/",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  atlantic: {
    label: "IRCC — Programme d’immigration au Canada atlantique",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/programme-immigration-atlantique.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  family: {
    label: "IRCC — Parrainage de membres de la famille",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/parrainer-membre-famille.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  business: {
    label: "IRCC — Mesures d’immigration pour les entrepreneurs",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/avis/mesure-immigration-entrepreneurs.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
  processingTimes: {
    label: "IRCC — Vérifier les délais de traitement",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/demande/verifier-delais-traitement.html",
    verifiedOn: "2026-10-07",
    updatedLabel: "octobre 2026",
  },
} as const satisfies Record<string, OfficialSource>;

export type NavigatorSourceId = keyof typeof navigatorSources;

export function sourceList(...ids: NavigatorSourceId[]): OfficialSource[] {
  return ids.map((id) => navigatorSources[id]);
}

export function rulesFreshnessLabel(sources: OfficialSource[]): string {
  if (sources.length === 0) return "non vérifié";
  const labels = [...new Set(sources.map((s) => s.updatedLabel))];
  return labels.join(" · ");
}
