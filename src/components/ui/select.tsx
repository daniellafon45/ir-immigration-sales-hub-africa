import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-shadow focus:border-[#93b4ff] focus:ring-3 focus:ring-primary/10",
        className,
      )}
      {...props}
    />
  );
}
