export type MessageRole = "user" | "assistant" | "system";

export type Tone = "polite" | "professional" | "friendly" | "concise";

export type ResponseType = "text" | "architect" | "citations";

export interface ArchitectSolution {
  id: "A" | "B" | "C";
  label: string;
  language: string;
  code: string;
  explanation: string;
}

export interface Citation {
  id: number;
  fact: string;
  source: string;
  lastUpdated: string;
  url?: string;
  /** Set after server-side URL verification */
  verified?: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  responseType?: ResponseType;
  tone?: Tone | null;
  architectSolutions?: ArchitectSolution[];
  citations?: Citation[];
  hasCodeBlock?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  tokenCount: number;
  sentinelWarned: boolean;
  createdAt: number;
  updatedAt: number;
}

export type MessageUpdate = Partial<
  Pick<
    ChatMessage,
    | "content"
    | "tone"
    | "responseType"
    | "architectSolutions"
    | "citations"
    | "hasCodeBlock"
  >
>;

/** Tab label from API may already include "Approach A:" — avoid duplicating in UI */
export function formatArchitectTabLabel(solution: ArchitectSolution): string {
  const label = solution.label.trim();
  if (/^Approach\s+[ABC]\b/i.test(label)) {
    return label;
  }
  return `Approach ${solution.id}: ${label}`;
}
