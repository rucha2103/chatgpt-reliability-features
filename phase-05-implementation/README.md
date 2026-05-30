# Phase 05 — Implementation Log

**Status:** Complete  
**Date:** 2026-05-30  
**App location:** `chatgpt-trust-prototype/`

---

## What was built

Phase 05 connects the UI to **live OpenAI streaming** via `POST /api/chat`. Placeholder replies are removed.

### 1. Stream client (`lib/api/streamChatClient.ts`)

- `fetch("/api/chat")` with `stream: true`
- Parses SSE `data: {...}` lines
- Callbacks: `onChunk`, `onDone`, `onError`
- Surfaces HTTP errors as thrown `Error` with server message

### 2. Updated Zustand store (`store/chatStore.ts`)

**`sendUserMessage` flow:**

1. Clear previous error
2. Append user message
3. Build API payload from full conversation (non-empty user/assistant only)
4. `isStreaming = true`
5. Append empty assistant message
6. Stream chunks → `updateMessage(assistantId, { content })`
7. On `done` event → `setTokenCount(tokenCount, tokenLimit)`, `isStreaming = false`
8. On failure → remove empty assistant bubble, set `error` message

**New state/actions:**

- `error: string | null`
- `clearError()`, `setError()`
- `removeMessage(id)`

**Removed:** placeholder timeout and `"This is a placeholder response."`

### 3. Markdown rendering (`components/chat/MarkdownMessage.tsx`)

- `react-markdown` + `remark-gfm`
- Headings, lists, links, tables, blockquotes
- Fenced code blocks with language header (syntax highlighting in Phase 07)
- Inline code with gray background

### 4. Error UI (`components/chat/ChatErrorBanner.tsx`)

- Red banner above message list
- Dismiss button
- Cleared on new send or new chat

### 5. Message UI updates

| Component | Change |
|-----------|--------|
| `MessageBubble` | Assistant uses `MarkdownMessage`; typing cursor when empty + streaming |
| `MessageList` | Auto-scroll to bottom; removed separate `StreamingIndicator` |
| `ChatInput` | Already disabled while streaming (Phase 03) |
| `ChatLayout` | Includes `ChatErrorBanner` |

### 6. `architectMode` in API body

Sent when toggle is on (ignored by backend until Phase 07).

---

## How to test

```bash
cd "/Users/ruchamainde/Documents/Graduation Project/chatgpt-trust-prototype"
npm run dev
```

Ensure `chatgpt-trust-prototype/.env.local` has a valid `GROQ_API_KEY`.

| Test | Expected |
|------|----------|
| Send a message | Text streams into assistant bubble word-by-word |
| Send follow-up | Prior messages included in context |
| Invalid/missing API key | Red error banner, no empty assistant bubble left |
| New chat | Clears messages and errors |
| Refresh page | Chat cleared (in-memory) |
| Ask for code | Markdown code block with language label |

---

## Verification checklist

- [x] Placeholder logic removed
- [x] Streaming via `/api/chat`
- [x] `tokenCount` updated from `done` event
- [x] `react-markdown` + `remark-gfm` for assistant messages
- [x] Input disabled while streaming
- [x] Error banner on API failure
- [x] `npm run build` passes

---

## Next phases

- **Phase 06** — Structured outputs (JSON parsing path)
- **Phase 07** — Architect Mode (3 tabbed solutions)
- **Phase 08** — Tone-Retry layer
- **Phase 09** — Context Sentinel (token ring uses `tokenCount` from store)
