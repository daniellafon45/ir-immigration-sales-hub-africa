import finance1 from "@/assets/professions/finance-1.jpg";
import tech1 from "@/assets/professions/tech-1.jpg";
import sante1 from "@/assets/professions/sante-1.jpg";
import metiers1 from "@/assets/professions/metiers-1.jpg";
import ingenierie1 from "@/assets/professions/ingenierie-1.jpg";
import education1 from "@/assets/professions/education-1.jpg";
import resto1 from "@/assets/professions/resto-1.jpg";
import transport1 from "@/assets/professions/transport-1.jpg";
import commerce1 from "@/assets/professions/commerce-1.jpg";
import autre1 from "@/assets/professions/autre-1.jpg";
import { professions } from "@/data/profile";

export type ProfessionPhoto = {
  src: string;
  alt: string;
};

const SETS: Record<string, string[]> = {
  Comptable: [finance1],
  "Analyste financier": [finance1],
  "Infirmier(ère)": [sante1],
  "Aide-soignant(e)": [sante1],
  "Développeur logiciel": [tech1],
  "Analyste en TI": [tech1],
  Électromécanicien: [metiers1],
  Électricien: [metiers1],
  "Technicien en maintenance": [metiers1],
  Ingénieur: [ingenierie1],
  "Enseignant(e)": [education1],
  "Cuisinier(ère)": [resto1],
  Chauffeur: [transport1],
  "Représentant(e) commercial": [commerce1],
  Autre: [autre1],
};

export function professionPhotosFor(profession: string, _sex?: string): ProfessionPhoto[] {
  const src = (SETS[profession] ?? SETS.Autre)[0];
  return src ? [{ src, alt: `${profession} au Canada` }] : [];
}

export function allProfessionPhotoSets() {
  return professions.map((profession) => ({
    profession,
    photos: professionPhotosFor(profession),
  }));
}
