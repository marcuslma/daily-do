"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { List, PanelsTopLeft } from "lucide-react";

type DashboardView = "history" | "agenda";

type DashboardViewSwitcherProps = {
  agenda: ReactNode;
  history: ReactNode;
};

const DASHBOARD_VIEW_STORAGE_KEY = "daily-do:dashboard-view";

function subscribeToDashboardView() {
  return () => undefined;
}

function getStoredDashboardView(): DashboardView {
  try {
    const storedView = window.localStorage.getItem(DASHBOARD_VIEW_STORAGE_KEY);

    if (storedView === "agenda" || storedView === "history") {
      return storedView;
    }
  } catch {
    // Local storage may be unavailable in private or restricted contexts.
  }

  return "history";
}

function getServerDashboardView(): DashboardView {
  return "history";
}

export function DashboardViewSwitcher({
  agenda,
  history,
}: DashboardViewSwitcherProps) {
  const storedView = useSyncExternalStore(
    subscribeToDashboardView,
    getStoredDashboardView,
    getServerDashboardView,
  );
  const [sessionView, setSessionView] = useState<DashboardView | null>(null);
  const view = sessionView ?? storedView;
  const isAgenda = view === "agenda";
  const label = isAgenda
    ? "Ativar visão de histórico"
    : "Ativar visão de agenda";
  const Icon = isAgenda ? List : PanelsTopLeft;

  function toggleView() {
    const nextView: DashboardView = isAgenda ? "history" : "agenda";

    setSessionView(nextView);

    try {
      window.localStorage.setItem(DASHBOARD_VIEW_STORAGE_KEY, nextView);
    } catch {
      // The selection remains available for this session when storage is unavailable.
    }
  }

  return (
    <>
      <button
        aria-label={label}
        aria-pressed={isAgenda}
        className="fixed right-14 top-4 z-10 inline-flex size-8 items-center justify-center rounded-none border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:hover:text-white group-data-[theme=dark]:focus-visible:outline-slate-100"
        onClick={toggleView}
        title={label}
        type="button"
      >
        <Icon aria-hidden="true" size={14} strokeWidth={2} />
      </button>
      {isAgenda ? agenda : history}
    </>
  );
}
