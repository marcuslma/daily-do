import { schedules } from "@trigger.dev/sdk";
import { rollOverOpenTodosThroughDate } from "@/lib/todos";
import { calendarDayAt, getAppTimeZone } from "@/lib/timezone";

const timeZone = getAppTimeZone();

export async function runRolloverOpenTodos({
  timestamp,
}: {
  timestamp: Date;
}) {
  const targetDay = calendarDayAt(timestamp, timeZone);
  const carriedOver = await rollOverOpenTodosThroughDate(targetDay);

  return { carriedOver, targetDay };
}

export const rollOverOpenTodos = schedules.task({
  id: "rollover-open-todos",
  cron: {
    pattern: "0 0 * * *",
    timezone: timeZone,
    environments: ["STAGING", "PRODUCTION"],
  },
  run: runRolloverOpenTodos,
});
