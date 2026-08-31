import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

let systemPrefersDark = false;
const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(
  window,
  "localStorage",
);
const localStorageMocks = {
  getItem: vi.fn<(key: string) => string | null>(),
  setItem: vi.fn<(key: string, value: string) => void>(),
};
type HydratedThemeApplication = {
  container: HTMLDivElement;
  markup: string;
  root: Root;
};
const hydratedThemeApplications = new Set<HydratedThemeApplication>();

function ThemeState() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <>
      <output data-testid="theme">{theme}</output>
      <output data-testid="resolved-theme">{resolvedTheme ?? "pending"}</output>
      <button onClick={() => setTheme("dark")} type="button">
        Usar escuro
      </button>
    </>
  );
}

function ThemeApplication() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}

async function hydrateThemeApplication() {
  const container = document.createElement("div");
  const markup = renderToString(<ThemeApplication />);

  container.innerHTML = markup;
  document.body.append(container);

  let root: Root | undefined;

  await act(async () => {
    root = hydrateRoot(container, <ThemeApplication />);
  });

  if (!root) {
    throw new Error("Theme application did not hydrate");
  }

  const application = { container, markup, root };

  hydratedThemeApplications.add(application);

  return application;
}

async function disposeHydratedThemeApplication(
  application: HydratedThemeApplication,
) {
  await act(async () => {
    application.root.unmount();
  });

  application.container.remove();
  hydratedThemeApplications.delete(application);
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    systemPrefersDark = false;
    delete document.documentElement.dataset.theme;
    localStorageMocks.getItem.mockReset();
    localStorageMocks.getItem.mockReturnValue(null);
    localStorageMocks.setItem.mockReset();

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorageMocks,
    });

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: systemPrefersDark,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });
  });

  afterEach(async () => {
    for (const application of hydratedThemeApplications) {
      await disposeHydratedThemeApplication(application);
    }

    if (originalLocalStorageDescriptor) {
      Object.defineProperty(
        window,
        "localStorage",
        originalLocalStorageDescriptor,
      );
    }

    vi.unstubAllGlobals();
  });

  it("renders children without injecting a script into the client component tree", () => {
    const { container } = render(
      <ThemeProvider>
        <p>Conteúdo da página</p>
      </ThemeProvider>,
    );

    expect(screen.getByText("Conteúdo da página")).toBeInTheDocument();
    expect(container.querySelector("script")).not.toBeInTheDocument();
  });

  it("uses the system preference when the user has not selected a theme", async () => {
    systemPrefersDark = true;

    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
  });

  it("stores an explicit theme selection and applies it to the document", async () => {
    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
    });

    fireEvent.click(screen.getByRole("button", { name: "Usar escuro" }));

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });

    expect(localStorageMocks.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("hydrates the system default without rendering a theme script or console errors", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const { container, markup } = await hydrateThemeApplication();

    await waitFor(() => {
      expect(
        within(container).getByRole("button", { name: "Ativar tema escuro" }),
      ).toBeInTheDocument();
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
    });

    expect(markup).not.toContain("<script");
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("restores an explicit theme selection after a new hydrated mount", async () => {
    const storedThemes = new Map<string, string>();

    localStorageMocks.getItem.mockImplementation(
      (key) => storedThemes.get(key) ?? null,
    );
    localStorageMocks.setItem.mockImplementation((key, value) => {
      storedThemes.set(key, value);
    });

    const firstMount = await hydrateThemeApplication();

    await waitFor(() => {
      expect(
        within(firstMount.container).getByRole("button", {
          name: "Ativar tema escuro",
        }),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      within(firstMount.container).getByRole("button", {
        name: "Ativar tema escuro",
      }),
    );

    await waitFor(() => {
      expect(
        within(firstMount.container).getByRole("button", {
          name: "Ativar tema claro",
        }),
      ).toBeInTheDocument();
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });

    expect(storedThemes.get("theme")).toBe("dark");

    await disposeHydratedThemeApplication(firstMount);

    const secondMount = await hydrateThemeApplication();

    await waitFor(() => {
      expect(
        within(secondMount.container).getByRole("button", {
          name: "Ativar tema claro",
        }),
      ).toBeInTheDocument();
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
  });
});
