"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { SENTINEL_WARN_THRESHOLD } from "@/lib/constants";

/** Triggers Context Sentinel toast once when usage crosses 85% */
export function ContextSentinelWatcher() {
  const tokenCount = useChatStore((s) => s.tokenCount);
  const tokenLimit = useChatStore((s) => s.tokenLimit);
  const sentinelWarned = useChatStore((s) => s.sentinelWarned);

  useEffect(() => {
    const percent = tokenCount / tokenLimit;
    if (percent >= SENTINEL_WARN_THRESHOLD && !sentinelWarned) {
      useChatStore.setState({
        sentinelWarned: true,
        sentinelToastVisible: true,
      });
    }
  }, [tokenCount, tokenLimit, sentinelWarned]);

  return null;
}
