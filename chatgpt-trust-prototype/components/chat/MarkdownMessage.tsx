import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { Citation } from "@/types/chat";
import { CitationSourcesList } from "@/components/features/TemporalCitations/CitationSourcesList";
import {
  hasTemporalContent,
  mergeTemporalSources,
} from "@/lib/citations/mergeTemporalSources";
import { stripTemporalFromBody } from "@/lib/citations/stripTemporalFromBody";

interface MarkdownMessageProps {
  content: string;
  messageId: string;
  citations?: Citation[];
}

function createMarkdownComponents(messageId: string): Components {
  return {
    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    h1: ({ children }) => (
      <h1 className="mb-3 mt-4 text-xl font-semibold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-4 text-lg font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-3 text-base font-semibold">{children}</h3>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-400 underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-3 border-l-2 border-border-chat pl-4 text-text-muted">
        {children}
      </blockquote>
    ),
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className ?? "");
      const codeText = String(children).replace(/\n$/, "");

      if (!match) {
        return (
          <code className="rounded bg-[#2f2f2f] px-1.5 py-0.5 font-mono text-sm">
            {children}
          </code>
        );
      }

      return (
        <pre className="my-3 overflow-x-auto rounded-lg border border-border-chat bg-[#1a1a1a] p-4 font-mono text-sm leading-relaxed text-text-primary">
          <code>{codeText}</code>
        </pre>
      );
    },
    pre: ({ children }) => <>{children}</>,
  };
}

export function MarkdownMessage({
  content,
  messageId,
  citations,
}: MarkdownMessageProps) {
  if (!content) return null;

  const merged = mergeTemporalSources(content, citations ?? []);
  const temporal = hasTemporalContent(content, merged);
  const bodyContent = temporal ? stripTemporalFromBody(content) : content;

  return (
    <div className="markdown-body text-[15px] leading-7 text-text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={createMarkdownComponents(messageId)}
      >
        {bodyContent}
      </ReactMarkdown>

      {temporal && merged.length > 0 ? (
        <CitationSourcesList citations={merged} />
      ) : null}
    </div>
  );
}
