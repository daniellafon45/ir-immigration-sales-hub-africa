import { ExternalLink, X } from "lucide-react";
import { SectionLabel, Surface } from "@/features/market";
import type { ProofPanel } from "@/lib/country-compare-panel";
import { money } from "@/lib/format";

export function ProofDrawer({
  panel,
  onClose,
}: {
  panel: ProofPanel;
  onClose: () => void;
}) {
  const max = Math.max(...panel.chart.bars.map((bar) => bar.value), 1);
  return (
    <div className="absolute inset-0 z-20 flex justify-end">
      <button
        type="button"
        aria-label="Fermer le panneau"
        className="absolute inset-0 bg-ir-navy/25 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={panel.title}
        className="relative z-10 flex h-full w-full max-w-[28rem] flex-col overflow-y-auto border-l border-border bg-white shadow-[-12px_0_28px_rgba(26,35,50,.12)] @min-[40rem]:w-[48%]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-white/95 px-4 py-3 backdrop-blur">
          <div>
            <SectionLabel>Preuves</SectionLabel>
            <h3 className="mt-1 text-[16px] font-semibold text-[#1a2332]">{panel.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full border border-border text-[#1a2332] hover:bg-secondary"
            aria-label="Fermer"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-2 gap-2">
            {panel.stats.map((stat) => (
              <Surface key={stat.label} className="p-3">
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{stat.label}</p>
                <p className="mt-1 text-[13px] font-semibold leading-snug text-[#1a2332]">{stat.value}</p>
              </Surface>
            ))}
          </div>
          <div>
            <SectionLabel>{panel.chart.label}</SectionLabel>
            <div className="mt-2 grid gap-1.5">
              {panel.chart.bars.map((bar) => {
                const width = max > 0 ? (bar.value / max) * 100 : 0;
                const display =
                  panel.chart.unit === "CAD" ? money(bar.value) : String(Math.round(bar.value));
                return (
                  <div
                    key={bar.label}
                    className="grid grid-cols-[minmax(4.5rem,7.5rem)_minmax(0,1fr)_auto] items-center gap-2"
                  >
                    <span className="truncate text-[12px] text-[#4b5565]">{bar.label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-[#e8eef5]">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                    </div>
                    <strong className="text-right text-[12px] tabular-nums text-[#1a2332]">{display}</strong>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <SectionLabel>Presse</SectionLabel>
            <div className="mt-2 grid gap-2">
              {panel.articles.map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-[14px] border border-border bg-white transition hover:border-primary/30"
                >
                  <img src={article.image} alt="" className="h-24 w-full object-cover object-[center_28%]" />
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">{article.source}</p>
                      <p className="text-[11px] text-muted-foreground">{article.date}</p>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug font-semibold text-[#1a2332] group-hover:text-primary">
                      {article.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      Lire l’article
                      <ExternalLink className="size-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground">{panel.disclaimer}</p>
        </div>
      </aside>
    </div>
  );
}
