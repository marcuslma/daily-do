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
  subTasks: SubTask[];
  emoji?: string;
  description?: string;
  categoryId?: string;
  recurrence?: RecurrenceConfig;
}

export type Filter = "all" | "active" | "completed" | "overdue";

export type SortBy = "createdAt" | "dueDate" | "priority" | "text";
export type SortDirection = "asc" | "desc";

export interface TodoStats {
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
}
