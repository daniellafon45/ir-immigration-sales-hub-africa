import { cn } from "@/lib/utils";
import logoIr from "@/assets/brand/logo-ir.png";

export function IrBlueSign({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <img
        src={logoIr}
        alt=""
        className="absolute inset-0 size-full object-cover object-[center_40%]"
      />
    </div>
  );
}
