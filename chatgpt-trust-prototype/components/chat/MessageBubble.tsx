import type { ChatMessage } from "@/types/chat";
import { MessageContentWidth } from "./FeaturePlaceholders";
import { MarkdownMessage } from "./MarkdownMessage";
import { ArchitectTabs } from "@/components/features/ArchitectMode/ArchitectTabs";
import { ToneStyleBar } from "@/components/features/ToneRetry/ToneStyleBar";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

function AssistantMessage({ message, isStreaming }: MessageBubbleProps) {
  const showCursor = isStreaming && !message.content && !message.architectSolutions?.length;
  const isArchitect =
    message.responseType === "architect" &&
    message.architectSolutions &&
    message.architectSolutions.length > 0;

  return (
    <div className="group w-full py-6">
      <MessageContentWidth>
        <div className="flex gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-chat bg-main text-xs font-semibold text-text-primary">
            AI
          </div>
          <div className="min-w-0 flex-1">
            {showCursor ? (
              <span
                className="inline-block h-5 w-2 animate-pulse bg-text-muted"
                aria-label="Assistant is typing"
              />
            ) : isArchitect ? (
              <ArchitectTabs solutions={message.architectSolutions!} />
            ) : (
              <MarkdownMessage
                content={message.content}
                messageId={message.id}
                citations={message.citations}
              />
            )}

            {!showCursor && !isArchitect && message.content && (
              <ToneStyleBar messageId={message.id} activeTone={message.tone} />
            )}
          </div>
        </div>
      </MessageContentWidth>
    </div>
  );
}

function UserMessage({ message }: MessageBubbleProps) {
  return (
    <div className="w-full py-4">
      <MessageContentWidth>
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-3xl bg-[#2f2f2f] px-5 py-3 text-[15px] leading-relaxed text-text-primary">
            {message.content}
          </div>
        </div>
      </MessageContentWidth>
    </div>
  );
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  if (message.role === "user") {
    return <UserMessage message={message} />;
  }
  return <AssistantMessage message={message} isStreaming={isStreaming} />;
}
