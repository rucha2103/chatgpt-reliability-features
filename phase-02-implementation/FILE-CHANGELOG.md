# Phase 02 — File Change Log

---

## New files

| File | Description |
|------|-------------|
| `components/ChatShell.tsx` | Client entry — mock data + layout |
| `components/layout/ChatLayout.tsx` | Two-column shell |
| `components/layout/Sidebar.tsx` | Left nav, chats, footer |
| `components/layout/Header.tsx` | Model bar + sentinel placeholder |
| `components/chat/MessageList.tsx` | Scrollable message container |
| `components/chat/MessageBubble.tsx` | User + assistant row layouts |
| `components/chat/EmptyState.tsx` | Greeting when no messages |
| `components/chat/ChatInput.tsx` | Textarea, send, architect toggle |
| `components/chat/FeaturePlaceholders.tsx` | Phase 07/08/10 mount markers |
| `lib/mockMessages.ts` | Static mock data + layout toggle |

## Modified files

| File | Change |
|------|--------|
| `app/page.tsx` | Renders `ChatShell` instead of Phase 01 placeholder |
| `app/globals.css` | Custom scrollbar styling for message list |

## Unchanged from Phase 01

- `lib/constants.ts`
- `app/layout.tsx`
- `.env.local` / dependencies

---

## Component tree

```
page.tsx
└── ChatShell
    └── ChatLayout
        ├── Sidebar
        ├── Header (+ sentinel placeholder)
        ├── MessageList
        │   ├── EmptyState (when no messages)
        │   └── MessageBubble × N
        │       ├── CitationPlaceholder (Phase 10)
        │       ├── ArchitectTabsPlaceholder (Phase 07)
        │       ├── MockCodeBlock
        │       └── ToneRetryPlaceholder (Phase 08)
        └── ChatInput (+ architect toggle)
```
