export function isStaleCitation(lastUpdated: string): boolean {
  if (!lastUpdated) return false;
  const parsed = new Date(lastUpdated);
  if (Number.isNaN(parsed.getTime())) return false;
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  return Date.now() - parsed.getTime() > oneYearMs;
}
