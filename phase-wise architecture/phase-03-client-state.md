# Phase 03 — Client State (Zustand)

**Goal:** Replace hardcoded UI data with a Zustand store that will later drive API calls and all four features.

**Depends on:** [Phase 02](./phase-02-ui-shell.md)

**Unlocks:** Phase 05

---

## Actions (in order)

### 1. Define the store shape

Create a Zustand store with at minimum:

**Conversation data**
- `messages` — array of `{ id, role, content, createdAt }`
- `activeConversationId` (optional for v1; can start with a single thread)

**UI flags**
- `architectModeEnabled` — boolean, tied to input toggle
- `isStreaming` — boolean, true while waiting for / receiving response
- `sidebarOpen` — boolean (if collapsible)

**Context Sentinel placeholders** (values filled in Phase 09)
- `tokenCount` — number, default `0`
- `tokenLimit` — number, from constants (Phase 01)
- `sentinelWarned` — boolean, default `false`

**Feature placeholders** (extended in later phases)
- Per-message: `tone`, `architectSolutions`, `citations` — add fields when those phases start

### 2. Implement core actions

Implement these actions in order:

1. `addMessage(role, content)` — append to `messages`
2. `updateMessage(id, partial)` — patch a message (needed for streaming + tone retry)
3. `clearMessages()` / `newConversation()` — reset thread
4. `toggleArchitectMode()` — flip the toggle
5. `setStreaming(boolean)`
6. `setTokenCount(number)` — stub for now

Do not call OpenAI from the store yet.

### 3. Wire the UI to the store

Connect components in this order:

1. **Message list** — render from `store.messages` instead of mock data
2. **Chat input** — on send, call `addMessage('user', text)` and clear input
3. **Architect Mode toggle** — read/write `architectModeEnabled`
4. **New chat button** — call `newConversation()`
5. **Streaming indicator** — show when `isStreaming` is true (manual toggle for testing)

### 4. Simulate assistant replies locally (temporary)

Until Phase 05 connects the API:

- On user send, after a short timeout, append a fake assistant message: `"This is a placeholder response."`
- Set `isStreaming` true during the delay, then false

This validates the message loop before backend work.

### 5. Verify state persistence scope

For the prototype, **in-memory only** is fine (refresh clears chat). Do not add localStorage unless you explicitly want it later.

---

## Done when

- [ ] Sending a message adds user + placeholder assistant entries
- [ ] Architect Mode toggle updates store and UI
- [ ] New chat clears messages
- [ ] `tokenCount` / `tokenLimit` exist in store (still `0` / static limit)
- [ ] All Phase 02 UI reads from Zustand, not hardcoded arrays

**Next:** [Phase 04 — OpenAI API Route](./phase-04-openai-api-route.md) (can start in parallel after Phase 01)  
**Then:** [Phase 05 — End-to-End Chat](./phase-05-end-to-end-chat.md)
