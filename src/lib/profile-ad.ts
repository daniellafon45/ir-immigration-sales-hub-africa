import { professionPhotosFor } from "@/data/profession-photos";
import type { Profile } from "@/data/profile";
import { money } from "@/lib/format";
import { pitchView } from "@/lib/principal";

export type ProfileAd = {
  headline: string;
  body: string;
  prompt: string;
  image: string;
  alt: string;
};

export type ProfileAdInput = {
  profile: Profile;
  profession: string;
  province: string;
  score: number;
  median: number;
};

export function profileAdFor({
  profile,
  profession,
  province,
  score,
  median,
}: ProfileAdInput): ProfileAd {
  const name = pitchView(profile).firstName.trim();
  const pay = money(median);
  const photo = professionPhotosFor(profession)[0] ?? professionPhotosFor("Autre")[0];
  return {
    ...copyFor(profile, { profession, province, pay, name }),
    image: photo?.src ?? "",
    alt: `${profession} en ${province} · ${score}/100`,
  };
}

function copyFor(
  profile: Profile,
  vars: { profession: string; province: string; pay: string; name: string },
) {
  const { profession, province, pay, name } = vars;
  const who = name || "votre profil";
  if (profile.objective === "Visite") {
    return {
      headline: `${province} a un marché pour ${profession}. La visite n’ouvre pas ce droit.`,
      body: `Médian ${pay}. Pendant le séjour, ce n’est pas un droit de travailler.`,
      prompt: "Ensuite, on lit le terrain — pas un emploi.",
    };
  }
  if (profile.objective === "Affaires" && profile.businessPath === "visitor") {
    return {
      headline: `${province} se lit. Un visiteur d’affaires n’a pas un droit de travailler.`,
      body: `Médian ${pay} décrit le filet si le projet ne tient pas, pas un salaire promis.`,
      prompt: "Ensuite, on revient au projet, pas au marché salarié.",
    };
  }
  if (profile.objective === "Affaires") {
    return {
      headline: `${profession} en ${province} reste un filet, pas le projet.`,
      body: `Médian ${pay} si le projet ne tient pas. Le dossier, lui, doit prouver un projet crédible ici.`,
      prompt: "Ensuite, on voit ce que le métier paierait en plan B.",
    };
  }
  if (profile.objective === "Regroupement familial") {
    return {
      headline: `La réunification passe d’abord. ${province} sert après l’arrivée.`,
      body: `Médian ${pay} pour ${profession}. Ce salaire n’est pas un argument de parrainage.`,
      prompt: "Ensuite, on lit le marché après l’arrivée.",
    };
  }
  if (profile.objective === "Études") {
    return {
      headline: `Le métier visé en ${province} décide si le diplôme tient.`,
      body: `Médian ${pay} après les études. Le programme compte. Le marché, lui, décide si ${province} tient.`,
      prompt: "Ensuite, on voit les postes du métier visé.",
    };
  }
  if (profile.objective === "Travail") {
    return {
      headline: `${profession} en ${province} : le marché le plus aligné à ce permis.`,
      body: `Médian ${pay}. Un métier demandé ne crée pas un permis. Il faut relier ce score au dossier de ${who}.`,
      prompt: "Ensuite, on voit les postes qui correspondent.",
    };
  }
  return {
    headline: `${profession} en ${province} : c’est là que votre profil pèse le plus.`,
    body: `Médian ${pay}. Ce n’est pas une embauche promise. C’est le marché le plus aligné à ce dossier.`,
    prompt: "Ensuite, on voit les postes qui correspondent.",
  };
}
