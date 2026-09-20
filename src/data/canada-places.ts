import quebecFall from "@/assets/places/quebec-fall.jpg";
import quebecSpring from "@/assets/places/quebec-spring.jpg";
import quebecSummer from "@/assets/places/quebec-summer.jpg";
import quebecWinter from "@/assets/places/quebec-winter.jpg";
import montrealFall from "@/assets/places/montreal-fall.jpg";
import montrealSpring from "@/assets/places/montreal-spring.jpg";
import montrealSummer from "@/assets/places/montreal-summer.jpg";
import montrealWinter from "@/assets/places/montreal-winter.jpg";
import torontoFall from "@/assets/places/toronto-fall.jpg";
import torontoSpring from "@/assets/places/toronto-spring.jpg";
import torontoSummer from "@/assets/places/toronto-summer.jpg";
import torontoWinter from "@/assets/places/toronto-winter.jpg";
import banffFall from "@/assets/places/banff-fall.jpg";
import banffSpring from "@/assets/places/banff-spring.jpg";
import banffSummer from "@/assets/places/banff-summer.jpg";
import banffWinter from "@/assets/places/banff-winter.jpg";
import type { CardItem } from "@/components/ui/cards";
import { seasonFromDate, type Season } from "@/lib/season";

type PlaceCatalog = {
  id: number;
  title: string;
  subtitle: string;
  images: Record<Season, string>;
};

const FALLBACK_ORDER: Season[] = ["summer", "fall", "spring", "winter"];

const catalog: PlaceCatalog[] = [
  {
    id: 1,
    title: "Québec",
    subtitle: "Château Frontenac",
    images: {
      winter: quebecWinter,
      spring: quebecSpring,
      summer: quebecSummer,
      fall: quebecFall,
    },
  },
  {
    id: 2,
    title: "Montréal",
    subtitle: "Vieux-Port",
    images: {
      winter: montrealWinter,
      spring: montrealSpring,
      summer: montrealSummer,
      fall: montrealFall,
    },
  },
  {
    id: 3,
    title: "Toronto",
    subtitle: "Tour CN",
    images: {
      winter: torontoWinter,
      spring: torontoSpring,
      summer: torontoSummer,
      fall: torontoFall,
    },
  },
  {
    id: 4,
    title: "Banff",
    subtitle: "Lac Moraine",
    images: {
      winter: banffWinter,
      spring: banffSpring,
      summer: banffSummer,
      fall: banffFall,
    },
  },
];

export function canadaPlacesFor(date: Date = new Date()): CardItem[] {
  const season = seasonFromDate(date);
  return catalog.map((place) => ({
    id: place.id,
    title: place.title,
    subtitle: place.subtitle,
    imageUrl: place.images[season],
    imageFallbacks: FALLBACK_ORDER.filter((entry) => entry !== season).map((entry) => place.images[entry]),
  }));
}

export const canadaPlaces = canadaPlacesFor();
