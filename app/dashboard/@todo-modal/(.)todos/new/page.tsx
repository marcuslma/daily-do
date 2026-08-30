import { NewTodoEditor } from "@/components/todos/todo-editor";
import { TodoModal } from "@/components/todos/todo-modal";

export default function NewTodoModalPage() {
  return (
    <TodoModal title="Nova tarefa">
      <NewTodoEditor />
    </TodoModal>
  );
}
