# Phase 02 — ChatGPT UI Shell

**Goal:** A static, pixel-accurate ChatGPT dark-mode interface. No real AI responses yet — layout and visuals only.

**Depends on:** [Phase 01](./phase-01-foundation.md)

**Unlocks:** Phase 03

---

## Actions (in order)

### 1. Build the page layout skeleton

Create the two-column shell:

1. **Left sidebar** — full height, background `#171717`
2. **Main area** — background `#212121`, fills remaining width

On small screens, sidebar may collapse or overlay (optional for prototype).

### 2. Build the sidebar content

Add these elements top to bottom:

1. "New chat" button (lucide icon + label)
2. Conversation list area (static placeholder items for now)
3. Footer area (settings/profile placeholder)

Match ChatGPT spacing, font sizes, and hover states.

### 3. Build the main chat header

Add a top bar in the main area with:

1. Model name or title (static text, e.g. "ChatGPT")
2. **Empty placeholder** on the right for the Context Sentinel ring (Phase 09)

Do not implement the ring yet — leave a fixed-size slot so the header does not shift later.

### 4. Build the message area

1. **Empty state** — centered greeting when there are no messages (ChatGPT-style).
2. **Message row patterns** (use hardcoded mock messages to validate layout):
   - User message: right-aligned or distinct bubble
   - Assistant message: full-width, left-aligned, markdown-friendly container
3. Constrain content to ChatGPT max-width and center it.

### 5. Build the chat input area

Fixed to the bottom of the main area:

1. Auto-growing textarea
2. Send button (disabled when empty)
3. **Architect Mode toggle** — visible but not functional yet (wire in Phase 07)
4. Optional: attach/voice icons as visual placeholders

### 6. Reserve UI slots for Phase 3 features

Without implementing logic, mark where these will attach:

| Feature | Where to reserve space |
|---------|------------------------|
| Tone-Retry bar | Below each assistant message |
| Architect tabs | Inside assistant code-block area |
| Citation superscripts | Inside rendered assistant text |
| Context Sentinel ring | Header right slot (from step 3) |

Use invisible placeholders or comments in code so later phases have a clear mount point.

### 7. Visual QA pass

Compare against ChatGPT dark mode:

- [ ] Sidebar `#171717`, main `#212121`
- [ ] Typography and spacing feel native
- [ ] Icons from lucide-react
- [ ] Input, send button, and sidebar buttons look correct
- [ ] Layout works at desktop width (primary demo target)

---

## Done when

The app looks like ChatGPT in dark mode with mock/empty content. No Zustand, no API calls.

**Next:** [Phase 03 — Client State](./phase-03-client-state.md)
