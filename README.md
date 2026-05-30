# ChatGPT Reliability Features

Graduation project: a ChatGPT-style UI with trust and reliability extensions (Architect Mode, Temporal Citations, Tone-Retry, Context Sentinel, and more).

## Project layout

| Path | Description |
|------|-------------|
| `chatgpt-trust-prototype/` | Next.js app — run this for the live prototype |
| `phase-wise architecture/` | Phase-by-phase architecture specs |
| `phase-*-implementation/` | Implementation notes per phase |

## Quick start

```bash
cd chatgpt-trust-prototype
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

See `chatgpt-trust-prototype/GROQ-SETUP.md` for API key setup.
