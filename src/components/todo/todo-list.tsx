import { CheckCircle2 } from "lucide-react";
import type { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onAddSubTask?: (todoId: string, text: string) => void;
  onToggleSubTask?: (todoId: string, subTaskId: string) => void;
  onDeleteSubTask?: (todoId: string, subTaskId: string) => void;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <CheckCircle2 className="mx-auto mb-3 size-12 opacity-20" />
        <p className="text-sm">Nenhuma tarefa encontrada</p>
        <p className="mt-1 text-xs">Adicione uma nova tarefa acima</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          onAddSubTask={onAddSubTask}
          onDelete={onDelete}
          onDeleteSubTask={onDeleteSubTask}
          onEdit={onEdit}
          onToggle={onToggle}
          onToggleSubTask={onToggleSubTask}
          todo={todo}
        />
      ))}
    </div>
  );
}
