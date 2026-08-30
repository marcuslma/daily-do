import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "@/app/dashboard/page";

const todo = {
  id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1",
  description: "Comprar café",
  createdAt: new Date("2026-08-30T12:00:00.000Z"),
  updatedAt: new Date("2026-08-30T12:00:00.000Z"),
  completedAt: null,
};

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  listTodosForUser: vi.fn(),
  signOut: vi.fn(),
  toggleTodo: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/todos", () => ({
  listTodosForUser: mocks.listTodosForUser,
}));

vi.mock("@/app/actions/auth", () => ({
  signOut: mocks.signOut,
}));

vi.mock("@/app/actions/todos", () => ({
  toggleTodo: mocks.toggleTodo,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({
      user: {
        id: "user_1",
        name: "Ana",
      },
    });
    mocks.listTodosForUser.mockResolvedValue([todo]);
  });

  it("shows the current user's todo list and create link", async () => {
    render(await DashboardPage());

    expect(screen.getByRole("link", { name: "Nova tarefa" })).toHaveAttribute(
      "href",
      "/dashboard/todos/new",
    );
    expect(screen.getByText("Comprar café")).toBeInTheDocument();
    expect(mocks.listTodosForUser).toHaveBeenCalledWith("user_1");
    expect(
      screen.queryByText("Sua lista de tarefas será construída na próxima etapa."),
    ).not.toBeInTheDocument();
  });
});
