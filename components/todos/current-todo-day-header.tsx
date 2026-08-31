"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { synchronizePendingTodos } from "@/app/actions/todos";
import { initialTodoSyncActionState } from "@/lib/todo-sync-action-state";

type CurrentTodoDayHeaderProps = {
  dayId: string;
  title: string;
};

export function CurrentTodoDayHeader({
  dayId,
  title,
}: CurrentTodoDayHeaderProps) {
  const [state, formAction, isPending] = useActionState(
    synchronizePendingTodos,
    initialTodoSyncActionState,
  );
  const label = isPending ? "Sincronizando pendentes" : "Sincronizar pendentes";

  return (
    <header className="border-b border-slate-200 pb-2 group-data-[theme=dark]:border-slate-800">
      <div className="flex flex-row items-center justify-between gap-3">
        <h2
          className="min-w-0 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950 group-data-[theme=dark]:text-slate-50"
          id={dayId}
        >
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 group-data-[theme=dark]:text-slate-400">
            Hoje
          </span>
          <form action={formAction} className="shrink-0">
            <button
              aria-busy={isPending}
              aria-label={label}
              className="inline-flex size-8 items-center justify-center rounded-none border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:cursor-wait disabled:opacity-60 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-200 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
              disabled={isPending}
              title={label}
              type="submit"
            >
              <RefreshCw
                aria-hidden="true"
                className={isPending ? "animate-spin" : undefined}
                size={14}
                strokeWidth={2}
              />
            </button>
          </form>
        </div>
      </div>
      {state.message ? (
        <p
          aria-live="polite"
          className={
            "mt-1 w-full break-words text-[11px] leading-4 " +
            (state.status === "error"
              ? "text-rose-700 group-data-[theme=dark]:text-rose-300"
              : "text-emerald-700 group-data-[theme=dark]:text-emerald-300")
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </header>
  );
}
