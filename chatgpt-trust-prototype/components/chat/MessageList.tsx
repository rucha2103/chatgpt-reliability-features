"use client";

import { useEffect, useRef } from "react";
import { useChatStore, useActiveMessages } from "@/store/chatStore";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";

export function MessageList() {
  const messages = useActiveMessages();
  const isStreaming = useChatStore((s) => s.isStreaming);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastMessage = messages[messages.length - 1];
  const streamingAssistantId =
    isStreaming && lastMessage?.role === "assistant" ? lastMessage.id : null;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming, activeConversationId]);

  if (!activeConversationId || (messages.length === 0 && !isStreaming)) {
    return <EmptyState />;
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={message.id === streamingAssistantId}
        />
      ))}
    </div>
  );
}
