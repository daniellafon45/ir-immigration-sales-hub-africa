import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  searchOccupations,
  type OccupationKind,
  resolveProfession,
  resolveSector,
} from "@/lib/occupation-resolve";
import { cn } from "@/lib/utils";

export function OccupationSearchField({
  label,
  value,
  kind,
  onChange,
  disabled,
  className,
}: {
  label: string;
  value: string;
  kind: OccupationKind;
  onChange: (resolved: string, typed: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchOccupations(query, kind, 8), [kind, query]);

  useEffect(() => {
    if (!focused) setQuery(value);
  }, [focused, value]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      commit(query);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, query]);

  function commit(raw: string) {
    const typed = raw.trim();
    setOpen(false);
    setFocused(false);
    if (!typed) {
      setQuery(value);
      return;
    }
    const resolved = kind === "profession" ? resolveProfession(typed) : resolveSector(typed);
    onChange(resolved, typed);
    setQuery(resolved === "Autre" ? typed : resolved);
  }

  function pick(label: string) {
    onChange(label, label);
    setQuery(label);
    setOpen(false);
    setFocused(false);
  }

  return (
    <div ref={rootRef} className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {disabled ? (
        <p className="flex h-8 items-center rounded-md border border-input bg-[#f7fafc] px-3 text-sm font-medium text-[#1a2332]">
          {value}
        </p>
      ) : (
        <div className="relative">
          <Input
            value={focused ? query : value}
            aria-label={label}
            autoComplete="off"
            className="h-8 bg-[#f7fafc] font-medium text-[#1a2332]"
            onFocus={() => {
              setFocused(true);
              setQuery(value);
              setOpen(true);
            }}
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                if (results[0] && query.trim().length >= 2) pick(results[0]);
                else commit(query);
              }
              if (event.key === "Escape") {
                event.preventDefault();
                setQuery(value);
                setOpen(false);
                setFocused(false);
              }
            }}
          />
          {open && focused ? (
            <div className="absolute top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-xl border border-[#d7e4f3] bg-white shadow-[0_14px_32px_rgba(15,23,42,.12)]">
              {results.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {results.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => pick(item)}
                        className="flex w-full cursor-pointer px-3 py-2 text-left text-[12px] text-[#1a2332] transition hover:bg-[#f4f7fb]"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commit(query)}
                  className="flex w-full cursor-pointer px-3 py-2 text-left text-[12px] text-[#1a2332] transition hover:bg-[#f4f7fb]"
                >
                  Utiliser « {query.trim()} »
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
