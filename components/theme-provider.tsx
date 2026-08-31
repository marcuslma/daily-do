"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";
type ThemePreference = Theme | "system";

type ThemeProviderProps = {
  children: ReactNode;
};

type ThemeContextValue = {
  resolvedTheme: Theme | undefined;
  setTheme: (theme: ThemePreference) => void;
  theme: ThemePreference;
};

const THEME_STORAGE_KEY = "theme";
const SYSTEM_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (
      storedTheme === "dark" ||
      storedTheme === "light" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }
  } catch {
    // Local storage may be unavailable in private or restricted contexts.
  }

  return "system";
}

function getSystemTheme(): Theme {
  return window.matchMedia(SYSTEM_THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

function getServerSystemTheme() {
  return undefined;
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY);

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme);
  const systemTheme = useSyncExternalStore<Theme | undefined>(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );

  const resolvedTheme =
    systemTheme === undefined
      ? undefined
      : theme === "system"
        ? systemTheme
        : theme;

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.dataset.theme = resolvedTheme;
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    setThemeState(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The active theme continues to work when local storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({ resolvedTheme, setTheme, theme }),
    [resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return theme;
}
