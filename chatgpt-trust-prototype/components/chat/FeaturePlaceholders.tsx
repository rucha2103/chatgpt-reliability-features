import { CHAT_MAX_WIDTH_PX } from "@/lib/constants";

interface ToneRetryPlaceholderProps {
  messageId: string;
}

/** Phase 08: Tone-Retry style bar mounts below assistant messages */
export function ToneRetryPlaceholder({ messageId }: ToneRetryPlaceholderProps) {
  return (
    <div
      className="mt-3 flex items-center gap-1 border-t border-border-chat/60 pt-3 opacity-0 pointer-events-none h-0 overflow-hidden"
      aria-hidden
      data-phase-08-mount={`tone-retry-${messageId}`}
    >
      {/* Phase 08: Polite | Professional | Friendly | Concise */}
    </div>
  );
}

interface ArchitectTabsPlaceholderProps {
  messageId: string;
}

/** Phase 07: Tabbed code solutions mount inside assistant code blocks */
export function ArchitectTabsPlaceholder({ messageId }: ArchitectTabsPlaceholderProps) {
  return (
    <div
      className="hidden"
      data-phase-07-mount={`architect-tabs-${messageId}`}
      aria-hidden
    />
  );
}

interface CitationPlaceholderProps {
  messageId: string;
}

/** Phase 10: Superscript citation buttons mount inline in assistant text */
export function CitationPlaceholder({ messageId }: CitationPlaceholderProps) {
  return (
    <span
      className="hidden"
      data-phase-10-mount={`citations-${messageId}`}
      aria-hidden
    />
  );
}

export function MessageContentWidth({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full px-4" style={{ maxWidth: CHAT_MAX_WIDTH_PX }}>
      {children}
    </div>
  );
}
