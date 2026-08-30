import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoForm } from "@/components/todos/todo-form";

const saveTodo = vi.fn(async () => ({}));

describe("TodoForm", () => {
  it("renders the existing description when editing", () => {
    render(
      <TodoForm
        action={saveTodo}
        description="Comprar café"
        submitLabel="Salvar alterações"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Descrição" })).toHaveValue(
      "Comprar café",
    );
    expect(
      screen.getByRole("button", { name: "Salvar alterações" }),
    ).toBeInTheDocument();
  });

  it("limits the editable description to 500 characters", () => {
    render(
      <TodoForm action={saveTodo} description="" submitLabel="Criar tarefa" />,
    );

    expect(screen.getByRole("textbox", { name: "Descrição" })).toHaveAttribute(
      "maxlength",
      "500",
    );
  });
});
