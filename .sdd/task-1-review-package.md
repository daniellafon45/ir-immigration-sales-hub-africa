# Review package — Task 1 (no git; working-tree snapshot)

**Base:** pre-task working tree
**Head:** current working tree (uncommitted; git unused by design)

## Files changed

- src/features/profile.test.ts
- src/features/profile.tsx

## Stat

```
 src/features/profile.test.ts | +14
 src/features/profile.tsx     | Chip className passthrough + PrincipalPanel grid row
```

## Diff with context

### src/features/profile.test.ts

Appended:

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

### src/features/profile.tsx — PrincipalPanel mode row

Was:

```tsx
      <div className="mt-3 flex shrink-0 flex-wrap gap-1.5">
        {(["auto", "applicant", ...(showSpouse ? (["spouse"] as const) : [])] as PrincipalMode[]).map((mode) => {
          const label =
            mode === "auto"
              ? "Auto"
              : mode === "applicant"
                ? draft.applicant.firstName || "Candidat"
                : draft.spouse.firstName || "Conjoint";
          return (
            <Chip key={mode} compact selected={draft.principalMode === mode} onClick={() => onMode(mode)} inverted>
              {label}
            </Chip>
          );
        })}
      </div>
```

Now (lines 383-409):

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

### src/features/profile.tsx — Chip

Added optional `className?: string` to props; destructured `className`; passed as last argument to `cn(...)` without trailing comma:

```tsx
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
        className
      )}
```

Objectif / Destination Chip call sites were not given `className`.

Profil retenu remains `<PanelBlock title="Profil retenu">` inside the scroll column of the same padded `PrincipalPanel`.
