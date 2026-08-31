import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TodoAgenda, TodoList } from "@/components/todos/todo-list";

const mocks = vi.hoisted(() => ({
  deleteTodo: vi.fn(),
  synchronizePendingTodos: vi.fn(),
  toggleTodo: vi.fn(),
}));

vi.mock("@/app/actions/todos", () => ({
  deleteTodo: mocks.deleteTodo,
  synchronizePendingTodos: mocks.synchronizePendingTodos,
  toggleTodo: mocks.toggleTodo,
}));

describe("TodoList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses Lucide icons for the current todo edit and delete controls", () => {
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
                completedAt: null,
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen
        .getByRole("link", { name: "Editar: Comprar café" })
        .querySelector("svg.lucide-pencil"),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("button", { name: "Excluir: Comprar café" })
        .querySelector("svg.lucide-trash-2"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editar: Comprar café" })).toHaveAttribute(
      "title",
      "Editar: Comprar café",
    );
    expect(
      screen.getByRole("button", { name: "Excluir: Comprar café" }),
    ).toHaveAttribute("title", "Excluir: Comprar café");
  });

  it("moves current todo controls below its content on small screens", () => {
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
                completedAt: null,
              },
            ],
          },
        ]}
      />,
    );

    const todoItem = screen.getByText("Comprar café").closest("li");
    const actionBar = screen
      .getByRole("button", { name: "Excluir: Comprar café" })
      .closest("form")?.parentElement;

    expect(todoItem).toHaveClass("flex-wrap", "sm:flex-nowrap");
    expect(actionBar).toHaveClass("w-full", "sm:w-auto", "justify-end");
  });

  it("keeps the compact synchronization control in the current day header", () => {
    render(
      <TodoList
        currentDay="2026-08-30"
        days={[
          { date: "2026-08-30", todos: [] },
          { date: "2026-08-29", todos: [] },
        ]}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Sincronizar pendentes",
    });
    const currentHeader = screen.getByText("Hoje").closest("header");
    const historicalHeader = screen.getByText("Somente leitura").closest("header");

    expect(currentHeader).toContainElement(button);
    expect(currentHeader?.firstElementChild).toHaveClass(
      "flex-row",
      "items-center",
      "justify-between",
    );
    expect(button).toHaveClass("size-8");
    expect(historicalHeader).not.toContainElement(button);
    expect(historicalHeader).toHaveClass("flex-col", "sm:flex-row");
  });

  it("keeps synchronization feedback with the current day sync control", async () => {
    let resolveAction: (state: {
      message: string;
      status: "success";
    }) => void;
    mocks.synchronizePendingTodos.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(
      <TodoList
        currentDay="2026-08-30"
        days={[{ date: "2026-08-30", todos: [] }]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    );

    await act(async () => {
      resolveAction!({
        message: "2 tarefas pendentes sincronizadas.",
        status: "success",
      });
    });

    await waitFor(() => {
      const status = screen.getByRole("status");
      const syncButton = screen.getByRole("button", {
        name: "Sincronizar pendentes",
      });

      expect(status).toHaveTextContent("2 tarefas pendentes sincronizadas.");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status.parentElement).toContainElement(syncButton);
    });
  });

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
    expect(
      screen.getByRole("button", { name: "Excluir: Comprar café" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Excluir: Revisar projeto" }),
    ).not.toBeInTheDocument();
  });

  it("allows scheduled occurrences to be edited or deleted without a completion checkbox", () => {
    render(
      <TodoList
        currentDay="2026-08-30"
        days={[
          {
            date: "2026-08-31",
            todos: [
              {
                id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d3",
                description: "Revisar projeto",
                todoDate: "2026-08-31",
                originalCreatedAt: new Date("2026-08-29T12:00:00.000Z"),
                carryoverCount: 0,
                previousTodoId: null,
                createdAt: new Date("2026-08-29T12:00:00.000Z"),
                updatedAt: new Date("2026-08-29T12:00:00.000Z"),
                completedAt: null,
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText("Agendada")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Editar: Revisar projeto" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Excluir: Revisar projeto" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Concluir: Revisar projeto" }),
    ).not.toBeInTheDocument();
  });

  it("keeps pending synchronization reachable from the empty scheduled agenda", () => {
    render(<TodoAgenda currentDay="2026-08-30" days={[]} />);

    expect(
      screen.getByText("Nenhuma tarefa agendada a partir de hoje."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    ).toBeInTheDocument();
  });

  it("keeps pending synchronization reachable from an agenda with only future days", () => {
    render(
      <TodoAgenda
        currentDay="2026-08-30"
        days={[
          {
            date: "2026-08-31",
            todos: [],
          },
        ]}
      />,
    );

    expect(screen.getByText("Agendada")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    ).toBeInTheDocument();
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
