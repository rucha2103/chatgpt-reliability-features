export interface KnownSource {
  source: string;
  url: string;
  patterns: RegExp[];
}

/** Trusted outlet homepages used when model URLs fail verification. */
export const KNOWN_SOURCES: KnownSource[] = [
  {
    source: "The New York Times",
    url: "https://www.nytimes.com/",
    patterns: [/new york times/i, /nytimes/i, /\bnyt\b/i],
  },
  {
    source: "BBC News",
    url: "https://www.bbc.com/news",
    patterns: [/bbc news/i, /\bbbc\b/i],
  },
  {
    source: "Reuters",
    url: "https://www.reuters.com/",
    patterns: [/reuters/i],
  },
  {
    source: "Al Jazeera",
    url: "https://www.aljazeera.com/",
    patterns: [/al jazeera/i, /aljazeera/i],
  },
  {
    source: "The Guardian",
    url: "https://www.theguardian.com/international",
    patterns: [/the guardian/i, /\bguardian\b/i],
  },
  {
    source: "Associated Press",
    url: "https://apnews.com/",
    patterns: [/associated press/i, /\bap news\b/i, /\bapnews\b/i],
  },
  {
    source: "U.S. Department of State",
    url: "https://www.state.gov/",
    patterns: [/u\.?s\.? department of state/i, /state\.gov/i],
  },
  {
    source: "Iran Ministry of Foreign Affairs",
    url: "https://www.mfa.gov.ir/",
    patterns: [/iran.*foreign affairs/i, /mfa\.gov\.ir/i],
  },
  {
    source: "CNN",
    url: "https://www.cnn.com/",
    patterns: [/\bcnn\b/i],
  },
  {
    source: "NPR",
    url: "https://www.npr.org/",
    patterns: [/\bnpr\b/i],
  },
];

export function matchKnownSource(label: string): KnownSource | undefined {
  const trimmed = label.trim();
  if (!trimmed) return undefined;
  return KNOWN_SOURCES.find((entry) =>
    entry.patterns.some((p) => p.test(trimmed)),
  );
}

export function matchKnownSourceByHostname(hostname: string): KnownSource | undefined {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return KNOWN_SOURCES.find((entry) => {
    try {
      const knownHost = new URL(entry.url).hostname.replace(/^www\./, "");
      return host === knownHost || host.endsWith(`.${knownHost}`);
    } catch {
      return false;
    }
  });
}
