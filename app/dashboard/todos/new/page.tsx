import { NewTodoEditor } from "@/components/todos/todo-editor";
import { TodoPage } from "@/components/todos/todo-page";

export default function NewTodoPage() {
  return (
    <TodoPage backHref="/dashboard" title="Nova tarefa">
      <NewTodoEditor />
    </TodoPage>
  );
}
