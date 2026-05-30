/**
 * SSE stream protocol for POST /api/chat
 */

export type StreamChunkEvent = {
  type: "chunk";
  content: string;
};

export type StreamDoneEvent = {
  type: "done";
  tokenCount: number;
  tokenLimit: number;
};

export type StreamErrorEvent = {
  type: "error";
  message: string;
};

export type StreamEvent = StreamChunkEvent | StreamDoneEvent | StreamErrorEvent;

export function encodeStreamEvent(event: StreamEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export type ResponseMode = "text" | "structured";
export type StructuredKind = "architect" | "citations";

/** Non-streaming JSON response (stream: false or structured mode) */
export interface ChatCompletionResponse {
  content: string;
  tokenCount: number;
  tokenLimit: number;
  responseMode?: ResponseMode;
  structuredKind?: StructuredKind;
  /** Present when structuredKind is citations (URLs verified server-side) */
  citations?: {
    id: number;
    fact: string;
    source: string;
    lastUpdated: string;
    url?: string;
    verified?: boolean;
  }[];
}

/** Request body for POST /api/chat */
export interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  stream?: boolean;
  responseMode?: ResponseMode;
  structuredKind?: StructuredKind;
  architectMode?: boolean;
  citationsMode?: boolean;
}

/** Non-streaming structured chat response from client helper */
export interface StructuredChatResponse {
  content: string;
  tokenCount: number;
  tokenLimit: number;
  structuredKind: StructuredKind;
  citations?: ChatCompletionResponse["citations"];
}
