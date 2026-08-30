import { createTodo, updateTodo } from "@/app/actions/todos";
import { TodoForm } from "@/components/todos/todo-form";
import { getTodoForUser } from "@/lib/todos";
import { requireSession } from "@/lib/session";
import { getCurrentCalendarDay } from "@/lib/timezone";
import { notFound } from "next/navigation";

export async function NewTodoEditor() {
  await requireSession();

  return (
    <TodoForm
      action={createTodo}
      description=""
      submitIcon="create"
      submitLabel="Criar tarefa"
    />
  );
}

type EditTodoEditorProps = {
  todoId: string;
};

export async function EditTodoEditor({ todoId }: EditTodoEditorProps) {
  const session = await requireSession();
  const todo = await getTodoForUser(session.user.id, todoId);

  if (!todo || todo.todoDate !== getCurrentCalendarDay()) {
    notFound();
  }

  return (
    <TodoForm
      action={updateTodo.bind(null, todo.id)}
      description={todo.description}
      submitIcon="save"
      submitLabel="Salvar alterações"
    />
  );
}
