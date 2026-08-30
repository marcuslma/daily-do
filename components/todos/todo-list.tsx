import Link from "next/link";
import { deleteTodo } from "@/app/actions/todos";
import { TodoCheckbox } from "@/components/todos/todo-checkbox";
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
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 group-data-[theme=dark]:border-slate-800">
              <h2
                className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-950 group-data-[theme=dark]:text-slate-50"
                id={"todo-day-" + todoDay.date}
              >
                {formattedDay}
              </h2>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 group-data-[theme=dark]:text-slate-400">
                {isCurrentDay ? "Hoje" : "Somente leitura"}
              </span>
            </header>
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
                      className="flex items-start gap-2 border border-slate-200 bg-white p-3 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900"
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
                        <div className="flex shrink-0 items-center gap-2">
                          <Link
                            aria-label={"Editar: " + todo.description}
                            className="inline-flex h-8 items-center rounded-none border border-slate-300 px-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
                            href={"/dashboard/todos/" + todo.id + "/edit"}
                          >
                            Editar
                          </Link>
                          <form action={deleteTodo.bind(null, todo.id)}>
                            <button
                              aria-label={"Excluir: " + todo.description}
                              className="inline-flex h-8 items-center rounded-none border border-rose-300 px-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 group-data-[theme=dark]:border-rose-900 group-data-[theme=dark]:text-rose-300 group-data-[theme=dark]:hover:bg-rose-950/30 group-data-[theme=dark]:focus-visible:outline-rose-300"
                              type="submit"
                            >
                              Excluir
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
