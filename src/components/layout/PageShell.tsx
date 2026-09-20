import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  panel,
  children,
}: {
  panel?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="page-shell">
      <div className={cn("page-shell__frame", panel && "page-shell__frame--split")}>
        <div className="page-shell__main">{children}</div>
        {panel ? <aside className="page-shell__aside">{panel}</aside> : null}
      </div>
    </article>
  );
}
