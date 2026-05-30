"use client";

import { useChatStore } from "@/store/chatStore";

function ringColor(percent: number): string {
  if (percent >= 0.85) return "#ef4444";
  if (percent >= 0.7) return "#f59e0b";
  return "#10b981";
}

export function TokenRing() {
  const tokenCount = useChatStore((s) => s.tokenCount);
  const tokenLimit = useChatStore((s) => s.tokenLimit);

  const percent = Math.min(tokenCount / tokenLimit, 1);
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);
  const color = ringColor(percent);

  const label = `${tokenCount.toLocaleString()} / ${tokenLimit.toLocaleString()} tokens`;

  return (
    <div
      className="relative flex h-9 w-9 items-center justify-center"
      title={label}
      aria-label={`Context usage ${Math.round(percent * 100)} percent`}
    >
      <svg className="h-7 w-7 -rotate-90" viewBox="0 0 32 32" aria-hidden>
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke="#2f2f2f"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
    </div>
  );
}
