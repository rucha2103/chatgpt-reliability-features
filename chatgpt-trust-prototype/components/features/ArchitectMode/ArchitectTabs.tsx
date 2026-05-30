"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArchitectSolution } from "@/types/chat";
import { formatArchitectTabLabel } from "@/types/chat";

interface ArchitectTabsProps {
  solutions: ArchitectSolution[];
}

export function ArchitectTabs({ solutions }: ArchitectTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = solutions[activeIndex] ?? solutions[0];

  if (!active) return null;

  return (
    <div className="mt-1 overflow-hidden rounded-lg border border-border-chat bg-[#1a1a1a]">
      <div className="flex overflow-x-auto border-b border-border-chat bg-[#2d2d2d]">
        {solutions.map((solution, index) => (
          <button
            key={solution.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`shrink-0 px-4 py-2.5 text-xs font-medium transition-colors ${
              index === activeIndex
                ? "border-b-2 border-emerald-500 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {formatArchitectTabLabel(solution)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          <div className="border-b border-border-chat px-4 py-2 text-xs text-text-muted">
            {active.language}
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-text-primary">
            <code>{active.code}</code>
          </pre>
          {active.explanation && (
            <p className="border-t border-border-chat px-4 py-3 text-sm leading-relaxed text-text-muted">
              {active.explanation}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
