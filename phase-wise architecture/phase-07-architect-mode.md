# Phase 07 — Architect Mode

**Goal:** When Architect Mode is ON, coding questions return 3 distinct solutions shown as tabs inside the response.

**Depends on:** [Phase 05](./phase-05-end-to-end-chat.md), [Phase 06](./phase-06-structured-outputs.md)

**Unlocks:** Phase 11 (full demo)

---

## Actions (in order)

### 1. Write the Architect system prompt (backend)

Create `lib/prompts/architectPrompt.ts`.

When `architectModeEnabled` is true, append to the system message:

- Require **exactly 3** distinct solutions.
- Each solution must have: label (e.g. "Performance", "Readability"), language, code, short explanation.
- Response must match the JSON schema used in Phase 06.

Example labels: `Approach A: Performance`, `Approach B: Readability`, `Approach C: …`

### 2. Branch the API route

In `app/api/chat/route.ts`:

1. If request includes `architectMode: true`:
   - Merge architect system prompt.
   - Set `responseMode: 'structured'`.
   - Use architect JSON schema.
2. Else: keep normal text streaming from Phase 05.

### 3. Update `sendMessage` in the store

When `architectModeEnabled` is true:

1. Send `architectMode: true` to the API.
2. Parse response with `parseArchitectResponse`.
3. Save to `message.architectSolutions`.
4. Set `message.responseType` to `'architect'`.

When OFF: unchanged text streaming behavior.

### 4. Build the tabbed code UI (frontend)

Create components for assistant messages where `responseType === 'architect'`:

1. **Tab header** — one tab per solution (`Approach A: …`, etc.).
2. **Tab panel** — shows code + optional explanation for active tab.
3. Use Framer Motion for tab switch animation (subtle fade/slide).

Install and wire syntax highlighting (e.g. `shiki` or `prism`) for code blocks.

### 5. Connect the input toggle

- Architect Mode toggle (reserved in Phase 02) must read/write `architectModeEnabled`.
- Visual indicator when mode is active (e.g. highlighted toggle).

### 6. Handle failures

If JSON parse fails or fewer than 3 solutions:

- Show raw assistant text or first solution only.
- Do not crash the message list.

### 7. Test

- [ ] Toggle ON → ask a Java coding question → 3 tabs appear
- [ ] Toggle OFF → same question → normal single markdown/code response
- [ ] Tab switching updates visible code

---

## Done when

Architect Mode works end-to-end: toggle → structured 3-solution response → tabbed UI.

**Next:** [Phase 11 — Demo & Testing](./phase-11-demo-testing.md) (after other features), or continue with Phase 08 / 09 / 10.
