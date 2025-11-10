import { useMemo } from "react";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  type Feature,
} from "@/components/ui/shadcn-io/calendar";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

type CalendarViewProps = {
  todos: Todo[];
  onTodoClick?: (todo: Todo) => void;
  className?: string;
};

// Mapeia prioridades para cores
const priorityColors: Record<string, string> = {
  high: "#ef4444", // red-500
  medium: "#f59e0b", // amber-500
  low: "#10b981", // green-500
};

// Converte Todo para Feature (formato esperado pelo Calendar)
const todoToFeature = (todo: Todo): Feature | null => {
  if (!todo.dueDate) {
    return null;
  }

  const color = priorityColors[todo.priority] || "#6b7280"; // gray-500 como fallback

  return {
    id: todo.id,
    name: `${todo.emoji || ""} ${todo.text}`.trim(),
    startAt: todo.dueDate,
    endAt: todo.dueDate,
    status: {
      id: todo.completed ? "completed" : todo.priority,
      name: todo.completed ? "Completed" : todo.priority,
      color: todo.completed ? "#9ca3af" : color, // gray-400 se completado
    },
  };
};

export function CalendarView({
  todos,
  onTodoClick,
  className,
}: CalendarViewProps) {
  // Converte todos para features, filtrando os que não têm dueDate
  const features = useMemo(
    () =>
      todos
        .map(todoToFeature)
        .filter((feature): feature is Feature => feature !== null),
    [todos]
  );

  // Mapeia features de volta para todos para o clique
  const featureToTodoMap = useMemo(() => {
    const map = new Map<string, Todo>();
    for (const todo of todos) {
      if (todo.dueDate) {
        map.set(todo.id, todo);
      }
    }
    return map;
  }, [todos]);

  const handleFeatureClick = (feature: Feature) => {
    const todo = featureToTodoMap.get(feature.id);
    if (todo && onTodoClick) {
      onTodoClick(todo);
    }
  };

  return (
    <CalendarProvider
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      locale="pt-BR"
      startDay={0}
    >
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker end={2030} start={2020} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>

      <CalendarHeader />

      <CalendarBody features={features}>
        {({ feature }) => (
          <button
            className="w-full cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => handleFeatureClick(feature)}
            type="button"
          >
            <CalendarItem feature={feature} />
          </button>
        )}
      </CalendarBody>
    </CalendarProvider>
  );
}
