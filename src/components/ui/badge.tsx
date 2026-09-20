import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "good" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-2 py-0.5 text-[9px] font-extrabold",
        tone === "good" ? "bg-[#ebf8ef] text-[#1e6b3d]" : "bg-[#eff2f6] text-[#657080]",
        className,
      )}
      {...props}
    />
  );
}
