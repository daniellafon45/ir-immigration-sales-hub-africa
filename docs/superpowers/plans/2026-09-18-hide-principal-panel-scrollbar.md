# Hide PrincipalPanel Scrollbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the visible scrollbar in the demandeur principal sidebar while keeping the inner column scrollable.

**Architecture:** `PrincipalPanel` already scrolls its body with `overflow-y-auto [scrollbar-width:thin] [scrollbar-gutter:stable]`, which draws a native thin scrollbar and reserves a stable gutter. Match the hidden-scrollbar pattern already used on `ProfileForm`: `overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`. Keep overflow so wheel/touch still scroll.

**Tech Stack:** React 19, Tailwind CSS 4, Vitest source-inspection tests (`src/features/profile.test.ts`).

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any `git` command. There is no project git repo; the parent home directory git must not be touched.
- Do not commit.
- Do not change layout, copy, chips, scores, or Enregistrer.
- Keep `overflow-y-auto` so the inner column still scrolls when content overflows.
- Hide the scrollbar on Firefox (`scrollbar-width: none`), IE/legacy Edge (`-ms-overflow-style: none`), and WebKit (`::-webkit-scrollbar { display/hidden }`).
- Remove `[scrollbar-width:thin]` and `[scrollbar-gutter:stable]` from `PrincipalPanel` — the gutter is the reserved track the user circled.
- Follow the existing `ProfileForm` class string for hidden scrollbars: `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`.
- Follow existing `profile.test.ts` source-read tests (`extractFunction`), not a new test runner or RTL suite.
- User-facing language stays French. Code and test names stay in the existing English style.

---

### Task 1: Hide the PrincipalPanel inner scrollbar

**Files:**
- Modify: `src/features/profile.test.ts` (`describe("principal mode chips")` and a new `describe` for the panel scroll)
- Modify: `src/features/profile.tsx` (`PrincipalPanel` inner scroller around line 450)

**Interfaces:**
- Consumes: existing `PrincipalPanel` body wrapper `div` with `overflow-y-auto`.
- Produces: that same wrapper keeps `overflow-y-auto` and uses `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` instead of `[scrollbar-width:thin] [scrollbar-gutter:stable]`.

- [ ] **Step 1: Write the failing test**

In `src/features/profile.test.ts`, remove the `[scrollbar-gutter:stable]` assertion from the chips test (that class will leave `PrincipalPanel`), and add:

```ts
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
```

The chips test must still contain:

```ts
    expect(panel).toContain("grid w-full");
    expect(panel).toContain("modeCols");
    expect(panel).toContain('className="w-full min-w-0 justify-center"');
```

and must **not** assert `[scrollbar-gutter:stable]`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/profile.test.ts`

Expected: FAIL because `PrincipalPanel` still has `[scrollbar-width:thin] [scrollbar-gutter:stable]`.

- [ ] **Step 3: Write minimal implementation**

In `src/features/profile.tsx`, change the `PrincipalPanel` inner scroller `className` from:

```
relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:thin] [scrollbar-gutter:stable]
```

to:

```
relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
```

Do not change any other class on that `div` or any sibling.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/profile.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Skip. Global constraint: do not run git; do not commit.
