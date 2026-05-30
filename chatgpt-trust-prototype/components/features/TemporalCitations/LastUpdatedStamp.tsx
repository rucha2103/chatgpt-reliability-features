import { isStaleCitation } from "@/lib/citations/isStaleCitation";

interface LastUpdatedStampProps {
  lastUpdated?: string;
  className?: string;
}

export function LastUpdatedStamp({
  lastUpdated,
  className = "",
}: LastUpdatedStampProps) {
  const stale = isStaleCitation(lastUpdated ?? "");
  const display = lastUpdated?.trim() || "Unknown";

  return (
    <span
      className={`whitespace-nowrap text-xs ${stale ? "text-yellow-400" : "text-text-muted"} ${className}`}
    >
      · Last updated: {display}
    </span>
  );
}
