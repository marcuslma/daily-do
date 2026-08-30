import Link from "next/link";
import { TodoCheckbox } from "@/components/todos/todo-checkbox";
import type { Todo } from "@/lib/todos";

type TodoListProps = {
  todos: Todo[];
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeZone: "America/Sao_Paulo",
});

function formatTodoDate(date: Date): string {
  return dateFormatter.format(date);
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-600 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-300">
        Nenhuma tarefa por aqui. Adicione a primeira para começar.
      </section>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Tarefas">
      {todos.map((todo) => {
        const isCompleted = todo.completedAt !== null;

        return (
          <li
            className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:ring-slate-700"
            key={todo.id}
          >
            <TodoCheckbox
              completed={isCompleted}
              description={todo.description}
              todoId={todo.id}
            />
            <div className="min-w-0 flex-1">
              <p
                className={
                  "break-words text-sm font-medium text-slate-950 group-data-[theme=dark]:text-slate-50" +
                  (isCompleted
                    ? " text-slate-400 line-through group-data-[theme=dark]:text-slate-500"
                    : "")
                }
              >
                {todo.description}
              </p>
              <p className="mt-1 text-xs text-slate-500 group-data-[theme=dark]:text-slate-400">
                <time dateTime={todo.createdAt.toISOString()}>
                  Incluída em {formatTodoDate(todo.createdAt)}
                </time>
                {todo.completedAt ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    <time dateTime={todo.completedAt.toISOString()}>
                      Concluída em {formatTodoDate(todo.completedAt)}
                    </time>
                  </>
                ) : null}
              </p>
            </div>
            <Link
              aria-label={"Editar: " + todo.description}
              className="rounded-md px-2 py-1 text-sm font-medium text-slate-700 underline transition hover:bg-slate-100 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800"
              href={"/dashboard/todos/" + todo.id + "/edit"}
            >
              Editar
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
