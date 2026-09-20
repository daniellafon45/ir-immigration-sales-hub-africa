import { sections } from "@/catalog";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";

export function DeckFooter() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const slideIndex = useDeckStore((s) => s.slideIndex);
  const goToSlide = useDeckStore((s) => s.goToSlide);
  const section = sections[sectionIndex];

  return (
    <footer className="relative z-0 flex h-11 shrink-0 items-center justify-center border-t border-[#e8ebf0] bg-white px-4 md:h-[52px]">
      <div className="flex items-center gap-3">
        <div className="flex max-w-[280px] gap-1 sm:max-w-[420px]">
          {Array.from({ length: section.slideCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1}`}
              onClick={() => goToSlide(i)}
              className={cn(
                "h-1.5 rounded-full bg-[#b9c1cc] transition-all duration-180",
                i === slideIndex ? "w-6 bg-primary" : "w-1.5",
              )}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#697386]">
          {slideIndex + 1} / {section.slideCount}
        </span>
      </div>
    </footer>
  );
}
