import { HelpCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Filter } from "@/types/todo";

interface TodoFiltersProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCount: number;
  completedCount: number;
  overdueCount: number;
}

export function TodoFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  activeCount,
  completedCount,
  overdueCount,
}: TodoFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          className="pr-20"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tarefas... (ex: priority:high tag:trabalho)"
          value={searchQuery}
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="size-4 cursor-help text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs" side="left">
              <div className="space-y-1">
                <p className="font-semibold">Busca Avançada:</p>
                <p>
                  <code className="rounded bg-background/20 px-1">
                    priority:high
                  </code>{" "}
                  - Por prioridade
                </p>
                <p>
                  <code className="rounded bg-background/20 px-1">
                    tag:trabalho
                  </code>{" "}
                  - Por tag
                </p>
                <p>
                  <code className="rounded bg-background/20 px-1">
                    due:today
                  </code>{" "}
                  - Vence hoje
                </p>
                <p>
                  <code className="rounded bg-background/20 px-1">
                    due:tomorrow
                  </code>{" "}
                  - Vence amanhã
                </p>
                <p>
                  <code className="rounded bg-background/20 px-1">
                    due:week
                  </code>{" "}
                  - Vence esta semana
                </p>
                <p>
                  <code className="rounded bg-background/20 px-1">
                    overdue:true
                  </code>{" "}
                  - Atrasadas
                </p>
                <p className="mt-2 text-xs opacity-80">
                  Combine filtros e texto livre!
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          <Search className="size-4 text-muted-foreground" />
        </div>
      </div>

      <Tabs
        onValueChange={(value) => onFilterChange(value as Filter)}
        value={filter}
      >
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="active">
            Pendentes ({activeCount})
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="overdue">
            Atrasadas ({overdueCount})
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="completed">
            Concluídas ({completedCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
