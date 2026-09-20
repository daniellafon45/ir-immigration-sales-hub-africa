# Review package — Task 1 Canada Live themed media

No git. Workspace in-place.

## Scope

Files for this task only:

- src/data/canada-live-media.ts
- src/data/canada-live-media.test.ts
- src/assets/canada-live/*.jpg (15 unique jpegs, each > 20_000 bytes)

Not in this task: canada.tsx, canada-live.ts (Task 2). Extra fetch scripts deleted.

## Tests reported by implementer

`npm test -- src/data/canada-live-media.test.ts` — 20/20 passed.

## canada-live-media.ts

```ts
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
```

## canada-live-media.test.ts

See `src/data/canada-live-media.test.ts` on disk (raster existence, uniqueness SHA256, gallery titles/subtitles, heroes).

## Asset uniqueness (SHA256 prefix + size)

```
demo-aines.jpg               324754 a63e3d1581f2
demo-ecole.jpg               128309 82b263bcc829
demo-famille.jpg             304753 9285e10a97cb
demo-hero.jpg               1023325 2e355cff5f58
demo-soins.jpg               208552 d25dd2db0de1
emploi-bureau.jpg            630429 a5d21e26ecc4
emploi-construction.jpg      449387 d4c6ff9bb31a
emploi-hero.jpg              155776 0ed0bd103bf2
emploi-metiers.jpg           145792 70eda7ae930e
emploi-sante.jpg             260208 5a998f9752fe
pont-equipe.jpg              247011 5b5ed699c4b2
pont-hero.jpg                227009 c04b3f9e28c1
pont-installation.jpg        152202 ea0ebfb7b53a
pont-metier.jpg              237192 e7968e124d39
pont-ville.jpg               700932 da64a9eaeae1
count 15 unique 15
```

Visual check by controller: emploi-sante = médecin; demo-aines = portrait aînée; demo-hero = aînée au déambulateur; pont-ville = Toronto; emploi gallery = construction workers, office, trades; no Château Frontenac on emploi files.
