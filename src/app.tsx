import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { KeyboardShortcutsHelp } from "@/components/settings/keyboard-shortcuts-help";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { TodoCreateDialog } from "@/components/todo/todo-create-dialog";
import { TodoEditDialog } from "@/components/todo/todo-edit-dialog";
import { TodoFilters } from "@/components/todo/todo-filters";
import { TodoImportExport } from "@/components/todo/todo-import-export";
import { TodoList } from "@/components/todo/todo-list";
import { TodoSort } from "@/components/todo/todo-sort";
import { TodoStats } from "@/components/todo/todo-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useNotifications } from "@/hooks/use-notifications";
import { useTodos } from "@/hooks/use-todos";
import type { Filter, SortBy, SortDirection, Todo } from "@/types/todo";

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    filterTodos,
    sortTodos,
    clearCompleted,
    importTodos,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    stats,
  } = useTodos();
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  const notifications = useNotifications(todos);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "n",
      ctrl: true,
      description: "Nova tarefa",
      action: () => setIsCreateDialogOpen(true),
    },
    {
      key: "/",
      description: "Buscar tarefas",
      action: () => {
        const searchInput = document.querySelector(
          'input[placeholder*="Buscar"]'
        ) as HTMLInputElement;
        searchInput?.focus();
      },
    },
    {
      key: "?",
      shift: true,
      description: "Mostrar atalhos",
      action: () => setIsShortcutsHelpOpen(true),
    },
  ]);

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = filterTodos(filter, searchQuery);
    return sortTodos(filtered, sortBy, sortDirection);
  }, [filter, searchQuery, sortBy, sortDirection, filterTodos, sortTodos]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleAddTodo = (
    text: string,
    priority: Todo["priority"],
    tags: string[],
    dueDate?: Date,
    subTasks?: import("@/types/todo").SubTask[],
    emoji?: string,
    description?: string,
    categoryId?: string,
    recurrence?: import("@/types/todo").RecurrenceConfig
  ) => {
    addTodo(
      text,
      priority,
      tags,
      dueDate,
      subTasks,
      emoji,
      description,
      categoryId,
      recurrence
    );
    toast.success("Tarefa adicionada!", {
      description: text,
    });
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    toggleTodo(id);
    if (todo) {
      toast.success(
        todo.completed ? "Tarefa reaberta!" : "Tarefa concluída! 🎉",
        {
          description: todo.text,
        }
      );
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    deleteTodo(id);
    if (todo) {
      toast.success("Tarefa removida", {
        description: todo.text,
      });
    }
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    updateTodo(id, updates);
    toast.success("Tarefa atualizada!", {
      description: updates.text,
    });
  };

  const handleClearCompleted = () => {
    const count = stats.completed;
    clearCompleted();
    toast.success(
      `${count} tarefa${count !== 1 ? "s" : ""} concluída${count !== 1 ? "s" : ""} removida${count !== 1 ? "s" : ""}`
    );
  };

  const handleImport = (importedTodos: Todo[]) => {
    importTodos(importedTodos);
    toast.success(
      `${importedTodos.length} tarefa${importedTodos.length !== 1 ? "s" : ""} importada${importedTodos.length !== 1 ? "s" : ""}!`
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="space-y-2 text-center">
            <h1 className="flex items-center justify-center gap-3 font-bold text-4xl tracking-tight">
              <CheckCircle className="size-10 text-primary" />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Daily Do
              </span>
            </h1>
            <p className="text-muted-foreground">
              Organize suas tarefas diárias de forma simples e eficiente
            </p>
          </div>
          <div className="flex flex-1 justify-end gap-2">
            <NotificationSettings
              enabled={notifications.settings.enabled}
              hasPermission={notifications.hasPermission}
              isSupported={notifications.isSupported}
              minutesBefore={notifications.settings.minutesBefore}
              onRequestPermission={notifications.requestPermission}
              onUpdateSettings={notifications.updateSettings}
            />
            <TodoImportExport onImport={handleImport} todos={todos} />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Stats */}
        <TodoStats stats={stats} />

        {/* Filters and List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Minhas Tarefas</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
              <Plus className="mr-2 size-4" />
              Nova Tarefa
            </Button>
          </CardHeader>
          <CardHeader className="flex flex-row items-center justify-between pt-0">
            <div className="w-full" />
            {stats.completed > 0 && (
              <Button
                className="text-muted-foreground hover:text-destructive"
                onClick={handleClearCompleted}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="mr-2 size-4" />
                Limpar concluídas
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <TodoFilters
              activeCount={stats.active}
              completedCount={stats.completed}
              filter={filter}
              onFilterChange={setFilter}
              onSearchChange={setSearchQuery}
              overdueCount={stats.overdue}
              searchQuery={searchQuery}
            />
            <TodoSort
              direction={sortDirection}
              onDirectionChange={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              onSortChange={setSortBy}
              sortBy={sortBy}
            />
            <TodoList
              onAddSubTask={addSubTask}
              onDelete={handleDeleteTodo}
              onDeleteSubTask={deleteSubTask}
              onEdit={handleEditTodo}
              onToggle={handleToggleTodo}
              onToggleSubTask={toggleSubTask}
              todos={filteredAndSortedTodos}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs">
          Desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui
        </p>
      </div>

      {/* Create Dialog */}
      <TodoCreateDialog
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleAddTodo}
        open={isCreateDialogOpen}
      />

      {/* Edit Dialog */}
      <TodoEditDialog
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateTodo}
        open={isEditDialogOpen}
        todo={editingTodo}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        onOpenChange={setIsShortcutsHelpOpen}
        open={isShortcutsHelpOpen}
      />

      {/* Toaster */}
      <Toaster />
    </div>
  );
}

export default App;
