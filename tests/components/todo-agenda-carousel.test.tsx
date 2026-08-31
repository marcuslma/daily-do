import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoAgendaCarousel } from "@/components/todos/todo-agenda-carousel";

describe("TodoAgendaCarousel", () => {
  it("scrolls one viewport when the next-day control is activated", () => {
    render(
      <TodoAgendaCarousel dates={["2026-08-30", "2026-08-31"]}>
        <div>30 de ago. de 2026</div>
        <div>31 de ago. de 2026</div>
      </TodoAgendaCarousel>,
    );

    const agenda = screen.getByLabelText("Agenda de tarefas");
    const scrollTo = vi.fn();

    Object.defineProperty(agenda, "clientWidth", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(agenda, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });

    fireEvent.click(screen.getByRole("button", { name: "Próximo dia" }));

    expect(scrollTo).toHaveBeenCalledWith({ left: 100, behavior: "smooth" });
    expect(screen.getByRole("button", { name: "Dia anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Próximo dia" })).toBeDisabled();
  });

  it("updates its bounded navigation controls after a user scrolls to the next day", () => {
    render(
      <TodoAgendaCarousel dates={["2026-08-30", "2026-08-31"]}>
        <div>30 de ago. de 2026</div>
        <div>31 de ago. de 2026</div>
      </TodoAgendaCarousel>,
    );

    const agenda = screen.getByLabelText("Agenda de tarefas");

    expect(screen.getByRole("button", { name: "Dia anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próximo dia" })).toHaveAttribute(
      "title",
      "Próximo dia",
    );
    expect(agenda).toBeInTheDocument();

    Object.defineProperty(agenda, "clientWidth", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(agenda, "scrollLeft", {
      configurable: true,
      value: 100,
      writable: true,
    });
    fireEvent.scroll(agenda);

    expect(screen.getByRole("button", { name: "Próximo dia" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Dia anterior" })).toBeEnabled();
  });
});
