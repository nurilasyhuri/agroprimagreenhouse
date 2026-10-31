const INDONESIAN_MONTHS: Record<string, string> = {
  januari: 'January',
  februari: 'February',
  maret: 'March',
  april: 'April',
  mei: 'May',
  juni: 'June',
  juli: 'July',
  agustus: 'August',
  september: 'September',
  oktober: 'October',
  november: 'November',
  desember: 'December',
};

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Formats a Date object or ISO string to Indonesian format (e.g. "22 Oktober 2026")
 */
export function formatIndonesianDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseIndonesianDate(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  const day = date.getDate();
  const month = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Parses Indonesian date string (e.g. "3 Oktober 2026") into a valid JS Date object.
 */
export function parseIndonesianDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0];
    const month = INDONESIAN_MONTHS[parts[1].toLowerCase()] || parts[1];
    const year = parts[2];
    const parsed = new Date(`${day} ${month} ${year}`);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
}

/**
 * Converts Indonesian date string to ISO 8601 string for Schema.org JSON-LD.
 */
export function toIsoDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return new Date().toISOString();
  if (dateStr instanceof Date) return dateStr.toISOString();
  try {
    return parseIndonesianDate(dateStr).toISOString();
  } catch {
    return new Date().toISOString();
  }
}
