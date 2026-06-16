import { format } from 'date-fns';

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return format(date, 'MMM d, yyyy').toUpperCase();
}

const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

export type ParsedDateQuery = { month: number; day: number; year?: number };

/**
 * Parses flexible date strings like "june 10", "10 jun", "11/06" (DD/MM),
 * or "2026-06-11" into a month/day(/year) match target.
 */
export function parseFlexibleDate(query: string): ParsedDateQuery | null {
  const normalized = query.trim().toLowerCase().replace(/(\d+)(st|nd|rd|th)/g, '$1');

  // ISO: yyyy-MM-dd
  let match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  }

  // DD/MM or DD-MM (optionally with year)
  match = normalized.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = match[3] ? normalizeYear(Number(match[3])) : undefined;
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { month, day, year };
    }
    return null;
  }

  // "june 10" or "june 10 2026" / "june 10, 2026"
  match = normalized.match(/^([a-z]+)\.?\s+(\d{1,2})(?:,?\s*(\d{4}))?$/);
  if (match && MONTH_NAMES[match[1]]) {
    return { month: MONTH_NAMES[match[1]], day: Number(match[2]), year: match[3] ? Number(match[3]) : undefined };
  }

  // "10 june" or "10 june 2026"
  match = normalized.match(/^(\d{1,2})\s+([a-z]+)\.?(?:,?\s*(\d{4}))?$/);
  if (match && MONTH_NAMES[match[2]]) {
    return { month: MONTH_NAMES[match[2]], day: Number(match[1]), year: match[3] ? Number(match[3]) : undefined };
  }

  return null;
}

function normalizeYear(year: number): number {
  if (year < 100) return 2000 + year;
  return year;
}

export function dateKeyMatches(entryDate: string, parsed: ParsedDateQuery): boolean {
  const [y, m, d] = entryDate.split('-').map(Number);
  if (parsed.year !== undefined && parsed.year !== y) return false;
  return m === parsed.month && d === parsed.day;
}

export type ReflectionPeriod = { periodId: string; available: boolean };

/**
 * Weekly reflection covers the previous Sunday-Saturday week and is
 * available for the 7 days starting the following Sunday (i.e. all of
 * the current week).
 */
export function getWeeklyReflectionPeriod(now: Date = new Date()): ReflectionPeriod {
  const thisSunday = new Date(now);
  thisSunday.setHours(0, 0, 0, 0);
  thisSunday.setDate(thisSunday.getDate() - thisSunday.getDay());

  const periodSunday = new Date(thisSunday);
  periodSunday.setDate(periodSunday.getDate() - 7);

  return { periodId: format(periodSunday, 'yyyy-MM-dd'), available: true };
}

/**
 * Monthly reflection covers the month that just ended and is available
 * for the 7 days starting on the last day of that month.
 */
export function getMonthlyReflectionPeriod(now: Date = new Date()): ReflectionPeriod {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDayOfThisMonth = new Date(year, month + 1, 0);
  const thisWindowEnd = new Date(lastDayOfThisMonth);
  thisWindowEnd.setDate(thisWindowEnd.getDate() + 7);

  if (today >= lastDayOfThisMonth && today < thisWindowEnd) {
    return { periodId: format(new Date(year, month, 1), 'yyyy-MM'), available: true };
  }

  const lastDayOfPrevMonth = new Date(year, month, 0);
  const prevWindowEnd = new Date(lastDayOfPrevMonth);
  prevWindowEnd.setDate(prevWindowEnd.getDate() + 7);

  if (today >= lastDayOfPrevMonth && today < prevWindowEnd) {
    return { periodId: format(new Date(year, month - 1, 1), 'yyyy-MM'), available: true };
  }

  return { periodId: format(new Date(year, month, 1), 'yyyy-MM'), available: false };
}
