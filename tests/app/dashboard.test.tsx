import { render, screen } from "@testing-library/react";
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
  groupTodosByDay: vi.fn(),
  getCurrentCalendarDay: vi.fn(),
  calendarDayDistance: vi.fn(),
  getDashboardDayCount: vi.fn(),
  listCalendarDaysEndingOn: vi.fn(),
  formatCalendarDay: vi.fn((day: string) => day),
  formatTimestamp: vi.fn(() => "28 de ago. de 2026"),
  signOut: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/todos", () => ({
  getEarliestTodoDateForUser: mocks.getEarliestTodoDateForUser,
  listTodosForUser: mocks.listTodosForUser,
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
    mocks.groupTodosByDay.mockImplementation((dates, todos) =>
      dates.map((date: string) => ({
        date,
        todos: todos.filter((item: typeof todo) => item.todoDate === date),
      })),
    );
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
});
