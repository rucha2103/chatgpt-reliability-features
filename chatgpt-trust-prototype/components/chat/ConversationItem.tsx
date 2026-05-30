"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Pencil } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

interface ConversationItemProps {
  id: string;
  title: string;
  isActive: boolean;
}

export function ConversationItem({ id, title, isActive }: ConversationItemProps) {
  const selectConversation = useChatStore((s) => s.selectConversation);
  const renameConversation = useChatStore((s) => s.renameConversation);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(title);
    setIsEditing(true);
  };

  const saveTitle = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title) {
      renameConversation(id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTitle();
    } else if (e.key === "Escape") {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <li>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-border-chat bg-[#2f2f2f] px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald-500/50"
          aria-label="Rename chat"
        />
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => selectConversation(id)}
        onDoubleClick={startEditing}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
          isActive
            ? "bg-white/10 text-text-primary"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={startEditing}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              startEditing(e as unknown as React.MouseEvent);
            }
          }}
          className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
          aria-label="Rename chat"
        >
          <Pencil className="h-3.5 w-3.5 text-text-muted" />
        </span>
      </button>
    </li>
  );
}
