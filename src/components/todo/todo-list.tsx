import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  manualSortEnabled?: boolean;
  onReorder?: (todos: Todo[]) => void;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  manualSortEnabled = false,
  onReorder,
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTodos = [...todos];
        const [movedItem] = reorderedTodos.splice(oldIndex, 1);
        reorderedTodos.splice(newIndex, 0, movedItem);
        onReorder?.(reorderedTodos);
      }
    }
  };

  if (todos.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <CheckCircle2 className="mx-auto mb-3 size-12 opacity-20" />
        <p className="text-sm">Nenhuma tarefa encontrada</p>
        <p className="mt-1 text-xs">Adicione uma nova tarefa acima</p>
      </div>
    );
  }

  if (!manualSortEnabled) {
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

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              draggable
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
      </SortableContext>
    </DndContext>
  );
}
