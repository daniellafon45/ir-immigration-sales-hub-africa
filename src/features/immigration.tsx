import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileCheck,
  FilePlus,
  FileText,
  GraduationCap,
  Languages,
  ListChecks,
  Mail,
  MapPin,
  Plane,
  Scale,
  School,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { familyLinks } from "@/data/family-links";
import { irccFundsChip, irccFundsFor, type IrccFunds } from "@/data/ircc-funds";
import { fastestRouteId, irccTimeFor, irccTimesMeta, type IrccTime } from "@/data/ircc-times";
import { routes, type ImmigrationRoute } from "@/data/routes";
import { startupVisaNote, startupVisaPaused, businessPaths } from "@/data/business-paths";
import { businessThresholdsLabel } from "@/data/business-thresholds";
import { professionNoc } from "@/data/profession-noc";
import { Profile, familyHasSpouse } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { biometricsSolo, eta, visitFeesFor, visitorVisa, etaLikelyCountries } from "@/data/visit-fees";
import { visitPurposeById, visitPurposes } from "@/data/visit-purposes";
import { workPermits, workPermitById } from "@/data/work-permits";
import { NocSearchField } from "@/features/noc-search-field";
import { sectionBanners } from "@/data/section-banners";
import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";
import { businessCost } from "@/lib/business-cost";
import { closingDeckPills } from "@/lib/closing-pills";
import { COMPARE_LIMIT } from "@/lib/compare-select";
import { familyCost } from "@/lib/family-cost";
import { money } from "@/lib/format";
import { householdMarket } from "@/lib/household-market";
import { workPathways } from "@/lib/work-pathways";
import { recommendedScenarioId, routeById, routeForObjective } from "@/lib/route-paths";
import { studyCost } from "@/lib/study-cost";
import { studyDeckPills, studyProgramFor } from "@/lib/study-program";
import { cn } from "@/lib/utils";
import { smart } from "@/lib/smart-copy";
import { visitCost } from "@/lib/visit-cost";
import { workCost } from "@/lib/work-cost";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function RoutesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const selectedRoute = useDeckStore((s) => s.selectedRoute);
  const setRoute = useDeckStore((s) => s.setRoute);
  const aligned = routeForObjective(profile.objective);
  const route = routeById(selectedRoute);
  if (slide === 1) {
    return <RoutesDetail market={market} route={route} profile={profile} />;
  }
  return (
    <RoutesOverview
      market={market}
      profile={profile}
      selectedId={route.id}
      alignedId={aligned.id}
      onSelect={setRoute}
    />
  );
}

function RoutesOverview({
  market,
  profile,
  selectedId,
  alignedId,
  onSelect,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
  selectedId: string;
  alignedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <OpportunitiesShell
      kicker="Voies d’immigration"
      title="Une destination. Plusieurs chemins."
      lead="Le chemin dépend du foyer et de l’objectif, pas d’une brochure."
      pills={[market.family, market.province, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== profile.objective), ...closingDeckPills(profile)]}
      hero={sectionBanners.routes}
    >
      <div className="ir-auto-grid">
        {routes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "rounded-[14px] border bg-white p-4 text-left transition-shadow",
              item.id === selectedId
                ? "border-primary shadow-[0_8px_20px_rgba(11,57,121,.08)]"
                : "border-border hover:border-[#9dbbe0]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-extrabold text-primary uppercase">{item.tag}</span>
              {item.id === alignedId ? (
                <span className="rounded-lg bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Objectif
                </span>
              ) : null}
            </span>
            <strong className="mt-1.5 block text-base">{item.name}</strong>
            <small className="mt-1.5 block text-[#788291]">{item.fit}</small>
            <DelayChip time={irccTimeFor(item.id)} />
            <FundsChip funds={irccFundsFor(item.id, profile)} />
          </button>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function RoutesDetail({
  market,
  route,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  route: ReturnType<typeof routeById>;
  profile: Profile;
}) {
  const study = route.id === "study";
  const cost = study ? studyCost(profile) : undefined;
  const program = study ? studyProgramFor(profile) : undefined;
  const work = route.id === "work" ? workCost(profile) : undefined;
  const visit = route.id === "visit" ? visitCost(profile) : undefined;
  const business = route.id === "business" ? businessCost(profile) : undefined;
  const family = route.id === "family" ? familyCost(profile) : undefined;
  const pathways = route.id === "work" ? workPathways(profile) : undefined;
  return (
    <OpportunitiesShell
      kicker="Voies · Détail"
      title={route.name}
      lead={`Pour qui : ${route.fit}.`}
      pills={[market.family, route.tag, ...studyDeckPills(profile), ...closingDeckPills(profile)]}
      hero={sectionBanners.routes}
    >
      <DelayBanner time={irccTimeFor(route.id)} />
      <FundsBanner funds={irccFundsFor(route.id, profile)} />
      {cost ? <StudyClosingCards cost={cost} programName={program?.name} /> : null}
      {work ? <WorkClosingCards cost={work} pathways={pathways ?? work.pathways} profile={profile} /> : null}
      {visit ? <VisitClosingCards cost={visit} profile={profile} /> : null}
      {business ? <BusinessClosingCards cost={business} profile={profile} /> : null}
      {family ? <FamilyClosingCards cost={family} profile={profile} /> : null}
      <div className="grid min-h-0 items-stretch gap-3 lg:grid-cols-2">
        <Surface className="h-full p-4">
          <SectionLabel>Conditions</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
            {route.conditions.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="h-full p-4">
          <SectionLabel>Points positifs</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#295f43]">
            {route.positives.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </Surface>
      </div>
      <Surface className="w-full p-4">
        <SectionLabel>Points d’attention</SectionLabel>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {route.attention.map((item) => (
            <li key={item} className="rounded-xl bg-[#fff6e8] px-3 py-2.5 text-[13px] leading-6 text-[#8c5a1d]">
              ⚠ {item}
            </li>
          ))}
        </ul>
      </Surface>
      <Surface className="w-full p-4">
        <SectionLabel>Étapes</SectionLabel>
        <div className="mt-4">
          <RouteSteps steps={route.steps} />
        </div>
      </Surface>
      <p className="text-[12px] text-muted-foreground">Aperçu de démonstration. Pas un avis juridique.</p>
    </OpportunitiesShell>
  );
}

function StudyClosingCards({
  cost,
  programName,
}: {
  cost: ReturnType<typeof studyCost>;
  programName?: string;
}) {
  const tuitionValue = programName
    ? money(cost.tuition)
    : `${money(cost.tuitionLow)} – ${money(cost.tuitionHigh)}`;
  return (
    <>
      <Surface className="flex min-h-0 flex-col p-4">
        <SectionLabel>Tarifs d’études internationaux · par année</SectionLabel>
        {programName ? (
          <p className="mt-1.5 text-[13px] leading-snug text-[#1a2332]">
            <strong>{programName}</strong>
            {cost.programLevel ? ` · ${cost.programLevel}` : ""} · {money(cost.tuition)} / an
          </p>
        ) : null}
        <div className="mt-3 max-h-[min(42vh,22rem)] overflow-y-auto rounded-xl border border-[#d7e4f3] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Province / territoire</th>
                <th className="px-3 py-2 text-right">Cégep</th>
                <th className="px-3 py-2 text-right">Université</th>
              </tr>
            </thead>
            <tbody>
              {cost.grid.map((row) => (
                <tr
                  key={row.code}
                  className={cn(
                    "border-t border-[#e5eaf0]",
                    row.selected && "bg-[#eef5ff] font-semibold text-primary",
                  )}
                >
                  <td className="px-3 py-1.5">{row.name}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(row.cegep)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(row.university)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
      <div className={cn("grid min-h-0 gap-3", cost.spouse ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        <Surface className="p-4">
          <SectionLabel>Année 1 · Foyer</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Coût de vie annuel" value={money(cost.livingAnnual)} />
            <FactLine label={`Fonds de subsistance ${cost.fundsLabel}`} value={money(cost.subsistence)} />
            <FactLine label="Scolarité année 1" value={tuitionValue} />
            <FactLine label="Preuve de fonds" value={money(cost.proofOfFunds)} featured />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.fundsLabel} demande {money(cost.subsistence)} · vivre coûte {money(cost.livingAnnual)}
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>{programName ? "Après le diplôme · Programme" : "Après le diplôme · Métier"}</SectionLabel>
          <p className="mt-1.5">
            <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
              {cost.student.profession}
            </span>
          </p>
          <div className="mt-3 ir-equal-row">
            <BandMini label="Bas" value={money(cost.student.low)} />
            <BandMini label="Médian" value={money(cost.student.mid)} featured />
            <BandMini label="Élevé" value={money(cost.student.high)} />
          </div>
          <dl className="mt-3 space-y-2 text-[13px]">
            <FactLine label="Rémunération de stage" value={money(cost.student.internshipMid)} />
            <FactLine
              label="Employabilité"
              value={`${cost.student.employability} % · ${cost.student.employabilityLabel}`}
            />
          </dl>
        </Surface>
        {cost.spouse ? (
          <Surface className="p-4">
            <SectionLabel>Pendant les études · Conjoint parrainé</SectionLabel>
            <p className="mt-1.5">
              <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.spouse.profession}
              </span>
            </p>
            <div className="mt-3 ir-equal-row">
              <BandMini label="Bas" value={money(cost.spouse.low)} />
              <BandMini label="Médian" value={money(cost.spouse.mid)} featured />
              <BandMini label="Élevé" value={money(cost.spouse.high)} />
            </div>
            <dl className="mt-3 space-y-2 text-[13px]">
              <FactLine
                label="Employabilité"
                value={`${cost.spouse.employability} % · ${cost.spouse.employabilityLabel}`}
              />
            </dl>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              Permis de travail ouvert pendant les études du candidat.
            </p>
          </Surface>
        ) : null}
      </div>
    </>
  );
}

function WorkClosingCards({
  cost,
  pathways,
  profile,
}: {
  cost: ReturnType<typeof workCost>;
  pathways: ReturnType<typeof workPathways>;
  profile: Profile;
}) {
  const setProject = useProfileStore((s) => s.setProject);
  const selectedPermit = workPermitById(profile.workPermitKind);
  const monthlyNet = Math.round(cost.salary.net / 12);
  return (
    <>
      <Surface className="p-4">
        <SectionLabel>Barre FEER</SectionLabel>
        <div className="mt-2">
          <NocSearchField
            value={profile.workNocCode}
            onChange={(code) => setProject("workNocCode", code)}
            suggestionCode={professionNoc(profile.applicant.profession)}
          />
        </div>
        {pathways.noc && pathways.title && pathways.teer !== null ? (
          <div className="mt-3 rounded-xl bg-secondary px-3 py-2.5 text-[12px] leading-relaxed text-[#1a2332]">
            <p className="font-semibold">{`CNP ${pathways.noc} · FEER ${pathways.teer} · ${pathways.title}`}</p>
            <p className="mt-1">{pathways.feerLegend}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span>Vérifiez sur IRCC.</span>
              <a
                href={pathways.sources.noc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Trouver votre CNP
                <ExternalLink className="size-3.5" strokeWidth={2} />
              </a>
            </div>
          </div>
        ) : null}
      </Surface>
      <div className={cn("grid min-h-0 gap-3", cost.spouse ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        <Surface className="p-4">
          <SectionLabel>Permis · Ouvert ou fermé</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {workPermits.map((permit) => {
              const outcome = pathways.permits.find((item) => item.kind === permit.id);
              return (
                <span
                  key={permit.id}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-medium",
                    outcome?.possible ? "bg-secondary text-primary" : "bg-[#eef2f6] text-[#7a8594]",
                  )}
                  title={outcome?.reason}
                >
                  {permit.name}
                </span>
              );
            })}
          </div>
          <dl className="mt-3 space-y-2 text-[13px]">
            <FactLine
              label="Offre requise"
              value={
                selectedPermit
                  ? selectedPermit.needsOffer
                    ? profile.workHasOffer
                      ? "Oui, cochée"
                      : "Oui, à obtenir"
                    : "Non"
                  : "Selon le volet"
              }
            />
            <FactLine label="Traitement" value={money(cost.fees.permit)} />
            <FactLine
              label="+100 $ détenteur ouvert"
              value={cost.fees.openHolder > 0 ? money(cost.fees.openHolder) : "Non"}
            />
            <FactLine label="Biométrie" value={money(cost.fees.biometrics)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {selectedPermit
              ? pathways.permits.find((item) => item.kind === selectedPermit.id)?.reason
              : "Choisissez un type de permis"}
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Renouvellement</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Quand déposer" value="Avant l’échéance, statut conservé" />
            <FactLine
              label="Ce qui reste permis en attendant"
              value={pathways.renewal.openCanChangeEmployer ? "Ouvert/IEC = changement d’employeur possible" : "Fermé = mêmes conditions"}
            />
            <FactLine label="Frais" value={money(pathways.renewal.fees.total)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Voir sur IRCC pour les conditions de prolongation.
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Vers la RP · Après une période</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="CEC" value={pathways.prAfter.label} />
            <FactLine label="Invitation" value="Jamais garantie" />
          </dl>
          <a
            href={pathways.sources.cec}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            Voir sur IRCC
            <ExternalLink className="size-3.5" strokeWidth={2} />
          </a>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Année 1 · Foyer</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Salaire net mensuel approx" value={money(monthlyNet)} />
            <FactLine label="Panier annuel" value={money(cost.livingAnnual)} />
            <FactLine label="Fonds 3 mois" value={money(cost.settlementFunds)} />
            <FactLine label="Frais" value={money(cost.fees.total)} />
            <FactLine label="Écart mensuel" value={money(cost.gapMonthly)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {`le métier paie ${money(monthlyNet)} · vivre coûte ${money(Math.round(cost.livingAnnual / 12))}`}
          </p>
        </Surface>
        {cost.spouse ? (
          <Surface className="p-4 lg:col-span-2">
            <SectionLabel>Pendant le permis · Conjoint</SectionLabel>
            <p className="mt-1.5">
              <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.spouse.profession}
              </span>
            </p>
            <div className="mt-3 ir-equal-row">
              <BandMini label="Bas" value={money(cost.spouse.low)} />
              <BandMini label="Médian" value={money(cost.spouse.mid)} featured />
              <BandMini label="Élevé" value={money(cost.spouse.high)} />
            </div>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              {pathways.spouseOpen?.reason}
            </p>
          </Surface>
        ) : familyHasSpouse(profile.family) && pathways.spouseOpen && !pathways.spouseOpen.eligible ? (
          <Surface className="p-4 lg:col-span-2">
            <SectionLabel>Pendant le permis · Conjoint</SectionLabel>
            <p className="mt-3 rounded-xl bg-[#fff6e8] px-3 py-2 text-[12px] leading-relaxed text-[#8c5a1d]">
              {pathways.spouseOpen.reason}
            </p>
          </Surface>
        ) : null}
      </div>
    </>
  );
}

function VisitClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof visitCost>;
  profile: Profile;
}) {
  const people = cost.accompanying ? cost.accompanying.adults + cost.accompanying.kids : 1;
  const fees = visitFeesFor(profile.country, people);
  const soloFees = visitFeesFor(profile.country, 1);
  const purpose = visitPurposeById(cost.purpose);
  const accompanyingTravelers = [
    ...(familyHasSpouse(profile.family) && profile.spouse.firstName.trim() ? [profile.spouse.firstName.trim()] : []),
    ...profile.children.map((child) => child.firstName || "Enfant"),
  ];
  const durationLabel = {
    "15d": "15 jours",
    "1m": "1 mois",
    "3m": "3 mois",
    "6m": "6 mois",
  }[cost.duration];
  return (
    <div className={cn("grid min-h-0 gap-3", cost.accompanying ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="p-4">
        <SectionLabel>Frais de voyage · Visa / eTA / biométrie</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Frais</th>
                <th className="px-3 py-2 text-right">Par personne</th>
                <th className="px-3 py-2 text-right">Foyer</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#e5eaf0]">
                <td className="px-3 py-1.5">Visa visiteur</td>
                <td className="px-3 py-1.5 text-right tabular-nums">
                  {fees.documentType === "visa" ? money(visitorVisa) : "Non"}
                </td>
                <td className="px-3 py-1.5 text-right tabular-nums">
                  {fees.documentType === "visa" ? money(fees.documentTotal) : "Non"}
                </td>
              </tr>
              <tr className="border-t border-[#e5eaf0]">
                <td className="px-3 py-1.5">eTA</td>
                <td className="px-3 py-1.5 text-right tabular-nums">
                  {fees.documentType === "eta" ? money(eta) : "Non"}
                </td>
                <td className="px-3 py-1.5 text-right tabular-nums">
                  {fees.documentType === "eta" ? money(fees.documentTotal) : "Non"}
                </td>
              </tr>
              <tr className="border-t border-[#e5eaf0]">
                <td className="px-3 py-1.5">Biométrie</td>
                <td className="px-3 py-1.5 text-right tabular-nums">{money(biometricsSolo)}</td>
                <td className="px-3 py-1.5 text-right tabular-nums">{money(fees.biometricsTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
            {profile.country}
          </span>
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
            {etaLikelyCountries.includes(profile.country.trim() ?? "")
              ? "eTA possible selon le passeport"
              : "Visa visiteur requis"}
          </span>
        </div>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Séjour · Foyer</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Durée" value={cost.assumedDuration ? `${durationLabel} · aperçu` : durationLabel} />
          <FactLine label="Coût du séjour" value={money(cost.stayCost)} />
          <FactLine label="Fonds à démontrer" value={money(cost.fundsRequired)} />
          <FactLine label="Frais de demande foyer" value={money(cost.feesTotal)} />
          <FactLine label="Aller-retour" value={money(cost.ticketsDemo)} />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`IRCC n’a pas de grille unique · un séjour de cette durée coûte environ ${money(cost.stayCost)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Motif et attaches</SectionLabel>
        {cost.assumedPurpose ? (
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#1a2332]">
            {visitPurposes.map((item) => (
              <li key={item.id}>· {item.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px] font-semibold text-[#1a2332]">{purpose?.name}</p>
        )}
        <ul className="mt-3 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
          {(purpose?.ties ?? []).map((item) => (
            <li key={item}>· {item}</li>
          ))}
          {cost.purpose === "family" ? <li>· invitation / hôte utile</li> : null}
        </ul>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {cost.canWork ? "travail possible" : "un visa visiteur n’autorise pas à travailler ni à étudier"}
        </p>
      </Surface>
      {cost.accompanying ? (
        <Surface className="p-4">
          <SectionLabel>Accompagnants</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine
              label="Qui voyage"
              value={accompanyingTravelers.length > 0 ? accompanyingTravelers.join(", ") : "Foyer accompagnant"}
            />
            <FactLine label="Frais additionnels" value={money(fees.total - soloFees.total)} />
          </dl>
          <ul className="mt-3 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
            {accompanyingTravelers.map((traveler, index) => (
              <li key={`${traveler}-${index}`}>· {traveler} · Statut visiteur</li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Pas de permis de travail, pas d’école sans permis d’études.
          </p>
        </Surface>
      ) : null}
    </div>
  );
}

function BusinessClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof businessCost>;
  profile: Profile;
}) {
  const visitor = cost.path?.id === "visitor";
  return (
    <div className={cn("grid min-h-0 gap-3", cost.spouse ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="flex min-h-0 flex-col p-4 lg:col-span-2">
        <SectionLabel>Volets · Seuils d’investissement</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {businessPaths.map((path) => (
            <span
              key={path.id}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-medium",
                profile.businessPath === path.id ? "bg-secondary text-primary" : "bg-white text-[#1a2332] ring-1 ring-border",
              )}
            >
              {path.name}
            </span>
          ))}
          {startupVisaPaused ? (
            <span className="rounded-lg bg-[#fff6e8] px-2.5 py-1 text-[11px] font-medium text-[#8c5a1d]">
              pause IRCC, pas de nouvelles demandes
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          {startupVisaNote} {businessThresholdsLabel}
        </p>
        {/* 13 provinces/territories */}
        <div className="mt-3 max-h-[min(42vh,22rem)] overflow-y-auto rounded-xl border border-[#d7e4f3] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Province</th>
                <th className="px-3 py-2 text-right">C11 / fonds de roulement</th>
                <th className="px-3 py-2 text-right">Entrepreneur provincial</th>
              </tr>
            </thead>
            <tbody>
              {cost.grid.map((row) => (
                <tr
                  key={row.code}
                  className={cn("border-t border-[#e5eaf0]", row.selected && "bg-[#eef5ff] font-semibold text-primary")}
                >
                  <td className="px-3 py-1.5">{row.name}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(row.c11)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(row.pnp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {cost.path
            ? cost.path.needsInvestment
              ? `${cost.path.name} · seuil ${money(cost.investment)}`
              : `${cost.path.name} · pas un seuil d’investissement`
            : "Selon le projet"}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Année 1 · Capital</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          {visitor ? (
            <>
              <FactLine label="Frais de voyage" value={money(cost.travelFunds)} />
              <FactLine label="Coût du séjour" value={money(cost.stayShort)} />
            </>
          ) : (
            <>
              <FactLine
                label="Investissement / fonds de roulement"
                value={cost.investment > 0 ? money(cost.investment) : "Selon le projet"}
              />
              <FactLine
                label="Coût de vie annuel du foyer"
                value={cost.livingAnnual > 0 ? money(cost.livingAnnual) : "Selon le projet"}
              />
            </>
          )}
          <FactLine label="Fonds personnels approx" value={money(cost.personalFunds)} />
          <FactLine label="Capital à démontrer" value={money(cost.capitalToShow)} featured />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`le volet demande ${money(cost.capitalToShow)} · la capacité affichée est ${money(cost.personalFunds)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Projet · Crédibilité</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
            Expérience · {cost.credibility.experienceYears} ans
          </span>
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
            {cost.credibility.fundsLabel} · {money(cost.credibility.fundsAmount)}
          </span>
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
            {cost.credibility.province} · {cost.credibility.pathName}
          </span>
        </div>
        {cost.path ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.path.caution}
          </p>
        ) : null}
      </Surface>
      {cost.spouse ? (
        <Surface className="p-4">
          <SectionLabel>Pendant le projet · Conjoint</SectionLabel>
          <p className="mt-1.5">
            <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
              {cost.spouse.profession}
            </span>
          </p>
          {cost.spouse.openWork ? (
            <>
              <div className="mt-3 ir-equal-row">
                <BandMini label="Bas" value={money(cost.spouse.low)} />
                <BandMini label="Médian" value={money(cost.spouse.mid)} featured />
                <BandMini label="Élevé" value={money(cost.spouse.high)} />
              </div>
              <dl className="mt-3 space-y-2 text-[13px]">
                <FactLine
                  label="Employabilité"
                  value={`${cost.spouse.employability} % · ${cost.spouse.employabilityLabel}`}
                />
              </dl>
              <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
                Permis de travail ouvert possible selon le volet.
              </p>
            </>
          ) : (
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              Visite, pas un permis de travail
            </p>
          )}
        </Surface>
      ) : null}
    </div>
  );
}

function FamilyClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof familyCost>;
  profile: Profile;
}) {
  const isQuebec = provinceCode(profile.province) === "QC";
  const qcDelay = cost.delay.tracks?.find((track) => track.label === "Québec")?.value;
  return (
    <div className="grid min-h-0 gap-3 lg:grid-cols-2">
      <Surface className="p-4">
        <SectionLabel>Liens admissibles · Délais</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Lien</th>
                <th className="px-3 py-2 text-right">Engagement</th>
                <th className="px-3 py-2 text-right">Hors Québec</th>
                <th className="px-3 py-2 text-right">Québec</th>
              </tr>
            </thead>
            <tbody>
              {familyLinks.map((link) => (
                <tr
                  key={link.id}
                  className={cn("border-t border-[#e5eaf0]", cost.link?.id === link.id && "bg-[#eef5ff] font-semibold text-primary")}
                >
                  <td className="px-3 py-1.5">
                    {link.id === "spouse" ? "Conjoint / partenaire" : link.id === "child" ? "Enfant à charge" : "Parent / grand-parent"}
                  </td>
                  <td className="px-3 py-1.5 text-right">{`${link.undertakingYears} ans`}</td>
                  {(() => {
                    const horsQc = cost.delay.tracks?.find((t) => t.label === "Hors Québec")?.value ?? cost.delay.headline ?? "";
                    const qc = cost.delay.tracks?.find((t) => t.label === "Québec")?.value ?? cost.delay.headline ?? "";
                    return (
                      <>
                        <td className="px-3 py-1.5 text-right">{horsQc}</td>
                        <td className="px-3 py-1.5 text-right">{qc}</td>
                      </>
                    );
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cost.sponsorStatus === "pr" ? (
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
              Résident permanent
            </span>
          ) : null}
          {cost.sponsorStatus === "citizen" ? (
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">Citoyen</span>
          ) : null}
          {!cost.sponsorStatus ? (
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
              Résident ou citoyen
            </span>
          ) : null}
          {cost.link?.id === "parent" ? (
            <span className="rounded-lg bg-[#fff6e8] px-2.5 py-1 text-[11px] font-medium text-[#8c5a1d]">
              super visa possible en parallèle
            </span>
          ) : null}
        </div>
        {isQuebec ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Au Québec, l’engagement suit les règles MIFI.
          </p>
        ) : null}
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Engagement · Revenu</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Taille" value={String(cost.familySize)} />
          <FactLine label="Revenu exigé" value={money(cost.incomeRequired)} />
          <FactLine label="Revenu approx répondant" value={money(cost.sponsorMid)} />
          <FactLine label="Fonds / aisance" value={money(cost.sponsorCapacity)} />
          {cost.undertakingYears ? <FactLine label="Durée" value={`${cost.undertakingYears} ans`} /> : null}
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`le seuil demande ${money(cost.incomeRequired)} · le métier paie ${money(cost.sponsorMid)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Frais et vie · Foyer réuni</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Frais" value={money(cost.feesTotal)} />
          <FactLine label="Coût de vie annuel réuni" value={money(cost.livingReunitedAnnual)} />
        </dl>
        {isQuebec ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {`Délai plus long au Québec${qcDelay ? ` · ${qcDelay}` : ""} et frais MIFI inclus dans cet ordre de grandeur.`}
          </p>
        ) : null}
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Personne parrainée</SectionLabel>
        {cost.link?.id === "spouse" && cost.sponsored ? (
          <>
            <p className="mt-1.5">
              <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.sponsored.profession}
              </span>
            </p>
            <div className="mt-3 ir-equal-row">
              <BandMini label="Bas" value={money(cost.sponsored.low)} />
              <BandMini label="Médian" value={money(cost.sponsored.mid)} featured />
              <BandMini label="Élevé" value={money(cost.sponsored.high)} />
            </div>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              {`Employabilité ${cost.sponsored.employability} % · ${cost.sponsored.employabilityLabel} · après l’arrivée : RP, droit de travailler`}
            </p>
          </>
        ) : null}
        {cost.reminder ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Ajoutez le conjoint au dossier pour afficher ses repères.
          </p>
        ) : null}
        {cost.childSponsored ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.childSponsored.inSchool
              ? `${cost.childSponsored.firstName || "Enfant"} · ${cost.childSponsored.age} ans · école après l’arrivée`
              : `${cost.childSponsored.firstName || "Enfant"} · ${cost.childSponsored.age} ans · études ou travail après l’arrivée, sans fourchette métier inventée`}
          </p>
        ) : null}
        {cost.link?.id === "child" && !cost.childSponsored ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Ajoutez un enfant pour afficher son repère d’arrivée.
          </p>
        ) : null}
        {cost.link?.id === "parent" ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Super visa vs parrainage, sans salaire projeté, avec engagement long.
          </p>
        ) : null}
        {!cost.link ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Choisissez un lien admissible pour afficher la personne parrainée.
          </p>
        ) : null}
      </Surface>
    </div>
  );
}

function FactLine({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-semibold tabular-nums", featured ? "text-primary" : "text-[#1a2332]")}>{value}</dd>
    </div>
  );
}

function BandMini({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div className={cn("rounded-[10px] border px-2 py-2 text-center", featured ? "border-primary bg-secondary" : "border-border bg-white")}>
      <span className="block text-[10px] uppercase text-muted-foreground">{label}</span>
      <strong className="mt-0.5 block text-[13px] tabular-nums">{value}</strong>
    </div>
  );
}

function RouteSteps({ steps }: { steps: string[] }) {
  return (
    <ol
      className="relative grid w-full grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
      style={{ ["--n" as string]: String(steps.length) }}
    >
      <span
        className="pointer-events-none absolute top-6 right-[calc(50%/var(--n))] left-[calc(50%/var(--n))] hidden h-0.5 bg-[#c7d7ea] xl:block"
        aria-hidden
      />
      {steps.map((step, index) => {
        const Icon = iconForStep(step);
        return (
          <li key={step} className="relative flex min-w-0 flex-col items-center px-1 text-center">
            <span className="relative z-[1] grid size-12 place-items-center rounded-2xl border border-[#d7e4f3] bg-white text-primary shadow-[0_8px_20px_rgba(11,57,121,.08)]">
              <Icon className="size-5" strokeWidth={1.8} />
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                {index + 1}
              </span>
            </span>
            <p className="mt-2.5 text-[12px] font-semibold leading-snug text-[#1a2332]">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function iconForStep(step: string): LucideIcon {
  const s = step.toLowerCase();
  if (s.includes("langue")) return Languages;
  if (s.includes("diplôme")) return GraduationCap;
  if (s.includes("invitation") || s.includes("nomination")) return Mail;
  if (s.includes("traitement") || s.includes("décision") || s.includes("audience") || s.includes("fédérale")) return Scale;
  if (s.includes("créer le profil") || s.includes("préparer le profil")) return FilePlus;
  if (s.includes("évaluer le profil") || s.includes("évaluer si")) return ClipboardCheck;
  if (s.includes("conditions") || s.includes("respecter")) return ShieldCheck;
  if (s.includes("récit") || s.includes("preuves")) return FileText;
  if (s.includes("réseau")) return UsersRound;
  if (s.includes("motif")) return Target;
  if (s.includes("arrivée") || s.includes("voyage")) return Plane;
  if (s.includes("projet") || s.includes("voie")) return Target;
  if (s.includes("admission")) return School;
  if (s.includes("autorisation")) return ShieldCheck;
  if (s.includes("permis")) return BadgeCheck;
  if (s.includes("programme") || s.includes("volet") || s.includes("choisir la province")) return ListChecks;
  if (s.includes("étudier") || s.includes("carrière")) return BookOpen;
  if (s.includes("emploi") || s.includes("employeur")) return Briefcase;
  if (s.includes("fonds")) return Wallet;
  if (s.includes("lien") || s.includes("répondant") || s.includes("attaches")) return UsersRound;
  if (s.includes("déposer") || s.includes("soumettre") || s.includes("dossier")) return FileCheck;
  if (s.includes("suivi") || s.includes("vérifier")) return Search;
  if (s.includes("identifier")) return MapPin;
  return ClipboardCheck;
}

export function CompareSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const compareSelected = useDeckStore((s) => s.compareSelected);
  const toggleCompare = useDeckStore((s) => s.toggleCompare);
  const aligned = routeForObjective(profile.objective);
  if (slide === 1) return <CompareScenarios market={market} profile={profile} />;
  return (
    <CompareTable
      market={market}
      profile={profile}
      selectedIds={compareSelected}
      alignedId={aligned.id}
      onToggle={toggleCompare}
    />
  );
}

function CompareTable({
  market,
  profile,
  selectedIds,
  alignedId,
  onToggle,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
  selectedIds: string[];
  alignedId: string;
  onToggle: (id: string) => void;
}) {
  const selected = routes.filter((route) => selectedIds.includes(route.id)).slice(0, COMPARE_LIMIT);
  const fastestId = fastestRouteId(selected.map((route) => route.id));
  const atCap = selected.length >= COMPARE_LIMIT;
  return (
    <OpportunitiesShell
      kicker="Comparateur"
      title="Comparer les voies côte à côte."
      lead="Cochez jusqu’à trois voies. Les délais IRCC apparaissent en premier."
      pills={[market.family, market.province, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== "Études"), ...closingDeckPills(profile)]}
      hero={sectionBanners.compare}
    >
      <div className="flex flex-1 flex-col gap-3 pb-1">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <SectionLabel>Voies à comparer</SectionLabel>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {atCap
                ? "3 maximum. Cocher une autre voie remplace la plus ancienne."
                : selected.length === 0
                  ? "Choisissez jusqu’à trois voies pour comparer."
                  : "Cochez ou décochez : le comparatif suit immédiatement."}
            </p>
          </div>
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
            {selected.length}/{COMPARE_LIMIT} cochées
          </span>
        </div>
        <div className="ir-option-grid" role="group" aria-label="Voies à comparer">
          {routes.map((route) => {
            const on = selectedIds.includes(route.id);
            const aligned = route.id === alignedId;
            return (
              <button
                key={route.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => onToggle(route.id)}
                className={cn(
                  "ir-option-btn cursor-pointer justify-start gap-2 rounded-lg border px-2.5 text-[12px] font-medium transition active:scale-[0.98]",
                  on
                    ? "border-primary bg-primary text-white shadow-[0_8px_18px_rgba(27,84,141,.18)]"
                    : "border-border bg-white text-[#1a2332] hover:border-primary/50 hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-[4px] border",
                    on ? "border-white bg-white text-primary" : "border-[#b7c4d4] bg-white",
                  )}
                  aria-hidden
                >
                  {on ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                {route.name}
                {aligned ? (
                  <span
                    className={cn(
                      "rounded-lg px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                      on ? "bg-white/18 text-white" : "bg-secondary text-primary",
                    )}
                  >
                    Profil
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {selected.length === 0 ? (
          <Surface className="grid flex-1 place-items-center p-8 text-center">
            <div className="max-w-[42ch]">
              <Clock className="mx-auto size-8 text-primary" strokeWidth={1.6} />
              <p className="mt-3 text-[15px] font-semibold text-[#1a2332]">Aucune voie sélectionnée</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Cochez jusqu’à trois voies. Le délai IRCC apparaît en premier, c’est souvent la question du foyer.
              </p>
            </div>
          </Surface>
        ) : (
          <>
            <IrccSourceBar />
            <div className="ir-auto-grid flex-1 items-stretch">
              {selected.map((route) => (
                <CompareColumn
                  key={route.id}
                  route={route}
                  time={irccTimeFor(route.id)}
                  funds={irccFundsFor(route.id, profile)}
                  fastest={route.id === fastestId}
                  aligned={route.id === alignedId}
                  onUncheck={() => onToggle(route.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </OpportunitiesShell>
  );
}

function CompareColumn({
  route,
  time,
  funds,
  fastest,
  aligned,
  onUncheck,
}: {
  route: ImmigrationRoute;
  time: IrccTime;
  funds: IrccFunds;
  fastest: boolean;
  aligned: boolean;
  onUncheck: () => void;
}) {
  const facts = [
    ["Preuve de fonds", funds.headline === "Selon le dossier" ? irccFundsChip(funds) : funds.headline],
    ["Objectif", route.tag],
    ["Profil type", route.fit],
    ["Condition", route.conditions[0] ?? "Selon le dossier"],
    ["Point fort", route.positives[0]],
    ["Attention", route.attention[0]],
  ] as const;
  return (
    <Surface className={cn("flex h-full min-h-min flex-col overflow-hidden", fastest && "ring-2 ring-primary/25")}>
      <div className={cn("px-4 py-3.5", fastest ? "bg-primary text-white" : "bg-secondary")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-[10px] font-semibold tracking-wide uppercase", fastest ? "text-white/70" : "text-primary")}>
              {route.tag}
            </p>
            <h3 className="mt-0.5 text-[16px] leading-tight font-semibold">{route.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {aligned ? (
              <span
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-semibold",
                  fastest ? "bg-white/15 text-white" : "bg-white text-primary",
                )}
              >
                Profil
              </span>
            ) : null}
            {fastest ? (
              <span className="rounded-lg bg-white/15 px-2 py-0.5 text-[10px] font-semibold">Plus rapide</span>
            ) : null}
            <button
              type="button"
              onClick={onUncheck}
              aria-label={`Retirer ${route.name}`}
              className={cn(
                "grid size-6 cursor-pointer place-items-center rounded-md",
                fastest ? "bg-white/15 text-white hover:bg-white/25" : "bg-white text-[#5b6b7c] hover:bg-white hover:text-primary",
              )}
            >
              <X className="size-3.5" strokeWidth={2.4} />
            </button>
          </div>
        </div>
        <p className={cn("mt-3 text-[28px] leading-none font-semibold tracking-tight", fastest ? "text-white" : "text-primary")}>
          {time.headline}
        </p>
        <p className={cn("mt-1.5 text-[12px]", fastest ? "text-white/75" : "text-[#5b6b7c]")}>{time.scope}</p>
      </div>
      {time.tracks ? (
        <div className="grid grid-cols-2 gap-px border-b border-[#e5eaf0] bg-[#e5eaf0]">
          {time.tracks.map((track) => (
            <div key={track.label} className="bg-white px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{track.label}</p>
              <p className="text-[12px] font-semibold text-[#1a2332]">{track.value}</p>
            </div>
          ))}
        </div>
      ) : null}
      <dl className="flex flex-1 flex-col gap-2 px-4 py-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-semibold tracking-wide text-[#89929f] uppercase">{label}</dt>
            <dd className="mt-0.5 text-[13px] leading-snug text-[#1a2332]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto shrink-0 border-t border-[#eef2f6] px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">{time.note}</p>
    </Surface>
  );
}

function DelayChip({ time }: { time: IrccTime }) {
  return (
    <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
      <Clock className="size-3.5" strokeWidth={2} />
      {time.headline}
    </span>
  );
}

function FundsChip({ funds }: { funds: IrccFunds }) {
  return (
    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a2332]">
      <Wallet className="size-3.5 text-primary" strokeWidth={2} />
      {irccFundsChip(funds)}
    </span>
  );
}

function DelayBanner({ time }: { time: IrccTime }) {
  return (
    <Surface className="grid shrink-0 gap-3 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-primary uppercase">
          Délai approximatif IRCC · {irccTimesMeta.updatedLabel}
        </p>
        <p className="mt-1 text-[26px] leading-none font-semibold tracking-tight text-primary">{time.headline}</p>
        <p className="mt-1.5 text-[13px] text-[#5b6b7c]">{time.scope}</p>
      </div>
      <div className="sm:text-right">
        {time.tracks ? (
          <div className="mb-2 flex flex-wrap gap-1.5 sm:justify-end">
            {time.tracks.map((track) => (
              <span key={track.label} className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-[#1a2332]">
                {track.label}: {track.value}
              </span>
            ))}
          </div>
        ) : null}
        <p className="text-[12px] leading-relaxed text-muted-foreground">{time.note}</p>
      </div>
    </Surface>
  );
}

function FundsBanner({ funds }: { funds: IrccFunds }) {
  return (
    <Surface className="grid shrink-0 gap-3 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-primary uppercase">
          Preuve de fonds IRCC · {funds.updatedLabel}
        </p>
        <p className="mt-1 text-[26px] leading-none font-semibold tracking-tight text-primary">{funds.headline}</p>
        <p className="mt-1.5 text-[13px] text-[#5b6b7c]">{funds.scope}</p>
      </div>
      <div className="sm:text-right">
        {funds.tracks ? (
          <div className="mb-2 flex flex-wrap gap-1.5 sm:justify-end">
            {funds.tracks.map((track) => (
              <span key={track.label} className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-[#1a2332]">
                {track.label}: {track.value}
              </span>
            ))}
          </div>
        ) : null}
        <p className="text-[12px] leading-relaxed text-muted-foreground">{funds.note}</p>
      </div>
    </Surface>
  );
}

function IrccSourceBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[1rem] border border-[#d7e4f3] bg-secondary px-3.5 py-2.5">
      <p className="inline-flex items-center gap-2 text-[12px] text-[#1a2332]">
        <Clock className="size-3.5 text-primary" strokeWidth={2} />
        Délais approximatifs {irccTimesMeta.sourceLabel}, {irccTimesMeta.updatedLabel}. Les temps réels varient selon le pays et le dossier.
      </p>
      <a
        href={irccTimesMeta.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
      >
        Vérifier sur canada.ca
        <ExternalLink className="size-3.5" strokeWidth={2} />
      </a>
    </div>
  );
}

function CompareScenarios({
  market,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
}) {
  const featured = recommendedScenarioId(profile);
  const scenarios = [
    ["A", "Aller vers la résidence permanente", "Explorer d’abord les voies économiques directes."],
    ["B", "Construire une expérience canadienne", "Études ou travail selon les conditions applicables."],
    ["C", "Maximiser l’employabilité", "Province + métier + carrière + immigration."],
    ["D", "Partir en famille", "Comparer coût, emploi du conjoint et installation."],
  ] as const;
  return (
    <OpportunitiesShell
      kicker="Comparateur · Scénarios"
      title={smart("Quel scénario correspond le mieux à {name} ?", profile)}
      lead="On choisit une logique de projet, pas un programme au hasard."
      pills={[market.family, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== "Études"), ...closingDeckPills(profile)]}
      hero={sectionBanners.compare}
    >
      <div className="ir-auto-grid">
        {scenarios.map(([id, title, copy]) => (
          <Surface key={id} className={cn("p-4", id === featured && "border-primary")}>
            <span className="flex items-center justify-between gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
                {id}
              </span>
              {id === featured ? (
                <span className="rounded-lg bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Foyer
                </span>
              ) : null}
            </span>
            <h3 className="mt-3 mb-2 text-base font-semibold">{title}</h3>
            <p className="text-[12px] leading-relaxed text-[#707987]">{copy}</p>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}
