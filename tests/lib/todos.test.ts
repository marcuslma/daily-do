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
  createdAt: new Date("2026-08-30T12:00:00.000Z"),
  updatedAt: new Date("2026-08-30T12:00:00.000Z"),
  completedAt: null,
};

const completedTodo = {
  id: "todo_done",
  description: "Ler um capítulo",
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
    vi.clearAllMocks();
  });

  it("lists only the current user's open tasks before completed tasks", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [openTodo, completedTodo] });
    const { listTodosForUser } = await import("@/lib/todos");

    await expect(listTodosForUser("user_1")).resolves.toEqual([
      openTodo,
      completedTodo,
    ]);
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE user_id = $1"),
      ["user_1"],
    );
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("ORDER BY completed_at IS NOT NULL ASC, created_at DESC"),
      ["user_1"],
    );
  });

  it("creates a todo for the provided user", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [openTodo] });
    const { createTodoForUser } = await import("@/lib/todos");

    await expect(createTodoForUser("user_1", "Comprar café")).resolves.toEqual(
      openTodo,
    );
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO todo"),
      ["user_1", "Comprar café"],
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

  it("returns null when an update cannot find an owned todo", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [] });
    const { updateTodoForUser } = await import("@/lib/todos");

    await expect(
      updateTodoForUser("user_1", "todo_missing", "Novo texto"),
    ).resolves.toBeNull();
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = $1 AND user_id = $2"),
      ["todo_missing", "user_1", "Novo texto"],
    );
  });

  it("updates completion only for the provided user", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [completedTodo] });
    const { setTodoCompletionForUser } = await import("@/lib/todos");

    await expect(
      setTodoCompletionForUser("user_1", "todo_done", true),
    ).resolves.toEqual(completedTodo);
    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = $1 AND user_id = $2"),
      ["todo_done", "user_1", true],
    );
  });
});
