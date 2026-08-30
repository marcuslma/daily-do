"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribeToHydration = () => () => undefined;

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  if (!mounted || !resolvedTheme) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Ativar tema claro" : "Ativar tema escuro";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      aria-label={label}
      aria-pressed={isDark}
      className="fixed right-4 top-4 z-10 inline-flex size-8 items-center justify-center rounded-none border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:hover:text-white group-data-[theme=dark]:focus-visible:outline-slate-100"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" size={14} strokeWidth={2} />
    </button>
  );
}
