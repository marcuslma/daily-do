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
        todoDate="2026-08-30"
        minimumTodoDate="2026-08-30"
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
        todoDate="2026-09-02"
        minimumTodoDate="2026-08-30"
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

  it("renders the scheduled date with the current-day minimum", () => {
    render(
      <TodoForm
        action={saveTodo}
        description=""
        todoDate="2026-09-02"
        minimumTodoDate="2026-08-30"
        submitIcon="create"
        submitLabel="Criar tarefa"
      />,
    );

    expect(screen.getByLabelText("Data")).toHaveAttribute("name", "todoDate");
    expect(screen.getByLabelText("Data")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Data")).toHaveAttribute("min", "2026-08-30");
    expect(screen.getByLabelText("Data")).toHaveValue("2026-09-02");
  });

  it("matches the native date picker color scheme to the selected theme", () => {
    render(
      <TodoForm
        action={saveTodo}
        description=""
        todoDate="2026-09-02"
        minimumTodoDate="2026-08-30"
        submitIcon="create"
        submitLabel="Criar tarefa"
      />,
    );

    expect(screen.getByLabelText("Data")).toHaveClass(
      "[color-scheme:light]",
      "group-data-[theme=dark]:[color-scheme:dark]",
    );
  });

  it("limits the editable description to 500 characters", () => {
    render(
      <TodoForm
        action={saveTodo}
        description=""
        todoDate="2026-08-30"
        minimumTodoDate="2026-08-30"
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
