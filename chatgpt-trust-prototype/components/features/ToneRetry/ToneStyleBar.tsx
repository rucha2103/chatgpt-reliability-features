"use client";

import { Hand, Briefcase, Smile, Minimize2 } from "lucide-react";
import type { Tone } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";

const TONES: { id: Tone; label: string; Icon: typeof Hand }[] = [
  { id: "polite", label: "Polite", Icon: Hand },
  { id: "professional", label: "Professional", Icon: Briefcase },
  { id: "friendly", label: "Friendly", Icon: Smile },
  { id: "concise", label: "Concise", Icon: Minimize2 },
];

interface ToneStyleBarProps {
  messageId: string;
  activeTone?: Tone | null;
}

export function ToneStyleBar({ messageId, activeTone }: ToneStyleBarProps) {
  const retryTone = useChatStore((s) => s.retryTone);
  const toneRetryMessageId = useChatStore((s) => s.toneRetryMessageId);
  const isStreaming = useChatStore((s) => s.isStreaming);

  const isRetrying = toneRetryMessageId === messageId;
  const disabled = isStreaming || isRetrying;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-border-chat/60 pt-3">
      <span className="mr-2 text-xs text-text-muted">Tone:</span>
      {TONES.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          onClick={() => void retryTone(messageId, id)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            activeTone === id
              ? "bg-emerald-600/20 text-emerald-400"
              : "text-text-muted hover:bg-white/10 hover:text-text-primary"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
