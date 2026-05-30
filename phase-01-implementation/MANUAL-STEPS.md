# Phase 01 — Manual Steps (Your Action Required)

These steps could not be completed automatically in the build environment. Follow them in order on your Mac.

---

## Step 1: Install Node.js (if you don't have it)

The project needs **Node.js 18+** with **npm**.

1. Open Terminal.
2. Run:
   ```bash
   node -v
   npm -v
   ```
3. If either command fails, install Node.js:
   - **Recommended:** Download the LTS installer from [https://nodejs.org](https://nodejs.org)
   - Or with Homebrew: `brew install node`
4. After installing, close and reopen Terminal, then confirm:
   ```bash
   node -v   # should show v18.x or higher
   npm -v    # should show 9.x or higher
   ```

---

## Step 2: Install project dependencies

1. Open Terminal.
2. Navigate to the app folder:
   ```bash
   cd "/Users/ruchamainde/Documents/Graduation Project/chatgpt-trust-prototype"
   ```
3. Install packages:
   ```bash
   npm install
   ```
4. Wait until it finishes with no errors.

---

## Step 3: Create your `.env.local` file (API key)

Your OpenAI API key must stay on your machine only — it is never committed to git.

1. In Finder or Terminal, go to:
   ```
   /Users/ruchamainde/Documents/Graduation Project/chatgpt-trust-prototype/
   ```
2. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` in a text editor.
4. Replace the placeholder with your real key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
5. Save the file.

**Where to get an API key:**
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign in → **Create new secret key**
3. Copy the key immediately (you won't see it again)

> **Note:** The API key is not needed until Phase 04, but setting it up now avoids a gap later.

---

## Step 4: Start the dev server

1. In the same Terminal (inside `chatgpt-trust-prototype`):
   ```bash
   npm run dev
   ```
2. Open your browser to: **http://localhost:3000**
3. You should see:
   - Dark background (`#212121`)
   - Title: "ChatGPT Trust & Reliability Prototype"
   - Subtitle: "Phase 01 complete — UI shell starts in Phase 02."

4. Press `Ctrl + C` in Terminal to stop the server when done.

---

## Step 5: Confirm everything works

Run through this checklist:

| Check | How to verify |
|-------|---------------|
| Dependencies installed | `node_modules/` folder exists |
| Dev server runs | `npm run dev` — no errors |
| Dark mode | Page background is dark gray, not white |
| Env file secure | `.env.local` exists; `git status` does NOT list it |
| API key set | `.env.local` has `GROQ_API_KEY=gsk-...` (not `your_groq_api_key_here`) |

---

## When you're done

Reply in chat with:

1. **"Phase 1 manual steps done"** — and I'll start Phase 02.
2. Or paste any error message if something failed — I'll help fix it.

**Optional:** If you don't have an OpenAI API key yet, you can still confirm Steps 1, 2, and 4 work. Tell me when you have the key ready before Phase 04.
