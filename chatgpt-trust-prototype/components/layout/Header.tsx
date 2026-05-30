"use client";

import { ChevronDown } from "lucide-react";
import { DEFAULT_MODEL } from "@/lib/constants";
import { TokenRing } from "@/components/features/ContextSentinel/TokenRing";

export function Header() {
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-border-chat px-4">
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-base font-medium text-text-primary transition-colors hover:bg-white/10"
      >
        <span>ChatGPT</span>
        <span className="text-sm font-normal text-text-muted">{DEFAULT_MODEL}</span>
        <ChevronDown className="h-4 w-4 text-text-muted" />
      </button>

      <TokenRing />
    </header>
  );
}
