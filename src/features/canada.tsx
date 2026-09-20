import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { canadaLivePagesFor, type CanadaLivePage } from "@/data/canada-live";
import { ALL_CANADA, canadaLivePlaceOptions, isAllCanada } from "@/data/canada-live-place";
import { professionNoc } from "@/data/profession-noc";
import { canadaLiveBanner } from "@/data/section-banners";
import { type Profile } from "@/data/profile";
import { NocSearchField } from "@/features/noc-search-field";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

const livePlace = { current: ALL_CANADA };

export function CanadaSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const setProject = useProfileStore((s) => s.setProject);
  const goTo = useDeckStore((s) => s.goToSectionId);
  const didPrefillWorkNoc = useRef(false);
  const [place, setPlace] = useState(() => livePlace.current);

  useEffect(() => {
    if (profile.objective !== "Travail") {
      didPrefillWorkNoc.current = false;
      return;
    }
    if (didPrefillWorkNoc.current) return;
    if (profile.workNocCode.trim()) {
      didPrefillWorkNoc.current = true;
      return;
    }
    const suggested = professionNoc(profile.applicant.profession);
    if (!suggested) return;
    didPrefillWorkNoc.current = true;
    setProject("workNocCode", suggested);
  }, [profile.objective, profile.workNocCode, profile.applicant.profession, setProject]);

  const pages = canadaLivePagesFor(profile, place);
  const page = pages[slide] ?? pages[0];
  const briefingProfile = isAllCanada(place) ? profile : { ...profile, province: place };

  return (
    <CanadaLiveView
      page={page}
      profile={briefingProfile}
      place={place}
      onGo={goTo}
      onWorkNocChange={(code) => setProject("workNocCode", code)}
      onProvinceChange={(province) => {
        livePlace.current = province;
        setPlace(province);
        if (!isAllCanada(province)) setProject("province", province);
      }}
    />
  );
}

function CanadaLiveView({
  page,
  profile,
  place,
  onGo,
  onWorkNocChange,
  onProvinceChange,
}: {
  page: CanadaLivePage;
  profile: Profile;
  place: string;
  onGo: (id: string) => void;
  onWorkNocChange: (code: string) => void;
  onProvinceChange: (province: string) => void;
}) {
  return (
    <PageShell
      panel={<CanadaBriefingPanel page={page} profile={profile} onGo={onGo} />}
    >
          <header className="relative shrink-0 overflow-hidden rounded-[1.2rem] bg-primary px-4 py-4 text-white sm:px-6 sm:py-6">
            <img src={canadaLiveBanner(page.id)} alt="" className="absolute inset-0 size-full object-cover object-[80%_center]" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
            <BrandLogo className="absolute top-3 right-3 z-10 size-11 rounded-lg ring-1 ring-white/20 sm:top-4 sm:right-4 sm:size-12" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pr-14 sm:pr-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">{page.kicker}</p>
                <h1 className="mt-1 text-[24px] leading-tight font-semibold tracking-tight">{smart(page.title, profile)}</h1>
                <p className="mt-1 max-w-[62ch] text-[13px] text-white/70">{smart(page.lead, profile)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {page.pills.map((pill) => (
                  <MetaPill key={pill}>{smart(pill, profile)}</MetaPill>
                ))}
              </div>
            </div>
          </header>

          {profile.objective === "Travail" ? (
            <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
              <p className="text-[12px] font-semibold text-[#1a2332]">Emploi visé</p>
              <div className="mt-2">
                <NocSearchField
                  value={profile.workNocCode}
                  onChange={onWorkNocChange}
                  suggestionCode={professionNoc(profile.applicant.profession)}
                />
              </div>
            </Surface>
          ) : null}

          <div
            className="shrink-0 ir-equal-row"
            style={{ ["--ir-equal-min" as string]: "8rem" }}
          >
            <Surface className="p-3 sm:px-4 sm:py-3">
              <p className="text-[12px] font-semibold text-[#1a2332]">Province visée</p>
              <Select
                aria-label="Province visée"
                className="mt-1 h-9 border-input px-2 text-[15px] font-semibold tracking-tight text-primary"
                value={place}
                onChange={(event) => onProvinceChange(event.target.value)}
              >
                {canadaLivePlaceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </Select>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                {isAllCanada(place) ? "vue nationale du plan IRCC" : "le projet se juge localement"}
              </p>
            </Surface>
            {page.stats.slice(0, 3).map((stat) => (
              <Surface key={stat.label} className="p-3 sm:px-4 sm:py-3">
                <p className="text-[12px] font-semibold text-[#1a2332]">{stat.label}</p>
                <p className="mt-1 text-[26px] leading-none font-semibold tracking-tight text-primary">{smart(stat.value, profile)}</p>
                <p className="mt-1.5 text-[12px] text-muted-foreground">{smart(stat.note, profile)}</p>
              </Surface>
            ))}
          </div>

          <div className="grid shrink-0 gap-3 @min-[40rem]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <Surface className="relative min-h-[12rem] overflow-hidden p-0 @min-[40rem]:min-h-[10.5rem]">
              <img src={page.heroImage} alt="" className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-0 bg-linear-to-t from-ir-navy/82 via-ir-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] font-medium tracking-wide text-white/75 uppercase">{page.heroPlace}</p>
                <p className="mt-0.5 text-[15px] leading-snug font-semibold">{page.heroCaption}</p>
              </div>
            </Surface>

            <Surface className="p-3 sm:px-4 sm:py-3">
              <SectionLabel>Presse récente</SectionLabel>
              <ul className="mt-2 space-y-2">
                {page.articles.map((article) => (
                  <li key={article.url}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group block rounded-xl border border-[#e5eaf0] bg-[#f7fafc] px-3 py-2.5 transition hover:border-primary/30 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                          {article.source}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{article.date}</p>
                      </div>
                      <p className="mt-1 text-[13px] leading-snug font-semibold text-[#1a2332] group-hover:text-primary">
                        {article.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                        Lire l'article
                        <ExternalLink className="size-3" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Surface>
          </div>
    </PageShell>
  );
}

function CanadaBriefingPanel({
  page,
  profile,
  onGo,
}: {
  page: CanadaLivePage;
  profile: Profile;
  onGo: (id: string) => void;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">À retenir</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{page.panelTitle}</p>
          <p className="mt-1 text-[14px] text-white/85">Pour votre projet</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>

      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {page.talks.map((talk) => (
          <PanelBlock key={talk.label} title={talk.label}>
            <p className="text-[14px] leading-relaxed text-white/90">{smart(talk.body, profile)}</p>
          </PanelBlock>
        ))}

        <PanelBlock title="La question">
          <p className="text-[14px] leading-snug font-medium text-white">{smart(page.ask, profile)}</p>
        </PanelBlock>
      </div>

      {page.actions?.length ? (
        <div className="mt-3 grid shrink-0 gap-2">
          {page.actions.map((action) => (
            <Button
              key={action.id}
              className="h-10 w-full rounded-xl bg-white text-primary hover:bg-secondary"
              onClick={() => onGo(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PanelBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white/10 p-2">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase">{title}</p>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

function Surface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[1.2rem] border border-[#e5eaf0] bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)] transition duration-200 hover:shadow-[0_14px_32px_rgba(15,23,42,.07)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[12px] font-semibold text-[#1a2332]">{children}</h2>;
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
      {children}
    </span>
  );
}
