import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  task: vi.fn((definition) => definition),
  rollOverOpenTodosThroughDate: vi.fn(),
}));

vi.mock("@trigger.dev/sdk", () => ({
  schedules: { task: mocks.task },
}));

vi.mock("@/lib/todos", () => ({
  rollOverOpenTodosThroughDate: mocks.rollOverOpenTodosThroughDate,
}));

describe("rollover-open-todos Trigger task", () => {
  it("uses the schedule timestamp to roll over the configured local day", async () => {
    mocks.rollOverOpenTodosThroughDate.mockResolvedValue(2);
    const { rollOverOpenTodos, runRolloverOpenTodos } = await import(
      "@/trigger/rollover-open-todos"
    );

    expect(rollOverOpenTodos).toEqual(
      expect.objectContaining({ id: "rollover-open-todos" }),
    );
    expect(mocks.task).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "rollover-open-todos",
        cron: {
          pattern: "0 0 * * *",
          timezone: "America/Sao_Paulo",
          environments: ["STAGING", "PRODUCTION"],
        },
      }),
    );

    await expect(
      runRolloverOpenTodos({
        timestamp: new Date("2026-08-31T03:00:00.000Z"),
      }),
    ).resolves.toEqual({ carriedOver: 2, targetDay: "2026-08-31" });

    expect(mocks.rollOverOpenTodosThroughDate).toHaveBeenCalledWith(
      "2026-08-31",
    );
  });
});
