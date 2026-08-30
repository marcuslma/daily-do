import { afterEach, describe, expect, it, vi } from "vitest";

describe("getRequiredServerEnv", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns the configured server-only value", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example.test/daily_do");
    const { getRequiredServerEnv } = await import("@/lib/env");

    expect(getRequiredServerEnv("DATABASE_URL")).toBe(
      "postgresql://example.test/daily_do",
    );
  });

  it("rejects a blank required value before it reaches a service", async () => {
    vi.stubEnv("RESEND_API_KEY", " ");
    const { getRequiredServerEnv } = await import("@/lib/env");

    expect(() => getRequiredServerEnv("RESEND_API_KEY")).toThrow(
      "Missing required environment variable: RESEND_API_KEY",
    );
  });
});
