import type { ReactNode } from "react";
import { ModuleLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

export function Slide({
  kicker,
  title,
  lead,
  children,
  tone = "default",
}: {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  tone?: "default" | "dream" | "dark" | "soft";
}) {
  return (
    <article
      className={cn(
        "relative flex min-h-full items-center px-8 py-10 sm:px-12 lg:px-16",
        tone === "dream" && "bg-linear-to-br from-white to-[#f4f8fd]",
        tone === "dark" && "bg-linear-to-br from-ir-navy to-primary text-white",
        tone === "soft" && "bg-linear-to-br from-[#f8fbff] to-white",
      )}
    >
      <ModuleLogo inverted={tone === "dark"} />
      <div className="mx-auto w-full max-w-[1180px] pr-16 sm:pr-20">
        <p
          className={cn(
            "text-[11px] font-extrabold tracking-[0.22em] text-primary uppercase",
            tone === "dark" && "text-white/80",
          )}
        >
          {kicker}
        </p>
        <h1
          className={cn(
            "mt-3 max-w-[970px] text-[32px] leading-[1.08] font-semibold tracking-tight text-ir-navy sm:text-[40px] lg:text-[44px]",
            tone === "dark" && "text-white",
          )}
        >
          {title}
        </h1>
        {lead ? (
          <p
            className={cn(
              "mt-3 max-w-[850px] text-base leading-relaxed text-muted-foreground sm:text-lg",
              tone === "dark" && "text-white/80",
            )}
          >
            {lead}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </article>
  );
}

export function Quote({ children, large = false }: { children: ReactNode; large?: boolean }) {
  return (
    <blockquote
      className={cn(
        "rounded-r-xl border-l-4 border-primary bg-[#f1f6fc] px-5 py-4 text-[#24405f]",
        large ? "text-xl leading-relaxed" : "text-[15px] leading-relaxed",
      )}
    >
      {children}
    </blockquote>
  );
}

export function Timeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex gap-0 overflow-x-auto pb-2">
      {steps.map((step, index) => (
        <div key={step} className="relative min-w-[150px] pr-7">
          {index < steps.length - 1 ? (
            <span className="absolute top-[18px] right-0 left-10 h-px bg-[#c7d7ea]" />
          ) : null}
          <div className="relative z-1 grid size-9 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
            {index + 1}
          </div>
          <h4 className="mt-2.5 text-xs font-semibold">{step}</h4>
        </div>
      ))}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-extrabold tracking-[0.06em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
