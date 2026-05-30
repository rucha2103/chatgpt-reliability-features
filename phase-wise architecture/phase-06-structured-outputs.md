# Phase 06 — Structured Outputs

**Goal:** Backend can return JSON the frontend can parse reliably. Required before Architect Mode and Temporal Citations.

**Depends on:** [Phase 05](./phase-05-end-to-end-chat.md)

**Unlocks:** Phase 07, Phase 10

---

## Actions (in order)

### 1. Choose the structured output mechanism

Use **one** of these (recommended: OpenAI Structured Outputs / JSON schema):

- `response_format: { type: "json_schema", ... }` with a defined schema, or
- Function calling that returns a structured payload, or
- JSON mode with strict system instructions

Pick the approach that works with your chosen model. Document the choice in code comments.

### 2. Add a response-mode flag to the API

Extend `POST /api/chat` body:

```json
{
  "messages": [...],
  "responseMode": "text" | "structured"
}
```

- `"text"` — normal streaming markdown (default, current Phase 05 behavior).
- `"structured"` — return JSON matching a schema (used when Architect Mode or Citations need parsing).

Decide per request whether to stream:

- **Text mode:** stream (keep current behavior).
- **Structured mode:** may be non-streaming JSON for simpler parsing (acceptable for prototype).

### 3. Create parser utilities on the client

Add small parsers (no UI yet):

1. `parseArchitectResponse(json)` → `{ solutions: [...] }` or error
2. `parseCitationResponse(json)` → `{ answer: string, citations: [...] }` or error

Each parser should fail gracefully and fall back to showing raw text if JSON is invalid.

### 4. Extend the message model in Zustand

Add optional fields to assistant messages:

- `architectSolutions?: Array<{ id, label, language, code, explanation }>`
- `citations?: Array<{ id, fact, source, lastUpdated }>`
- `responseType?: 'text' | 'architect' | 'citations'`

### 5. Wire structured path in `sendMessage` (logic only)

When `architectModeEnabled` is true (Phase 07 will use this) or when citation mode is requested (Phase 10):

1. Set `responseMode: 'structured'` on the API call.
2. On response, run the appropriate parser.
3. Store parsed data on the message object instead of raw JSON string in `content`.

For this phase, test with a **manual flag** or temporary button — full UI comes in Phases 07 and 10.

### 6. Verify with a test schema

Create a minimal test schema (e.g. `{ "greeting": "string" }`), call the API, confirm the client parses it.

---

## Done when

- [ ] API supports `responseMode: text | structured`
- [ ] Structured responses parse into typed objects
- [ ] Parse failures fall back to readable raw text
- [ ] Message model supports `architectSolutions` and `citations` fields

**Next:**

- [Phase 07 — Architect Mode](./phase-07-architect-mode.md)
- [Phase 10 — Temporal Citations](./phase-10-temporal-citations.md)
