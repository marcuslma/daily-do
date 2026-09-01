"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { synchronizePendingTodos } from "@/app/actions/todos";
import { initialTodoSyncActionState } from "@/lib/todo-sync-action-state";

type TodoSyncControlProps = {
  className?: string;
};

export function TodoSyncControl({ className }: TodoSyncControlProps) {
  const [state, formAction, isPending] = useActionState(
    synchronizePendingTodos,
    initialTodoSyncActionState,
  );
  const label = isPending ? "Sincronizando pendentes" : "Sincronizar pendentes";

  return (
    <div className={className}>
      {state.message ? (
        <p
          aria-live="polite"
          className={
            "min-w-0 flex-1 break-words text-left text-[11px] leading-4 " +
            (state.status === "error"
              ? "text-rose-700 group-data-[theme=dark]:text-rose-300"
              : "text-emerald-700 group-data-[theme=dark]:text-emerald-300")
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
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
  );
}
