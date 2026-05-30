import OpenAI from "openai";

/** Groq exposes an OpenAI-compatible Chat Completions API */
export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const PLACEHOLDER_KEY = "your_groq_api_key_here";

let client: OpenAI | null = null;

export function getApiKeyErrorMessage(): string | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return "GROQ_API_KEY is missing. Add it to chatgpt-trust-prototype/.env.local and restart npm run dev.";
  }

  if (apiKey === PLACEHOLDER_KEY) {
    return "GROQ_API_KEY is still the placeholder. Replace your_groq_api_key_here with your real key in chatgpt-trust-prototype/.env.local, then restart npm run dev.";
  }

  return null;
}

export function getGroqClient(): OpenAI {
  const configError = getApiKeyErrorMessage();
  if (configError) {
    throw new Error(configError);
  }

  const apiKey = process.env.GROQ_API_KEY!.trim();

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: GROQ_BASE_URL,
    });
  }

  return client;
}

export function getGroqModel(): string {
  return process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
}
