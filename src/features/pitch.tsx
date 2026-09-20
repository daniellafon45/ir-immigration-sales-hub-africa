import { Card } from "@/components/ui/card";
import { pitchSlides } from "@/data/pitch";
import { PitchDeck } from "@/features/pitch-deck";
import { installmentSplit } from "@/lib/finance";
import { money } from "@/lib/format";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function PitchSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const current = pitchSlides[slide] ?? pitchSlides[0];
  return <PitchDeck slide={current} profile={profile} />;
}

export function RiskGrid({ items }: { items: string[] }) {
  return (
    <div className="ir-auto-grid">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2.5 rounded-[13px] border border-border bg-white p-3.5">
          <b className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#fff0f2] text-lg text-destructive">×</b>
          <span className="text-xs text-[#404b59]">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function TwoFutures() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <span className="text-[10px] font-extrabold tracking-[0.14em] text-muted-foreground">Attendre</span>
        <h3 className="mt-2 mb-2 text-2xl font-semibold">12 mois passent</h3>
        <p className="text-muted-foreground">Mêmes questions. Peu de préparation. Moins de marge de manœuvre.</p>
      </Card>
      <Card className="border-[#9ebce1] bg-[#eef5fd] p-6">
        <span className="text-[10px] font-extrabold tracking-[0.14em] text-muted-foreground">Commencer</span>
        <h3 className="mt-2 mb-2 text-2xl font-semibold">12 mois passent aussi</h3>
        <p className="text-muted-foreground">Documents prêts. Profil renforcé. Budget organisé. Projet structuré.</p>
      </Card>
    </div>
  );
}

export function Installments({ total }: { total: number }) {
  const parts = installmentSplit(total);
  return (
    <>
      <div className="ir-auto-grid">
        {parts.map((part) => (
          <Card key={part.label} className="p-[18px] text-center">
            <span className="text-[10px] text-muted-foreground uppercase">{part.label}</span>
            <strong className="mt-1.5 block text-[21px] text-primary">{money(part.amount)}</strong>
          </Card>
        ))}
      </div>
      <div className="mt-3.5 flex justify-end gap-3.5 text-[17px]">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
    </>
  );
}
