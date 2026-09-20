import foyerHfNoir from "@/assets/ecosystem/life-foyer-hf-noir.jpg";
import type { CardItem } from "@/components/ui/cards";
import { pitchHeroLook, pitchHeroPeople } from "@/data/pitch";
import { familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";

const LIFE_FILES = import.meta.glob("../assets/ecosystem/life-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function lifeFile(scene: string, people: string, look: string) {
  const needle = `life-${scene}-${people}-${look}.jpg`;
  const match = Object.entries(LIFE_FILES).find(([path]) => {
    const normalized = path.replaceAll("\\", "/").split("?")[0];
    return normalized.endsWith(`/${needle}`) || normalized.endsWith(needle);
  });
  return match?.[1];
}

function pairPeopleOf(people: string) {
  return people === "hh" || people === "ff" ? people : "hf";
}

function soloPeopleOf(people: string) {
  return people === "homme" ? "homme" : "femme";
}

function resolveLife(scene: string, profile: Profile) {
  const people = pitchHeroPeople(profile);
  const look = pitchHeroLook(profile);
  const pair = pairPeopleOf(people);
  const solo = soloPeopleOf(people);
  const preferred = familyHasSpouse(profile.family) ? pair : solo;
  const lookFallback = look === "noir" ? "blanc" : "noir";
  return (
    lifeFile(scene, preferred, look) ??
    lifeFile(scene, pair, look) ??
    lifeFile(scene, "hf", look) ??
    lifeFile(scene, preferred, lookFallback) ??
    lifeFile(scene, "hf", lookFallback) ??
    lifeFile(scene, preferred, "noir") ??
    lifeFile(scene, "hf", "noir") ??
    foyerHfNoir
  );
}

function foyerImage(profile: Profile) {
  const look = pitchHeroLook(profile);
  const pair = pairPeopleOf(pitchHeroPeople(profile));
  if (familyHasChildren(profile.family) && familyHasSpouse(profile.family)) {
    return (
      lifeFile("family", pair, look) ??
      lifeFile("family", "hf", look) ??
      lifeFile("family", "hf", "noir") ??
      resolveLife("foyer", profile)
    );
  }
  return resolveLife("foyer", profile);
}

export function ecosystemLifeCards(profile: Profile): CardItem[] {
  const withChildren = familyHasChildren(profile.family);
  const fourth = withChildren
    ? { scene: "ecole", title: "L’école", subtitle: "Une suite" }
    : { scene: "ville", title: "La ville", subtitle: "Une suite" };

  return [
    { id: 1, title: "Foyer", subtitle: "Réuni", imageUrl: foyerImage(profile) },
    { id: 2, title: "Le métier", subtitle: "En place", imageUrl: resolveLife("travail", profile) },
    { id: 3, title: "Un toit", subtitle: "Dès l’arrivée", imageUrl: resolveLife("logement", profile) },
    { id: 4, title: fourth.title, subtitle: fourth.subtitle, imageUrl: resolveLife(fourth.scene, profile) },
    { id: 5, title: "Le quartier", subtitle: "Ancré", imageUrl: resolveLife("quartier", profile) },
    { id: 6, title: "Arrivés", subtitle: "Le projet tient", imageUrl: resolveLife("arrivee", profile) },
  ];
}
