import { useState } from "react";
import { cn } from "@/lib/utils";

export type CardItem = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageFallbacks?: string[];
};

export default function HoverRevealCards({
  items,
  className,
}: {
  items: CardItem[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <ul className={cn("place-strip", className)}>
      {items.map((item) => {
        const active = activeId === item.id;
        const dimmed = activeId !== null && !active;
        return (
          <li
            key={item.id}
            data-active={active ? "true" : undefined}
            className="rounded-[1.2rem] transition-all duration-500 ease-out"
          >
            <PlaceCard
              item={item}
              dimmed={dimmed}
              active={active}
              onActivate={() => setActiveId(item.id)}
              onDeactivate={() => setActiveId(null)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function PlaceCard({
  item,
  dimmed,
  active,
  onActivate,
  onDeactivate,
}: {
  item: CardItem;
  dimmed: boolean;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const sources = [item.imageUrl, ...(item.imageFallbacks ?? [])].filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = sources[Math.min(index, Math.max(sources.length - 1, 0))] ?? "";

  return (
    <button
      type="button"
      aria-label={`${item.title}, ${item.subtitle}`}
      className="absolute inset-0 h-full w-full cursor-pointer bg-ir-navy bg-cover bg-center text-left"
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        className={cn(
          "h-full w-full object-cover transition duration-500",
          dimmed && "scale-105 opacity-55 blur-[2px]",
          active && "scale-105",
        )}
        onError={() => {
          setIndex((current) => (current + 1 < sources.length ? current + 1 : current));
        }}
      />
      <span className="absolute inset-0 bg-linear-to-t from-ir-navy/80 via-ir-navy/15 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-3 text-white">
        <span className="block text-[11px] font-medium tracking-wide text-white/75 uppercase">
          {item.subtitle}
        </span>
        <span className="mt-0.5 block text-[15px] leading-tight font-semibold">{item.title}</span>
      </span>
    </button>
  );
}
