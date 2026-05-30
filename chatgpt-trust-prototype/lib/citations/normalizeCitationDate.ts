/** Normalize model date strings to YYYY-MM-DD for display. */
export function normalizeCitationDate(raw: string | undefined): string {
  if (!raw?.trim()) return "";

  const value = raw.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const iso = Date.parse(value);
  if (!Number.isNaN(iso)) {
    return new Date(iso).toISOString().slice(0, 10);
  }

  const yearMonth = /^(\d{4})-(\d{1,2})$/.exec(value);
  if (yearMonth) {
    const month = yearMonth[2].padStart(2, "0");
    return `${yearMonth[1]}-${month}-01`;
  }

  const yearOnly = /^(\d{4})$/.exec(value);
  if (yearOnly) return `${yearOnly[1]}-01-01`;

  return "";
}
