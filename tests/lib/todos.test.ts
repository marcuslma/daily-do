import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: mocks.query,
  },
}));

const openTodo = {
  id: "todo_open",
  description: "Comprar café",
  todoDate: "2026-08-30",
  originalCreatedAt: new Date("2026-08-28T12:00:00.000Z"),
  carryoverCount: 2,
  previousTodoId: "todo_yesterday",
  createdAt: new Date("2026-08-30T12:00:00.000Z"),
  updatedAt: new Date("2026-08-30T12:00:00.000Z"),
  completedAt: null,
};

const completedTodo = {
  id: "todo_done",
  description: "Ler um capítulo",
  todoDate: "2026-08-29",
  originalCreatedAt: new Date("2026-08-29T12:00:00.000Z"),
  carryoverCount: 0,
  previousTodoId: null,
  createdAt: new Date("2026-08-29T12:00:00.000Z"),
  updatedAt: new Date("2026-08-30T13:00:00.000Z"),
  completedAt: new Date("2026-08-30T13:00:00.000Z"),
};

describe("todoDescriptionSchema", () => {
  it("trims a valid task description", async () => {
    const { todoDescriptionSchema } = await import("@/lib/todo-schemas");

    expect(todoDescriptionSchema.parse({ description: "  Comprar café  " })).toEqual({
      description: "Comprar café",
    });
  });

  it("rejects an empty task description", async () => {
    const { todoDescriptionSchema } = await import("@/lib/todo-schemas");

    const result = todoDescriptionSchema.safeParse({ description: "   " });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.description).toContain(
        "Informe uma descrição.",
      );
    }
  });

  it("rejects a task description longer than 500 characters", async () => {
    const { todoDescriptionSchema } = await import("@/lib/todo-schemas");

    const result = todoDescriptionSchema.safeParse({
      description: "a".repeat(501),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.description).toContain(
        "Descrição muito longa.",
      );
    }
  });
});

describe("todo data layer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("lists only one user's occurrences inside the requested daily range", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [openTodo] });
    const { listTodosForUser } = await import("@/lib/todos");

    await expect(
      listTodosForUser("user_1", "2026-08-28", "2026-08-30"),
    ).resolves.toEqual([openTodo]);
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("todo_date >= $2 AND todo_date <= $3"),
      ["user_1", "2026-08-28", "2026-08-30"],
    );
  });

  it("finds the earliest date with an occurrence for the user", async () => {
    mocks.query.mockResolvedValueOnce({
      rows: [{ earliestTodoDate: "2026-08-28" }],
    });
    const { getEarliestTodoDateForUser } = await import("@/lib/todos");

    await expect(getEarliestTodoDateForUser("user_1")).resolves.toBe(
      "2026-08-28",
    );
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining('MIN(todo_date)::text AS "earliestTodoDate"'),
      ["user_1"],
    );
  });

  it("returns null when the user has no occurrences", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [{ earliestTodoDate: null }] });
    const { getEarliestTodoDateForUser } = await import("@/lib/todos");

    await expect(getEarliestTodoDateForUser("user_1")).resolves.toBeNull();
  });

  it("creates a todo for the provided user and calendar day", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [openTodo] });
    const { createTodoForUser } = await import("@/lib/todos");

    await expect(
      createTodoForUser("user_1", "Comprar café", "2026-08-30"),
    ).resolves.toEqual(openTodo);
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO todo"),
      ["user_1", "Comprar café", "2026-08-30"],
    );
  });

  it("finds a todo only when it belongs to the provided user", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [openTodo] });
    const { getTodoForUser } = await import("@/lib/todos");

    await expect(getTodoForUser("user_1", "todo_open")).resolves.toEqual(
      openTodo,
    );
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = $1 AND user_id = $2"),
      ["todo_open", "user_1"],
    );
  });

  it("does not update an occurrence outside the current day", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [] });
    const { updateTodoForUser } = await import("@/lib/todos");

    await expect(
      updateTodoForUser(
        "user_1",
        "todo_open",
        "Novo texto",
        "2026-08-30",
      ),
    ).resolves.toBeNull();
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("todo_date = $4"),
      ["todo_open", "user_1", "Novo texto", "2026-08-30"],
    );
  });

  it("updates completion only for an occurrence on the current day", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [completedTodo] });
    const { setTodoCompletionForUser } = await import("@/lib/todos");

    await expect(
      setTodoCompletionForUser("user_1", "todo_done", true, "2026-08-30"),
    ).resolves.toEqual(completedTodo);
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("todo_date = $4"),
      ["todo_done", "user_1", true, "2026-08-30"],
    );
  });

  it("preserves requested empty dates when grouping occurrences", async () => {
    const { groupTodosByDay } = await import("@/lib/todos");

    expect(
      groupTodosByDay(["2026-08-30", "2026-08-29"], [openTodo]),
    ).toEqual([
      { date: "2026-08-30", todos: [openTodo] },
      { date: "2026-08-29", todos: [] },
    ]);
  });
});
