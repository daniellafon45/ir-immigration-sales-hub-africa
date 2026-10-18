import { useMemo, useState } from "react";
import { CalendarCheck, Compass, MapPin, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { latestCutoffs } from "@/data/ee-rounds";
import {
  educationLevels,
  familyHasSpouse,
  financialCapacities,
  financialCapacityAmount,
  languageLevels,
  normalizeFinancialCapacity,
  type AdultMember,
} from "@/data/profile";
import { SectionLabel, Surface } from "@/features/market";
import { useEeRounds } from "@/lib/ee-rounds-live";
import { buildPistes, PISTES_DISCLAIMER, type Piste } from "@/lib/pistes";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

/**
 * « Vos pistes vers le Canada » : montre au prospect que c’est possible et l’amène au rendez-vous.
 * Volontairement sans détail technique ni avis : l’évaluation complète se fait avec un conseiller.
 */
export function PistesPanel() {
  const draft = useProfileStore((s) => s.draft);
  const patchApplicant = useProfileStore((s) => s.patchApplicant);
  const patchSpouse = useProfileStore((s) => s.patchSpouse);
  const goToSectionId = useDeckStore((s) => s.goToSectionId);
  const [open, setOpen] = useState(false);
  const ee = useEeRounds();
  const cutoffs = useMemo(() => latestCutoffs(ee.rounds), [ee.rounds]);
  const view = useMemo(() => (open ? buildPistes(draft, { cutoffs, rounds: ee.rounds }) : null), [open, draft, cutoffs, ee.rounds]);

  return (
    <Surface className="ir-rise !flex-none p-3 sm:px-4 sm:py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <SectionLabel>Vos pistes vers le Canada</SectionLabel>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            À partir du profil : métier, expérience, langues et capacité financière — toutes provinces.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen((v) => !v)}>
          <Compass className="size-3.5" />
          {open ? "Masquer" : "Voir les pistes possibles"}
        </Button>
      </div>

      {view ? (
        <div className="mt-3 grid gap-3">
          <div className="rounded-xl border border-[#e8ecf2] bg-[#f7fafc] p-3">
            <p className="text-[12px] font-semibold text-[#1a2332]">Le profil en 5 questions</p>
            <p className="text-[11px] text-muted-foreground">Les pistes se mettent à jour à chaque réponse.</p>
            <div className={cn("mt-2 grid gap-3", familyHasSpouse(draft.family) && "@min-[40rem]:grid-cols-2")}>
              <AdultQuestions member={draft.applicant} onChange={patchApplicant} />
              {familyHasSpouse(draft.family) ? <AdultQuestions member={draft.spouse} onChange={patchSpouse} /> : null}
            </div>
          </div>
          <p className="text-[14px] font-semibold text-[#1a2332]">{view.headline}</p>
          {view.pistes.length > 0 ? (
            <ol className="grid gap-2 @min-[44rem]:grid-cols-3">
              {view.pistes.map((piste, index) => (
                <PisteCard key={piste.id} piste={piste} index={index} />
              ))}
            </ol>
          ) : null}
          <div className="flex flex-col gap-3 rounded-xl bg-linear-to-br from-primary to-ir-deep p-4 text-white @min-[36rem]:flex-row @min-[36rem]:items-center @min-[36rem]:justify-between">
            <p className="text-[13px] leading-snug">
              Prochaine étape : un conseiller confirme la meilleure voie, le calendrier et le budget avec le prospect.
            </p>
            <button
              type="button"
              onClick={() => goToSectionId("rdv")}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-primary hover:bg-white/90"
            >
              <CalendarCheck className="size-4" />
              Prendre RDV pour confirmer l’éligibilité
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">{PISTES_DISCLAIMER}</p>
        </div>
      ) : null}
    </Surface>
  );
}

/** Les 5 réponses qui comptent pour les pistes : langues, expérience, diplôme, budget. */
function AdultQuestions({ member, onChange }: { member: AdultMember; onChange: (patch: Partial<AdultMember>) => void }) {
  return (
    <fieldset className="grid min-w-0 gap-2">
      <legend className="mb-1 text-[12px] font-semibold text-primary">{member.firstName || "Adulte"}</legend>
      <div className="grid grid-cols-2 gap-2">
        <QuestionSelect label="Français" value={member.french} options={languageLevels} onChange={(v) => onChange({ french: v })} />
        <QuestionSelect label="Anglais" value={member.english} options={languageLevels} onChange={(v) => onChange({ english: v })} />
        <QuestionNumber
          label="Expérience (ans)"
          owner={member.firstName}
          value={member.experience}
          onChange={(v) => onChange({ experience: v })}
        />
        <QuestionSelect label="Diplôme" value={member.education} options={educationLevels} onChange={(v) => onChange({ education: v })} />
        <QuestionSelect
          label="Budget (tranche)"
          value={member.salary}
          options={financialCapacities}
          onChange={(v) => onChange({ salary: v as AdultMember["salary"], fundsCad: 0 })}
        />
        <QuestionNumber
          label="Montant exact ($)"
          owner={member.firstName}
          value={member.fundsCad}
          emptyWhenZero
          placeholder={`≈ ${financialCapacityAmount(member.salary).toLocaleString("fr-CA")}`}
          onChange={(v) => onChange({ fundsCad: v, ...(v > 0 ? { salary: normalizeFinancialCapacity(v) } : {}) })}
        />
      </div>
    </fieldset>
  );
}

function QuestionNumber({
  label,
  owner,
  value,
  onChange,
  placeholder,
  emptyWhenZero = false,
}: {
  label: string;
  owner: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  emptyWhenZero?: boolean;
}) {
  return (
    <label className="grid min-w-0 gap-1">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <Input
        aria-label={`${label} (${owner || "adulte"})`}
        type="number"
        min={0}
        value={emptyWhenZero && value === 0 ? "" : value}
        placeholder={placeholder}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="h-8"
      />
    </label>
  );
}

function QuestionSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <Select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="h-8">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Select>
    </label>
  );
}

function PisteCard({ piste, index }: { piste: Piste; index: number }) {
  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-[#e8ecf2] bg-[#f7fafc] p-3">
      <div className="flex items-start gap-2">
        {index === 0 ? <Trophy className="mt-0.5 size-4 shrink-0 text-primary" /> : null}
        <p className="text-[13px] font-semibold text-[#1a2332]">{piste.name}</p>
      </div>
      <span
        className={cn(
          "w-fit rounded-lg px-2 py-0.5 text-[11px] font-semibold",
          piste.label === "Piste solide" ? "bg-[#e8f6ee] text-[#176b3a]" : "bg-[#eef4fb] text-primary",
        )}
      >
        {piste.label}
      </span>
      <p className="text-[12px] text-[#1a2332]">{piste.why}</p>
      <p className="flex items-start gap-1 text-[12px] text-muted-foreground">
        <Timer className="mt-0.5 size-3 shrink-0" /> {piste.delay}
      </p>
      <p className="flex items-start gap-1 text-[12px] text-muted-foreground">
        <MapPin className="mt-0.5 size-3 shrink-0" /> {piste.province} · dépôt par {piste.filerName}
        {piste.withEmployer ? " · avec une offre d’emploi canadienne" : ""}
      </p>
    </li>
  );
}
