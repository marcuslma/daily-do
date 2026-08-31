import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialTodoActionState } from "@/lib/todo-action-state";

const todoId = "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1";
const todo = {
  id: todoId,
  description: "Comprar café",
  createdAt: new Date("2026-08-30T12:00:00.000Z"),
  updatedAt: new Date("2026-08-30T12:00:00.000Z"),
  completedAt: null,
};

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  createTodoForUser: vi.fn(),
  updateTodoForUser: vi.fn(),
  setTodoCompletionForUser: vi.fn(),
  deleteTodoForUser: vi.fn(),
  copyOpenTodosFromYesterdayForUser: vi.fn(),
  getCurrentCalendarDay: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("@/lib/session", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/todos", () => ({
  createTodoForUser: mocks.createTodoForUser,
  updateTodoForUser: mocks.updateTodoForUser,
  setTodoCompletionForUser: mocks.setTodoCompletionForUser,
  deleteTodoForUser: mocks.deleteTodoForUser,
  copyOpenTodosFromYesterdayForUser: mocks.copyOpenTodosFromYesterdayForUser,
}));

vi.mock("@/lib/timezone", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/timezone")>();

  return {
    ...actual,
    getCurrentCalendarDay: mocks.getCurrentCalendarDay,
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

describe("todo Server Functions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.getCurrentCalendarDay.mockReturnValue("2026-08-30");
  });

  it("returns a description error before creating an invalid todo", async () => {
    const { createTodo } = await import("@/app/actions/todos");

    const state = await createTodo(initialTodoActionState, new FormData());

    expect(state.fieldErrors?.description).toContain("Informe uma descrição.");
    expect(mocks.createTodoForUser).not.toHaveBeenCalled();
  });

  it("creates a valid todo for the current user and redirects", async () => {
    mocks.createTodoForUser.mockResolvedValue(todo);
    const { createTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "  Comprar café  ");
    formData.set("todoDate", "2026-09-02");

    await expect(createTodo(initialTodoActionState, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mocks.createTodoForUser).toHaveBeenCalledWith(
      "user_1",
      "Comprar café",
      "2026-09-02",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns a date error before creating a todo in the past", async () => {
    const { createTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Comprar café");
    formData.set("todoDate", "2026-08-29");

    await expect(
      createTodo(initialTodoActionState, formData),
    ).resolves.toEqual({
      fieldErrors: { todoDate: ["Escolha hoje ou uma data futura."] },
    });

    expect(mocks.createTodoForUser).not.toHaveBeenCalled();
  });

  it("returns a date error before creating a todo with an impossible calendar date", async () => {
    const { createTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Comprar café");
    formData.set("todoDate", "2026-02-30");

    await expect(
      createTodo(initialTodoActionState, formData),
    ).resolves.toEqual({
      fieldErrors: { todoDate: ["Informe uma data válida."] },
    });

    expect(mocks.createTodoForUser).not.toHaveBeenCalled();
  });

  it("returns a safe message when persistence fails during creation", async () => {
    mocks.createTodoForUser.mockRejectedValue(new Error("database unavailable"));
    const { createTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Comprar café");
    formData.set("todoDate", "2026-08-30");

    await expect(
      createTodo(initialTodoActionState, formData),
    ).resolves.toEqual({
      message: "Não foi possível salvar a tarefa. Tente novamente.",
    });
  });

  it("does not reveal an unowned todo during editing", async () => {
    mocks.updateTodoForUser.mockResolvedValue(null);
    const { updateTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Novo texto");
    formData.set("todoDate", "2026-09-02");

    await expect(
      updateTodo(todoId, initialTodoActionState, formData),
    ).resolves.toEqual({ message: "Tarefa não encontrada." });

    expect(mocks.updateTodoForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      "Novo texto",
      "2026-09-02",
      "2026-08-30",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("does not query a malformed todo identifier during editing", async () => {
    const { updateTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Novo texto");
    formData.set("todoDate", "2026-08-30");

    await expect(
      updateTodo("not-a-uuid", initialTodoActionState, formData),
    ).resolves.toEqual({ message: "Tarefa não encontrada." });

    expect(mocks.updateTodoForUser).not.toHaveBeenCalled();
  });

  it("updates an owned todo and redirects to the dashboard", async () => {
    mocks.updateTodoForUser.mockResolvedValue(todo);
    const { updateTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Novo texto");
    formData.set("todoDate", "2026-09-02");

    await expect(
      updateTodo(todoId, initialTodoActionState, formData),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.updateTodoForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      "Novo texto",
      "2026-09-02",
      "2026-08-30",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("changes completion only for the current user", async () => {
    mocks.setTodoCompletionForUser.mockResolvedValue({
      ...todo,
      completedAt: new Date("2026-08-30T13:00:00.000Z"),
    });
    const { toggleTodo } = await import("@/app/actions/todos");

    await toggleTodo(todoId, true);

    expect(mocks.setTodoCompletionForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      true,
      "2026-08-30",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("does not revalidate when a historical todo cannot be completed", async () => {
    mocks.setTodoCompletionForUser.mockResolvedValue(null);
    const { toggleTodo } = await import("@/app/actions/todos");

    await toggleTodo(todoId, true);

    expect(mocks.setTodoCompletionForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      true,
      "2026-08-30",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("deletes an owned occurrence from the current day", async () => {
    mocks.deleteTodoForUser.mockResolvedValue(todo);
    const { deleteTodo } = await import("@/app/actions/todos");

    await deleteTodo(todoId);

    expect(mocks.deleteTodoForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      "2026-08-30",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("does not revalidate when a historical todo cannot be deleted", async () => {
    mocks.deleteTodoForUser.mockResolvedValue(null);
    const { deleteTodo } = await import("@/app/actions/todos");

    await deleteTodo(todoId);

    expect(mocks.deleteTodoForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      "2026-08-30",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("ignores malformed todo identifiers before checking completion", async () => {
    const { toggleTodo } = await import("@/app/actions/todos");

    await toggleTodo("not-a-uuid", true);

    expect(mocks.setTodoCompletionForUser).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("ignores non-boolean completion values", async () => {
    const { toggleTodo } = await import("@/app/actions/todos");

    await toggleTodo(todoId, "true" as unknown as boolean);

    expect(mocks.setTodoCompletionForUser).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("ignores malformed todo identifiers before deleting", async () => {
    const { deleteTodo } = await import("@/app/actions/todos");

    await deleteTodo("not-a-uuid");

    expect(mocks.deleteTodoForUser).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("redirects an unauthenticated sync request before querying todos", async () => {
    mocks.requireSession.mockRejectedValueOnce(new Error("NEXT_REDIRECT"));
    const { synchronizePendingTodos } = await import("@/app/actions/todos");

    await expect(
      synchronizePendingTodos({}, new FormData()),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.copyOpenTodosFromYesterdayForUser).not.toHaveBeenCalled();
  });

  it("synchronizes yesterday's open todos for the current user", async () => {
    mocks.copyOpenTodosFromYesterdayForUser.mockResolvedValue(2);
    const { synchronizePendingTodos } = await import("@/app/actions/todos");

    await expect(
      synchronizePendingTodos({}, new FormData()),
    ).resolves.toEqual({
      message: "2 tarefas pendentes sincronizadas.",
      status: "success",
    });

    expect(mocks.copyOpenTodosFromYesterdayForUser).toHaveBeenCalledWith(
      "user_1",
      "2026-08-30",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("reports when there are no pending todos from yesterday", async () => {
    mocks.copyOpenTodosFromYesterdayForUser.mockResolvedValue(0);
    const { synchronizePendingTodos } = await import("@/app/actions/todos");

    await expect(
      synchronizePendingTodos({}, new FormData()),
    ).resolves.toEqual({
      message: "Nenhuma tarefa pendente de ontem para copiar.",
      status: "success",
    });
  });

  it("returns a safe message when pending todo synchronization fails", async () => {
    mocks.copyOpenTodosFromYesterdayForUser.mockRejectedValue(
      new Error("database unavailable"),
    );
    const { synchronizePendingTodos } = await import("@/app/actions/todos");

    await expect(
      synchronizePendingTodos({}, new FormData()),
    ).resolves.toEqual({
      message: "Não foi possível sincronizar as tarefas pendentes. Tente novamente.",
      status: "error",
    });

    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
