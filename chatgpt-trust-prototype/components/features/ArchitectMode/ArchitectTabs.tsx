"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArchitectSolution } from "@/types/chat";
import { formatArchitectTabLabel } from "@/types/chat";
import { createHighlighter } from "shiki";

interface ArchitectTabsProps {
  solutions: ArchitectSolution[];
}

export function ArchitectTabs({ solutions }: ArchitectTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlightedCode, setHighlightedCode] = useState<Record<string, string>>({});
  const active = solutions[activeIndex] ?? solutions[0];

  useEffect(() => {
    const highlightCode = async () => {
      const highlighter = await createHighlighter({
        themes: ['github-dark'],
        langs: ['javascript', 'typescript', 'java', 'python', 'cpp', 'c', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'text']
      });

      const highlighted: Record<string, string> = {};
      
      for (const solution of solutions) {
        try {
          const lang = solution.language.toLowerCase();
          const supportedLang = highlighter.getLoadedLanguages().includes(lang as string) ? lang : 'text';
          const html = highlighter.codeToHtml(solution.code, {
            lang: supportedLang,
            theme: 'github-dark'
          });
          highlighted[solution.id] = html;
        } catch {
          // Fallback to plain text if highlighting fails
          highlighted[solution.id] = `<pre class="shiki"><code>${escapeHtml(solution.code)}</code></pre>`;
        }
      }

      setHighlightedCode(highlighted);
    };

    highlightCode();
  }, [solutions]);

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
          <div 
            className="overflow-x-auto p-4 text-sm"
            dangerouslySetInnerHTML={{ 
              __html: highlightedCode[active.id] || `<pre class="shiki"><code>${escapeHtml(active.code)}</code></pre>` 
            }}
          />
          {active.explanation && (
            <div className="border-t border-border-chat px-4 py-3 text-sm leading-relaxed text-text-muted">
              <div className="font-medium text-text-primary mb-2">Reasoning & Logic:</div>
              <div className="whitespace-pre-wrap">{active.explanation}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
