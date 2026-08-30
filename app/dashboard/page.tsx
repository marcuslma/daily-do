import { signOut } from "@/app/actions/auth";
import { TodoList } from "@/components/todos/todo-list";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { listTodosForUser } from "@/lib/todos";

export default async function DashboardPage() {
  const session = await requireSession();
  const todos = await listTodosForUser(session.user.id);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-12 text-slate-950 group-data-[theme=dark]:text-slate-50 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 group-data-[theme=dark]:text-slate-400">
            Daily Do
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Olá, {session.user.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200"
            href="/dashboard/todos/new"
          >
            Nova tarefa
          </Link>
          <form action={signOut}>
            <button
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-100 group-data-[theme=dark]:text-slate-200 group-data-[theme=dark]:ring-slate-700 group-data-[theme=dark]:hover:bg-slate-800"
              type="submit"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <TodoList todos={todos} />
    </main>
  );
}
