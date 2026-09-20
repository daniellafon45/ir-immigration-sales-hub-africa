import { sections } from "@/catalog";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FullscreenButton } from "@/components/layout/FullscreenButton";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";

export function SideNav() {
  const sectionIndex = useDeckStore((s) => s.sectionIndex);
  const goToSection = useDeckStore((s) => s.goToSection);

  return (
    <aside
      className="flex shrink-0 bg-white max-md:order-last max-md:h-[calc(3.6rem+env(safe-area-inset-bottom,0px))] max-md:w-full max-md:flex-row max-md:items-stretch max-md:border-t max-md:border-[#e7eaf0] max-md:pb-[env(safe-area-inset-bottom,0px)] md:h-auto md:w-14 md:flex-col md:border-r md:border-[#e7eaf0]"
      aria-label="Navigation principale"
    >
      <div className="hidden h-[62px] place-items-center md:grid">
        <BrandLogo className="size-10 rounded-lg" />
      </div>
      <nav className="flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-md:items-center max-md:px-1 md:flex-col md:overflow-x-hidden md:overflow-y-auto">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const active = index === sectionIndex;
          return (
            <div key={section.id} className="relative mx-auto my-0.5 max-md:mx-0 max-md:shrink-0">
              <button
                type="button"
                onClick={() => goToSection(index)}
                aria-label={section.label}
                className={cn(
                  "group relative mx-auto grid size-11 place-items-center rounded-[10px] text-[#7b8492] transition-colors duration-180",
                  active ? "bg-secondary text-primary" : "hover:bg-accent hover:text-primary",
                )}
              >
                {active ? (
                  <span className="absolute rounded bg-primary max-md:right-2 max-md:bottom-0.5 max-md:left-2 max-md:h-[3px] md:top-2 md:bottom-2 md:-left-[7px] md:h-auto md:w-[3px]" />
                ) : null}
                <Icon className="size-[18px]" strokeWidth={1.8} />
                <span className="pointer-events-none absolute top-1/2 left-[52px] z-50 hidden -translate-y-1/2 rounded-md bg-[#0b1f3a] px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
                  {section.label}
                </span>
              </button>
            </div>
          );
        })}
      </nav>
      <div className="grid shrink-0 place-items-center max-md:w-12 md:h-[54px] md:border-t md:border-[#eef1f5]">
        <FullscreenButton />
      </div>
    </aside>
  );
}
