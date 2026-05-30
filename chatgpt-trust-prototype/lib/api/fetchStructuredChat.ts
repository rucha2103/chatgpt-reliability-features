import type {
  ChatRequestBody,
  StructuredChatResponse,
} from "@/lib/api/chatProtocol";

export async function fetchStructuredChat(
  body: ChatRequestBody,
): Promise<StructuredChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      stream: false,
      responseMode: "structured",
    }),
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

  const data = (await response.json()) as StructuredChatResponse & {
    structuredKind?: StructuredChatResponse["structuredKind"];
  };

  if (!data.structuredKind) {
    throw new Error("Structured response missing kind");
  }

  return {
    content: data.content,
    tokenCount: data.tokenCount,
    tokenLimit: data.tokenLimit,
    structuredKind: data.structuredKind,
    citations: data.citations,
  };
}
