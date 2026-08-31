import { createTodo, updateTodo } from "@/app/actions/todos";
import { TodoForm } from "@/components/todos/todo-form";
import { getTodoForUser } from "@/lib/todos";
import { requireSession } from "@/lib/session";
import { getCurrentCalendarDay } from "@/lib/timezone";
import { notFound } from "next/navigation";

export async function NewTodoEditor() {
  await requireSession();
  const currentDay = getCurrentCalendarDay();

  return (
    <TodoForm
      action={createTodo}
      description=""
      todoDate={currentDay}
      minimumTodoDate={currentDay}
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
  const currentDay = getCurrentCalendarDay();
  const todo = await getTodoForUser(session.user.id, todoId);

  if (!todo || todo.todoDate < currentDay) {
    notFound();
  }

  return (
    <TodoForm
      action={updateTodo.bind(null, todo.id)}
      description={todo.description}
      todoDate={todo.todoDate}
      minimumTodoDate={currentDay}
      submitIcon="save"
      submitLabel="Salvar alterações"
    />
  );
}
