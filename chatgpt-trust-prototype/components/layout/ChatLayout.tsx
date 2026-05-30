"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ChatErrorBanner } from "@/components/chat/ChatErrorBanner";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ContextSentinelWatcher } from "@/components/features/ContextSentinel/ContextSentinelWatcher";
import { SentinelToast } from "@/components/features/ContextSentinel/SentinelToast";

export function ChatLayout() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <ContextSentinelWatcher />
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 flex-col bg-main">
        <Header />
        <SentinelToast />
        <ChatErrorBanner />
        <MessageList />
        <ChatInput />
      </div>
    </div>
  );
}
