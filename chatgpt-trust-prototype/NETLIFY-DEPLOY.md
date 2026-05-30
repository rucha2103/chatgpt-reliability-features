# Deploy to Netlify

This project is a **Next.js** app. The “backend” is the App Router API routes:

- `POST /api/chat` — streaming + structured chat (Groq)
- `POST /api/citations/verify` — URL verification for citations
- `POST /api/tone-retry` — tone rewrite stream

Netlify runs the full app (UI + API) via the [Next.js runtime](https://docs.netlify.com/frameworks/next-js/overview/).

## 1. Connect the GitHub repo

1. Open [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project**.
2. Choose **GitHub** and select `rucha2103/chatgpt-reliability-features`.
3. Netlify should read settings from the repo root `netlify.toml`:
   - **Base directory:** `chatgpt-trust-prototype`
   - **Build command:** `npm ci && npm run build`
   - **Plugin:** `@netlify/plugin-nextjs`

If you configure manually instead of using `netlify.toml`, set **Base directory** to `chatgpt-trust-prototype` (required).

## 2. Environment variables

In **Site configuration → Environment variables**, add:

| Variable | Required | Example |
|----------|----------|---------|
| `GROQ_API_KEY` | Yes | `gsk_...` from [Groq console](https://console.groq.com/keys) |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` |

Apply to **Production** (and **Deploy previews** if you use PR previews).

Never commit real keys; use Netlify’s UI only.

## 3. Deploy

Click **Deploy site**. First build may take a few minutes.

Your live URL will look like `https://<site-name>.netlify.app`. Chat calls same-origin `/api/*` routes automatically.

## 4. Optional: CLI deploy

```bash
npm install -g netlify-cli
netlify login
cd chatgpt-trust-prototype
netlify init   # link to new or existing site
netlify env:set GROQ_API_KEY "gsk_your_key"
netlify deploy --build --prod
```

From repo root with linked site:

```bash
netlify deploy --build --prod --filter chatgpt-trust-prototype
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `eslint` | Run `npm run build` locally; fix reported errors. |
| `GROQ_API_KEY` errors in chat | Add env var in Netlify and **trigger redeploy**. |
| Citation verify timeouts | Netlify function time limits apply; heavy URL checks may need fewer sources or a paid plan. |
| 404 on `/api/chat` | Ensure `@netlify/plugin-nextjs` is enabled and base directory is `chatgpt-trust-prototype`. |

## Note on “backend only”

There is no separate Express server. Deploying this Next.js app on Netlify hosts both the ChatGPT-style UI and the Groq API routes together. That is the intended setup for this prototype.
