import { create } from "zustand";
import type {
  ChatMessage,
  Citation,
  Conversation,
  MessageRole,
  MessageUpdate,
  Tone,
} from "@/types/chat";
import { SENTINEL_WARN_THRESHOLD, TOKEN_LIMIT } from "@/lib/constants";
import { streamChat } from "@/lib/api/streamChatClient";
import { fetchStructuredChat } from "@/lib/api/fetchStructuredChat";
import { streamToneRetry } from "@/lib/api/streamHelpers";
import { parseArchitectResponse } from "@/lib/parsers/architectParser";
import {
  isCitationStyleQuestion,
  looksLikeJsonPayload,
  parseCitationResponse,
  salvageCitationResponse,
} from "@/lib/parsers/citationParser";
import { attachTemporalCitations } from "@/lib/citations/attachTemporalCitations";
import { verifyCitationsClient } from "@/lib/api/verifyCitationsClient";

const DEFAULT_CONVERSATION_TITLE = "New chat";
const MAX_AUTO_TITLE_LENGTH = 48;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createMessage(role: MessageRole, content: string): ChatMessage {
  return {
    id: generateId(),
    role,
    content,
    createdAt: Date.now(),
    hasCodeBlock: role === "assistant" && /```[\s\S]*?```/.test(content),
    responseType: "text",
  };
}

function createConversation(title = DEFAULT_CONVERSATION_TITLE): Conversation {
  const now = Date.now();
  return {
    id: generateId(),
    title,
    messages: [],
    tokenCount: 0,
    sentinelWarned: false,
    createdAt: now,
    updatedAt: now,
  };
}

function autoTitleFromMessage(text: string): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= MAX_AUTO_TITLE_LENGTH) return oneLine;
  return `${oneLine.slice(0, MAX_AUTO_TITLE_LENGTH - 1)}…`;
}

function toApiMessages(messages: ChatMessage[]) {
  return messages
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        m.content.trim().length > 0,
    )
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

function getPlainTextForToneRetry(message: ChatMessage): string {
  if (message.responseType === "architect" && message.architectSolutions?.length) {
    return message.architectSolutions
      .map(
        (s) =>
          `${s.label}:\n${s.explanation}\n\`\`\`${s.language}\n${s.code}\n\`\`\``,
      )
      .join("\n\n");
  }
  return message.content;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;

  architectModeEnabled: boolean;
  isStreaming: boolean;
  sidebarOpen: boolean;

  tokenCount: number;
  tokenLimit: number;
  sentinelWarned: boolean;
  sentinelToastVisible: boolean;

  toneRetryMessageId: string | null;
  error: string | null;

  newConversation: () => void;
  selectConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  toggleArchitectMode: () => void;
  setStreaming: (value: boolean) => void;
  setTokenCount: (count: number, limit?: number) => void;
  toggleSidebar: () => void;
  clearError: () => void;
  setError: (message: string) => void;
  setSentinelToastVisible: (visible: boolean) => void;
  dismissSentinelToast: () => void;

  sendUserMessage: (content: string) => Promise<void>;
  retryTone: (messageId: string, tone: Tone) => Promise<void>;
}

function patchActiveConversation(
  conversations: Conversation[],
  activeId: string | null,
  patch: (conv: Conversation) => Conversation,
): Conversation[] {
  if (!activeId) return conversations;
  return conversations.map((c) => (c.id === activeId ? patch(c) : c));
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,

  architectModeEnabled: false,
  isStreaming: false,
  sidebarOpen: true,

  tokenCount: 0,
  tokenLimit: TOKEN_LIMIT,
  sentinelWarned: false,
  sentinelToastVisible: false,

  toneRetryMessageId: null,
  error: null,

  newConversation: () => {
    const conv = createConversation();
    set((state) => ({
      conversations: [conv, ...state.conversations],
      activeConversationId: conv.id,
      isStreaming: false,
      tokenCount: 0,
      sentinelWarned: false,
      sentinelToastVisible: false,
      toneRetryMessageId: null,
      error: null,
    }));
  },

  selectConversation: (id) => {
    const conv = get().conversations.find((c) => c.id === id);
    if (!conv) return;
    set({
      activeConversationId: id,
      tokenCount: conv.tokenCount,
      sentinelWarned: conv.sentinelWarned,
      sentinelToastVisible: false,
      error: null,
    });
  },

  renameConversation: (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title: trimmed, updatedAt: Date.now() } : c,
      ),
    }));
  },

  toggleArchitectMode: () => {
    set((state) => ({
      architectModeEnabled: !state.architectModeEnabled,
    }));
  },

  setStreaming: (value) => set({ isStreaming: value }),

  setTokenCount: (count, limit) => {
    const activeId = get().activeConversationId;
    const tokenLimit = limit ?? get().tokenLimit;
    const percent = count / tokenLimit;

    set((state) => ({
      tokenCount: count,
      tokenLimit,
      sentinelWarned:
        percent >= SENTINEL_WARN_THRESHOLD ? state.sentinelWarned : false,
      conversations: patchActiveConversation(
        state.conversations,
        activeId,
        (c) => ({
          ...c,
          tokenCount: count,
          sentinelWarned:
            percent >= SENTINEL_WARN_THRESHOLD ? c.sentinelWarned : false,
          updatedAt: Date.now(),
        }),
      ),
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  clearError: () => set({ error: null }),

  setError: (message) => set({ error: message }),

  setSentinelToastVisible: (visible) => set({ sentinelToastVisible: visible }),

  dismissSentinelToast: () => set({ sentinelToastVisible: false }),

  sendUserMessage: async (content) => {
    const trimmed = content.trim();
    if (!trimmed || get().isStreaming) return;

    let activeId = get().activeConversationId;
    if (!activeId) {
      get().newConversation();
      activeId = get().activeConversationId;
    }
    if (!activeId) return;

    set({ error: null });

    const userMessage = createMessage("user", trimmed);
    set((state) => ({
      conversations: patchActiveConversation(
        state.conversations,
        activeId,
        (c) => {
          const isFirstUser =
            c.title === DEFAULT_CONVERSATION_TITLE &&
            c.messages.every((m) => m.role !== "user");
          return {
            ...c,
            title: isFirstUser ? autoTitleFromMessage(trimmed) : c.title,
            messages: [...c.messages, userMessage],
            updatedAt: Date.now(),
          };
        },
      ),
    }));

    const activeConv = get().conversations.find((c) => c.id === activeId)!;
    const apiMessages = toApiMessages(activeConv.messages);
    const architectMode = get().architectModeEnabled;
    const citationsMode = !architectMode && isCitationStyleQuestion(trimmed);

    set({ isStreaming: true });
    const assistantMessage = createMessage("assistant", "");

    set((state) => ({
      conversations: patchActiveConversation(
        state.conversations,
        activeId,
        (c) => ({
          ...c,
          messages: [...c.messages, assistantMessage],
          updatedAt: Date.now(),
        }),
      ),
    }));

    const assistantId = assistantMessage.id;

    const updateAssistant = (partial: MessageUpdate) => {
      set((state) => ({
        conversations: patchActiveConversation(
          state.conversations,
          activeId,
          (c) => ({
            ...c,
            messages: c.messages.map((m) => {
              if (m.id !== assistantId) return m;
              const next = { ...m, ...partial };
              if (partial.content !== undefined) {
                next.hasCodeBlock = /```[\s\S]*?```/.test(partial.content);
              }
              return next;
            }),
            updatedAt: Date.now(),
          }),
        ),
      }));
    };

    const removeAssistant = () => {
      set((state) => ({
        conversations: patchActiveConversation(
          state.conversations,
          activeId,
          (c) => ({
            ...c,
            messages: c.messages.filter((m) => m.id !== assistantId),
            updatedAt: Date.now(),
          }),
        ),
      }));
    };

    try {
      if (architectMode || citationsMode) {
        const result = await fetchStructuredChat({
          messages: apiMessages,
          architectMode,
          citationsMode,
          structuredKind: architectMode ? "architect" : "citations",
        });

        get().setTokenCount(result.tokenCount, result.tokenLimit);

        if (result.structuredKind === "architect") {
          const parsed = parseArchitectResponse(result.content);
          if (parsed.ok) {
            updateAssistant({
              content: "",
              responseType: "architect",
              architectSolutions: parsed.solutions,
              citations: undefined,
            });
          } else {
            updateAssistant({ content: result.content, responseType: "text" });
          }
        } else {
          const strict = parseCitationResponse(result.content);
          const parsed = strict.ok ? strict : salvageCitationResponse(result.content);

          if (parsed.ok) {
            const verified =
              result.citations?.length
                ? result.citations
                : await verifyCitationsClient(parsed.citations);
            updateAssistant({
              content: parsed.answer,
              responseType: verified.length ? "citations" : "text",
              citations: verified.length ? verified : undefined,
              architectSolutions: undefined,
            });
          } else {
            updateAssistant({
              content:
                "I could not format that response. Please try asking again in one clear question.",
              responseType: "text",
              citations: undefined,
              architectSolutions: undefined,
            });
          }
        }

        set({ isStreaming: false });

        const conv = get().conversations.find((c) => c.id === activeId);
        const msg = conv?.messages.find((m) => m.id === assistantId);
        if (!msg?.content && !msg?.architectSolutions?.length) {
          removeAssistant();
          get().setError("The assistant returned an empty response. Please try again.");
        }
        return;
      }

      let accumulated = "";

      await streamChat(
        { messages: apiMessages, architectMode: false, citationsMode: false },
        {
          onChunk: (chunk) => {
            accumulated += chunk;
            updateAssistant({ content: accumulated, responseType: "text" });
          },
          onDone: async (tokenCount, tokenLimit) => {
            let displayContent = accumulated;
            let pendingCitations: Citation[] | undefined;

            if (looksLikeJsonPayload(accumulated)) {
              const salvaged = salvageCitationResponse(accumulated);
              if (salvaged.ok) {
                displayContent = salvaged.answer;
                pendingCitations = salvaged.citations;
              } else {
                displayContent =
                  "I could not format that response. Please try asking again in one clear question.";
              }
            }

            const enriched = attachTemporalCitations(
              displayContent,
              pendingCitations,
            );
            const verified = enriched.citations?.length
              ? await verifyCitationsClient(enriched.citations)
              : undefined;
            updateAssistant({
              content: enriched.content,
              citations: verified,
              responseType: verified?.length ? "citations" : "text",
            });
            get().setTokenCount(tokenCount, tokenLimit);
            set({ isStreaming: false });
          },
          onError: (message) => {
            throw new Error(message);
          },
        },
      );

      if (get().isStreaming) {
        set({ isStreaming: false });
      }

      if (!accumulated.trim()) {
        removeAssistant();
        get().setError("The assistant returned an empty response. Please try again.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";

      removeAssistant();
      set({ isStreaming: false, error: message });
    }
  },

  retryTone: async (messageId, tone) => {
    const activeId = get().activeConversationId;
    if (!activeId || get().isStreaming) return;

    const conv = get().conversations.find((c) => c.id === activeId);
    const message = conv?.messages.find((m) => m.id === messageId);
    if (!message || message.role !== "assistant") return;

    const originalText = getPlainTextForToneRetry(message);
    if (!originalText.trim()) return;

    set({ toneRetryMessageId: messageId, error: null });

    let accumulated = "";

    try {
      await streamToneRetry(originalText, tone, {
        onChunk: (chunk) => {
          accumulated += chunk;
          set((state) => ({
            conversations: patchActiveConversation(
              state.conversations,
              activeId,
              (c) => ({
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId
                    ? {
                        ...m,
                        content: accumulated,
                        tone,
                        responseType: "text" as const,
                        architectSolutions: undefined,
                        citations: undefined,
                      }
                    : m,
                ),
                updatedAt: Date.now(),
              }),
            ),
          }));
        },
        onDone: async () => {
          const enriched = attachTemporalCitations(accumulated);
          const verified = enriched.citations?.length
            ? await verifyCitationsClient(enriched.citations)
            : undefined;
          set((state) => ({
            conversations: patchActiveConversation(
              state.conversations,
              activeId,
              (c) => ({
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId
                    ? {
                        ...m,
                        content: enriched.content,
                        citations: verified,
                        responseType: verified?.length ? "citations" : "text",
                      }
                    : m,
                ),
                updatedAt: Date.now(),
              }),
            ),
          }));
          set({ toneRetryMessageId: null });
        },
        onError: (message) => {
          throw new Error(message);
        },
      });

      if (get().toneRetryMessageId === messageId) {
        set({ toneRetryMessageId: null });
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Tone rewrite failed. Please try again.";
      set({ toneRetryMessageId: null, error: msg });
    }
  },
}));

const EMPTY_MESSAGES: ChatMessage[] = [];

/** Select messages for the active conversation */
export function useActiveMessages(): ChatMessage[] {
  return useChatStore((state) => {
    const conv = state.conversations.find(
      (c) => c.id === state.activeConversationId,
    );
    return conv?.messages ?? EMPTY_MESSAGES;
  });
}
