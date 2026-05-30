"use client";

import { AlertCircle, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export function ChatErrorBanner() {
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);

  if (!error) return null;

  return (
    <div className="mx-4 mb-2 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{error}</p>
      <button
        type="button"
        onClick={clearError}
        aria-label="Dismiss error"
        className="shrink-0 rounded p-0.5 hover:bg-red-500/20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
