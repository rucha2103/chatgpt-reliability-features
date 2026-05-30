# Phase-Wise Architecture — Action Sequence

This folder defines **what to build, in what order**. Each phase is a block of actions. Do not start a phase until every phase listed under **Depends on** is complete.

## Master sequence

```
Phase 01 → Phase 02 → Phase 03 → Phase 04 → Phase 05
                                              ↓
                    ┌─────────────────────────┼─────────────────────────┐
                    ↓                         ↓                         ↓
               Phase 06                  Phase 08                  Phase 09
                    ↓                         ↓                         ↓
               Phase 07                  (done)                    Phase 10
                    ↓                                                   ↓
                    └───────────────────────┬───────────────────────────┘
                                            ↓
                                       Phase 11
```

| Order | Phase | File | What you achieve |
|------:|-------|------|------------------|
| 1 | Foundation & project setup | [phase-01-foundation.md](./phase-01-foundation.md) | Runnable Next.js app with dependencies and env |
| 2 | ChatGPT UI shell | [phase-02-ui-shell.md](./phase-02-ui-shell.md) | Pixel-accurate dark-mode layout (no AI yet) |
| 3 | Client state | [phase-03-client-state.md](./phase-03-client-state.md) | Zustand store wired to UI |
| 4 | OpenAI API route | [phase-04-openai-api-route.md](./phase-04-openai-api-route.md) | Secure server-side OpenAI proxy |
| 5 | End-to-end chat | [phase-05-end-to-end-chat.md](./phase-05-end-to-end-chat.md) | User can send a message and get a streamed reply |
| 6 | Structured outputs | [phase-06-structured-outputs.md](./phase-06-structured-outputs.md) | Backend returns parseable JSON for complex features |
| 7 | Architect Mode | [phase-07-architect-mode.md](./phase-07-architect-mode.md) | 3 tabbed coding approaches |
| 8 | Tone-Retry Layer | [phase-08-tone-retry.md](./phase-08-tone-retry.md) | Rewrite assistant text by tone |
| 9 | Context Sentinel | [phase-09-context-sentinel.md](./phase-09-context-sentinel.md) | Token ring + 85% warning toast |
| 10 | Temporal Citations | [phase-10-temporal-citations.md](./phase-10-temporal-citations.md) | Superscript citations with date tooltips |
| 11 | Demo & testing defaults | [phase-11-demo-testing.md](./phase-11-demo-testing.md) | Pre-filled prompt and demo system priming |

## Parallel work (optional)

After **Phase 05** is done, these can be built in any order relative to each other:

- Phase 07 (Architect Mode) — requires Phase 06
- Phase 08 (Tone-Retry) — does not require Phase 06
- Phase 09 (Context Sentinel) — does not require Phase 06
- Phase 10 (Temporal Citations) — requires Phase 06

**Phase 11 must be last.**

## Tech stack (fixed)

- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- openai Node.js SDK
- Zustand
- lucide-react
- tiktoken (or char-based estimate fallback)

## Source of truth

Feature requirements: `Master Prompt/Master Prompt- Graduation Project.pdf`
