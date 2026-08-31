"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TodoActionState } from "@/lib/todo-action-state";
import type { TodoSyncActionState } from "@/lib/todo-sync-action-state";
import {
  todoCompletionSchema,
  todoDescriptionSchema,
  todoIdSchema,
} from "@/lib/todo-schemas";
import {
  createTodoForUser,
  copyOpenTodosFromYesterdayForUser,
  deleteTodoForUser,
  setTodoCompletionForUser,
  updateTodoForUser,
} from "@/lib/todos";
import { requireSession } from "@/lib/session";
import { getCurrentCalendarDay } from "@/lib/timezone";

function getDescription(formData: FormData): string {
  const description = formData.get("description");

  return typeof description === "string" ? description : "";
}

export async function createTodo(
  _previousState: TodoActionState,
  formData: FormData,
): Promise<TodoActionState> {
  const session = await requireSession();
  const currentDay = getCurrentCalendarDay();
  const parsed = todoDescriptionSchema.safeParse({
    description: getDescription(formData),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTodoForUser(
      session.user.id,
      parsed.data.description,
      currentDay,
    );
  } catch {
    return {
      message: "Não foi possível salvar a tarefa. Tente novamente.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateTodo(
  todoId: string,
  _previousState: TodoActionState,
  formData: FormData,
): Promise<TodoActionState> {
  const session = await requireSession();
  const currentDay = getCurrentCalendarDay();
  const parsedTodoId = todoIdSchema.safeParse(todoId);
  const parsed = todoDescriptionSchema.safeParse({
    description: getDescription(formData),
  });

  if (!parsedTodoId.success) {
    return {
      message: "Tarefa não encontrada.",
    };
  }

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let todo;

  try {
    todo = await updateTodoForUser(
      session.user.id,
      parsedTodoId.data,
      parsed.data.description,
      currentDay,
    );
  } catch {
    return {
      message: "Não foi possível salvar a tarefa. Tente novamente.",
    };
  }

  if (!todo) {
    return {
      message: "Tarefa não encontrada.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function toggleTodo(
  todoId: string,
  completed: boolean,
): Promise<void> {
  const session = await requireSession();
  const currentDay = getCurrentCalendarDay();
  const parsed = todoCompletionSchema.safeParse({ todoId, completed });

  if (!parsed.success) {
    return;
  }

  const todo = await setTodoCompletionForUser(
    session.user.id,
    parsed.data.todoId,
    parsed.data.completed,
    currentDay,
  );

  if (todo) {
    revalidatePath("/dashboard");
  }
}

export async function deleteTodo(todoId: string): Promise<void> {
  const session = await requireSession();
  const currentDay = getCurrentCalendarDay();
  const parsed = todoIdSchema.safeParse(todoId);

  if (!parsed.success) {
    return;
  }

  const todo = await deleteTodoForUser(
    session.user.id,
    parsed.data,
    currentDay,
  );

  if (todo) {
    revalidatePath("/dashboard");
  }
}

export async function synchronizePendingTodos(
  _previousState: TodoSyncActionState,
  _formData: FormData,
): Promise<TodoSyncActionState> {
  void _formData;

  const session = await requireSession();
  const currentDay = getCurrentCalendarDay();

  try {
    const copiedCount = await copyOpenTodosFromYesterdayForUser(
      session.user.id,
      currentDay,
    );

    revalidatePath("/dashboard");

    if (copiedCount === 0) {
      return {
        message: "Nenhuma tarefa pendente de ontem para copiar.",
        status: "success",
      };
    }

    return {
      message:
        copiedCount === 1
          ? "1 tarefa pendente sincronizada."
          : copiedCount + " tarefas pendentes sincronizadas.",
      status: "success",
    };
  } catch {
    return {
      message: "Não foi possível sincronizar as tarefas pendentes. Tente novamente.",
      status: "error",
    };
  }
}
