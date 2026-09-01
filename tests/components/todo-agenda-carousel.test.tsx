import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoAgendaCarousel } from "@/components/todos/todo-agenda-carousel";

describe("TodoAgendaCarousel", () => {
  it("places the navigation controls above the agenda content", () => {
    render(
      <TodoAgendaCarousel dates={["2026-08-30", "2026-08-31"]}>
        <div>30 de ago. de 2026</div>
        <div>31 de ago. de 2026</div>
      </TodoAgendaCarousel>,
    );

    const navigation = screen.getByRole("group", {
      name: "Navegação da agenda",
    });
    const agenda = screen.getByLabelText("Agenda de tarefas");

    expect(navigation.compareDocumentPosition(agenda)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("scrolls to the initially selected day when the carousel mounts", () => {
    const clientWidthDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    );

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 100,
    });

    try {
      render(
        <TodoAgendaCarousel
          dates={["2026-08-29", "2026-08-30", "2026-08-31"]}
          initialIndex={1}
        >
          <div>29 de ago. de 2026</div>
          <div>30 de ago. de 2026</div>
          <div>31 de ago. de 2026</div>
        </TodoAgendaCarousel>,
      );

      expect(screen.getByLabelText("Agenda de tarefas").scrollLeft).toBe(100);
    } finally {
      if (clientWidthDescriptor) {
        Object.defineProperty(
          HTMLElement.prototype,
          "clientWidth",
          clientWidthDescriptor,
        );
      }
    }
  });

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
