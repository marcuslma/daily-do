import { EditTodoEditor } from "@/components/todos/todo-editor";
import { TodoModal } from "@/components/todos/todo-modal";

type EditTodoModalPageProps = {
  params: Promise<{ todoId: string }>;
};

export default async function EditTodoModalPage({
  params,
}: EditTodoModalPageProps) {
  const { todoId } = await params;

  return (
    <TodoModal title="Editar tarefa">
      <EditTodoEditor todoId={todoId} />
    </TodoModal>
  );
}
