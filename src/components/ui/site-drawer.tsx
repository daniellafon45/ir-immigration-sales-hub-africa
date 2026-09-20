import { ExternalLink, X } from "lucide-react";

function siteLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function SiteDrawer({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const label = siteLabel(url);
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
        aria-label={title}
        className="relative z-10 flex h-full w-full max-w-[40rem] flex-col overflow-hidden border-l border-border bg-white shadow-[-12px_0_28px_rgba(26,35,50,.12)] @min-[40rem]:w-[62%]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-white/95 px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[#1a2332]">{title}</p>
            <p className="truncate text-[12px] text-muted-foreground">{label}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-[12px] font-semibold text-[#1a2332] hover:bg-secondary"
            >
              Nouvel onglet
              <ExternalLink className="size-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full border border-border text-[#1a2332] hover:bg-secondary"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <iframe title={title} src={url} className="min-h-0 flex-1 border-0 bg-white" />
      </aside>
    </div>
  );
}
