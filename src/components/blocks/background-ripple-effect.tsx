import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ClickedCell = { row: number; col: number } | null;

export function BackgroundCells({
  className,
  children,
  rows = 6,
  cols = 22,
  cellSize = 48,
}: {
  className?: string;
  children?: ReactNode;
  rows?: number;
  cols?: number;
  cellSize?: number;
}) {
  const [clickedCell, setClickedCell] = useState<ClickedCell>(null);
  const [rippleKey, setRippleKey] = useState(0);

  useEffect(() => {
    setClickedCell({ row: Math.floor(rows / 2), col: Math.floor(cols / 2) });
    setRippleKey(1);
  }, [rows, cols]);

  function handleCellClick(row: number, col: number) {
    setClickedCell({ row, col });
    setRippleKey((key) => key + 1);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden [--cell-border-color:#3a70a6] [--cell-fill-color:rgba(27,84,141,0.32)] [--cell-shadow-color:#12344f]",
        className,
      )}
    >
      <DivGrid
        key={`cells-${rippleKey}`}
        className="mask-radial-from-15% mask-radial-at-center opacity-80"
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        borderColor="var(--cell-border-color)"
        fillColor="var(--cell-fill-color)"
        clickedCell={clickedCell}
        onCellClick={handleCellClick}
        interactive
      />
      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center px-6">
        {children}
      </div>
    </div>
  );
}

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: ClickedCell;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

function DivGrid({
  className,
  rows,
  cols,
  cellSize,
  borderColor,
  fillColor,
  clickedCell,
  onCellClick,
  interactive = true,
}: DivGridProps) {
  const cells = useMemo(() => Array.from({ length: rows * cols }, (_, idx) => idx), [rows, cols]);

  return (
    <div
      className={cn("absolute inset-0 z-[1] overflow-hidden", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(${cellSize}px, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;
        const style: CellStyle = clickedCell
          ? { "--delay": `${delay}ms`, "--duration": `${duration}ms` }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-80",
              "shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]",
              clickedCell && "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor,
              ...style,
            }}
            onClick={interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined}
          />
        );
      })}
    </div>
  );
}
