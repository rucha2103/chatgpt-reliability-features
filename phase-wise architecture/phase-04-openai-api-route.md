# Phase 04 — OpenAI API Route

**Goal:** A secure server-side route that accepts conversation messages and calls OpenAI. No frontend wiring yet.

**Depends on:** [Phase 01](./phase-01-foundation.md)

**Unlocks:** Phase 05, Phase 09 (token counting)

---

## Actions (in order)

### 1. Create the OpenAI client helper

- Add `lib/openai.ts` (or equivalent).
- Instantiate the OpenAI SDK using `process.env.OPENAI_API_KEY`.
- Export a single client used only from server code (API routes).

### 2. Create the chat API route

- Add `app/api/chat/route.ts`.
- Accept `POST` with JSON body: `{ messages: [{ role, content }] }`.
- Validate: reject if `messages` is missing or empty.
- Never expose the API key to the client.

### 3. Implement a basic non-streaming response first

Before streaming, get a simple path working:

1. Forward `messages` to OpenAI chat completions.
2. Return `{ content: string }` with the assistant reply.

Test with curl or Postman against `localhost:3000/api/chat`.

### 4. Add streaming

Replace non-streaming with streamed responses:

1. Use OpenAI streaming API.
2. Return a `ReadableStream` (or SSE) to the client.
3. Emit text chunks as they arrive.
4. Emit a final event when the stream completes.

Document the stream format your frontend will parse in Phase 05.

### 5. Add a base system prompt

- Create `lib/prompts/baseSystemPrompt.ts`.
- Prepend a system message to every request: helpful assistant, markdown-friendly answers.
- Feature-specific prompts (Architect, Citations, Demo) are added in later phases — do not add them yet.

### 6. Add token counting on the server

Before each OpenAI call:

1. Count tokens in the full `messages` array (including system prompt).
2. Use `tiktoken`, or fallback: `Math.ceil(totalCharacters / 4)`.
3. Include `tokenCount` and `tokenLimit` in the final stream event (or response metadata).

Frontend will consume this in Phase 05 and Phase 09.

### 7. Handle errors

Return clear HTTP status codes:

- `401` / `500` if API key missing
- `502` or `500` with message if OpenAI fails
- `400` for bad request body

---

## Done when

- [ ] `POST /api/chat` works from curl/Postman with a real OpenAI key
- [ ] Streaming returns incremental text
- [ ] Final event includes `tokenCount`
- [ ] API key never appears in client bundle or network tab request headers from browser to OpenAI directly

**Next:** [Phase 05 — End-to-End Chat](./phase-05-end-to-end-chat.md)
