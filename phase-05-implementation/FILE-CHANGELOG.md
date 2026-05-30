# Phase 05 — File Change Log

---

## New files

| File | Description |
|------|-------------|
| `lib/api/streamChatClient.ts` | Client SSE parser + fetch wrapper |
| `components/chat/MarkdownMessage.tsx` | react-markdown assistant renderer |
| `components/chat/ChatErrorBanner.tsx` | API error display |

## Modified files

| File | Change |
|------|--------|
| `store/chatStore.ts` | Real API streaming; error state; `removeMessage` |
| `components/chat/MessageBubble.tsx` | Markdown assistant; streaming cursor |
| `components/chat/MessageList.tsx` | Auto-scroll; per-message streaming flag |
| `components/chat/ChatInput.tsx` | Updated footer label |
| `components/layout/ChatLayout.tsx` | Added `ChatErrorBanner` |
| `app/globals.css` | Markdown table/strong/hr styles |

## Deleted files

| File | Reason |
|------|--------|
| `components/chat/StreamingIndicator.tsx` | Replaced by in-bubble streaming cursor |

## Unchanged

- `app/api/chat/route.ts` — no backend changes required
