export type Teer = 0 | 1 | 2 | 3 | 4 | 5;
export type NocUnit = { code: string; title: string; teer: Teer };

export const nocIngestedAt = "2026-09-19";
export const nocSourceUrl =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/trouver-classification-nationale-professions.html";

export const noc2021: NocUnit[] = [
  { code: "00010", title: "Gestionnaires législatifs", teer: 0 },
  { code: "00011", title: "Cadres supérieurs de l’administration publique", teer: 0 },
  { code: "10010", title: "Adjoints administratifs", teer: 0 },
  { code: "10011", title: "Agents de bureau", teer: 0 },
  { code: "11100", title: "Comptable", teer: 1 },
  { code: "11101", title: "Analystes financiers", teer: 1 },
  { code: "11202", title: "Professionnels en marketing et relations publiques", teer: 1 },
  { code: "12100", title: "Superviseurs de bureau", teer: 2 },
  { code: "12200", title: "Techniciens comptables et teneurs de livres", teer: 2 },
  { code: "13100", title: "Adjoints juridiques", teer: 3 },
  { code: "14100", title: "Réceptionnistes", teer: 4 },
  { code: "20010", title: "Gestionnaires de systèmes informatiques", teer: 0 },
  { code: "21100", title: "Physiciens et astronomes", teer: 1 },
  { code: "21120", title: "Chimistes", teer: 1 },
  { code: "21220", title: "Spécialistes en cybersécurité", teer: 1 },
  { code: "21221", title: "Analystes en affaires informatiques", teer: 1 },
  { code: "21222", title: "Analystes et consultants en informatique", teer: 1 },
  { code: "21223", title: "Analystes de bases de données", teer: 1 },
  { code: "21230", title: "Concepteurs web", teer: 1 },
  { code: "21231", title: "Ingénieurs logiciels", teer: 1 },
  { code: "21232", title: "Développeurs logiciels et programmeurs", teer: 1 },
  { code: "21233", title: "Développeurs et concepteurs web", teer: 1 },
  { code: "21300", title: "Ingénieurs civils", teer: 1 },
  { code: "21301", title: "Ingénieurs mécaniques", teer: 1 },
  { code: "21310", title: "Ingénieurs électriciens et électroniciens", teer: 1 },
  { code: "21311", title: "Ingénieurs industriels", teer: 1 },
  { code: "22100", title: "Technologues et techniciens en chimie", teer: 2 },
  { code: "22101", title: "Technologues et techniciens en biologie", teer: 2 },
  { code: "22211", title: "Hygiénistes et thérapeutes dentaires", teer: 2 },
  { code: "22212", title: "Technologues et techniciens en santé", teer: 2 },
  { code: "22300", title: "Technologues en génie civil", teer: 2 },
  { code: "22301", title: "Technologues en génie mécanique", teer: 2 },
  { code: "22310", title: "Électrotechniciens", teer: 2 },
  { code: "22311", title: "Techniciens de réseau informatique", teer: 2 },
  { code: "31100", title: "Médecins spécialistes", teer: 1 },
  { code: "31101", title: "Chirurgiens", teer: 1 },
  { code: "31102", title: "Médecins généralistes", teer: 1 },
  { code: "31300", title: "Coordonnateurs en soins infirmiers", teer: 1 },
  { code: "31301", title: "Infirmier", teer: 1 },
  { code: "31302", title: "Sages-femmes", teer: 1 },
  { code: "32101", title: "Inhalothérapeutes", teer: 2 },
  { code: "32109", title: "Autres techniciens en thérapie et en évaluation", teer: 2 },
  { code: "32120", title: "Technologues de laboratoire médical", teer: 2 },
  { code: "32121", title: "Technologues en radiation médicale", teer: 2 },
  { code: "32200", title: "Praticiens de médecine traditionnelle", teer: 2 },
  { code: "33100", title: "Assistants dentaires", teer: 3 },
  { code: "33101", title: "Assistants de laboratoire médical", teer: 3 },
  { code: "33102", title: "Aide-soignant", teer: 3 },
  { code: "33103", title: "Préposés aux services de soutien à domicile", teer: 3 },
  { code: "40010", title: "Directeurs d’école", teer: 0 },
  { code: "41210", title: "Professeurs de collège", teer: 1 },
  { code: "41220", title: "Enseignant du secondaire", teer: 1 },
  { code: "41221", title: "Enseignant du primaire", teer: 1 },
  { code: "41300", title: "Travailleurs sociaux", teer: 1 },
  { code: "42201", title: "Conseillers sociaux et de soutien", teer: 2 },
  { code: "43100", title: "Agents de police", teer: 3 },
  { code: "44101", title: "Aides familiaux à domicile", teer: 4 },
  { code: "51111", title: "Auteurs et rédacteurs", teer: 1 },
  { code: "52120", title: "Graphistes", teer: 2 },
  { code: "62020", title: "Superviseurs des services alimentaires", teer: 2 },
  { code: "62022", title: "Superviseurs de l’entretien ménager", teer: 2 },
  { code: "63100", title: "Agents d’assurance", teer: 3 },
  { code: "63101", title: "Agents immobiliers", teer: 3 },
  { code: "63200", title: "Cuisinier", teer: 3 },
  { code: "63201", title: "Bouchers", teer: 3 },
  { code: "63202", title: "Boulangers", teer: 3 },
  { code: "64100", title: "Vendeurs au détail", teer: 4 },
  { code: "64101", title: "Représentant commercial", teer: 4 },
  { code: "64314", title: "Réceptionnistes d’hôtel", teer: 4 },
  { code: "70010", title: "Directeurs de la construction", teer: 0 },
  { code: "72010", title: "Entrepreneurs en construction", teer: 2 },
  { code: "72100", title: "Machinistes", teer: 2 },
  { code: "72200", title: "Électricien", teer: 2 },
  { code: "72310", title: "Charpentiers", teer: 2 },
  { code: "72400", title: "Mécaniciens industriels", teer: 2 },
  { code: "72401", title: "Mécaniciens en chauffage et climatisation", teer: 2 },
  { code: "72410", title: "Techniciens automobiles", teer: 2 },
  { code: "72422", title: "Électromécanicien", teer: 2 },
  { code: "73100", title: "Monteurs industriels", teer: 3 },
  { code: "73200", title: "Camionneurs", teer: 3 },
  { code: "73201", title: "Technicien en maintenance", teer: 3 },
  { code: "73300", title: "Chauffeur de transport en commun", teer: 3 },
  { code: "73400", title: "Conducteurs d’équipement lourd", teer: 3 },
  { code: "75110", title: "Manoeuvres du soutien des métiers", teer: 5 },
  { code: "75119", title: "Nettoyeurs spécialisés", teer: 5 },
  { code: "82030", title: "Entrepreneurs agricoles", teer: 2 },
  { code: "84120", title: "Ouvriers agricoles", teer: 4 },
  { code: "85100", title: "Manoeuvres en aménagement paysager", teer: 5 },
  { code: "85101", title: "Récolteurs", teer: 5 },
  { code: "94140", title: "Opérateurs de machines industrielles", teer: 4 },
  { code: "95100", title: "Manoeuvres en transformation", teer: 5 },
  { code: "95210", title: "Assembleurs", teer: 5 },
];

const byCode = new Map(noc2021.map((item) => [item.code, item]));

export function nocByCode(code: string): NocUnit | undefined {
  return byCode.get(code);
}

export function teerOf(code: string): Teer | null {
  const normalized = String(code ?? "").trim();
  const catalog = nocByCode(normalized);
  if (catalog) return catalog.teer;
  if (!/^\d{5}$/.test(normalized)) return null;
  const teer = Number(normalized[1]);
  return teer >= 0 && teer <= 5 ? (teer as Teer) : null;
}
