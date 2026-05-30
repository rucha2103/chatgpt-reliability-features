# Phase 05 — End-to-End Chat

**Goal:** Replace placeholder assistant replies with live OpenAI streaming through your API route.

**Depends on:** [Phase 03](./phase-03-client-state.md), [Phase 04](./phase-04-openai-api-route.md)

**Unlocks:** Phase 06, Phase 08, Phase 09

---

## Actions (in order)

### 1. Remove the placeholder assistant logic

- Delete the fake timeout / `"This is a placeholder response"` from Phase 03.
- User send should now trigger a real API call.

### 2. Add a `sendMessage` action to the store

Implement the full send flow:

1. Append user message to `messages`.
2. Set `isStreaming` to `true`.
3. Append an empty assistant message (same `id` for updates).
4. `POST` to `/api/chat` with the full conversation history `{ role, content }[]`.
5. Pass `architectModeEnabled` in the body only if the toggle is on (backend ignores extra fields until Phase 07).

### 3. Consume the stream on the client

As chunks arrive:

1. Append text to the assistant message via `updateMessage(id, { content })`.
2. On stream end, set `isStreaming` to `false`.
3. Read `tokenCount` from the final event and call `setTokenCount`.

### 4. Render assistant markdown

- Use `react-markdown` + `remark-gfm` for assistant messages.
- Code blocks should render with monospace styling (syntax highlighting comes in Phase 07).
- User messages stay plain text.

### 5. Disable input while streaming

- Disable textarea and send button when `isStreaming` is true.
- Prevent duplicate sends.

### 6. Show errors in the UI

If the API fails:

1. Remove or mark the empty assistant bubble.
2. Show an inline error or toast with a short message.
3. Set `isStreaming` to `false`.

### 7. End-to-end test

Manual test checklist:

- [ ] Type a question → streamed reply appears word by word
- [ ] Multi-turn: second message includes prior context
- [ ] `tokenCount` in store increases after each turn
- [ ] Refresh clears chat (expected for prototype)

---

## Done when

The prototype behaves like basic ChatGPT: type, send, stream, continue the conversation. No feature extensions yet.

**Next (pick any order after Phase 06 for feature phases):**

- [Phase 06 — Structured Outputs](./phase-06-structured-outputs.md) — required before Architect Mode and Citations
- [Phase 08 — Tone-Retry](./phase-08-tone-retry.md) — can start now
- [Phase 09 — Context Sentinel](./phase-09-context-sentinel.md) — can start now
