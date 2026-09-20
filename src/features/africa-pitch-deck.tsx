import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ProofDrawer } from "@/components/ui/proof-drawer";
import { SiteDrawer } from "@/components/ui/site-drawer";
import { IR_CTA, IR_SITE_LABEL, IR_SITE_URL } from "@/data/ecosystem";
import type { OpportunityThemeId } from "@/data/opportunity-proof";
import { pitchWelcomeTitle } from "@/data/pitch";
import {
  PITCH_CONTACT,
  type AfricaPitchSlide,
} from "@/data/pitch-africa";
import { defaultProfile, type Profile } from "@/data/profile";
import { opportunityPanel } from "@/lib/opportunity-panel";
import { pitchMosaicTheme } from "@/lib/pitch-mosaic-theme";
import { cn } from "@/lib/utils";

export function AfricaPitchDeck({
  slide,
  profile = defaultProfile,
}: {
  slide: AfricaPitchSlide;
  profile?: Profile;
}) {
  const dark =
    slide.layout === "africa-hero" ||
    slide.layout === "africa-traps" ||
    slide.layout === "africa-cta" ||
    slide.layout === "africa-promises";
  const shellPhoto =
    slide.backgroundImage ?? (slide.layout === "africa-promises" ? slide.image : undefined);
  const lightShellPhoto = Boolean(shellPhoto && !dark);

  return (
    <article
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden",
        dark ? "bg-[#0a1628] text-white" : "bg-[#f7fafc] text-[#10233f]",
      )}
    >
      {shellPhoto ? (
        <>
          <img
            src={shellPhoto}
            alt=""
            className="pointer-events-none absolute inset-0 size-full scale-105 object-cover object-[center_30%]"
          />
          {lightShellPhoto ? (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[#f7fafc]/65" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#f7fafc]/40 via-[#f7fafc]/55 to-[#f7fafc]/75" />
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[#0a1628]/36" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0a1628]/20 via-[#0a1628]/28 to-[#0a1628]/72" />
            </>
          )}
        </>
      ) : null}
      <BrandLogo
        inverted={dark}
        className="pointer-events-none absolute top-4 right-4 z-20 h-12 w-auto object-contain sm:top-5 sm:right-6 sm:h-14"
      />
      <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 py-4 sm:px-10 sm:py-5 lg:px-14">
        <SlideBody slide={slide} profile={profile} />
      </div>
      <p
        className={cn(
          "relative z-10 shrink-0 px-8 pb-5 text-[11px] tracking-wide sm:px-12 lg:px-16",
          dark ? "text-white/75" : "text-[#3d4f63]",
        )}
      >
        {PITCH_CONTACT}
      </p>
    </article>
  );
}

function SlideBody({ slide, profile }: { slide: AfricaPitchSlide; profile: Profile }) {
  switch (slide.layout) {
    case "africa-hero":
      return <AfricaHero slide={slide} />;
    case "africa-welcome":
      return <AfricaWelcome slide={slide} profile={profile} />;
    case "africa-trio":
      return <AfricaTrio slide={slide} />;
    case "africa-focus":
      return <AfricaFocus slide={slide} />;
    case "africa-mosaic":
      return <AfricaMosaic slide={slide} profile={profile} />;
    case "africa-traps":
      return <AfricaTraps slide={slide} />;
    case "africa-promises":
      return <AfricaPromises slide={slide} />;
    case "africa-proof":
      return <AfricaProof slide={slide} />;
    case "africa-links":
      return <AfricaLinks slide={slide} />;
    case "africa-journey":
      return <AfricaJourney slide={slide} />;
    case "africa-cta":
      return <AfricaCta slide={slide} />;
    default:
      return null;
  }
}

function Title({ title, light = false }: { title: string; light?: boolean }) {
  return (
    <h1
      className={cn(
        "max-w-[min(720px,calc(100%-3rem))] font-[family-name:var(--font-pitch)] text-[clamp(1.45rem,3.8vw,2.4rem)] leading-[1.05] font-bold tracking-tight uppercase",
        light ? "text-white" : "text-[#0d2744]",
      )}
    >
      {title}
    </h1>
  );
}

function AfricaHero({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="grid min-h-full gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
      <div className="flex flex-col justify-center py-4">
        <Title title={slide.title} light />
        {slide.lead ? (
          <p className="mt-5 max-w-[36ch] text-lg font-medium text-white drop-shadow-[0_1px_8px_rgba(10,22,40,.45)]">
            {slide.lead}
          </p>
        ) : null}
        {slide.bullets?.map((line) => (
          <p
            key={line}
            className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(10,22,40,.4)]"
          >
            {line}
          </p>
        ))}
        {slide.footer ? (
          <p className="mt-10 text-[12px] font-bold tracking-[0.18em] text-white uppercase drop-shadow-[0_1px_6px_rgba(10,22,40,.4)]">
            {slide.footer}
          </p>
        ) : null}
      </div>
      <div className="relative min-h-[220px] overflow-hidden rounded-[1.4rem] border border-white/10 lg:min-h-0">
        {slide.image ? <img src={slide.image} alt="" className="absolute inset-0 size-full object-cover" /> : null}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a1628]/55 via-transparent to-transparent" />
      </div>
    </div>
  );
}

function AfricaWelcome({ slide, profile }: { slide: AfricaPitchSlide; profile: Profile }) {
  return (
    <div className="relative flex min-h-full flex-col justify-center">
      {slide.image ? (
        <>
          <img
            src={slide.image}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover object-[center_40%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#f7fafc]/58" />
        </>
      ) : null}
      <div className="relative z-10 mx-auto flex w-full max-w-[52rem] flex-col items-center">
        <div className="w-full rounded-2xl bg-white/85 px-5 py-4 text-center shadow-[0_8px_28px_rgba(16,35,63,.08)] backdrop-blur-sm sm:px-8 sm:py-5">
          <h1 className="mx-auto max-w-[34ch] text-[clamp(1.35rem,3.2vw,2rem)] font-semibold leading-snug text-[#0d2744]">
            {pitchWelcomeTitle(profile)}
          </h1>
          {slide.lead ? (
            <p className="mx-auto mt-4 max-w-[62ch] text-[15px] leading-relaxed text-[#3d4f63]">{slide.lead}</p>
          ) : null}
        </div>
        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          {slide.cards?.map((card) => (
            <div key={card.title} className="flex overflow-hidden rounded-2xl border border-[#d9e4f0] bg-white text-left shadow-sm">
              {card.image ? (
                <img src={card.image} alt="" className="h-auto w-[38%] min-w-[7.5rem] object-cover" />
              ) : null}
              <div className="flex flex-1 flex-col justify-center p-4">
                <p className="font-[family-name:var(--font-pitch)] text-lg tracking-wide text-[#0d2744] uppercase">
                  {card.title}
                </p>
                <p className="mt-1 text-[13px] text-[#3d4f63]">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AfricaTrio({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="max-w-[48rem] rounded-2xl bg-white/88 px-5 py-4 shadow-[0_8px_28px_rgba(16,35,63,.08)] backdrop-blur-sm sm:px-6">
        <Title title={slide.title} />
        {slide.lead ? <p className="mt-4 max-w-[70ch] text-[15px] text-[#3d4f63]">{slide.lead}</p> : null}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {slide.cards?.map((card) => {
          const body = (
            <>
              {card.image ? <img src={card.image} alt="" className="h-36 w-full object-cover" /> : null}
              <div className="p-5">
                <p className="font-[family-name:var(--font-pitch)] text-lg tracking-wide uppercase">{card.title}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/90">{card.body}</p>
                {card.href ? (
                  <p className="mt-4 text-[11px] font-semibold text-white/95">
                    {card.href.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
                  </p>
                ) : null}
              </div>
            </>
          );
          return card.href ? (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-2xl bg-[#0d2744] text-white shadow-md transition hover:brightness-110"
            >
              {body}
            </a>
          ) : (
            <div key={card.title} className="overflow-hidden rounded-2xl bg-[#0d2744] text-white shadow-md">
              {body}
            </div>
          );
        })}
      </div>
      {slide.quote ? (
        <p className="mt-8 max-w-[40rem] rounded-xl bg-white/90 px-4 py-3 text-[15px] font-semibold text-[#0d2744] shadow-sm backdrop-blur-sm">
          {slide.quote}
        </p>
      ) : null}
      {slide.legal ? <p className="mt-2 text-xs font-medium text-[#3d4f63]">{slide.legal}</p> : null}
    </div>
  );
}

function AfricaFocus({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center lg:max-w-[34rem]">
      <div className="rounded-[1.4rem] bg-white/92 p-6 shadow-[0_12px_36px_rgba(16,35,63,.12)] backdrop-blur-md sm:p-8">
        <Title title={slide.title} />
        {slide.lead ? (
          <p className="mt-5 border-l-4 border-primary pl-4 text-lg font-medium leading-snug text-[#0d2744]">
            {slide.lead}
          </p>
        ) : null}
        <ul className="mt-8 space-y-3">
          {slide.items?.map((item, i) => (
            <li key={item.title} className="flex gap-3 text-[15px] font-medium text-[#1a2332]">
              <span className="font-[family-name:var(--font-pitch)] text-xl text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1">{item.title}</span>
            </li>
          ))}
        </ul>
        {slide.quote ? (
          <p className="mt-8 text-[14px] font-semibold text-primary">{slide.quote}</p>
        ) : null}
      </div>
    </div>
  );
}

function AfricaMosaic({ slide, profile }: { slide: AfricaPitchSlide; profile: Profile }) {
  const [openTheme, setOpenTheme] = useState<OpportunityThemeId | null>(null);
  const panel = openTheme ? opportunityPanel(openTheme, profile) : null;

  useEffect(() => {
    if (!openTheme) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenTheme(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openTheme]);

  return (
    <div className="relative flex min-h-full flex-col justify-center">
      <div className="max-w-[42rem] rounded-2xl bg-white/88 px-5 py-4 shadow-[0_8px_28px_rgba(16,35,63,.08)] backdrop-blur-sm sm:px-6">
        <Title title={slide.title} />
        {slide.lead ? <p className="mt-4 max-w-[62ch] text-[15px] text-[#3d4f63]">{slide.lead}</p> : null}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {slide.cards?.map((card, index) => {
          const theme = pitchMosaicTheme(card.title);
          const selected = theme !== null && openTheme === theme;
          return (
            <button
              key={card.title}
              type="button"
              disabled={!theme}
              aria-expanded={selected}
              onClick={() => {
                if (!theme) return;
                setOpenTheme(selected ? null : theme);
              }}
              className={cn(
                "relative min-h-[160px] overflow-hidden rounded-2xl text-left outline-none transition hover:ring-2 hover:ring-primary/35 focus-visible:ring-2 focus-visible:ring-primary/50",
                index === 0 || index === 3 ? "sm:min-h-[200px]" : "",
                selected && "ring-2 ring-primary/50",
              )}
            >
              {card.image ? <img src={card.image} alt="" className="absolute inset-0 size-full object-cover" /> : null}
              <div className="absolute inset-0 bg-linear-to-t from-[#0a1628] via-[#0a1628]/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-[family-name:var(--font-pitch)] text-xl tracking-wide uppercase">{card.title}</p>
                <p className="mt-1 text-[13px] text-white/85">{card.body}</p>
                <p className="mt-2 text-[11px] font-semibold text-white/95">Voir preuves →</p>
              </div>
            </button>
          );
        })}
      </div>
      {slide.quote ? (
        <p className="mt-3 max-w-[36rem] rounded-lg bg-white/90 px-3 py-2 text-[14px] font-semibold text-[#0d2744] shadow-sm backdrop-blur-sm">
          {slide.quote}
        </p>
      ) : null}
      {panel ? <ProofDrawer panel={panel} onClose={() => setOpenTheme(null)} /> : null}
    </div>
  );
}

function AfricaTraps({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="grid min-h-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
      <div>
        <Title title={slide.title} light />
        {slide.lead ? (
          <p className="mt-4 text-[15px] font-medium text-white/90 drop-shadow-[0_1px_6px_rgba(10,22,40,.35)]">
            {slide.lead}
          </p>
        ) : null}
        <ol className="mt-8 space-y-5">
          {slide.items?.map((item, i) => (
            <li key={item.title} className="border-b border-white/15 pb-4">
              <p className="font-[family-name:var(--font-pitch)] text-2xl text-[#e31c23]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[16px] font-semibold text-white">{item.title}</p>
              {item.body ? <p className="mt-1 text-[13px] text-white/80">{item.body}</p> : null}
            </li>
          ))}
        </ol>
        {slide.quote ? (
          <p className="mt-8 rounded-xl bg-[#0a1628]/45 px-4 py-3 text-[18px] font-semibold leading-snug text-[#e31c23] backdrop-blur-sm sm:text-[20px]">
            {slide.quote}
          </p>
        ) : null}
      </div>
      <div className="relative min-h-[260px] overflow-hidden rounded-[1.4rem]">
        {slide.image ? <img src={slide.image} alt="" className="absolute inset-0 size-full object-cover" /> : null}
        <div className="absolute inset-0 bg-[#0a1628]/35" />
      </div>
    </div>
  );
}

function AfricaPromises({ slide }: { slide: AfricaPitchSlide }) {
  const yes = slide.items?.slice(0, 4) ?? [];
  const no = slide.items?.slice(4) ?? [];
  return (
    <div className="flex min-h-full flex-col justify-center gap-6">
      <div>
        <Title title={slide.title} light />
        {slide.lead ? (
          <p className="mt-4 max-w-[42ch] border-l-4 border-[#7eb6e8] pl-4 text-[16px] font-medium leading-snug text-white drop-shadow-[0_1px_8px_rgba(10,22,40,.45)]">
            {slide.lead}
          </p>
        ) : null}
      </div>
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-linear-to-br from-primary to-ir-deep p-6 text-white shadow-[0_16px_40px_rgba(10,22,40,.35)] sm:p-7">
          <p className="font-[family-name:var(--font-pitch)] text-[13px] tracking-[0.16em] text-white/85 uppercase">
            Nous promettons
          </p>
          <ul className="mt-5 flex-1 space-y-4">
            {yes.map((item) => (
              <li key={item.title} className="flex items-start gap-3 text-[15px] leading-snug">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/15">
                  <Check className="size-3.5" strokeWidth={2.75} />
                </span>
                <span className="pt-0.5 font-medium">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-full flex-col rounded-[1.4rem] border border-white/25 bg-white/95 p-6 shadow-[0_12px_32px_rgba(10,22,40,.2)] backdrop-blur-sm sm:p-7">
          <p className="font-[family-name:var(--font-pitch)] text-[13px] tracking-[0.16em] text-[#5b6b7c] uppercase">
            Nous ne promettons pas
          </p>
          <ul className="mt-5 flex-1 space-y-4">
            {no.map((item) => (
              <li key={item.title} className="flex items-start gap-3 text-[15px] leading-snug text-[#1a2332]">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
                  <X className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="pt-0.5 font-medium">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {(slide.quote || slide.legal) && (
        <div className="rounded-xl bg-[#0a1628]/55 px-4 py-3 backdrop-blur-sm sm:px-5">
          {slide.quote ? (
            <p className="font-[family-name:var(--font-pitch)] text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug font-semibold tracking-tight text-white">
              {slide.quote}
            </p>
          ) : null}
          {slide.legal ? <p className="mt-2 text-xs text-white/80">{slide.legal}</p> : null}
        </div>
      )}
    </div>
  );
}

function AfricaProof({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="max-w-[48rem] rounded-2xl bg-white/88 px-5 py-4 shadow-[0_8px_28px_rgba(16,35,63,.08)] backdrop-blur-sm sm:px-6">
        <Title title={slide.title} />
        {slide.lead ? <p className="mt-4 max-w-[62ch] text-[15px] text-[#3d4f63]">{slide.lead}</p> : null}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {slide.stats?.map((stat) => (
          <div
            key={stat.label}
            className="overflow-hidden rounded-2xl border border-[#d9e4f0] bg-white/95 shadow-sm backdrop-blur-sm"
          >
            <div className="grid sm:grid-cols-[5.5rem_minmax(0,1fr)]">
              {stat.image ? (
                <img src={stat.image} alt="" className="h-24 w-full object-cover sm:h-full sm:min-h-[120px]" />
              ) : (
                <div className="bg-[#e8f0f8]" />
              )}
              <div className="flex flex-col justify-center p-4">
                <p className="font-[family-name:var(--font-pitch)] text-[42px] leading-none text-primary">{stat.value}</p>
                <p className="mt-2 text-[14px] font-semibold text-[#0d2744]">{stat.label}</p>
                <p className="mt-1 text-[12px] text-[#3d4f63]">{stat.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slide.quote ? (
        <p className="mt-8 max-w-[40rem] rounded-xl bg-white/90 px-4 py-3 text-[15px] font-semibold text-[#0d2744] shadow-sm backdrop-blur-sm">
          {slide.quote}
        </p>
      ) : null}
      {slide.legal ? <p className="mt-2 text-xs font-medium text-[#3d4f63]">{slide.legal}</p> : null}
    </div>
  );
}

function AfricaLinks({ slide }: { slide: AfricaPitchSlide }) {
  const [openUrl, setOpenUrl] = useState<string | null>(null);
  const openCard = slide.cards?.find((card) => card.href === openUrl);

  useEffect(() => {
    if (!openUrl) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenUrl(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openUrl]);

  return (
    <div className="relative flex min-h-full flex-col justify-center">
      <div className="max-w-[48rem] rounded-2xl bg-white/88 px-5 py-4 shadow-[0_8px_28px_rgba(16,35,63,.08)] backdrop-blur-sm sm:px-6">
        <Title title={slide.title} />
        {slide.lead ? <p className="mt-4 text-[15px] text-[#3d4f63]">{slide.lead}</p> : null}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {slide.cards?.map((card) => (
          <button
            key={card.title}
            type="button"
            aria-expanded={openUrl === card.href}
            onClick={() => {
              if (card.href) setOpenUrl(card.href);
            }}
            className="group overflow-hidden rounded-2xl border border-[#d9e4f0] bg-white/95 text-left shadow-sm backdrop-blur-sm transition hover:border-primary/40"
          >
            {card.image ? <img src={card.image} alt="" className="h-36 w-full object-cover" /> : null}
            <div className="p-4">
              <p className="font-semibold text-[#0d2744] group-hover:text-primary">{card.title}</p>
              <p className="mt-1 text-[13px] text-[#3d4f63]">{card.body}</p>
              {card.href ? (
                <p className="mt-3 text-[11px] font-semibold text-primary">
                  {card.href.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
                </p>
              ) : null}
            </div>
          </button>
        ))}
      </div>
      {openUrl && openCard ? (
        <SiteDrawer url={openUrl} title={openCard.title} onClose={() => setOpenUrl(null)} />
      ) : null}
    </div>
  );
}

function AfricaJourney({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="max-w-[42rem] rounded-2xl bg-white/90 px-5 py-4 shadow-[0_8px_28px_rgba(16,35,63,.1)] backdrop-blur-sm sm:px-6 sm:py-5">
        <Title title={slide.title} />
        {slide.lead ? <p className="mt-4 text-[15px] text-[#3d4f63]">{slide.lead}</p> : null}
        <div className="mt-6 space-y-0">
          {slide.items?.map((item, i) => (
            <div
              key={item.title}
              className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3 border-l-2 border-primary/30 py-3 pl-5"
            >
              <p className="font-[family-name:var(--font-pitch)] text-2xl text-primary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="font-[family-name:var(--font-pitch)] text-sm tracking-wide uppercase text-[#0d2744]">
                  {item.title}
                </p>
                {item.body ? <p className="mt-1 text-[13px] text-[#3d4f63]">{item.body}</p> : null}
              </div>
            </div>
          ))}
        </div>
        {slide.quote ? (
          <p className="mt-6 text-[15px] font-semibold text-[#0d2744]">{slide.quote}</p>
        ) : null}
      </div>
    </div>
  );
}

function AfricaCta({ slide }: { slide: AfricaPitchSlide }) {
  return (
    <div className="grid min-h-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:items-center">
      <div>
        <Title title={slide.title} light />
        {slide.lead ? <p className="mt-5 text-base text-white/80">{slide.lead}</p> : null}
        <ol className="mt-8 space-y-4">
          {slide.items?.map((item, i) => (
            <li key={item.title} className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-pitch)] text-2xl text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium text-white/90">{item.title}</span>
            </li>
          ))}
        </ol>
        <a
          href={IR_SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-primary hover:bg-white/90"
        >
          {IR_CTA}
        </a>
      </div>
      <div className="space-y-4">
        <div className="relative min-h-[180px] overflow-hidden rounded-3xl">
          {slide.image ? <img src={slide.image} alt="" className="absolute inset-0 size-full object-cover" /> : null}
          <div className="absolute inset-0 bg-[#0a1628]/35" />
        </div>
        <div className="rounded-3xl bg-[#132a45] p-6 text-center text-white">
          <p className="font-[family-name:var(--font-pitch)] text-xl tracking-wide">{slide.footer}</p>
          {slide.qr ? (
            <img src={slide.qr} alt="QR code WhatsApp IR Immigration" className="mx-auto mt-5 size-36 rounded-xl bg-white p-2 sm:size-44" />
          ) : null}
          {slide.legal ? <p className="mt-4 text-xs text-white/70">{slide.legal}</p> : null}
          <a
            href={IR_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-white underline-offset-2 hover:underline"
          >
            {IR_SITE_LABEL}
          </a>
        </div>
      </div>
    </div>
  );
}
