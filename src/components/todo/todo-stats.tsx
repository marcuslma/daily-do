import {
  Check,
  CheckCircle,
  Circle,
  ListTodo,
  Signal,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TodoStats as Stats } from "@/types/todo";

interface TodoStatsProps {
  stats: Stats;
}

export function TodoStats({ stats }: TodoStatsProps) {
  return (
    <Card>
      <Accordion collapsible defaultValue="stats" type="single">
        <AccordionItem className="border-0" value="stats">
          <AccordionTrigger className="px-6 py-0 hover:no-underline">
            <span className="font-semibold text-lg">Estatísticas</span>
          </AccordionTrigger>
          <AccordionContent className="mt-6 pb-0">
            <div className="grid gap-6 px-6 md:grid-cols-2">
              {/* Visão Geral */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
                  <Check className="size-4" />
                  Visão Geral das Tarefas
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-muted-foreground text-xs">
                        Pendentes
                      </p>
                      <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                        {stats.active}
                      </p>
                    </div>
                    <Circle className="size-7 text-blue-600 opacity-20 dark:text-blue-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-muted-foreground text-xs">
                        Concluídas
                      </p>
                      <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                        {stats.completed}
                      </p>
                    </div>
                    <CheckCircle className="size-7 text-green-600 opacity-20 dark:text-green-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-muted-foreground text-xs">
                        Total
                      </p>
                      <p className="font-bold text-2xl">{stats.total}</p>
                    </div>
                    <ListTodo className="size-7 text-muted-foreground opacity-20" />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-muted-foreground text-xs">
                        Progresso
                      </p>
                      <p className="font-bold text-2xl">
                        {stats.completionRate.toFixed(0)}%
                      </p>
                    </div>
                    <TrendingUp className="size-7 text-primary opacity-20" />
                  </div>
                </div>
              </div>

              {/* Por Prioridade */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
                  <Signal className="size-4" />
                  Tarefas por Prioridade
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400">
                        Alta
                      </Badge>
                    </div>
                    <span className="font-bold text-2xl text-red-600 dark:text-red-400">
                      {stats.byPriority.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                        Média
                      </Badge>
                    </div>
                    <span className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">
                      {stats.byPriority.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                        Baixa
                      </Badge>
                    </div>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                      {stats.byPriority.low}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
