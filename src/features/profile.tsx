import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Flag,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Plane,
  Plus,
  Trash2,
  User,
  UserRound,
  Users,
  UsersRound,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PageShell } from "@/components/layout/PageShell";
import canadaBanner from "@/assets/banners/canada.jpg";
import { personHeroImage } from "@/data/pitch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { countries } from "@/data/countries";
import { countryFlagHeroSrcSet, countryFlagHeroUrl, countryFlagSrcSet, countryFlagUrl } from "@/data/country-flags";
import {
  educationLevels,
  extraPrincipalMode,
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  familyOptions,
  featuredProvinces,
  financialCapacities,
  languageLevels,
  objectives,
  otherProvinces,
  sexes,
  type AdultMember,
  type Sex,
  type PrincipalMode,
  type Profile,
} from "@/data/profile";
import { provinceLever } from "@/lib/province-lever";
import {
  familyLinks,
} from "@/data/family-links";
import { businessPaths } from "@/data/business-paths";
import { visitPurposes } from "@/data/visit-purposes";
import { workPermits } from "@/data/work-permits";
import {
  familyLabel,
  getPrincipalMember,
  recommendPrincipal,
  type AdultScore,
} from "@/lib/principal";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile";
import { parseProfileFile, profileFileName, serializeProfileFile } from "@/lib/profile-file";
import { OccupationSearchField } from "@/features/occupation-search-field";
import { NocSearchField } from "@/features/noc-search-field";
import { applyOccupationPatch } from "@/lib/occupation-resolve";
import {
  groupStudyPrograms,
  searchStudyPrograms,
  studyLevelLabels,
  studyProgramById,
} from "@/data/study-programs";

const familyTiles: { value: (typeof familyOptions)[number]; label: string; icon: LucideIcon }[] = [
  { value: "Seul(e)", label: "Seul(e)", icon: User },
  { value: "Couple", label: "Couple", icon: Users },
  { value: "Couple + enfant(s)", label: "Couple + enfants", icon: UsersRound },
  { value: "Parent seul + enfant(s)", label: "Parent seul", icon: UserRound },
];

const objectiveIcons: Record<string, LucideIcon> = {
  "Résidence permanente": Landmark,
  Études: GraduationCap,
  Travail: Briefcase,
  Visite: Plane,
  Affaires: Building2,
  "Regroupement familial": HeartHandshake,
};

const provinceShort: Record<string, string> = {
  Québec: "QC",
  Ontario: "ON",
  Alberta: "AB",
  Manitoba: "MB",
  "Nouveau-Brunswick": "NB",
  "Colombie-Britannique": "BC",
  Saskatchewan: "SK",
  "Nouvelle-Écosse": "NS",
  "Île-du-Prince-Édouard": "PE",
  "Terre-Neuve-et-Labrador": "NL",
  Yukon: "YT",
  "Territoires du Nord-Ouest": "NT",
  Nunavut: "NU",
};

function isOtherProvince(name: string) {
  return (otherProvinces as readonly string[]).includes(name);
}

export function ProfileSection() {
  return <ProfileForm />;
}

function ProfileForm() {
  const draft = useProfileStore((s) => s.draft);
  const setProject = useProfileStore((s) => s.setProject);
  const patchApplicant = useProfileStore((s) => s.patchApplicant);
  const patchSpouse = useProfileStore((s) => s.patchSpouse);
  const addExtraSpouse = useProfileStore((s) => s.addExtraSpouse);
  const patchExtraSpouse = useProfileStore((s) => s.patchExtraSpouse);
  const removeExtraSpouse = useProfileStore((s) => s.removeExtraSpouse);
  const addChild = useProfileStore((s) => s.addChild);
  const patchChild = useProfileStore((s) => s.patchChild);
  const removeChild = useProfileStore((s) => s.removeChild);
  const commit = useProfileStore((s) => s.commit);
  const importDraft = useProfileStore((s) => s.importDraft);
  const analysis = recommendPrincipal(draft);
  const principal = getPrincipalMember(draft);
  const showSpouse = familyHasSpouse(draft.family);
  const polygamous = familyIsPolygamous(draft.family);
  const extraSpouses = polygamous ? draft.extraSpouses : [];
  const showChildren = familyHasChildren(draft.family);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [imported, setImported] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  function setFamily(value: string) {
    setProject("family", value);
    if (familyHasChildren(value) && !familyIsPolygamous(value) && draft.children.length === 0) addChild();
  }

  function patchAdult(who: "applicant" | "spouse" | string, patch: Partial<AdultMember>) {
    const next = applyOccupationPatch(patch);
    if (who === "applicant") patchApplicant(next);
    else if (who === "spouse") patchSpouse(next);
    else patchExtraSpouse(who, next);
  }

  function save() {
    commit();
    const current = useProfileStore.getState().draft;
    downloadJson(profileFileName(current), serializeProfileFile(current));
    setSaved(true);
  }

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    if (!imported) return;
    const timer = window.setTimeout(() => setImported(false), 1800);
    return () => window.clearTimeout(timer);
  }, [imported]);

  async function onImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const text = await file.text();
    const result = parseProfileFile(text);
    if (!result.ok) {
      setImportError(result.error);
      setImported(false);
      return;
    }
    importDraft(result.profile);
    setImportError(null);
    setImported(true);
  }

  return (
    <PageShell
      panel={
        <PrincipalPanel
          draft={draft}
          analysis={analysis}
          principal={principal}
          showSpouse={showSpouse}
          polygamous={polygamous}
          saved={saved}
          imported={imported}
          importError={importError}
          fileRef={fileRef}
          onImportFile={onImportFile}
          onImport={() => fileRef.current?.click()}
          onSave={save}
          onMode={(mode) => setProject("principalMode", mode)}
        />
      }
    >
          <header className="relative shrink-0 overflow-hidden rounded-[1.2rem] bg-primary px-4 py-4 text-white sm:px-6 sm:py-6">
            <img
              src={personHeroImage(principal)}
              alt=""
              className="absolute inset-0 size-full object-cover object-[80%_center]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
            <BrandLogo className="absolute top-3 right-3 z-10 size-11 rounded-lg ring-1 ring-white/20 sm:top-4 sm:right-4 sm:size-12" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pr-14 sm:pr-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">Profil client</p>
                <h1 className="mt-1 text-[24px] leading-tight font-semibold tracking-tight">
                  {principal.firstName || "Nouveau dossier"}
                </h1>
                <p className="mt-1 text-[13px] text-white/70">
                  {familyLabel(draft)} · {draft.province} · {draft.objective}
                </p>
                <p className="mt-1 text-[11px] text-white/55">Profil simplifié · détail en rendez-vous</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <MetaPill>{draft.country || "Pays"}</MetaPill>
                <MetaPill>{principal.profession}</MetaPill>
              </div>
            </div>
          </header>

          <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
            <SectionLabel>Situation familiale</SectionLabel>
            <div className="mt-2 ir-option-grid" style={{ "--ir-option-min": "6.5rem" }}>
              {familyTiles.map((tile) => (
                <ChoiceTile
                  key={tile.value}
                  selected={draft.family === tile.value}
                  icon={tile.icon}
                  label={tile.label}
                  onClick={() => setFamily(tile.value)}
                />
              ))}
            </div>

            <div className="mt-3">
              <SectionLabel>Objectif</SectionLabel>
              <div className="mt-1.5 ir-option-grid" style={{ "--ir-option-min": "7.5rem" }}>
                {objectives.map((option) => {
                  const Icon = objectiveIcons[option] ?? Flag;
                  return (
                    <Chip
                      key={option}
                      compact
                      selected={draft.objective === option}
                      onClick={() => setProject("objective", option)}
                      className="w-full min-w-0 justify-center"
                    >
                      <Icon className="size-3.5 shrink-0" strokeWidth={1.8} />
                      {option}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 grid items-stretch gap-3 @min-[36rem]:grid-cols-2">
              <div className="flex h-full min-h-0 flex-col">
                <SectionLabel>Destination</SectionLabel>
                <div className="mt-1.5 flex min-h-0 flex-1 flex-col justify-center">
                  <div className="ir-option-grid">
                    {featuredProvinces.map((option) => (
                      <Chip
                        key={option}
                        compact
                        title={option}
                        ariaLabel={option}
                        selected={draft.province === option}
                        className="w-full min-w-0 justify-center"
                        onClick={() => setProject("province", option)}
                      >
                        <span className="font-bold tracking-wide">{provinceShort[option] ?? option}</span>
                      </Chip>
                    ))}
                    <ProvinceOtherSelect
                      value={draft.province}
                      onChange={(v) => setProject("province", v)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex h-full min-h-0 flex-col">
                <SectionLabel>Pays d'origine</SectionLabel>
                <div className="mt-1.5 flex min-h-0 flex-1 items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <CountrySelect value={draft.country} onChange={(v) => setProject("country", v)} />
                  </div>
                  <CountryHeroFlag country={draft.country} />
                </div>
              </div>
            </div>
          </Surface>

          {polygamous ? (
            <div className="grid flex-1 gap-3">
              <PersonCard
                title="Candidat"
                member={draft.applicant}
                tone="navy"
                active={analysis.selected === "applicant"}
                score={analysis.applicantScore.total}
                simple
                onChange={(patch) => patchAdult("applicant", patch)}
              />
              <div className="flex items-center justify-between gap-3 px-0.5">
                <SectionLabel>Épouses</SectionLabel>
                {extraSpouses.length < 2 ? (
                  <Button variant="outline" size="sm" onClick={addExtraSpouse}>
                    <Plus className="size-3.5" />
                    Ajouter
                  </Button>
                ) : null}
              </div>
              <div className="ir-rise grid min-h-0 min-w-0 gap-3 @min-[34rem]:grid-cols-2">
                <PersonCard
                  title="Épouse 1"
                  member={draft.spouse}
                  tone="blue"
                  active={analysis.selected === "spouse"}
                  score={analysis.spouseScore.total}
                  simple
                  onChange={(patch) => patchAdult("spouse", patch)}
                />
                {extraSpouses.map((spouse, index) => {
                  const scored = analysis.adults.find((adult) => adult.role === extraPrincipalMode(spouse.id));
                  return (
                    <PersonCard
                      key={spouse.id}
                      title={`Épouse ${index + 2}`}
                      member={spouse}
                      tone="blue"
                      active={analysis.selected === extraPrincipalMode(spouse.id)}
                      score={scored?.score.total ?? 0}
                      simple
                      onChange={(patch) => patchAdult(spouse.id, patch)}
                      onRemove={extraSpouses.length > 1 ? () => removeExtraSpouse(spouse.id) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={cn("grid flex-1 items-stretch gap-3 min-w-0", showSpouse && "@min-[34rem]:grid-cols-2")}>
              <div className="h-full min-h-0">
                <PersonCard
                  title="Candidat"
                  member={draft.applicant}
                  tone="navy"
                  active={analysis.selected === "applicant"}
                  score={analysis.applicantScore.total}
                  simple
                  onChange={(patch) => patchAdult("applicant", patch)}
                />
              </div>
              {showSpouse ? (
                <div className="ir-rise h-full min-h-0">
                  <PersonCard
                    title="Conjoint"
                    member={draft.spouse}
                    tone="blue"
                    active={analysis.selected === "spouse"}
                    score={analysis.spouseScore.total}
                    simple
                    onChange={(patch) => patchAdult("spouse", patch)}
                  />
                </div>
              ) : null}
            </div>
          )}

          {showChildren ? (
            <Surface className="ir-rise shrink-0 p-3 sm:px-4 sm:py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <SectionLabel>Enfants</SectionLabel>
                <Button variant="outline" size="sm" onClick={addChild}>
                  <Plus className="size-3.5" />
                  Ajouter
                </Button>
              </div>
              <div className="grid gap-2 @min-[24rem]:grid-cols-2 @min-[48rem]:grid-cols-3">
                {draft.children.map((child, index) => (
                  <div
                    key={child.id}
                    className="flex min-w-0 flex-wrap items-end gap-2 rounded-xl border border-[#c5d8ee] bg-secondary p-2"
                  >
                    <span className="mb-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[12px] font-semibold text-primary shadow-sm">
                      {(child.firstName.trim()[0] || String(index + 1)).toUpperCase()}
                    </span>
                    <TextField
                      label="Prénom"
                      value={child.firstName}
                      onChange={(v) => patchChild(child.id, { firstName: v })}
                    />
                    <NumberField
                      className="w-[72px] shrink-0"
                      label="Âge"
                      value={child.age}
                      onChange={(v) => patchChild(child.id, { age: v })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mb-0.5 size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Retirer ${child.firstName || "l'enfant"}`}
                      onClick={() => removeChild(child.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Surface>
          ) : null}
    </PageShell>
  );
}

const SCORE_BARS: { key: keyof AdultScore; label: string; max: number }[] = [
  { key: "age", label: "Âge", max: 12 },
  { key: "language", label: "Langues", max: 18 },
  { key: "education", label: "Études", max: 10 },
  { key: "experience", label: "Expérience", max: 12 },
  { key: "occupation", label: "Métier", max: 9 },
  { key: "salary", label: "Capacité", max: 6 },
];

function downloadJson(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function PrincipalPanel({
  draft,
  analysis,
  principal,
  showSpouse,
  polygamous,
  saved,
  imported,
  importError,
  fileRef,
  onImportFile,
  onImport,
  onSave,
  onMode,
}: {
  draft: Profile;
  analysis: ReturnType<typeof recommendPrincipal>;
  principal: AdultMember;
  showSpouse: boolean;
  polygamous: boolean;
  saved: boolean;
  imported: boolean;
  importError: string | null;
  fileRef: RefObject<HTMLInputElement | null>;
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onSave: () => void;
  onMode: (mode: PrincipalMode) => void;
}) {
  const principalScore = analysis.selectedAdult.score;
  const lever = provinceLever(principal, draft.province);
  const kids = draft.children.filter((child) => child.firstName.trim() || child.age > 0);
  const extraReasons = analysis.reasons.slice(1);
  const comparable = analysis.adults.filter((adult) => adult.eligible);
  const modeOptions: Array<{ mode: PrincipalMode; label: string }> = [
    { mode: "auto", label: "Auto" },
    ...comparable.map((adult) => ({
      mode: adult.role,
      label: adult.role === "applicant"
        ? adult.member.firstName || "Candidat"
        : adult.member.firstName || adult.label,
    })),
  ];
  const modeCols = modeOptions.length <= 2 ? "grid-cols-2" : modeOptions.length === 3 ? "grid-cols-3" : "grid-cols-2";
  const scoreCols = comparable.length >= 3 ? "grid-cols-3" : comparable.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <img
        src={canadaBanner}
        alt=""
        className="absolute inset-0 size-full object-cover object-[center_30%]"
      />
      <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/82 to-ir-deep/88" />
      <div className="relative z-10 flex h-full min-h-0 flex-col p-4">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">Demandeur principal</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{principal.firstName || "—"}</p>
          <p className="mt-1 text-[14px] text-white/85">{familyLabel(draft)}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>

      {comparable.length > 1 ? (
        <div className={cn("mt-3 grid shrink-0 gap-2", scoreCols)}>
          {comparable.map((adult) => (
            <ScorePick
              key={adult.role}
              name={adult.member.firstName || adult.label}
              score={adult.score.total}
              active={analysis.selected === adult.role}
              onClick={() => onMode(adult.role)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 shrink-0">
          <ScorePick name={draft.applicant.firstName} score={analysis.applicantScore.total} active />
        </div>
      )}

      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className={cn("grid w-full shrink-0 gap-1.5", modeCols)}>
          {modeOptions.map(({ mode, label }) => (
            <Chip
              key={mode}
              compact
              selected={draft.principalMode === mode}
              onClick={() => onMode(mode)}
              inverted
              className="w-full min-w-0 justify-center"
            >
              {label}
            </Chip>
          ))}
        </div>

        <p className="mt-3 shrink-0 text-[14px] leading-snug text-white/90">{analysis.reasons[0]}</p>

        {extraReasons.map((reason) => (
          <p key={reason} className="text-[14px] leading-relaxed text-white/85">
            {reason}
          </p>
        ))}

        <PanelBlock title="Profil retenu">
          <FactRow label="Âge" value={`${principal.age} ans`} />
          <FactRow label="Métier" value={principal.profession} />
          <FactRow label="Diplôme" value={principal.education} />
          <FactRow label="Expérience" value={`${principal.experience} ans`} />
          <FactRow label="Langues" value={`FR ${principal.french} · EN ${principal.english}`} />
        </PanelBlock>

        <PanelBlock title="Lecture du dossier">
          <div className="space-y-1.5">
            {SCORE_BARS.map((bar) => (
              <ScoreBar key={bar.key} label={bar.label} value={principalScore[bar.key]} max={bar.max} />
            ))}
          </div>
        </PanelBlock>

        <PanelBlock title={`Levier ${draft.province}`}>
          <FactRow label={lever.requirementLabel} value={lever.requirementValue} />
          <FactRow label={lever.candidateLabel} value={lever.candidateValue} />
          {lever.positive ? (
            <p className="pt-0.5 text-[14px] font-semibold text-white">
              {lever.verdict}
            </p>
          ) : (
            <p className="pt-0.5 text-[14px] text-white/85">
              {lever.verdict}
            </p>
          )}
        </PanelBlock>

        {showSpouse || kids.length > 0 ? (
          <PanelBlock title="Foyer">
            {analysis.accompanying ? (
              <FactRow
                label={polygamous ? "Conjointe au dossier" : analysis.selected === "applicant" ? "Conjoint" : "Candidat"}
                value={`${analysis.accompanying.member.firstName || "—"} · ${analysis.accompanying.member.profession}`}
              />
            ) : null}
            {analysis.excluded.map((adult) => (
              <FactRow
                key={adult.role}
                label="Hors dossier"
                value={`${adult.member.firstName || adult.label} · ${adult.member.profession}`}
              />
            ))}
            {kids.map((child) => (
              <FactRow
                key={child.id}
                label="Enfant"
                value={`${child.firstName || "Enfant"} · ${child.age} ans`}
              />
            ))}
            {polygamous ? (
              <p className="pt-1 text-[13px] leading-snug text-white/80">
                Le Canada ne reconnaît qu’un conjoint. Une seule épouse peut accompagner le dossier.
              </p>
            ) : null}
          </PanelBlock>
        ) : null}
      </div>

      <div className="mt-3 shrink-0 space-y-2">
        {importError ? (
          <p className="text-[12px] leading-snug text-[#ffd4d4]">{importError}</p>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          aria-label="Importer un profil client"
          onChange={onImportFile}
        />
        <Button
          className="relative h-10 w-full rounded-xl bg-white/10 text-white hover:bg-white/16"
          onClick={onImport}
        >
          {imported ? <Check className="size-4" /> : <Upload className="size-4" />}
          {imported ? "Importé" : "Importer un profil client"}
        </Button>
        <Button
          className={cn(
            "relative h-10 w-full rounded-xl bg-white text-primary hover:bg-secondary",
            saved && "bg-[#e8f6ee] text-[#176b3a] hover:bg-[#e8f6ee]",
          )}
          onClick={onSave}
        >
          {saved ? <Check className="size-4" /> : null}
          {saved ? "Enregistré" : "Enregistrer"}
        </Button>
      </div>
      </div>
    </div>
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

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min((value / max) * 100, 100));
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between text-[12px] text-white/80">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StudyFields({
  programId,
  onChange,
}: {
  programId: string;
  onChange: (patch: { studyLevel?: string; studyProgramId?: string }) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1">
      <span className="text-[11px] font-medium text-muted-foreground">Programme visé</span>
      <ProgramSelect programId={programId} onChange={onChange} />
    </label>
  );
}

function WorkFields({
  nocCode,
  suggestionCode,
  permitKind,
  hasOffer,
  onChange,
}: {
  nocCode: string;
  suggestionCode?: string | null;
  permitKind: string;
  hasOffer: boolean;
  onChange: (patch: { workNocCode?: string; workPermitKind?: string; workHasOffer?: boolean }) => void;
}) {
  return (
    <div className="grid gap-2">
      <label className="grid min-w-0 gap-1">
        <span className="text-[11px] font-medium text-muted-foreground">Titre d’emploi ou code CNP</span>
        <NocSearchField
          value={nocCode}
          onChange={(code) => onChange({ workNocCode: code })}
          suggestionCode={suggestionCode}
        />
      </label>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Type de permis</legend>
        <div className="ir-option-grid">
          {workPermits.map((permit) => (
            <Chip
              key={permit.id}
              compact
              selected={permitKind === permit.id}
              onClick={() => onChange({ workPermitKind: permit.id })}
            >
              {permit.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Offre d’emploi</legend>
        <div className="ir-option-grid">
          <Chip compact selected={hasOffer} onClick={() => onChange({ workHasOffer: true })}>
            Offre d’emploi
          </Chip>
          <Chip compact selected={!hasOffer} onClick={() => onChange({ workHasOffer: false })}>
            Sans offre
          </Chip>
        </div>
      </fieldset>
    </div>
  );
}

function VisitFields({
  purpose,
  duration,
  onChange,
}: {
  purpose: string;
  duration: string;
  onChange: (patch: { visitPurpose?: string; visitDuration?: string }) => void;
}) {
  const durations = [
    { id: "15d", label: "15 jours" },
    { id: "1m", label: "1 mois" },
    { id: "3m", label: "3 mois" },
    { id: "6m", label: "6 mois" },
  ] as const;
  return (
    <div className="grid gap-2">
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Motif</legend>
        <div className="ir-option-grid">
          {visitPurposes.map((item) => (
            <Chip key={item.id} compact selected={purpose === item.id} onClick={() => onChange({ visitPurpose: item.id })}>
              {item.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Durée</legend>
        <div className="ir-option-grid">
          {durations.map((item) => (
            <Chip key={item.id} compact selected={duration === item.id} onClick={() => onChange({ visitDuration: item.id })}>
              {item.label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function BusinessFields({
  path,
  onChange,
}: {
  path: string;
  onChange: (patch: { businessPath?: string }) => void;
}) {
  // path.id !== "startup"
  return (
    <fieldset>
      <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Volet d’affaires</legend>
      <div className="ir-option-grid">
        {businessPaths.map((item) => (
          <Chip key={item.id} compact selected={path === item.id} onClick={() => onChange({ businessPath: item.id })}>
            {item.name}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function FamilyFields({
  link,
  sponsorStatus,
  showSpouseReminder,
  showChildReminder,
  onChange,
}: {
  link: string;
  sponsorStatus: string;
  showSpouseReminder: boolean;
  showChildReminder: boolean;
  onChange: (patch: { familyLink?: string; sponsorStatus?: string }) => void;
}) {
  const statuses = [
    { id: "pr", label: "Résident permanent" },
    { id: "citizen", label: "Citoyen" },
  ] as const;
  return (
    <div className="grid gap-2">
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Lien admissible</legend>
        <div className="ir-option-grid">
          {familyLinks.map((item) => (
            <Chip key={item.id} compact selected={link === item.id} onClick={() => onChange({ familyLink: item.id })}>
              {item.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Statut du répondant</legend>
        <div className="ir-option-grid">
          {statuses.map((item) => (
            <Chip
              key={item.id}
              compact
              selected={sponsorStatus === item.id}
              onClick={() => onChange({ sponsorStatus: item.id })}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      {showSpouseReminder ? (
        <p className="rounded-xl bg-secondary px-3 py-2 text-[12px] text-[#1a2332]">ajoutez le conjoint au dossier</p>
      ) : null}
      {showChildReminder ? (
        <p className="rounded-xl bg-secondary px-3 py-2 text-[12px] text-[#1a2332]">ajoutez un enfant</p>
      ) : null}
    </div>
  );
}

function PersonCard({
  title,
  member,
  tone,
  active,
  score,
  onChange,
  onRemove,
  simple = false,
  study,
  work,
  visit,
  business,
  family,
}: {
  title: string;
  member: AdultMember;
  tone: "navy" | "blue";
  active: boolean;
  score: number;
  onChange: (patch: Partial<AdultMember>) => void;
  onRemove?: () => void;
  simple?: boolean;
  study?: {
    programId: string;
    onChange: (patch: { studyLevel?: string; studyProgramId?: string }) => void;
  };
  work?: {
    nocCode: string;
    suggestionCode?: string | null;
    permitKind: string;
    hasOffer: boolean;
    onChange: (patch: { workNocCode?: string; workPermitKind?: string; workHasOffer?: boolean }) => void;
  };
  visit?: {
    purpose: string;
    duration: string;
    onChange: (patch: { visitPurpose?: string; visitDuration?: string }) => void;
  };
  business?: {
    path: string;
    onChange: (patch: { businessPath?: string }) => void;
  };
  family?: {
    link: string;
    sponsorStatus: string;
    showSpouseReminder: boolean;
    showChildReminder: boolean;
    onChange: (patch: { familyLink?: string; sponsorStatus?: string }) => void;
  };
}) {
  return (
    <Surface className={cn("flex h-full flex-col p-0 transition duration-200", active && "ring-2 ring-primary/30")}>
      <div className="@container flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2rem]">
      <div
        className={cn(
          "relative flex min-h-[72px] items-center gap-2.5 overflow-hidden rounded-t-[1.2rem] px-3 py-3 text-white",
          tone === "navy" ? "bg-primary" : "bg-ir-blue2",
        )}
      >
        <img src={personHeroImage(member)} alt="" className="absolute inset-0 z-0 size-full object-cover object-[80%_center]" />
        <div className="absolute inset-0 z-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
        <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-semibold">
          {initials(member.firstName)}
        </span>
        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium tracking-[0.12em] text-white/70 uppercase">{title}</p>
            <span className="flex items-center gap-1">
              {onRemove ? (
                <button
                  type="button"
                  aria-label={`Retirer ${title.toLowerCase()}`}
                  onClick={onRemove}
                  className="grid size-6 place-items-center rounded-md text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                  <Trash2 className="size-3.5" />
                </button>
              ) : null}
              {!simple ? (
                <span className="rounded-lg bg-white/15 px-2 py-0.5 text-[10px] font-semibold">{Math.round(Math.max(0, score))}</span>
              ) : null}
            </span>
          </div>
          <input
            aria-label={`Prénom ${title.toLowerCase()}`}
            value={member.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="Prénom"
            className="mt-0.5 w-full border-b border-transparent bg-transparent text-lg font-semibold tracking-tight outline-none placeholder:text-white/35 focus:border-white/40"
          />
        </div>
      </div>

      <div className="grid min-w-0 flex-1 content-start gap-2 p-3">
        <SexPicks
          label="Sexe"
          value={member.sex}
          onChange={(v) => onChange({ sex: v })}
        />
        <div className={cn("grid gap-2", simple ? "grid-cols-1 @min-[22rem]:grid-cols-2" : "grid-cols-2 @min-[22rem]:grid-cols-4")}>
          <NumberField label="Âge" value={member.age} onChange={(v) => onChange({ age: v })} />
          {!simple ? (
            <NumberField label="Exp. (ans)" value={member.experience} onChange={(v) => onChange({ experience: v })} />
          ) : null}
          <OccupationSearchField
            className={simple ? "@min-[22rem]:col-span-1" : "@min-[22rem]:col-span-2"}
            label="Métier"
            kind="profession"
            value={member.jobTitle || member.profession}
            onChange={(resolved, typed) =>
              onChange({
                profession: resolved,
                jobTitle: resolved === "Autre" ? typed : resolved,
                ...(resolved === member.profession ? { sector: member.sector } : {}),
              })
            }
          />
          <OccupationSearchField
            className={simple ? "@min-[22rem]:col-span-1" : "@min-[22rem]:col-span-2"}
            label="Secteur"
            kind="sector"
            value={member.sector}
            onChange={(resolved) => onChange({ sector: resolved })}
          />
          {!simple ? (
            <>
              <ChoiceField
                className="@min-[22rem]:col-span-2"
                label="Capacité financière"
                value={member.salary}
                options={financialCapacities}
                onChange={(v) => onChange({ salary: v as AdultMember["salary"] })}
              />
              <ChoiceField
                className="@min-[22rem]:col-span-2"
                label="Diplôme"
                value={member.education}
                options={educationLevels}
                onChange={(v) => onChange({ education: v })}
              />
            </>
          ) : null}
        </div>
        {!simple && study ? <StudyFields programId={study.programId} onChange={study.onChange} /> : null}
        {!simple && work ? (
          <WorkFields
            nocCode={work.nocCode}
            suggestionCode={work.suggestionCode}
            permitKind={work.permitKind}
            hasOffer={work.hasOffer}
            onChange={work.onChange}
          />
        ) : null}
        {!simple && visit ? <VisitFields purpose={visit.purpose} duration={visit.duration} onChange={visit.onChange} /> : null}
        {!simple && business ? <BusinessFields path={business.path} onChange={business.onChange} /> : null}
        {!simple && family ? (
          <FamilyFields
            link={family.link}
            sponsorStatus={family.sponsorStatus}
            showSpouseReminder={family.showSpouseReminder}
            showChildReminder={family.showChildReminder}
            onChange={family.onChange}
          />
        ) : null}
        {!simple ? (
          <>
            <LanguagePicks
              label="Français"
              value={member.french}
              onChange={(v) => onChange({ french: v })}
            />
            <LanguagePicks
              label="Anglais"
              value={member.english}
              onChange={(v) => onChange({ english: v })}
            />
          </>
        ) : null}
      </div>
      </div>
    </Surface>
  );
}

function ScorePick({
  name,
  score,
  active,
  onClick,
}: {
  name: string;
  score: number;
  active: boolean;
  onClick?: () => void;
}) {
  const max = 70;
  const pct = Math.max(0, Math.min(score / max, 1));
  const r = 20;
  const c = 2 * Math.PI * r;
  const content = (
    <>
      <span className="relative grid size-14 place-items-center">
        <svg width="56" height="56" viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="5" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${c * pct} ${c}`}
          />
        </svg>
        <strong className="text-[15px]">{Math.round(score)}</strong>
      </span>
      <span className="mt-1 block w-full truncate text-[13px] tracking-wide uppercase opacity-75">{name || "Profil"}</span>
    </>
  );

  const className = cn(
    "relative flex w-full flex-col items-center rounded-2xl px-2 py-2.5 text-center transition duration-200",
    active ? "bg-white/18" : "bg-white/8 hover:bg-white/14",
    onClick && "cursor-pointer",
  );

  if (!onClick) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-pressed={active}>
      {content}
    </button>
  );
}

function SexPicks({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Sex;
  onChange: (v: Sex) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</legend>
      <div className="ir-option-grid" role="radiogroup" aria-label={label}>
        {sexes.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={cn(
                "ir-option-btn font-semibold transition duration-180",
                selected
                  ? "bg-primary text-white shadow-[0_6px_14px_rgba(27,84,141,.22)]"
                  : "bg-secondary text-primary hover:bg-[#d4e4f2]",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function LanguagePicks({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</legend>
      <div className="ir-option-grid ir-option-grid--max-3" style={{ "--ir-option-min": "7rem" }} role="radiogroup" aria-label={label}>
        {languageLevels.map((level) => {
          const selected = value === level;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(level)}
              className={cn(
                "ir-option-btn font-semibold transition duration-180",
                selected
                  ? "bg-primary text-white shadow-[0_6px_14px_rgba(27,84,141,.22)]"
                  : "bg-secondary text-primary hover:bg-[#d4e4f2]",
              )}
            >
              {level}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Surface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[1.2rem] min-w-0 border border-[#e5eaf0] bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)] transition duration-200 hover:shadow-[0_14px_32px_rgba(15,23,42,.07)]",
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

function ChoiceTile({
  selected,
  icon: Icon,
  label,
  onClick,
}: {
  selected: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 min-h-[52px] cursor-pointer flex-col items-start justify-between rounded-xl border px-2.5 py-2 text-left transition duration-200",
        selected
          ? "border-primary bg-primary text-white shadow-[0_10px_22px_rgba(27,84,141,.22)]"
          : "border-[#e8ecf2] bg-[#f4f7fb] text-ir-navy hover:-translate-y-0.5 hover:border-ir-blue2 hover:bg-white",
      )}
    >
      <Icon className={cn("size-4", selected ? "text-white" : "text-primary")} strokeWidth={1.8} />
      <span className="text-[12px] leading-tight font-semibold">{label}</span>
    </button>
  );
}

function CountryFlag({
  country,
  eager = false,
}: {
  country: string;
  eager?: boolean;
}) {
  const src = countryFlagUrl(country);
  const srcSet = countryFlagSrcSet(country);
  if (!src) return null;
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt=""
      width={21}
      height={14}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      aria-hidden="true"
      className="h-[14px] w-[21px] shrink-0 rounded-[2px] bg-[#e8ecf2] object-cover ring-1 ring-black/10"
    />
  );
}

function CountryHeroFlag({ country }: { country: string }) {
  const src = countryFlagHeroUrl(country);
  const srcSet = countryFlagHeroSrcSet(country);
  if (!src) return null;
  return (
    <div className="relative h-8 w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-[#e8ecf2] ring-1 ring-black/5">
      <img
        key={country}
        src={src}
        srcSet={srcSet}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
        aria-hidden="true"
        className="ir-flag-wave h-full w-full object-cover"
      />
    </div>
  );
}

function foldCountry(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function ProgramSelect({
  programId,
  onChange,
}: {
  programId: string;
  onChange: (patch: { studyLevel?: string; studyProgramId?: string }) => void;
}) {
  const selected = studyProgramById(programId);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const groups = useMemo(() => groupStudyPrograms(searchStudyPrograms(query)), [query]);

  function pick(id: string) {
    const program = studyProgramById(id);
    onChange({
      studyProgramId: id,
      studyLevel: program?.level ?? "",
    });
    setOpen(false);
  }

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!open && rect) {
      const width = Math.max(rect.width, 320);
      const left = Math.min(rect.left, Math.max(12, window.innerWidth - width - 12));
      const menuHeight = 320;
      const top =
        rect.bottom + 6 + menuHeight > window.innerHeight
          ? Math.max(12, rect.top - menuHeight - 6)
          : rect.bottom + 6;
      setMenuPos({ top, left, width });
      setQuery("");
    }
    setOpen((next) => !next);
  }

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    selectedRef.current?.scrollIntoView({ block: "nearest" });
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Programme visé"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 text-left text-sm outline-none transition-shadow focus:border-[#93b4ff] focus:ring-3 focus:ring-primary/10"
      >
        <span className={cn("min-w-0 truncate", selected ? "text-[#1a2332]" : "text-muted-foreground")}>
          {selected?.name ?? "Choisir un programme"}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
              className="fixed z-100 overflow-hidden rounded-2xl border border-[#e5eaf0] bg-white shadow-[0_14px_32px_rgba(15,23,42,.12)]"
            >
              <div className="border-b border-[#eef2f6] p-2">
                <Input
                  ref={searchRef}
                  aria-label="Rechercher un programme"
                  placeholder="Rechercher un programme"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-8"
                />
              </div>
              <div
                role="listbox"
                aria-label="Programmes d’études"
                className="max-h-72 overflow-y-scroll py-1 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#f4f7fb] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#b9c1cc]"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={!selected}
                  className={cn(
                    "flex w-full cursor-pointer px-3 py-1.5 text-left text-[13px]",
                    !selected ? "bg-secondary font-medium text-primary" : "text-muted-foreground hover:bg-[#f4f7fb]",
                  )}
                  onClick={() => pick("")}
                >
                  Choisir un programme
                </button>
                {groups.length === 0 ? (
                  <p className="px-3 py-2 text-[13px] text-muted-foreground">Aucun programme trouvé</p>
                ) : (
                  groups.map((group) => (
                    <div key={group.domain}>
                      <p className="sticky top-0 bg-[#f8fafc] px-3 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
                        {group.domain}
                      </p>
                      {group.programs.map((program) => {
                        const active = program.id === programId;
                        return (
                          <button
                            key={program.id}
                            ref={active ? selectedRef : undefined}
                            type="button"
                            role="option"
                            aria-selected={active}
                            className={cn(
                              "flex w-full cursor-pointer items-start justify-between gap-2 px-3 py-1.5 text-left",
                              active ? "bg-secondary text-primary" : "text-[#1a2332] hover:bg-[#f4f7fb]",
                            )}
                            onClick={() => pick(program.id)}
                          >
                            <span className="min-w-0">
                              <span className="block text-[13px] leading-snug font-medium">{program.name}</span>
                              <span className="block text-[11px] text-muted-foreground">
                                {studyLevelLabels[program.level]}
                              </span>
                            </span>
                            {active ? <Check className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.4} /> : null}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const options = useMemo(() => {
    const list = countries.includes(value as (typeof countries)[number]) || !value.trim()
      ? [...countries]
      : [value, ...countries];
    const needle = foldCountry(query.trim());
    if (!needle) return list;
    return list.filter((country) => foldCountry(country).includes(needle));
  }, [query, value]);

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!open && rect) {
      const width = Math.max(rect.width, 280);
      const left = Math.min(rect.left, Math.max(12, window.innerWidth - width - 12));
      const menuHeight = 280;
      const top =
        rect.bottom + 6 + menuHeight > window.innerHeight
          ? Math.max(12, rect.top - menuHeight - 6)
          : rect.bottom + 6;
      setMenuPos({ top, left, width });
      setQuery("");
    }
    setOpen((next) => !next);
  }

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    selectedRef.current?.scrollIntoView({ block: "nearest" });
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Pays d'origine"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 text-left text-sm outline-none transition-shadow focus:border-[#93b4ff] focus:ring-3 focus:ring-primary/10"
      >
        <span className="flex min-w-0 items-center gap-2">
          {value ? <CountryFlag country={value} eager /> : null}
          <span className="min-w-0 truncate">{value || "Choisir un pays"}</span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
              className="fixed z-100 overflow-hidden rounded-2xl border border-[#e5eaf0] bg-white shadow-[0_14px_32px_rgba(15,23,42,.12)]"
            >
              <div className="border-b border-[#eef2f6] p-2">
                <Input
                  ref={searchRef}
                  aria-label="Rechercher un pays"
                  placeholder="Rechercher un pays"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-8"
                />
              </div>
              <ul
                role="listbox"
                aria-label="Pays du monde"
                className="max-h-60 overflow-y-scroll py-1 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#f4f7fb] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#b9c1cc]"
              >
                {options.length === 0 ? (
                  <li className="px-3 py-2 text-[13px] text-muted-foreground">Aucun pays trouvé</li>
                ) : (
                  options.map((option) => {
                    const selected = value === option;
                    return (
                      <li key={option}>
                        <button
                          ref={selected ? selectedRef : undefined}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[13px] font-medium",
                            selected ? "bg-secondary text-primary" : "text-[#1a2332] hover:bg-[#f4f7fb]",
                          )}
                          onClick={() => {
                            onChange(option);
                            setOpen(false);
                          }}
                        >
                          <CountryFlag country={option} />
                          {option}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function ProvinceOtherSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = isOtherProvince(value);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!open && rect) {
      const width = 260;
      const left = Math.min(rect.left, Math.max(12, window.innerWidth - width - 12));
      setMenuPos({ top: rect.bottom + 6, left });
    }
    setOpen((next) => !next);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Autres provinces"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-pressed={selected}
        title={selected ? value : "Autres provinces"}
        onClick={toggle}
        className={cn(
          "ir-option-btn cursor-pointer gap-1 font-medium transition duration-180",
          selected
            ? "bg-primary text-white shadow-[0_8px_16px_rgba(27,84,141,.22)]"
            : "bg-secondary text-primary hover:bg-[#d4e4f2]",
        )}
      >
        {selected ? (
          <span className="font-bold tracking-wide">{provinceShort[value] ?? value}</span>
        ) : (
          "Autres"
        )}
        <ChevronDown className="size-3.5" strokeWidth={2} />
      </button>
      {open
        ? createPortal(
            <ul
              ref={menuRef}
              role="listbox"
              style={{ top: menuPos.top, left: menuPos.left }}
              className="fixed z-100 min-w-[260px] overflow-hidden rounded-2xl border border-[#e5eaf0] bg-white py-1 shadow-[0_14px_32px_rgba(15,23,42,.12)]"
            >
              {otherProvinces.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] font-medium",
                      value === option ? "bg-secondary text-primary" : "text-[#1a2332] hover:bg-[#f4f7fb]",
                    )}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    <span className="w-7 font-bold text-primary">{provinceShort[option]}</span>
                    {option}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </>
  );
}

function Chip({
  selected,
  onClick,
  children,
  inverted = false,
  compact = false,
  title,
  ariaLabel,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  inverted?: boolean;
  compact?: boolean;
  title?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "ir-option-btn cursor-pointer gap-1.5 rounded-lg font-medium transition duration-180",
        compact ? "text-[12px]" : "text-[13px]",
        inverted
          ? selected
            ? "bg-white text-primary"
            : "bg-white/10 text-white/80 hover:bg-white/16"
          : selected
            ? "bg-primary text-white shadow-[0_8px_16px_rgba(27,84,141,.22)]"
            : "bg-secondary text-primary hover:bg-[#d4e4f2]",
        className
      )}
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8" />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  className,
  optional = false,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  className?: string;
  optional?: boolean;
  placeholder?: string;
}) {
  const empty = optional && (!Number.isFinite(value) || value === 0);
  return (
    <label className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <Input
          type="number"
          value={empty ? "" : value}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value;
            if (optional && raw === "") onChange(0);
            else onChange(Number(raw));
          }}
          className={cn("h-8", suffix && "pr-12")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function ChoiceField({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const safeValue = options.includes(value) ? value : options[0];
  return (
    <label className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <Select value={safeValue} onChange={(e) => onChange(e.target.value)} className="h-8">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </Select>
    </label>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}
