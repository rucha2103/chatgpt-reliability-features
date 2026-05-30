# Phase 03 — File Change Log

---

## New files

| File | Description |
|------|-------------|
| `types/chat.ts` | ChatMessage and future feature types |
| `store/chatStore.ts` | Zustand store + actions + placeholder send flow |
| `components/chat/StreamingIndicator.tsx` | Typing indicator while `isStreaming` |

## Modified files

| File | Change |
|------|--------|
| `components/ChatShell.tsx` | Removed mock message props |
| `components/layout/ChatLayout.tsx` | No props; children read store directly |
| `components/layout/Sidebar.tsx` | `newConversation`, `toggleSidebar`, collapsed state |
| `components/chat/MessageList.tsx` | Subscribes to `messages`, `isStreaming` |
| `components/chat/MessageBubble.tsx` | Uses `ChatMessage`; parses fenced code blocks |
| `components/chat/ChatInput.tsx` | Send, Enter key, store-driven architect toggle |

## Deleted files

| File | Reason |
|------|--------|
| `lib/mockMessages.ts` | Replaced by Zustand store |

## Unchanged

- `app/page.tsx`, `app/layout.tsx`, `lib/constants.ts`
- Phase 02 layout/visual structure preserved
