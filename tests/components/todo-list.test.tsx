import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoList } from "@/components/todos/todo-list";

vi.mock("@/app/actions/todos", () => ({
  toggleTodo: vi.fn(),
}));

describe("TodoList", () => {
  it("keeps historical occurrences readable without interactive controls", () => {
    render(
      <TodoList
        currentDay="2026-08-30"
        days={[
          {
            date: "2026-08-30",
            todos: [
              {
                id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1",
                description: "Comprar café",
                todoDate: "2026-08-30",
                originalCreatedAt: new Date("2026-08-28T12:00:00.000Z"),
                carryoverCount: 0,
                previousTodoId: null,
                createdAt: new Date("2026-08-30T12:00:00.000Z"),
                updatedAt: new Date("2026-08-30T12:00:00.000Z"),
                completedAt: new Date("2026-08-30T12:00:00.000Z"),
              },
            ],
          },
          {
            date: "2026-08-29",
            todos: [
              {
                id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d2",
                description: "Revisar projeto",
                todoDate: "2026-08-29",
                originalCreatedAt: new Date("2026-08-27T12:00:00.000Z"),
                carryoverCount: 2,
                previousTodoId: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1",
                createdAt: new Date("2026-08-29T12:00:00.000Z"),
                updatedAt: new Date("2026-08-29T12:00:00.000Z"),
                completedAt: null,
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Reabrir: Comprar café" }),
    ).toBeChecked();
    expect(screen.getByText("Comprar café")).toHaveClass("line-through");
    expect(screen.getByText("Somente leitura")).toBeInTheDocument();
    expect(screen.getByText("Adiada 2×")).toBeInTheDocument();
    expect(screen.getAllByText(/Criada em/)).toHaveLength(2);
    expect(
      screen.queryByRole("checkbox", { name: "Concluir: Revisar projeto" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Editar: Revisar projeto" }),
    ).not.toBeInTheDocument();
  });

  it("shows every supplied day even when it has no occurrences", () => {
    render(
      <TodoList
        currentDay="2026-08-30"
        days={[{ date: "2026-08-29", todos: [] }]}
      />,
    );

    expect(screen.getByText("Nenhuma tarefa registrada.")).toBeInTheDocument();
    expect(screen.getByText("Somente leitura")).toBeInTheDocument();
  });
});
