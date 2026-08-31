import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardViewSwitcher } from "@/components/todos/dashboard-view-switcher";

const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(
  window,
  "localStorage",
);
const localStorageMocks = {
  getItem: vi.fn<(key: string) => string | null>(),
  setItem: vi.fn<(key: string, value: string) => void>(),
};

function DashboardViews() {
  return (
    <DashboardViewSwitcher
      agenda={<p>Agenda renderizada</p>}
      history={<p>Histórico renderizado</p>}
    />
  );
}

describe("DashboardViewSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMocks.getItem.mockReturnValue(null);

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorageMocks,
    });
  });

  afterEach(() => {
    if (originalLocalStorageDescriptor) {
      Object.defineProperty(
        window,
        "localStorage",
        originalLocalStorageDescriptor,
      );
    }
  });

  it("shows the server-safe history view and persists an agenda selection", () => {
    render(<DashboardViews />);

    const toggle = screen.getByRole("button", {
      name: "Ativar visão de agenda",
    });

    expect(screen.getByText("Histórico renderizado")).toBeInTheDocument();
    expect(screen.queryByText("Agenda renderizada")).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("title", "Ativar visão de agenda");
    expect(toggle).toHaveClass("fixed", "right-14", "top-4", "z-10");
    expect(
      toggle.querySelector("svg.lucide-panels-top-left"),
    ).toBeInTheDocument();

    fireEvent.click(toggle);

    expect(localStorageMocks.setItem).toHaveBeenCalledWith(
      "daily-do:dashboard-view",
      "agenda",
    );
    expect(screen.getByText("Agenda renderizada")).toBeInTheDocument();
    expect(screen.queryByText("Histórico renderizado")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ativar visão de histórico" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen
        .getByRole("button", { name: "Ativar visão de histórico" })
        .querySelector("svg.lucide-list"),
    ).toBeInTheDocument();
  });

  it("restores a stored agenda selection after mounting", async () => {
    localStorageMocks.getItem.mockReturnValue("agenda");

    render(<DashboardViews />);

    await waitFor(() => {
      expect(screen.getByText("Agenda renderizada")).toBeInTheDocument();
    });

    expect(
      localStorageMocks.getItem,
    ).toHaveBeenCalledWith("daily-do:dashboard-view");
  });

  it("keeps history when local storage cannot be read", async () => {
    localStorageMocks.getItem.mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    render(<DashboardViews />);

    await waitFor(() => {
      expect(screen.getByText("Histórico renderizado")).toBeInTheDocument();
    });
    expect(screen.queryByText("Agenda renderizada")).not.toBeInTheDocument();
  });

  it("keeps the agenda selected for the session when local storage cannot be written", () => {
    localStorageMocks.setItem.mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    render(<DashboardViews />);

    fireEvent.click(
      screen.getByRole("button", { name: "Ativar visão de agenda" }),
    );

    expect(screen.getByText("Agenda renderizada")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ativar visão de histórico" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
