# Phase 04 — Implementation Log

**Status:** Complete  
**Date:** 2026-05-30  
**App location:** `chatgpt-trust-prototype/`

---

## What was built

Phase 04 adds a **secure server-side Groq proxy** at `POST /api/chat`. Uses Groq's OpenAI-compatible API via `lib/groq.ts`.

### 1. Groq client (`lib/groq.ts`)

- Singleton client using `process.env.GROQ_API_KEY`
- Base URL: `https://api.groq.com/openai/v1`
- `getGroqModel()` reads `GROQ_MODEL` (default `llama-3.3-70b-versatile`)

### 2. Base system prompt (`lib/prompts/baseSystemPrompt.ts`)

Prepended to every request. Feature prompts (Architect, Citations, Demo) added in later phases.

### 3. Message builder (`lib/chat/buildMessages.ts`)

Combines system prompt + user/assistant conversation for Groq.

### 4. Token counting (`lib/tokens/countTokens.ts`)

- Tries `tiktoken` via dynamic import (avoids Turbopack dev crash)
- Falls back to `Math.ceil(characters / 4)` if WASM unavailable
- Returns input token count **before** the Groq call

### 5. Stream protocol (`lib/api/chatProtocol.ts`)

Documented SSE format for Phase 05:

**Chunk event**
```json
{ "type": "chunk", "content": "partial text" }
```

**Done event**
```json
{ "type": "done", "tokenCount": 842, "tokenLimit": 128000 }
```

**Error event (mid-stream)**
```json
{ "type": "error", "message": "..." }
```

Each line is prefixed with `data: ` per SSE spec.

### 6. API route (`app/api/chat/route.ts`)

**Request**
```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "stream": true,
  "architectMode": false
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `messages` | Yes | Non-empty array of `{ role: "user"\|"assistant", content: string }` |
| `stream` | No | Default `true`. Set `false` for JSON response (curl testing) |
| `architectMode` | No | Accepted, ignored until Phase 07 |

**Responses**

| Mode | Content-Type | Body |
|------|--------------|------|
| Streaming (default) | `text/event-stream` | SSE chunk + done events |
| Non-streaming | `application/json` | `{ content, tokenCount, tokenLimit }` |

**Error codes**

| Status | When |
|--------|------|
| `400` | Invalid/missing JSON or empty messages |
| `401` | Missing/invalid API key |
| `502` | OpenAI request failed |

---

## Manual test commands

Start the dev server:

```bash
cd "/Users/ruchamainde/Documents/Graduation Project/chatgpt-trust-prototype"
npm run dev
```

### Non-streaming (easiest to verify)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Say hello in exactly three words."}],
    "stream": false
  }'
```

Expected:
```json
{"content":"Hello there friend.","tokenCount":45,"tokenLimit":128000}
```

### Streaming (default)

```bash
curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Count from 1 to 3."}]
  }'
```

Expected output (multiple lines):
```
data: {"type":"chunk","content":"1"}
data: {"type":"chunk","content":", 2"}
...
data: {"type":"done","tokenCount":52,"tokenLimit":128000}
```

### Validation error (400)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[]}'
```

---

## Security notes

- API key is read only from server `.env.local`
- Browser never calls OpenAI directly
- Key is not included in client bundle

---

## Verification checklist

- [x] `POST /api/chat` route exists
- [x] Streaming SSE with chunk + done events
- [x] Non-streaming JSON mode for testing
- [x] `tokenCount` + `tokenLimit` in done event / JSON response
- [x] Base system prompt prepended
- [x] Error handling (400, 401, 502)
- [x] `npm run build` passes
- [ ] Live OpenAI call verified on your machine (requires valid key in `.env.local`)

---

## Next phase

**Phase 05 — End-to-End Chat**  
Replace `sendUserMessage` placeholder in Zustand with streaming fetch to `/api/chat`.

Documentation: `phase-05-implementation/`
