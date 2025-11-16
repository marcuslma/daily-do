import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  GripVertical,
  HelpCircle,
  List,
  ListTodo,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarViewDraggable } from "@/components/calendar-view-draggable";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { TodoCreateDialog } from "@/components/todo/todo-create-dialog";
import { TodoEditDialog } from "@/components/todo/todo-edit-dialog";
import { TodoFilters } from "@/components/todo/todo-filters";
import { TodoImportExport } from "@/components/todo/todo-import-export";
import { TodoList } from "@/components/todo/todo-list";
import { TodoSort } from "@/components/todo/todo-sort";
import { TodoStatsImproved } from "@/components/todo/todo-stats-improved";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCategories } from "@/hooks/use-categories";
import { useConfetti } from "@/hooks/use-confetti";
import { useManualSort } from "@/hooks/use-manual-sort";
import { useNotifications } from "@/hooks/use-notifications";
import { useTodos } from "@/hooks/use-todos";
import type { Filter, SortBy, SortDirection, Todo } from "@/types/todo";
import { KeyboardShortcutsHelp } from "./components/settings/keyboard-shortcuts-help";

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
  const { categories } = useCategories();
  const [filter, setFilter] = useState<Filter>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const notifications = useNotifications(todos);
  const manualSort = useManualSort();
  const { celebrate } = useConfetti();

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = filterTodos(filter, searchQuery);
    const sorted = sortTodos(filtered, sortBy, sortDirection);

    // Apply manual sort if enabled
    if (manualSort.enabled && manualSort.order.length > 0) {
      // Create a map for quick lookup
      const orderMap = new Map(
        manualSort.order.map((id, index) => [id, index])
      );
      // Sort based on the manual order, keeping unordered items at the end
      return [...sorted].sort((a, b) => {
        const indexA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const indexB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
      });
    }

    return sorted;
  }, [
    filter,
    searchQuery,
    sortBy,
    sortDirection,
    filterTodos,
    sortTodos,
    manualSort.enabled,
    manualSort.order,
  ]);

  // Initialize manual sort order when manual sort is first enabled
  useEffect(() => {
    if (
      manualSort.enabled &&
      manualSort.order.length === 0 &&
      todos.length > 0
    ) {
      manualSort.setOrder(todos.map((t) => t.id));
    }
    // Note: Using todos instead of filteredAndSortedTodos to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    manualSort.enabled,
    manualSort.order.length,
    manualSort.setOrder,
    todos.length,
    todos.map,
  ]);

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
    recurrence?: import("@/types/todo").RecurrenceConfig,
    startTime?: Date,
    endTime?: Date
  ) => {
    const newId = crypto.randomUUID();
    addTodo(
      text,
      priority,
      tags,
      dueDate,
      subTasks,
      emoji,
      description,
      categoryId,
      recurrence,
      newId,
      startTime,
      endTime
    );

    // Always add to manual sort order at the top
    manualSort.prependToOrder(newId);

    toast.success("Tarefa adicionada!", {
      description: text,
    });
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    toggleTodo(id);
    if (todo) {
      if (todo.completed) {
        // Task is being reopened
        toast.success("Tarefa reaberta!", {
          description: todo.text,
        });
      } else {
        // Task is being completed
        celebrate();
        toast.success("Tarefa concluída! 🎉", {
          description: todo.text,
        });
      }
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    deleteTodo(id);

    // Always remove from manual sort order
    manualSort.removeFromOrder(id);

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

  const handleReorder = (reorderedTodos: Todo[]) => {
    manualSort.updateOrder(reorderedTodos.map((t) => t.id));
  };

  const handleToggleManualSort = () => {
    if (manualSort.enabled) {
      toast.success("Ordenação manual desativada");
    } else {
      // When enabling, initialize with current order
      manualSort.setOrder(filteredAndSortedTodos.map((t) => t.id));
      toast.success("Ordenação manual ativada", {
        description: "Arraste as tarefas para reorganizá-las",
      });
    }
    manualSort.toggleManualSort();
  };

  const handleTodoDateChange = (todoId: string, newDate: Date) => {
    const todo = todos.find((t) => t.id === todoId);
    if (todo) {
      updateTodo(todoId, { dueDate: newDate });
      toast.success("Data da tarefa atualizada!", {
        description: `${todo.text} → ${format(newDate, "PP", { locale: ptBR })}`,
      });
    }
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
            <p className="bg-linear-to-r from-primary to-primary/60 bg-clip-text font-bold text-transparent first-letter:uppercase">
              {format(new Date(), "PPPP", { locale: ptBR })}
            </p>
          </div>
          <div className="flex flex-1 justify-end gap-2">
            <KeyboardShortcutsHelp
              setIsCreateDialogOpen={setIsCreateDialogOpen}
            />
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

        {/* Main Tabs */}
        <Tabs defaultValue="tasks">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="gap-2" value="tasks">
              <ListTodo className="size-4" />
              Minhas Tarefas
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="stats">
              <BarChart3 className="size-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent className="mt-6" value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Minhas Tarefas</CardTitle>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                    <Plus className="size-4" />
                    Nova Tarefa
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          setViewMode(viewMode === "list" ? "calendar" : "list")
                        }
                      >
                        {viewMode === "list" ? (
                          <>
                            <Calendar className="mr-2 size-4" />
                            Visualização em Calendário
                          </>
                        ) : (
                          <>
                            <List className="mr-2 size-4" />
                            Visualização em Lista
                          </>
                        )}
                      </DropdownMenuItem>
                      {stats.completed > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={handleClearCompleted}
                            variant="destructive"
                          >
                            <Trash className="mr-2 size-4" />
                            Limpar Concluídas
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {viewMode === "list" ? (
                  <>
                    <TodoFilters
                      activeCount={stats.active}
                      completedCount={stats.completed}
                      filter={filter}
                      onFilterChange={setFilter}
                      onSearchChange={setSearchQuery}
                      overdueCount={stats.overdue}
                      searchQuery={searchQuery}
                    />
                    <div className="flex items-center justify-between gap-4">
                      <TodoSort
                        direction={sortDirection}
                        onDirectionChange={() =>
                          setSortDirection(
                            sortDirection === "asc" ? "desc" : "asc"
                          )
                        }
                        onSortChange={setSortBy}
                        sortBy={sortBy}
                      />
                      <div className="flex flex-row items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="size-4 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {manualSort.enabled
                                ? "Arraste tarefas para reorganizá-las"
                                : "Ativar ordenação manual por arrastar e soltar"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <Toggle
                          aria-label="Ordenação Manual"
                          onPressedChange={handleToggleManualSort}
                          pressed={manualSort.enabled}
                          size="sm"
                          variant="outline"
                        >
                          <GripVertical className="size-4" />
                          Ordenação Manual
                        </Toggle>
                      </div>
                    </div>
                    <TodoList
                      manualSortEnabled={manualSort.enabled}
                      onAddSubTask={addSubTask}
                      onDelete={handleDeleteTodo}
                      onDeleteSubTask={deleteSubTask}
                      onEdit={handleEditTodo}
                      onReorder={handleReorder}
                      onToggle={handleToggleTodo}
                      onToggleSubTask={toggleSubTask}
                      todos={filteredAndSortedTodos}
                    />
                  </>
                ) : (
                  <CalendarViewDraggable
                    onTodoClick={handleEditTodo}
                    onTodoDateChange={handleTodoDateChange}
                    todos={filteredAndSortedTodos}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent className="mt-6" value="stats">
            <TodoStatsImproved categories={categories} stats={stats} />
          </TabsContent>
        </Tabs>

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

      {/* Toaster */}
      <Toaster />
    </div>
  );
}

export default App;
