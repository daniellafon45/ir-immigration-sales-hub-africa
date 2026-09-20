export const studyLevels = ["cegep", "bachelor", "master", "doctorate"] as const;
export type StudyLevel = (typeof studyLevels)[number];

export const studyLevelLabels: Record<StudyLevel, string> = {
  cegep: "Cégep / collège",
  bachelor: "Baccalauréat",
  master: "Maîtrise",
  doctorate: "Doctorat",
};

export const studyDomains = [
  "Administration, finance, gestion",
  "Santé et services sociaux",
  "Technologies de l’information",
  "Ingénierie et sciences appliquées",
  "Construction, métiers, maintenance",
  "Éducation",
  "Restauration, tourisme, hôtellerie",
  "Droit, justice, administration publique",
  "Sciences",
  "Arts, design, communication",
  "Sciences humaines et sociales",
  "Transport, logistique",
  "Agriculture, ressources naturelles",
  "Commerce, vente",
] as const;
export type StudyDomain = (typeof studyDomains)[number];

export type StudyProgram = {
  id: string;
  name: string;
  level: StudyLevel;
  domain: StudyDomain;
  profession: string;
  employability: number;
};

function p(
  id: string,
  name: string,
  level: StudyLevel,
  domain: StudyDomain,
  profession: string,
  employability: number,
): StudyProgram {
  return { id, name, level, domain, profession, employability };
}

export const studyPrograms: StudyProgram[] = [
  p("dec-compta", "DEC Techniques de comptabilité et de gestion", "cegep", "Administration, finance, gestion", "Comptable", 72),
  p("dec-admin", "DEC Techniques administratives", "cegep", "Administration, finance, gestion", "Comptable", 68),
  p("dec-gestion-comm", "DEC Gestion de commerces", "cegep", "Administration, finance, gestion", "Représentant(e) commercial", 70),
  p("dec-rh", "DEC Gestion des ressources humaines", "cegep", "Administration, finance, gestion", "Autre", 66),
  p("bac-admin", "Baccalauréat en administration (comptabilité)", "bachelor", "Administration, finance, gestion", "Comptable", 78),
  p("bac-admin-gen", "Baccalauréat en administration des affaires", "bachelor", "Administration, finance, gestion", "Analyste financier", 76),
  p("bac-eco", "Baccalauréat en économie", "bachelor", "Administration, finance, gestion", "Analyste financier", 72),
  p("bac-rh", "Baccalauréat en ressources humaines", "bachelor", "Administration, finance, gestion", "Autre", 70),
  p("master-finance", "Maîtrise en finance", "master", "Administration, finance, gestion", "Analyste financier", 70),
  p("master-mba", "MBA, administration des affaires", "master", "Administration, finance, gestion", "Analyste financier", 74),
  p("master-compta", "Maîtrise en comptabilité", "master", "Administration, finance, gestion", "Comptable", 76),
  p("phd-admin", "Doctorat en administration", "doctorate", "Administration, finance, gestion", "Analyste financier", 62),
  p("phd-eco", "Doctorat en économie", "doctorate", "Administration, finance, gestion", "Analyste financier", 60),

  p("dec-soins", "DEC Soins infirmiers", "cegep", "Santé et services sociaux", "Infirmier(ère)", 88),
  p("dec-prepose", "DEC / AEC Préposé aux bénéficiaires", "cegep", "Santé et services sociaux", "Aide-soignant(e)", 86),
  p("dec-ambu", "DEC Soins préhospitaliers d’urgence", "cegep", "Santé et services sociaux", "Aide-soignant(e)", 80),
  p("dec-labo", "DEC Techniques de laboratoire médical", "cegep", "Santé et services sociaux", "Autre", 78),
  p("dec-dentaire", "DEC Hygiène dentaire", "cegep", "Santé et services sociaux", "Autre", 74),
  p("dec-pharma-tech", "DEC Techniques pharmaceutiques", "cegep", "Santé et services sociaux", "Autre", 76),
  p("dec-travail-social", "DEC Techniques de travail social", "cegep", "Santé et services sociaux", "Autre", 72),
  p("bac-nursing", "Baccalauréat en sciences infirmières", "bachelor", "Santé et services sociaux", "Infirmier(ère)", 92),
  p("bac-physio", "Baccalauréat en physiothérapie", "bachelor", "Santé et services sociaux", "Autre", 84),
  p("bac-ergo", "Baccalauréat en ergothérapie", "bachelor", "Santé et services sociaux", "Autre", 80),
  p("bac-nutrition", "Baccalauréat en nutrition", "bachelor", "Santé et services sociaux", "Autre", 74),
  p("bac-pharmacie", "Doctorat de premier cycle en pharmacie (Pharm. D.)", "bachelor", "Santé et services sociaux", "Autre", 82),
  p("bac-travail-social", "Baccalauréat en travail social", "bachelor", "Santé et services sociaux", "Autre", 76),
  p("master-nursing", "Maîtrise en sciences infirmières", "master", "Santé et services sociaux", "Infirmier(ère)", 88),
  p("master-sante-pub", "Maîtrise en santé publique", "master", "Santé et services sociaux", "Autre", 78),
  p("phd-nursing", "Doctorat en sciences infirmières", "doctorate", "Santé et services sociaux", "Infirmier(ère)", 72),
  p("phd-sante-pub", "Doctorat en santé publique", "doctorate", "Santé et services sociaux", "Autre", 68),

  p("dec-info", "DEC Techniques de l’informatique", "cegep", "Technologies de l’information", "Développeur logiciel", 70),
  p("dec-reseaux", "DEC Gestion de réseaux informatiques", "cegep", "Technologies de l’information", "Analyste en TI", 72),
  p("dec-cyber", "DEC Cybersécurité", "cegep", "Technologies de l’information", "Analyste en TI", 78),
  p("dec-jeux", "DEC Techniques de l’informatique, jeux", "cegep", "Technologies de l’information", "Développeur logiciel", 66),
  p("bac-info", "Baccalauréat en informatique", "bachelor", "Technologies de l’information", "Développeur logiciel", 82),
  p("bac-genie-log", "Baccalauréat en génie logiciel", "bachelor", "Technologies de l’information", "Développeur logiciel", 84),
  p("bac-data", "Baccalauréat en science des données", "bachelor", "Technologies de l’information", "Analyste en TI", 80),
  p("bac-cyber", "Baccalauréat en cybersécurité", "bachelor", "Technologies de l’information", "Analyste en TI", 82),
  p("master-ti", "Maîtrise en technologies de l’information", "master", "Technologies de l’information", "Analyste en TI", 76),
  p("master-ia", "Maîtrise en intelligence artificielle", "master", "Technologies de l’information", "Développeur logiciel", 78),
  p("master-cyber", "Maîtrise en cybersécurité", "master", "Technologies de l’information", "Analyste en TI", 80),
  p("phd-info", "Doctorat en informatique", "doctorate", "Technologies de l’information", "Développeur logiciel", 74),
  p("phd-ia", "Doctorat en intelligence artificielle", "doctorate", "Technologies de l’information", "Développeur logiciel", 72),

  p("dec-genie-civil", "DEC Technologie du génie civil", "cegep", "Ingénierie et sciences appliquées", "Ingénieur", 74),
  p("dec-genie-mec", "DEC Technologie du génie mécanique", "cegep", "Ingénierie et sciences appliquées", "Ingénieur", 76),
  p("dec-genie-elec", "DEC Technologie du génie électrique", "cegep", "Ingénierie et sciences appliquées", "Ingénieur", 76),
  p("dec-chim-proc", "DEC Techniques de procédés chimiques", "cegep", "Ingénierie et sciences appliquées", "Ingénieur", 70),
  p("bac-genie", "Baccalauréat en génie", "bachelor", "Ingénierie et sciences appliquées", "Ingénieur", 80),
  p("bac-genie-civil", "Baccalauréat en génie civil", "bachelor", "Ingénierie et sciences appliquées", "Ingénieur", 82),
  p("bac-genie-mec", "Baccalauréat en génie mécanique", "bachelor", "Ingénierie et sciences appliquées", "Ingénieur", 82),
  p("bac-genie-elec", "Baccalauréat en génie électrique", "bachelor", "Ingénierie et sciences appliquées", "Ingénieur", 84),
  p("bac-genie-chim", "Baccalauréat en génie chimique", "bachelor", "Ingénierie et sciences appliquées", "Ingénieur", 78),
  p("bac-genie-ind", "Baccalauréat en génie industriel", "bachelor", "Ingénierie et sciences appliquées", "Ingénieur", 76),
  p("master-genie", "Maîtrise en génie", "master", "Ingénierie et sciences appliquées", "Ingénieur", 78),
  p("master-genie-elec", "Maîtrise en génie électrique", "master", "Ingénierie et sciences appliquées", "Ingénieur", 80),
  p("phd-genie", "Doctorat en génie", "doctorate", "Ingénierie et sciences appliquées", "Ingénieur", 70),

  p("dec-electro", "DEC Électrotechnique", "cegep", "Construction, métiers, maintenance", "Électromécanicien", 84),
  p("dec-elec", "DEC / DEP Électricité du bâtiment", "cegep", "Construction, métiers, maintenance", "Électricien", 86),
  p("dec-meca-bat", "DEC Mécanique du bâtiment", "cegep", "Construction, métiers, maintenance", "Technicien en maintenance", 80),
  p("dec-maint", "DEC Maintenance industrielle", "cegep", "Construction, métiers, maintenance", "Technicien en maintenance", 82),
  p("dec-soudure", "DEC / DEP Soudage-montage", "cegep", "Construction, métiers, maintenance", "Technicien en maintenance", 78),
  p("dec-plomberie", "DEC / DEP Plomberie-chauffage", "cegep", "Construction, métiers, maintenance", "Technicien en maintenance", 80),
  p("dec-charpente", "DEC / DEP Charpenterie-menuiserie", "cegep", "Construction, métiers, maintenance", "Autre", 76),
  p("bac-const", "Baccalauréat en gestion de la construction", "bachelor", "Construction, métiers, maintenance", "Ingénieur", 74),
  p("bac-arch", "Baccalauréat en architecture", "bachelor", "Construction, métiers, maintenance", "Ingénieur", 70),
  p("master-const", "Maîtrise en gestion de projet de construction", "master", "Construction, métiers, maintenance", "Ingénieur", 72),
  p("master-arch", "Maîtrise en architecture", "master", "Construction, métiers, maintenance", "Ingénieur", 68),

  p("dec-enfance", "DEC Techniques d’éducation à l’enfance", "cegep", "Éducation", "Enseignant(e)", 74),
  p("dec-ed-spe", "DEC Techniques d’éducation spécialisée", "cegep", "Éducation", "Enseignant(e)", 76),
  p("bac-edu", "Baccalauréat en éducation", "bachelor", "Éducation", "Enseignant(e)", 68),
  p("bac-edu-presco", "Baccalauréat en éducation préscolaire et primaire", "bachelor", "Éducation", "Enseignant(e)", 72),
  p("bac-edu-sec", "Baccalauréat en enseignement secondaire", "bachelor", "Éducation", "Enseignant(e)", 70),
  p("bac-ortho", "Baccalauréat en orthopédagogie", "bachelor", "Éducation", "Enseignant(e)", 74),
  p("master-edu", "Maîtrise en éducation", "master", "Éducation", "Enseignant(e)", 72),
  p("master-ortho", "Maîtrise en orthopédagogie", "master", "Éducation", "Enseignant(e)", 74),
  p("phd-edu", "Doctorat en éducation", "doctorate", "Éducation", "Enseignant(e)", 64),

  p("dec-cuisine", "DEC Gestion d’un établissement de restauration", "cegep", "Restauration, tourisme, hôtellerie", "Cuisinier(ère)", 75),
  p("dec-cuisine-pro", "DEC Cuisine professionnelle", "cegep", "Restauration, tourisme, hôtellerie", "Cuisinier(ère)", 78),
  p("dec-patisserie", "DEC Pâtisserie", "cegep", "Restauration, tourisme, hôtellerie", "Cuisinier(ère)", 72),
  p("dec-tourisme", "DEC Techniques de tourisme", "cegep", "Restauration, tourisme, hôtellerie", "Représentant(e) commercial", 70),
  p("dec-hotel", "DEC Gestion hôtelière", "cegep", "Restauration, tourisme, hôtellerie", "Autre", 72),
  p("bac-hotel", "Baccalauréat en gestion hôtelière", "bachelor", "Restauration, tourisme, hôtellerie", "Autre", 74),
  p("bac-tourisme", "Baccalauréat en tourisme", "bachelor", "Restauration, tourisme, hôtellerie", "Représentant(e) commercial", 70),
  p("master-tourisme", "Maîtrise en gestion du tourisme", "master", "Restauration, tourisme, hôtellerie", "Autre", 66),

  p("dec-juridique", "DEC Techniques juridiques", "cegep", "Droit, justice, administration publique", "Autre", 68),
  p("dec-police", "DEC Techniques policières", "cegep", "Droit, justice, administration publique", "Autre", 74),
  p("dec-correctionnel", "DEC Intervention en délinquance", "cegep", "Droit, justice, administration publique", "Autre", 70),
  p("bac-droit", "Baccalauréat en droit", "bachelor", "Droit, justice, administration publique", "Autre", 72),
  p("bac-crimino", "Baccalauréat en criminologie", "bachelor", "Droit, justice, administration publique", "Autre", 70),
  p("bac-admin-pub", "Baccalauréat en administration publique", "bachelor", "Droit, justice, administration publique", "Autre", 68),
  p("master-droit", "Maîtrise en droit", "master", "Droit, justice, administration publique", "Autre", 70),
  p("master-admin-pub", "Maîtrise en administration publique", "master", "Droit, justice, administration publique", "Autre", 72),
  p("phd-droit", "Doctorat en droit", "doctorate", "Droit, justice, administration publique", "Autre", 60),

  p("dec-sciences", "DEC Sciences de la nature", "cegep", "Sciences", "Autre", 70),
  p("dec-env-tech", "DEC Techniques du milieu naturel", "cegep", "Sciences", "Autre", 72),
  p("bac-bio", "Baccalauréat en biologie", "bachelor", "Sciences", "Autre", 68),
  p("bac-chimie", "Baccalauréat en chimie", "bachelor", "Sciences", "Autre", 70),
  p("bac-physique", "Baccalauréat en physique", "bachelor", "Sciences", "Autre", 66),
  p("bac-maths", "Baccalauréat en mathématiques", "bachelor", "Sciences", "Analyste en TI", 72),
  p("bac-env", "Baccalauréat en sciences de l’environnement", "bachelor", "Sciences", "Autre", 70),
  p("bac-geo-sci", "Baccalauréat en géologie", "bachelor", "Sciences", "Ingénieur", 68),
  p("master-bio", "Maîtrise en biologie", "master", "Sciences", "Autre", 66),
  p("master-env", "Maîtrise en sciences de l’environnement", "master", "Sciences", "Autre", 68),
  p("phd-bio", "Doctorat en biologie", "doctorate", "Sciences", "Autre", 62),
  p("phd-chimie", "Doctorat en chimie", "doctorate", "Sciences", "Autre", 64),

  p("dec-graphisme", "DEC Graphisme", "cegep", "Arts, design, communication", "Autre", 68),
  p("dec-cinema", "DEC Techniques de cinéma et de vidéo", "cegep", "Arts, design, communication", "Autre", 64),
  p("dec-media", "DEC Techniques de communication médiatique", "cegep", "Arts, design, communication", "Représentant(e) commercial", 66),
  p("dec-photo", "DEC Photographie", "cegep", "Arts, design, communication", "Autre", 60),
  p("dec-musique", "DEC Musique", "cegep", "Arts, design, communication", "Autre", 58),
  p("bac-design", "Baccalauréat en design graphique", "bachelor", "Arts, design, communication", "Autre", 70),
  p("bac-comm", "Baccalauréat en communication", "bachelor", "Arts, design, communication", "Représentant(e) commercial", 68),
  p("bac-arts", "Baccalauréat en beaux-arts", "bachelor", "Arts, design, communication", "Autre", 58),
  p("bac-journalisme", "Baccalauréat en journalisme", "bachelor", "Arts, design, communication", "Autre", 62),
  p("master-design", "Maîtrise en design", "master", "Arts, design, communication", "Autre", 64),
  p("master-comm", "Maîtrise en communication", "master", "Arts, design, communication", "Représentant(e) commercial", 66),

  p("dec-sh", "DEC Sciences humaines", "cegep", "Sciences humaines et sociales", "Autre", 64),
  p("dec-interv", "DEC Techniques d’intervention en loisir", "cegep", "Sciences humaines et sociales", "Autre", 66),
  p("bac-psycho", "Baccalauréat en psychologie", "bachelor", "Sciences humaines et sociales", "Autre", 70),
  p("bac-socio", "Baccalauréat en sociologie", "bachelor", "Sciences humaines et sociales", "Autre", 62),
  p("bac-anthro", "Baccalauréat en anthropologie", "bachelor", "Sciences humaines et sociales", "Autre", 60),
  p("bac-histoire", "Baccalauréat en histoire", "bachelor", "Sciences humaines et sociales", "Enseignant(e)", 62),
  p("bac-geo", "Baccalauréat en géographie", "bachelor", "Sciences humaines et sociales", "Autre", 64),
  p("bac-sc-po", "Baccalauréat en science politique", "bachelor", "Sciences humaines et sociales", "Autre", 66),
  p("master-psycho", "Maîtrise en psychologie", "master", "Sciences humaines et sociales", "Autre", 74),
  p("master-sc-po", "Maîtrise en science politique", "master", "Sciences humaines et sociales", "Autre", 64),
  p("phd-psycho", "Doctorat en psychologie", "doctorate", "Sciences humaines et sociales", "Autre", 70),

  p("dec-logistique", "DEC Logistique du transport", "cegep", "Transport, logistique", "Chauffeur", 76),
  p("dec-camion", "DEP / AEC Transport par camion", "cegep", "Transport, logistique", "Chauffeur", 80),
  p("dec-pilotage", "DEC Techniques de pilotage d’aéronefs", "cegep", "Transport, logistique", "Autre", 70),
  p("dec-navire", "DEC Navigation", "cegep", "Transport, logistique", "Autre", 68),
  p("bac-logistique", "Baccalauréat en logistique", "bachelor", "Transport, logistique", "Représentant(e) commercial", 74),
  p("bac-supply", "Baccalauréat en gestion de la chaîne d’approvisionnement", "bachelor", "Transport, logistique", "Analyste financier", 76),
  p("master-logistique", "Maîtrise en logistique et transport", "master", "Transport, logistique", "Analyste financier", 70),

  p("dec-agri", "DEC Gestion et technologies d’entreprise agricole", "cegep", "Agriculture, ressources naturelles", "Autre", 72),
  p("dec-horti", "DEC Paysage et commercialisation de produits horticoles", "cegep", "Agriculture, ressources naturelles", "Autre", 70),
  p("dec-foret", "DEC Aménagement de la forêt", "cegep", "Agriculture, ressources naturelles", "Autre", 74),
  p("dec-mines", "DEC Technologie minérale", "cegep", "Agriculture, ressources naturelles", "Ingénieur", 76),
  p("bac-agro", "Baccalauréat en agronomie", "bachelor", "Agriculture, ressources naturelles", "Autre", 72),
  p("bac-foret", "Baccalauréat en sciences forestières", "bachelor", "Agriculture, ressources naturelles", "Autre", 70),
  p("bac-mines", "Baccalauréat en génie des mines", "bachelor", "Agriculture, ressources naturelles", "Ingénieur", 78),
  p("master-agro", "Maîtrise en sciences agricoles", "master", "Agriculture, ressources naturelles", "Autre", 66),
  p("phd-agro", "Doctorat en sciences agricoles", "doctorate", "Agriculture, ressources naturelles", "Autre", 60),

  p("dec-vente", "DEC Représentation commerciale", "cegep", "Commerce, vente", "Représentant(e) commercial", 72),
  p("dec-marketing", "DEC Conseil en assurances et services financiers", "cegep", "Commerce, vente", "Représentant(e) commercial", 70),
  p("dec-ecomm", "DEC Commerce électronique", "cegep", "Commerce, vente", "Représentant(e) commercial", 74),
  p("bac-marketing", "Baccalauréat en marketing", "bachelor", "Commerce, vente", "Représentant(e) commercial", 74),
  p("bac-commerce-int", "Baccalauréat en commerce international", "bachelor", "Commerce, vente", "Représentant(e) commercial", 72),
  p("bac-ventes", "Baccalauréat en gestion des ventes", "bachelor", "Commerce, vente", "Représentant(e) commercial", 70),
  p("master-marketing", "Maîtrise en marketing", "master", "Commerce, vente", "Représentant(e) commercial", 68),
];

export function isStudyLevel(value: unknown): value is StudyLevel {
  return studyLevels.includes(value as StudyLevel);
}

export function studyProgramById(id: string) {
  return studyPrograms.find((program) => program.id === id);
}

export function studyProgramsForLevel(level: string) {
  if (!isStudyLevel(level)) return [];
  return studyPrograms.filter((program) => program.level === level);
}

export function foldStudyText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function searchStudyPrograms(query: string) {
  const needle = foldStudyText(query.trim());
  if (!needle) return studyPrograms;
  return studyPrograms.filter((program) => {
    const haystack = `${program.name} ${program.domain} ${studyLevelLabels[program.level]} ${program.profession}`;
    return foldStudyText(haystack).includes(needle);
  });
}

export function groupStudyPrograms(programs: StudyProgram[]) {
  const byDomain = new Map<string, StudyProgram[]>();
  for (const program of programs) {
    const list = byDomain.get(program.domain) ?? [];
    list.push(program);
    byDomain.set(program.domain, list);
  }
  return studyDomains
    .map((domain) => ({
      domain,
      programs: (byDomain.get(domain) ?? []).slice().sort((left, right) => {
        const level = studyLevels.indexOf(left.level) - studyLevels.indexOf(right.level);
        return level !== 0 ? level : left.name.localeCompare(right.name, "fr");
      }),
    }))
    .filter((group) => group.programs.length > 0);
}
