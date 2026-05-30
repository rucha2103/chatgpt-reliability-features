import type { ChatRequestBody, StreamEvent } from "@/lib/api/chatProtocol";

export interface StreamChatCallbacks {
  onChunk: (content: string) => void;
  onDone: (
    tokenCount: number,
    tokenLimit: number,
  ) => void | Promise<void>;
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
      // skip malformed lines
    }
  }

  return { events, remainder };
}

export async function streamChat(
  body: ChatRequestBody,
  callbacks: StreamChatCallbacks,
): Promise<void> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: true, responseMode: "text" }),
  });

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
    throw new Error("No response body from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handleEvents = async (events: StreamEvent[]) => {
    for (const event of events) {
      if (event.type === "chunk") {
        callbacks.onChunk(event.content);
      } else if (event.type === "done") {
        await callbacks.onDone(event.tokenCount, event.tokenLimit);
      } else if (event.type === "error") {
        callbacks.onError(event.message);
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remainder } = parseSseLines(buffer);
    buffer = remainder;
    await handleEvents(events);
  }

  if (buffer.trim()) {
    const { events } = parseSseLines(`${buffer}\n`);
    await handleEvents(events);
  }
}
