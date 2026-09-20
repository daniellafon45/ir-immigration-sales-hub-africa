# Align Principal Mode Chips Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Auto / Loriane / Marc mode chips always share the same left and right edges as the Profil retenu block in the demandeur principal sidebar.

**Architecture:** The chips currently live in a `flex flex-wrap` row and size to their labels, so they sit shorter than `PanelBlock`. Stretch them with a full-width CSS grid (2 or 3 equal columns) and `w-full` chips so they always match the card below, with or without a conjoint.

**Tech Stack:** React 19, Tailwind CSS 4, Vitest source-inspection tests (same pattern as `src/features/profile.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- Do not refactor `PrincipalPanel` layout beyond the mode chips row and the `Chip` `className` passthrough.
- Do not change Chip styling for Objectif / Destination usages.
- Mode chips must stay a segmented control: Auto, applicant first name (or "Candidat"), and spouse first name (or "Conjoint") when `showSpouse` is true.
- With spouse: 3 equal columns spanning the same width as `PanelBlock` (`Profil retenu`). Without spouse: 2 equal columns spanning that same width.
- Chips must stay horizontally centered in their column, with `min-w-0` so long names cannot overflow the Profil retenu right edge.
- Follow existing `profile.test.ts` source-read tests (`extractFunction`), not a new test runner or RTL suite.
- User-facing language stays French. Code and test names stay in the existing English style.

---

### Task 1: Stretch Auto / Loriane / Marc to Profil retenu width

**Files:**
- Modify: `src/features/profile.test.ts`
- Modify: `src/features/profile.tsx` (`PrincipalPanel` mode chips around lines 380-394, `Chip` around lines 975-1014)

**Interfaces:**
- Consumes: existing `Chip` (`selected`, `onClick`, `children`, `inverted`, `compact`, `title`, `ariaLabel`)
- Produces: `Chip` also accepts optional `className?: string` merged last via `cn(...)`. Principal mode row uses `grid w-full` with `grid-cols-3` when `showSpouse` else `grid-cols-2`. Each mode `Chip` gets `className="w-full min-w-0 justify-center"`.

- [ ] **Step 1: Write the failing test**

Append to `src/features/profile.test.ts` inside the existing `describe` or a new `describe("principal mode chips")`:

```ts
describe("principal mode chips", () => {
  it("stretches Auto / applicant / spouse chips to the Profil retenu width", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain('grid w-full');
    expect(panel).toContain('showSpouse ? "grid-cols-3" : "grid-cols-2"');
    expect(panel).toContain('className="w-full min-w-0 justify-center"');
  });

  it("lets Chip accept a className so mode chips can fill their column", () => {
    const chip = extractFunction("Chip");
    expect(chip).toContain("className?: string");
    expect(chip).toMatch(/cn\([\s\S]*className\s*\)/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/profile.test.ts`

Expected: FAIL because `PrincipalPanel` still uses `flex shrink-0 flex-wrap` and `Chip` has no `className` prop.

- [ ] **Step 3: Write minimal implementation**

Replace the mode chips wrapper in `PrincipalPanel`:

```tsx
      <div
        className={cn(
          "mt-3 grid w-full shrink-0 gap-1.5",
          showSpouse ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {(["auto", "applicant", ...(showSpouse ? (["spouse"] as const) : [])] as PrincipalMode[]).map((mode) => {
          const label =
            mode === "auto"
              ? "Auto"
              : mode === "applicant"
                ? draft.applicant.firstName || "Candidat"
                : draft.spouse.firstName || "Conjoint";
          return (
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
          );
        })}
      </div>
```

Update `Chip` to accept and merge `className`:

```tsx
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
            ? "bg-primary text-white shadow-[0_8px_16px_rgba(0,82,164,.22)]"
            : "bg-secondary text-primary hover:bg-[#d4e4f2]",
        className,
      )}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `npm test -- src/features/profile.test.ts`

Expected: PASS. Then run `npm test` once. Expected: all existing tests still pass.

- [ ] **Step 5: Do not commit**

Skip git. Write the report file only.
