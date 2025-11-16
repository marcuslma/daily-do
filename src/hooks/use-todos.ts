import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  isPast,
  isSameDay,
  isToday,
  isTomorrow,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
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
    recurrence?: Todo["recurrence"],
    customId?: string,
    startTime?: Date,
    endTime?: Date
  ) => {
    const newTodo: Todo = {
      id: customId ?? crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
      tags,
      dueDate,
      startTime,
      endTime,
      subTasks,
      emoji,
      description,
      categoryId,
      recurrence,
    };
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo.id;
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
    const now = new Date();
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

    // Produtividade no Tempo
    const completedToday = todos.filter(
      (t) => t.completed && t.createdAt && isToday(new Date(t.createdAt))
    ).length;

    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const completedThisWeek = todos.filter(
      (t) =>
        t.completed &&
        t.createdAt &&
        isWithinInterval(new Date(t.createdAt), {
          start: weekStart,
          end: weekEnd,
        })
    ).length;

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const completedThisMonth = todos.filter(
      (t) =>
        t.completed &&
        t.createdAt &&
        isWithinInterval(new Date(t.createdAt), {
          start: monthStart,
          end: monthEnd,
        })
    ).length;

    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    let checkDate = new Date(now);
    const completedDates = new Set(
      todos
        .filter((t) => t.completed && t.createdAt)
        .map((t) => new Date(t.createdAt).toDateString())
    );

    while (completedDates.has(checkDate.toDateString())) {
      streak += 1;
      checkDate = addDays(checkDate, -1);
    }

    // Gestão de Tempo
    const calculateMinutes = (startTime?: Date, endTime?: Date): number => {
      if (!(startTime && endTime)) {
        return 0;
      }
      const start = new Date(startTime);
      const end = new Date(endTime);
      return Math.max(
        0,
        Math.floor((end.getTime() - start.getTime()) / 60_000)
      );
    };

    const totalEstimatedMinutes = todos.reduce(
      (sum, t) => sum + calculateMinutes(t.startTime, t.endTime),
      0
    );

    const completedMinutes = todos
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + calculateMinutes(t.startTime, t.endTime), 0);

    const pendingMinutes = todos
      .filter((t) => !t.completed)
      .reduce((sum, t) => sum + calculateMinutes(t.startTime, t.endTime), 0);

    const timeByPriority = {
      high: todos
        .filter((t) => !t.completed && t.priority === "high")
        .reduce((sum, t) => sum + calculateMinutes(t.startTime, t.endTime), 0),
      medium: todos
        .filter((t) => !t.completed && t.priority === "medium")
        .reduce((sum, t) => sum + calculateMinutes(t.startTime, t.endTime), 0),
      low: todos
        .filter((t) => !t.completed && t.priority === "low")
        .reduce((sum, t) => sum + calculateMinutes(t.startTime, t.endTime), 0),
    };

    // Categorias e Tags
    const categoryMap = new Map<string, { count: number; completed: number }>();

    for (const todo of todos) {
      if (todo.categoryId) {
        const current = categoryMap.get(todo.categoryId) || {
          count: 0,
          completed: 0,
        };
        categoryMap.set(todo.categoryId, {
          count: current.count + 1,
          completed: current.completed + (todo.completed ? 1 : 0),
        });
      }
    }

    const topCategories = Array.from(categoryMap.entries())
      .map(([categoryId, data]) => ({
        categoryId,
        count: data.count,
        completionRate: (data.completed / data.count) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const uncategorized = todos.filter((t) => !t.categoryId).length;

    const tagMap = new Map<string, number>();
    for (const todo of todos) {
      for (const tag of todo.tags) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }

    const topTags = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Prazos e Pontualidade
    const dueToday = todos.filter(
      (t) => !t.completed && t.dueDate && isToday(new Date(t.dueDate))
    ).length;

    const dueTomorrow = todos.filter(
      (t) => !t.completed && t.dueDate && isTomorrow(new Date(t.dueDate))
    ).length;

    const dueThisWeek = todos.filter(
      (t) =>
        !t.completed &&
        t.dueDate &&
        isWithinInterval(new Date(t.dueDate), { start: now, end: weekEnd }) &&
        !isToday(new Date(t.dueDate)) &&
        !isTomorrow(new Date(t.dueDate))
    ).length;

    // Calculate on-time rate
    const completedWithDueDate = todos.filter(
      (t) => t.completed && t.dueDate && t.createdAt
    );

    const completedOnTime = completedWithDueDate.filter((t) => {
      const dueDate = new Date(t.dueDate!);
      const completedDate = new Date(t.createdAt);
      return (
        completedDate <= dueDate ||
        isSameDay(completedDate, dueDate) ||
        isToday(dueDate)
      );
    }).length;

    const onTimeRate =
      completedWithDueDate.length > 0
        ? (completedOnTime / completedWithDueDate.length) * 100
        : 100;

    // Calculate average delay
    const delays = completedWithDueDate
      .map((t) => {
        const dueDate = new Date(t.dueDate!);
        const completedDate = new Date(t.createdAt);
        return Math.max(0, differenceInDays(completedDate, dueDate));
      })
      .filter((delay) => delay > 0);

    const averageDelayDays =
      delays.length > 0
        ? delays.reduce((sum, delay) => sum + delay, 0) / delays.length
        : 0;

    // Subtarefas
    const allSubtasks = todos.flatMap((t) => t.subTasks);
    const totalSubtasks = allSubtasks.length;
    const completedSubtasks = allSubtasks.filter((st) => st.completed).length;
    const subtaskCompletionRate =
      totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const tasksWithIncompleteSubtasks = todos.filter(
      (t) => t.subTasks.length > 0 && t.subTasks.some((st) => !st.completed)
    ).length;

    return {
      total,
      completed,
      active,
      overdue,
      completionRate,
      byPriority,
      productivity: {
        today: completedToday,
        thisWeek: completedThisWeek,
        thisMonth: completedThisMonth,
        streak,
      },
      timeManagement: {
        totalEstimatedMinutes,
        completedMinutes,
        pendingMinutes,
        byPriority: timeByPriority,
      },
      categoriesAndTags: {
        topCategories,
        uncategorized,
        topTags,
      },
      deadlines: {
        dueToday,
        dueTomorrow,
        dueThisWeek,
        onTimeRate,
        averageDelayDays,
      },
      subtasks: {
        total: totalSubtasks,
        completed: completedSubtasks,
        completionRate: subtaskCompletionRate,
        tasksWithIncompleteSubtasks,
      },
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
