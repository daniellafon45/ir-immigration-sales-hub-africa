# Review package: Task 5 Profile UI + Voies cards

No project git — package is the current snapshot of files this task created or edited. Treat each block as the full file on disk.

## Commits

none (in-place, no git)

## Files changed

- src/features/noc-search-field.tsx (added)
- src/features/profile.tsx (edited)
- src/features/immigration.tsx (edited)
- src/features/profile.test.ts (edited)
- src/features/immigration.test.ts (edited)

Pitch files were not in this list. market.tsx / canada-live.ts / household-salaries.ts / failure-press.ts were not in this list.

## Diff


### src\features\noc-search-field.tsx (111 lines)
```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { nocByCode } from "@/data/noc-2021";
import { searchNoc } from "@/lib/noc-search";
import { cn } from "@/lib/utils";

function nocLabel(code: string) {
  const item = nocByCode(code);
  return item ? `CNP ${item.code} Â· FEER ${item.teer} Â· ${item.title}` : `CNP ${code}`;
}

export function NocSearchField({
  value,
  onChange,
  suggestionCode,
}: {
  value: string;
  onChange: (code: string) => void;
  suggestionCode?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchNoc(query, 8), [query]);
  const selected = nocByCode(value);
  const suggestion = !value && suggestionCode ? nocByCode(suggestionCode) : undefined;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function pick(code: string) {
    onChange(code);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="grid gap-1.5">
      {selected ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-[12px] font-medium text-primary">
            {nocLabel(selected.code)}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-border bg-white px-2.5 text-[12px] font-medium text-[#1a2332] transition hover:bg-[#f4f7fb]"
          >
            <X className="size-3.5" strokeWidth={2} />
            Effacer
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
          <Input
            value={query}
            placeholder="Titre dâ€™emploi ou code CNP"
            className="h-8 pl-9"
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              setOpen(next.trim().length >= 2);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (results[0]) pick(results[0].code);
              }
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
          />
          {open ? (
            <div className="absolute top-[calc(100%+6px)] z-20 w-full overflow-hidden rounded-xl border border-[#d7e4f3] bg-white shadow-[0_14px_32px_rgba(15,23,42,.12)]">
              {results.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto py-1">
                  {results.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => pick(item.code)}
                        className={cn(
                          "flex w-full cursor-pointer px-3 py-2 text-left text-[12px] text-[#1a2332] transition hover:bg-[#f4f7fb]",
                        )}
                      >
                        {`CNP ${item.code} Â· FEER ${item.teer} Â· ${item.title}`}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-[12px] text-muted-foreground">Aucun CNP trouvÃ©</p>
              )}
            </div>
          ) : null}
        </div>
      )}
      {suggestion ? (
        <p className="text-[11px] leading-snug text-muted-foreground">
          Suggestion mÃ©tier: {`CNP ${suggestion.code} Â· FEER ${suggestion.teer} Â· ${suggestion.title}`}
        </p>
      ) : null}
    </div>
  );
}

```

### src\features\profile.tsx (1787 lines)
```tsx
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
  UserRoundPlus,
  Users,
  UsersRound,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { IrShaderGradient } from "@/components/brand/IrShaderGradient";
import { PageShell } from "@/components/layout/PageShell";
import { personHeroImage } from "@/data/pitch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { countries } from "@/data/countries";
import { countryFlagSrcSet, countryFlagUrl } from "@/data/country-flags";
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
  professionSector,
  professions,
  sexes,
  appearances,
  type AdultMember,
  type Appearance,
  type Sex,
  type PrincipalMode,
  type Profile,
} from "@/data/profile";
import { provinceLever } from "@/lib/province-lever";
import {
  familyLinks,
} from "@/data/family-links";
import { businessPaths } from "@/data/business-paths";
import { professionNoc } from "@/data/profession-noc";
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
import { NocSearchField } from "@/features/noc-search-field";
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
  { value: "Polygame", label: "Polygame", icon: UserRoundPlus },
];

const objectiveIcons: Record<string, LucideIcon> = {
  "RÃ©sidence permanente": Landmark,
  Ã‰tudes: GraduationCap,
  Travail: Briefcase,
  Visite: Plane,
  Affaires: Building2,
  "Regroupement familial": HeartHandshake,
};

const provinceShort: Record<string, string> = {
  QuÃ©bec: "QC",
  Ontario: "ON",
  Alberta: "AB",
  Manitoba: "MB",
  "Nouveau-Brunswick": "NB",
  "Colombie-Britannique": "BC",
  Saskatchewan: "SK",
  "Nouvelle-Ã‰cosse": "NS",
  "ÃŽle-du-Prince-Ã‰douard": "PE",
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
  const applicantStudy =
    draft.objective === "Ã‰tudes"
      ? {
          programId: draft.studyProgramId,
          onChange: (patch: { studyLevel?: string; studyProgramId?: string }) => {
            if (patch.studyLevel !== undefined) setProject("studyLevel", patch.studyLevel);
            if (patch.studyProgramId !== undefined) setProject("studyProgramId", patch.studyProgramId);
          },
        }
      : undefined;
  const applicantWork =
    draft.objective === "Travail"
      ? {
          nocCode: draft.workNocCode,
          suggestionCode: professionNoc(draft.applicant.profession),
          permitKind: draft.workPermitKind,
          hasOffer: draft.workHasOffer,
          onChange: (patch: { workNocCode?: string; workPermitKind?: string; workHasOffer?: boolean }) => {
            if (patch.workNocCode !== undefined) setProject("workNocCode", patch.workNocCode);
            if (patch.workPermitKind !== undefined) setProject("workPermitKind", patch.workPermitKind);
            if (patch.workHasOffer !== undefined) setProject("workHasOffer", patch.workHasOffer);
          },
        }
      : undefined;
  const applicantVisit =
    draft.objective === "Visite"
      ? {
          purpose: draft.visitPurpose,
          duration: draft.visitDuration,
          onChange: (patch: { visitPurpose?: string; visitDuration?: string }) => {
            if (patch.visitPurpose !== undefined) setProject("visitPurpose", patch.visitPurpose);
            if (patch.visitDuration !== undefined) setProject("visitDuration", patch.visitDuration);
          },
        }
      : undefined;
  const applicantBusiness =
    draft.objective === "Affaires"
      ? {
          path: draft.businessPath,
          onChange: (patch: { businessPath?: string }) => {
            if (patch.businessPath !== undefined) setProject("businessPath", patch.businessPath);
          },
        }
      : undefined;
  const applicantFamily =
    draft.objective === "Regroupement familial"
      ? {
          link: draft.familyLink,
          sponsorStatus: draft.sponsorStatus,
          showSpouseReminder: draft.familyLink === "spouse" && !showSpouse,
          showChildReminder: draft.familyLink === "child" && draft.children.length === 0,
          onChange: (patch: { familyLink?: string; sponsorStatus?: string }) => {
            if (patch.familyLink !== undefined) setProject("familyLink", patch.familyLink);
            if (patch.sponsorStatus !== undefined) setProject("sponsorStatus", patch.sponsorStatus);
          },
        }
      : undefined;
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [imported, setImported] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  function setFamily(value: string) {
    setProject("family", value);
    if (familyHasChildren(value) && !familyIsPolygamous(value) && draft.children.length === 0) addChild();
  }

  function patchAdult(who: "applicant" | "spouse" | string, patch: Partial<AdultMember>) {
    const next =
      patch.profession && !patch.sector
        ? { ...patch, sector: professionSector[patch.profession] ?? "Autre" }
        : patch;
    if (who === "applicant") patchApplicant(next);
    else if (who === "spouse") patchSpouse(next);
    else patchExtraSpouse(who, next);
  }

  function save() {
    commit();
    downloadJson(profileFileName(draft), serializeProfileFile(draft));
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
            <IrShaderGradient />
            <BrandLogo className="absolute top-3 right-3 z-10 size-11 rounded-lg ring-1 ring-white/20 sm:top-4 sm:right-4 sm:size-12" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pr-14 sm:pr-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">Profil client</p>
                <h1 className="mt-1 text-[24px] leading-tight font-semibold tracking-tight">
                  {principal.firstName || "Nouveau dossier"}
                </h1>
                <p className="mt-1 text-[13px] text-white/70">
                  {familyLabel(draft)} Â· {draft.province} Â· {draft.objective}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <MetaPill>{draft.country || "Pays"}</MetaPill>
                <MetaPill>{principal.profession}</MetaPill>
              </div>
            </div>
          </header>

          <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
            <SectionLabel>Situation familiale</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-1.5 min-[420px]:grid-cols-3 @min-[42rem]:grid-cols-5">
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

            <div className="mt-3 grid items-start gap-3 @min-[36rem]:grid-cols-2 @min-[54rem]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)_minmax(9.25rem,10.5rem)]">
              <div>
                <SectionLabel>Objectif</SectionLabel>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {objectives.map((option) => {
                    const Icon = objectiveIcons[option] ?? Flag;
                    return (
                      <Chip
                        key={option}
                        compact
                        selected={draft.objective === option}
                        onClick={() => setProject("objective", option)}
                      >
                        <Icon className="size-3.5" strokeWidth={1.8} />
                        {option}
                      </Chip>
                    );
                  })}
                </div>
              </div>
              <div>
                <SectionLabel>Destination</SectionLabel>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {featuredProvinces.map((option) => (
                    <Chip
                      key={option}
                      compact
                      title={option}
                      ariaLabel={option}
                      selected={draft.province === option}
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
              <div>
                <SectionLabel>Pays d'origine</SectionLabel>
                <div className="mt-1.5">
                  <CountrySelect value={draft.country} onChange={(v) => setProject("country", v)} />
                </div>
              </div>
            </div>
          </Surface>

          {polygamous ? (
            <div className="grid shrink-0 gap-3">
              <PersonCard
                title="Candidat"
                member={draft.applicant}
                tone="navy"
                active={analysis.selected === "applicant"}
                score={analysis.applicantScore.total}
                onChange={(patch) => patchAdult("applicant", patch)}
                study={applicantStudy}
                work={applicantWork}
                visit={applicantVisit}
                business={applicantBusiness}
                family={applicantFamily}
              />
              <div className="flex items-center justify-between gap-3 px-0.5">
                <SectionLabel>Ã‰pouses</SectionLabel>
                {extraSpouses.length < 2 ? (
                  <Button variant="outline" size="sm" onClick={addExtraSpouse}>
                    <Plus className="size-3.5" />
                    Ajouter
                  </Button>
                ) : null}
              </div>
              <div className="ir-rise grid min-h-0 gap-3 @min-[34rem]:grid-cols-2">
                <PersonCard
                  title="Ã‰pouse 1"
                  member={draft.spouse}
                  tone="blue"
                  active={analysis.selected === "spouse"}
                  score={analysis.spouseScore.total}
                  onChange={(patch) => patchAdult("spouse", patch)}
                />
                {extraSpouses.map((spouse, index) => {
                  const scored = analysis.adults.find((adult) => adult.role === extraPrincipalMode(spouse.id));
                  return (
                    <PersonCard
                      key={spouse.id}
                      title={`Ã‰pouse ${index + 2}`}
                      member={spouse}
                      tone="blue"
                      active={analysis.selected === extraPrincipalMode(spouse.id)}
                      score={scored?.score.total ?? 0}
                      onChange={(patch) => patchAdult(spouse.id, patch)}
                      onRemove={extraSpouses.length > 1 ? () => removeExtraSpouse(spouse.id) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={cn("grid shrink-0 gap-3", showSpouse && "@min-[34rem]:grid-cols-2")}>
              <PersonCard
                title="Candidat"
                member={draft.applicant}
                tone="navy"
                active={analysis.selected === "applicant"}
                score={analysis.applicantScore.total}
                onChange={(patch) => patchAdult("applicant", patch)}
                study={applicantStudy}
                work={applicantWork}
                visit={applicantVisit}
                business={applicantBusiness}
                family={applicantFamily}
              />
              {showSpouse ? (
                <div className="ir-rise min-h-0">
                  <PersonCard
                    title="Conjoint"
                    member={draft.spouse}
                    tone="blue"
                    active={analysis.selected === "spouse"}
                    score={analysis.spouseScore.total}
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
                      label="PrÃ©nom"
                      value={child.firstName}
                      onChange={(v) => patchChild(child.id, { firstName: v })}
                    />
                    <NumberField
                      className="w-[72px] shrink-0"
                      label="Ã‚ge"
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
  { key: "age", label: "Ã‚ge", max: 12 },
  { key: "language", label: "Langues", max: 18 },
  { key: "education", label: "Ã‰tudes", max: 10 },
  { key: "experience", label: "ExpÃ©rience", max: 12 },
  { key: "occupation", label: "MÃ©tier", max: 9 },
  { key: "salary", label: "CapacitÃ©", max: 6 },
];

function downloadJson(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
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
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">Demandeur principal</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{principal.firstName || "â€”"}</p>
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
          <FactRow label="Ã‚ge" value={`${principal.age} ans`} />
          <FactRow label="MÃ©tier" value={principal.profession} />
          <FactRow label="DiplÃ´me" value={principal.education} />
          <FactRow label="ExpÃ©rience" value={`${principal.experience} ans`} />
          <FactRow label="Langues" value={`FR ${principal.french} Â· EN ${principal.english}`} />
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
                value={`${analysis.accompanying.member.firstName || "â€”"} Â· ${analysis.accompanying.member.profession}`}
              />
            ) : null}
            {analysis.excluded.map((adult) => (
              <FactRow
                key={adult.role}
                label="Hors dossier"
                value={`${adult.member.firstName || adult.label} Â· ${adult.member.profession}`}
              />
            ))}
            {kids.map((child) => (
              <FactRow
                key={child.id}
                label="Enfant"
                value={`${child.firstName || "Enfant"} Â· ${child.age} ans`}
              />
            ))}
            {polygamous ? (
              <p className="pt-1 text-[13px] leading-snug text-white/80">
                Le Canada ne reconnaÃ®t quâ€™un conjoint. Une seule Ã©pouse peut accompagner le dossier.
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
          {imported ? "ImportÃ©" : "Importer un profil client"}
        </Button>
        <Button
          className={cn(
            "relative h-10 w-full rounded-xl bg-white text-primary hover:bg-secondary",
            saved && "bg-[#e8f6ee] text-[#176b3a] hover:bg-[#e8f6ee]",
          )}
          onClick={onSave}
        >
          {saved ? <Check className="size-4" /> : null}
          {saved ? "EnregistrÃ©" : "Enregistrer"}
        </Button>
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
      <span className="text-[11px] font-medium text-muted-foreground">Programme visÃ©</span>
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
        <span className="text-[11px] font-medium text-muted-foreground">Titre dâ€™emploi ou code CNP</span>
        <NocSearchField
          value={nocCode}
          onChange={(code) => onChange({ workNocCode: code })}
          suggestionCode={suggestionCode}
        />
      </label>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Type de permis</legend>
        <div className="flex flex-wrap gap-1.5">
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
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Offre dâ€™emploi</legend>
        <div className="flex flex-wrap gap-1.5">
          <Chip compact selected={hasOffer} onClick={() => onChange({ workHasOffer: true })}>
            Offre dâ€™emploi
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
        <div className="flex flex-wrap gap-1.5">
          {visitPurposes.map((item) => (
            <Chip key={item.id} compact selected={purpose === item.id} onClick={() => onChange({ visitPurpose: item.id })}>
              {item.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">DurÃ©e</legend>
        <div className="flex flex-wrap gap-1.5">
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
      <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Volet dâ€™affaires</legend>
      <div className="flex flex-wrap gap-1.5">
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
    { id: "pr", label: "RÃ©sident permanent" },
    { id: "citizen", label: "Citoyen" },
  ] as const;
  return (
    <div className="grid gap-2">
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Lien admissible</legend>
        <div className="flex flex-wrap gap-1.5">
          {familyLinks.map((item) => (
            <Chip key={item.id} compact selected={link === item.id} onClick={() => onChange({ familyLink: item.id })}>
              {item.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-[11px] font-medium text-muted-foreground">Statut du rÃ©pondant</legend>
        <div className="flex flex-wrap gap-1.5">
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
    <Surface className={cn("@container overflow-hidden p-0 transition duration-200", active && "ring-2 ring-primary/30")}>
      <div
        className={cn(
          "relative flex min-h-[72px] items-center gap-2.5 overflow-hidden px-3 py-3 text-white",
          tone === "navy" ? "bg-primary" : "bg-ir-blue2",
        )}
      >
        <img src={personHeroImage(member)} alt="" className="absolute inset-0 size-full object-cover object-[80%_center]" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
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
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">{Math.round(Math.max(0, score))}</span>
            </span>
          </div>
          <input
            aria-label={`PrÃ©nom ${title.toLowerCase()}`}
            value={member.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="PrÃ©nom"
            className="mt-0.5 w-full border-b border-transparent bg-transparent text-lg font-semibold tracking-tight outline-none placeholder:text-white/35 focus:border-white/40"
          />
        </div>
      </div>

      <div className="grid gap-2 p-3">
        <SexPicks
          label="Sexe"
          value={member.sex}
          onChange={(v) => onChange({ sex: v })}
        />
        <AppearancePicks
          label="Apparence"
          value={member.look}
          onChange={(v) => onChange({ look: v })}
        />
        <div className="grid grid-cols-2 gap-2 @min-[22rem]:grid-cols-4">
          <NumberField label="Ã‚ge" value={member.age} onChange={(v) => onChange({ age: v })} />
          <ChoiceField
            className="@min-[22rem]:col-span-2"
            label="Profession"
            value={member.profession}
            options={professions}
            onChange={(v) => onChange({ profession: v })}
          />
          <NumberField label="Exp. (ans)" value={member.experience} onChange={(v) => onChange({ experience: v })} />
          <ChoiceField
            className="@min-[22rem]:col-span-2"
            label="CapacitÃ© financiÃ¨re"
            value={member.salary}
            options={financialCapacities}
            onChange={(v) => onChange({ salary: v as AdultMember["salary"] })}
          />
          <ChoiceField
            className="@min-[22rem]:col-span-2"
            label="DiplÃ´me"
            value={member.education}
            options={educationLevels}
            onChange={(v) => onChange({ education: v })}
          />
        </div>
        {study ? <StudyFields programId={study.programId} onChange={study.onChange} /> : null}
        {work ? (
          <WorkFields
            nocCode={work.nocCode}
            suggestionCode={work.suggestionCode}
            permitKind={work.permitKind}
            hasOffer={work.hasOffer}
            onChange={work.onChange}
          />
        ) : null}
        {visit ? <VisitFields purpose={visit.purpose} duration={visit.duration} onChange={visit.onChange} /> : null}
        {business ? <BusinessFields path={business.path} onChange={business.onChange} /> : null}
        {family ? (
          <FamilyFields
            link={family.link}
            sponsorStatus={family.sponsorStatus}
            showSpouseReminder={family.showSpouseReminder}
            showChildReminder={family.showChildReminder}
            onChange={family.onChange}
          />
        ) : null}
        <LanguagePicks
          label="FranÃ§ais"
          value={member.french}
          onChange={(v) => onChange({ french: v })}
        />
        <LanguagePicks
          label="Anglais"
          value={member.english}
          onChange={(v) => onChange({ english: v })}
        />
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
      <div className="grid grid-cols-2 gap-1" role="radiogroup" aria-label={label}>
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
                "h-8 cursor-pointer rounded-md px-1 text-[10px] font-semibold transition duration-180",
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

function AppearancePicks({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Appearance;
  onChange: (v: Appearance) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</legend>
      <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label={label}>
        {appearances.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={cn(
                "h-8 cursor-pointer rounded-md px-1 text-[10px] font-semibold transition duration-180",
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
      <div className="grid grid-cols-2 gap-1 @min-[20rem]:grid-cols-4" role="radiogroup" aria-label={label}>
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
                "h-8 cursor-pointer rounded-md px-1 text-[10px] font-semibold transition duration-180",
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
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
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
        "flex min-h-[52px] cursor-pointer flex-col items-start justify-between rounded-xl border px-2.5 py-2 text-left transition duration-200",
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
        aria-label="Programme visÃ©"
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
                aria-label="Programmes dâ€™Ã©tudes"
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
                  <p className="px-3 py-2 text-[13px] text-muted-foreground">Aucun programme trouvÃ©</p>
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
                  <li className="px-3 py-2 text-[13px] text-muted-foreground">Aucun pays trouvÃ©</li>
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
          "inline-flex h-8 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[12px] font-medium whitespace-nowrap transition duration-180",
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
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition duration-180",
        compact ? "h-8 px-2.5 text-[12px]" : "h-9 px-3 text-[13px]",
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

```

### src\features\immigration.tsx (1197 lines)
```tsx
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
import { fastestRouteId, irccTimeFor, irccTimesMeta, type IrccTime } from "@/data/ircc-times";
import { routes, type ImmigrationRoute } from "@/data/routes";
import { startupVisaNote, startupVisaPaused, businessPaths } from "@/data/business-paths";
import { c11WorkingCapital, pnpEntrepreneur } from "@/data/business-thresholds";
import { professionNoc } from "@/data/profession-noc";
import { Profile, familyHasSpouse } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { visitFeesFor } from "@/data/visit-fees";
import { visitPurposeById, visitPurposes } from "@/data/visit-purposes";
import { workPermits, workPermitById } from "@/data/work-permits";
import { NocSearchField } from "@/features/noc-search-field";
import { sectionBanners } from "@/data/section-banners";
import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";
import { businessCost } from "@/lib/business-cost";
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
      kicker="Voies dâ€™immigration"
      title="Une destination. Plusieurs chemins."
      lead="Le chemin dÃ©pend du foyer et de lâ€™objectif, pas dâ€™une brochure."
      pills={[market.family, market.province, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== profile.objective)]}
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
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Objectif
                </span>
              ) : null}
            </span>
            <strong className="mt-1.5 block text-base">{item.name}</strong>
            <small className="mt-1.5 block text-[#788291]">{item.fit}</small>
            <DelayChip time={irccTimeFor(item.id)} />
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
      kicker="Voies Â· DÃ©tail"
      title={route.name}
      lead={`Pour qui : ${route.fit}.`}
      pills={[market.family, route.tag, ...studyDeckPills(profile), ...closingPills(route.id, profile)]}
      hero={sectionBanners.routes}
    >
      <DelayBanner time={irccTimeFor(route.id)} />
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
              <li key={item}>Â· {item}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="h-full p-4">
          <SectionLabel>Points positifs</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#295f43]">
            {route.positives.map((item) => (
              <li key={item}>âœ“ {item}</li>
            ))}
          </ul>
        </Surface>
      </div>
      <Surface className="w-full p-4">
        <SectionLabel>Points dâ€™attention</SectionLabel>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {route.attention.map((item) => (
            <li key={item} className="rounded-xl bg-[#fff6e8] px-3 py-2.5 text-[13px] leading-6 text-[#8c5a1d]">
              âš  {item}
            </li>
          ))}
        </ul>
      </Surface>
      <Surface className="w-full p-4">
        <SectionLabel>Ã‰tapes</SectionLabel>
        <div className="mt-4">
          <RouteSteps steps={route.steps} />
        </div>
      </Surface>
      <p className="text-[12px] text-muted-foreground">AperÃ§u de dÃ©monstration. Pas un avis juridique.</p>
    </OpportunitiesShell>
  );
}

function closingPills(routeId: string, profile: Profile) {
  if (routeId === "work" && profile.workNocCode) return [profile.workNocCode];
  if (routeId === "visit") {
    const purpose = visitPurposeById(profile.visitPurpose);
    return purpose ? [purpose.name] : [];
  }
  if (routeId === "business") {
    const path = businessPaths.find((item) => item.id === profile.businessPath);
    return path ? [path.name] : [];
  }
  if (routeId === "family") {
    const link = familyLinks.find((item) => item.id === profile.familyLink);
    return link ? [link.name] : [];
  }
  return [];
}

const thresholdProvinceLabels: Record<keyof typeof c11WorkingCapital, string> = {
  QC: "QuÃ©bec",
  ON: "Ontario",
  AB: "Alberta",
  MB: "Manitoba",
  NB: "Nouveau-Brunswick",
  BC: "Colombie-Britannique",
  SK: "Saskatchewan",
  NS: "Nouvelle-Ã‰cosse",
  PE: "ÃŽle-du-Prince-Ã‰douard",
  NL: "Terre-Neuve-et-Labrador",
  YT: "Yukon",
  NT: "Territoires du Nord-Ouest",
  NU: "Nunavut",
};

function StudyClosingCards({
  cost,
  programName,
}: {
  cost: ReturnType<typeof studyCost>;
  programName?: string;
}) {
  const tuitionValue = programName
    ? money(cost.tuition)
    : `${money(cost.tuitionLow)} â€“ ${money(cost.tuitionHigh)}`;
  return (
    <>
      <Surface className="flex min-h-0 flex-col p-4">
        <SectionLabel>Tarifs dâ€™Ã©tudes internationaux Â· par annÃ©e</SectionLabel>
        {programName ? (
          <p className="mt-1.5 text-[13px] leading-snug text-[#1a2332]">
            <strong>{programName}</strong>
            {cost.programLevel ? ` Â· ${cost.programLevel}` : ""} Â· {money(cost.tuition)} / an
          </p>
        ) : null}
        <div className="mt-3 max-h-[min(42vh,22rem)] overflow-y-auto rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Province / territoire</th>
                <th className="px-3 py-2 text-right">CÃ©gep</th>
                <th className="px-3 py-2 text-right">UniversitÃ©</th>
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
          <SectionLabel>AnnÃ©e 1 Â· Foyer</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="CoÃ»t de vie annuel" value={money(cost.livingAnnual)} />
            <FactLine label={`Fonds de subsistance ${cost.fundsLabel}`} value={money(cost.subsistence)} />
            <FactLine label="ScolaritÃ© annÃ©e 1" value={tuitionValue} />
            <FactLine label="Preuve de fonds" value={money(cost.proofOfFunds)} featured />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.fundsLabel} demande {money(cost.subsistence)} Â· vivre coÃ»te {money(cost.livingAnnual)}
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>{programName ? "AprÃ¨s le diplÃ´me Â· Programme" : "AprÃ¨s le diplÃ´me Â· MÃ©tier"}</SectionLabel>
          <p className="mt-1.5">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
              {cost.student.profession}
            </span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <BandMini label="Bas" value={money(cost.student.low)} />
            <BandMini label="MÃ©dian" value={money(cost.student.mid)} featured />
            <BandMini label="Ã‰levÃ©" value={money(cost.student.high)} />
          </div>
          <dl className="mt-3 space-y-2 text-[13px]">
            <FactLine label="RÃ©munÃ©ration de stage" value={money(cost.student.internshipMid)} />
            <FactLine
              label="EmployabilitÃ©"
              value={`${cost.student.employability} % Â· ${cost.student.employabilityLabel}`}
            />
          </dl>
        </Surface>
        {cost.spouse ? (
          <Surface className="p-4">
            <SectionLabel>Pendant les Ã©tudes Â· Conjoint parrainÃ©</SectionLabel>
            <p className="mt-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.spouse.profession}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <BandMini label="Bas" value={money(cost.spouse.low)} />
              <BandMini label="MÃ©dian" value={money(cost.spouse.mid)} featured />
              <BandMini label="Ã‰levÃ©" value={money(cost.spouse.high)} />
            </div>
            <dl className="mt-3 space-y-2 text-[13px]">
              <FactLine
                label="EmployabilitÃ©"
                value={`${cost.spouse.employability} % Â· ${cost.spouse.employabilityLabel}`}
              />
            </dl>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              Permis de travail ouvert pendant les Ã©tudes du candidat.
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
            <p className="font-semibold">{`CNP ${pathways.noc} Â· FEER ${pathways.teer} Â· ${pathways.title}`}</p>
            <p className="mt-1">{pathways.feerLegend}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span>VÃ©rifiez sur IRCC.</span>
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
          <SectionLabel>Permis Â· Ouvert ou fermÃ©</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {workPermits.map((permit) => {
              const outcome = pathways.permits.find((item) => item.kind === permit.id);
              return (
                <span
                  key={permit.id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
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
              value={selectedPermit?.needsOffer ? (profile.workHasOffer ? "Oui, cochÃ©e" : "Oui, Ã  obtenir") : "Non"}
            />
            <FactLine label="Traitement" value={money(cost.fees.permit)} />
            <FactLine
              label="+100 $ dÃ©tenteur ouvert"
              value={cost.fees.openHolder > 0 ? money(cost.fees.openHolder) : "Non"}
            />
            <FactLine label="BiomÃ©trie" value={money(cost.fees.biometrics)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {(pathways.permits.find((item) => item.kind === (selectedPermit?.id ?? "")) ?? pathways.permits[0])?.reason}
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Renouvellement</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Quand dÃ©poser" value="Avant lâ€™Ã©chÃ©ance, statut conservÃ©" />
            <FactLine
              label="Ce qui reste permis en attendant"
              value={pathways.renewal.openCanChangeEmployer ? "Ouvert/IEC = changement dâ€™employeur possible" : "FermÃ© = mÃªmes conditions"}
            />
            <FactLine label="Frais" value={money(pathways.renewal.fees.total)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Voir sur IRCC pour les conditions de prolongation.
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Vers la RP Â· AprÃ¨s une pÃ©riode</SectionLabel>
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
          <SectionLabel>AnnÃ©e 1 Â· Foyer</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Salaire net mensuel approx" value={money(monthlyNet)} />
            <FactLine label="Panier annuel" value={money(cost.livingAnnual)} />
            <FactLine label="Fonds 3 mois" value={money(cost.settlementFunds)} />
            <FactLine label="Frais" value={money(cost.fees.total)} />
            <FactLine label="Ã‰cart mensuel" value={money(cost.gapMonthly)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {`le mÃ©tier paie ${money(monthlyNet)} Â· vivre coÃ»te ${money(Math.round(cost.livingAnnual / 12))}`}
          </p>
        </Surface>
        {cost.spouse ? (
          <Surface className="p-4">
            <SectionLabel>Pendant le permis Â· Conjoint</SectionLabel>
            <p className="mt-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.spouse.profession}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <BandMini label="Bas" value={money(cost.spouse.low)} />
              <BandMini label="MÃ©dian" value={money(cost.spouse.mid)} featured />
              <BandMini label="Ã‰levÃ©" value={money(cost.spouse.high)} />
            </div>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              {pathways.spouseOpen?.reason}
            </p>
          </Surface>
        ) : familyHasSpouse(profile.family) && pathways.spouseOpen && !pathways.spouseOpen.eligible ? (
          <Surface className="p-4">
            <SectionLabel>Pendant le permis Â· Conjoint</SectionLabel>
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
  const purpose = visitPurposeById(cost.purpose);
  const durationLabel = {
    "15d": "15 jours",
    "1m": "1 mois",
    "3m": "3 mois",
    "6m": "6 mois",
  }[cost.duration];
  return (
    <div className={cn("grid min-h-0 gap-3", cost.accompanying ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="p-4">
        <SectionLabel>Frais de voyage Â· Visa / eTA / biomÃ©trie</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Visa visiteur" value={fees.documentType === "visa" ? money(fees.documentTotal) : "Non"} />
          <FactLine label="eTA" value={fees.documentType === "eta" ? money(fees.documentTotal) : "Non"} />
          <FactLine label="BiomÃ©trie" value={money(fees.biometricsTotal)} />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`${profile.country} Â· document ${fees.documentType === "eta" ? "eTA" : "visa"}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>SÃ©jour Â· Foyer</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="DurÃ©e" value={cost.assumedDuration ? `${durationLabel} Â· aperÃ§u` : durationLabel} />
          <FactLine label="CoÃ»t du sÃ©jour" value={money(cost.stayCost)} />
          <FactLine label="Fonds Ã  dÃ©montrer" value={money(cost.fundsRequired)} />
          <FactLine label="Frais de demande foyer" value={money(cost.feesTotal)} />
          <FactLine label="Aller-retour" value={money(cost.ticketsDemo)} />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`IRCC nâ€™a pas de grille unique Â· un sÃ©jour de cette durÃ©e coÃ»te environ ${money(cost.stayCost)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Motif et attaches</SectionLabel>
        {cost.assumedPurpose ? (
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#1a2332]">
            {visitPurposes.map((item) => (
              <li key={item.id}>Â· {item.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px] font-semibold text-[#1a2332]">{purpose?.name}</p>
        )}
        <ul className="mt-3 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
          {(purpose?.ties ?? []).map((item) => (
            <li key={item}>Â· {item}</li>
          ))}
          {cost.purpose === "family" ? <li>Â· invitation / hÃ´te utile</li> : null}
        </ul>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {cost.canWork ? "travail possible" : "un visa visiteur nâ€™autorise pas Ã  travailler ni Ã  Ã©tudier"}
        </p>
      </Surface>
      {cost.accompanying ? (
        <Surface className="p-4">
          <SectionLabel>Accompagnants</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Adultes" value={String(cost.accompanying.adults)} />
            <FactLine label="Enfants" value={String(cost.accompanying.kids)} />
            <FactLine label="Statut" value="Visiteur" />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Pas de permis de travail, pas dâ€™Ã©cole sans permis dâ€™Ã©tudes.
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
  const selectedCode = provinceCode(profile.province) as keyof typeof c11WorkingCapital;
  return (
    <div className={cn("grid min-h-0 gap-3", familyHasSpouse(profile.family) ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="flex min-h-0 flex-col p-4 lg:col-span-2">
        <SectionLabel>Volets Â· Seuils dâ€™investissement</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {businessPaths.map((path) => (
            <span
              key={path.id}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                profile.businessPath === path.id ? "bg-secondary text-primary" : "bg-white text-[#1a2332] ring-1 ring-border",
              )}
            >
              {path.name}
            </span>
          ))}
          {startupVisaPaused ? (
            <span className="rounded-full bg-[#fff6e8] px-2.5 py-1 text-[11px] font-medium text-[#8c5a1d]">
              pause IRCC, pas de nouvelles demandes
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">{startupVisaNote}</p>
        {/* 13 provinces/territories */}
        <div className="mt-3 max-h-[min(42vh,22rem)] overflow-y-auto rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Province</th>
                <th className="px-3 py-2 text-right">C11 / fonds de roulement</th>
                <th className="px-3 py-2 text-right">Entrepreneur provincial</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(c11WorkingCapital) as Array<keyof typeof c11WorkingCapital>).map((code) => (
                <tr
                  key={code}
                  className={cn("border-t border-[#e5eaf0]", code === selectedCode && "bg-[#eef5ff] font-semibold text-primary")}
                >
                  <td className="px-3 py-1.5">{thresholdProvinceLabels[code]}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(c11WorkingCapital[code])}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(pnpEntrepreneur[code])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cost.path ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.path.needsInvestment
              ? `${cost.path.name} Â· seuil ${money(cost.investment)}`
              : `${cost.path.name} Â· pas un seuil dâ€™investissement`}
          </p>
        ) : null}
      </Surface>
      <Surface className="p-4">
        <SectionLabel>AnnÃ©e 1 Â· Capital</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Investissement" value={cost.investment > 0 ? money(cost.investment) : "Selon le volet"} />
          <FactLine label="Vie annuelle" value={cost.livingAnnual > 0 ? money(cost.livingAnnual) : "Non"} />
          <FactLine label="SÃ©jour court" value={cost.stayShort > 0 ? money(cost.stayShort) : "Non"} />
          <FactLine label="Fonds personnels" value={money(cost.personalFunds)} />
          <FactLine label="Capital Ã  dÃ©montrer" value={money(cost.capitalToShow)} featured />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`le volet demande ${money(cost.capitalToShow)} Â· la capacitÃ© affichÃ©e est ${money(cost.personalFunds)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Projet Â· CrÃ©dibilitÃ©</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="ExpÃ©rience" value={`${profile.applicant.experience} ans`} />
          <FactLine label="CapacitÃ©" value={`${profile.applicant.salary} Â· ${money(cost.personalFunds)}`} />
          <FactLine label="Province / volet" value={`${profile.province} Â· ${cost.path?.name ?? "Ã€ choisir"}`} />
        </dl>
        {cost.path ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.path.caution}
          </p>
        ) : null}
      </Surface>
      {familyHasSpouse(profile.family) ? (
        <Surface className="p-4">
          <SectionLabel>Pendant le projet Â· Conjoint</SectionLabel>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.spouseOpen
              ? `${profile.spouse.profession} Â· permis ouvert possible selon le volet`
              : "Visite, pas un permis de travail"}
          </p>
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
  const child = profile.children[0];
  const isQuebec = provinceCode(profile.province) === "QC";
  return (
    <div className="grid min-h-0 gap-3 lg:grid-cols-2">
      <Surface className="p-4">
        <SectionLabel>Liens admissibles Â· DÃ©lais</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Lien</th>
                <th className="px-3 py-2 text-right">Engagement</th>
                <th className="px-3 py-2 text-right">Hors QuÃ©bec</th>
                <th className="px-3 py-2 text-right">QuÃ©bec</th>
              </tr>
            </thead>
            <tbody>
              {familyLinks.map((link) => (
                <tr
                  key={link.id}
                  className={cn("border-t border-[#e5eaf0]", cost.link?.id === link.id && "bg-[#eef5ff] font-semibold text-primary")}
                >
                  <td className="px-3 py-1.5">
                    {link.id === "spouse" ? "Conjoint / partenaire" : link.id === "child" ? "Enfant Ã  charge" : "Parent / grand-parent"}
                  </td>
                  <td className="px-3 py-1.5 text-right">{`${link.undertakingYears} ans`}</td>
                  <td className="px-3 py-1.5 text-right">{cost.delay.tracks?.[0]?.value ?? "14-20 mois"}</td>
                  <td className="px-3 py-1.5 text-right">{cost.delay.tracks?.[1]?.value ?? "environ 36 mois"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cost.sponsorStatus === "pr" ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
              RÃ©sident permanent
            </span>
          ) : null}
          {cost.sponsorStatus === "citizen" ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">Citoyen</span>
          ) : null}
          {cost.link?.id === "parent" ? (
            <span className="rounded-full bg-[#fff6e8] px-2.5 py-1 text-[11px] font-medium text-[#8c5a1d]">
              super visa possible en parallÃ¨le
            </span>
          ) : null}
        </div>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Engagement Â· Revenu</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Taille" value={String(cost.familySize)} />
          <FactLine label="Revenu exigÃ©" value={money(cost.incomeRequired)} />
          <FactLine label="Revenu approx rÃ©pondant" value={money(cost.sponsorMid)} />
          {cost.undertakingYears ? <FactLine label="DurÃ©e" value={`${cost.undertakingYears} ans`} /> : null}
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`le seuil demande ${money(cost.incomeRequired)} Â· le mÃ©tier paie ${money(cost.sponsorMid)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Frais et vie Â· Foyer rÃ©uni</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Frais" value={money(cost.feesTotal)} />
          <FactLine label="CoÃ»t de vie annuel rÃ©uni" value={money(cost.livingReunitedAnnual)} />
        </dl>
        {isQuebec ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            DÃ©lai plus long au QuÃ©bec et frais MIFI inclus dans cet ordre de grandeur.
          </p>
        ) : null}
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Personne parrainÃ©e</SectionLabel>
        {cost.link?.id === "spouse" && cost.sponsored ? (
          <>
            <p className="mt-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.sponsored.profession}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <BandMini label="Bas" value={money(cost.sponsored.low)} />
              <BandMini label="MÃ©dian" value={money(cost.sponsored.mid)} featured />
              <BandMini label="Ã‰levÃ©" value={money(cost.sponsored.high)} />
            </div>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              {`EmployabilitÃ© ${cost.sponsored.employability} % Â· ${cost.sponsored.employabilityLabel} Â· aprÃ¨s lâ€™arrivÃ©e : RP, droit de travailler`}
            </p>
          </>
        ) : null}
        {cost.reminder ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.reminder ? "Ajoutez le conjoint au dossier pour afficher ses repÃ¨res." : ""}
          </p>
        ) : null}
        {cost.link?.id === "child" ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {child
              ? child.age < 18
                ? `${child.firstName || "Enfant"} Â· ${child.age} ans Â· Ã©cole aprÃ¨s lâ€™arrivÃ©e`
                : `${child.firstName || "Enfant"} Â· ${child.age} ans`
              : "Ajoutez un enfant pour afficher son repÃ¨re dâ€™arrivÃ©e."}
          </p>
        ) : null}
        {cost.link?.id === "parent" ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Super visa vs parrainage, sans salaire projetÃ©, avec engagement long.
          </p>
        ) : null}
        {!cost.link ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Choisissez un lien admissible pour afficher la personne parrainÃ©e.
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
  if (s.includes("diplÃ´me")) return GraduationCap;
  if (s.includes("invitation") || s.includes("nomination")) return Mail;
  if (s.includes("traitement") || s.includes("dÃ©cision") || s.includes("audience") || s.includes("fÃ©dÃ©rale")) return Scale;
  if (s.includes("crÃ©er le profil") || s.includes("prÃ©parer le profil")) return FilePlus;
  if (s.includes("Ã©valuer le profil") || s.includes("Ã©valuer si")) return ClipboardCheck;
  if (s.includes("conditions") || s.includes("respecter")) return ShieldCheck;
  if (s.includes("rÃ©cit") || s.includes("preuves")) return FileText;
  if (s.includes("rÃ©seau")) return UsersRound;
  if (s.includes("motif")) return Target;
  if (s.includes("arrivÃ©e") || s.includes("voyage")) return Plane;
  if (s.includes("projet") || s.includes("voie")) return Target;
  if (s.includes("admission")) return School;
  if (s.includes("autorisation")) return ShieldCheck;
  if (s.includes("permis")) return BadgeCheck;
  if (s.includes("programme") || s.includes("volet") || s.includes("choisir la province")) return ListChecks;
  if (s.includes("Ã©tudier") || s.includes("carriÃ¨re")) return BookOpen;
  if (s.includes("emploi") || s.includes("employeur")) return Briefcase;
  if (s.includes("fonds")) return Wallet;
  if (s.includes("lien") || s.includes("rÃ©pondant") || s.includes("attaches")) return UsersRound;
  if (s.includes("dÃ©poser") || s.includes("soumettre") || s.includes("dossier")) return FileCheck;
  if (s.includes("suivi") || s.includes("vÃ©rifier")) return Search;
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
      title="Comparer les voies cÃ´te Ã  cÃ´te."
      lead="Cochez jusquâ€™Ã  trois voies. Les dÃ©lais IRCC apparaissent en premier."
      pills={[market.family, market.province, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== "Ã‰tudes")]}
      hero={sectionBanners.compare}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 pb-1">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <SectionLabel>Voies Ã  comparer</SectionLabel>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {atCap
                ? "3 maximum. Cocher une autre voie remplace la plus ancienne."
                : selected.length === 0
                  ? "Choisissez jusquâ€™Ã  trois voies pour comparer."
                  : "Cochez ou dÃ©cochez : le comparatif suit immÃ©diatement."}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
            {selected.length}/{COMPARE_LIMIT} cochÃ©es
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Voies Ã  comparer">
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
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition active:scale-[0.98]",
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
                      "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
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
              <p className="mt-3 text-[15px] font-semibold text-[#1a2332]">Aucune voie sÃ©lectionnÃ©e</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Cochez jusquâ€™Ã  trois voies. Le dÃ©lai IRCC apparaÃ®t en premier, câ€™est souvent la question du foyer.
              </p>
            </div>
          </Surface>
        ) : (
          <>
            <IrccSourceBar />
            <div
              className={cn(
                "grid min-h-0 flex-1 gap-3",
                selected.length === 1 && "lg:grid-cols-1",
                selected.length === 2 && "lg:grid-cols-2",
                selected.length === 3 && "lg:grid-cols-3",
              )}
            >
              {selected.map((route) => (
                <CompareColumn
                  key={route.id}
                  route={route}
                  time={irccTimeFor(route.id)}
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
  fastest,
  aligned,
  onUncheck,
}: {
  route: ImmigrationRoute;
  time: IrccTime;
  fastest: boolean;
  aligned: boolean;
  onUncheck: () => void;
}) {
  const facts = [
    ["Objectif", route.tag],
    ["Profil type", route.fit],
    ["Condition", route.conditions[0] ?? "Selon le dossier"],
    ["Point fort", route.positives[0]],
    ["Attention", route.attention[0]],
  ] as const;
  return (
    <Surface className={cn("flex min-h-0 flex-col overflow-hidden", fastest && "ring-2 ring-primary/25")}>
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
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  fastest ? "bg-white/15 text-white" : "bg-white text-primary",
                )}
              >
                Profil
              </span>
            ) : null}
            {fastest ? (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">Plus rapide</span>
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
      <dl className="flex flex-1 flex-col gap-2.5 px-4 py-3">
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

function DelayBanner({ time }: { time: IrccTime }) {
  return (
    <Surface className="grid shrink-0 gap-3 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-primary uppercase">
          DÃ©lai approximatif IRCC Â· {irccTimesMeta.updatedLabel}
        </p>
        <p className="mt-1 text-[26px] leading-none font-semibold tracking-tight text-primary">{time.headline}</p>
        <p className="mt-1.5 text-[13px] text-[#5b6b7c]">{time.scope}</p>
      </div>
      <div className="sm:text-right">
        {time.tracks ? (
          <div className="mb-2 flex flex-wrap gap-1.5 sm:justify-end">
            {time.tracks.map((track) => (
              <span key={track.label} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-[#1a2332]">
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

function IrccSourceBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[1rem] border border-[#d7e4f3] bg-secondary px-3.5 py-2.5">
      <p className="inline-flex items-center gap-2 text-[12px] text-[#1a2332]">
        <Clock className="size-3.5 text-primary" strokeWidth={2} />
        DÃ©lais approximatifs {irccTimesMeta.sourceLabel}, {irccTimesMeta.updatedLabel}. Les temps rÃ©els varient selon le pays et le dossier.
      </p>
      <a
        href={irccTimesMeta.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
      >
        VÃ©rifier sur canada.ca
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
    ["A", "Aller vers la rÃ©sidence permanente", "Explorer dâ€™abord les voies Ã©conomiques directes."],
    ["B", "Construire une expÃ©rience canadienne", "Ã‰tudes ou travail selon les conditions applicables."],
    ["C", "Maximiser lâ€™employabilitÃ©", "Province + mÃ©tier + carriÃ¨re + immigration."],
    ["D", "Partir en famille", "Comparer coÃ»t, emploi du conjoint et installation."],
  ] as const;
  return (
    <OpportunitiesShell
      kicker="Comparateur Â· ScÃ©narios"
      title={smart("Quel scÃ©nario correspond le mieux Ã  {name} ?", profile)}
      lead="On choisit une logique de projet, pas un programme au hasard."
      pills={[market.family, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== "Ã‰tudes")]}
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
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
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

```

### src\features\profile.test.ts (238 lines)
```tsx
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "profile.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? undefined : next);
}

describe("profile shader banners", () => {
  it("keeps the water shader on the Profil client page header", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("<IrShaderGradient");
    expect(form).not.toContain("pitchHeroImage");
    expect(form).not.toContain("sectionBanners");
  });

  it("paints Candidat and Conjoint headers with a profile photo and a blue gradient", () => {
    const personCard = extractFunction("PersonCard");
    expect(source).toContain("personHeroImage");
    expect(personCard).toContain("personHeroImage(member)");
    expect(personCard).toContain("object-cover object-[80%_center]");
    expect(personCard).toContain("bg-linear-to-r from-primary/92 via-primary/62 to-primary/20");
    expect(personCard).not.toContain("<IrBlueSign");
    expect(personCard).not.toContain("<IrShaderGradient");
  });

  it("exposes a polygamous household with two wife cards", () => {
    expect(source).toContain('label: "Polygame"');
    expect(source).toContain("Ã‰pouse 1");
    expect(source).toContain("Ã‰pouse ${index + 2}");
    expect(source).toContain("Le Canada ne reconnaÃ®t quâ€™un conjoint");
  });
});

describe("principal mode chips", () => {
  it("stretches Auto / applicant / spouse chips to the Profil retenu width", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain("grid w-full");
    expect(panel).toContain("modeCols");
    expect(panel).toContain('className="w-full min-w-0 justify-center"');
  });

  it("lets Chip accept a className so mode chips can fill their column", () => {
    const chip = extractFunction("Chip");
    expect(chip).toContain("className?: string");
    expect(chip).toMatch(/cn\([\s\S]*className\s*\)/);
  });
});

describe("principal panel scroll", () => {
  it("scrolls the inner column without a visible scrollbar", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain(
      "relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    );
    expect(panel).not.toContain("[scrollbar-width:thin]");
    expect(panel).not.toContain("[scrollbar-gutter:stable]");
  });
});

describe("profile places strip", () => {
  it("does not show Canada landmark cards under the form", () => {
    const form = extractFunction("ProfileForm");
    expect(form).not.toContain("HoverRevealCards");
    expect(form).not.toContain("canadaPlacesFor");
    expect(form).not.toContain("place-strip-wrap");
  });
});

describe("profile form column scroll", () => {
  it("uses PageShell for the two-pane layout instead of a local overflow grid", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("<PageShell");
    expect(form).not.toContain("xl:overflow-y-auto");
    expect(form).not.toContain("xl:grid-cols-[minmax(0,1fr)_300px]");
  });
});

describe("principal panel readability", () => {
  it("uses larger, higher-contrast type on PrincipalPanel copy", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain(
      "text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase",
    );
    expect(panel).toContain("text-[24px] leading-none font-semibold tracking-tight");
    expect(panel).toContain("mt-1 text-[14px] text-white/85");
    expect(panel).toContain("mt-3 shrink-0 text-[14px] leading-snug text-white/90");
    expect(panel).toContain("text-[14px] leading-relaxed text-white/85");
    expect(panel).toContain("pt-0.5 text-[14px] font-semibold text-white");
    expect(panel).toContain("pt-0.5 text-[14px] text-white/85");
  });

  it("uses larger, higher-contrast type on PanelBlock, FactRow, ScoreBar, and ScorePick", () => {
    expect(extractFunction("PanelBlock")).toContain(
      "text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase",
    );
    expect(extractFunction("FactRow")).toContain("shrink-0 text-[13px] text-white/80");
    expect(extractFunction("FactRow")).toContain("text-right text-[14px] leading-tight font-medium");
    expect(extractFunction("ScoreBar")).toContain(
      "mb-0.5 flex items-center justify-between text-[12px] text-white/80",
    );
    expect(extractFunction("ScorePick")).toContain(
      "mt-1 block w-full truncate text-[13px] tracking-wide uppercase opacity-75",
    );
  });
});

describe("country of origin flags", () => {
  it("shows a flag next to the selected country and each option", () => {
    const select = extractFunction("CountrySelect");
    expect(select).toContain("<CountryFlag country={value} eager");
    expect(select).toContain("<CountryFlag country={option}");
  });
});

describe("adult sex field", () => {
  it("lets each PersonCard pick Femme or Homme", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain('label="Sexe"');
    expect(personCard).toContain("member.sex");
    expect(personCard).toContain("SexPicks");
    expect(personCard).toContain("onChange({ sex:");
    const sexPicks = extractFunction("SexPicks");
    expect(sexPicks).toContain("sexes");
    expect(sexPicks).toContain('role="radio"');
  });

  it("lets each PersonCard pick Noir, Blanc or MaghrÃ©bin", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain('label="Apparence"');
    expect(personCard).toContain("member.look");
    expect(personCard).toContain("AppearancePicks");
    expect(personCard).toContain("onChange({ look:");
  });
});

describe("study program fields", () => {
  it("opens a searchable catalog of named programs when the objective is Ã‰tudes", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("applicantStudy");
    expect(form).toContain('draft.objective === "Ã‰tudes"');
    expect(form).toContain("study={applicantStudy}");
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("StudyFields");
    expect(source).toContain("Programme visÃ©");
    expect(source).toContain("Choisir un programme");
    expect(source).toContain("Rechercher un programme");
    expect(source).toContain("searchStudyPrograms");
    expect(source).toContain("function ProgramSelect");
    expect(source).not.toContain("Niveau dâ€™Ã©tudes visÃ©");
    expect(source).not.toContain("studyProgramsForLevel");
    expect(source).not.toContain("<option value=\"\" />");
    expect(source).not.toContain("professionSector[draft.study");
  });
});

describe("closing profile objective fields", () => {
  it("shows work profile controls only for the applicant on Travail", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain('draft.objective === "Travail"');
    expect(form).toContain("applicantWork");
    expect(form).toContain("work={applicantWork}");
    expect(form).not.toContain("work={spouseWork}");
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("WorkFields");
    expect(source).toContain("NocSearchField");
    expect(source).toContain("Titre dâ€™emploi ou code CNP");
    expect(source).toContain("professionNoc");
    expect(source).toContain("workPermitKind");
    expect(source).toContain("workHasOffer");
    expect(source).toContain("Offre dâ€™emploi");
  });

  it("shows visit profile controls only on Visite", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain('draft.objective === "Visite"');
    expect(form).toContain("applicantVisit");
    expect(form).toContain("visit={applicantVisit}");
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("VisitFields");
    expect(source).toContain("visitPurpose");
    expect(source).toContain("visitDuration");
    expect(source).toContain("15 jours");
    expect(source).toContain("6 mois");
  });

  it("shows business path chips on Affaires without a selectable startup path", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain('draft.objective === "Affaires"');
    expect(form).toContain("applicantBusiness");
    expect(form).toContain("business={applicantBusiness}");
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("BusinessFields");
    expect(source).toContain("businessPath");
    expect(source).toContain("businessPaths");
    expect(source).toContain('path.id !== "startup"');
    expect(source).not.toContain('setProject("businessPath", "startup")');
  });

  it("shows family sponsorship controls and reminders only on Regroupement familial", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain('draft.objective === "Regroupement familial"');
    expect(form).toContain("applicantFamily");
    expect(form).toContain("family={applicantFamily}");
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("FamilyFields");
    expect(source).toContain("familyLink");
    expect(source).toContain("sponsorStatus");
    expect(source).toContain("ajoutez le conjoint au dossier");
    expect(source).toContain("ajoutez un enfant");
  });
});

describe("principal panel provincial lever", () => {
  it("shows a linguistic qualification lever instead of salary vs local median", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain("provinceLever");
    expect(panel).toContain("lever.requirementLabel");
    expect(panel).toContain("lever.candidateLabel");
    expect(panel).toContain("lever.verdict");
    expect(panel).not.toContain("MÃ©diane locale");
    expect(panel).not.toContain("salaryForProfession");
    expect(panel).not.toContain("salaryLift");
    expect(panel).not.toContain("financialCapacityAmount");
  });
});

describe("profile file import and export", () => {
  it("places Importer un profil client above Enregistrer", () => {
    const panel = extractFunction("PrincipalPanel");
    const importAt = panel.indexOf("Importer un profil client");
    const saveAt = panel.indexOf("Enregistrer");
    expect(importAt).toBeGreaterThan(-1);
    expect(saveAt).toBeGreaterThan(importAt);
    expect(panel).toContain('type="file"');
    expect(panel).toContain('accept=".json,application/json"');
    expect(panel).toContain('className="hidden"');
    expect(panel).toContain('aria-label="Importer un profil client"');
    expect(panel).toContain("Upload");
    expect(panel).toContain("ImportÃ©");
    expect(panel).toContain("importError");
    expect(panel).toContain("text-[#ffd4d4]");
  });

  it("downloads a portable profile file on save", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("serializeProfileFile");
    expect(form).toContain("profileFileName");
    expect(form).toContain("parseProfileFile");
    expect(form).toContain("importDraft");
    expect(form).toContain("downloadJson");
    expect(source).toContain("function downloadJson");
    expect(source).toContain('type: "application/json"');
  });
});


```

### src\features\immigration.test.ts (250 lines)
```tsx
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileCheck,
  FilePlus,
  FileText,
  GraduationCap,
  Languages,
  ListChecks,
  Mail,
  Plane,
  Scale,
  School,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import { routes } from "@/data/routes";
import { iconForStep } from "@/features/immigration";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "immigration.tsx"), "utf8");
const market = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`) !== -1
    ? source.indexOf(`function ${name}`)
    : source.indexOf(`export function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const from = start;
  const nextFunction = source.indexOf("\nfunction ", from + 1);
  const nextExportFunction = source.indexOf("\nexport function ", from + 1);
  const candidates = [nextFunction, nextExportFunction].filter((index) => index !== -1);
  const next = candidates.length > 0 ? Math.min(...candidates) : -1;
  return source.slice(from, next === -1 ? undefined : next);
}

describe("voies catalog", () => {
  it("keeps two pathway slides", () => {
    expect(sections.find((section) => section.id === "voies")?.slideCount).toBe(2);
  });
});

describe("voies chrome", () => {
  it("reuses the profil client shell on RoutesSection", () => {
    expect(source).toContain("export function RoutesSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Une destination. Plusieurs chemins.");
    expect(source).toContain("Le chemin dÃ©pend du foyer et de lâ€™objectif, pas dâ€™une brochure.");
    expect(source).not.toContain("Un statut nâ€™est pas encore le suivant.");
    expect(source).not.toContain("Chaque passerelle a des conditions. Les sauter coÃ»te des annÃ©es.");
    expect(market).toContain("export function OpportunitiesShell");
    expect(source).toContain("hero={sectionBanners.routes}");
    expect(source).toContain("hero={sectionBanners.compare}");
  });

  it("keeps coaching copy out of Routes helpers", () => {
    for (const name of ["RoutesSection", "RoutesOverview", "RoutesDetail"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectÃ©e");
      expect(chunk).not.toContain("conseil juridique automatisÃ©");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("voies boards", () => {
  it("renders overview and a detail view", () => {
    expect(source).toContain("Objectif");
    expect(source).not.toContain("Aucune passerelle pour ce point de dÃ©part.");
    expect(source).not.toContain("function RoutesBridges");
    expect(source).toContain("Voies Â· DÃ©tail");
    expect(source).toContain("AperÃ§u de dÃ©monstration. Pas un avis juridique.");
    expect(source).toContain("routeForObjective");
    expect(source).not.toContain("bridgesFrom");
    expect(source).toContain("Pour qui :");
    expect(source).toContain("function RouteSteps");
    expect(source).toContain("Points dâ€™attention");
  });

  it("embeds study tuition, funds, outcomes and a spouse card only when a partner is on file", () => {
    expect(source).toContain("function StudyClosingCards");
    expect(source).toContain("Tarifs dâ€™Ã©tudes internationaux Â· par annÃ©e");
    expect(source).toContain("CÃ©gep");
    expect(source).toContain("UniversitÃ©");
    expect(source).toContain("AnnÃ©e 1 Â· Foyer");
    expect(source).toContain("Preuve de fonds");
    expect(source).toContain("AprÃ¨s le diplÃ´me Â· Programme");
    expect(source).toContain("Pendant les Ã©tudes Â· Conjoint parrainÃ©");
    expect(source).toContain("Permis de travail ouvert pendant les Ã©tudes du candidat.");
    expect(source).toContain("cost.spouse");
    expect(source).toContain("studyCost");
    expect(source).toContain("s.draft");
    const detail = extractFunction("StudyClosingCards");
    expect(detail).toContain("cost.spouse ?");
    expect(source).not.toContain("slideCount: 3");
  });

  it("embeds work permit closing cards with FEER and spouse gating", () => {
    expect(source).toContain("function WorkClosingCards");
    expect(source).toContain("NocSearchField");
    expect(source).toContain("workCost");
    expect(source).toContain("workPathways");
    expect(source).toContain("Permis Â· Ouvert ou fermÃ©");
    expect(source).toContain("Renouvellement");
    expect(source).toContain("Vers la RP Â· AprÃ¨s une pÃ©riode");
    expect(source).toContain("AnnÃ©e 1 Â· Foyer");
    expect(source).toContain("VÃ©rifiez sur IRCC.");
    expect(source).toContain("Trouver votre CNP");
    expect(source).toContain("cost.spouse");
    expect(source).toContain("pathways.spouseOpen.reason");
  });

  it("embeds visit closing cards with no-work copy and accompanying gating", () => {
    expect(source).toContain("function VisitClosingCards");
    expect(source).toContain("visitCost");
    expect(source).toContain("Frais de voyage Â· Visa / eTA / biomÃ©trie");
    expect(source).toContain("SÃ©jour Â· Foyer");
    expect(source).toContain("Motif et attaches");
    expect(source).toContain("cost.accompanying");
    expect(source).toContain("un visa visiteur nâ€™autorise pas Ã  travailler ni Ã  Ã©tudier");
    expect(source).toContain("canWork");
  });

  it("embeds business closing cards with thresholds, pause copy and spouse gating", () => {
    expect(source).toContain("function BusinessClosingCards");
    expect(source).toContain("businessCost");
    expect(source).toContain("Volets Â· Seuils dâ€™investissement");
    expect(source).toContain("13 provinces/territories");
    expect(source).toContain("pause IRCC");
    expect(source).toContain("startupVisaPaused");
    expect(source).toContain("Pendant le projet Â· Conjoint");
    expect(source).toContain("familyHasSpouse");
  });

  it("embeds family closing cards with four titles and a reminder state", () => {
    expect(source).toContain("function FamilyClosingCards");
    expect(source).toContain("familyCost");
    expect(source).toContain("Liens admissibles Â· DÃ©lais");
    expect(source).toContain("Engagement Â· Revenu");
    expect(source).toContain("Frais et vie Â· Foyer rÃ©uni");
    expect(source).toContain("Personne parrainÃ©e");
    expect(source).toContain("cost.reminder");
  });
});

describe("comparateur catalog", () => {
  it("keeps two comparator slides", () => {
    expect(sections.find((section) => section.id === "comparateur")?.slideCount).toBe(2);
  });
});

describe("comparateur chrome", () => {
  it("reuses the profil client shell on CompareSection", () => {
    expect(source).toContain("export function CompareSection");
    expect(source).toContain("Comparer les voies cÃ´te Ã  cÃ´te.");
    expect(source).toContain("Cochez jusquâ€™Ã  trois voies. Les dÃ©lais IRCC apparaissent en premier.");
    expect(source).toContain("Quel scÃ©nario correspond le mieux Ã  {name} ?");
    expect(source).toContain("On choisit une logique de projet, pas un programme au hasard.");
  });

  it("keeps coaching copy out of Compare helpers", () => {
    for (const name of ["CompareSection", "CompareTable", "CompareScenarios"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("aider le prospect");
      expect(chunk).not.toContain("version connectÃ©e");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("comparateur boards", () => {
  it("compares up to three routes and highlights the household scenario", () => {
    expect(source).toContain("Choisissez jusquâ€™Ã  trois voies pour comparer.");
    expect(source).toContain("Profil type");
    expect(source).toContain("Condition");
    expect(source).toContain("Point fort");
    expect(source).toContain("recommendedScenarioId");
    expect(source).toContain("Foyer");
    expect(source).toContain("toggleCompare");
    expect(source).toContain("role=\"checkbox\"");
    expect(source).not.toContain("disabled={locked}");
    expect(source).toContain("mt-auto shrink-0");
    expect(source).toContain("flex min-h-0 flex-1 flex-col gap-3 pb-1");
  });

  it("puts current IRCC processing times first in the comparator", () => {
    expect(source).toContain("irccTimeFor");
    expect(source).toContain("DÃ©lais approximatifs");
    expect(source).toContain("VÃ©rifier sur canada.ca");
    expect(source).toContain("Plus rapide");
    expect(source).toContain("DelayChip");
    expect(source).toContain("DelayBanner");
  });
});

const stepIcons: Record<string, LucideIcon> = {
  "Ã‰valuer le profil": ClipboardCheck,
  "Passer les tests de langue": Languages,
  "Ã‰valuer les diplÃ´mes si requis": GraduationCap,
  "CrÃ©er le profil": FilePlus,
  "Recevoir une invitation Ã©ventuelle": Mail,
  "DÃ©poser le dossier": FileCheck,
  "Traitement et dÃ©cision": Scale,
  "DÃ©finir le projet": Target,
  "Choisir le programme": ListChecks,
  "Obtenir lâ€™admission": School,
  "PrÃ©parer les autorisations": ShieldCheck,
  "DÃ©poser le permis": BadgeCheck,
  "PrÃ©parer lâ€™arrivÃ©e": Plane,
  "Ã‰tudier et bÃ¢tir la carriÃ¨re": BookOpen,
  "Choisir la province": ListChecks,
  "VÃ©rifier le volet": ListChecks,
  "PrÃ©parer le profil": FilePlus,
  "Soumettre la demande": FileCheck,
  "Nomination Ã©ventuelle": Mail,
  "Ã‰tape fÃ©dÃ©rale": Scale,
  "DÃ©cision": Scale,
  "Identifier lâ€™emploi": Briefcase,
  "VÃ©rifier le permis applicable": BadgeCheck,
  "PrÃ©parer employeur et documents": Briefcase,
  "DÃ©poser la demande": FileCheck,
  "ArrivÃ©e et emploi": Plane,
  "VÃ©rifier le lien admissible": UsersRound,
  "PrÃ©parer le rÃ©pondant": UsersRound,
  "Constituer les preuves": FileText,
  "DÃ©poser": FileCheck,
  "Suivi": Search,
  "Clarifier le projet": Target,
  "Choisir la voie": Target,
  "PrÃ©parer le dossier": FileCheck,
  "Structurer le voyage ou projet": Plane,
  "DÃ©velopper le rÃ©seau": UsersRound,
  "Clarifier le motif du voyage": Target,
  "RÃ©unir fonds et attaches": Wallet,
  "Voyager si approuvÃ©": Plane,
  "Respecter les conditions du sÃ©jour": ShieldCheck,
  "Ã‰valuer si la crainte est fondÃ©e": ClipboardCheck,
  "DÃ©poser la demande au Canada": FileCheck,
  "PrÃ©parer le rÃ©cit et les preuves": FileText,
  "Audience ou Ã©tude du dossier": Scale,
  "DÃ©cision et suite de statut": Scale,
};

describe("pathway step icons", () => {
  it("covers every route step with a dedicated pictogram", () => {
    const steps = [...new Set(routes.flatMap((route) => route.steps))];
    expect(steps.sort()).toEqual(Object.keys(stepIcons).sort());
    for (const step of steps) {
      expect(iconForStep(step), step).toBe(stepIcons[step]);
    }
  });

  it("does not treat a professional network as a job briefcase", () => {
    expect(iconForStep("DÃ©velopper le rÃ©seau")).toBe(UsersRound);
    expect(iconForStep("DÃ©velopper le rÃ©seau")).not.toBe(Briefcase);
  });
});


```
