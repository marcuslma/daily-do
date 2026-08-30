import "server-only";
import { db } from "@/lib/db";

export type Todo = {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
};

const todoColumns =
  'id, description, created_at AS "createdAt", updated_at AS "updatedAt", completed_at AS "completedAt"';

export async function listTodosForUser(userId: string): Promise<Todo[]> {
  const result = await db.query<Todo>(
    "SELECT " +
      todoColumns +
      " FROM todo WHERE user_id = $1 ORDER BY completed_at IS NOT NULL ASC, created_at DESC",
    [userId],
  );

  return result.rows;
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
): Promise<Todo> {
  const result = await db.query<Todo>(
    "INSERT INTO todo (user_id, description) VALUES ($1, $2) RETURNING " +
      todoColumns,
    [userId, description],
  );

  return result.rows[0] as Todo;
}

export async function updateTodoForUser(
  userId: string,
  todoId: string,
  description: string,
): Promise<Todo | null> {
  const result = await db.query<Todo>(
    "UPDATE todo SET description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING " +
      todoColumns,
    [todoId, userId, description],
  );

  return result.rows[0] ?? null;
}

export async function setTodoCompletionForUser(
  userId: string,
  todoId: string,
  completed: boolean,
): Promise<Todo | null> {
  const result = await db.query<Todo>(
    "UPDATE todo SET completed_at = CASE WHEN $3 THEN CURRENT_TIMESTAMP ELSE NULL END, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING " +
      todoColumns,
    [todoId, userId, completed],
  );

  return result.rows[0] ?? null;
}
