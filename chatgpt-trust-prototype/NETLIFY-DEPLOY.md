# Deploy to Netlify (frontend + backend)

This repo is one **Next.js** application. A single Netlify deploy serves:

| URL | What it is |
|-----|------------|
| `https://<your-site>.netlify.app/` | **Frontend** — ChatGPT-style UI |
| `https://<your-site>.netlify.app/api/chat` | **Backend** — Groq chat API |
| `https://<your-site>.netlify.app/api/citations/verify` | Citation URL checks |
| `https://<your-site>.netlify.app/api/tone-retry` | Tone rewrite stream |

You do **not** need a second Netlify site for the frontend. The root `netlify.toml` already deploys both.

---

## Recommended: one Netlify site (frontend + API)

### 1. Import from GitHub

1. [app.netlify.com](https://app.netlify.com/) → **Add new site** → **Import an existing project**
2. Repo: **`rucha2103/chatgpt-reliability-features`**
3. Confirm settings from `netlify.toml`:
   - **Base directory:** `chatgpt-trust-prototype`
   - **Build command:** `npm ci && npm run build`
   - **Plugin:** `@netlify/plugin-nextjs`

### 2. Environment variables

**Site configuration → Environment variables:**

| Variable | Required | Notes |
|----------|----------|--------|
| `GROQ_API_KEY` | Yes | From [Groq console](https://console.groq.com/keys) |
| `GROQ_MODEL` | No | Default `llama-3.3-70b-versatile` |

Do **not** set `NEXT_PUBLIC_API_BASE_URL` for this setup (same-origin `/api` is used).

### 3. Deploy and verify

1. **Deploy site** and wait for a green build.
2. Open **`https://<your-site>.netlify.app/`** — you should see the chat UI (sidebar, input, empty state).
3. Send a test message — it should stream a reply (calls `/api/chat` on the same host).

If step 2 works but step 3 fails, check `GROQ_API_KEY` and redeploy.

---

## Optional: two Netlify sites (advanced)

Only use this if you intentionally want different URLs for UI vs API (e.g. `my-app.netlify.app` and `my-api.netlify.app`).

| Site | Deploy | Env vars |
|------|--------|----------|
| **API site** | Same repo, base `chatgpt-trust-prototype` | `GROQ_API_KEY`, `GROQ_MODEL`, `FRONTEND_ORIGIN=https://your-frontend.netlify.app` |
| **Frontend site** | Same repo, base `chatgpt-trust-prototype` | `NEXT_PUBLIC_API_BASE_URL=https://your-api.netlify.app`, `GROQ_API_KEY` (structured routes still run server-side on whichever site receives `/api` calls) |

For most graduation demos, **one site is simpler** and avoids CORS issues.

---

## CLI deploy

```bash
npm install -g netlify-cli
netlify login
cd "/path/to/Graduation Project"
netlify init
netlify env:set GROQ_API_KEY "gsk_your_key"
netlify deploy --build --prod
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page at `/` | Wrong base directory — must be `chatgpt-trust-prototype`. |
| UI loads, chat errors | Add `GROQ_API_KEY`, redeploy. |
| 404 on `/api/chat` | Enable `@netlify/plugin-nextjs`; redeploy from latest `main`. |
| Only see JSON at `/` | You may be hitting an API path — open `/` without `/api`. |
| Build fails | Run `npm run build` locally in `chatgpt-trust-prototype`. |

---

## Local vs production

| | Local | Netlify |
|---|--------|---------|
| Frontend | http://localhost:3000 | `https://<site>.netlify.app` |
| API | http://localhost:3000/api/... | `https://<site>.netlify.app/api/...` |

Same app, same paths — no extra frontend build step.
