# Phase 10 — Temporal Citations

**Goal:** Research-style answers show numbered citation buttons with source tooltips; stale sources (>1 year) appear yellow.

**Depends on:** [Phase 05](./phase-05-end-to-end-chat.md), [Phase 06](./phase-06-structured-outputs.md)

**Unlocks:** Phase 11

---

## Actions (in order)

### 1. Write the citation system prompt (backend)

Create `lib/prompts/citationPrompt.ts`.

Append to system message when citation mode is active (can be always-on for assistant factual answers):

- For factual claims, attach synthetic citation metadata.
- Required shape per citation:

```json
{
  "fact": "...",
  "source": "...",
  "last_updated": "YYYY-MM-DD"
}
```

- Answer text should include markers `[1]`, `[2]` aligned with citation ids.

Define a JSON schema (Phase 06) for:

```json
{
  "answer": "markdown string with [1] markers",
  "citations": [ { "id": 1, "fact": "...", "source": "...", "last_updated": "YYYY-MM-DD" } ]
}
```

### 2. Branch the API route for citations

In `app/api/chat/route.ts`:

1. When citations are enabled (default ON for prototype, or flag `citationsMode: true`):
   - Merge citation system prompt.
   - Use structured response + citation schema.
2. When Architect Mode is also ON, define precedence:
   - **Recommended:** Architect Mode takes priority; citations apply to non-architect text responses only.

Document this rule in the route.

### 3. Parse and store citations on the client

In `sendMessage`:

1. Parse with `parseCitationResponse`.
2. Set `message.content` to `answer` (markdown with `[1]` markers).
3. Set `message.citations` to the array.
4. Set `message.responseType` to `'citations'` (or `'text'` with citations attached).

### 4. Build citation superscript buttons

Custom markdown renderer or post-process step:

1. Replace `[1]`, `[2]`, … with clickable superscript buttons.
2. Small, inline, ChatGPT-like styling.

### 5. Build the hover tooltip

On hover (or focus for accessibility):

1. Show: `Source: [source name]`
2. Show: `Last Updated: [YYYY-MM-DD]`
3. Use Framer Motion or CSS for tooltip fade.

### 6. Apply stale-date styling

Parse `last_updated` as a date.

```
if (today - last_updated > 1 year) → yellow/warning color on tooltip or superscript
else → default muted styling
```

Use a clear yellow (e.g. Tailwind `text-yellow-400`) per spec.

### 7. Test

- [ ] Ask a factual question → `[1]` buttons appear in text
- [ ] Hover shows source + date
- [ ] Citation with date > 1 year ago shows yellow warning styling
- [ ] Parse failure still shows readable answer text

---

## Done when

Citations render as superscripts with tooltips and correct stale-date highlighting.

**Next:** [Phase 11 — Demo & Testing Defaults](./phase-11-demo-testing.md)
