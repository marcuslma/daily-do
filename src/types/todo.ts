export type Priority = "low" | "medium" | "high";

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface RecurrenceConfig {
  type: RecurrenceType;
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
  lastCreated?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  subTasks: SubTask[];
  emoji?: string;
  description?: string;
  categoryId?: string;
  recurrence?: RecurrenceConfig;
}

export type Filter = "active" | "completed" | "overdue";

export type SortBy = "createdAt" | "dueDate" | "priority" | "text";
export type SortDirection = "asc" | "desc";

export interface TodoStats {
  // Visão Geral
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };

  // Produtividade no Tempo
  productivity: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    streak: number;
  };

  // Gestão de Tempo
  timeManagement: {
    totalEstimatedMinutes: number;
    completedMinutes: number;
    pendingMinutes: number;
    byPriority: {
      high: number;
      medium: number;
      low: number;
    };
  };

  // Categorias e Tags
  categoriesAndTags: {
    topCategories: Array<{
      categoryId: string;
      count: number;
      completionRate: number;
    }>;
    uncategorized: number;
    topTags: Array<{ tag: string; count: number }>;
  };

  // Prazos e Pontualidade
  deadlines: {
    dueToday: number;
    dueTomorrow: number;
    dueThisWeek: number;
    onTimeRate: number;
    averageDelayDays: number;
  };

  // Subtarefas
  subtasks: {
    total: number;
    completed: number;
    completionRate: number;
    tasksWithIncompleteSubtasks: number;
  };
}
