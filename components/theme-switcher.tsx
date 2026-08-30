"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const themeOptions = [
  { value: "light", label: "Usar tema claro", Icon: Sun },
  { value: "dark", label: "Usar tema escuro", Icon: Moon },
  { value: "system", label: "Usar tema do sistema", Icon: Monitor },
] as const;

const subscribeToHydration = () => () => undefined;

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return (
    <div
      aria-label="Tema"
      className="fixed right-4 top-4 z-10 inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:ring-slate-700"
      role="group"
    >
      {themeOptions.map(({ value, label, Icon }) => {
        const isActive = mounted && theme === value;

        return (
          <button
            aria-label={label}
            aria-pressed={isActive}
            className={
              "inline-flex size-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:hover:text-white group-data-[theme=dark]:focus-visible:outline-slate-100" +
              (isActive
                ? " bg-slate-950 text-white hover:bg-slate-950 hover:text-white group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-50 group-data-[theme=dark]:hover:text-slate-950"
                : "")
            }
            key={value}
            onClick={() => setTheme(value)}
            title={label}
            type="button"
          >
            <Icon aria-hidden="true" size={16} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
