import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTodo } from "@/app/actions/todos";
import { TodoCheckbox } from "@/components/todos/todo-checkbox";
import { CurrentTodoDayHeader } from "@/components/todos/current-todo-day-header";
import type { TodoDay } from "@/lib/todos";
import {
  formatCalendarDay,
  formatTimestamp,
  type CalendarDay,
} from "@/lib/timezone";

type TodoListProps = {
  currentDay: CalendarDay;
  days: TodoDay[];
};

export function TodoList({ currentDay, days }: TodoListProps) {
  return (
    <div className="space-y-5">
      {days.map((todoDay) => {
        const isCurrentDay = todoDay.date === currentDay;
        const formattedDay = formatCalendarDay(todoDay.date);

        return (
          <section
            aria-labelledby={"todo-day-" + todoDay.date}
            className="space-y-2"
            key={todoDay.date}
          >
            {isCurrentDay ? (
              <CurrentTodoDayHeader
                dayId={"todo-day-" + todoDay.date}
                title={formattedDay}
              />
            ) : (
              <header className="flex flex-col items-start gap-1 border-b border-slate-200 pb-2 group-data-[theme=dark]:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <h2
                  className="min-w-0 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950 group-data-[theme=dark]:text-slate-50"
                  id={"todo-day-" + todoDay.date}
                >
                  {formattedDay}
                </h2>
                <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 group-data-[theme=dark]:text-slate-400">
                  Somente leitura
                </span>
              </header>
            )}
            {todoDay.todos.length === 0 ? (
              <p className="text-xs text-slate-500 group-data-[theme=dark]:text-slate-400">
                Nenhuma tarefa registrada.
              </p>
            ) : (
              <ul className="space-y-2" aria-label={"Tarefas de " + formattedDay}>
                {todoDay.todos.map((todo) => {
                  const isCompleted = todo.completedAt !== null;

                  return (
                    <li
                      className="flex flex-wrap items-start gap-2 border border-slate-200 bg-white p-3 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900 sm:flex-nowrap"
                      key={todo.id}
                    >
                      {isCurrentDay ? (
                        <TodoCheckbox
                          completed={isCompleted}
                          description={todo.description}
                          todoId={todo.id}
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            "break-words text-xs font-medium text-slate-950 group-data-[theme=dark]:text-slate-50" +
                            (isCompleted
                              ? " text-slate-400 line-through group-data-[theme=dark]:text-slate-500"
                              : "")
                          }
                        >
                          {todo.description}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-slate-500 group-data-[theme=dark]:text-slate-400">
                          {todo.carryoverCount > 0 ? (
                            <>
                              <span>Adiada {todo.carryoverCount}×</span>
                              <span aria-hidden="true"> · </span>
                            </>
                          ) : null}
                          <time dateTime={todo.originalCreatedAt.toISOString()}>
                            Criada em {formatTimestamp(todo.originalCreatedAt)}
                          </time>
                          {todo.completedAt ? (
                            <>
                              <span aria-hidden="true"> · </span>
                              <time dateTime={todo.completedAt.toISOString()}>
                                Concluída em {formatTimestamp(todo.completedAt)}
                              </time>
                            </>
                          ) : null}
                        </p>
                      </div>
                      {isCurrentDay ? (
                        <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto sm:justify-start">
                          <Link
                            aria-label={"Editar: " + todo.description}
                            className="inline-flex size-8 items-center justify-center rounded-none border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
                            href={"/dashboard/todos/" + todo.id + "/edit"}
                            title="Editar tarefa"
                          >
                            <Pencil aria-hidden="true" size={14} strokeWidth={2} />
                          </Link>
                          <form action={deleteTodo.bind(null, todo.id)}>
                            <button
                              aria-label={"Excluir: " + todo.description}
                              className="inline-flex size-8 items-center justify-center rounded-none border border-rose-300 text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 group-data-[theme=dark]:border-rose-900 group-data-[theme=dark]:text-rose-300 group-data-[theme=dark]:hover:bg-rose-950/30 group-data-[theme=dark]:focus-visible:outline-rose-300"
                              title="Excluir tarefa"
                              type="submit"
                            >
                              <Trash2 aria-hidden="true" size={14} strokeWidth={2} />
                            </button>
                          </form>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
