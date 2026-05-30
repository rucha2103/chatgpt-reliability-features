# Phase 04 — File Change Log

---

## New files

| File | Description |
|------|-------------|
| `app/api/chat/route.ts` | POST handler — streaming + non-streaming OpenAI proxy |
| `lib/groq.ts` | Groq client (OpenAI-compatible SDK + base URL) |
| `lib/prompts/baseSystemPrompt.ts` | Default system prompt |
| `lib/chat/buildMessages.ts` | Prepends system prompt to conversation |
| `lib/tokens/countTokens.ts` | tiktoken with char-estimate fallback |
| `lib/api/chatProtocol.ts` | SSE event types + request/response shapes |

## Modified files

None (Phase 03 frontend unchanged by design).

## Unchanged

- `store/chatStore.ts` — still uses placeholder replies until Phase 05
- All UI components

---

## API route tree

```
POST /api/chat
├── parseRequestBody()
├── buildOpenAIMessages()
├── countConversationTokens()  → async, tiktoken or fallback
├── stream: true  → createStreamingResponse()  → SSE
└── stream: false → createNonStreamingResponse() → JSON
```

---

## Environment variables used

| Variable | Required | Default |
|----------|----------|---------|
| `GROQ_API_KEY` | Yes | — |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` |

File: `chatgpt-trust-prototype/.env.local`
