import { ChevronLeft, ChevronRight } from "lucide-react";
import { sections } from "@/catalog";
import { sectionViews } from "@/features/registry";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";

export function Stage() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const slideIndex = useDeckStore((s) => s.slideIndex);
  const direction = useDeckStore((s) => s.direction);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const section = sections[sectionIndex];
  const View = sectionViews[section.id];
  const hasSlides = section.slideCount > 1;
  const gutter = section.id !== "pitch";

  return (
    <section className="relative z-0 min-h-0 min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_70%_-10%,rgba(27,84,141,.07),transparent_38%)] bg-[#f4f7fb]" aria-live="polite">
      <div
        className={cn(
          "h-full min-h-0 min-w-0 overflow-y-auto overflow-x-clip [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          gutter && "px-3 md:px-6",
          hasSlides && "pb-4",
        )}
      >
        <div key={`${section.id}-${slideIndex}`} className={cn("slide-enter relative z-10 h-full min-h-0 min-w-0", direction === "left" && "from-left")}>
          <View />
        </div>
      </div>
      {hasSlides ? (
        <>
          {slideIndex > 0 ? (
            <button
              type="button"
              aria-label="Page précédente"
              onClick={prevSlide}
              className="absolute top-1/2 left-2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,.10)] transition hover:scale-[1.04] hover:text-primary md:grid"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : null}
          {slideIndex < section.slideCount - 1 ? (
            <button
              type="button"
              aria-label="Page suivante"
              onClick={nextSlide}
              className="absolute top-1/2 right-2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,.10)] transition hover:scale-[1.04] hover:text-primary md:grid"
            >
              <ChevronRight className="size-6" />
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
