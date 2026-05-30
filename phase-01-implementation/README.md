# Phase 01 — Implementation Log

**Status:** Complete (pending your manual setup steps)  
**Date:** 2026-05-30  
**App location:** `chatgpt-trust-prototype/`

---

## What was built

Phase 01 establishes a runnable Next.js foundation with all dependencies declared, dark-mode defaults, shared design constants, and environment variable scaffolding.

### 1. Next.js project scaffolded

Created `chatgpt-trust-prototype/` with:

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- ESLint

### 2. Dependencies declared in `package.json`

| Package | Purpose | Used in phase |
|---------|---------|---------------|
| `zustand` | Client state | Phase 03 |
| `openai` | Groq API (OpenAI-compatible client) | Phase 04 |
| `framer-motion` | Animations | Phase 07, 09, 10 |
| `lucide-react` | Icons | Phase 02 |
| `react-markdown` | Render assistant messages | Phase 05 |
| `remark-gfm` | GitHub-flavored markdown | Phase 05 |
| `tiktoken` | Token counting | Phase 04, 09 |

Syntax highlighting (`shiki` or similar) is intentionally deferred to Phase 07.

### 3. Environment configuration

- `.env.example` — template with `GROQ_API_KEY` and `GROQ_MODEL`
- `.gitignore` — excludes `.env*.local` and `.env`

**You must create `.env.local` manually** — see [MANUAL-STEPS.md](./MANUAL-STEPS.md).

### 4. Dark-mode defaults

- `app/layout.tsx` — `html` has `className="dark"`, body uses `bg-main`
- `app/globals.css` — `color-scheme: dark`, background `#212121`

### 5. Shared design constants

File: `chatgpt-trust-prototype/lib/constants.ts`

| Constant | Value | Used later in |
|----------|-------|---------------|
| `SIDEBAR_BG` | `#171717` | Phase 02 sidebar |
| `MAIN_BG` | `#212121` | Phase 02 main area |
| `CHAT_MAX_WIDTH_PX` | `768` | Phase 02 message layout |
| `TOKEN_LIMIT` | `128000` | Phase 09 Context Sentinel |
| `SENTINEL_WARN_THRESHOLD` | `0.85` | Phase 09 warning toast |

Tailwind theme tokens in `globals.css`: `bg-sidebar`, `bg-main`, `text-text-primary`, `text-text-muted`, `border-border-chat`.

### 6. Placeholder home page

`app/page.tsx` shows a minimal dark screen confirming Phase 01 — replaced in Phase 02 with the ChatGPT UI shell.

---

## Files created

```
chatgpt-trust-prototype/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── constants.ts
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Verification checklist

After completing [MANUAL-STEPS.md](./MANUAL-STEPS.md):

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts on http://localhost:3000
- [ ] Page shows dark background (`#212121`) and placeholder text
- [ ] `.env.local` exists with your API key (not committed)
- [ ] All Phase 01 packages appear in `node_modules`

---

## Next phase

**Phase 02 — ChatGPT UI Shell**  
Build the pixel-accurate sidebar, header, message area, and chat input.

Documentation will be saved in `phase-02-implementation/`.
