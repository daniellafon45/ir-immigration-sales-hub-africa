import { create } from "zustand";
import { sections } from "@/catalog";
import { nextCompareSelected } from "@/lib/compare-select";

type Direction = "left" | "right";

type DeckState = {
  sectionIndex: number;
  slideIndex: number;
  clientMode: boolean;
  selectedRoute: string;
  compareSelected: string[];
  direction: Direction;
  goToSection: (index: number) => void;
  goToSectionId: (id: string) => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  nextSection: () => void;
  prevSection: () => void;
  toggleClientMode: () => void;
  setRoute: (id: string) => void;
  toggleCompare: (id: string) => void;
};

export const useDeckStore = create<DeckState>((set, get) => ({
  sectionIndex: 0,
  slideIndex: 0,
  clientMode: false,
  selectedRoute: "ee",
  compareSelected: ["ee", "study", "pnp"],
  direction: "right",
  goToSection: (index) => {
    const next = Math.max(0, Math.min(sections.length - 1, index));
    set({ sectionIndex: next, slideIndex: 0, direction: "right" });
  },
  goToSectionId: (id) => {
    const index = sections.findIndex((section) => section.id === id);
    if (index >= 0) get().goToSection(index);
  },
  goToSlide: (index) => {
    const { sectionIndex, slideIndex } = get();
    const max = sections[sectionIndex].slideCount - 1;
    const next = Math.max(0, Math.min(max, index));
    set({ slideIndex: next, direction: next >= slideIndex ? "right" : "left" });
  },
  nextSlide: () => {
    const { sectionIndex, slideIndex } = get();
    const max = sections[sectionIndex].slideCount - 1;
    if (slideIndex < max) set({ slideIndex: slideIndex + 1, direction: "right" });
  },
  prevSlide: () => {
    const { slideIndex } = get();
    if (slideIndex > 0) set({ slideIndex: slideIndex - 1, direction: "left" });
  },
  nextSection: () => get().goToSection(get().sectionIndex + 1),
  prevSection: () => get().goToSection(get().sectionIndex - 1),
  toggleClientMode: () => set((state) => ({ clientMode: !state.clientMode })),
  setRoute: (id) => set({ selectedRoute: id }),
  toggleCompare: (id) =>
    set((state) => ({ compareSelected: nextCompareSelected(state.compareSelected, id) })),
}));
