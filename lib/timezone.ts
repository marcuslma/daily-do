export type CalendarDay = string;

export const INITIAL_DASHBOARD_DAY_COUNT = 3;
export const DASHBOARD_DAY_INCREMENT = 3;

function getDateParts(instant: Date, timeZone: string): Record<string, string> {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      timeZone,
      year: "numeric",
    })
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}

function calendarDayToDate(day: CalendarDay): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new Error("Invalid calendar day: " + day);
  }

  return new Date(day + "T12:00:00.000Z");
}

export function getAppTimeZone(): string {
  const timeZone = process.env.TZ?.trim();

  if (!timeZone) {
    throw new Error("Missing required environment variable: TZ");
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
  } catch {
    throw new Error("Invalid timezone: " + timeZone);
  }

  return timeZone;
}

export function calendarDayAt(
  instant: Date,
  timeZone = getAppTimeZone(),
): CalendarDay {
  const parts = getDateParts(instant, timeZone);

  return [parts.year, parts.month, parts.day].join("-");
}

export function getCurrentCalendarDay(): CalendarDay {
  return calendarDayAt(new Date());
}

export function shiftCalendarDay(
  day: CalendarDay,
  amount: number,
): CalendarDay {
  const date = calendarDayToDate(day);
  date.setUTCDate(date.getUTCDate() + amount);

  return date.toISOString().slice(0, 10);
}

export function listCalendarDaysEndingOn(
  endDay: CalendarDay,
  count: number,
): CalendarDay[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("Calendar day count must be a positive integer.");
  }

  return Array.from({ length: count }, (_, index) =>
    shiftCalendarDay(endDay, -index),
  );
}

export function calendarDayDistance(
  startDay: CalendarDay,
  endDay: CalendarDay,
): number {
  const start = calendarDayToDate(startDay).getTime();
  const end = calendarDayToDate(endDay).getTime();

  return Math.round((end - start) / 86_400_000);
}

export function getDashboardDayCount(
  value: string | string[] | undefined,
  maximum: number,
): number {
  const safeMaximum = Math.max(INITIAL_DASHBOARD_DAY_COUNT, maximum);

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return INITIAL_DASHBOARD_DAY_COUNT;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < INITIAL_DASHBOARD_DAY_COUNT) {
    return INITIAL_DASHBOARD_DAY_COUNT;
  }

  return Math.min(parsed, safeMaximum);
}

export function formatCalendarDay(day: CalendarDay): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(calendarDayToDate(day));
}

export function formatTimestamp(instant: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: getAppTimeZone(),
  }).format(instant);
}
