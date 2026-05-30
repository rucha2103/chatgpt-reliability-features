"use client";

import type { Citation } from "@/types/chat";
import { CitationSourceItem } from "./CitationSourceItem";

interface CitationSourcesListProps {
  citations: Citation[];
}

export function CitationSourcesList({ citations }: CitationSourcesListProps) {
  if (!citations.length) return null;

  const sorted = [...citations].sort((a, b) => a.id - b.id);

  return (
    <div className="mt-5 border-t border-border-chat pt-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
        Sources
      </div>
      <ul className="space-y-2">
        {sorted.map((citation) => (
          <CitationSourceItem key={citation.id} citation={citation} />
        ))}
      </ul>
    </div>
  );
}
