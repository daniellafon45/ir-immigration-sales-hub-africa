import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Baby,
  CalendarDays,
  HeartPulse,
  Landmark,
  ShieldPlus,
  Umbrella,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PageShell } from "@/components/layout/PageShell";
import { personHeroImage } from "@/data/pitch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { sectionBanners } from "@/data/section-banners";
import { irccFundsFor } from "@/data/ircc-funds";
import { provinceCode, provinceData } from "@/data/provinces";
import { extraSpouseId, type AdultMember, type Profile } from "@/data/profile";
import { OccupationSearchField } from "@/features/occupation-search-field";
import { applyOccupationPatch } from "@/lib/occupation-resolve";
import { money, num } from "@/lib/format";
import { workBenefitsFor, type WorkBenefitId } from "@/data/work-benefits";
import { professionPhotosFor } from "@/data/profession-photos";
import { businessCost } from "@/lib/business-cost";
import { closingDeckPills } from "@/lib/closing-pills";
import {
  compareLivingByProvince,
  compareNetByProvince,
  draftLiving,
  draftNet,
  householdLiving,
} from "@/lib/household-living";
import { familyCost, reunitedLivingExtras } from "@/lib/family-cost";
import { honorairesFor } from "@/lib/honoraires";
import { nextCompareSelected } from "@/lib/compare-select";
import {
  citiesForProvince,
  defaultCityId,
  defaultProvinceCode,
  defaultCompareIds,
  livingBasket,
  withLivingOverrides,
} from "@/lib/living-basket";
import { householdMarket, type HouseholdMarket, type HouseholdMarketAdult } from "@/lib/household-market";
import { profileAdFor, type ProfileAd } from "@/lib/profile-ad";
import { routeForObjective } from "@/lib/route-paths";
import { ALL_CITIES, ALL_PROVINCES, demandLabel, featuredCitiesFor } from "@/data/job-demand";
import { householdDemand } from "@/lib/household-demand";
import { householdSalaries, type HouseholdSalaryGroup, type HouseholdSalaryPhase } from "@/lib/household-salaries";
import { salaryForSeniority, SENIORITY_STEPS, type SalaryRecognition } from "@/lib/salary-recognition";
import type { SalaryBand } from "@/data/salaries";
import { studyCost } from "@/lib/study-cost";
import { studyDeckPills } from "@/lib/study-program";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { visitCost } from "@/lib/visit-cost";
import { workCost } from "@/lib/work-cost";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function OpportunitiesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const goTo = useDeckStore((s) => s.goToSectionId);
  const market = householdMarket(profile);
  const ranked = Object.values(provinceData).sort((a, b) => b.score - a.score);
  if (slide === 1) return <OpportunitiesScore market={market} ranked={ranked} profile={profile} />;
  if (slide === 2) return <OpportunitiesNext market={market} onGo={goTo} profile={profile} />;
  return <OpportunitiesMarket market={market} profile={profile} />;
}

function menuLensPills(profile: Profile) {
  return [...studyDeckPills(profile), ...closingDeckPills(profile)];
}

function OpportunitiesMarket({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const setPrincipalMode = useProfileStore((s) => s.setPrincipalMode);
  const others = market.adults.filter((adult) => adult.role !== "applicant");
  const study = profile.objective === "Études";
  const work = profile.objective === "Travail";
  const visit = profile.objective === "Visite";
  const business = profile.objective === "Affaires";
  const family = profile.objective === "Regroupement familial";
  const businessVisitor = profile.objective === "Affaires" && profile.businessPath === "visitor";
  const couple = others.length > 0;
  const workView = work ? workCost(profile) : undefined;
  const businessView = business ? businessCost(profile) : undefined;
  const showWorkBenefits = !visit && !businessVisitor;
  const title = study
    ? couple
      ? "Le conjoint peut travailler pendant les études."
      : "Votre programme relie le campus au marché."
    : visit
      ? "Le séjour doit être crédible avant le reste."
      : business
        ? "Le projet doit être crédible ici."
        : family
          ? "La réunification passe d’abord."
          : workView?.pathways.spouseOpen?.eligible && couple
            ? "Le métier principal peut aussi ouvrir une marge pour le conjoint."
            : "Votre profil peut être relié aux données du marché.";
  const lead = study
    ? couple
      ? "L’étudiant vise le diplôme. Le conjoint parrainé vise un emploi tout de suite."
      : "Voici ce que le marché dit du métier visé par le programme."
    : visit
      ? "Le marché existe, mais la visite reste un séjour, pas un droit de travailler."
      : businessVisitor
        ? "Avant tout projet, le séjour doit rester cohérent. Un visiteur d’affaires n’a pas un droit de travailler."
        : business
          ? "Avant le marché, le dossier doit prouver un projet crédible ici."
          : family && profile.familyLink === "parent"
            ? "La réunification passe d’abord. Ces repères servent après l’arrivée, pas comme argument d’emploi."
            : family
              ? "La réunification passe d’abord. Le marché compte surtout après l’arrivée."
              : "Voici ce que le marché dit des métiers du foyer, aujourd’hui.";
  return (
    <OpportunitiesShell
      kicker="Opportunités"
      title={title}
      lead={lead}
      pills={[market.family, market.province, ...menuLensPills(profile), ...(study ? [] : [market.principal.member.profession])]}
      hero={sectionBanners.opportunities}
      panel={<MarketPanel market={market} />}
    >
      {market.polygamous ? (
        <div className="grid shrink-0 gap-3">
          <PersonMarketCard
            adult={market.adults[0]}
            occupationLocked={study && market.adults[0].role === "applicant"}
            onSelect={() => setPrincipalMode(market.adults[0].role)}
          />
          <div className="ir-rise grid min-h-0 min-w-0 gap-3 @min-[34rem]:grid-cols-2">
            {others.map((adult) => (
              <PersonMarketCard
                key={adult.role}
                adult={adult}
                occupationLocked={false}
                onSelect={() => setPrincipalMode(adult.role)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={cn("grid min-w-0 shrink-0 gap-3", others.length > 0 && "@min-[34rem]:grid-cols-2")}>
          {market.adults.map((adult) => (
            <PersonMarketCard
              key={adult.role}
              adult={adult}
              occupationLocked={study && adult.role === "applicant"}
              onSelect={() => setPrincipalMode(adult.role)}
            />
          ))}
        </div>
      )}
      {market.kids.length > 0 ? (
        <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
          <SectionLabel>Enfants</SectionLabel>
          <div className="mt-2 grid gap-2 @min-[24rem]:grid-cols-2 @min-[48rem]:grid-cols-3">
            {market.kids.map((child) => (
              <div key={child.id} className="rounded-xl border border-[#c5d8ee] bg-secondary px-3 py-2 text-[13px] font-medium text-[#1a2332]">
                {(child.firstName || "Enfant")} · {child.age} ans
              </div>
            ))}
          </div>
        </Surface>
      ) : null}
      {showWorkBenefits ? (
        <WorkBenefitsSection
          province={market.province}
          hasChildren={market.kids.length > 0}
          lead={
            family && profile.familyLink === "parent"
              ? "La réunification passe d’abord. Ces protections comptent après l’arrivée, pas comme promesse d’emploi."
              : business && businessView?.path?.id !== "visitor"
                ? "Autour du salaire, un emploi au Canada ajoute une protection réelle."
                : undefined
          }
        />
      ) : (
        <Surface className="flex min-h-0 flex-1 flex-col p-3 sm:px-4 sm:py-3">
          <SectionLabel>Repères statut</SectionLabel>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-[#3d4b5c]">
            <li>· Un visa visiteur autorise le séjour, pas un emploi.</li>
            <li>· Pas d’études sans permis d’études.</li>
            <li>· Le conjoint voyage comme visiteur, pas comme travailleur.</li>
          </ul>
        </Surface>
      )}
    </OpportunitiesShell>
  );
}

function OpportunitiesScore({
  market,
  ranked,
  profile,
}: {
  market: HouseholdMarket;
  ranked: Array<{ name: string; score: number }>;
  profile: Profile;
}) {
  const top = ranked[0];
  const study = profile.objective === "Études";
  const ad = profileAdFor({
    profile,
    profession: market.principal.member.profession,
    province: top?.name ?? market.province,
    score: top?.score ?? 0,
    median: market.principal.mid,
  });
  return (
    <OpportunitiesShell
      kicker="Opportunités · Score"
      title="Où votre profil semble-t-il le plus intéressant ?"
      lead={study ? "Un score fondé sur le métier visé, les salaires et le coût de la vie." : "Un score fondé sur les salaires et le coût de la vie."}
      pills={[...menuLensPills(profile), market.principal.member.profession, market.province]}
      hero={sectionBanners.opportunities}
      panel={
        <MarketTalk
          kicker="Où viser"
          title={top?.name ?? market.province}
          subtitle={`${top?.score ?? 0}/100`}
          blocks={[
            ["Métier retenu", market.principal.member.profession],
            ["Salaire médian", money(market.principal.mid)],
          ]}
          ad={ad}
        />
      }
    >
      <div className="grid shrink-0 gap-2">
        {ranked.map((province, index) => (
          <Surface key={province.name} className="grid grid-cols-[42px_1fr_100px] items-center px-3.5 py-3">
            <b className="text-primary">{index + 1}</b>
            <span className="text-[14px] font-medium">{province.name}</span>
            <strong className="text-right text-primary">{province.score}/100</strong>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function OpportunitiesNext({
  market,
  onGo,
  profile,
}: {
  market: HouseholdMarket;
  onGo: (id: string) => void;
  profile: Profile;
}) {
  const destinations = [
    { id: "emplois", label: "Emplois" },
    { id: "salaires", label: "Salaires" },
    { id: "voies", label: "Voies d’immigration" },
    { id: "comparateur", label: "Comparateur de procédures" },
  ];
  const study = profile.objective === "Études";
  return (
    <OpportunitiesShell
      kicker="Opportunités · Transition"
      title="Le marché est là. Voyons la suite."
      lead={
        study
          ? "Les postes, les salaires et le permis d’études qui correspondent au programme."
          : "Les postes, les salaires et les procédures qui correspondent à votre profil."
      }
      pills={[market.family, ...menuLensPills(profile), market.principal.member.profession]}
      hero={sectionBanners.opportunities}
      panel={
        <MarketTalk
          kicker="Ensuite"
          title={market.principal.member.firstName || "Dossier"}
          subtitle={market.family}
          actions={destinations}
          onGo={onGo}
        />
      }
    >
      <div className="grid shrink-0 gap-2.5 sm:grid-cols-2">
        {destinations.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onGo(item.id)}
            className="flex min-h-[72px] cursor-pointer items-end rounded-[1.2rem] border border-[#e8ecf2] bg-white px-4 py-3 text-left text-[15px] font-semibold text-ir-navy shadow-[0_8px_24px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-ir-blue2"
          >
            {item.label}
          </button>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

export function OpportunitiesShell({
  kicker,
  title,
  lead,
  pills,
  panel,
  hero,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  pills: string[];
  panel?: ReactNode;
  hero: string;
  children: ReactNode;
}) {
  return (
    <PageShell panel={panel}>
          <header className="relative shrink-0 overflow-hidden rounded-[1.2rem] bg-primary px-4 py-3 text-white sm:px-6 sm:py-6">
            <img src={hero} alt="" className="absolute inset-0 size-full object-cover object-[80%_center]" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
            <BrandLogo className="absolute top-3 right-3 z-10 size-11 rounded-lg ring-1 ring-white/20 sm:top-4 sm:right-4 sm:size-12" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pr-14 sm:pr-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">{kicker}</p>
                <h1 className="mt-1 text-[20px] leading-tight font-semibold tracking-tight sm:text-[24px]">{title}</h1>
                <p className="mt-1 max-w-[62ch] text-[12px] text-white/70 sm:text-[13px]">{lead}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pills.map((pill) => (
                  <MetaPill key={pill}>{pill}</MetaPill>
                ))}
              </div>
            </div>
          </header>
          {children}
    </PageShell>
  );
}

const benefitIcons: Record<WorkBenefitId, LucideIcon> = {
  sante: HeartPulse,
  complements: ShieldPlus,
  conges: CalendarDays,
  parental: Baby,
  retraite: Landmark,
  emploi: Umbrella,
  famille: UsersRound,
};

function WorkBenefitsSection({
  province,
  hasChildren,
  lead,
}: {
  province: string;
  hasChildren: boolean;
  lead?: string;
}) {
  const benefits = workBenefitsFor(province, hasChildren);
  return (
    <Surface className="flex min-h-0 flex-1 flex-col p-3 sm:px-4 sm:py-3">
      <SectionLabel>Avantages sociaux</SectionLabel>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {lead ?? "Autour du salaire, un emploi au Canada ajoute une protection réelle."}
      </p>
      <div className="mt-2 grid min-w-0 gap-2 @min-[32rem]:grid-cols-2">
        {benefits.map((benefit) => {
          const Icon = benefitIcons[benefit.id];
          return (
            <div
              key={benefit.id}
              className="flex h-full min-w-0 items-center gap-3 rounded-xl border border-[#e8ecf2] bg-[#f4f7fb] px-3 py-2.5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-primary ring-1 ring-[#e8ecf2]">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1a2332]">{benefit.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{benefit.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

function PersonMarketCard({
  adult,
  occupationLocked,
  onSelect,
}: {
  adult: HouseholdMarketAdult;
  occupationLocked: boolean;
  onSelect: () => void;
}) {
  const patchApplicant = useProfileStore((s) => s.patchApplicant);
  const patchSpouse = useProfileStore((s) => s.patchSpouse);
  const patchExtraSpouse = useProfileStore((s) => s.patchExtraSpouse);
  const tone = adult.selected ? "navy" : "blue";
  const jobLabel = adult.member.jobTitle || adult.member.profession;

  function patchMember(patch: Partial<AdultMember>) {
    const next = applyOccupationPatch(patch);
    if (adult.role === "applicant") patchApplicant(next);
    else if (adult.role === "spouse") patchSpouse(next);
    else {
      const id = extraSpouseId(adult.role);
      if (id) patchExtraSpouse(id, next);
    }
  }

  return (
    <Surface
      className={cn(
        "min-w-0 p-0 transition duration-200",
        adult.selected && "ring-2 ring-primary/30",
      )}
    >
      <div className="@container overflow-hidden rounded-[1.2rem]">
      <button
        type="button"
        aria-pressed={adult.selected}
        aria-label={`Retenir ${adult.member.firstName || adult.label} comme profil marché`}
        onClick={onSelect}
        className={cn(
          "relative flex min-h-[72px] w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-t-[1.2rem] px-3 py-3 text-left text-white",
          tone === "navy" ? "bg-primary" : "bg-ir-blue2",
        )}
      >
        <img src={personHeroImage(adult.member)} alt="" className="absolute inset-0 z-0 size-full object-cover object-[80%_center]" />
        <div className="absolute inset-0 z-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
        <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-semibold">
          {initials(adult.member.firstName)}
        </span>
        <div className="relative z-10 min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-[0.12em] text-white/70 uppercase">{adult.label}</p>
          <p className="mt-0.5 truncate text-lg font-semibold tracking-tight">{adult.member.firstName || "—"}</p>
        </div>
      </button>
      <div className="grid min-w-0 gap-2 p-3" onClick={(event) => event.stopPropagation()}>
        <div className="grid min-w-0 grid-cols-1 gap-2 @min-[20rem]:grid-cols-2">
          <OccupationSearchField
            label="Métier"
            kind="profession"
            value={jobLabel}
            disabled={occupationLocked}
            onChange={(resolved, typed) =>
              patchMember({
                profession: resolved,
                jobTitle: resolved === "Autre" ? typed : resolved,
                ...(resolved === adult.member.profession ? { sector: adult.member.sector } : {}),
              })
            }
          />
          <OccupationSearchField
            label="Secteur"
            kind="sector"
            value={adult.member.sector}
            disabled={occupationLocked}
            onChange={(resolved) => patchMember({ sector: resolved })}
          />
        </div>
        <div className="ir-equal-row">
          <ReadField label="Bas" value={money(adult.low)} />
          <ReadField label="Médian" value={money(adult.mid)} />
          <ReadField label="Élevé" value={money(adult.high)} />
        </div>
      </div>
      </div>
    </Surface>
  );
}

function MarketPanel({ market }: { market: HouseholdMarket }) {
  const showFoyer = Boolean(market.accompanying || market.excluded.length || market.kids.length);
  const foyerLabel =
    market.polygamous
      ? market.accompanying?.role === "applicant" ? "Candidat" : "Conjointe au dossier"
      : market.principal.role === "applicant"
        ? "Conjoint"
        : "Candidat";
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">Lecture marché</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{market.principal.member.firstName || "—"}</p>
          <p className="mt-1 text-[14px] text-white/85">{market.family}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <PanelBlock title="Marché retenu">
          <FactRow label="Métier" value={market.principal.member.profession} />
          <FactRow label="Secteur" value={market.principal.member.sector} />
          <FactRow label="Médian" value={money(market.principal.mid)} />
          <FactRow label="Fourchette" value={`${money(market.principal.low)} – ${money(market.principal.high)}`} />
        </PanelBlock>
        {showFoyer ? (
          <PanelBlock title="Foyer">
            {market.accompanying ? (
              <FactRow
                label={foyerLabel}
                value={`${market.accompanying.member.firstName || "—"} · ${market.accompanying.member.profession}`}
              />
            ) : null}
            {market.excluded.map((adult) => (
              <FactRow
                key={adult.role}
                label="Hors dossier"
                value={`${adult.member.firstName || adult.label} · ${adult.member.profession}`}
              />
            ))}
            {market.kids.map((child) => (
              <FactRow key={child.id} label="Enfant" value={`${child.firstName || "Enfant"} · ${child.age} ans`} />
            ))}
            {market.polygamous ? (
              <p className="pt-1 text-[13px] leading-snug text-white/80">
                Le Canada ne reconnaît qu’un conjoint. Une seule épouse peut accompagner le dossier.
              </p>
            ) : null}
          </PanelBlock>
        ) : null}
        <ProfessionPhotos profession={market.principal.member.profession} sex={market.principal.member.sex} />
      </div>
    </div>
  );
}

function ProfessionPhotos({ profession, sex }: { profession: string; sex: string }) {
  const photo = professionPhotosFor(profession, sex)[0];
  if (!photo) return null;
  return (
    <div className="mt-auto min-h-[148px] flex-1">
      <img
        src={photo.src}
        alt={photo.alt}
        className="h-full min-h-[148px] w-full rounded-xl object-cover ring-1 ring-white/15"
      />
    </div>
  );
}

function MarketTalk({
  kicker,
  title,
  subtitle,
  blocks,
  ad,
  actions,
  onGo,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  blocks?: Array<[string, string]>;
  ad?: ProfileAd;
  actions?: Array<{ id: string; label: string }>;
  onGo?: (id: string) => void;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">{kicker}</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-[14px] text-white/85">{subtitle}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {blocks?.length ? (
          <PanelBlock title="Dossier">
            {blocks.map(([label, value]) => (
              <FactRow key={label} label={label} value={value} />
            ))}
          </PanelBlock>
        ) : null}
        {ad ? (
          <div className="relative mt-auto min-h-[148px] flex-1 overflow-hidden rounded-xl">
            <img src={ad.image} alt={ad.alt} className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-0 bg-ir-navy/25" />
            <span className="absolute inset-0 bg-linear-to-t from-ir-navy from-10% via-ir-navy/75 via-50% to-transparent" />
            <div className="relative z-10 flex h-full min-h-[148px] flex-col justify-end p-3">
              <p className="text-[14px] leading-snug font-semibold">{ad.headline}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/80">{ad.body}</p>
              <p className="mt-2 text-[12px] font-semibold text-white">{ad.prompt}</p>
            </div>
          </div>
        ) : null}
      </div>
      {actions?.length && onGo ? (
        <div className="mt-3 grid shrink-0 gap-2">
          {actions.map((action) => (
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

function ReadField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <p className="flex h-8 items-center rounded-md border border-input bg-[#f7fafc] px-3 text-sm font-medium text-[#1a2332]">
        {value}
      </p>
    </div>
  );
}

export function Surface({ className, children }: { className?: string; children: ReactNode }) {
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

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-semibold text-[#1a2332]">{children}</h2>;
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
      {children}
    </span>
  );
}

function PanelBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white/10 p-2">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase">{title}</p>
      <div className="mt-1.5 space-y-0.5">{children}</div>
    </section>
  );
}

function FactRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[13px] text-white/80">{label}</span>
      <span className="text-right text-[14px] leading-tight font-medium">{value}</span>
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const jobsPlace = {
  province: "",
  cityId: ALL_CITIES,
};

export function JobsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const [province, setProvince] = useState(() => jobsPlace.province || provinceCode(market.province));
  const [cityId, setCityId] = useState(() => jobsPlace.cityId);
  const view = householdDemand(profile, { province, cityId, intlOnly: slide === 1 });
  const filters = (
    <JobsFilters
      province={province}
      cityId={cityId}
      onProvince={(next) => {
        const allowed = demandCityOptions(next).some((city) => city.id === cityId);
        const nextCity = allowed ? cityId : ALL_CITIES;
        setProvince(next);
        if (!allowed) setCityId(ALL_CITIES);
        jobsPlace.province = next;
        jobsPlace.cityId = nextCity;
      }}
      onCity={(next) => {
        setCityId(next);
        jobsPlace.cityId = next;
      }}
    />
  );
  if (slide === 1) return <JobsIntl market={market} view={view} filters={filters} profile={profile} />;
  return <JobsToday market={market} view={view} filters={filters} profile={profile} />;
}

function JobsToday({
  market,
  view,
  filters,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdDemand>;
  filters: ReactNode;
  profile: Profile;
}) {
  const study = profile.objective === "Études";
  const visit = profile.objective === "Visite";
  const business = profile.objective === "Affaires";
  const businessVisitor = business && profile.businessPath === "visitor";
  const family = profile.objective === "Regroupement familial";
  const other = market.adults.length > 1;
  const visitPills = visit ? ["Pas un droit de travailler"] : [];
  const pills = study
    ? [market.family, ...menuLensPills(profile), ...visitPills, view.placeLabel, ...market.adults.map((adult) => adult.member.profession)]
    : [market.family, ...menuLensPills(profile), ...visitPills, view.placeLabel, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Emplois · Demande"
      title={
        study
          ? other
            ? "Le conjoint parrainé peut travailler pendant vos études."
            : "Après le diplôme, le marché cherche votre métier."
          : visit || businessVisitor
            ? "Le marché existe, mais ce n’est pas un droit de travailler."
            : business
              ? "Le métier reste un plan B si le projet ne tient pas."
              : family
                ? "La réunification passe d’abord. Le marché vient après."
                : "Le marché cherche votre métier. Voici où."
      }
      lead={
        study
          ? other
            ? "L’étudiant vise le diplôme. Le conjoint, lui, vise un emploi tout de suite."
            : "La demande pour votre métier, une fois les études terminées."
          : visit || businessVisitor
            ? "Le taux de demande sert à lire le terrain si un changement de statut est approuvé plus tard. Pendant la visite, ce n’est pas un droit de travailler."
            : business
              ? "Ces fourchettes décrivent ce que paierait le métier si le projet ne tient pas, pas le revenu de l’entreprise."
              : family
                ? "La réunification passe d’abord. La demande du marché sert après l’arrivée, pas avant."
                : "Le taux de demande par ville. Ça, c’est la pression réelle, pas une liste d’offres."
      }
      pills={pills}
      hero={sectionBanners.jobs}
    >
      {filters}
      <DemandBoard groups={view.groups} profile={profile} />
    </OpportunitiesShell>
  );
}

function JobsIntl({
  market,
  view,
  filters,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdDemand>;
  filters: ReactNode;
  profile: Profile;
}) {
  const study = profile.objective === "Études";
  const visit = profile.objective === "Visite";
  const business = profile.objective === "Affaires";
  const businessVisitor = business && profile.businessPath === "visitor";
  const family = profile.objective === "Regroupement familial";
  const visitPills = visit ? ["Pas un droit de travailler"] : [];
  const chips = study
    ? ["International", ...menuLensPills(profile), ...visitPills, view.placeLabel, ...market.adults.map((adult) => adult.member.profession)]
    : ["International", ...menuLensPills(profile), ...visitPills, view.placeLabel, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Emplois · International"
      title={
        study
          ? "Une part de cette demande se remplit depuis l’étranger — y compris pour le conjoint."
          : visit || businessVisitor
            ? "Une part de cette demande se remplit depuis l’étranger, mais ce n’est pas un droit de travailler."
            : business
              ? "Une part de cette demande reste un plan B si le projet ne tient pas."
              : family
                ? "Une part de cette demande s’ouvre après l’arrivée."
                : "Une part de cette demande se remplit depuis l’étranger."
      }
      lead={
        visit || businessVisitor
          ? "Filtrez la ville. Voyez où l’embauche internationale existe déjà si le statut change plus tard."
          : family
            ? "Filtrez la ville. Voyez où le marché s’ouvre après l’arrivée."
            : "Filtrez la ville. Voyez où l’embauche internationale est déjà ouverte."
      }
      pills={chips}
      hero={sectionBanners.jobs}
    >
      {filters}
      <DemandBoard groups={view.groups} profile={profile} />
    </OpportunitiesShell>
  );
}

function demandCityOptions(province: string) {
  if (province === ALL_PROVINCES) {
    return Object.keys(provinceData).flatMap((code) => featuredCitiesFor(code));
  }
  return citiesForProvince(province);
}

function JobsFilters({
  province,
  cityId,
  onProvince,
  onCity,
}: {
  province: string;
  cityId: string;
  onProvince: (value: string) => void;
  onCity: (value: string) => void;
}) {
  const cities = demandCityOptions(province);
  return (
    <div className="grid shrink-0 gap-3 @min-[32rem]:grid-cols-2">
      <label className="grid gap-1">
        <span className="text-[10px] uppercase text-muted-foreground">Province</span>
        <Select value={province} onChange={(event) => onProvince(event.target.value)}>
          <option value={ALL_PROVINCES}>Toutes les provinces</option>
          {Object.entries(provinceData).map(([code, item]) => (
            <option key={code} value={code}>
              {item.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-1">
        <span className="text-[10px] uppercase text-muted-foreground">Ville</span>
        <Select value={cityId} onChange={(event) => onCity(event.target.value)}>
          <option value={ALL_CITIES}>Toutes les villes</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

function intlHiringLabel(share: number) {
  if (share >= 55) return "Très ouverte";
  if (share >= 40) return "Ouverte";
  if (share >= 25) return "Partielle";
  return "Locale";
}

function DemandBoard({
  groups,
  profile,
}: {
  groups: ReturnType<typeof householdDemand>["groups"];
  profile: Profile;
}) {
  return (
    <div className={cn("grid min-w-0 gap-3", groups.length > 1 && "@min-[48rem]:grid-cols-2")}>
      {groups.map((group) => {
        const intl = group.metric === "intlShare";
        const value = intl ? group.current.intlShare : group.current.score;
        const chartLabel = intl ? "Part internationale" : "Taux de demande";
        const level = intl ? intlHiringLabel(value) : demandLabel(value);
        const activeId = group.series.some((point) => point.id === group.current.id) ? group.current.id : undefined;
        return (
          <Surface key={group.adult.role} className="@container flex flex-col p-3 sm:px-4 sm:py-3">
            <SectionLabel>{adultStudyHeading(group.adult, profile)}</SectionLabel>
            <div className="mt-3 flex flex-col gap-3 @min-[24rem]:flex-row @min-[24rem]:items-center">
              <DemandMeter value={value} />
              <div className="grid min-w-0 grid-cols-3 gap-2 @min-[24rem]:grow">
                <DemandStat label={chartLabel} value={intl ? `${value} %` : `${value}/100`} />
                <DemandStat label="Postes indicatifs" value={num(group.current.openings)} />
                <DemandStat label="Candidats / poste" value={String(group.current.applicantsPerOpening).replace(".", ",")} />
              </div>
            </div>
            <p className="mt-2 text-[12px] font-semibold text-primary">{level}</p>
            <DemandBars
              label={chartLabel}
              metric={group.metric}
              points={group.series}
              activeId={activeId}
            />
          </Surface>
        );
      })}
    </div>
  );
}

function DemandMeter({ value }: { value: number }) {
  const hot = value >= 80;
  return (
    <div className="relative grid size-[88px] shrink-0 place-items-center">
      <svg viewBox="0 0 36 36" className={cn("size-[88px] -rotate-90", hot ? "text-[#1e6b3d]" : "text-primary")}>
        <circle cx="18" cy="18" r="14.5" fill="none" stroke="#e8eef5" strokeWidth="3.5" />
        <circle
          cx="18"
          cy="18"
          r="14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${value} ${100 - value}`}
        />
      </svg>
      <strong className="absolute text-[22px] leading-none text-[#1a2332]">{value}</strong>
    </div>
  );
}

function DemandStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[10px] border border-border bg-[#f7fafc] px-2 py-2 sm:px-3">
      <span className="block truncate text-[10px] text-muted-foreground">{label}</span>
      <strong className="mt-0.5 block truncate text-[15px] text-[#1a2332]">{value}</strong>
    </div>
  );
}

function DemandBars({
  label,
  metric,
  points,
  activeId,
}: {
  label: string;
  metric: "score" | "intlShare";
  points: Array<{ id: string; name: string; score: number; intlShare: number }>;
  activeId?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 grid max-h-[min(50vh,28rem)] gap-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {points.map((point) => {
          const value = metric === "intlShare" ? point.intlShare : point.score;
          const active = point.id === activeId;
          return (
            <div key={point.id} className="grid grid-cols-[minmax(4.5rem,8rem)_minmax(0,1fr)_2.5rem] items-center gap-2">
              <span className={cn("truncate text-[12px]", active ? "font-semibold text-[#1a2332]" : "text-[#4b5565]")}>
                {point.name}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-[#e8eef5]">
                <div
                  className={cn("h-full rounded-full", active ? "bg-primary" : "bg-ir-blue2/70")}
                  style={{ width: `${value}%` }}
                />
              </div>
              <strong className="text-right text-[12px] tabular-nums text-[#1a2332]">{value}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function adultStudyHeading(adult: HouseholdMarketAdult, profile: Profile) {
  if (profile.objective === "Regroupement familial" && profile.familyLink === "spouse" && adult.role !== "applicant") {
    return `Après l’arrivée · ${adult.member.profession}`;
  }
  if (profile.objective !== "Études") return `${adult.label} · ${adult.member.profession}`;
  if (adult.role === "applicant") return `${adult.label} · Après les études · ${adult.member.profession}`;
  return `Conjoint parrainé · ${adult.member.profession}`;
}

export function SalariesSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const view = householdSalaries(profile);
  return <SalariesBands market={market} view={view} profile={profile} />;
}

function SalariesBands({
  market,
  view,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdSalaries>;
  profile: Profile;
}) {
  const study = view.study;
  const visit = profile.objective === "Visite";
  const businessVisitor = profile.objective === "Affaires" && profile.businessPath === "visitor";
  const business = profile.objective === "Affaires";
  const family = profile.objective === "Regroupement familial";
  const other = market.adults.length > 1;
  const visitPills = visit ? ["Pas un droit de travailler"] : [];
  const lead = study
    ? other
      ? "Le diplôme ouvre un salaire. Le conjoint parrainé peut déjà travailler."
      : "Le diplôme ouvre un salaire. Le stage, c’est déjà un revenu."
    : visit || businessVisitor
      ? "Pendant la visite, ce n’est pas un droit de travailler. Ces fourchettes décrivent le marché si le statut change plus tard."
      : business
        ? "Ces fourchettes décrivent le marché salarié si le projet ne tient pas, pas le revenu de l’entreprise."
        : family
          ? "La réunification passe d’abord. Les fourchettes servent après l’arrivée, pas avant."
          : other
            ? "Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes."
            : "Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.";
  const pills = study
    ? [market.family, ...menuLensPills(profile), ...visitPills, market.province, ...market.adults.map((adult) => adult.member.profession)]
    : [market.family, market.province, ...menuLensPills(profile), ...visitPills, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Guide salarial"
      title={
        study
          ? other
            ? "Combien le foyer peut-il gagner pendant et après les études ?"
            : "Combien pouvez-vous gagner après vos études ?"
          : visit || businessVisitor
            ? smart("Combien peut gagner un(e) {profession} après un changement de statut ?", profile)
            : business
              ? "Combien le métier paierait-il si le projet ne tient pas ?"
              : family
                ? "Combien le foyer peut-il gagner après l’arrivée ?"
                : smart("Combien peut gagner un(e) {profession} ?", profile)
      }
      lead={lead}
      pills={pills}
      hero={sectionBanners.salaries}
    >
      <SalariesBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function SalaryPhaseBands({ phase }: { phase: HouseholdSalaryPhase }) {
  return (
    <div className="grid gap-2">
      {phase.label ? (
        <div>
          <p className="text-[13px] font-semibold tracking-[0.12em] text-primary uppercase">{phase.label}</p>
          {phase.hint ? <p className="mt-0.5 text-[12px] text-muted-foreground">{phase.hint}</p> : null}
        </div>
      ) : null}
      <div className="ir-equal-row">
        <Band label="Bas" value={money(phase.low)} />
        <Band label="Médian" value={money(phase.mid)} featured />
        <Band label="Élevé" value={money(phase.high)} />
      </div>
      <div className="grid gap-2 ir-auto-grid-sm">
        {Object.entries(phase.bands).map(([code, values]) => (
          <div key={code} className="rounded-[10px] border border-border bg-white p-3 text-center">
            <span className="block text-[12px] text-muted-foreground">{provinceData[code]?.name ?? code}</span>
            <b className="mt-1 block text-[15px]">{money(values[1])}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalariesBoard({ groups }: { groups: HouseholdSalaryGroup[] }) {
  return (
    <div className="grid shrink-0 gap-3">
      {groups.map((group) => {
        const phase = group.phases.find((item) => item.id !== "internship") ?? group.phases[0];
        return (
          <Surface key={group.adult.role} className="p-3 sm:px-4 sm:py-3">
            <SectionLabel>{group.heading}</SectionLabel>
            <div className="mt-3 grid gap-4">
              {group.phases.map((item) => (
                <SalaryPhaseBands key={item.id} phase={item} />
              ))}
              {phase ? (
                <SalaryRecognitionBlock
                  recognition={group.recognition}
                  band={[phase.low, phase.mid, phase.high]}
                />
              ) : null}
            </div>
          </Surface>
        );
      })}
      {groups.length > 1 ? (
        <p className="text-[13px] text-[#1a2332]">Deux métiers : deux reconnaissances. L’écart du foyer s’additionne.</p>
      ) : null}
      <p className="text-[13px] font-medium text-[#1a2332]">
        Sans reconnaissance, on part souvent du palier Bas. Le dossier sert aussi à faire compter ces années.
      </p>
    </div>
  );
}

function SalaryRecognitionBlock({
  recognition,
  band,
}: {
  recognition: SalaryRecognition;
  band: SalaryBand;
}) {
  return (
    <div className="grid gap-3">
      <SectionLabel>Années reconnues · fourchette</SectionLabel>
      <div className="ir-equal-row">
        {SENIORITY_STEPS.map((step) => {
          const recognized = step.id === recognition.recognizedTier;
          const declared = step.id === recognition.declaredTier;
          const badge = recognition.sameTier && recognized
            ? "Déclaré et reconnu"
            : recognized
              ? "Reconnu"
              : declared
                ? "Si les années comptent"
                : null;
          return (
            <div
              key={step.id}
              className={cn(
                "grid min-h-11 content-start gap-1 rounded-[14px] border p-4 text-center",
                recognized
                  ? "border-transparent bg-linear-to-br from-primary to-ir-deep text-white"
                  : declared
                    ? "border-dashed border-primary bg-white"
                    : "border-border bg-white",
              )}
            >
              <span className="block text-[12px] uppercase opacity-80">{step.yearsLabel}</span>
              <span className="block text-[12px] uppercase opacity-80">{step.salaryLabel}</span>
              <strong className="mt-0.5 block text-[22px] tabular-nums">{money(salaryForSeniority(band, step.id))}</strong>
              {badge ? (
                <span
                  className={cn(
                    "mt-1 inline-flex min-h-7 items-center justify-center rounded-full px-2 text-[12px] font-semibold",
                    recognized ? "bg-white/15" : "bg-primary/10 text-primary",
                  )}
                >
                  {badge}
                </span>
              ) : (
                <span className="mt-1 min-h-7" />
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 min-[40rem]:grid-cols-4">
        <div className="rounded-[10px] border border-border bg-white p-3 text-center">
          <span className="block text-[12px] uppercase text-muted-foreground">Années déclarées</span>
          <b className="mt-1 block text-[15px] tabular-nums">{recognition.declaredYears} ans</b>
        </div>
        <div className="rounded-[10px] border border-border bg-white p-3 text-center">
          <span className="block text-[12px] uppercase text-muted-foreground">Années reconnues (estim.)</span>
          <b className="mt-1 block text-[15px] tabular-nums">{recognition.recognizedYears} ans</b>
        </div>
        <div className="rounded-[10px] border border-border bg-white p-3 text-center">
          <span className="block text-[12px] uppercase text-muted-foreground">Écart salarial</span>
          <b className="mt-1 block text-[15px] tabular-nums">
            {recognition.gap > 0 ? `−${money(recognition.gap)}` : money(0)}
          </b>
        </div>
        <div className="rounded-[10px] border border-border bg-white p-3 text-center">
          <span className="block text-[12px] uppercase text-muted-foreground">Net mensuel à ce palier</span>
          <b className="mt-1 block text-[15px] tabular-nums">{money(recognition.netMonthly)}</b>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recognition.facts.map((fact) => (
          <span
            key={fact}
            className="inline-flex min-h-11 items-center rounded-lg border border-[#e8ecf2] bg-[#f4f7fb] px-3 py-2 text-[13px] leading-snug text-[#1a2332]"
          >
            {fact}
          </span>
        ))}
      </div>
      {recognition.climbCopy ? <p className="text-[13px] font-medium text-[#1a2332]">{recognition.climbCopy}</p> : null}
      <p className="text-[12px] text-muted-foreground">
        Estimation de démonstration. La reconnaissance réelle dépend du permis, du CNP et de l’ordre.
      </p>
      <p className="text-[13px] text-[#1a2332]">
        À {recognition.recognizedYears} ans reconnus : {money(recognition.netMonthly)} net / mois.
      </p>
    </div>
  );
}

export function CalculatorsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const living = householdLiving(profile);
  if (slide === 1) return <CalculatorsLiving market={market} living={living} profile={profile} />;
  if (slide === 2) return <CalculatorsBudget market={market} profile={profile} />;
  return <CalculatorsNet market={market} living={living} />;
}

function CalculatorsNet({
  market,
  living,
}: {
  market: HouseholdMarket;
  living: ReturnType<typeof householdLiving>;
}) {
  const other = market.accompanying;
  const lead = other
    ? "Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes."
    : "Le brut impressionne. Le net, c’est ça qui paie le loyer.";
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  const initialCode = provinceCode(market.province);
  const [drafts, setDrafts] = useState(() =>
    living.groups.map((group) => ({
      role: group.adult.role,
      gross: group.adult.mid,
      code: initialCode,
    })),
  );
  return (
    <OpportunitiesShell
      kicker="Calculateur · Salaire net"
      title="Combien reste-t-il réellement après les retenues ?"
      lead={lead}
      pills={pills}
      hero={sectionBanners.calculators}
    >
      <div className="grid shrink-0 gap-3">
        {living.groups.map((group) => {
          const draft = drafts.find((item) => item.role === group.adult.role) ?? {
            role: group.adult.role,
            gross: group.adult.mid,
            code: initialCode,
          };
          const net = draftNet(draft.gross, draft.code);
          const rows = compareNetByProvince(draft.gross);
          const patch = (next: Partial<typeof draft>) =>
            setDrafts((current) =>
              current.map((item) => (item.role === group.adult.role ? { ...item, ...next } : item)),
            );
          return (
            <Surface key={group.adult.role} className="@container p-4">
              <SectionLabel>
                {group.adult.label} · {group.adult.member.profession}
              </SectionLabel>
              <div className="mt-3 grid gap-3 @min-[28rem]:grid-cols-2 @min-[40rem]:grid-cols-[1fr_1fr_minmax(9rem,auto)]">
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Salaire annuel brut</span>
                  <Input
                    type="number"
                    value={draft.gross}
                    onChange={(event) => patch({ gross: Number(event.target.value) || 0 })}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Province</span>
                  <Select value={draft.code} onChange={(event) => patch({ code: event.target.value })}>
                    {Object.entries(provinceData).map(([code, province]) => (
                      <option key={code} value={code}>
                        {province.name}
                      </option>
                    ))}
                  </Select>
                </label>
                <div className="rounded-xl bg-secondary px-4 py-3">
                  <span className="text-[10px] uppercase text-muted-foreground">Net annuel estimatif</span>
                  <strong className="mt-1 block text-[22px] text-primary">{money(net.netAnnual)}</strong>
                  <small className="text-[12px] text-muted-foreground">
                    ≈ {money(net.netMonthly)} / mois
                  </small>
                </div>
              </div>
              <div className="mt-4 grid gap-4 @min-[36rem]:grid-cols-[minmax(10.5rem,0.85fr)_minmax(0,1.15fr)] @min-[36rem]:items-start">
                <NetDonut net={net} />
                <NetProvinceBars rows={rows} activeCode={draft.code} onSelect={(code) => patch({ code })} />
              </div>
              <p className="mt-3 text-[12px] text-muted-foreground">Estimation de démonstration.</p>
            </Surface>
          );
        })}
      </div>
    </OpportunitiesShell>
  );
}

function NetDonut({ net }: { net: ReturnType<typeof draftNet> }) {
  const netPct = Math.round(Math.min(1, Math.max(0, net.netRate)) * 100);
  const withholdPct = 100 - netPct;
  const radius = 14.5;
  const circumference = 2 * Math.PI * radius;
  const netLen = (netPct / 100) * circumference;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative grid size-[104px] shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" className="size-[104px] -rotate-90 text-primary" aria-hidden>
          <circle cx="18" cy="18" r={radius} fill="none" stroke="#e8eef5" strokeWidth="3.5" />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${netLen} ${circumference}`}
          />
        </svg>
        <strong className="absolute text-[20px] leading-none text-[#1a2332]">{netPct} %</strong>
      </div>
      <ul className="grid min-w-0 gap-1.5 text-[12px]">
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 shrink-0 rounded-full bg-primary" />
            Net
          </span>
          <strong className="tabular-nums text-[#1a2332]">{money(net.netAnnual)}</strong>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 shrink-0 rounded-full bg-[#8fa3b8]" />
            Retenues
          </span>
          <strong className="tabular-nums text-[#1a2332]">{money(net.deductions)}</strong>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Taux de retenue</span>
          <strong className="tabular-nums text-[#1a2332]">{withholdPct} %</strong>
        </li>
      </ul>
    </div>
  );
}

function NetProvinceBars({
  rows,
  activeCode,
  onSelect,
}: {
  rows: ReturnType<typeof compareNetByProvince>;
  activeCode: string;
  onSelect: (code: string) => void;
}) {
  const max = Math.max(...rows.map((row) => row.netAnnual), 0);
  const best = rows[0];
  const other = best?.code === activeCode ? rows[1] : rows.find((row) => row.code === activeCode);
  const gap = best && other ? best.netAnnual - other.netAnnual : 0;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-muted-foreground">Net annuel par province</p>
      <div className="mt-1.5 grid gap-1 @min-[36rem]:hidden">
        {rows.map((row) => {
          const active = row.code === activeCode;
          const width = max > 0 ? (row.netAnnual / max) * 100 : 0;
          return (
            <button
              key={row.code}
              type="button"
              aria-pressed={active}
              aria-label={`${row.name}, net ${money(row.netAnnual)}`}
              onClick={() => onSelect(row.code)}
              className="grid cursor-pointer grid-cols-[minmax(4.5rem,8rem)_minmax(0,1fr)_4.25rem] items-center gap-2 text-left"
            >
              <span className={cn("truncate text-[12px]", active ? "font-semibold text-[#1a2332]" : "text-[#4b5565]")}>
                {row.name}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-[#e8eef5]">
                <div
                  className={cn("h-full rounded-full", active ? "bg-primary" : "bg-ir-blue2/70")}
                  style={{ width: `${width}%` }}
                />
              </div>
              <strong className="text-right text-[12px] tabular-nums text-[#1a2332]">{money(row.netAnnual)}</strong>
            </button>
          );
        })}
      </div>
      <div className="mt-2 hidden h-[148px] items-end gap-0.5 @min-[36rem]:flex">
        {rows.map((row) => {
          const active = row.code === activeCode;
          const height = max > 0 ? (row.netAnnual / max) * 100 : 0;
          return (
            <button
              key={row.code}
              type="button"
              title={`${row.name} · ${money(row.netAnnual)}`}
              aria-pressed={active}
              aria-label={`${row.name}, net ${money(row.netAnnual)}`}
              onClick={() => onSelect(row.code)}
              className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1"
            >
              <div className="flex h-[118px] w-full items-end justify-center">
                <span
                  className={cn("w-full max-w-[18px] rounded-t-md", active ? "bg-primary" : "bg-ir-blue2/70")}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {row.code}
              </span>
            </button>
          );
        })}
      </div>
      {gap > 0 && best && other ? (
        <p className="mt-2 text-[12px] text-muted-foreground">
          En {best.name}, il reste {money(gap)} de plus par an qu’en {other.name}.
        </p>
      ) : null}
    </div>
  );
}

function CalculatorsLiving({
  market,
  living,
  profile,
}: {
  market: HouseholdMarket;
  living: ReturnType<typeof householdLiving>;
  profile: Profile;
}) {
  const pills = [market.family, market.province, ...menuLensPills(profile), ...market.adults.map((adult) => adult.member.profession)];
  const setProject = useProfileStore((s) => s.setProject);
  const activeCode = provinceCode(market.province);
  const [netMonthly, setNetMonthly] = useState(living.combinedNetMonthly);
  const [rent, setRent] = useState(living.rent);
  const [other, setOther] = useState(living.other);
  useEffect(() => {
    setRent(provinceData[activeCode]?.rent ?? 0);
  }, [activeCode]);
  const draft = draftLiving(netMonthly, rent, other);
  const rows = compareLivingByProvince(draft.combinedNetMonthly, {
    other: draft.other,
    rentOverride: { code: activeCode, rent: draft.rent },
  });
  return (
    <OpportunitiesShell
      kicker="Calculateur · Coût de la vie"
      title={smart("Que vaut ce salaire à {province} ?", profile)}
      lead="Un salaire n’existe pas tout seul. Il se mesure au loyer."
      pills={pills}
      hero={sectionBanners.calculators}
    >
      <Surface className="@container p-4">
        <SectionLabel>
          {market.family} · {market.province}
        </SectionLabel>
        {living.groups.length > 1 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {living.groups.map((group) => (
              <div key={group.adult.role} className="rounded-[10px] border border-border bg-white p-3">
                <span className="block text-[10px] text-muted-foreground">
                  {group.adult.label} · {group.adult.member.profession}
                </span>
                <b className="mt-1 block text-sm">{money(group.netMonthly)} / mois</b>
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-3 ir-auto-grid">
          <LivingMoneyField label="Net mensuel" value={netMonthly} onChange={setNetMonthly} />
          <LivingMoneyField label="Loyer indicatif" value={rent} onChange={setRent} />
          <LivingMoneyField label="Autres dépenses estimées" value={other} onChange={setOther} />
          <div className="rounded-[14px] border border-transparent bg-linear-to-br from-primary to-ir-deep p-5 text-white">
            <span className="block text-[10px] uppercase opacity-75">Reste estimatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(draft.remainder)}</strong>
          </div>
        </div>
        <div className="mt-4 grid gap-4 @min-[36rem]:grid-cols-[minmax(10.5rem,0.85fr)_minmax(0,1.15fr)] @min-[36rem]:items-start">
          <LivingDonut living={draft} />
          <LivingProvinceBars
            rows={rows}
            activeCode={activeCode}
            onSelect={(code) => setProject("province", provinceData[code]?.name ?? market.province)}
          />
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground">Estimation de démonstration.</p>
      </Surface>
    </OpportunitiesShell>
  );
}

function LivingMoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-[14px] border border-border bg-white p-5">
      <span className="block text-[10px] uppercase text-muted-foreground">{label}</span>
      <span className="mt-1.5 flex items-baseline gap-1">
        <Input
          type="number"
          min={0}
          aria-label={label}
          className="h-auto border-0 bg-transparent p-0 text-[26px] font-bold shadow-none [appearance:textfield] focus:border-transparent focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={value}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        />
        <span className="text-[18px] font-semibold text-[#1a2332]">$</span>
      </span>
    </label>
  );
}

function LivingDonut({ living }: { living: ReturnType<typeof draftLiving> }) {
  const net = living.combinedNetMonthly;
  const remainderPct = net > 0 ? Math.round(Math.min(1, Math.max(0, living.remainder / net)) * 100) : 0;
  const radius = 14.5;
  const circumference = 2 * Math.PI * radius;
  const remainderLen = (remainderPct / 100) * circumference;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative grid size-[104px] shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" className="size-[104px] -rotate-90 text-primary" aria-hidden>
          <circle cx="18" cy="18" r={radius} fill="none" stroke="#e8eef5" strokeWidth="3.5" />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${remainderLen} ${circumference}`}
          />
        </svg>
        <strong className="absolute text-[20px] leading-none text-[#1a2332]">{remainderPct} %</strong>
      </div>
      <ul className="grid min-w-0 gap-1.5 text-[12px]">
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 shrink-0 rounded-full bg-primary" />
            Reste
          </span>
          <strong className="tabular-nums text-[#1a2332]">{money(living.remainder)}</strong>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 shrink-0 rounded-full bg-[#8fa3b8]" />
            Loyer
          </span>
          <strong className="tabular-nums text-[#1a2332]">{money(living.rent)}</strong>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Autres dépenses</span>
          <strong className="tabular-nums text-[#1a2332]">{money(living.other)}</strong>
        </li>
      </ul>
    </div>
  );
}

function LivingProvinceBars({
  rows,
  activeCode,
  onSelect,
}: {
  rows: ReturnType<typeof compareLivingByProvince>;
  activeCode: string;
  onSelect: (code: string) => void;
}) {
  const max = Math.max(...rows.map((row) => row.remainder), 0);
  const best = rows[0];
  const other = best?.code === activeCode ? rows[1] : rows.find((row) => row.code === activeCode);
  const gap = best && other ? best.remainder - other.remainder : 0;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-muted-foreground">Reste mensuel par province</p>
      <div className="mt-1.5 grid gap-1 @min-[36rem]:hidden">
        {rows.map((row) => {
          const active = row.code === activeCode;
          const width = max > 0 ? (row.remainder / max) * 100 : 0;
          return (
            <button
              key={row.code}
              type="button"
              aria-pressed={active}
              aria-label={`${row.name}, reste ${money(row.remainder)}`}
              onClick={() => onSelect(row.code)}
              className="grid cursor-pointer grid-cols-[minmax(4.5rem,8rem)_minmax(0,1fr)_4.25rem] items-center gap-2 text-left"
            >
              <span className={cn("truncate text-[12px]", active ? "font-semibold text-[#1a2332]" : "text-[#4b5565]")}>
                {row.name}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-[#e8eef5]">
                <div
                  className={cn("h-full rounded-full", active ? "bg-primary" : "bg-ir-blue2/70")}
                  style={{ width: `${width}%` }}
                />
              </div>
              <strong className="text-right text-[12px] tabular-nums text-[#1a2332]">{money(row.remainder)}</strong>
            </button>
          );
        })}
      </div>
      <div className="mt-2 hidden h-[148px] items-end gap-0.5 @min-[36rem]:flex">
        {rows.map((row) => {
          const active = row.code === activeCode;
          const height = max > 0 ? (row.remainder / max) * 100 : 0;
          return (
            <button
              key={row.code}
              type="button"
              title={`${row.name} · ${money(row.remainder)}`}
              aria-pressed={active}
              aria-label={`${row.name}, reste ${money(row.remainder)}`}
              onClick={() => onSelect(row.code)}
              className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1"
            >
              <div className="flex h-[118px] w-full items-end justify-center">
                <span
                  className={cn("w-full max-w-[18px] rounded-t-md", active ? "bg-primary" : "bg-ir-blue2/70")}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {row.code}
              </span>
            </button>
          );
        })}
      </div>
      {gap > 0 && best && other ? (
        <p className="mt-2 text-[12px] text-muted-foreground">
          En {best.name}, il reste {money(gap)} de plus par mois qu’en {other.name}.
        </p>
      ) : null}
    </div>
  );
}

function CalculatorsBudget({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const study = profile.objective === "Études";
  const cost = study ? studyCost(profile) : undefined;
  const work = profile.objective === "Travail" ? workCost(profile) : undefined;
  const visit = profile.objective === "Visite" ? visitCost(profile) : undefined;
  const business = profile.objective === "Affaires" ? businessCost(profile) : undefined;
  const family = profile.objective === "Regroupement familial" ? familyCost(profile) : undefined;
  const funds = irccFundsFor(routeForObjective(profile.objective).id, profile);
  const pills = [...menuLensPills(profile), market.family, market.province];
  const honoraires = honorairesFor(profile);
  const honorairesCard = ["Honoraires IR", money(honoraires.total)] as const;
  const cards = cost
    ? ([
        honorairesCard,
        ["Scolarité (année 1)", money(cost.tuition)],
        ["Coût de vie (année 1)", money(cost.livingAnnual)],
        ["Preuve de fonds", money(cost.proofOfFunds)],
      ] as const)
    : work
      ? ([
          honorairesCard,
          ["Frais de permis", money(work.fees.total)],
          ["Coût de vie (année 1)", money(work.livingAnnual)],
          ["Fonds jusqu’au 1er salaire", money(work.settlementFunds)],
        ] as const)
      : visit
        ? ([
            honorairesCard,
            ["Frais de visa", money(visit.feesTotal)],
            ["Coût du séjour", money(visit.stayCost)],
            ["Fonds à démontrer", money(visit.fundsRequired)],
          ] as const)
        : business?.path?.id === "visitor"
          ? ([
              ["Frais de voyage", money(business.travelFunds)],
              ["Coût du séjour", money(business.stayShort)],
              ["Fonds à démontrer", money(business.capitalToShow)],
            ] as const)
          : business
            ? ([
                ["Investissement", money(business.investment)],
                ["Coût de vie (année 1)", money(business.livingAnnual)],
                ["Capital à démontrer", money(business.capitalToShow)],
              ] as const)
            : family
              ? ([
                  ["Frais de parrainage", money(family.feesTotal)],
                  ["Revenu exigé (MNI)", money(family.incomeRequired)],
                  ["Coût de vie (foyer réuni)", money(family.livingReunitedAnnual)],
                ] as const)
    : ([
        honorairesCard,
        ["Démarches & tests", "À estimer"],
        ["Installation", "À estimer"],
        ["Preuve de fonds IRCC", funds.amount != null ? money(funds.amount) : funds.headline],
      ] as const);
  return (
    <OpportunitiesShell
      kicker="Calculateur · Budget projet"
      title="Combien faut-il préparer pour démarrer ?"
      lead="Un projet Canada, ce n’est pas seulement des honoraires."
      pills={pills}
      hero={sectionBanners.calculators}
    >
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        {cards.map(([label, value]) => (
          <Surface key={label} className="p-5">
            <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
            <strong className="mt-2 block text-[24px] text-primary">{value}</strong>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

export function ProvincesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  if (slide === 1) return <ProvincesCompare market={market} profile={profile} />;
  return <ProvincesEstimator market={market} profile={profile} />;
}

function ProvincesEstimator({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const initialCode = defaultProvinceCode(profile);
  const [code, setCode] = useState(initialCode);
  const cities = citiesForProvince(code);
  const [cityId, setCityId] = useState(() => defaultCityId(profile));
  const selectedId = cities.some((city) => city.id === cityId) ? cityId : cities[0]?.id ?? "montreal";
  const family = profile.objective === "Regroupement familial";
  const extras = family ? reunitedLivingExtras(profile) : undefined;
  const catalog = livingBasket(profile, selectedId, extras);
  const [housing, setHousing] = useState(catalog.housing);
  const [grocery, setGrocery] = useState(catalog.grocery);
  const [transport, setTransport] = useState(catalog.transport);
  const [utilities, setUtilities] = useState(catalog.utilities);
  const [childcare, setChildcare] = useState(catalog.childcare);
  const [netMonthly, setNetMonthly] = useState(catalog.netMonthly);
  useEffect(() => {
    setHousing(catalog.housing);
    setGrocery(catalog.grocery);
    setTransport(catalog.transport);
    setUtilities(catalog.utilities);
    setChildcare(catalog.childcare);
    setNetMonthly(catalog.netMonthly);
  }, [
    selectedId,
    catalog.housing,
    catalog.grocery,
    catalog.transport,
    catalog.utilities,
    catalog.childcare,
    catalog.netMonthly,
  ]);
  const basket = withLivingOverrides(catalog, {
    housing,
    grocery,
    transport,
    utilities,
    childcare,
    netMonthly,
  });
  const pills = [
    market.family,
    market.province,
    ...(profile.objective === "Visite" ? ["Visite"] : []),
    ...(family ? ["Regroupement"] : []),
    ...(family && provinceCode(profile.province) === "QC" ? ["Délai plus long"] : []),
    ...menuLensPills(profile),
    ...market.adults.map((adult) => adult.member.profession),
  ];
  const rows = [
    ["Logement", basket.housing, setHousing],
    ["Épicerie", basket.grocery, setGrocery],
    ["Transport", basket.transport, setTransport],
    ["Services", basket.utilities, setUtilities],
    ...(basket.kids > 0 ? [["Garde d’enfants", basket.childcare, setChildcare] as const] : []),
  ] as Array<[string, number, (value: number) => void]>;
  return (
    <OpportunitiesShell
      kicker="Provinces · Coût de vie"
      title="Combien reste-t-il une fois la ville payée ?"
      lead={
        profile.objective === "Visite"
          ? "ce que coûte un mois sur place, pas une installation"
          : "Logement, épicerie, transport, services du foyer. Ce qui reste décide si la ville tient."
      }
      pills={pills}
      hero={sectionBanners.provinces}
    >
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-[10px] uppercase text-muted-foreground">Province</span>
          <Select
            value={code}
            onChange={(event) => {
              const next = event.target.value;
              setCode(next);
              setCityId(citiesForProvince(next)[0]?.id ?? "montreal");
            }}
          >
            {Object.entries(provinceData)
              .filter(([item]) => citiesForProvince(item).length > 0)
              .map(([item, province]) => (
                <option key={item} value={item}>
                  {province.name}
                </option>
              ))}
          </Select>
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] uppercase text-muted-foreground">Ville</span>
          <Select value={selectedId} onChange={(event) => setCityId(event.target.value)}>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Surface className="p-4">
        <SectionLabel>
          {basket.city.name} · {provinceData[basket.city.province]?.name ?? basket.city.province}
        </SectionLabel>
        <div className="mt-3 ir-auto-grid">
          {rows.map(([label, value, onChange]) => (
            <LivingMoneyField key={label} label={label} value={value} onChange={onChange} />
          ))}
        </div>
        <div className="mt-3 ir-equal-row">
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Panier mensuel</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.total)}</strong>
          </div>
          <LivingMoneyField label="Net du foyer" value={basket.netMonthly} onChange={setNetMonthly} />
          <div className="rounded-[14px] border border-transparent bg-linear-to-br from-primary to-ir-deep p-5 text-white">
            <span className="block text-[10px] uppercase opacity-75">Reste estimatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.remainder)}</strong>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground">Estimation de démonstration.</p>
      </Surface>
    </OpportunitiesShell>
  );
}

function ProvincesCompare({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const family = profile.objective === "Regroupement familial";
  const extras = family ? reunitedLivingExtras(profile) : undefined;
  const pills = [
    market.family,
    market.province,
    ...(profile.objective === "Visite" ? ["Visite"] : []),
    ...(family ? ["Regroupement"] : []),
    ...(family && provinceCode(profile.province) === "QC" ? ["Délai plus long"] : []),
    ...menuLensPills(profile),
  ];
  const [code, setCode] = useState(() => defaultProvinceCode(profile));
  const [selected, setSelected] = useState(() => compareIdsForProvince(defaultProvinceCode(profile), profile));
  const cities = citiesForProvince(code);
  const showCare = market.kids.length > 0;
  const baskets = selected
    .filter((id) => cities.some((city) => city.id === id))
    .map((id) => livingBasket(profile, id, extras));
  const headers = ["Ville", "Logement", "Épicerie", "Transport", "Services", ...(showCare ? ["Garde"] : []), "Panier", "Reste"];
  return (
    <OpportunitiesShell
      kicker="Provinces · Comparer"
      title="La même vie ne coûte pas le même prix."
      lead="Trois villes maximum. Celle qui laisse un reste rend le projet possible."
      pills={pills}
      hero={sectionBanners.provinces}
    >
      <label className="grid max-w-sm gap-1">
        <span className="text-[10px] uppercase text-muted-foreground">Province</span>
        <Select
          value={code}
          onChange={(event) => {
            const next = event.target.value;
            setCode(next);
            setSelected(compareIdsForProvince(next, profile));
          }}
        >
          {Object.entries(provinceData).map(([item, province]) => (
            <option key={item} value={item}>
              {province.name}
            </option>
          ))}
        </Select>
      </label>
      <div className="ir-option-grid">
        {cities.map((city) => {
          const on = selected.includes(city.id);
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelected((current) => nextCompareSelected(current, city.id))}
              className={cn(
                "ir-option-btn cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-medium transition",
                on ? "border-primary bg-primary text-white" : "border-border bg-white text-[#1a2332]",
              )}
            >
              {city.name}
            </button>
          );
        })}
      </div>
      {baskets.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">Choisissez jusqu’à trois villes pour comparer.</p>
      ) : (
        <Surface className="overflow-x-auto p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full border-separate border-spacing-y-1.5 text-[11px]">
            <thead>
              <tr className="text-left text-[9px] tracking-wide text-[#89929f] uppercase">
                {headers.map((header) => (
                  <th key={header} className="px-2.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baskets.map((basket) => (
                <tr key={basket.city.id}>
                  <td className="rounded-l-[9px] border border-r-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5 font-semibold">
                    {basket.city.name}
                  </td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.housing)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.grocery)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.transport)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.utilities)}</td>
                  {showCare ? <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.childcare)}</td> : null}
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5 font-semibold">{money(basket.total)}</td>
                  <td className="rounded-r-[9px] border border-l-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 font-semibold text-primary">
                    {money(basket.remainder)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      )}
    </OpportunitiesShell>
  );
}

function compareIdsForProvince(code: string, profile: Profile) {
  const local = citiesForProvince(code);
  const kept = defaultCompareIds(profile).filter((id) => local.some((city) => city.id === id));
  if (kept.length > 0) return [...kept];
  return local[0] ? [local[0].id] : [];
}

function Band({ label, value, featured = false }: { label: string; value: string; featured?: boolean }) {
  return (
    <div className={`rounded-[14px] border p-5 text-center ${featured ? "border-transparent bg-linear-to-br from-primary to-ir-deep text-white" : "border-border bg-white"}`}>
      <span className="block text-[12px] uppercase opacity-80">{label}</span>
      <strong className="mt-1.5 block text-[26px]">{value}</strong>
    </div>
  );
}

function Hero({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-[18px]">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <strong className="mt-1 block text-[23px] text-primary">{value}</strong>
    </Card>
  );
}
