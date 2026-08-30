"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TodoActionState } from "@/lib/todo-action-state";
import {
  todoCompletionSchema,
  todoDescriptionSchema,
  todoIdSchema,
} from "@/lib/todo-schemas";
import {
  createTodoForUser,
  setTodoCompletionForUser,
  updateTodoForUser,
} from "@/lib/todos";
import { requireSession } from "@/lib/session";

function getDescription(formData: FormData): string {
  const description = formData.get("description");

  return typeof description === "string" ? description : "";
}

export async function createTodo(
  _previousState: TodoActionState,
  formData: FormData,
): Promise<TodoActionState> {
  const session = await requireSession();
  const parsed = todoDescriptionSchema.safeParse({
    description: getDescription(formData),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTodoForUser(session.user.id, parsed.data.description);
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
  const parsed = todoCompletionSchema.safeParse({ todoId, completed });

  if (!parsed.success) {
    return;
  }

  const todo = await setTodoCompletionForUser(
    session.user.id,
    parsed.data.todoId,
    parsed.data.completed,
  );

  if (todo) {
    revalidatePath("/dashboard");
  }
}
