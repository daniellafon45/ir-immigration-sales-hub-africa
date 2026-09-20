import { professionNoc } from "@/data/profession-noc";
import {
  professionSector,
  professions,
  sectors,
  type AdultMember,
} from "@/data/profile";
import { searchNoc } from "@/lib/noc-search";

export type OccupationKind = "profession" | "sector";

const PROFESSION_ALIASES: Record<string, string> = {
  cpa: "Comptable",
  "expert comptable": "Comptable",
  bookkeeper: "Comptable",
  "teneur de livres": "Comptable",
  comptable: "Comptable",
  "analyste financier": "Analyste financier",
  financier: "Analyste financier",
  cfa: "Analyste financier",
  infirmier: "Infirmier(ère)",
  infirmiere: "Infirmier(ère)",
  nurse: "Infirmier(ère)",
  rn: "Infirmier(ère)",
  "aide soignant": "Aide-soignant(e)",
  "aide-soignant": "Aide-soignant(e)",
  "aide soignante": "Aide-soignant(e)",
  pab: "Aide-soignant(e)",
  prepose: "Aide-soignant(e)",
  psa: "Aide-soignant(e)",
  developpeur: "Développeur logiciel",
  "developpeur logiciel": "Développeur logiciel",
  programmer: "Développeur logiciel",
  software: "Développeur logiciel",
  informaticien: "Développeur logiciel",
  codeur: "Développeur logiciel",
  dev: "Développeur logiciel",
  "analyste en ti": "Analyste en TI",
  "analyste systeme": "Analyste en TI",
  electro: "Électromécanicien",
  electromecanicien: "Électromécanicien",
  millwright: "Électromécanicien",
  electricien: "Électricien",
  electrician: "Électricien",
  ingenieur: "Ingénieur",
  engineer: "Ingénieur",
  enseignant: "Enseignant(e)",
  enseignante: "Enseignant(e)",
  prof: "Enseignant(e)",
  professeur: "Enseignant(e)",
  teacher: "Enseignant(e)",
  cuisinier: "Cuisinier(ère)",
  cuisiniere: "Cuisinier(ère)",
  chef: "Cuisinier(ère)",
  cook: "Cuisinier(ère)",
  chauffeur: "Chauffeur",
  camionneur: "Chauffeur",
  truck: "Chauffeur",
  taxi: "Chauffeur",
  commercial: "Représentant(e) commercial",
  representant: "Représentant(e) commercial",
  vendeur: "Représentant(e) commercial",
  sales: "Représentant(e) commercial",
  maintenance: "Technicien en maintenance",
  technicien: "Technicien en maintenance",
  mecanicien: "Technicien en maintenance",
  plombier: "Technicien en maintenance",
  plumber: "Technicien en maintenance",
};

const SECTOR_ALIASES: Record<string, string> = {
  finance: "Finance et comptabilité",
  compta: "Finance et comptabilité",
  banque: "Finance et comptabilité",
  accounting: "Finance et comptabilité",
  sante: "Santé",
  medical: "Santé",
  hopital: "Santé",
  hospital: "Santé",
  it: "Technologies de l’information",
  ti: "Technologies de l’information",
  info: "Technologies de l’information",
  tech: "Technologies de l’information",
  logiciel: "Technologies de l’information",
  informatique: "Technologies de l’information",
  genie: "Ingénierie",
  engineering: "Ingénierie",
  ingenierie: "Ingénierie",
  construction: "Construction et métiers",
  metier: "Construction et métiers",
  metiers: "Construction et métiers",
  chantier: "Construction et métiers",
  plomberie: "Construction et métiers",
  education: "Éducation",
  ecole: "Éducation",
  enseignement: "Éducation",
  resto: "Restauration et hôtellerie",
  hotel: "Restauration et hôtellerie",
  cuisine: "Restauration et hôtellerie",
  restauration: "Restauration et hôtellerie",
  vente: "Commerce et vente",
  commerce: "Commerce et vente",
  transport: "Transport et logistique",
  logistique: "Transport et logistique",
  camion: "Transport et logistique",
  admin: "Administration",
  bureau: "Administration",
  secretariat: "Administration",
  agri: "Agriculture",
  ferme: "Agriculture",
  agriculture: "Agriculture",
};

const EXTRA_NOC_TO_PROFESSION: Record<string, string> = {
  "12200": "Comptable",
  "21231": "Développeur logiciel",
  "21233": "Développeur logiciel",
  "21300": "Ingénieur",
  "21310": "Ingénieur",
  "21311": "Ingénieur",
  "31300": "Infirmier(ère)",
  "33103": "Aide-soignant(e)",
  "41210": "Enseignant(e)",
  "41221": "Enseignant(e)",
  "64100": "Représentant(e) commercial",
  "72400": "Technicien en maintenance",
  "72401": "Technicien en maintenance",
  "73200": "Chauffeur",
  "73400": "Chauffeur",
};

const NOC_TO_PROFESSION: Record<string, string> = {
  ...Object.fromEntries(
    professions
      .map((profession) => [professionNoc(profession), profession] as const)
      .filter((entry): entry is [string, string] => Boolean(entry[0])),
  ),
  ...EXTRA_NOC_TO_PROFESSION,
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .trim();
}

function catalogOf(kind: OccupationKind): readonly string[] {
  return kind === "profession" ? professions : sectors;
}

function aliasesOf(kind: OccupationKind) {
  return kind === "profession" ? PROFESSION_ALIASES : SECTOR_ALIASES;
}

function needlesFor(label: string): string[] {
  const n = normalize(label);
  const out = new Set([n, n.replace(/[()]/g, "")]);
  const match = n.match(/^(.*)\((ere|e)\)(.*)$/);
  if (match) {
    out.add(`${match[1]}${match[3]}`.trim());
    out.add(`${match[1]}${match[2]}${match[3]}`.trim());
  }
  return [...out];
}

function rankLabel(label: string, normalizedQuery: string) {
  const needles = needlesFor(label);
  if (needles.includes(normalizedQuery)) return 0;
  if (needles.some((needle) => needle.startsWith(normalizedQuery))) return 1;
  if (needles.some((needle) => needle.includes(normalizedQuery))) return 2;
  return 99;
}

function rankAlias(label: string, kind: OccupationKind, normalizedQuery: string) {
  let best = 99;
  for (const [alias, target] of Object.entries(aliasesOf(kind))) {
    if (target !== label) continue;
    if (alias === normalizedQuery) best = Math.min(best, 0);
    else if (alias.startsWith(normalizedQuery)) best = Math.min(best, 1);
    else if (normalizedQuery.includes(alias) && alias.length >= 3) best = Math.min(best, 3);
    else if (alias.includes(normalizedQuery) && normalizedQuery.length >= 3) best = Math.min(best, 3);
  }
  return best;
}

function professionFromNocQuery(query: string): string | undefined {
  const hit = searchNoc(query, 1)[0];
  if (!hit) return undefined;
  return NOC_TO_PROFESSION[hit.code];
}

export function resolveProfession(query: string): string {
  const raw = String(query ?? "").trim();
  if (!raw) return "Autre";
  const normalizedQuery = normalize(raw);
  const exact = professions.find((profession) => needlesFor(profession).includes(normalizedQuery));
  if (exact) return exact;
  const alias = PROFESSION_ALIASES[normalizedQuery];
  if (alias) return alias;
  const ranked = [...professions]
    .filter((profession) => profession !== "Autre")
    .map((profession) => ({
      profession,
      rank: Math.min(rankLabel(profession, normalizedQuery), rankAlias(profession, "profession", normalizedQuery)),
    }))
    .filter((item) => item.rank < 99)
    .sort((left, right) => left.rank - right.rank || left.profession.localeCompare(right.profession, "fr"));
  if (ranked[0] && ranked[0].rank <= 2) return ranked[0].profession;
  return professionFromNocQuery(raw) ?? ranked[0]?.profession ?? "Autre";
}

export function resolveSector(query: string): string {
  const raw = String(query ?? "").trim();
  if (!raw) return "Autre";
  const normalizedQuery = normalize(raw);
  const exact = sectors.find((sector) => normalize(sector) === normalizedQuery);
  if (exact) return exact;
  const alias = SECTOR_ALIASES[normalizedQuery];
  if (alias) return alias;
  const ranked = [...sectors]
    .filter((sector) => sector !== "Autre")
    .map((sector) => ({
      sector,
      rank: Math.min(rankLabel(sector, normalizedQuery), rankAlias(sector, "sector", normalizedQuery)),
    }))
    .filter((item) => item.rank < 99)
    .sort((left, right) => left.rank - right.rank || left.sector.localeCompare(right.sector, "fr"));
  return ranked[0]?.sector ?? "Autre";
}

export function searchOccupations(query: string, kind: OccupationKind, limit = 8): string[] {
  const catalog = catalogOf(kind).filter((item) => item !== "Autre");
  const raw = String(query ?? "").trim();
  if (raw.length < 2) return catalog.slice(0, limit);

  const normalizedQuery = normalize(raw);
  const scored = catalog
    .map((label) => ({
      label,
      rank: Math.min(rankLabel(label, normalizedQuery), rankAlias(label, kind, normalizedQuery)),
    }))
    .filter((item) => item.rank < 99);

  if (kind === "profession") {
    const fromNoc = professionFromNocQuery(raw);
    if (fromNoc && fromNoc !== "Autre" && !scored.some((item) => item.label === fromNoc)) {
      scored.push({ label: fromNoc, rank: 4 });
    }
  }

  return scored
    .sort((left, right) => left.rank - right.rank || left.label.localeCompare(right.label, "fr"))
    .slice(0, limit)
    .map((item) => item.label);
}

export function applyOccupationPatch(patch: Partial<AdultMember>): Partial<AdultMember> {
  if (patch.profession === undefined && patch.sector === undefined && patch.jobTitle === undefined) {
    return patch;
  }

  const next: Partial<AdultMember> = { ...patch };
  if (patch.profession !== undefined || patch.jobTitle !== undefined) {
    const typed = String(patch.profession ?? patch.jobTitle ?? "").trim();
    const profession = resolveProfession(typed);
    next.profession = profession;
    const givenTitle = String(patch.jobTitle ?? "").trim();
    next.jobTitle = givenTitle || (profession === "Autre" ? typed || profession : profession);
    if (patch.sector === undefined) {
      next.sector = professionSector[profession] ?? "Autre";
    }
  }
  if (next.sector !== undefined) {
    next.sector = resolveSector(String(next.sector));
  }
  return next;
}

export function canonicalizeOccupation(member: AdultMember): Pick<AdultMember, "profession" | "sector" | "jobTitle"> {
  const typed = member.profession.trim() || member.jobTitle.trim();
  const inCatalog = (professions as readonly string[]).includes(member.profession);
  const profession = inCatalog ? member.profession : resolveProfession(typed);
  const jobTitle = member.jobTitle.trim() || typed || profession;
  const sector = inCatalog
    ? resolveSector(member.sector)
    : professionSector[profession] ?? "Autre";
  return {
    profession,
    jobTitle: jobTitle || profession,
    sector: (sectors as readonly string[]).includes(sector) ? sector : professionSector[profession] ?? "Autre",
  };
}
