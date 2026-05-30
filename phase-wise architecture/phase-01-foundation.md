# Phase 01 — Foundation & Project Setup

**Goal:** A clean, runnable project with all dependencies and environment configuration in place.

**Depends on:** Nothing (start here)

**Unlocks:** Phase 02, Phase 04

---

## Actions (in order)

### 1. Create the Next.js project

- Run `create-next-app` with TypeScript, ESLint, Tailwind CSS, and App Router enabled.
- Confirm the dev server starts with `npm run dev`.

### 2. Install required packages

Install in this order:

1. `zustand` — client state
2. `openai` — server-side API calls
3. `framer-motion` — animations (toasts, tab transitions)
4. `lucide-react` — icons
5. `react-markdown` and `remark-gfm` — render assistant markdown
6. `tiktoken` — token counting (server-side only)

Add syntax highlighting later when Architect Mode UI is built (Phase 07).

### 3. Configure environment variables

- Create `.env.local` at the project root.
- Add `OPENAI_API_KEY=your_key_here`.
- Add `.env.local` to `.gitignore` if not already ignored.
- Do not commit the key.

### 4. Set global dark-mode defaults

- Set the root layout background to dark (`#212121` or equivalent).
- Ensure the app renders in dark mode by default (no light-mode toggle required for the prototype).

### 5. Define shared design constants

Create a single constants file (or Tailwind theme extension) with:

- Sidebar background: `#171717`
- Main chat background: `#212121`
- ChatGPT-style message max-width (~768px centered)
- Context token limit (e.g. `128000`) — used later in Phase 09
- Sentinel warning threshold: `0.85` (85%)

### 6. Verify the baseline

- [ ] `npm run dev` runs without errors
- [ ] Tailwind classes apply correctly
- [ ] `.env.local` exists locally and is gitignored
- [ ] All packages listed above are in `package.json`

---

## Done when

You have an empty Next.js app that starts reliably, has the correct dependencies installed, and has design constants + env ready for the UI and API phases.

**Next:** [Phase 02 — ChatGPT UI Shell](./phase-02-ui-shell.md)
