import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSwitcher } from "@/components/theme-switcher";

const themeMocks = vi.hoisted(() => ({
  setTheme: vi.fn(),
  theme: "system" as string | undefined,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: themeMocks.setTheme,
    theme: themeMocks.theme,
  }),
}));

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    themeMocks.theme = "system";
  });

  it("exposes the three available theme preferences", () => {
    render(<ThemeSwitcher />);

    expect(
      screen.getByRole("button", { name: "Usar tema claro" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Usar tema escuro" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Usar tema do sistema" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("selects the requested theme preference", () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: "Usar tema escuro" }));

    expect(themeMocks.setTheme).toHaveBeenCalledWith("dark");
  });
});
