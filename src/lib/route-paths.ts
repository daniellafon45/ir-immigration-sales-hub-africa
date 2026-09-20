import { familyHasChildren, type Profile } from "@/data/profile";
import { routeBridges, routes } from "@/data/routes";

const OBJECTIVE_ROUTE: Record<string, string> = {
  "Résidence permanente": "ee",
  "Études": "study",
  "Travail": "work",
  "Visite": "visit",
  "Affaires": "business",
  "Regroupement familial": "family",
};

export function routeById(id: string) {
  return routes.find((route) => route.id === id) ?? routes[0];
}

export function routeForObjective(objective: string) {
  return routeById(OBJECTIVE_ROUTE[objective] ?? "ee");
}

export function bridgesFrom(routeId: string) {
  return routeBridges.filter((bridge) => bridge.from === routeId);
}

export function recommendedScenarioId(profile: Profile) {
  if (familyHasChildren(profile.family) || profile.objective === "Regroupement familial") return "D";
  if (profile.objective === "Études" || profile.objective === "Travail" || profile.objective === "Visite") return "B";
  if (profile.objective === "Résidence permanente") return "A";
  return "C";
}
