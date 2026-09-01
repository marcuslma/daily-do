import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CurrentTodoDayHeader } from "@/components/todos/current-todo-day-header";

const mocks = vi.hoisted(() => ({
  synchronizePendingTodos: vi.fn(),
}));

vi.mock("@/app/actions/todos", () => ({
  synchronizePendingTodos: mocks.synchronizePendingTodos,
}));

describe("CurrentTodoDayHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a compact, accessible synchronization icon control", () => {
    render(
      <CurrentTodoDayHeader
        dayId="todo-day-2026-08-30"
        title="30 de ago. de 2026"
      />,
    );

    const button = screen.getByRole("button", {
      name: "Sincronizar pendentes",
    });

    expect(button).toHaveAttribute("aria-label", "Sincronizar pendentes");
    expect(button).toHaveAttribute("title", "Sincronizar pendentes");
    expect(button).toHaveClass("size-8");
    expect(button).toHaveTextContent("");
    expect(button.querySelector("svg.lucide-refresh-cw")).toBeInTheDocument();
  });

  it("disables the button and announces the copied count while the action completes", async () => {
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
      <CurrentTodoDayHeader
        dayId="todo-day-2026-08-30"
        title="30 de ago. de 2026"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sincronizando pendentes" }),
      ).toBeDisabled();
    });

    await act(async () => {
      resolveAction!({
        message: "2 tarefas pendentes sincronizadas.",
        status: "success",
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "2 tarefas pendentes sincronizadas.",
      );
    });
    expect(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    ).toBeEnabled();
  });

  it("keeps resolved synchronization feedback alongside the compact control", async () => {
    mocks.synchronizePendingTodos.mockResolvedValue({
      message: "2 tarefas pendentes sincronizadas.",
      status: "success",
    });

    render(
      <CurrentTodoDayHeader
        dayId="todo-day-2026-08-30"
        title="30 de ago. de 2026"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "2 tarefas pendentes sincronizadas.",
      );
    });

    const syncControl = screen.getByRole("status").parentElement;
    const syncButton = screen.getByRole("button", {
      name: "Sincronizar pendentes",
    });

    expect(syncControl).toContainElement(syncButton);
    expect(syncControl).toHaveClass("flex-row", "items-center");
    expect(screen.getByRole("status")).not.toHaveClass("mt-1", "w-full");
    expect(screen.getByRole("status")).toHaveClass("text-left");
    expect(screen.getByRole("status")).not.toHaveClass("text-right");
  });

  it("announces a comprehensible synchronization error", async () => {
    mocks.synchronizePendingTodos.mockResolvedValue({
      message: "Não foi possível sincronizar as tarefas pendentes. Tente novamente.",
      status: "error",
    });

    render(
      <CurrentTodoDayHeader
        dayId="todo-day-2026-08-30"
        title="30 de ago. de 2026"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Sincronizar pendentes" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Não foi possível sincronizar as tarefas pendentes. Tente novamente.",
      );
    });
    expect(screen.getByRole("status")).toHaveClass("text-rose-700");
  });
});
