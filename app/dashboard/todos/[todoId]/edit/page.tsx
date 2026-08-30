import { EditTodoEditor } from "@/components/todos/todo-editor";
import { TodoPage } from "@/components/todos/todo-page";

type EditTodoPageProps = {
  params: Promise<{ todoId: string }>;
};

export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { todoId } = await params;

  return (
    <TodoPage backHref="/dashboard" title="Editar tarefa">
      <EditTodoEditor todoId={todoId} />
    </TodoPage>
  );
}
