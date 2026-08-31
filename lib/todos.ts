import "server-only";
import { db } from "@/lib/db";
import {
  getCurrentCalendarDay,
  shiftCalendarDay,
  type CalendarDay,
} from "@/lib/timezone";

export type Todo = {
  id: string;
  description: string;
  todoDate: CalendarDay;
  originalCreatedAt: Date;
  carryoverCount: number;
  previousTodoId: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
};

export type TodoDay = {
  date: CalendarDay;
  todos: Todo[];
};

const todoColumns =
  'id, description, todo_date::text AS "todoDate", original_created_at AS "originalCreatedAt", carryover_count AS "carryoverCount", previous_todo_id AS "previousTodoId", created_at AS "createdAt", updated_at AS "updatedAt", completed_at AS "completedAt"';

export async function listTodosForUser(
  userId: string,
  firstDay = getCurrentCalendarDay(),
  lastDay = firstDay,
): Promise<Todo[]> {
  const result = await db.query<Todo>(
    "SELECT " +
      todoColumns +
      " FROM todo WHERE user_id = $1 AND todo_date >= $2 AND todo_date <= $3 ORDER BY todo_date DESC, completed_at IS NOT NULL ASC, created_at DESC",
    [userId, firstDay, lastDay],
  );

  return result.rows;
}

export async function listScheduledTodosForUser(
  userId: string,
  firstDay = getCurrentCalendarDay(),
): Promise<Todo[]> {
  const result = await db.query<Todo>(
    "SELECT " +
      todoColumns +
      " FROM todo WHERE user_id = $1 AND todo_date >= $2 ORDER BY todo_date ASC, completed_at IS NOT NULL ASC, created_at DESC",
    [userId, firstDay],
  );

  return result.rows;
}

export async function getEarliestTodoDateForUser(
  userId: string,
): Promise<CalendarDay | null> {
  const result = await db.query<{ earliestTodoDate: CalendarDay | null }>(
    'SELECT MIN(todo_date)::text AS "earliestTodoDate" FROM todo WHERE user_id = $1',
    [userId],
  );

  return result.rows[0]?.earliestTodoDate ?? null;
}

export async function getTodoForUser(
  userId: string,
  todoId: string,
): Promise<Todo | null> {
  const result = await db.query<Todo>(
    "SELECT " + todoColumns + " FROM todo WHERE id = $1 AND user_id = $2",
    [todoId, userId],
  );

  return result.rows[0] ?? null;
}

export async function createTodoForUser(
  userId: string,
  description: string,
  todoDate = getCurrentCalendarDay(),
): Promise<Todo> {
  const result = await db.query<Todo>(
    "INSERT INTO todo (user_id, description, todo_date) VALUES ($1, $2, $3) RETURNING " +
      todoColumns,
    [userId, description, todoDate],
  );

  return result.rows[0] as Todo;
}

export async function updateTodoForUser(
  userId: string,
  todoId: string,
  description: string,
  todoDate: CalendarDay,
  currentDay = getCurrentCalendarDay(),
): Promise<Todo | null> {
  const result = await db.query<Todo>(
    "UPDATE todo SET description = $3, todo_date = $4, completed_at = CASE WHEN $4 > $5 THEN NULL ELSE completed_at END, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND todo_date >= $5 RETURNING " +
      todoColumns,
    [todoId, userId, description, todoDate, currentDay],
  );

  return result.rows[0] ?? null;
}

export async function setTodoCompletionForUser(
  userId: string,
  todoId: string,
  completed: boolean,
  currentDay = getCurrentCalendarDay(),
): Promise<Todo | null> {
  const result = await db.query<Todo>(
    "UPDATE todo SET completed_at = CASE WHEN $3 THEN CURRENT_TIMESTAMP ELSE NULL END, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND todo_date = $4 RETURNING " +
      todoColumns,
    [todoId, userId, completed, currentDay],
  );

  return result.rows[0] ?? null;
}

export async function deleteTodoForUser(
  userId: string,
  todoId: string,
  currentDay = getCurrentCalendarDay(),
): Promise<Todo | null> {
  const result = await db.query<Todo>(
    "DELETE FROM todo WHERE id = $1 AND user_id = $2 AND todo_date >= $3 RETURNING " +
      todoColumns,
    [todoId, userId, currentDay],
  );

  return result.rows[0] ?? null;
}

export function groupTodosByDay(
  dates: CalendarDay[],
  todos: Todo[],
): TodoDay[] {
  const todosByDay = new Map<CalendarDay, Todo[]>(
    dates.map((date) => [date, []]),
  );

  for (const todo of todos) {
    todosByDay.get(todo.todoDate)?.push(todo);
  }

  return dates.map((date) => ({
    date,
    todos: todosByDay.get(date) ?? [],
  }));
}

export async function copyOpenTodosFromYesterdayForUser(
  userId: string,
  targetDay: CalendarDay,
): Promise<number> {
  const client = await db.connect();
  const sourceDay = shiftCalendarDay(targetDay, -1);

  try {
    await client.query("BEGIN");

    const result = await client.query<{ id: string }>(
      `INSERT INTO todo (
        user_id,
        description,
        todo_date,
        original_created_at,
        carryover_count,
        previous_todo_id
      )
      SELECT
        user_id,
        description,
        $3::date,
        original_created_at,
        carryover_count + 1,
        id
      FROM todo
      WHERE user_id = $1
        AND todo_date = $2::date
        AND completed_at IS NULL
      ON CONFLICT (previous_todo_id) DO NOTHING
      RETURNING id`,
      [userId, sourceDay, targetDay],
    );

    await client.query("COMMIT");
    return result.rows.length;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
