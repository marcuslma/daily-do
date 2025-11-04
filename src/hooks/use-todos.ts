import { addDays, addMonths, isPast, isToday } from "date-fns";
import { useMemo } from "react";
import type {
  Filter,
  RecurrenceConfig,
  SortBy,
  SortDirection,
  SubTask,
  Todo,
  TodoStats,
} from "@/types/todo";
import { useLocalStorage } from "./use-local-storage";

// Advanced search regex patterns
const PRIORITY_REGEX = /priority:(high|medium|low)/;
const TAG_REGEX = /tag:(\w+)/;
const OVERDUE_REGEX = /overdue:(true|false)/;
const DUE_REGEX = /due:(today|tomorrow|week)/;

// Helper function to calculate next due date based on recurrence
function calculateNextDueDate(
  currentDate: Date | undefined,
  recurrence: RecurrenceConfig
): Date | undefined {
  if (!currentDate) {
    return;
  }

  const baseDate = new Date(currentDate);

  switch (recurrence.type) {
    case "daily":
      return addDays(baseDate, recurrence.interval);
    case "weekly": {
      // For weekly, add 7 days times the interval
      return addDays(baseDate, 7 * recurrence.interval);
    }
    case "monthly":
      return addMonths(baseDate, recurrence.interval);
    default:
      return;
  }
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("daily-do-todos", []);

  const addTodo = (
    text: string,
    priority: Todo["priority"] = "medium",
    tags: string[] = [],
    dueDate?: Date,
    subTasks: SubTask[] = [],
    emoji?: string,
    description?: string,
    categoryId?: string,
    recurrence?: Todo["recurrence"]
  ) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
      tags,
      dueDate,
      subTasks,
      emoji,
      description,
      categoryId,
      recurrence,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => {
      const todo = prev.find((t) => t.id === id);
      if (!todo) {
        return prev;
      }

      // Check if marking as completed and has recurrence
      if (
        !todo.completed &&
        todo.recurrence &&
        todo.recurrence.type !== "none"
      ) {
        // Calculate next due date
        const nextDueDate = calculateNextDueDate(todo.dueDate, todo.recurrence);

        // Create new recurring task
        const newRecurringTodo: Todo = {
          ...todo,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: new Date(),
          dueDate: nextDueDate,
          subTasks: todo.subTasks.map((st) => ({
            ...st,
            id: crypto.randomUUID(),
            completed: false,
          })),
          recurrence: {
            ...todo.recurrence,
            lastCreated: new Date(),
          },
        };

        // Mark current as completed and add new one
        return [
          newRecurringTodo,
          ...prev.map((t) => (t.id === id ? { ...t, completed: true } : t)),
        ];
      }

      // Normal toggle
      return prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
    });
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filterTodos = (filter: Filter, searchQuery?: string) => {
    let filtered = todos;

    // Apply status filter
    switch (filter) {
      case "active":
        filtered = filtered.filter((todo) => !todo.completed);
        break;
      case "completed":
        filtered = filtered.filter((todo) => todo.completed);
        break;
      case "overdue":
        filtered = filtered.filter((todo) => {
          if (!todo.dueDate || todo.completed) {
            return false;
          }

          const dueDate = new Date(todo.dueDate);
          return isPast(dueDate) && !isToday(dueDate);
        });
        break;
      default:
        break;
    }

    // Apply advanced search filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();

      // Check for advanced syntax
      const priorityMatch = query.match(PRIORITY_REGEX);
      const tagMatch = query.match(TAG_REGEX);
      const overdueMatch = query.match(OVERDUE_REGEX);
      const dueMatch = query.match(DUE_REGEX);

      filtered = filtered.filter((todo) => {
        // Priority filter
        if (priorityMatch && todo.priority !== priorityMatch[1]) {
          return false;
        }

        // Tag filter
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          if (!todo.tags.some((tag) => tag.toLowerCase().includes(tagName))) {
            return false;
          }
        }

        // Overdue filter
        if (overdueMatch) {
          const shouldBeOverdue = overdueMatch[1] === "true";
          const isOverdue = todo.dueDate
            ? isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate))
            : false;

          if (isOverdue !== shouldBeOverdue) {
            return false;
          }
        }

        // Due date filter
        if (dueMatch && todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const weekFromNow = new Date(now);
          weekFromNow.setDate(weekFromNow.getDate() + 7);

          switch (dueMatch[1]) {
            case "today":
              if (!isToday(dueDate)) {
                return false;
              }
              break;
            case "tomorrow":
              if (dueDate.toDateString() !== tomorrow.toDateString()) {
                return false;
              }
              break;
            case "week":
              if (dueDate > weekFromNow) {
                return false;
              }
              break;
            default:
              break;
          }
        }

        // Remove syntax from query for text search
        const cleanQuery = query
          .replace(/priority:(high|medium|low)/g, "")
          .replace(/tag:\w+/g, "")
          .replace(/overdue:(true|false)/g, "")
          .replace(/due:(today|tomorrow|week)/g, "")
          .trim();

        // Text search (if there's remaining text after removing syntax)
        if (cleanQuery) {
          return (
            todo.text.toLowerCase().includes(cleanQuery) ||
            todo.tags.some((tag) => tag.toLowerCase().includes(cleanQuery))
          );
        }

        return true;
      });
    }

    return filtered;
  };

  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    const overdue = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) {
        return false;
      }

      const dueDate = new Date(todo.dueDate);
      return isPast(dueDate) && !isToday(dueDate);
    }).length;

    const byPriority = {
      high: todos.filter((t) => !t.completed && t.priority === "high").length,
      medium: todos.filter((t) => !t.completed && t.priority === "medium")
        .length,
      low: todos.filter((t) => !t.completed && t.priority === "low").length,
    };

    return {
      total,
      completed,
      active,
      overdue,
      completionRate,
      byPriority,
    };
  }, [todos]);

  const importTodos = (importedTodos: Todo[]) => {
    setTodos(importedTodos);
  };

  const addSubTask = (todoId: string, text: string) => {
    const newSubTask: SubTask = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? { ...todo, subTasks: [...todo.subTasks, newSubTask] }
          : todo
      )
    );
  };

  const toggleSubTask = (todoId: string, subTaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: todo.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : todo
      )
    );
  };

  const deleteSubTask = (todoId: string, subTaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: todo.subTasks.filter(
                (subTask) => subTask.id !== subTaskId
              ),
            }
          : todo
      )
    );
  };

  const updateSubTask = (todoId: string, subTaskId: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: todo.subTasks.map((subTask) =>
                subTask.id === subTaskId ? { ...subTask, text } : subTask
              ),
            }
          : todo
      )
    );
  };

  const sortTodos = (
    todosToSort: Todo[],
    sortBy: SortBy,
    direction: SortDirection
  ): Todo[] => {
    const sorted = [...todosToSort];

    sorted.sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case "createdAt":
          compareResult =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "dueDate":
          // Tarefas sem data vão para o final
          if (!(a.dueDate || b.dueDate)) {
            return 0;
          }
          if (!a.dueDate) {
            return 1;
          }
          if (!b.dueDate) {
            return -1;
          }

          compareResult =
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          compareResult = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case "text":
          compareResult = a.text.localeCompare(b.text, "pt-BR", {
            sensitivity: "base",
          });
          break;
        default:
          break;
      }

      return direction === "asc" ? compareResult : -compareResult;
    });

    return sorted;
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    filterTodos,
    sortTodos,
    importTodos,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    updateSubTask,
    stats,
  };
}
