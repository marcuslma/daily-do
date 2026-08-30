"use client";

import { useOptimistic, useTransition } from "react";
import { toggleTodo } from "@/app/actions/todos";

type TodoCheckboxProps = {
  completed: boolean;
  description: string;
  todoId: string;
};

export function TodoCheckbox({
  completed,
  description,
  todoId,
}: TodoCheckboxProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(completed);
  const [isPending, startTransition] = useTransition();

  function handleChange(nextCompleted: boolean) {
    startTransition(async () => {
      setOptimisticCompleted(nextCompleted);
      await toggleTodo(todoId, nextCompleted);
    });
  }

  return (
    <input
      aria-label={(optimisticCompleted ? "Reabrir: " : "Concluir: ") + description}
      checked={optimisticCompleted}
      className="size-4 shrink-0 cursor-pointer rounded-none border-slate-300 text-slate-950 accent-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:cursor-wait group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:accent-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50"
      disabled={isPending}
      onChange={(event) => handleChange(event.currentTarget.checked)}
      type="checkbox"
    />
  );
}
