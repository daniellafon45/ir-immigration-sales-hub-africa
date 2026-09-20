export type CompetitorArchetypeId = "ir" | "visa-only" | "local" | "freelance" | "diy";

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
  { id: "ir", label: "IR Immigration", short: "IR", blurb: "Projet de vie complet" },
  { id: "visa-only", label: "Agence « visa only »", short: "Visa", blurb: "Dossier administratif seul" },
  { id: "local", label: "Cabinet local", short: "Local", blurb: "Conseil près de chez vous" },
  { id: "freelance", label: "Freelance non autorisé", short: "Freelance", blurb: "Sans cadre réglementé" },
  { id: "diy", label: "Faire seul", short: "DIY", blurb: "Sans accompagnement" },
];

export const competitorCriteria: CompetitorCriterion[] = [
  {
    id: "strategy",
    label: "Stratégie de projet de vie",
    scores: { ir: true, "visa-only": "partial", local: "partial", freelance: false, diy: "partial" },
    note: "Un papier ne remplace pas un plan carrière + installation.",
  },
  {
    id: "employment",
    label: "Emploi & positionnement métier",
    scores: { ir: true, "visa-only": false, local: "partial", freelance: false, diy: false },
    note: "Via Industrielle RH / IR recrutement.",
  },
  {
    id: "settlement",
    label: "Installation & conciergerie",
    scores: { ir: true, "visa-only": false, local: false, freelance: false, diy: "partial" },
    note: "Logement, accueil, démarches dès l’arrivée.",
  },
  {
    id: "compliance",
    label: "Conformité & professionnels autorisés",
    scores: { ir: true, "visa-only": "partial", local: "partial", freelance: false, diy: "partial" },
    note: "Mobilisés lorsque requis. Décisions aux autorités.",
  },
  {
    id: "transparency",
    label: "Transparence délais & non-promesses",
    scores: { ir: true, "visa-only": "partial", local: "partial", freelance: false, diy: "partial" },
    note: "Pas d’approbation, d’emploi ou de RP garantis.",
  },
  {
    id: "ecosystem",
    label: "Écosystème partenaires (études, billet, RP…)",
    scores: { ir: true, "visa-only": "partial", local: "partial", freelance: false, diy: false },
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
