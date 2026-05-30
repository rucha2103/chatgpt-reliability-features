"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Citation } from "@/types/chat";
import { getCitationHref } from "@/lib/citations/getCitationHref";
import { isStaleCitation } from "@/lib/citations/isStaleCitation";
import { LastUpdatedStamp } from "./LastUpdatedStamp";

interface CitationSourceItemProps {
  citation: Citation;
}

export function CitationSourceItem({ citation }: CitationSourceItemProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const rowRef = useRef<HTMLLIElement>(null);
  const href = getCitationHref(citation);
  const stale = isStaleCitation(citation.lastUpdated);
  const dateLabel = citation.lastUpdated?.trim() || "Unknown";

  useEffect(() => {
    if (!open || !rowRef.current) return;

    const updatePosition = () => {
      const rect = rowRef.current!.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const tooltip = open ? (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.12 }}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: "translate(-50%, -100%)",
      }}
      className={`z-[9999] w-56 rounded-lg border px-3 py-2 text-left text-xs shadow-lg ${
        stale
          ? "border-yellow-400/40 bg-[#2f2f2f] text-yellow-100"
          : "border-border-chat bg-[#2f2f2f] text-text-primary"
      }`}
      role="tooltip"
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-400 underline hover:text-blue-300"
        >
          Open {citation.source}
        </a>
      ) : (
        <div className="font-medium">{citation.source}</div>
      )}
      <div className={`mt-1 ${stale ? "text-yellow-400" : "text-text-muted"}`}>
        Last updated: {dateLabel}
      </div>
    </motion.div>
  ) : null;

  return (
    <>
      <li
        ref={rowRef}
        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm leading-snug"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-[10px] font-medium ${
            stale
              ? "bg-yellow-400/20 text-yellow-400"
              : "bg-white/10 text-text-muted"
          }`}
        >
          [{citation.id}]
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium transition-colors ${
              open
                ? "text-blue-400 underline"
                : "text-text-primary hover:text-blue-400 hover:underline"
            }`}
          >
            {citation.source}
          </a>
        ) : (
          <span className="font-medium text-text-primary">{citation.source}</span>
        )}
        <LastUpdatedStamp lastUpdated={citation.lastUpdated} />
        {citation.fact ? (
          <span className="w-full text-xs text-text-muted">{citation.fact}</span>
        ) : null}
      </li>

      {typeof document !== "undefined" && (
        <AnimatePresence>
          {tooltip ? createPortal(tooltip, document.body) : null}
        </AnimatePresence>
      )}
    </>
  );
}
