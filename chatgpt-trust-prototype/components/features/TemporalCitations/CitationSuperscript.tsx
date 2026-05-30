"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Citation } from "@/types/chat";
import { isStaleCitation } from "@/lib/citations/isStaleCitation";
import { LastUpdatedStamp } from "./LastUpdatedStamp";

interface CitationSuperscriptProps {
  id: number;
  citation?: Citation;
  /** When false, only the [n] badge is shown (e.g. in the Sources footer). */
  showInlineStamp?: boolean;
}

export function CitationSuperscript({
  id,
  citation,
  showInlineStamp = true,
}: CitationSuperscriptProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const stale = citation ? isStaleCitation(citation.lastUpdated) : false;

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
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

  const tooltip =
    open && citation ? (
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
        <div className="font-medium">Source: {citation.source}</div>
        <div className={`mt-1 ${stale ? "text-yellow-400" : "text-text-muted"}`}>
          Last Updated: {citation.lastUpdated || "Unknown"}
        </div>
      </motion.div>
    ) : null;

  return (
    <>
      <span className="relative inline-flex items-baseline gap-0.5 align-baseline">
        <button
          ref={buttonRef}
          type="button"
          className={`mx-0.5 inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded px-1 align-super text-[10px] font-medium leading-none transition-colors ${
            stale
              ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
              : "bg-white/10 text-text-muted hover:bg-white/20 hover:text-text-primary"
          }`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-label={`Citation ${id}`}
        >
          [{id}]
        </button>
        {showInlineStamp ? (
          <LastUpdatedStamp lastUpdated={citation?.lastUpdated} />
        ) : null}
      </span>

      {typeof document !== "undefined" && (
        <AnimatePresence>
          {tooltip ? createPortal(tooltip, document.body) : null}
        </AnimatePresence>
      )}
    </>
  );
}
