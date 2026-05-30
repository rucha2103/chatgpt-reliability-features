"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowUp, Layers } from "lucide-react";
import { CHAT_MAX_WIDTH_PX } from "@/lib/constants";
import { useChatStore } from "@/store/chatStore";

export function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const architectModeEnabled = useChatStore((s) => s.architectModeEnabled);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const toggleArchitectMode = useChatStore((s) => s.toggleArchitectMode);
  const sendUserMessage = useChatStore((s) => s.sendUserMessage);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;

    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendUserMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isStreaming;

  return (
    <div className="shrink-0 border-t border-border-chat/50 bg-main px-4 pb-4 pt-3">
      <div className="mx-auto w-full" style={{ maxWidth: CHAT_MAX_WIDTH_PX }}>
        <div className="relative flex items-end rounded-3xl border border-border-chat bg-[#2f2f2f] shadow-sm">
          <button
            type="button"
            onClick={toggleArchitectMode}
            aria-pressed={architectModeEnabled}
            aria-label="Architect Mode"
            title="Architect Mode — returns 3 tabbed coding approaches"
            className={`mb-2.5 ml-2 flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors ${
              architectModeEnabled
                ? "bg-emerald-600/25 text-emerald-400"
                : "text-text-muted hover:bg-white/10 hover:text-text-primary"
            }`}
          >
            <Layers className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Architect</span>
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder=""
            rows={1}
            disabled={isStreaming}
            className="max-h-[200px] min-h-[52px] flex-1 resize-none bg-transparent py-3.5 pl-1 pr-2 text-[15px] leading-relaxed text-text-primary focus:outline-none disabled:opacity-50"
          />

          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend}
            aria-label="Send message"
            className="mb-2.5 mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:opacity-90"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-text-muted">
          Powered by Groq — in-memory only (refresh clears history)
        </p>
      </div>
    </div>
  );
}
