import { AlertCircle, CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TodoStats as Stats } from "@/types/todo";

interface TodoStatsProps {
  stats: Stats;
}

export function TodoStats({ stats }: TodoStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="py-4">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">Total</p>
              <p className="font-bold text-2xl">{stats.total}</p>
            </div>
            <Circle className="size-8 text-muted-foreground opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Concluídas
              </p>
              <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <CheckCircle2 className="size-8 text-green-600 opacity-20 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Ativas
              </p>
              <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                {stats.active}
              </p>
            </div>
            <Circle className="size-8 text-blue-600 opacity-20 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Progresso
              </p>
              <p className="font-bold text-2xl">
                {stats.completionRate.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="size-8 text-primary opacity-20" />
          </div>
        </CardContent>
      </Card>

      {stats.active > 0 && (
        <Card className="py-4 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="size-4" />
              Tarefas Ativas por Prioridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Badge className="border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400">
                  Alta
                </Badge>
                <span className="font-medium text-sm">
                  {stats.byPriority.high}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                  Média
                </Badge>
                <span className="font-medium text-sm">
                  {stats.byPriority.medium}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  Baixa
                </Badge>
                <span className="font-medium text-sm">
                  {stats.byPriority.low}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
