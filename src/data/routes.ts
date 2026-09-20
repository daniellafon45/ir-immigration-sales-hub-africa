export type ImmigrationRoute = {
  id: string;
  name: string;
  tag: string;
  fit: string;
  conditions: string[];
  positives: string[];
  attention: string[];
  steps: string[];
};

export type RouteBridge = {
  id: string;
  from: string;
  to: string;
  title: string;
  conditions: string[];
  caution?: string;
};

export const routes: ImmigrationRoute[] = [
  {
    id: "ee",
    name: "Entrée express",
    tag: "Résidence permanente",
    fit: "Professionnels qualifiés",
    conditions: [
      "Profil compétitif au classement",
      "Tests de langue à jour",
      "Invitation reçue avant de déposer",
    ],
    positives: [
      "Voie directe vers la résidence permanente pour certains profils",
      "Le français peut être un avantage",
      "Projet familial possible selon la situation",
    ],
    attention: [
      "Système compétitif",
      "Tests linguistiques importants",
      "Invitation jamais garantie",
    ],
    steps: [
      "Évaluer le profil",
      "Passer les tests de langue",
      "Évaluer les diplômes si requis",
      "Créer le profil",
      "Recevoir une invitation éventuelle",
      "Déposer le dossier",
      "Traitement et décision",
    ],
  },
  {
    id: "study",
    name: "Permis d’études",
    tag: "Études",
    fit: "Projet de formation canadienne",
    conditions: [
      "Lettre d’admission d’un établissement désigné",
      "Preuve de fonds pour scolarité et vie",
      "Respect des heures de travail autorisées",
    ],
    positives: [
      "Diplôme canadien",
      "Réseau local",
      "Expérience canadienne possible selon les règles",
    ],
    attention: [
      "Investissement important",
      "Le choix du programme est critique",
      "Les règles après diplôme peuvent changer",
    ],
    steps: [
      "Définir le projet",
      "Choisir le programme",
      "Obtenir l’admission",
      "Préparer les autorisations",
      "Déposer le permis",
      "Préparer l’arrivée",
      "Étudier et bâtir la carrière",
    ],
  },
  {
    id: "pnp",
    name: "Programme provincial",
    tag: "Résidence permanente",
    fit: "Profils alignés aux besoins régionaux",
    conditions: [
      "Volet ouvert dans la province visée",
      "Métier ou offre alignés au volet",
      "Étape fédérale après une nomination",
    ],
    positives: [
      "Approche régionale",
      "Peut valoriser certains métiers",
      "Plusieurs provinces à explorer",
    ],
    attention: [
      "Critères propres à chaque province",
      "Offre d’emploi parfois requise",
      "Volets peuvent ouvrir ou fermer",
    ],
    steps: [
      "Choisir la province",
      "Vérifier le volet",
      "Préparer le profil",
      "Soumettre la demande",
      "Nomination éventuelle",
      "Étape fédérale",
      "Décision",
    ],
  },
  {
    id: "work",
    name: "Permis de travail",
    tag: "Travail",
    fit: "Projet professionnel temporaire",
    conditions: [
      "Offre et type de permis alignés",
      "EIMT ou exemption selon le cas",
      "Ne pas commencer avant l’approbation",
    ],
    positives: [
      "Expérience canadienne",
      "Revenus au Canada",
      "Développement du réseau",
    ],
    attention: [
      "Certains permis sont liés à un employeur",
      "Une offre ne garantit pas un permis",
      "Conditions variables",
    ],
    steps: [
      "Identifier l’emploi",
      "Vérifier le permis applicable",
      "Préparer employeur et documents",
      "Déposer la demande",
      "Décision",
      "Arrivée et emploi",
    ],
  },
  {
    id: "family",
    name: "Regroupement familial",
    tag: "Famille",
    fit: "Réunification familiale",
    conditions: [
      "Lien familial admissible",
      "Répondant résident ou citoyen",
      "Engagements financiers possibles",
    ],
    positives: [
      "Projet centré sur la famille",
      "Voies dédiées selon le lien familial",
    ],
    attention: [
      "Admissibilité spécifique",
      "Engagements possibles",
      "Délais variables",
    ],
    steps: [
      "Vérifier le lien admissible",
      "Préparer le répondant",
      "Constituer les preuves",
      "Déposer",
      "Suivi",
      "Décision",
    ],
  },
  {
    id: "business",
    name: "Affaires",
    tag: "Entrepreneuriat",
    fit: "Entrepreneurs et gens d’affaires",
    conditions: [
      "Projet d’affaires crédible",
      "Capacité financière démontrable",
      "Volet entrepreneur ou visiteur d’affaires selon le cas",
    ],
    positives: [
      "Développement commercial",
      "Accès à un réseau canadien",
      "Voies variées selon projet",
    ],
    attention: [
      "Critères financiers et d’expérience",
      "Projet d’affaires crédible",
      "Programmes variables",
    ],
    steps: [
      "Clarifier le projet",
      "Choisir la voie",
      "Préparer le dossier",
      "Structurer le voyage ou projet",
      "Déposer",
      "Développer le réseau",
    ],
  },
  {
    id: "visit",
    name: "Visa visiteur",
    tag: "Visite",
    fit: "Séjour temporaire",
    conditions: [
      "Intention temporaire démontrable",
      "Preuve de fonds et d’attaches",
      "Pas de travail ni d’études sans permis",
    ],
    positives: [
      "Découvrir le pays avant un projet plus long",
      "Rencontrer de la famille ou un réseau",
    ],
    attention: [
      "Un visa visiteur n’autorise pas à travailler",
      "Changer de statut n’est jamais automatique",
      "Durée limitée",
    ],
    steps: [
      "Clarifier le motif du voyage",
      "Réunir fonds et attaches",
      "Déposer la demande",
      "Voyager si approuvé",
      "Respecter les conditions du séjour",
    ],
  },
  {
    id: "asylum",
    name: "Asile et protection",
    tag: "Protection",
    fit: "Crainte fondée de persécution",
    conditions: [
      "Crainte fondée de persécution",
      "Demande faite au Canada",
      "Récit et preuves cohérents",
    ],
    positives: [
      "Protection si la crainte est établie",
      "Accès possible à un statut durable ensuite",
    ],
    attention: [
      "Ce n’est pas une voie d’immigration économique",
      "Délais longs et incertains",
      "Voyager peut être restreint pendant la procédure",
    ],
    steps: [
      "Évaluer si la crainte est fondée",
      "Déposer la demande au Canada",
      "Préparer le récit et les preuves",
      "Audience ou étude du dossier",
      "Décision et suite de statut",
    ],
  },
];

export const routeBridges: RouteBridge[] = [
  {
    id: "visit-study",
    from: "visit",
    to: "study",
    title: "Visiteur vers permis d’études",
    conditions: [
      "Lettre d’admission d’un établissement désigné",
      "Preuve de fonds pour scolarité et vie",
      "Intention réelle d’étudier",
      "Ne pas étudier avant l’approbation",
    ],
  },
  {
    id: "visit-work",
    from: "visit",
    to: "work",
    title: "Visiteur vers permis de travail",
    conditions: [
      "Offre d’emploi correspondant au permis",
      "EIMT ou exemption selon le cas",
      "Ne pas commencer à travailler avant l’approbation",
      "Permis fermé ou ouvert selon le programme",
    ],
  },
  {
    id: "visit-asylum",
    from: "visit",
    to: "asylum",
    title: "Visiteur vers asile",
    conditions: [
      "Crainte fondée de persécution",
      "Demande faite au Canada",
      "Preuves et récit cohérents",
    ],
    caution: "L’asile protège. Ce n’est pas un plan B économique.",
  },
  {
    id: "study-work",
    from: "study",
    to: "work",
    title: "Études vers permis de travail",
    conditions: [
      "Programme admissible au permis postdiplôme, si visé",
      "Respect des heures de travail pendant les études",
      "Permis d’études encore valide au dépôt",
      "Le droit de travailler n’est pas automatique",
    ],
  },
  {
    id: "study-ee",
    from: "study",
    to: "ee",
    title: "Études vers Entrée express",
    conditions: [
      "Diplôme et expérience qui comptent au classement",
      "Tests de langue à jour",
      "Invitation jamais garantie",
    ],
  },
  {
    id: "work-pnp",
    from: "work",
    to: "pnp",
    title: "Travail vers programme provincial",
    conditions: [
      "Emploi et province alignés au volet",
      "Offre ou expérience parfois exigée",
      "Les volets ouvrent et ferment",
    ],
  },
  {
    id: "work-ee",
    from: "work",
    to: "ee",
    title: "Travail vers Entrée express",
    conditions: [
      "Expérience canadienne ou étrangère admissible",
      "Langue et études évaluées",
      "Invitation jamais garantie",
    ],
  },
  {
    id: "ee-family",
    from: "ee",
    to: "family",
    title: "Résidence permanente vers regroupement",
    conditions: [
      "Statut de résident ou citoyen du répondant",
      "Lien familial admissible",
      "Engagements financiers possibles",
    ],
  },
];
