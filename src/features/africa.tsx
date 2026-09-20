import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import logoIr from "@/assets/brand/logo-ir.png";
import { LeaderboardPodium } from "@/components/ui/leaderboard-podium";
import {
  IR_CTA,
  IR_CTA_SECONDARY,
  IR_FEES_NOTE,
  IR_SITE_LABEL,
  IR_SITE_URL,
  IR_WHATSAPP_LABEL,
  IR_WHATSAPP_URL,
  ecosystemPartners,
  ecosystemPillars,
  journeySteps,
} from "@/data/ecosystem";
import {
  competitorArchetypes,
  competitorCriteria,
  competitorPitch,
  scoreLabel,
  type CompetitorScore,
} from "@/data/competitors";
import {
  countryCompareAxes,
  countryCompareLead,
  countryCompareTitle,
} from "@/data/country-compare";
import type { CountryCompareAxisId } from "@/data/country-compare-proof";
import { failurePress, failureRisks } from "@/data/failures";
import { OPPORTUNITY_THEMES, type OpportunityThemeId } from "@/data/opportunity-proof";
import { sectionBanners } from "@/data/section-banners";
import { OpportunitiesShell, SalariesSection, SectionLabel, Surface } from "@/features/market";
import { countryComparePanel, type ProofPanel } from "@/lib/country-compare-panel";
import { money, moneyPair } from "@/lib/format";
import { CURRENCY_RATES_AS_OF, currencyForCountry } from "@/data/currencies";
import { householdLiving } from "@/lib/household-living";
import { householdMarket } from "@/lib/household-market";
import { opportunityPanel } from "@/lib/opportunity-panel";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function AfricaOpportunitiesSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
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

  const featured = OPPORTUNITY_THEMES.find((theme) => theme.id === "employment");
  const secondary = OPPORTUNITY_THEMES.filter((theme) => theme.id !== "employment");

  function themeButton(card: (typeof OPPORTUNITY_THEMES)[number], featuredCard: boolean) {
    const selected = openTheme === card.id;
    const fullWidth = card.id === "flexibility";
    return (
      <button
        key={card.id}
        type="button"
        aria-expanded={selected}
        onClick={() => setOpenTheme(selected ? null : card.id)}
        className={cn(
          "relative min-h-[148px] overflow-hidden rounded-[14px] text-left outline-none transition hover:ring-2 hover:ring-primary/35 focus-visible:ring-2 focus-visible:ring-primary/50",
          featuredCard && "min-h-[180px] @min-[36rem]:col-span-2",
          fullWidth && "@min-[36rem]:col-span-2 @min-[52rem]:col-span-3",
          selected && "ring-2 ring-primary/50",
        )}
      >
        <img src={card.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a1628] via-[#0a1628]/55 to-[#0a1628]/15" />
        <div className="relative flex h-full flex-col justify-end p-4 text-white">
          {featuredCard ? (
            <p className="text-[10px] font-bold tracking-wide text-white/80 uppercase">
              Opportunité centrale
            </p>
          ) : null}
          <h3
            className={cn(
              "font-semibold text-white",
              featuredCard ? "mt-1 text-[18px]" : "text-[15px]",
            )}
          >
            {card.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">{card.body}</p>
          <p className="mt-3 text-[11px] font-semibold text-white">Voir preuves →</p>
        </div>
      </button>
    );
  }

  return (
    <OpportunitiesShell
      kicker="Opportunités Canada"
      title="Le Canada, ce n’est pas seulement un visa. C’est un projet de réussite."
      lead={smart(
        "Études, emploi, qualité de vie et nationalité : {name} doit pouvoir se projeter avant de décider.",
        profile,
      )}
      pills={[market.family, market.province, profile.objective, profile.country]}
      hero={sectionBanners.opportunities}
      panel={panel ? <ProofAside panel={panel} onClose={() => setOpenTheme(null)} /> : undefined}
    >
      <div className="grid gap-3 @min-[36rem]:grid-cols-2 @min-[52rem]:grid-cols-3">
        {featured ? themeButton(featured, true) : null}
        {secondary.map((card) => themeButton(card, false))}
      </div>
    </OpportunitiesShell>
  );
}

function ProofAside({
  panel,
  onClose,
}: {
  panel: ProofPanel;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const max = Math.max(...panel.chart.bars.map((bar) => bar.value), 1);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [panel.title]);

  return (
    <aside
      ref={rootRef}
      role="dialog"
      aria-label={panel.title}
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.2rem] border border-border bg-white shadow-[0_12px_28px_rgba(26,35,50,.08)]"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <SectionLabel>Preuves</SectionLabel>
          <h3 className="mt-1 text-[16px] font-semibold text-[#1a2332]">{panel.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-[#1a2332] hover:bg-secondary"
          aria-label="Fermer"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
  );
}

export function CountryCompareSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const [openAxis, setOpenAxis] = useState<CountryCompareAxisId | null>(null);
  const panel = openAxis ? countryComparePanel(openAxis, profile) : null;
  const originLabel = profile.country.trim() || "Pays d’origine";

  useEffect(() => {
    if (!openAxis) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenAxis(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAxis]);

  return (
    <OpportunitiesShell
      kicker="Canada vs pays d’origine"
      title={countryCompareTitle(profile.country)}
      lead={countryCompareLead(profile.country)}
      pills={[profile.country || "Pays", market.province, profile.objective]}
      hero={sectionBanners.compare}
      panel={panel ? <ProofAside panel={panel} onClose={() => setOpenAxis(null)} /> : undefined}
    >
      <div className="grid gap-2.5">
        {countryCompareAxes.map((axis) => {
          const axisId = axis.id as CountryCompareAxisId;
          const selected = openAxis === axisId;
          return (
            <button
              key={axis.id}
              type="button"
              aria-expanded={selected}
              onClick={() => setOpenAxis(selected ? null : axisId)}
              className={cn(
                "group w-full text-left outline-none transition",
                "focus-visible:ring-2 focus-visible:ring-primary/40",
                selected && "ring-2 ring-primary/45",
              )}
            >
              <Surface className="px-4 py-3.5 transition group-hover:bg-[#f7fafc]">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-[family-name:var(--font-pitch)] text-[17px] tracking-[0.04em] text-[#0d2744] uppercase">
                    {axis.label}
                  </p>
                  <span className="shrink-0 text-[11px] font-semibold text-primary/80 transition group-hover:text-primary">
                    Voir preuves →
                  </span>
                </div>
                <div className="mt-3 grid gap-3 @min-[36rem]:grid-cols-2 @min-[36rem]:gap-8">
                  <div className="border-l-2 border-primary pl-3">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-primary uppercase">Canada</p>
                    <p className="mt-1 text-[13px] leading-snug text-[#1a2332]">{axis.canada}</p>
                  </div>
                  <div className="border-l-2 border-[#c5d0dc] pl-3">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-[#6b7c8f] uppercase">
                      {originLabel}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-[#4a5a6a]">{axis.origin}</p>
                  </div>
                </div>
              </Surface>
            </button>
          );
        })}
      </div>
    </OpportunitiesShell>
  );
}

export function PreuvesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  if (slide === 1) return <LivingProofSlide />;
  return <SalariesSection />;
}

function LivingProofSlide() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const living = householdLiving(profile);
  const hasLocal = Boolean(currencyForCountry(profile.country));
  return (
    <OpportunitiesShell
      kicker="Coût de la vie"
      title={smart("Que vaut ce salaire à {province} ?", profile)}
      lead="Un salaire n’existe pas tout seul. Il se mesure au loyer et aux dépenses du foyer."
      pills={[market.family, market.province, ...market.adults.map((a) => a.member.profession)]}
      hero={sectionBanners.calculators}
    >
      <div className="ir-auto-grid">
        {living.groups.map((group) => {
          const pair = moneyPair(group.netMonthly, profile.country);
          return (
            <Surface key={group.adult.role} className="p-4">
              <SectionLabel>
                {group.heading} · {group.adult.member.profession}
              </SectionLabel>
              <p className="mt-2 text-[22px] font-bold text-[#1a2332]">{pair.cad} / mois</p>
              {pair.local ? <p className="mt-0.5 text-[13px] text-muted-foreground">{pair.local}</p> : null}
              <p className="mt-1 text-[12px] text-muted-foreground">Net estimatif (démonstration)</p>
            </Surface>
          );
        })}
        {(() => {
          const rent = moneyPair(living.rent, profile.country);
          return (
            <Surface className="p-4">
              <SectionLabel>Loyer indicatif · {market.province}</SectionLabel>
              <p className="mt-2 text-[22px] font-bold text-[#1a2332]">{rent.cad} / mois</p>
              {rent.local ? <p className="mt-0.5 text-[13px] text-muted-foreground">{rent.local}</p> : null}
            </Surface>
          );
        })()}
        {(() => {
          const rest = moneyPair(living.remainder, profile.country);
          return (
            <Surface className="border-transparent bg-linear-to-br from-primary to-ir-deep p-4 text-white">
              <p className="text-[10px] font-semibold tracking-wide text-white/70 uppercase">Reste estimatif</p>
              <p className="mt-2 text-[26px] font-bold">{rest.cad}</p>
              {rest.local ? <p className="mt-0.5 text-[13px] text-white/75">{rest.local}</p> : null}
              <p className="mt-1 text-[12px] text-white/75">Après loyer et autres dépenses estimées</p>
            </Surface>
          );
        })()}
      </div>
      <p className="text-[12px] text-muted-foreground">
        Estimation de démonstration. Budget projet et honoraires détaillés en rendez-vous. {IR_FEES_NOTE}
        {hasLocal
          ? ` Conversion indicative (${CURRENCY_RATES_AS_OF}) selon le pays d’origine. Les montants officiels restent en dollars canadiens.`
          : ""}
      </p>
    </OpportunitiesShell>
  );
}

export function RisksSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const pressSample = failurePress.filter((a) => a.theme === "distress").slice(0, 2);
  return (
    <OpportunitiesShell
      kicker="Pièges & détresse"
      title="Les erreurs qui coûtent du temps, de l’argent et parfois plusieurs années."
      lead="Arriver sans plan, c’est payer le prix du Canada avant d’en avoir les bénéfices."
      pills={[market.family, market.province, profile.objective]}
      hero={sectionBanners.failures}
    >
      <div className="ir-auto-grid">
        {failureRisks.map((risk) => (
          <Surface key={risk.id} className="relative min-h-[160px] overflow-hidden p-4">
            <img src={risk.image} alt="" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-0 bg-ir-navy/25" />
            <span className="absolute inset-0 bg-linear-to-t from-ir-navy from-10% via-ir-navy/70 via-45% to-transparent" />
            <div className="relative z-10 flex h-full min-h-[128px] flex-col">
              <b className="grid size-[30px] place-items-center rounded-full bg-[#fff0f2] text-lg text-destructive">×</b>
              <h3 className="mt-auto mb-1.5 text-[13px] leading-snug font-semibold text-white">{risk.label}</h3>
              <p className="text-[12px] leading-relaxed text-white/80">{risk.cost}</p>
            </div>
          </Surface>
        ))}
      </div>
      <Surface className="p-4">
        <SectionLabel>Logique des autorités</SectionLabel>
        <ul className="mt-3 grid gap-2 text-[13px] leading-relaxed text-[#1a2332] @min-[36rem]:grid-cols-2">
          <li>Les règles existent : les respecter et justifier le projet évite bien des refus.</li>
          <li>Les délais varient selon le programme, le volume et le dossier.</li>
          <li>Des recours existent lorsque la situation le permet, ce n’est pas magique.</li>
          <li>Toute décision appartient aux autorités compétentes.</li>
        </ul>
      </Surface>
      {pressSample.length > 0 ? (
        <div className="grid gap-3 @min-[36rem]:grid-cols-2">
          {pressSample.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-[14px] border border-border bg-white transition hover:border-primary/30"
            >
              <img src={article.image} alt="" className="h-28 w-full object-cover object-[center_28%]" />
              <div className="p-4">
                <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">{article.source}</p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#1a2332] group-hover:text-primary">{article.title}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  Lire
                  <ExternalLink className="size-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : null}
    </OpportunitiesShell>
  );
}

function ScoreBadge({ value, emphasized }: { value: CompetitorScore; emphasized?: boolean }) {
  const label = scoreLabel(value);
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold",
        value === true && (emphasized ? "bg-primary text-white" : "bg-primary/10 text-primary"),
        value === "partial" && "bg-amber-50 text-amber-800",
        value === false && "bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export function WhyUsSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const [activeId, setActiveId] = useState(competitorCriteria[0]?.id ?? "strategy");
  const active = competitorCriteria.find((row) => row.id === activeId) ?? competitorCriteria[0];

  return (
    <OpportunitiesShell
      kicker="Pourquoi IR"
      title="Le meilleur partenaire pour réussir, pas seulement pour un visa."
      lead={competitorPitch}
      pills={[market.family, profile.objective, "Écosystème IR"]}
      hero={sectionBanners.ecosystem}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="font-semibold text-[#1a2332]">Légende</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" />
          Inclus
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-500" />
          Limité
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
          Hors offre
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Critères de comparaison"
      >
        {competitorCriteria.map((row) => {
          const selected = row.id === active.id;
          return (
            <button
              key={row.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(row.id)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-left text-[12px] font-semibold transition",
                selected
                  ? "border-primary/30 bg-primary text-white"
                  : "border-border bg-white text-[#1a2332] hover:border-primary/25 hover:bg-secondary/60",
              )}
            >
              {row.label}
            </button>
          );
        })}
      </div>

      <div
        key={active.id}
        role="tabpanel"
        className="animate-in fade-in-0 slide-in-from-bottom-1 rounded-[14px] border border-border bg-white p-4 duration-200"
      >
        <p className="text-[15px] font-semibold text-[#1a2332]">{active.label}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{active.note}</p>

        <div className="mt-4 grid gap-2 @min-[28rem]:grid-cols-2 @min-[48rem]:grid-cols-5">
          {competitorArchetypes.map((arch) => {
            const isIr = arch.id === "ir";
            const value = active.scores[arch.id];
            return (
              <div
                key={arch.id}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-3 transition",
                  isIr
                    ? "border-primary/25 bg-primary/[0.05] shadow-[0_0_0_1px_rgba(27,84,141,0.06)]"
                    : "border-border bg-[#f8fafc]",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn("text-[13px] font-semibold", isIr ? "text-primary" : "text-[#1a2332]")}>
                      {arch.short}
                    </p>
                    {isIr ? (
                      <span className="mt-1 inline-flex rounded-lg bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                        Projet complet
                      </span>
                    ) : null}
                  </div>
                  <ScoreBadge value={value} emphasized={isIr} />
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{arch.blurb}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <LeaderboardPodium
          size="default"
          medalStyle="classic"
          rankings={[
            {
              userId: "ir",
              userName: "IR Immigration",
              rank: 1,
              value: 100,
              avatarUrl: logoIr,
            },
            {
              userId: "local",
              userName: "Cabinet local",
              rank: 2,
              value: 62,
            },
            {
              userId: "visa-only",
              userName: "Agence visa only",
              rank: 3,
              value: 48,
            },
          ]}
        />
      </div>
    </OpportunitiesShell>
  );
}

export function AfricaEcosystemSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  return (
    <OpportunitiesShell
      kicker="Écosystème & parcours"
      title="Un seul interlocuteur pour construire tout le projet."
      lead="Immigration + Emploi + Installation = Projet Canada structuré"
      pills={[market.family, profile.objective, "Partenaires"]}
      hero={sectionBanners.ecosystem}
    >
      <div className="grid min-w-0 gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3">
        {ecosystemPillars.map((pillar) => (
          <a
            key={pillar.id}
            href={pillar.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-[1.2rem] outline-none transition hover:ring-2 hover:ring-primary/25 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Surface className="relative h-full min-h-[180px] overflow-hidden p-4">
              <img src={pillar.image} alt="" className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-0 bg-ir-navy/30" />
              <span className="absolute inset-0 bg-linear-to-t from-ir-navy from-15% via-ir-navy/75 via-50% to-transparent" />
              <div className="relative z-10 flex h-full min-h-[148px] flex-col">
                <p className="text-[9px] font-extrabold tracking-wide text-white/80 uppercase underline-offset-2 group-hover:underline">
                  {pillar.tag}
                </p>
                <h3 className="mt-2 mb-1.5 text-base font-semibold text-white">{pillar.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/85">{pillar.body}</p>
                <p className="mt-auto pt-3 text-[11px] font-semibold text-white">
                  {pillar.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
                </p>
              </div>
            </Surface>
          </a>
        ))}
      </div>
      <div>
        <SectionLabel>Réseau de partenaires</SectionLabel>
        <div className="mt-2 ir-auto-grid">
          {ecosystemPartners.map((partner) => (
            <Surface key={partner.id} className="p-3">
              <h3 className="text-[13px] font-semibold text-[#1a2332]">{partner.label}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{partner.body}</p>
            </Surface>
          ))}
        </div>
      </div>
      <div>
        <SectionLabel>Parcours si vous signez avec IR</SectionLabel>
        <div className="mt-2 grid gap-2 @min-[36rem]:grid-cols-5">
          {journeySteps.map((step, index) => {
            const tone =
              {
                diagnostic: "bg-[#2a3544] shadow-[0_10px_24px_rgba(42,53,68,.32)]",
                strategy: "bg-ir-navy shadow-[0_10px_24px_rgba(18,52,79,.32)]",
                prepare: "bg-primary ring-2 ring-white/25 shadow-[0_10px_24px_rgba(27,84,141,.35)]",
                file: "bg-ir-deep shadow-[0_10px_24px_rgba(20,61,103,.32)]",
                settle: "bg-[#1f6b4a] ring-2 ring-emerald-300/35 shadow-[0_10px_24px_rgba(31,107,74,.35)]",
              }[step.id] ?? "bg-ir-navy";
            return (
              <Surface
                key={step.id}
                className={cn("border-transparent p-3 text-white", tone)}
              >
                <p className="text-[10px] font-bold text-white/70">0{index + 1}</p>
                <h3 className="mt-1 text-[13px] font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-white/75">{step.body}</p>
                {step.items?.length ? (
                  <ul className="mt-2 space-y-1">
                    {step.items.map((item) => (
                      <li key={item} className="text-[11px] leading-snug text-white/90">
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Surface>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Le détail des voies et procédures se construit en rendez-vous, pas ici.
        </p>
      </div>
      <p className="text-[12px] text-muted-foreground">{IR_FEES_NOTE}</p>
    </OpportunitiesShell>
  );
}

export function RdvSection() {
  const profile = useProfileStore((s) => s.draft);
  return (
    <OpportunitiesShell
      kicker="Prendre rendez-vous"
      title={smart("Prêt(e) à structurer le projet de {name} ?", profile)}
      lead="Le détail de votre voie, des honoraires et du calendrier se construit en consultation sur le site."
      pills={[profile.country || "Afrique", profile.objective, profile.province]}
      hero={sectionBanners.ecosystem}
    >
      <Surface className="flex flex-col gap-5 border-transparent bg-linear-to-br from-primary to-ir-deep p-6 text-white shadow-[0_12px_28px_rgba(27,84,141,.22)]">
        <div>
          <p className="text-[12px] font-semibold text-white/70">Prochaine étape</p>
          <p className="mt-2 text-[18px] font-semibold leading-snug">
            Réservez un rendez-vous sur {IR_SITE_LABEL}. Nous clarifions la stratégie ensemble.
          </p>
          <p className="mt-2 text-[13px] text-white/80">
            Nous ne vendons pas de rêve. Nous construisons une méthode et un chemin sécurisé.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={IR_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-primary hover:bg-white/90"
          >
            {IR_CTA}
          </a>
          <a
            href={IR_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/35 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/15"
          >
            {IR_CTA_SECONDARY}
          </a>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/85">
          <a href={IR_SITE_URL} target="_blank" rel="noreferrer" className="hover:underline">
            {IR_SITE_LABEL}
          </a>
          <a href={IR_WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:underline">
            {IR_WHATSAPP_LABEL}
          </a>
        </div>
      </Surface>
      <Surface className="p-4">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {IR_FEES_NOTE} Toute décision appartient aux autorités compétentes.
        </p>
      </Surface>
    </OpportunitiesShell>
  );
}
