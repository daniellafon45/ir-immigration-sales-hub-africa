import { cn } from "@/lib/utils";
import logoIr from "@/assets/brand/logo-ir.png";
import logoIrBlanc from "@/assets/brand/logo-ir-blanc.png";

export function BrandLogo({
  className,
  alt = "IR Immigration Intégration",
  inverted = false,
}: {
  className?: string;
  alt?: string;
  inverted?: boolean;
}) {
  return (
    <img
      src={inverted ? logoIrBlanc : logoIr}
      alt={alt}
      className={cn("shrink-0 overflow-hidden object-cover", className)}
    />
  );
}

export function ModuleLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <BrandLogo
      inverted={inverted}
      className={cn(
        "pointer-events-none absolute top-4 right-4 z-10 size-[4.25rem] rounded-[1.05rem] shadow-[0_10px_24px_rgba(18,52,79,.18)] sm:top-6 sm:right-7 sm:size-[4.75rem]",
        inverted && "ring-2 ring-white/25",
        className,
      )}
    />
  );
}
