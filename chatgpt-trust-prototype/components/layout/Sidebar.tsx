"use client";

import {
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ConversationItem } from "@/components/chat/ConversationItem";

export function Sidebar() {
  const sidebarOpen = useChatStore((s) => s.sidebarOpen);
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const newConversation = useChatStore((s) => s.newConversation);

  if (!sidebarOpen) {
    return (
      <aside className="hidden h-full shrink-0 flex-col border-r border-border-chat bg-sidebar p-2 md:flex md:w-14">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={newConversation}
          aria-label="New chat"
          className="mt-1 rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="hidden h-full shrink-0 flex-col border-r border-border-chat bg-sidebar md:flex md:w-[260px]">
      <div className="flex items-center gap-1 p-2">
        <button
          type="button"
          onClick={newConversation}
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary transition-colors hover:bg-white/10"
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0" />
          <span>New chat</span>
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-text-muted">No chats yet</p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                id={conv.id}
                title={conv.title}
                isActive={conv.id === activeConversationId}
              />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
