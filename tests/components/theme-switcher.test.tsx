import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSwitcher } from "@/components/theme-switcher";

const themeMocks = vi.hoisted(() => ({
  setTheme: vi.fn(),
  resolvedTheme: "light" as string | undefined,
  theme: "system" as string | undefined,
}));

vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({
    setTheme: themeMocks.setTheme,
    resolvedTheme: themeMocks.resolvedTheme,
    theme: themeMocks.theme,
  }),
}));

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    themeMocks.resolvedTheme = "light";
    themeMocks.theme = "system";
  });

  it("does not expose the toggle before the effective theme is ready", () => {
    themeMocks.resolvedTheme = undefined;

    render(<ThemeSwitcher />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it.each([
    ["system", "light", "Ativar tema escuro", "dark", "moon", "false"],
    ["system", "dark", "Ativar tema claro", "light", "sun", "true"],
    ["light", "light", "Ativar tema escuro", "dark", "moon", "false"],
    ["dark", "dark", "Ativar tema claro", "light", "sun", "true"],
  ])(
    "toggles from %s when the effective theme is %s",
    (theme, resolvedTheme, label, nextTheme, iconName, pressed) => {
      themeMocks.theme = theme;
      themeMocks.resolvedTheme = resolvedTheme;

      render(<ThemeSwitcher />);

      const toggle = screen.getByRole("button", { name: label });

      expect(screen.getAllByRole("button")).toHaveLength(1);
      expect(toggle).toHaveAttribute("aria-pressed", pressed);
      expect(toggle).toHaveAttribute("title", label);
      expect(toggle.querySelector("svg.lucide-" + iconName)).toBeInTheDocument();

      fireEvent.click(toggle);

      expect(themeMocks.setTheme).toHaveBeenCalledWith(nextTheme);
    },
  );

  it("updates its icon and action after a theme selection", () => {
    const { rerender } = render(<ThemeSwitcher />);

    fireEvent.click(
      screen.getByRole("button", { name: "Ativar tema escuro" }),
    );
    themeMocks.theme = "dark";
    themeMocks.resolvedTheme = "dark";
    rerender(<ThemeSwitcher />);

    const toggle = screen.getByRole("button", { name: "Ativar tema claro" });

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle.querySelector("svg.lucide-sun")).toBeInTheDocument();
  });
});
