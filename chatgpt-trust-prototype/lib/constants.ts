/**
 * Shared design and app constants for the ChatGPT Trust & Reliability prototype.
 * Used across UI (Phase 02+) and backend (Phase 04+).
 */

/** ChatGPT dark-mode sidebar background */
export const SIDEBAR_BG = "#171717";

/** ChatGPT dark-mode main chat area background */
export const MAIN_BG = "#212121";

/** Subtle border/divider color used in ChatGPT dark UI */
export const BORDER_COLOR = "#2f2f2f";

/** Primary text color */
export const TEXT_PRIMARY = "#ececec";

/** Muted/secondary text color */
export const TEXT_MUTED = "#8e8ea0";

/** Max width for centered chat content (matches ChatGPT) */
export const CHAT_MAX_WIDTH_PX = 768;

/** Sidebar width on desktop */
export const SIDEBAR_WIDTH_PX = 260;

/** Model context window limit — used by Context Sentinel (Phase 09) */
export const TOKEN_LIMIT = 128_000;

/** Warn user when token usage reaches this fraction of TOKEN_LIMIT */
export const SENTINEL_WARN_THRESHOLD = 0.85;

/** Default Groq model — server reads GROQ_MODEL from .env.local */
export const DEFAULT_MODEL = "llama-3.3-70b-versatile";
