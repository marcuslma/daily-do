import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoModal } from "@/components/todos/todo-modal";

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mocks.back,
  }),
}));

function getCloseButton(): HTMLButtonElement {
  return screen.getByRole("button", { name: "Fechar modal" });
}

describe("TodoModal", () => {
  it("moves focus into the dialog and keeps tab navigation inside it", () => {
    render(
      <TodoModal title="Nova tarefa">
        <button type="button">Salvar tarefa</button>
      </TodoModal>,
    );

    const closeButton = getCloseButton();
    const submitButton = screen.getByRole("button", { name: "Salvar tarefa" });

    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(submitButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();
  });

  it("restores focus to the prior element after closing", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(
      <TodoModal title="Nova tarefa">
        <button type="button">Salvar tarefa</button>
      </TodoModal>,
    );

    unmount();

    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
