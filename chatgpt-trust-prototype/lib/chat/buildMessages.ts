import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { buildSystemPrompt, type SystemPromptOptions } from "./buildSystemPrompt";
import { isCodingQuestion } from "./isCodingQuestion";

export interface ClientChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function buildChatMessages(
  messages: ClientChatMessage[],
  promptOptions: SystemPromptOptions = {},
): ChatCompletionMessageParam[] {
  const conversationMessages: ChatCompletionMessageParam[] = messages.map(
    (message) => ({
      role: message.role,
      content: message.content,
    }),
  );

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const includeCodingPriming =
    !promptOptions.citationsMode &&
    !promptOptions.architectMode &&
    Boolean(lastUser && isCodingQuestion(lastUser.content));

  return [
    {
      role: "system",
      content: buildSystemPrompt({
        ...promptOptions,
        includeCodingPriming,
      }),
    },
    ...conversationMessages,
  ];
}
