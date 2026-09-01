import { TodoSyncControl } from "@/components/todos/todo-sync-control";

type CurrentTodoDayHeaderProps = {
  dayId: string;
  title: string;
};

export function CurrentTodoDayHeader({
  dayId,
  title,
}: CurrentTodoDayHeaderProps) {
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
        </div>
      </div>
      <TodoSyncControl className="flex w-full flex-row items-center justify-end gap-2" />
    </header>
  );
}
