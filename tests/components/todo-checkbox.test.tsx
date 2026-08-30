import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoCheckbox } from "@/components/todos/todo-checkbox";

const mocks = vi.hoisted(() => ({
  toggleTodo: vi.fn(),
}));

vi.mock("@/app/actions/todos", () => ({
  toggleTodo: mocks.toggleTodo,
}));

describe("TodoCheckbox", () => {
  it("marks the checkbox and calls the Server Function with the next state", async () => {
    mocks.toggleTodo.mockResolvedValue(undefined);

    render(
      <TodoCheckbox
        completed={false}
        description="Comprar café"
        todoId="8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1"
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Concluir: Comprar café",
    });
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    await waitFor(() => {
      expect(mocks.toggleTodo).toHaveBeenCalledWith(
        "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1",
        true,
      );
    });
  });
});
