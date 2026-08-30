import { signOut } from "@/app/actions/auth";
import { TodoList } from "@/components/todos/todo-list";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import {
  getEarliestTodoDateForUser,
  groupTodosByDay,
  listTodosForUser,
} from "@/lib/todos";
import {
  calendarDayDistance,
  DASHBOARD_DAY_INCREMENT,
  getCurrentCalendarDay,
  getDashboardDayCount,
  listCalendarDaysEndingOn,
} from "@/lib/timezone";

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const { days } = await props.searchParams;
  const session = await requireSession();
  const currentDay = getCurrentCalendarDay();
  const earliestDay = await getEarliestTodoDateForUser(session.user.id);
  const maximum = earliestDay
    ? Math.max(3, calendarDayDistance(earliestDay, currentDay) + 1)
    : 3;
  const visibleCount = getDashboardDayCount(days, maximum);
  const dates = listCalendarDaysEndingOn(currentDay, visibleCount);
  const todos = await listTodosForUser(
    session.user.id,
    dates[dates.length - 1]!,
    currentDay,
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8 text-slate-950 group-data-[theme=dark]:text-slate-50 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 group-data-[theme=dark]:text-slate-400">
            Daily Do
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Olá, {session.user.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
          className="inline-flex h-8 items-center rounded-none bg-slate-950 px-3 text-xs font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200 group-data-[theme=dark]:focus-visible:outline-slate-50"
            href="/dashboard/todos/new"
          >
            Nova tarefa
          </Link>
          <form action={signOut}>
            <button
              className="h-8 rounded-none border border-slate-300 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-200 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
              type="submit"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <TodoList currentDay={currentDay} days={groupTodosByDay(dates, todos)} />
      {visibleCount < maximum ? (
        <Link
          className="inline-flex h-8 self-start items-center rounded-none border border-slate-300 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-200 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
          href={"/dashboard?days=" + (visibleCount + DASHBOARD_DAY_INCREMENT)}
        >
          Carregar 3 dias anteriores
        </Link>
      ) : null}
    </main>
  );
}
