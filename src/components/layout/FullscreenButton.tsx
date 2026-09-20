import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isFullscreenActive, toggleFullscreen } from "@/lib/fullscreen";
import { cn } from "@/lib/utils";

export function FullscreenButton({ className }: { className?: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    function sync() {
      setActive(isFullscreenActive());
    }
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-10 text-[#5b6b7c]", className)}
      aria-label={active ? "Quitter le plein écran" : "Plein écran"}
      aria-pressed={active}
      onClick={() => {
        void toggleFullscreen();
      }}
    >
      {active ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
    </Button>
  );
}
