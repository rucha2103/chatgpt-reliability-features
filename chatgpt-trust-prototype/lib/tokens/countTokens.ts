import { TOKEN_LIMIT } from "@/lib/constants";

export interface TokenCountableMessage {
  role: string;
  content: string;
}

/** Approximate per-message overhead for chat completions token counting */
const MESSAGE_OVERHEAD_TOKENS = 4;

function countWithCharEstimate(messages: TokenCountableMessage[]): number {
  const chars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(chars / 4);
}

async function countWithTiktoken(
  messages: TokenCountableMessage[],
): Promise<number> {
  const { get_encoding } = await import("tiktoken");
  const enc = get_encoding("cl100k_base");

  let total = 0;
  for (const message of messages) {
    total += enc.encode(message.content).length + MESSAGE_OVERHEAD_TOKENS;
  }
  enc.free();
  return total;
}

/**
 * Count tokens in the conversation (including system prompt).
 * Uses tiktoken when available; falls back to chars / 4 in dev/Turbopack.
 */
export async function countConversationTokens(
  messages: TokenCountableMessage[],
): Promise<number> {
  try {
    return await countWithTiktoken(messages);
  } catch {
    return countWithCharEstimate(messages);
  }
}

export function getTokenLimit(): number {
  return TOKEN_LIMIT;
}
