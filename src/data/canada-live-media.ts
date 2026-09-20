import type { CardItem } from "@/components/ui/cards";
import { canadaPlacesFor } from "@/data/canada-places";
import emploiHero from "@/assets/canada-live/emploi-hero.jpg";
import emploiSante from "@/assets/canada-live/emploi-sante.jpg";
import emploiConstruction from "@/assets/canada-live/emploi-construction.jpg";
import emploiBureau from "@/assets/canada-live/emploi-bureau.jpg";
import emploiMetiers from "@/assets/canada-live/emploi-metiers.jpg";
import demoHero from "@/assets/canada-live/demo-hero.jpg";
import demoAines from "@/assets/canada-live/demo-aines.jpg";
import demoFamille from "@/assets/canada-live/demo-famille.jpg";
import demoSoins from "@/assets/canada-live/demo-soins.jpg";
import demoEcole from "@/assets/canada-live/demo-ecole.jpg";
import pontHero from "@/assets/canada-live/pont-hero.jpg";
import pontMetier from "@/assets/canada-live/pont-metier.jpg";
import pontVille from "@/assets/canada-live/pont-ville.jpg";
import pontEquipe from "@/assets/canada-live/pont-equipe.jpg";
import pontInstallation from "@/assets/canada-live/pont-installation.jpg";

const emploiGallery: CardItem[] = [
  { id: 1, title: "Santé", subtitle: "Soins et recrutement", imageUrl: emploiSante },
  { id: 2, title: "Construction", subtitle: "Chantiers ouverts", imageUrl: emploiConstruction },
  { id: 3, title: "Bureaux", subtitle: "Services et TI", imageUrl: emploiBureau },
  { id: 4, title: "Métiers", subtitle: "Métiers en demande", imageUrl: emploiMetiers },
];

const demoGallery: CardItem[] = [
  { id: 1, title: "Aînés", subtitle: "Un pays qui vieillit", imageUrl: demoAines },
  { id: 2, title: "Famille", subtitle: "Moins de naissances", imageUrl: demoFamille },
  { id: 3, title: "Soins", subtitle: "Besoin de relais", imageUrl: demoSoins },
  { id: 4, title: "École", subtitle: "La relève à bâtir", imageUrl: demoEcole },
];

const pontGallery: CardItem[] = [
  { id: 1, title: "Métier", subtitle: "Partir du profil", imageUrl: pontMetier },
  { id: 2, title: "Ville", subtitle: "Choisir la province", imageUrl: pontVille },
  { id: 3, title: "Équipe", subtitle: "Un projet accompagné", imageUrl: pontEquipe },
  { id: 4, title: "Installation", subtitle: "Arriver prêt", imageUrl: pontInstallation },
];

export function canadaLiveGallery(pageId: string): CardItem[] {
  if (pageId === "emploi") return emploiGallery;
  if (pageId === "demographie") return demoGallery;
  if (pageId === "pont") return pontGallery;
  return canadaPlacesFor();
}

export function canadaLiveHero(pageId: string): { place: string; image: string } {
  if (pageId === "emploi") return { place: "Marché du travail", image: emploiHero };
  if (pageId === "demographie") return { place: "Relève", image: demoHero };
  if (pageId === "pont") return { place: "Votre projet", image: pontHero };
  const [first] = canadaPlacesFor();
  return { place: first?.title ?? "Canada", image: first?.imageUrl ?? "" };
}

