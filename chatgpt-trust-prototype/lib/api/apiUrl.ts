/**
 * API base URL for browser fetch calls.
 * - Single Netlify site (default): leave unset → same-origin `/api/...`
 * - Split sites: set NEXT_PUBLIC_API_BASE_URL to your API Netlify URL
 */
export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}${normalizedPath}`;
}
