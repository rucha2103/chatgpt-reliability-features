# Groq API Migration

The backend uses **Groq** (not OpenAI) via Groq's OpenAI-compatible endpoint.

## Environment variables

Update `chatgpt-trust-prototype/.env.local`:

```env
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Get a key: [https://console.groq.com/keys](https://console.groq.com/keys)

Remove any old `OPENAI_API_KEY` / `OPENAI_MODEL` lines — they are no longer used.

## After updating

```bash
cd chatgpt-trust-prototype
npm run dev
```

Restart is required so Next.js reloads env vars.

## Other Groq models (optional)

Set `GROQ_MODEL` to any model from [Groq docs](https://console.groq.com/docs/models), for example:

| Model | Use case |
|-------|----------|
| `llama-3.3-70b-versatile` | Default — strong general + coding |
| `llama-3.1-8b-instant` | Faster, lighter |
| `mixtral-8x7b-32768` | Long context |

## Technical note

The `openai` npm package remains installed — it talks to `https://api.groq.com/openai/v1` with your Groq API key. See `lib/groq.ts`.
