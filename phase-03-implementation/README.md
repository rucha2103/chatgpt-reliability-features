# Phase 03 — Implementation Log

**Status:** Complete  
**Date:** 2026-05-30  
**App location:** `chatgpt-trust-prototype/`

---

## What was built

Phase 03 replaces mock/hardcoded data with a **Zustand store** and a working local message loop (placeholder assistant replies until Phase 05).

### 1. Types (`types/chat.ts`)

- `ChatMessage` — `id`, `role`, `content`, `createdAt`
- Optional fields for later phases: `tone`, `architectSolutions`, `citations`
- `ArchitectSolution`, `Citation`, `Tone` types defined for future use

### 2. Zustand store (`store/chatStore.ts`)

**State**

| Field | Default | Purpose |
|-------|---------|---------|
| `messages` | `[]` | Conversation thread |
| `activeConversationId` | `null` | Set on first message |
| `architectModeEnabled` | `false` | Architect Mode toggle |
| `isStreaming` | `false` | Loading / typing state |
| `sidebarOpen` | `true` | Sidebar visibility |
| `tokenCount` | `0` | Context Sentinel (Phase 09) |
| `tokenLimit` | `128000` | From constants |
| `sentinelWarned` | `false` | Toast guard (Phase 09) |

**Actions**

- `addMessage(role, content)` — append message, return id
- `updateMessage(id, partial)` — patch message (streaming / tone retry in later phases)
- `newConversation()` — clear messages, reset tokens & sentinel flag
- `toggleArchitectMode()` — flip toggle
- `setStreaming(boolean)`
- `setTokenCount(number)` — resets `sentinelWarned` when below 85%
- `toggleSidebar()` — collapse/expand sidebar
- `sendUserMessage(content)` — add user message → delay → placeholder assistant reply

### 3. UI wired to store

| Component | Store usage |
|-----------|-------------|
| `MessageList` | `messages`, `isStreaming` |
| `ChatInput` | `sendUserMessage`, `architectModeEnabled`, `toggleArchitectMode`, `isStreaming` |
| `Sidebar` | `newConversation`, `sidebarOpen`, `toggleSidebar` |
| `StreamingIndicator` | Shown when `isStreaming` is true |

### 4. Placeholder assistant flow

On send:

1. User message added immediately
2. `isStreaming` → `true` → "ChatGPT is thinking…" indicator
3. After 800ms → assistant message: `"This is a placeholder response."`
4. `isStreaming` → `false`

Replaced by real OpenAI streaming in **Phase 05**.

### 5. Persistence

**In-memory only** — refreshing the page clears the chat (by design).

### 6. Removed

- `lib/mockMessages.ts` — replaced by store + types

---

## How to test

```bash
cd "/Users/ruchamainde/Documents/Graduation Project/chatgpt-trust-prototype"
npm run dev
```

1. Open http://localhost:3000 — empty state greeting
2. Type a message → Enter or Send
3. See user bubble → thinking indicator → placeholder assistant reply
4. Toggle **Architect Mode** — highlight persists
5. Click **New chat** — messages cleared
6. Collapse sidebar — narrow rail with expand + new chat icons

---

## Verification checklist

- [x] Sending a message adds user + placeholder assistant entries
- [x] Architect Mode toggle updates store and UI
- [x] New chat clears messages
- [x] `tokenCount` / `tokenLimit` exist in store
- [x] All message UI reads from Zustand
- [x] `npm run build` passes

---

## Next phase

**Phase 04 — OpenAI API Route** (`app/api/chat/route.ts`)  
**Phase 05 — End-to-End Chat** (replace `sendUserMessage` placeholder with real API)

Documentation: `phase-04-implementation/` (when built).
