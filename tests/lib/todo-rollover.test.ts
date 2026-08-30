import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const client = {
    query: vi.fn(),
    release: vi.fn(),
  };

  return {
    client,
    connect: vi.fn(),
  };
});

vi.mock("@/lib/db", () => ({
  db: {
    connect: mocks.connect,
  },
}));

describe("daily todo rollover", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.connect.mockResolvedValue(mocks.client);
  });

  it("creates only the missing child occurrences through the target day", async () => {
    mocks.client.query
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ earliestTodoDate: "2026-08-28" }] })
      .mockResolvedValueOnce({ rows: [{ id: "todo_29" }] })
      .mockResolvedValueOnce({ rows: [{ id: "todo_30" }] })
      .mockResolvedValueOnce({ rows: [{ id: "todo_31" }] })
      .mockResolvedValueOnce(undefined);

    const { rollOverOpenTodosThroughDate } = await import("@/lib/todos");

    await expect(
      rollOverOpenTodosThroughDate("2026-08-31"),
    ).resolves.toBe(3);

    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("ON CONFLICT (previous_todo_id) DO NOTHING"),
      ["2026-08-28", "2026-08-29"],
    );
    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("ON CONFLICT (previous_todo_id) DO NOTHING"),
      ["2026-08-29", "2026-08-30"],
    );
    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("ON CONFLICT (previous_todo_id) DO NOTHING"),
      ["2026-08-30", "2026-08-31"],
    );
    expect(mocks.client.query).toHaveBeenCalledWith("COMMIT");
    expect(mocks.client.release).toHaveBeenCalledOnce();
  });

  it("commits and releases the client when no open occurrence predates the target", async () => {
    mocks.client.query
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ earliestTodoDate: null }] })
      .mockResolvedValueOnce(undefined);

    const { rollOverOpenTodosThroughDate } = await import("@/lib/todos");

    await expect(
      rollOverOpenTodosThroughDate("2026-08-31"),
    ).resolves.toBe(0);

    expect(mocks.client.query).toHaveBeenCalledWith("COMMIT");
    expect(mocks.client.release).toHaveBeenCalledOnce();
  });

  it("rolls back and releases the client when an insert fails", async () => {
    mocks.client.query
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ earliestTodoDate: "2026-08-30" }] })
      .mockRejectedValueOnce(new Error("database unavailable"))
      .mockResolvedValueOnce(undefined);

    const { rollOverOpenTodosThroughDate } = await import("@/lib/todos");

    await expect(
      rollOverOpenTodosThroughDate("2026-08-31"),
    ).rejects.toThrow("database unavailable");

    expect(mocks.client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(mocks.client.release).toHaveBeenCalledOnce();
  });
});
