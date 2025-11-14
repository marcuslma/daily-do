import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { getDay, getDaysInMonth, isSameDay } from "date-fns";
import { type ReactNode, useMemo, useState } from "react";
import {
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  type Feature,
  useCalendarMonth,
  useCalendarYear,
} from "@/components/ui/shadcn-io/calendar";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

type CalendarViewDraggableProps = {
  todos: Todo[];
  onTodoClick?: (todo: Todo) => void;
  onTodoDateChange?: (todoId: string, newDate: Date) => void;
  className?: string;
};

// Mapeia prioridades para cores
const priorityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

// Converte Todo para Feature
const todoToFeature = (todo: Todo): Feature | null => {
  if (!todo.dueDate) {
    return null;
  }

  const color = priorityColors[todo.priority] || "#6b7280";

  return {
    id: todo.id,
    name: `${todo.emoji || ""} ${todo.text}`.trim(),
    startAt: todo.dueDate,
    endAt: todo.dueDate,
    status: {
      id: todo.completed ? "completed" : todo.priority,
      name: todo.completed ? "Completed" : todo.priority,
      color: todo.completed ? "#9ca3af" : color,
    },
  };
};

// Componente draggable para cada tarefa
function DraggableFeature({
  feature,
  onClick,
}: {
  feature: Feature;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: feature.id,
    data: { feature },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-move transition-opacity",
        isDragging && "opacity-50"
      )}
    >
      <button
        className="w-full text-left transition-opacity hover:opacity-80"
        onClick={onClick}
        type="button"
      >
        <CalendarItem feature={feature} />
      </button>
    </div>
  );
}

// Componente droppable para cada dia
function DroppableDay({
  day,
  month,
  year,
  features,
  onFeatureClick,
}: {
  day: number;
  month: number;
  year: number;
  features: Feature[];
  onFeatureClick: (feature: Feature) => void;
}) {
  const dateKey = `${year}-${month}-${day}`;
  const { setNodeRef, isOver } = useDroppable({
    id: dateKey,
    data: { day, month, year },
  });

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col gap-1 p-1 text-muted-foreground text-xs transition-colors",
        isOver && "bg-accent/50"
      )}
      ref={setNodeRef}
    >
      {day}
      <div>
        {features.slice(0, 3).map((feature) => (
          <DraggableFeature
            feature={feature}
            key={feature.id}
            onClick={() => onFeatureClick(feature)}
          />
        ))}
      </div>
      {features.length > 3 && (
        <span className="block text-muted-foreground text-xs">
          +{features.length - 3} more
        </span>
      )}
    </div>
  );
}

// Componente OutOfBoundsDay (dias de outros meses)
function OutOfBoundsDay({ day }: { day: number }) {
  return (
    <div className="relative h-full w-full bg-secondary p-1 text-muted-foreground text-xs">
      {day}
    </div>
  );
}

// CalendarBody customizado com drag-and-drop
function CalendarBodyDraggable({
  features,
  onFeatureClick,
}: {
  features: Feature[];
  onFeatureClick: (feature: Feature) => void;
}) {
  const [month] = useCalendarMonth();
  const [year] = useCalendarYear();
  const startDay = 0; // Domingo

  const currentMonthDate = useMemo(
    () => new Date(year, month, 1),
    [year, month]
  );
  const daysInMonth = useMemo(
    () => getDaysInMonth(currentMonthDate),
    [currentMonthDate]
  );
  const firstDay = useMemo(
    () => (getDay(currentMonthDate) - startDay + 7) % 7,
    [currentMonthDate]
  );

  const prevMonthData = useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
    const prevMonthDaysArray = Array.from(
      { length: prevMonthDays },
      (_, i) => i + 1
    );
    return { prevMonthDays, prevMonthDaysArray };
  }, [month, year]);

  const nextMonthData = useMemo(() => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
    const nextMonthDaysArray = Array.from(
      { length: nextMonthDays },
      (_, i) => i + 1
    );
    return { nextMonthDaysArray };
  }, [month, year]);

  const featuresByDay = useMemo(() => {
    const result: { [day: number]: Feature[] } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      result[day] = features.filter((feature) =>
        isSameDay(new Date(feature.endAt), new Date(year, month, day))
      );
    }
    return result;
  }, [features, daysInMonth, year, month]);

  const cells: Array<{ key: string; content: ReactNode; index: number }> = [];

  // Dias do mês anterior
  for (let i = 0; i < firstDay; i++) {
    const day =
      prevMonthData.prevMonthDaysArray[
        prevMonthData.prevMonthDays - firstDay + i
      ];

    if (day) {
      cells.push({
        key: `prev-${day}`,
        content: <OutOfBoundsDay day={day} />,
        index: cells.length,
      });
    }
  }

  // Dias do mês atual (droppable)
  for (let day = 1; day <= daysInMonth; day++) {
    const featuresForDay = featuresByDay[day] || [];

    cells.push({
      key: `current-${day}`,
      content: (
        <DroppableDay
          day={day}
          features={featuresForDay}
          month={month}
          onFeatureClick={onFeatureClick}
          year={year}
        />
      ),
      index: cells.length,
    });
  }

  // Dias do próximo mês
  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthData.nextMonthDaysArray[i];

      if (day) {
        cells.push({
          key: `next-${day}`,
          content: <OutOfBoundsDay day={day} />,
          index: cells.length,
        });
      }
    }
  }

  return (
    <div className="grid grow grid-cols-7">
      {cells.map((cell) => (
        <div
          className={cn(
            "relative aspect-square overflow-hidden border-t border-r",
            cell.index % 7 === 6 && "border-r-0"
          )}
          key={cell.key}
        >
          {cell.content}
        </div>
      ))}
    </div>
  );
}

export function CalendarViewDraggable({
  todos,
  onTodoClick,
  onTodoDateChange,
  className,
}: CalendarViewDraggableProps) {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  // Configurar sensors com distância mínima para ativar drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requer 8px de movimento para ativar o drag
      },
    })
  );

  const features = useMemo(
    () =>
      todos
        .map(todoToFeature)
        .filter((feature): feature is Feature => feature !== null),
    [todos]
  );

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

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const feature = features.find((f) => f.id === event.active.id);
    if (feature) {
      setActiveFeature(feature);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveFeature(null);

    if (!(over && onTodoDateChange)) {
      return;
    }

    const todoId = active.id as string;
    const dropData = over.data.current as
      | { day: number; month: number; year: number }
      | undefined;

    if (dropData) {
      const newDate = new Date(dropData.year, dropData.month, dropData.day);

      // Get the original todo to compare dates
      const originalTodo = featureToTodoMap.get(todoId);

      // Only update if the date actually changed
      if (originalTodo?.dueDate && isSameDay(originalTodo.dueDate, newDate)) {
        return; // Cancel event - same day
      }

      onTodoDateChange(todoId, newDate);
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
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

        <CalendarBodyDraggable
          features={features}
          onFeatureClick={handleFeatureClick}
        />
      </CalendarProvider>
      <DragOverlay>
        {activeFeature && (
          <div className="rounded-md border bg-card p-2 shadow-lg">
            <CalendarItem feature={activeFeature} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
