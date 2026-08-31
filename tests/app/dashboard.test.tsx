import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "@/app/dashboard/page";

const todo = {
  id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d1",
  description: "Comprar café",
  todoDate: "2026-08-30",
  originalCreatedAt: new Date("2026-08-28T12:00:00.000Z"),
  carryoverCount: 2,
  previousTodoId: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d0",
  createdAt: new Date("2026-08-30T12:00:00.000Z"),
  updatedAt: new Date("2026-08-30T12:00:00.000Z"),
  completedAt: null,
};

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  getEarliestTodoDateForUser: vi.fn(),
  listTodosForUser: vi.fn(),
  listScheduledTodosForUser: vi.fn(),
  groupTodosByDay: vi.fn(),
  getCurrentCalendarDay: vi.fn(),
  calendarDayDistance: vi.fn(),
  getDashboardDayCount: vi.fn(),
  listCalendarDaysEndingOn: vi.fn(),
  formatCalendarDay: vi.fn((day: string) => day),
  formatTimestamp: vi.fn(() => "28 de ago. de 2026"),
  signOut: vi.fn(),
  synchronizePendingTodos: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/todos", () => ({
  getEarliestTodoDateForUser: mocks.getEarliestTodoDateForUser,
  listTodosForUser: mocks.listTodosForUser,
  listScheduledTodosForUser: mocks.listScheduledTodosForUser,
  groupTodosByDay: mocks.groupTodosByDay,
}));

vi.mock("@/lib/timezone", () => ({
  DASHBOARD_DAY_INCREMENT: 3,
  getCurrentCalendarDay: mocks.getCurrentCalendarDay,
  calendarDayDistance: mocks.calendarDayDistance,
  getDashboardDayCount: mocks.getDashboardDayCount,
  listCalendarDaysEndingOn: mocks.listCalendarDaysEndingOn,
  formatCalendarDay: mocks.formatCalendarDay,
  formatTimestamp: mocks.formatTimestamp,
}));

vi.mock("@/app/actions/auth", () => ({
  signOut: mocks.signOut,
}));

vi.mock("@/app/actions/todos", () => ({
  synchronizePendingTodos: mocks.synchronizePendingTodos,
  toggleTodo: mocks.toggleTodo,
  deleteTodo: mocks.deleteTodo,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({
      user: {
        id: "user_1",
        name: "Ana",
      },
    });
    mocks.getCurrentCalendarDay.mockReturnValue("2026-08-30");
    mocks.getEarliestTodoDateForUser.mockResolvedValue("2026-08-25");
    mocks.calendarDayDistance.mockReturnValue(5);
    mocks.getDashboardDayCount.mockReturnValue(3);
    mocks.listCalendarDaysEndingOn.mockReturnValue([
      "2026-08-30",
      "2026-08-29",
      "2026-08-28",
    ]);
    mocks.listTodosForUser.mockResolvedValue([todo]);
    mocks.listScheduledTodosForUser.mockResolvedValue([
      todo,
      {
        ...todo,
        id: "8a7e5f1d-0d55-4b63-b386-0258f4a4c0d2",
        description: "Revisar projeto",
        todoDate: "2026-09-02",
      },
    ]);
    mocks.groupTodosByDay.mockImplementation((dates, todos) =>
      dates.map((date: string) => ({
        date,
        todos: todos.filter((item: typeof todo) => item.todoDate === date),
      })),
    );
  });

  it("shows a plus icon with the new task action", async () => {
    render(
      await DashboardPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen
        .getByRole("link", { name: "Nova tarefa" })
        .querySelector("svg.lucide-plus"),
    ).toBeInTheDocument();
  });

  it("shows a logout icon with the sign-out action", async () => {
    render(
      await DashboardPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen
        .getByRole("button", { name: "Sair" })
        .querySelector("svg.lucide-log-out"),
    ).toBeInTheDocument();
  });

  it("keeps the pending synchronization action out of the main controls", async () => {
    render(
      await DashboardPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    const button = screen.getByRole("button", {
      name: "Sincronizar pendentes",
    });

    expect(screen.getByText("Daily Do").closest("header")).not.toContainElement(
      button,
    );
  });

  it("keeps dashboard actions fluid on small screens", async () => {
    render(
      await DashboardPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    const newTodoLink = screen.getByRole("link", { name: "Nova tarefa" });
    const signOutButton = screen.getByRole("button", { name: "Sair" });

    expect(screen.getByText("Daily Do").closest("header")).toHaveClass(
      "flex-col",
      "sm:flex-row",
    );
    expect(screen.getByRole("main")).toHaveClass("pt-16", "sm:py-8");
    expect(screen.getByText("Daily Do").parentElement).toHaveClass(
      "w-full",
      "sm:w-auto",
    );
    expect(newTodoLink.parentElement).toHaveClass("w-full", "sm:w-auto");
    expect(newTodoLink).toHaveClass("flex-1", "sm:flex-none");
    expect(signOutButton.closest("form")).toHaveClass(
      "flex-1",
      "sm:flex-none",
    );
    expect(signOutButton).toHaveClass("w-full");
  });

  it("loads today plus two prior dates and exposes the next three-day link", async () => {
    render(
      await DashboardPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByRole("link", { name: "Nova tarefa" })).toHaveAttribute(
      "href",
      "/dashboard/todos/new",
    );
    expect(screen.getByText("Comprar café")).toBeInTheDocument();
    expect(mocks.listTodosForUser).toHaveBeenCalledWith(
      "user_1",
      "2026-08-28",
      "2026-08-30",
    );
    expect(
      screen.getByRole("link", { name: "Carregar 3 dias anteriores" }),
    ).toHaveAttribute("href", "/dashboard?days=6");
  });

  it("composes the scheduled agenda from current and future todo dates", async () => {
    render(
      await DashboardPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(mocks.listScheduledTodosForUser).toHaveBeenCalledWith(
      "user_1",
      "2026-08-30",
    );
    expect(screen.getByText("Comprar café")).toBeInTheDocument();
    expect(screen.queryByText("Revisar projeto")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Ativar visão de agenda" }),
    );

    expect(screen.getByText("Revisar projeto")).toBeInTheDocument();
  });
});
