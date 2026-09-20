import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { nocByCode } from "@/data/noc-2021";
import { searchNoc } from "@/lib/noc-search";
import { cn } from "@/lib/utils";

function nocLabel(code: string) {
  const item = nocByCode(code);
  return item ? `CNP ${item.code} · FEER ${item.teer} · ${item.title}` : `CNP ${code}`;
}

export function NocSearchField({
  value,
  onChange,
  suggestionCode,
}: {
  value: string;
  onChange: (code: string) => void;
  suggestionCode?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchNoc(query, 8), [query]);
  const selected = nocByCode(value);
  const suggestion = !value && suggestionCode ? nocByCode(suggestionCode) : undefined;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function pick(code: string) {
    onChange(code);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="grid gap-1.5">
      {selected ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-secondary px-3 py-1 text-[12px] font-medium text-primary">
            {nocLabel(selected.code)}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border bg-white px-2.5 text-[12px] font-medium text-[#1a2332] transition hover:bg-[#f4f7fb]"
          >
            <X className="size-3.5" strokeWidth={2} />
            Effacer
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
          <Input
            value={query}
            placeholder="Titre d’emploi ou code CNP"
            className="h-8 pl-9"
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              setOpen(next.trim().length >= 2);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (results[0]) pick(results[0].code);
              }
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
          />
          {open ? (
            <div className="absolute top-[calc(100%+6px)] z-20 w-full overflow-hidden rounded-xl border border-[#d7e4f3] bg-white shadow-[0_14px_32px_rgba(15,23,42,.12)]">
              {results.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {results.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => pick(item.code)}
                        className={cn(
                          "flex w-full cursor-pointer px-3 py-2 text-left text-[12px] text-[#1a2332] transition hover:bg-[#f4f7fb]",
                        )}
                      >
                        {`CNP ${item.code} · FEER ${item.teer} · ${item.title}`}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-[12px] text-muted-foreground">Aucun CNP trouvé</p>
              )}
            </div>
          ) : null}
        </div>
      )}
      {suggestion ? (
        <p className="text-[11px] leading-snug text-muted-foreground">
          Suggestion métier: {`CNP ${suggestion.code} · FEER ${suggestion.teer} · ${suggestion.title}`}
        </p>
      ) : null}
    </div>
  );
}
