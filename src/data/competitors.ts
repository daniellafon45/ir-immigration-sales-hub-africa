export type CompetitorArchetypeId = "ir" | "local" | "freelance" | "diy";

export type CompetitorScore = boolean | "partial";

export type CompetitorArchetype = {
  id: CompetitorArchetypeId;
  label: string;
  short: string;
  blurb: string;
};

export type CompetitorCriterion = {
  id: string;
  label: string;
  scores: Record<CompetitorArchetypeId, CompetitorScore>;
  note: string;
};

export const competitorArchetypes: CompetitorArchetype[] = [
  { id: "ir", label: "IR Immigration", short: "IR", blurb: "Carrière, visa et installation" },
  { id: "local", label: "Cabinet local", short: "Cabinet local", blurb: "Conseil chez vous, sans réseau Canada" },
  { id: "freelance", label: "Freelance non autorisé", short: "Non agréé", blurb: "Conseiller hors cadre réglementé" },
  { id: "diy", label: "Faire seul", short: "Faire seul", blurb: "Aucun professionnel : vous déposez tout vous-même" },
];

export const competitorCriteria: CompetitorCriterion[] = [
  {
    id: "strategy",
    label: "Stratégie de projet de vie",
    scores: { ir: true, local: "partial", freelance: false, diy: "partial" },
    note: "Un papier ne remplace pas un plan carrière + installation.",
  },
  {
    id: "employment",
    label: "Emploi & positionnement métier",
    scores: { ir: true, local: "partial", freelance: false, diy: false },
    note: "Via Industrielle RH / IR recrutement.",
  },
  {
    id: "settlement",
    label: "Installation & conciergerie",
    scores: { ir: true, local: false, freelance: false, diy: "partial" },
    note: "Logement, accueil, démarches dès l’arrivée.",
  },
  {
    id: "compliance",
    label: "Conformité & professionnels autorisés",
    scores: { ir: true, local: "partial", freelance: false, diy: "partial" },
    note: "Mobilisés lorsque requis. Décisions aux autorités.",
  },
  {
    id: "transparency",
    label: "Transparence délais & non-promesses",
    scores: { ir: true, local: "partial", freelance: false, diy: "partial" },
    note: "Pas d’approbation, d’emploi ou de RP garantis.",
  },
  {
    id: "ecosystem",
    label: "Écosystème partenaires (études, billet, RP…)",
    scores: { ir: true, local: "partial", freelance: false, diy: false },
    note: "Un réseau pour les démarches, pas un interlocuteur isolé.",
  },
];

export function scoreLabel(value: CompetitorScore): "Inclus" | "Limité" | "Hors offre" {
  if (value === true) return "Inclus";
  if (value === "partial") return "Limité";
  return "Hors offre";
}

export const competitorPitch =
  "Immigrer pour réussir une vie au Canada, pas uniquement pour déposer un dossier.";
