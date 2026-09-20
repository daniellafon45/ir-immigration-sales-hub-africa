import { useEffect } from "react";
import { sections } from "@/catalog";
import { DeckFooter } from "@/components/layout/DeckFooter";
import { SideNav } from "@/components/layout/SideNav";
import { Stage } from "@/components/layout/Stage";
import { useDeckStore } from "@/store/deck";

export default function App() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const nextSection = useDeckStore((s) => s.nextSection);
  const prevSection = useDeckStore((s) => s.prevSection);
  const hasSlides = sections[sectionIndex].slideCount > 1;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowDown" && event.altKey) nextSection();
      if (event.key === "ArrowUp" && event.altKey) prevSection();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, nextSection, prevSection]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white md:flex-row">
      <SideNav />
      <main className="relative z-0 min-w-0 isolate flex min-h-0 flex-1 flex-col">
        <div className="h-[3px] shrink-0 bg-linear-to-r from-primary to-ir-blue2" />
        <Stage />
        {hasSlides ? <DeckFooter /> : null}
      </main>
    </div>
  );
}
