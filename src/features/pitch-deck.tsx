import { BrandLogo } from "@/components/brand/BrandLogo";
import { IR_CTA, IR_SITE_LABEL, IR_SITE_URL } from "@/data/ecosystem";
import { defaultProfile, type Profile } from "@/data/profile";
import { PITCH_CONTACT, pitchDaysImage, pitchFormCards, pitchHeroLooks, pitchHeroPeople, pitchHeroScene, pitchHeroSources, pitchWelcomeTitle, type PitchSlide } from "@/data/pitch";
import { cn } from "@/lib/utils";

export function PitchDeck({ slide, profile = defaultProfile }: { slide: PitchSlide; profile?: Profile }) {
  const photo = slide.layout === "hero" || slide.layout === "split-left" || slide.layout === "split-right";
  const welcome = slide.layout === "welcome";
  const invertedLogo = photo;
  const heroSources =
    slide.id === 1
      ? pitchHeroSources(profile)
      : slide.id === 10
        ? [pitchDaysImage(profile)]
        : slide.image
          ? [slide.image]
          : [];
  const looks = pitchHeroLooks(profile);
  const heroKey = `${slide.id}-${pitchHeroScene(profile)}-${pitchHeroPeople(profile)}-${looks.applicant}-${looks.spouse}`;

  return (
    <article
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden",
        photo ? "bg-[#08111e] text-white" : welcome ? "bg-transparent text-[#10233f]" : "bg-white text-[#10233f]",
      )}
    >
      {slide.layout === "hero" && heroSources.length ? <HeroBackdrop src={heroSources} srcKey={heroKey} /> : null}
      <BrandLogo
        inverted={invertedLogo}
        className="pointer-events-none absolute top-4 right-4 z-20 h-12 w-auto object-contain sm:top-5 sm:right-6 sm:h-14"
      />
      <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 py-4 sm:px-10 sm:py-5 lg:px-14">
        <SlideBody slide={slide} profile={profile} />
      </div>
      <p
        className={cn(
          "relative z-10 shrink-0 px-8 pb-5 text-[11px] tracking-wide sm:px-12 lg:px-16",
          photo ? "text-white/70" : "text-[#5b6b7c]",
        )}
      >
        {PITCH_CONTACT}
      </p>
    </article>
  );
}

function HeroBackdrop({ src, srcKey }: { src: string[]; srcKey: string }) {
  return (
    <>
      <div className="absolute inset-0 flex">
        {src.map((item, index) => (
          <img
            key={`${srcKey}-${index}`}
            src={item}
            alt=""
            className="h-full min-w-0 flex-1 object-cover"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-[#08111e]/92 via-[#08111e]/55 to-transparent" />
    </>
  );
}

function PitchTitle({ title, light = false }: { title: string; light?: boolean }) {
  return (
    <h1
      className={cn(
        "max-w-[min(680px,calc(100%-3.25rem))] font-pitch text-[clamp(1.5rem,4.2vw,2.625rem)] leading-[1.02] font-bold tracking-tight uppercase sm:max-w-[min(680px,calc(100%-6.5rem))]",
        light ? "text-white" : "text-[#10233f]",
      )}
    >
      {formatTitle(title)}
    </h1>
  );
}

function formatTitle(title: string) {
  return title
    .replace("VOTRE PROJET CANADA COMMENCE ICI", "VOTRE PROJET\nCANADA COMMENCE ICI")
    .replace("VOUS NE CHERCHEZ PAS SEULEMENT UN VISA", "VOUS NE CHERCHEZ PAS\nSEULEMENT UN VISA")
    .replace(
      "LE CANADA CONTINUE D’ACCUEILLIR. LA SÉLECTION EST PLUS CIBLÉE.",
      "LE CANADA CONTINUE D’ACCUEILLIR.\nLA SÉLECTION EST PLUS CIBLÉE.",
    )
    .replace("POURQUOI TANT DE PROJETS SE COMPLIQUENT ?", "POURQUOI TANT DE PROJETS\nSE COMPLIQUENT ?")
    .replace("LA DIFFÉRENCE IR : 3 EXPERTISES, 1 SEUL PROJET DE VIE", "LA DIFFÉRENCE IR :\n3 EXPERTISES, 1 SEUL PROJET DE VIE")
    .replace("VOTRE PARCOURS, DE L’IDÉE À L’INSTALLATION", "VOTRE PARCOURS,\nDE L’IDÉE À L’INSTALLATION")
    .replace("UN STATUT N’EST PAS ENCORE UNE INTÉGRATION", "UN STATUT N’EST PAS\nENCORE UNE INTÉGRATION")
    .replace("VOTRE ARRIVÉE PEUT ÊTRE DÉJÀ ORGANISÉE", "VOTRE ARRIVÉE PEUT ÊTRE\nDÉJÀ ORGANISÉE")
    .replace("IMAGINEZ VOS 90 PREMIERS JOURS", "IMAGINEZ VOS\n90 PREMIERS JOURS")
    .replace(
      "CE QUE NOUS PROMETTONS. ET CE QUE NOUS NE PROMETTONS PAS.",
      "CE QUE NOUS PROMETTONS.\nET CE QUE NOUS NE PROMETTONS PAS.",
    )
    .replace("VOTRE CANADA PEUT PRENDRE PLUSIEURS FORMES", "VOTRE CANADA PEUT PRENDRE\nPLUSIEURS FORMES")
    .replace(
      "LE CANADA N’EST PAS UN RÊVE À ACHETER. C’EST UN PROJET À CONSTRUIRE.",
      "LE CANADA N’EST PAS UN RÊVE À ACHETER.\nC’EST UN PROJET À CONSTRUIRE.",
    )
    .replace("ENTAMONS VOTRE PROJET SANS PLUS TARDER", "ENTAMONS VOTRE PROJET\nSANS PLUS TARDER")
    .split("\n")
    .map((line, i) => (
      <span key={i} className="block">
        {line}
      </span>
    ));
}

function SlideBody({ slide, profile }: { slide: PitchSlide; profile: Profile }) {
  switch (slide.layout) {
    case "hero":
      return <HeroSlide slide={slide} />;
    case "welcome":
      return <WelcomeSlide slide={slide} title={pitchWelcomeTitle(profile)} />;
    case "split-right":
      return <SplitSlide slide={slide} photo="right" />;
    case "split-left":
      return <SplitSlide slide={slide} photo="left" />;
    case "stats":
      return <StatsSlide slide={slide} />;
    case "problems":
      return <ProblemsSlide slide={slide} />;
    case "pillars":
      return <PillarsSlide slide={slide} />;
    case "journey":
      return <JourneySlide slide={slide} />;
    case "doors":
      return <DoorsSlide slide={slide} />;
    case "promises":
      return <PromisesSlide slide={slide} />;
    case "forms":
      return <FormsSlide slide={slide} profile={profile} />;
    case "cta":
      return <CtaSlide slide={slide} />;
  }
}

function WelcomeSlide({ slide, title }: { slide: PitchSlide; title: string }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[52rem] flex-col items-center justify-center">
      <div className="w-full text-center">
        <h1 className="mx-auto max-w-[min(970px,calc(100%-3.5rem))] text-[clamp(1.5rem,4vw,2.625rem)] leading-[1.08] font-semibold tracking-tight text-[#10233f]">
          {title}
        </h1>
        {slide.lead ? (
          <p className="mx-auto mt-3 max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {slide.lead}
          </p>
        ) : null}
      </div>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {slide.cards?.map((card) => (
          <div
            key={card.title}
            className="relative min-h-[160px] overflow-hidden rounded-[1.2rem] bg-cover bg-center text-left sm:h-[200px]"
            style={card.image ? { backgroundImage: `url("${card.image}")` } : undefined}
          >
            <span className="absolute inset-0 bg-linear-to-t from-[#08111e]/78 via-[#08111e]/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <p className="text-[20px] font-semibold leading-tight">{card.title}</p>
              <p className="mt-0.5 text-[12px] text-white/80">{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSlide({ slide }: { slide: PitchSlide }) {
  return (
    <div className="flex min-h-full max-w-[640px] flex-col justify-center pr-4 sm:pr-10">
      <PitchTitle title={slide.title} light />
      {slide.lead ? <p className="mt-6 text-lg font-medium text-white/90">{slide.lead}</p> : null}
      {slide.bullets?.map((line) => (
        <p key={line} className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-white/80">
          {line}
        </p>
      ))}
      {slide.items ? (
        <ol className="mt-8 space-y-4">
          {slide.items.map((item, i) => (
            <li key={item.title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e31c23] text-sm font-bold">
                {i + 1}
              </span>
              <div>
                <p className="font-[family-name:var(--font-pitch)] text-lg tracking-wide uppercase">{item.title}</p>
                {item.body ? <p className="mt-1 text-sm text-white/75">{item.body}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
      {slide.footer ? (
        <p className="mt-10 text-[12px] font-bold tracking-[0.18em] text-white/80 uppercase">{slide.footer}</p>
      ) : null}
      {slide.legal ? <p className="mt-6 text-xs text-white/55">{slide.legal}</p> : null}
    </div>
  );
}

function SplitSlide({ slide, photo }: { slide: PitchSlide; photo: "left" | "right" }) {
  const copy = (
    <div className="flex min-h-0 flex-1 flex-col justify-center py-4 pr-6">
      <PitchTitle title={slide.title} light />
      {slide.lead ? <p className="mt-5 text-lg text-white/90">{slide.lead}</p> : null}
      {slide.bullets?.map((line) => (
        <p key={line} className="mt-4 text-[14px] leading-relaxed text-white/75">
          {line}
        </p>
      ))}
      {slide.items ? (
        <ul className="mt-6 space-y-2.5">
          {slide.items.map((item) => (
            <li key={item.title} className="flex items-start gap-3 text-[15px] text-white/90">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e31c23]" />
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {slide.quote ? <p className="mt-8 text-[15px] font-medium text-white">{slide.quote}</p> : null}
      {slide.legal ? <p className="mt-4 text-xs text-white/55">{slide.legal}</p> : null}
    </div>
  );
  const picture = slide.image ? (
    <div className="relative hidden min-h-0 w-[46%] shrink-0 overflow-hidden md:block">
      <img src={slide.image} alt="" className="absolute inset-0 size-full object-cover" />
    </div>
  ) : null;

  return (
    <div className="flex min-h-full gap-4 md:gap-8">
      {photo === "left" ? picture : null}
      {copy}
      {photo === "right" ? picture : null}
    </div>
  );
}

function StatsSlide({ slide }: { slide: PitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 max-w-[900px] text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {slide.stats?.map((stat) => (
          <div key={stat.value} className="grid overflow-hidden rounded-2xl bg-[#f3f7fb] sm:grid-cols-[150px_minmax(0,1fr)]">
            {stat.image ? (
              <div className="relative h-28 sm:min-h-[148px]">
                <img src={stat.image} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
            ) : null}
            <div className="flex flex-col justify-center px-5 py-4 sm:px-6 sm:py-5">
              <p className="font-[family-name:var(--font-pitch)] text-[40px] leading-none text-primary">{stat.value}</p>
              <p className="mt-3 text-sm font-medium text-[#10233f]">{stat.label}</p>
              <p className="mt-1 text-xs text-[#5b6b7c]">{stat.note}</p>
            </div>
          </div>
        ))}
      </div>
      {slide.quote ? <p className="mt-8 text-base font-semibold text-[#10233f]">{slide.quote}</p> : null}
      {slide.legal ? <p className="mt-3 text-[11px] text-[#8a96a4]">{slide.legal}</p> : null}
    </div>
  );
}

function ProblemsSlide({ slide }: { slide: PitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {slide.items?.map((item, i) => (
          <div
            key={item.title}
            className="grid overflow-hidden rounded-2xl border border-[#e6edf4] sm:grid-cols-[150px_minmax(0,1fr)]"
          >
            {item.image ? (
              <div className="relative h-28 sm:min-h-[148px]">
                <img src={item.image} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
            ) : null}
            <div className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
              <span className="font-[family-name:var(--font-pitch)] text-3xl text-primary">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-[#10233f]">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7c]">{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slide.quote ? <p className="mt-8 text-base font-semibold text-primary">{slide.quote}</p> : null}
    </div>
  );
}

function PillarsSlide({ slide }: { slide: PitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 max-w-[920px] text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {slide.cards?.map((card) => {
          const inner = (
            <>
              <p className="font-[family-name:var(--font-pitch)] text-xl tracking-wide">{card.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/85">{card.body}</p>
              {card.href ? (
                <p className="mt-4 text-[11px] font-semibold text-white/90">
                  {card.href.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
                </p>
              ) : null}
            </>
          );
          return card.href ? (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-primary px-6 py-8 text-white transition hover:brightness-110"
            >
              {inner}
            </a>
          ) : (
            <div key={card.title} className="rounded-2xl bg-primary px-6 py-8 text-white">
              {inner}
            </div>
          );
        })}
      </div>
      {slide.quote ? <p className="mt-8 text-base font-semibold">{slide.quote}</p> : null}
      {slide.legal ? <p className="mt-2 text-xs text-[#8a96a4]">{slide.legal}</p> : null}
    </div>
  );
}

function JourneySlide({ slide }: { slide: PitchSlide }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {slide.items?.map((item, i) => (
          <div key={item.title} className="rounded-2xl bg-[#f3f7fb] p-4">
            <p className="font-[family-name:var(--font-pitch)] text-2xl text-primary">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-3 font-[family-name:var(--font-pitch)] text-sm tracking-wide uppercase">{item.title}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5b6b7c]">{item.body}</p>
          </div>
        ))}
      </div>
      {slide.quote ? <p className="mt-8 text-sm font-medium text-[#10233f]">{slide.quote}</p> : null}
    </div>
  );
}

function DoorsSlide({ slide }: { slide: PitchSlide }) {
  const cards = slide.cards ?? [];
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {cards.slice(0, 3).map((card) => (
          <DoorCard key={card.title} card={card} />
        ))}
      </div>
      <div className="mx-auto mt-3 grid w-full max-w-full gap-3 sm:max-w-[72%] sm:grid-cols-2">
        {cards.slice(3).map((card) => (
          <DoorCard key={card.title} card={card} />
        ))}
      </div>
      {slide.legal ? <p className="mt-5 text-xs text-[#8a96a4]">{slide.legal}</p> : null}
    </div>
  );
}

function DoorCard({ card }: { card: NonNullable<PitchSlide["cards"]>[number] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#0d2744] text-white">
      {card.image ? <img src={card.image} alt="" className="h-20 w-full object-cover sm:h-24" /> : null}
      <div className="p-4">
        <p className="font-[family-name:var(--font-pitch)] text-[15px] tracking-wide">{card.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/75">{card.body}</p>
      </div>
    </div>
  );
}

function PromisesSlide({ slide }: { slide: PitchSlide }) {
  const yes = slide.items?.slice(0, 4) ?? [];
  const no = slide.items?.slice(4) ?? [];
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <PromiseCol title="NOUS PROMETTONS" items={yes} positive />
        <PromiseCol title="NOUS NE PROMETTONS PAS" items={no} positive={false} />
      </div>
      {slide.quote ? (
        <p className="mt-8 text-base font-medium text-[#10233f]">« {slide.quote} »</p>
      ) : null}
      {slide.legal ? <p className="mt-3 text-xs text-[#8a96a4]">{slide.legal}</p> : null}
    </div>
  );
}

function PromiseCol({
  title,
  items,
  positive,
}: {
  title: string;
  items: { title: string }[];
  positive: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e6edf4] p-5">
      <p className="font-[family-name:var(--font-pitch)] text-lg tracking-wide text-primary">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-3 text-sm">
            <span className={cn("mt-0.5 font-bold", positive ? "text-primary" : "text-[#e31c23]")}>
              {positive ? "✓" : "×"}
            </span>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormsSlide({ slide, profile }: { slide: PitchSlide; profile: Profile }) {
  const cards = pitchFormCards(profile);
  return (
    <div className="flex min-h-full flex-col justify-center">
      <PitchTitle title={slide.title} />
      {slide.lead ? <p className="mt-4 text-base text-[#5b6b7c]">{slide.lead}</p> : null}
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="relative min-h-[180px] overflow-hidden rounded-2xl sm:min-h-[220px]">
            {card.image ? <img src={card.image} alt="" className="absolute inset-0 size-full object-cover" /> : null}
            <div className="absolute inset-0 bg-linear-to-t from-[#08111e] via-transparent to-transparent" />
            <p className="absolute right-3 bottom-3 left-3 font-[family-name:var(--font-pitch)] text-lg tracking-wide text-white uppercase">
              {card.title}
            </p>
          </div>
        ))}
      </div>
      {slide.quote ? <p className="mt-5 text-sm font-medium text-[#10233f]">{slide.quote}</p> : null}
    </div>
  );
}

function CtaSlide({ slide }: { slide: PitchSlide }) {
  return (
    <div className="grid min-h-full items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,18rem)]">
      <div>
        <PitchTitle title={slide.title} />
        {slide.lead ? <p className="mt-5 text-base text-[#5b6b7c]">{slide.lead}</p> : null}
        <ol className="mt-8 space-y-4">
          {slide.items?.map((item, i) => (
            <li key={item.title} className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-pitch)] text-2xl text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium">{item.title}</span>
            </li>
          ))}
        </ol>
        <a
          href={IR_SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {IR_CTA}
        </a>
      </div>
      <div className="rounded-3xl bg-[#0d2744] p-6 text-center text-white">
        <p className="font-[family-name:var(--font-pitch)] text-xl tracking-wide">{slide.footer}</p>
        {slide.qr ? <img src={slide.qr} alt="QR code WhatsApp IR Immigration" className="mx-auto mt-5 size-40 rounded-xl bg-white p-2 sm:size-52" /> : null}
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
  );
}
