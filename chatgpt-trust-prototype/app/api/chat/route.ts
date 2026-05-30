import { NextResponse } from "next/server";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { buildChatMessages } from "@/lib/chat/buildMessages";
import { getGroqClient, getGroqModel, getApiKeyErrorMessage } from "@/lib/groq";
import {
  encodeStreamEvent,
  type ChatRequestBody,
  type ChatCompletionResponse,
  type StructuredKind,
} from "@/lib/api/chatProtocol";
import {
  countConversationTokens,
  getTokenLimit,
} from "@/lib/tokens/countTokens";
import {
  parseCitationResponse,
  salvageCitationResponse,
} from "@/lib/parsers/citationParser";
import { verifyAndNormalizeCitations } from "@/lib/citations/verifyCitations";
import { CITATION_RESPONSE_JSON_SCHEMA } from "@/lib/schemas/citationResponseSchema";
import type { Citation } from "@/types/chat";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isValidMessage(
  value: unknown,
): value is { role: "user" | "assistant"; content: string } {
  if (!value || typeof value !== "object") return false;
  const msg = value as Record<string, unknown>;
  return (
    (msg.role === "user" || msg.role === "assistant") &&
    typeof msg.content === "string" &&
    msg.content.trim().length > 0
  );
}

function parseRequestBody(body: unknown): ChatRequestBody | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  if (!Array.isArray(raw.messages) || raw.messages.length === 0) return null;
  if (!raw.messages.every(isValidMessage)) return null;

  const architectMode =
    typeof raw.architectMode === "boolean" ? raw.architectMode : false;
  const citationsMode =
    typeof raw.citationsMode === "boolean" ? raw.citationsMode : false;

  let responseMode: ChatRequestBody["responseMode"] = "text";
  let structuredKind: StructuredKind | undefined;

  if (architectMode) {
    responseMode = "structured";
    structuredKind = "architect";
  } else if (citationsMode) {
    responseMode = "structured";
    structuredKind = "citations";
  }

  if (raw.responseMode === "structured" || raw.responseMode === "text") {
    responseMode = raw.responseMode;
  }
  if (raw.structuredKind === "architect" || raw.structuredKind === "citations") {
    structuredKind = raw.structuredKind;
  }

  return {
    messages: raw.messages,
    stream: typeof raw.stream === "boolean" ? raw.stream : true,
    responseMode,
    structuredKind,
    architectMode,
    citationsMode,
  };
}

function getPromptOptions(parsed: ChatRequestBody) {
  return {
    architectMode: parsed.architectMode === true,
    citationsMode: parsed.citationsMode === true && !parsed.architectMode,
  };
}

async function createStreamingResponse(
  chatMessages: ChatCompletionMessageParam[],
  tokenCount: number,
) {
  const groq = getGroqClient();
  const model = getGroqModel();
  const tokenLimit = getTokenLimit();

  const completion = await groq.chat.completions.create({
    model,
    messages: chatMessages,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(
              encodeStreamEvent({ type: "chunk", content: delta }),
            );
          }
        }

        controller.enqueue(
          encodeStreamEvent({
            type: "done",
            tokenCount,
            tokenLimit,
          }),
        );
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream failed";
        controller.enqueue(
          encodeStreamEvent({ type: "error", message }),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

async function createStructuredResponse(
  chatMessages: ChatCompletionMessageParam[],
  tokenCount: number,
  structuredKind: StructuredKind,
): Promise<NextResponse<ChatCompletionResponse | { error: string }>> {
  const groq = getGroqClient();
  const model = getGroqModel();
  const tokenLimit = getTokenLimit();

  const responseFormat =
    structuredKind === "citations"
      ? ({
          type: "json_schema",
          json_schema: CITATION_RESPONSE_JSON_SCHEMA,
        } as const)
      : ({ type: "json_object" } as const);

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model,
      messages: chatMessages,
      stream: false,
      response_format: responseFormat,
    });
  } catch {
    completion = await groq.chat.completions.create({
      model,
      messages: chatMessages,
      stream: false,
      response_format: { type: "json_object" },
    });
  }

  let content = completion.choices[0]?.message?.content ?? "";
  let citations: Citation[] | undefined;

  if (structuredKind === "citations") {
    const strict = parseCitationResponse(content);
    const parsed = strict.ok ? strict : salvageCitationResponse(content);

    if (parsed.ok) {
      const verified = await verifyAndNormalizeCitations(parsed.citations);
      citations = verified;
      content = JSON.stringify({
        answer: parsed.answer,
        citations: verified.map((c) => ({
          id: c.id,
          fact: c.fact,
          source: c.source,
          url: c.url,
          last_updated: c.lastUpdated,
        })),
      });
    }
  }

  return NextResponse.json({
    content,
    tokenCount,
    tokenLimit,
    responseMode: "structured",
    structuredKind,
    citations,
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = parseRequestBody(body);
  if (!parsed) {
    return jsonError(
      "Request must include a non-empty messages array of { role, content }",
      400,
    );
  }

  const apiKeyError = getApiKeyErrorMessage();
  if (apiKeyError) {
    return jsonError(apiKeyError, 401);
  }

  const chatMessages = buildChatMessages(parsed.messages, getPromptOptions(parsed));
  const tokenCount = await countConversationTokens(
    chatMessages.map((m) => ({
      role: m.role,
      content: typeof m.content === "string" ? m.content : "",
    })),
  );

  try {
    if (parsed.responseMode === "structured" && parsed.structuredKind) {
      return await createStructuredResponse(
        chatMessages,
        tokenCount,
        parsed.structuredKind,
      );
    }

    if (parsed.stream === false) {
      const groq = getGroqClient();
      const completion = await groq.chat.completions.create({
        model: getGroqModel(),
        messages: chatMessages,
        stream: false,
      });
      return NextResponse.json({
        content: completion.choices[0]?.message?.content ?? "",
        tokenCount,
        tokenLimit: getTokenLimit(),
        responseMode: "text",
      });
    }

    return await createStreamingResponse(chatMessages, tokenCount);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Groq request failed";

    if (message.includes("GROQ_API_KEY")) {
      return jsonError(message, 401);
    }

    return jsonError(message, 502);
  }
}
