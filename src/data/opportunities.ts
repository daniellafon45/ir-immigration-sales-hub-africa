import type { OfficialSource } from "@/data/navigator-sources";

/**
 * Catalogue élargi des programmes d'immigration (fédéral, Québec, provinces,
 * pilotes, temporaires). Statuts vérifiés en octobre 2026 : plusieurs viennent
 * de sources secondaires et doivent être reconfirmés sur le site officiel.
 */

export type OpportunityFamily = "permanent" | "temporary" | "family" | "business";
export type ProgramState = "open" | "window" | "paused" | "closed";

export type OpportunityId =
  | "pstq-v1"
  | "pstq-v2"
  | "pstq-v3"
  | "pstq-v4"
  | "peq"
  | "ee-fsw"
  | "ee-cec"
  | "ee-fst"
  | "ee-french"
  | "ee-health"
  | "ee-trades"
  | "pnp"
  | "aip"
  | "rcip"
  | "fcip"
  | "mobilite-francophone"
  | "lmia-work"
  | "iec"
  | "study"
  | "pgwp"
  | "spouse-owp"
  | "family-spouse"
  | "family-child"
  | "pgp"
  | "super-visa"
  | "caregivers"
  | "startup"
  | "self-employed"
  | "pnp-entrepreneur"
  | "ict"
  | "visitor";

export type OpportunityProgram = {
  id: OpportunityId;
  name: string;
  family: OpportunityFamily;
  authority: string;
  state: ProgramState;
  /** Note de statut (fenêtre, pause, remplacement). */
  stateNote?: string;
  /** Date limite connue (AAAA-MM-JJ). */
  deadline?: string;
  /** Statut confirmé seulement par des sources secondaires. */
  verifyStatus?: boolean;
  pitch: string;
  /** Conditions d’admissibilité principales, en langage simple. */
  conditions: string[];
  /** Coût indicatif pour le demandeur principal (frais, tests, examens), hors fonds à montrer. */
  costCad: number;
  extraAdultCad: number;
  extraChildCad: number;
  /** Exige une offre d’emploi d’un employeur canadien (difficile depuis l’étranger). */
  needsEmployer: boolean;
  steps: string[];
  /** Programmes vers lesquels rediriger si celui-ci est fermé ou bloqué. */
  alternatives?: OpportunityId[];
  sources: OfficialSource[];
};

const VERIFIED = "2026-10-18";

function src(label: string, url: string): OfficialSource {
  return { label, url, verifiedOn: VERIFIED, updatedLabel: "octobre 2026" };
}

const CA = "https://www.canada.ca/fr/immigration-refugies-citoyennete/services";
const QC = "https://www.quebec.ca/immigration/permanente/travailleurs-qualifies";

const S = {
  pstq: src("Québec — Programme de sélection des travailleurs qualifiés (PSTQ)", `${QC}/programme-selection-travailleurs-qualifies`),
  pstqRounds: src("Québec — Invitations PSTQ 2026", `${QC}/programme-selection-travailleurs-qualifies/invitation/2026`),
  peq: src("Québec — Programme de l’expérience québécoise", `${QC}/programme-experience-quebecoise`),
  ee: src("IRCC — Entrée express", `${CA}/immigrer-canada/entree-express.html`),
  eeWho: src("IRCC — Qui peut présenter une demande (Entrée express)", `${CA}/immigrer-canada/entree-express/qui-presenter-demande.html`),
  eeRounds: src("IRCC — Sélection des candidats (Entrée express)", `${CA}/immigrer-canada/entree-express/soumettre-profil/selections-candidats.html`),
  eeCategories: src("IRCC — Sélection par catégorie (Entrée express)", `${CA}/immigrer-canada/entree-express/soumettre-profil/selections-candidats/selection-axee-ensembles.html`),
  pnp: src("IRCC — Programmes des candidats des provinces", `${CA}/immigrer-canada/candidats-provinces.html`),
  aip: src("IRCC — Programme d’immigration au Canada atlantique", `${CA}/immigrer-canada/programme-immigration-atlantique.html`),
  rcip: src("IRCC — Projet pilote d’immigration dans les communautés rurales", `${CA}/immigrer-canada/pilotes-rurale-franco.html`),
  fcip: src("IRCC — Projet pilote d’immigration dans les communautés francophones", `${CA}/immigrer-canada/pilotes-rurale-franco/immigration-franco.html`),
  francophone: src("IRCC — Mobilité francophone (permis de travail)", `${CA}/travailler-canada/instructions-speciales/mobilite-francophone.html`),
  work: src("IRCC — Travailler au Canada", `${CA}/travailler-canada.html`),
  iec: src("IRCC — Expérience internationale Canada (PVT, Jeunes pros, Stage)", `${CA}/travailler-canada/eic.html`),
  study: src("IRCC — Étudier au Canada", `${CA}/etudier-canada.html`),
  pgwp: src("IRCC — Permis de travail postdiplôme (PTPD)", `${CA}/etudier-canada/travail/apres-obtention-diplome.html`),
  spouseOwp: src("IRCC — Permis de travail (dont conjoints accompagnants)", `${CA}/travailler-canada/permis.html`),
  family: src("IRCC — Parrainer un membre de la famille", `${CA}/immigrer-canada/parrainer-membre-famille.html`),
  pgp: src("IRCC — Parrainage familial (parents et grands-parents)", `${CA}/immigrer-canada/parrainer-membre-famille.html`),
  superVisa: src("IRCC — Super visa pour parents et grands-parents", `${CA}/visiter-canada/super-visa-parents-grands-parents.html`),
  caregivers: src("IRCC — Aides familiaux (projets pilotes)", `${CA}/immigrer-canada/aides-familiaux.html`),
  startup: src("IRCC — Programme de visa pour démarrage d’entreprise", `${CA}/immigrer-canada/visa-demarrage.html`),
  selfEmployed: src("IRCC — Travailleurs autonomes", `${CA}/immigrer-canada/travailleurs-autonomes.html`),
  business: src("IRCC — Programmes des candidats des provinces (volets entrepreneurs)", `${CA}/immigrer-canada/candidats-provinces.html`),
  ict: src("IRCC — Directives : personnes mutées à l’intérieur d’une société", "https://www.canada.ca/fr/immigration-refugies-citoyennete/organisation/publications-guides/bulletins-guides-operationnels/mises-a-jour/2024-interets-canadiens-personnes-mutees.html"),
  visit: src("IRCC — Visiter le Canada", `${CA}/visiter-canada.html`),
} as const;

export const opportunityPrograms: OpportunityProgram[] = [
  // ——— Québec ———
  {
    id: "pstq-v1",
    conditions: ["Profession principale FEER 0, 1 ou 2 non réglementée", "12 mois d’expérience dans la profession (5 dernières années)", "Français NCLC 7 oral et 5 écrit (conjoint : 4 oral)", "Diplôme d’études secondaires ou plus", "Intention de s’établir au Québec"],
    costCad: 3700,
    extraAdultCad: 2200,
    extraChildCad: 840,
    needsEmployer: false,
    name: "PSTQ volet 1 — Haute qualification",
    family: "permanent",
    authority: "Québec (MIFI) + IRCC",
    state: "open",
    pitch: "Professions FEER 0-1-2 non réglementées ; l’expérience acquise à l’étranger compte.",
    steps: [
      "Passer un test de français reconnu (TEF/TCF Canada) visant NCLC 7 oral et 5 écrit.",
      "Confirmer le code CNP et 12 mois d’expérience dans les 5 dernières années.",
      "Déposer la déclaration d’intérêt gratuite dans Arrima (valide 12 mois).",
      "Suivre les rondes : plusieurs rondes 2026 exigeaient une présence au Québec.",
      "Si invité : demande de CSQ sous 30 jours, puis RP fédérale.",
    ],
    alternatives: ["pstq-v3", "ee-french", "study"],
    sources: [S.pstq, S.pstqRounds],
  },
  {
    id: "pstq-v2",
    conditions: ["Profession principale FEER 3, 4 ou 5", "24 mois d’expérience dont 12 au Québec", "Français NCLC 5 oral", "Intention de s’établir au Québec"],
    costCad: 3700,
    extraAdultCad: 2200,
    extraChildCad: 840,
    needsEmployer: true,
    name: "PSTQ volet 2 — Compétences intermédiaires et manuelles",
    family: "permanent",
    authority: "Québec (MIFI) + IRCC",
    state: "open",
    pitch: "Professions FEER 3-4-5 : 24 mois d’expérience dont 12 au Québec.",
    steps: [
      "Obtenir d’abord un permis de travail au Québec (EIMT, PVT…) pour cumuler 12 mois sur place.",
      "Atteindre NCLC 5 à l’oral en français.",
      "Déposer la déclaration Arrima une fois l’expérience québécoise acquise.",
    ],
    alternatives: ["lmia-work", "mobilite-francophone", "rcip"],
    sources: [S.pstq, S.pstqRounds],
  },
  {
    id: "pstq-v3",
    conditions: ["Intention d’exercer une profession réglementée au Québec", "Évaluation ou autorisation de l’ordre professionnel", "Français NCLC 7 oral / 5 écrit (FEER 0-2) ou 5 oral (FEER 3-5)"],
    costCad: 4700,
    extraAdultCad: 2200,
    extraChildCad: 840,
    needsEmployer: false,
    name: "PSTQ volet 3 — Professions réglementées",
    family: "permanent",
    authority: "Québec (MIFI) + ordres professionnels",
    state: "open",
    pitch: "Santé, génie, enseignement, métiers réglementés : volet ciblé par les rondes 2026.",
    steps: [
      "Lancer l’évaluation de l’ordre professionnel ou de l’autorité réglementaire.",
      "Passer un test de français (NCLC 7 oral / 5 écrit pour FEER 0-1-2).",
      "Déposer la déclaration Arrima en indiquant l’intention d’exercer la profession.",
    ],
    alternatives: ["pstq-v1", "ee-health"],
    sources: [S.pstq, S.pstqRounds],
  },
  {
    id: "pstq-v4",
    conditions: ["Réalisation reconnue ou avis favorable d’un organisme (FRQ, CALQ, INS, MEIE)", "3 ans d’expérience dans les 5 dernières années (selon le domaine)", "Aucun seuil de pointage Arrima"],
    costCad: 3700,
    extraAdultCad: 2200,
    extraChildCad: 840,
    needsEmployer: false,
    name: "PSTQ volet 4 — Talents d’exception",
    family: "permanent",
    authority: "Québec (MIFI, MEIE, FRQ, CALQ, INS)",
    state: "open",
    verifyStatus: true,
    pitch: "Réalisations reconnues (recherche, arts, sport, économie stratégique) ; pas de seuil de points.",
    steps: [
      "Rassembler les preuves de réalisations (prix, publications, contrats, sélections).",
      "Obtenir l’avis favorable de l’organisme concerné (FRQ, CALQ, INS, MEIE).",
      "Déposer la déclaration Arrima au volet 4.",
    ],
    alternatives: ["pstq-v1"],
    sources: [S.pstq],
  },
  {
    id: "peq",
    conditions: ["Déjà au Québec avec un statut valide lors de l’abolition (nov. 2025)", "Diplôme québécois admissible ou expérience de travail au Québec", "Français oral avancé (NCLC 7)", "Dépôt avant le 31 octobre 2026"],
    costCad: 3300,
    extraAdultCad: 2200,
    extraChildCad: 840,
    needsEmployer: false,
    name: "PEQ — réouverture temporaire",
    family: "permanent",
    authority: "Québec (MIFI)",
    state: "window",
    deadline: "2026-10-31",
    verifyStatus: true,
    stateNote:
      "Aboli en novembre 2025, réouvert du 2 juillet au 31 octobre 2026 pour les personnes déjà admissibles au Québec à la date d’abolition.",
    pitch: "Voie rapide pour travailleurs temporaires et diplômés déjà au Québec — fenêtre qui ferme bientôt.",
    steps: [
      "Vérifier immédiatement l’admissibilité à la date d’abolition (statut, diplôme ou expérience au Québec).",
      "Réunir test de français, diplôme/attestations d’emploi.",
      "Déposer avant le 31 octobre 2026.",
    ],
    alternatives: ["pstq-v1", "pstq-v2"],
    sources: [S.peq],
  },
  // ——— Entrée express ———
  {
    id: "ee-fsw",
    conditions: ["Profession FEER 0, 1, 2 ou 3", "1 an d’expérience continue (10 dernières années)", "NCLC 7 dans une langue officielle", "Études secondaires + évaluation EDE pour un diplôme étranger", "67 points à la grille FSW", "Fonds d’établissement à montrer (non dépensés) sauf offre valide", "Destination hors Québec"],
    costCad: 2700,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Entrée express — Travailleurs qualifiés (fédéral)",
    family: "permanent",
    authority: "IRCC",
    state: "open",
    pitch: "Expérience qualifiée à l’étranger, langues et études : RP sans offre d’emploi.",
    steps: [
      "Passer les tests de langue (TEF/TCF et/ou IELTS/CELPIP).",
      "Faire l’évaluation des diplômes d’études (EDE/ECA).",
      "Vérifier les 67 points de la grille FSW et les fonds d’établissement.",
      "Créer le profil Entrée express et viser les tirages par catégorie.",
    ],
    alternatives: ["ee-french", "pnp"],
    sources: [S.ee, S.eeWho],
  },
  {
    id: "ee-cec",
    conditions: ["12 mois de travail qualifié (FEER 0-3) au Canada dans les 3 dernières années", "NCLC 7 (FEER 0-1) ou NCLC 5 (FEER 2-3)", "Destination hors Québec"],
    costCad: 2400,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Entrée express — Expérience canadienne (CEC)",
    family: "permanent",
    authority: "IRCC",
    state: "open",
    pitch: "1 an de travail qualifié au Canada : la voie la plus directe après un permis de travail.",
    steps: [
      "Cumuler 12 mois de travail qualifié (FEER 0-3) au Canada dans les 3 dernières années.",
      "Atteindre NCLC 7 (FEER 0-1) ou NCLC 5 (FEER 2-3).",
      "Créer le profil Entrée express — pas de fonds d’établissement exigés.",
    ],
    alternatives: ["mobilite-francophone", "lmia-work", "iec"],
    sources: [S.ee, S.eeWho],
  },
  {
    id: "ee-fst",
    conditions: ["2 ans d’expérience dans un métier spécialisé (5 dernières années)", "Offre d’emploi d’un an ou certificat de qualification provincial", "NCLC 5 oral / 4 écrit"],
    costCad: 3000,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Entrée express — Métiers spécialisés (fédéral)",
    family: "permanent",
    authority: "IRCC",
    state: "open",
    pitch: "Électriciens, mécaniciens, cuisiniers, construction : offre d’emploi ou certificat provincial.",
    steps: [
      "Viser 2 ans d’expérience dans le métier (5 dernières années).",
      "Obtenir un certificat de qualification provincial ou une offre d’emploi d’un an.",
      "Atteindre NCLC 5 oral / 4 écrit.",
    ],
    alternatives: ["ee-trades", "aip", "rcip"],
    sources: [S.ee, S.eeWho],
  },
  {
    id: "ee-french",
    conditions: ["NCLC 7 dans les 4 compétences en français", "Admissible à FSW, CEC ou FST", "Destination hors Québec"],
    costCad: 2700,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Entrée express — Catégorie francophone",
    family: "permanent",
    authority: "IRCC",
    state: "open",
    verifyStatus: true,
    pitch:
      "≈72 % des invitations par catégorie au 1er semestre 2026 ; seuils CRS ~393-419, bien plus bas que les tirages généraux.",
    steps: [
      "Atteindre NCLC 7 dans les 4 compétences en français (TEF/TCF Canada).",
      "Être admissible à un programme Entrée express (FSW, CEC ou FST).",
      "Créer le profil et suivre les tirages francophones.",
    ],
    alternatives: ["fcip", "mobilite-francophone"],
    sources: [S.eeCategories, S.eeRounds],
  },
  {
    id: "ee-health",
    conditions: ["6 mois d’expérience continue dans une profession santé ciblée (3 dernières années)", "Admissible à FSW, CEC ou FST", "Reconnaissance professionnelle si réglementée"],
    costCad: 2700,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Entrée express — Catégorie santé et services sociaux",
    family: "permanent",
    authority: "IRCC",
    state: "open",
    pitch: "Tirages dédiés aux professions de la santé (≈8 000 invitations au 1er semestre 2026).",
    steps: [
      "Confirmer 6 mois+ d’expérience continue dans une profession santé ciblée.",
      "Lancer la reconnaissance professionnelle si la profession est réglementée.",
      "Créer le profil Entrée express.",
    ],
    alternatives: ["pstq-v3", "aip"],
    sources: [S.eeCategories, S.eeRounds],
  },
  {
    id: "ee-trades",
    conditions: ["6 mois d’expérience continue dans un métier ciblé (3 dernières années)", "Admissible à FSW, CEC ou FST"],
    costCad: 2700,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Entrée express — Catégorie métiers",
    family: "permanent",
    authority: "IRCC",
    state: "open",
    pitch: "Tirages pour les métiers spécialisés (construction, électricité, mécanique).",
    steps: [
      "Confirmer 6 mois+ d’expérience continue dans un métier ciblé.",
      "Être admissible à FSW, CEC ou FST.",
      "Créer le profil Entrée express.",
    ],
    alternatives: ["ee-fst", "rcip"],
    sources: [S.eeCategories],
  },
  // ——— Provinces et pilotes ———
  {
    id: "pnp",
    conditions: ["Critères propres à chaque province (métier en demande, études, offre, liens)", "Volet Entrée express : profil EE actif", "Intention de vivre dans la province"],
    costCad: 3700,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Programmes des candidats des provinces (PCP)",
    family: "permanent",
    authority: "Provinces + IRCC",
    state: "open",
    pitch: "Une nomination provinciale ajoute 600 points CRS (volet Entrée express).",
    steps: [
      "Choisir la province selon le métier en demande, l’offre ou les études.",
      "Vérifier les volets ouverts (certains sans offre pour métiers en pénurie).",
      "Déposer l’expression d’intérêt provinciale, puis la RP après nomination.",
    ],
    alternatives: ["aip", "rcip", "fcip"],
    sources: [S.pnp],
  },
  {
    id: "aip",
    conditions: ["Offre d’un employeur désigné en Atlantique (FEER 0-4)", "1 an d’expérience (sauf diplômés de la région)", "NCLC 5 (FEER 0-3) ou 4 (FEER 4)", "Diplôme secondaire ou plus"],
    costCad: 2800,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: true,
    name: "Programme d’immigration au Canada atlantique",
    family: "permanent",
    authority: "IRCC + provinces atlantiques",
    state: "open",
    pitch: "Offre d’un employeur désigné au N.-B., en N.-É., à l’Î.-P.-É. ou à T.-N.-L. ; ouvert à FEER 0-4.",
    steps: [
      "Chercher un employeur désigné sur les sites provinciaux (liste officielle).",
      "Obtenir l’offre et le certificat d’approbation provinciale.",
      "Atteindre NCLC 5 (FEER 0-3) ou 4 (FEER 4).",
    ],
    alternatives: ["rcip", "fcip", "pnp"],
    sources: [S.aip],
  },
  {
    id: "rcip",
    conditions: ["Offre d’un employeur désigné dans une communauté rurale participante", "Recommandation de la communauté", "NCLC 4 à 6 selon la FEER", "1 an d’expérience pertinente", "Fonds d’établissement"],
    costCad: 2800,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: true,
    name: "Pilote d’immigration dans les communautés rurales",
    family: "permanent",
    authority: "IRCC + communautés désignées",
    state: "open",
    verifyStatus: true,
    pitch: "Communautés rurales hors Québec ; employeur désigné, toutes catégories FEER.",
    steps: [
      "Repérer une communauté participante et ses employeurs désignés.",
      "Obtenir l’offre et la recommandation de la communauté.",
      "Atteindre le NCLC exigé selon la FEER (4 à 6).",
    ],
    alternatives: ["fcip", "aip", "pnp"],
    sources: [S.rcip],
  },
  {
    id: "fcip",
    conditions: ["Français NCLC 5", "Offre d’un employeur désigné dans une communauté francophone hors Québec", "Recommandation de la communauté", "1 an d’expérience pertinente"],
    costCad: 2800,
    extraAdultCad: 1900,
    extraChildCad: 560,
    needsEmployer: true,
    name: "Pilote d’immigration dans les communautés francophones",
    family: "permanent",
    authority: "IRCC + communautés francophones",
    state: "open",
    verifyStatus: true,
    pitch: "Communautés francophones hors Québec ; NCLC 5 en français et offre d’un employeur désigné.",
    steps: [
      "Atteindre NCLC 5 en français.",
      "Repérer une communauté francophone participante et ses employeurs désignés.",
      "Obtenir l’offre et la recommandation de la communauté.",
    ],
    alternatives: ["mobilite-francophone", "ee-french"],
    sources: [S.fcip],
  },
  // ——— Temporaires ———
  {
    id: "mobilite-francophone",
    conditions: ["Français NCLC 5 en expression et compréhension orales", "Offre d’emploi hors Québec (toutes FEER sauf agriculture primaire FEER 4-5)", "Employeur : offre au Portail employeur + 230 $ de conformité", "Aucune EIMT"],
    costCad: 650,
    extraAdultCad: 340,
    extraChildCad: 0,
    needsEmployer: true,
    name: "Mobilité francophone (permis C16, sans EIMT)",
    family: "temporary",
    authority: "IRCC",
    state: "open",
    pitch: "Francophones : offre hors Québec, toutes catégories FEER (sauf agriculture primaire FEER 4-5), sans EIMT.",
    steps: [
      "Obtenir NCLC 5 à l’oral en français (TEF/TCF Canada).",
      "Trouver un employeur hors Québec — Destination Canada Mobilité, guichets francophones.",
      "L’employeur publie l’offre sur le Portail employeur (230 $) et transmet le numéro d’offre.",
      "Demander le permis ; après 12 mois de travail qualifié, viser CEC ou catégorie francophone.",
    ],
    alternatives: ["fcip", "ee-french"],
    sources: [S.francophone],
  },
  {
    id: "lmia-work",
    conditions: ["Offre d’emploi d’un employeur canadien", "EIMT positive obtenue par l’employeur (et CAQ au Québec)", "Qualifications exigées par le poste"],
    costCad: 450,
    extraAdultCad: 340,
    extraChildCad: 0,
    needsEmployer: true,
    name: "Permis de travail avec EIMT (fermé)",
    family: "temporary",
    authority: "EDSC + IRCC",
    state: "open",
    pitch: "Offre d’un employeur qui obtient une EIMT ; au Québec, CAQ travail en plus.",
    steps: [
      "Trouver l’employeur prêt à faire l’EIMT (et le CAQ au Québec).",
      "Préparer diplômes, expérience et langues selon le poste.",
      "Demander le permis ; l’expérience ouvre ensuite CEC, PSTQ ou PCP.",
    ],
    alternatives: ["mobilite-francophone", "iec"],
    sources: [S.work],
  },
  {
    id: "iec",
    conditions: ["Citoyen d’un pays ayant un accord EIC", "Âge dans le plafond du pays (souvent 18-35 ans)", "Fonds ≈ 2 500 $ et assurance pour tout le séjour", "Invitation tirée au sort dans le bassin de la saison"],
    costCad: 1000,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Expérience internationale Canada (PVT / Jeunes pros)",
    family: "temporary",
    authority: "IRCC",
    state: "open",
    verifyStatus: true,
    pitch: "Permis ouvert pour les 18-35 ans (selon le pays) — tremplin vers CEC et PSTQ.",
    steps: [
      "Vérifier que votre pays a un accord et le plafond d’âge.",
      "Créer le profil EIC et entrer dans le bassin de la saison.",
      "Après invitation : permis, travail qualifié 12 mois, puis RP.",
    ],
    alternatives: ["mobilite-francophone", "study"],
    sources: [S.iec],
  },
  {
    id: "study",
    conditions: ["Admission dans un établissement désigné (EED)", "CAQ (Québec) ou lettre d’attestation provinciale", "Fonds : scolarité de 1re année + subsistance", "Projet d’études cohérent et liens au pays"],
    costCad: 20000,
    extraAdultCad: 340,
    extraChildCad: 150,
    needsEmployer: false,
    name: "Permis d’études (tremplin)",
    family: "temporary",
    authority: "IRCC + provinces (CAQ / LAP)",
    state: "open",
    pitch: "Diplôme canadien = points Arrima/CRS, PTPD et accès aux rondes réservées aux résidents du Québec.",
    steps: [
      "Choisir un programme cohérent avec le parcours (EED / DLI).",
      "Obtenir l’admission, puis le CAQ (Québec) ou la lettre d’attestation provinciale.",
      "Monter les preuves de fonds (scolarité + subsistance).",
      "Pour le conjoint : une maîtrise de 16 mois+ ouvre son permis de travail.",
    ],
    alternatives: ["iec"],
    sources: [S.study],
  },
  {
    id: "pgwp",
    conditions: ["Programme admissible de 8 mois+ terminé dans un EED", "Domaine d’études admissible pour les programmes non universitaires", "Preuve de langue", "Demande dans les 180 jours suivant la fin des études"],
    costCad: 340,
    extraAdultCad: 340,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Permis de travail postdiplôme (PTPD)",
    family: "temporary",
    authority: "IRCC",
    state: "open",
    pitch: "Permis ouvert après un programme admissible ; condition de domaine d’études pour les collèges.",
    steps: [
      "Vérifier l’admissibilité du programme et du domaine d’études.",
      "Demander dans les 180 jours suivant la confirmation de fin d’études.",
      "Travailler 12 mois en emploi qualifié pour viser CEC ou PSTQ.",
    ],
    alternatives: ["ee-cec", "pstq-v1"],
    sources: [S.pgwp],
  },
  {
    id: "spouse-owp",
    conditions: ["Relation de mariage ou union de fait prouvée", "Principal en maîtrise 16 mois+ / doctorat, ou en poste FEER 0-1 (FEER 2-3 selon les secteurs)", "Permis du principal valide"],
    costCad: 340,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Permis ouvert du conjoint accompagnant",
    family: "temporary",
    authority: "IRCC",
    state: "open",
    verifyStatus: true,
    pitch:
      "Le conjoint travaille aussi : maîtrise 16 mois+ / doctorat, ou travailleur FEER 0-1 (FEER 2-3 dans certains secteurs).",
    steps: [
      "Confirmer le statut du demandeur principal (programme ou poste admissible).",
      "Prouver la relation (acte de mariage / union de fait).",
      "Demander le permis en même temps que le principal.",
    ],
    sources: [S.spouseOwp],
  },
  // ——— Famille ———
  {
    id: "family-spouse",
    conditions: ["Répondant citoyen ou résident permanent (18 ans+)", "Relation authentique (mariage, union de fait ou conjugale)", "Engagement de 3 ans (+ engagement Québec si applicable)"],
    costCad: 1600,
    extraAdultCad: 0,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Parrainage d’un époux ou conjoint",
    family: "family",
    authority: "IRCC (+ Québec si résident du Québec)",
    state: "open",
    pitch: "Le répondant citoyen ou résident permanent parraine son conjoint.",
    steps: [
      "Réunir les preuves de relation authentique.",
      "Le répondant signe l’engagement (3 ans).",
      "Au Québec : engagement auprès du MIFI en plus.",
    ],
    sources: [S.family],
  },
  {
    id: "family-child",
    conditions: ["Enfant de moins de 22 ans, sans conjoint (ou à charge pour raison de santé)", "Répondant citoyen ou résident permanent", "Preuve de filiation"],
    costCad: 800,
    extraAdultCad: 0,
    extraChildCad: 560,
    needsEmployer: false,
    name: "Parrainage d’un enfant à charge",
    family: "family",
    authority: "IRCC",
    state: "open",
    pitch: "Enfant de moins de 22 ans non marié (ou à charge pour raison de santé).",
    steps: ["Preuves de filiation.", "Engagement du répondant.", "Formulaires de RP de l’enfant."],
    sources: [S.family],
  },
  {
    id: "pgp",
    conditions: ["Aucune nouvelle demande acceptée en 2026"],
    costCad: 0,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Parrainage des parents et grands-parents",
    family: "family",
    authority: "IRCC",
    state: "paused",
    verifyStatus: true,
    stateNote: "Aucune nouvelle demande en 2026 ; seules les invitations 2025 sont traitées.",
    pitch: "Fermé aux nouvelles demandes — utiliser le super visa.",
    steps: ["Basculer vers le super visa en attendant une réouverture."],
    alternatives: ["super-visa"],
    sources: [S.pgp],
  },
  {
    id: "super-visa",
    conditions: ["Parent ou grand-parent d’un citoyen ou RP", "Revenu minimal de l’hôte (SFR + 30 %) et lettre d’invitation", "Assurance médicale canadienne d’un an", "Examen médical"],
    costCad: 2100,
    extraAdultCad: 2100,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Super visa parents et grands-parents",
    family: "family",
    authority: "IRCC",
    state: "open",
    pitch: "Séjours jusqu’à 5 ans par entrée, visa valide jusqu’à 10 ans.",
    steps: [
      "L’enfant au Canada prouve le revenu minimal (SFR + 30 %) et signe une lettre d’invitation.",
      "Souscrire une assurance médicale canadienne d’un an.",
      "Examen médical et demande de visa.",
    ],
    sources: [S.superVisa],
  },
  // ——— Fermés / suspendus ———
  {
    id: "caregivers",
    conditions: ["Réception des demandes suspendue"],
    costCad: 0,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Pilotes aides familiaux à domicile",
    family: "permanent",
    authority: "IRCC",
    state: "paused",
    verifyStatus: true,
    stateNote: "Réception suspendue depuis décembre 2025, pas de réouverture annoncée.",
    pitch: "Fermé — passer par EIMT, Atlantique ou communautés rurales.",
    steps: ["Orienter vers un permis avec EIMT ou un pilote communautaire."],
    alternatives: ["lmia-work", "aip", "rcip"],
    sources: [S.caregivers],
  },
  {
    id: "startup",
    conditions: ["Fermé aux nouvelles demandes"],
    costCad: 0,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Visa pour démarrage d’entreprise",
    family: "business",
    authority: "IRCC",
    state: "closed",
    verifyStatus: true,
    stateNote: "Fermé aux nouvelles demandes depuis le 31 décembre 2025 ; remplacement annoncé.",
    pitch: "Fermé — passer par les volets entrepreneurs provinciaux.",
    steps: ["Orienter vers un volet entrepreneur provincial ou une mutation intra-société."],
    alternatives: ["pnp-entrepreneur", "ict"],
    sources: [S.startup],
  },
  {
    id: "self-employed",
    conditions: ["Réception suspendue"],
    costCad: 0,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Travailleurs autonomes (fédéral)",
    family: "business",
    authority: "IRCC",
    state: "paused",
    verifyStatus: true,
    stateNote: "Pause indéfinie depuis avril 2024.",
    pitch: "Suspendu — alternatives provinciales.",
    steps: ["Orienter vers un volet entrepreneur provincial."],
    alternatives: ["pnp-entrepreneur"],
    sources: [S.selfEmployed],
  },
  // ——— Affaires ———
  {
    id: "pnp-entrepreneur",
    conditions: ["Valeur nette personnelle (souvent 150 000 $ à 600 000 $)", "Investissement minimum et gestion active de l’entreprise", "Plan d’affaires, parfois visite exploratoire"],
    costCad: 150000,
    extraAdultCad: 0,
    extraChildCad: 0,
    needsEmployer: false,
    name: "Volets entrepreneurs provinciaux",
    family: "business",
    authority: "Provinces + IRCC",
    state: "open",
    pitch: "Investissement et gestion active d’une entreprise dans la province ; valeur nette exigée.",
    steps: [
      "Comparer valeur nette et investissement minimum par province.",
      "Plan d’affaires et visite exploratoire.",
      "Permis de travail entrepreneur, puis nomination à la RP.",
    ],
    sources: [S.business],
  },
  {
    id: "ict",
    conditions: ["1 an d’emploi continu à temps plein dans l’entreprise (3 dernières années)", "Lien mère / filiale / succursale avec l’entité canadienne", "Poste de cadre, de direction ou à connaissances spécialisées"],
    costCad: 500,
    extraAdultCad: 340,
    extraChildCad: 0,
    needsEmployer: true,
    name: "Mutation intra-société (C12)",
    family: "business",
    authority: "IRCC",
    state: "open",
    pitch: "Cadre ou spécialiste d’une entreprise étrangère muté vers une filiale canadienne.",
    steps: [
      "Justifier 1 an d’emploi continu dans l’entreprise (3 dernières années).",
      "Établir le lien entreprise mère / filiale au Canada.",
      "Demander le permis ; l’expérience ouvre ensuite CEC.",
    ],
    sources: [S.ict],
  },
  {
    id: "visitor",
    conditions: ["Motif de visite crédible et durée limitée", "Fonds pour le séjour", "Liens au pays d’origine (retour crédible)", "Interdiction de travailler"],
    costCad: 185,
    extraAdultCad: 185,
    extraChildCad: 185,
    needsEmployer: false,
    name: "Visa de visiteur (exploration)",
    family: "temporary",
    authority: "IRCC",
    state: "open",
    pitch: "Repérage, réseautage, entrevues — ne permet pas de travailler.",
    steps: ["Motif clair et durée courte.", "Preuves de fonds et de liens au pays.", "Demande de VRT ou AVE."],
    sources: [S.visit],
  },
];

export function opportunityById(id: OpportunityId): OpportunityProgram {
  const program = opportunityPrograms.find((p) => p.id === id);
  if (!program) throw new Error(`Programme inconnu : ${id}`);
  return program;
}

/** Pays EIC et plafond d’âge indicatif (à vérifier chaque saison). */
export const iecCountryMaxAge: Record<string, number> = {
  Allemagne: 35,
  Andorre: 30,
  Australie: 35,
  Autriche: 35,
  Belgique: 30,
  Chili: 35,
  "Corée du Sud": 35,
  "Costa Rica": 35,
  Croatie: 35,
  Danemark: 35,
  Espagne: 35,
  Estonie: 35,
  France: 35,
  Grèce: 35,
  "Hong Kong": 30,
  Irlande: 35,
  Italie: 35,
  Japon: 30,
  Lettonie: 35,
  Lituanie: 35,
  Luxembourg: 30,
  Mexique: 29,
  Norvège: 35,
  "Nouvelle-Zélande": 35,
  "Pays-Bas": 30,
  Pologne: 35,
  Portugal: 35,
  "République tchèque": 35,
  "Royaume-Uni": 35,
  "Saint-Marin": 35,
  Slovaquie: 35,
  Slovénie: 35,
  Suède: 30,
  Suisse: 35,
  Taïwan: 35,
  Ukraine: 35,
};
