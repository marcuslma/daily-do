import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoList } from "@/components/todos/todo-list";

vi.mock("@/app/actions/todos", () => ({
  toggleTodo: vi.fn(),
}));

describe("TodoList", () => {
  it("shows a completed todo as checked, dated, and struck through", () => {
    render(
      <TodoList
        todos={[
          {
            id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1",
            description: "Comprar café",
            createdAt: new Date("2026-08-29T12:00:00.000Z"),
            updatedAt: new Date("2026-08-30T12:00:00.000Z"),
            completedAt: new Date("2026-08-30T12:00:00.000Z"),
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Reabrir: Comprar café" }),
    ).toBeChecked();
    expect(screen.getByText("Comprar café")).toHaveClass("line-through");
    expect(screen.getByText(/Concluída em/)).toBeInTheDocument();
  });
});
