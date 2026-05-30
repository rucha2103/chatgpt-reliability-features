"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export function SentinelToast() {
  const visible = useChatStore((s) => s.sentinelToastVisible);
  const dismiss = useChatStore((s) => s.dismissSentinelToast);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 top-14 z-50 w-[min(420px,calc(100%-2rem))] -translate-x-1/2"
        >
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-[#2f2f2f] px-4 py-3 shadow-lg">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="flex-1 text-sm text-text-primary">
              You&apos;re approaching the context limit. Start a new chat to avoid
              truncated responses.
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss warning"
              className="shrink-0 rounded p-0.5 text-text-muted hover:bg-white/10 hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
