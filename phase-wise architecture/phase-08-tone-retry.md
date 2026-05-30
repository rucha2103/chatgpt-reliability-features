# Phase 08 — Tone-Retry Layer

**Goal:** User can click a tone icon under an assistant message to rewrite that message in place without adding new information.

**Depends on:** [Phase 05](./phase-05-end-to-end-chat.md)

**Unlocks:** Phase 11

---

## Actions (in order)

### 1. Create the tone-retry API route

Add `app/api/tone-retry/route.ts`.

**Request body:**

```json
{
  "originalText": "full assistant message text",
  "tone": "polite" | "professional" | "friendly" | "concise"
}
```

**Server behavior:**

1. Build a single user message for OpenAI with the fixed instruction:

   > Rewrite the following text to strictly adhere to a [Selected Tone] style. Do not add new information.

2. Append `originalText` below the instruction.
3. Call OpenAI (streaming preferred).
4. Return streamed text back to the client.

No conversation history needed — only the one message being rewritten.

### 2. Build the Tone Style Bar UI

Below each **assistant** message (use slot from Phase 02):

1. Four clickable controls with lucide icons + labels:
   - Polite
   - Professional
   - Friendly
   - Concise
2. Show only on assistant messages (not user messages).
3. Disable all four while a rewrite is in progress.

### 3. Add `retryTone` action to Zustand

Implement:

1. Input: `messageId`, `tone`.
2. Find message content by id.
3. Set loading state on that message (or global `isStreaming`).
4. `POST` to `/api/tone-retry`.
5. Stream response into the **same** message id via `updateMessage` (replace `content`).
6. Store `tone` on the message for optional UI highlight.
7. Clear loading state.

### 4. Preserve or strip extended fields

For v1:

- **Strip** `architectSolutions` and `citations` on tone retry (message becomes plain rewritten text).
- Document this behavior so demo expectations are clear.

### 5. Wire the style bar to `retryTone`

Each tone button calls `retryTone(messageId, tone)`.

### 6. Test

- [ ] Click "Professional" → text rewrites, same message bubble
- [ ] Click another tone → rewrites again
- [ ] No new messages added to the thread
- [ ] Buttons disabled during stream
- [ ] API error shows feedback without breaking the thread

---

## Done when

Any assistant reply can be re-toned in place via the four style buttons.

**Next:** [Phase 11 — Demo & Testing](./phase-11-demo-testing.md) or continue Phase 09 / 10.
