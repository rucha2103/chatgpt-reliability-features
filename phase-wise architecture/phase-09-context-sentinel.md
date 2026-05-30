# Phase 09 — Context Sentinel

**Goal:** Header shows conversation token usage; at 85% of the limit, show a ChatGPT-style warning toast.

**Depends on:** [Phase 05](./phase-05-end-to-end-chat.md) (token count already returned from API in Phase 04)

**Unlocks:** Phase 11

---

## Actions (in order)

### 1. Confirm token count reaches the store

Verify after every chat turn (from Phase 05):

- `setTokenCount` is called with the server value.
- `tokenLimit` is set from constants (Phase 01).

If not wired yet, fix that before building UI.

### 2. Build the circular progress indicator

In the header slot reserved in Phase 02:

1. Compute `percent = tokenCount / tokenLimit`.
2. Render a circular progress ring (SVG or CSS).
3. Optional: color shifts as usage grows (green → amber → red).

Use lucide or custom SVG; keep it compact to match ChatGPT header scale.

### 3. Build the warning toast component

Create a toast that mimics ChatGPT native warnings:

1. Dark background, subtle border, short copy.
2. Example: "You're approaching the context limit. Start a new chat to avoid truncated responses."
3. Animate in/out with Framer Motion.
4. Dismiss on click or auto-dismiss after a few seconds.

### 4. Implement the 85% trigger logic

In the store or a small hook subscribed to `tokenCount`:

```
if (tokenCount / tokenLimit >= 0.85 && !sentinelWarned) {
  show toast
  set sentinelWarned = true
}
```

Use threshold `0.85` from constants.

### 5. Reset warning state appropriately

When user starts a **new chat**:

1. Reset `tokenCount` to `0` (or recalculate empty thread).
2. Reset `sentinelWarned` to `false`.

Do not spam the toast on every message after 85% — once per "warning episode" until new chat.

### 6. Optional: show numeric label

Tooltip or small text on hover: `42,000 / 128,000 tokens` (helps demo/debug).

### 7. Test

- [ ] Ring updates after each message
- [ ] Manually lower `tokenLimit` in dev to force 85% quickly → toast appears once
- [ ] New chat resets ring and allows toast again on next 85% crossing

---

## Done when

Token usage is visible in the header and the 85% toast fires correctly without repeated spam.

**Next:** [Phase 11 — Demo & Testing](./phase-11-demo-testing.md) or [Phase 10 — Temporal Citations](./phase-10-temporal-citations.md)
