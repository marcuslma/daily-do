import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoForm } from "@/components/todos/todo-form";

const saveTodo = vi.fn(async () => ({}));
const todoSubmitActions = [
  { submitIcon: "create", submitLabel: "Criar tarefa", iconName: "plus" },
  { submitIcon: "save", submitLabel: "Salvar alterações", iconName: "save" },
] as const;

describe("TodoForm", () => {
  it.each(todoSubmitActions)(
    "shows the $iconName icon for $submitLabel",
    ({ iconName, submitIcon, submitLabel }) => {
    render(
      <TodoForm
        action={saveTodo}
        description=""
        submitIcon={submitIcon}
        submitLabel={submitLabel}
      />,
    );

    expect(
      screen
        .getByRole("button", { name: submitLabel })
        .querySelector("svg.lucide-" + iconName),
    ).toBeInTheDocument();
    },
  );

  it("renders the existing description when editing", () => {
    render(
      <TodoForm
        action={saveTodo}
        description="Comprar café"
        submitIcon="save"
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
      <TodoForm
        action={saveTodo}
        description=""
        submitIcon="create"
        submitLabel="Criar tarefa"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Descrição" })).toHaveAttribute(
      "maxlength",
      "500",
    );
  });
});
