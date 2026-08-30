import { afterEach, describe, expect, it } from "vitest";

const testTimeZone = "America/Sao_Paulo";

afterEach(() => {
  process.env.TZ = testTimeZone;
});

describe("timezone helpers", () => {
  it("derives the São Paulo calendar day instead of the UTC date", async () => {
    process.env.TZ = testTimeZone;
    const { calendarDayAt } = await import("@/lib/timezone");

    expect(calendarDayAt(new Date("2026-08-31T02:30:00.000Z"))).toBe(
      "2026-08-30",
    );
  });

  it("rejects an invalid configured timezone", async () => {
    process.env.TZ = "Mars/Olympus";
    const { getAppTimeZone } = await import("@/lib/timezone");

    expect(() => getAppTimeZone()).toThrow("Invalid timezone: Mars/Olympus");
  });

  it("builds descending calendar days across a month boundary", async () => {
    const { listCalendarDaysEndingOn } = await import("@/lib/timezone");

    expect(listCalendarDaysEndingOn("2026-09-01", 3)).toEqual([
      "2026-09-01",
      "2026-08-31",
      "2026-08-30",
    ]);
  });

  it("clamps dashboard history input to a safe user history range", async () => {
    const { getDashboardDayCount } = await import("@/lib/timezone");

    expect(getDashboardDayCount("six", 12)).toBe(3);
    expect(getDashboardDayCount("1", 12)).toBe(3);
    expect(getDashboardDayCount("15", 12)).toBe(12);
    expect(getDashboardDayCount(["6", "9"], 12)).toBe(3);
  });

  it("formats real timestamps in the configured timezone", async () => {
    const { formatTimestamp } = await import("@/lib/timezone");

    expect(formatTimestamp(new Date("2026-08-31T02:30:00.000Z"))).toContain(
      "30 de ago. de 2026",
    );
  });
});
