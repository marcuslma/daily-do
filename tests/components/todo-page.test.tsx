import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodoPage } from "@/components/todos/todo-page";

describe("TodoPage", () => {
  it("keeps the editor near the top on small screens", () => {
    render(
      <TodoPage backHref="/dashboard" title="Nova tarefa">
        <form>
          <label htmlFor="description">Descrição</label>
          <textarea id="description" />
        </form>
      </TodoPage>,
    );

    expect(screen.getByRole("main")).toHaveClass(
      "min-h-dvh",
      "items-start",
      "sm:items-center",
    );
  });
});
