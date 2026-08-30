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
}));

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

    await expect(createTodo(initialTodoActionState, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mocks.createTodoForUser).toHaveBeenCalledWith("user_1", "Comprar café");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns a safe message when persistence fails during creation", async () => {
    mocks.createTodoForUser.mockRejectedValue(new Error("database unavailable"));
    const { createTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Comprar café");

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

    await expect(
      updateTodo(todoId, initialTodoActionState, formData),
    ).resolves.toEqual({ message: "Tarefa não encontrada." });

    expect(mocks.updateTodoForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      "Novo texto",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("does not query a malformed todo identifier during editing", async () => {
    const { updateTodo } = await import("@/app/actions/todos");
    const formData = new FormData();
    formData.set("description", "Novo texto");

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

    await expect(
      updateTodo(todoId, initialTodoActionState, formData),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.updateTodoForUser).toHaveBeenCalledWith(
      "user_1",
      todoId,
      "Novo texto",
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
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
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
});
