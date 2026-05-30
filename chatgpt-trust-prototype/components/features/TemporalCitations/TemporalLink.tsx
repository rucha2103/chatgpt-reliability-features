import type { ReactNode } from "react";
import type { Citation } from "@/types/chat";
import { LastUpdatedStamp } from "./LastUpdatedStamp";

interface TemporalLinkProps {
  href?: string;
  children: ReactNode;
  citation?: Citation;
}

export function TemporalLink({ href, children, citation }: TemporalLinkProps) {
  return (
    <span className="inline">
      <a
        href={href}
        className="text-blue-400 underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
      <LastUpdatedStamp lastUpdated={citation?.lastUpdated} className="ml-1" />
    </span>
  );
}
