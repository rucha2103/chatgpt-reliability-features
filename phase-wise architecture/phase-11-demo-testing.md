# Phase 11 — Demo & Testing Defaults

**Goal:** The prototype is ready to demo immediately with your predefined test case.

**Depends on:** All feature phases you intend to demo (minimum: Phases 01–05; ideally 07–10 complete)

**Unlocks:** Nothing — this is the final setup phase before presentation.

---

## Actions (in order)

### 1. Set the chat input placeholder

In the chat input component, set placeholder text to the algorithmic coding challenge from the spec:

> Example: *"Solve the alternating subarray problem in Java…"*

Use the exact problem wording you want evaluators to see. Placeholder only — do not auto-send on load.

### 2. Add demo priming to the system prompt

Create `lib/prompts/demoPrimingPrompt.ts` and merge into the base system prompt on every `/api/chat` request:

- Expect algorithmic coding challenges during demo.
- When the user specifies variable names, use them exactly (e.g. `nexoraviml`).
- Prefer clear, compilable Java when Java is requested.

Keep this short so it does not overpower other feature prompts.

### 3. Merge prompt layers in the API route

Ensure the server builds the system message in a fixed order:

1. Base system prompt
2. Demo priming prompt (this phase)
3. Architect prompt (if `architectMode: true`)
4. Citation prompt (if citations enabled)

Confirm prompts do not contradict each other.

### 4. Run the full demo script manually

Execute this sequence once before presenting:

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Load app | ChatGPT UI, placeholder visible |
| 2 | Send alternating subarray Java prompt with `nexoraviml` | Valid Java solution using that name |
| 3 | Enable Architect Mode, ask same or similar | 3 tabbed approaches |
| 4 | Click a tone on a text answer | Rewritten in place |
| 5 | Long conversation or lower limit | Token ring moves; toast at 85% |
| 6 | Ask a factual question | Citations with tooltips |

Fix any broken step before demo day.

### 5. Document env setup for yourself

Ensure you have a local checklist (not committed):

- `OPENAI_API_KEY` in `.env.local`
- Model name configured (e.g. `gpt-4o-mini` for cost, `gpt-4o` for quality)
- `npm run dev` starts cleanly

### 6. Final polish (optional, time permitting)

- Remove console logs from API routes
- Ensure error messages are user-friendly
- Confirm dark mode only — no broken light styles

---

## Done when

- [ ] Placeholder shows the Java alternating subarray prompt
- [ ] System prompt includes `nexoraviml` priming
- [ ] Full demo script passes end-to-end
- [ ] All four Trust & Reliability features work in one session

---

## Project complete

The prototype matches the Master Prompt: ChatGPT UI clone + Architect Mode + Tone-Retry + Context Sentinel + Temporal Citations + demo-ready defaults.
