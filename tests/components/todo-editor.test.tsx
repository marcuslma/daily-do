import { beforeEach, describe, expect, it, vi } from "vitest";

const todoId = "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1";

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  getTodoForUser: vi.fn(),
  getCurrentCalendarDay: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/todos", () => ({
  getTodoForUser: mocks.getTodoForUser,
}));

vi.mock("@/lib/timezone", () => ({
  getCurrentCalendarDay: mocks.getCurrentCalendarDay,
}));

vi.mock("@/app/actions/todos", () => ({
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
}));

vi.mock("@/components/todos/todo-form", () => ({
  TodoForm: () => null,
}));

vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
}));

describe("EditTodoEditor", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.getCurrentCalendarDay.mockReturnValue("2026-08-30");
    mocks.notFound.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
  });

  it("does not render an owned occurrence from a previous day", async () => {
    mocks.getTodoForUser.mockResolvedValue({
      id: todoId,
      description: "Comprar café",
      todoDate: "2026-08-29",
      originalCreatedAt: new Date("2026-08-29T12:00:00.000Z"),
      carryoverCount: 0,
      previousTodoId: null,
      createdAt: new Date("2026-08-29T12:00:00.000Z"),
      updatedAt: new Date("2026-08-29T12:00:00.000Z"),
      completedAt: null,
    });
    const { EditTodoEditor } = await import("@/components/todos/todo-editor");

    await expect(EditTodoEditor({ todoId })).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.getTodoForUser).toHaveBeenCalledWith("user_1", todoId);
    expect(mocks.notFound).toHaveBeenCalledOnce();
  });
});
