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

describe("manual pending todo synchronization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.connect.mockResolvedValue(mocks.client);
  });

  it("copies only yesterday's open todos for the requested user", async () => {
    mocks.client.query
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ id: "todo_31_a" }, { id: "todo_31_b" }] })
      .mockResolvedValueOnce(undefined);

    const { copyOpenTodosFromYesterdayForUser } = await import("@/lib/todos");

    await expect(
      copyOpenTodosFromYesterdayForUser("user_1", "2026-08-31"),
    ).resolves.toBe(2);

    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE user_id = $1"),
      ["user_1", "2026-08-30", "2026-08-31"],
    );
    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("todo_date = $2::date"),
      ["user_1", "2026-08-30", "2026-08-31"],
    );
    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("AND completed_at IS NULL"),
      ["user_1", "2026-08-30", "2026-08-31"],
    );
    expect(mocks.client.query).toHaveBeenCalledWith("COMMIT");
    expect(mocks.client.release).toHaveBeenCalledOnce();
  });

  it("does not copy an already synchronized todo again", async () => {
    mocks.client.query
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ id: "todo_31" }] })
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce(undefined);

    const { copyOpenTodosFromYesterdayForUser } = await import("@/lib/todos");

    await expect(
      copyOpenTodosFromYesterdayForUser("user_1", "2026-08-31"),
    ).resolves.toBe(1);
    await expect(
      copyOpenTodosFromYesterdayForUser("user_1", "2026-08-31"),
    ).resolves.toBe(0);

    expect(mocks.client.query).toHaveBeenCalledWith(
      expect.stringContaining("ON CONFLICT (previous_todo_id) DO NOTHING"),
      ["user_1", "2026-08-30", "2026-08-31"],
    );
  });

  it("rolls back and releases the client when copying fails", async () => {
    mocks.client.query
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("database unavailable"))
      .mockResolvedValueOnce(undefined);

    const { copyOpenTodosFromYesterdayForUser } = await import("@/lib/todos");

    await expect(
      copyOpenTodosFromYesterdayForUser("user_1", "2026-08-31"),
    ).rejects.toThrow("database unavailable");

    expect(mocks.client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(mocks.client.release).toHaveBeenCalledOnce();
  });
});
