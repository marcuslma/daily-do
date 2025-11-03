import {
  differenceInDays,
  format,
  isPast,
  isToday,
  isTomorrow,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onAddSubTask?: (todoId: string, text: string) => void;
  onToggleSubTask?: (todoId: string, subTaskId: string) => void;
  onDeleteSubTask?: (todoId: string, subTaskId: string) => void;
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  medium:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
}: TodoItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const formattedDate = new Date(todo.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getDueDateInfo = () => {
    if (!todo.dueDate) {
      return null;
    }

    const dueDate = new Date(todo.dueDate);
    const now = new Date();
    const isOverdue = isPast(dueDate) && !isToday(dueDate) && !todo.completed;
    const isDueToday = isToday(dueDate);
    const isDueTomorrow = isTomorrow(dueDate);
    const daysUntilDue = differenceInDays(dueDate, now);

    let label = format(dueDate, "PPP", { locale: ptBR });
    let color = "text-muted-foreground";
    let Icon = CalendarClock;

    if (isOverdue) {
      label = `Venceu há ${Math.abs(daysUntilDue)} dia${Math.abs(daysUntilDue) !== 1 ? "s" : ""}`;
      color = "text-red-600 dark:text-red-400";
      Icon = AlertCircle;
    } else if (isDueToday) {
      label = "Vence hoje";
      color = "text-orange-600 dark:text-orange-400";
      Icon = AlertCircle;
    } else if (isDueTomorrow) {
      label = "Vence amanhã";
      color = "text-yellow-600 dark:text-yellow-400";
    }

    return { label, color, Icon };
  };

  const dueDateInfo = getDueDateInfo();

  const hasSubTasks = todo.subTasks && todo.subTasks.length > 0;
  const completedSubTasks = hasSubTasks
    ? todo.subTasks.filter((st) => st.completed).length
    : 0;
  const totalSubTasks = hasSubTasks ? todo.subTasks.length : 0;
  const subTaskProgress =
    totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  const handleAddSubTask = () => {
    if (newSubTaskText.trim() && onAddSubTask) {
      onAddSubTask(todo.id, newSubTaskText.trim());
      setNewSubTaskText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddSubTask();
    }
  };

  return (
    <div className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <Checkbox
        checked={todo.completed}
        className="mt-0.5"
        onCheckedChange={() => onToggle(todo.id)}
      />

      <div className="min-w-0 flex-1 space-y-2">
        <p
          className={cn(
            "wrap-break-word flex items-center gap-2 font-medium text-sm leading-relaxed",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.emoji && <span className="text-lg">{todo.emoji}</span>}
          <span>{todo.text}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formattedDate}</span>
          </div>

          {dueDateInfo && (
            <div
              className={cn(
                "flex items-center gap-1 font-medium",
                dueDateInfo.color
              )}
            >
              <dueDateInfo.Icon className="size-3" />
              <span>{dueDateInfo.label}</span>
            </div>
          )}

          <Badge className={cn("text-xs", priorityColors[todo.priority])}>
            {priorityLabels[todo.priority]}
          </Badge>

          {todo.tags.map((tag) => (
            <Badge className="text-xs" key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {hasSubTasks && (
          <Collapsible onOpenChange={setIsOpen} open={isOpen}>
            <div className="mt-2 flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button className="h-6 px-2 text-xs" size="sm" variant="ghost">
                  {isOpen ? (
                    <ChevronDown className="mr-1 size-3" />
                  ) : (
                    <ChevronRight className="mr-1 size-3" />
                  )}
                  <span className="text-muted-foreground">
                    {completedSubTasks}/{totalSubTasks} subtarefas
                  </span>
                </Button>
              </CollapsibleTrigger>
              <Progress className="h-1.5 flex-1" value={subTaskProgress} />
            </div>

            <CollapsibleContent className="mt-3 space-y-2">
              {todo.subTasks.map((subTask) => (
                <div className="ml-4 flex items-center gap-2" key={subTask.id}>
                  <Checkbox
                    checked={subTask.completed}
                    className="size-3.5"
                    onCheckedChange={() =>
                      onToggleSubTask?.(todo.id, subTask.id)
                    }
                  />
                  <span
                    className={cn(
                      "flex-1 text-xs",
                      subTask.completed && "text-muted-foreground line-through"
                    )}
                  >
                    {subTask.text}
                  </span>
                  <Button
                    className="size-5 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteSubTask?.(todo.id, subTask.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              {onAddSubTask && (
                <div className="mt-2 ml-4 flex items-center gap-2">
                  <Input
                    className="h-7 text-xs"
                    onChange={(e) => setNewSubTaskText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Adicionar subtarefa..."
                    value={newSubTaskText}
                  />
                  <Button
                    className="size-7"
                    disabled={!newSubTaskText.trim()}
                    onClick={handleAddSubTask}
                    size="icon"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          className="text-muted-foreground hover:text-primary"
          onClick={() => onEdit(todo)}
          size="icon-sm"
          variant="ghost"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(todo.id)}
          size="icon-sm"
          variant="ghost"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
