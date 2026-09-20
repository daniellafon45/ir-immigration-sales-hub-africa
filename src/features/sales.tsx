import { ExternalLink } from "lucide-react";
import HoverRevealCards from "@/components/ui/cards";
import {
  IR_CTA,
  IR_SITE_LABEL,
  IR_SITE_URL,
  IR_WHATSAPP_LABEL,
  IR_WHATSAPP_URL,
  ecosystemPillars,
} from "@/data/ecosystem";
import { ecosystemLifeCards } from "@/data/ecosystem-life";
import { failurePress, failureRisks } from "@/data/failures";
import { teerOf } from "@/data/noc-2021";
import { type Profile } from "@/data/profile";
import { sectionBanners } from "@/data/section-banners";
import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";
import { highlightedFailureIds } from "@/lib/failure-press";
import { closingDeckPills } from "@/lib/closing-pills";
import { householdMarket } from "@/lib/household-market";
import { studyDeckPills } from "@/lib/study-program";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile";

export function FailuresSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  return <FailuresRisks market={market} profile={profile} />;
}

function FailuresRisks({
  market,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
}) {
  const featured = highlightedFailureIds(profile);
  const teer = profile.objective === "Travail" ? teerOf(profile.workNocCode) : null;
  const lead =
    teer === 4 || teer === 5
      ? "En FEER 4 ou 5, la CEC ne s’applique pas. Voir plutôt un PCP."
      : "Arriver sans plan, c’est payer le prix du Canada avant d’en avoir les bénéfices.";
  return (
    <OpportunitiesShell
      kicker="Échecs fréquents"
      title="Les erreurs qui coûtent du temps, de l’argent et parfois plusieurs années."
      lead={lead}
      pills={[
        market.family,
        market.province,
        profile.objective,
        ...studyDeckPills(profile).filter((pill) => pill !== profile.objective),
        ...closingDeckPills(profile),
      ]}
      hero={sectionBanners.failures}
    >
      <div className="ir-auto-grid">
        {failureRisks.map((risk) => (
          <Surface
            key={risk.id}
            className={cn(
              "relative min-h-[176px] overflow-hidden p-4",
              featured.includes(risk.id) && "border-primary",
            )}
          >
            <img src={risk.image} alt="" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-0 bg-ir-navy/25" />
            <span className="absolute inset-0 bg-linear-to-t from-ir-navy from-10% via-ir-navy/70 via-45% to-transparent" />
            <div className="relative z-10 flex h-full min-h-[144px] flex-col">
              <span className="flex items-center justify-between gap-2">
                <b className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#fff0f2] text-lg text-destructive">×</b>
                {featured.includes(risk.id) ? (
                  <span className="rounded-lg bg-white/18 px-2 py-0.5 text-[9px] font-semibold text-white">Foyer</span>
                ) : null}
              </span>
              <h3 className="mt-auto mb-1.5 text-[13px] leading-snug font-semibold text-white">{risk.label}</h3>
              <p className="text-[12px] leading-relaxed text-white/80">{risk.cost}</p>
            </div>
          </Surface>
        ))}
      </div>
      <FailuresPress />
    </OpportunitiesShell>
  );
}

const PRESS_THEMES = [
  ["housing", "Logement"],
  ["jobs", "Emploi"],
  ["distress", "Détresse"],
] as const;

function FailuresPress() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <SectionLabel>Presse récente</SectionLabel>
          <p className="mt-1 text-[15px] leading-snug font-semibold text-[#1a2332]">
            Le Canada n’est pas un échec. L’arrivée sans préparation, si.
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Logement, emploi, santé mentale : la presse raconte ce qui arrive quand le projet s’improvise.
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground">Sources publiques. Aperçu de démonstration, pas un diagnostic.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {PRESS_THEMES.map(([theme, label]) => (
          <div key={theme} className="flex min-w-0 flex-col gap-2">
            <SectionLabel>{label}</SectionLabel>
            {failurePress
              .filter((article) => article.theme === theme)
              .map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-[14px] border border-border bg-white transition hover:border-primary/30"
                >
                  <img src={article.image} alt="" className="h-28 w-full object-cover object-[center_28%]" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">{article.source}</p>
                      <p className="text-[11px] text-muted-foreground">{article.date}</p>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-snug font-semibold text-[#1a2332] group-hover:text-primary">{article.title}</p>
                    <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      Lire l’article
                      <ExternalLink className="size-3" />
                    </span>
                  </div>
                </a>
              ))}
          </div>
        ))}
      </div>
      <Surface className="p-4">
        <p className="text-[15px] leading-relaxed font-semibold text-[#1a2332]">
          Une bonne décision prise tôt coûte souvent moins cher qu’une mauvaise décision corrigée tard.
        </p>
      </Surface>
    </>
  );
}

export function EcosystemSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  return (
    <OpportunitiesShell
      kicker="Écosystème IR"
      title="Un seul interlocuteur pour construire tout le projet."
      lead="Immigration + Emploi + Installation = Projet Canada structuré"
      pills={[
        market.family,
        profile.objective,
        ...studyDeckPills(profile).filter((pill) => pill !== profile.objective),
        ...closingDeckPills(profile),
      ]}
      hero={sectionBanners.ecosystem}
    >
      <Surface className="p-4 sm:px-5 sm:py-4">
        <h2 className="text-base font-semibold">Nous ne nous arrêtons pas au dossier.</h2>
        <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
          IR réunit immigration, emploi et installation dans une même logique de projet.
        </p>
      </Surface>
      <div className="grid min-w-0 gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3">
        {ecosystemPillars.map((pillar) => (
          <Surface key={pillar.id} className="p-4">
            <p className="text-[9px] font-extrabold tracking-wide text-primary uppercase">{pillar.tag}</p>
            <h3 className="mt-2 mb-1.5 text-base font-semibold">{pillar.title}</h3>
            <p className="text-[13px] leading-relaxed text-[#707987]">{pillar.body}</p>
          </Surface>
        ))}
      </div>
      <Surface className="flex flex-col gap-4 border-transparent bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_12px_28px_rgba(27,84,141,.22)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold text-white/70">Contact</p>
          <p className="mt-2 text-[15px] font-semibold text-white">{smart("Parlons du projet de {name}.", profile)}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            <a href={IR_SITE_URL} target="_blank" rel="noreferrer" className="font-medium text-white/85 hover:text-white hover:underline">
              {IR_SITE_LABEL}
            </a>
            <a href={IR_WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-white/85 hover:text-white hover:underline">
              {IR_WHATSAPP_LABEL}
            </a>
          </div>
        </div>
        <a
          href={IR_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-primary hover:bg-white/90"
        >
          {IR_CTA}
        </a>
      </Surface>
      <p className="text-[13px] font-semibold text-[#1a2332]">Le projet, une fois structuré.</p>
      <div className="place-strip-wrap">
        <HoverRevealCards items={ecosystemLifeCards(profile)} />
      </div>
    </OpportunitiesShell>
  );
}
