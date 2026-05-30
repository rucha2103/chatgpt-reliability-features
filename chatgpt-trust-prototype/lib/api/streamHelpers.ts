import type { Tone } from "@/types/chat";
import type { StreamEvent } from "@/lib/api/chatProtocol";

export interface StreamCallbacks {
  onChunk: (content: string) => void;
  onDone: () => void | Promise<void>;
  onError: (message: string) => void;
}

function parseSseLines(buffer: string): {
  events: StreamEvent[];
  remainder: string;
} {
  const events: StreamEvent[] = [];
  const lines = buffer.split("\n");
  const remainder = lines.pop() ?? "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (!payload) continue;
    try {
      events.push(JSON.parse(payload) as StreamEvent);
    } catch {
      // skip
    }
  }

  return { events, remainder };
}

async function consumeSseStream(
  response: Response,
  callbacks: StreamCallbacks,
): Promise<void> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remainder } = parseSseLines(buffer);
    buffer = remainder;

    for (const event of events) {
      if (event.type === "chunk") callbacks.onChunk(event.content);
      else if (event.type === "done") await callbacks.onDone();
      else if (event.type === "error") callbacks.onError(event.message);
    }
  }

  if (buffer.trim()) {
    const { events } = parseSseLines(`${buffer}\n`);
    for (const event of events) {
      if (event.type === "chunk") callbacks.onChunk(event.content);
      else if (event.type === "done") await callbacks.onDone();
      else if (event.type === "error") callbacks.onError(event.message);
    }
  }
}

export async function streamChatRequest(
  url: string,
  body: unknown,
  callbacks: StreamCallbacks & {
    onDone?: () => void;
    onDoneWithMeta?: (tokenCount: number, tokenLimit: number) => void;
  },
): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  await consumeSseStream(response, {
    onChunk: callbacks.onChunk,
    onDone: () => {
      if (callbacks.onDoneWithMeta) {
        // done event meta handled in streamChat wrapper
      }
      callbacks.onDone?.();
    },
    onError: callbacks.onError,
  });
}

export async function streamToneRetry(
  originalText: string,
  tone: Tone,
  callbacks: StreamCallbacks,
): Promise<void> {
  const response = await fetch("/api/tone-retry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalText, tone }),
  });

  await consumeSseStream(response, callbacks);
}
