import {
  AlarmClock,
  Award,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Circle,
  Clock,
  FolderKanban,
  ListChecks,
  ListTodo,
  Signal,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Category, TodoStats as Stats } from "@/types/todo";

interface TodoStatsImprovedProps {
  stats: Stats;
  categories: Category[];
}

export function TodoStatsImproved({
  stats,
  categories,
}: TodoStatsImprovedProps) {
  // Helper function to format minutes to hours/minutes
  const formatMinutes = (minutes: number): string => {
    if (minutes === 0) {
      return "0min";
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}min`;
    }
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* A. Visão Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-5" />
            Visão Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overview Stats */}
            <div className="space-y-3">
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
                    Atrasadas
                  </p>
                  <p className="font-bold text-2xl text-red-600 dark:text-red-400">
                    {stats.overdue}
                  </p>
                </div>
                <AlarmClock className="size-7 text-red-600 opacity-20 dark:text-red-400" />
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
            </div>

            {/* Priority Stats */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
                <Signal className="size-4" />
                Por Prioridade
              </h4>

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

              <div className="mt-4 space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground text-xs">
                    Taxa de Conclusão
                  </p>
                  <p className="font-bold text-sm">
                    {stats.completionRate.toFixed(0)}%
                  </p>
                </div>
                <Progress value={stats.completionRate} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B. Produtividade no Tempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-5" />
            Produtividade no Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Hoje
                </p>
                <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                  {stats.productivity.today}
                </p>
              </div>
              <Calendar className="size-7 text-green-600 opacity-20 dark:text-green-400" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Esta Semana
                </p>
                <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                  {stats.productivity.thisWeek}
                </p>
              </div>
              <Calendar className="size-7 text-blue-600 opacity-20 dark:text-blue-400" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Este Mês
                </p>
                <p className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                  {stats.productivity.thisMonth}
                </p>
              </div>
              <Calendar className="size-7 text-purple-600 opacity-20 dark:text-purple-400" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Sequência
                </p>
                <p className="font-bold text-2xl text-orange-600 dark:text-orange-400">
                  {stats.productivity.streak}
                  <span className="font-normal text-muted-foreground text-sm">
                    {" "}
                    dias
                  </span>
                </p>
              </div>
              <Award className="size-7 text-orange-600 opacity-20 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* C. Gestão de Tempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-5" />
            Gestão de Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Tempo Total
                  </p>
                  <p className="font-bold text-lg">
                    {formatMinutes(stats.timeManagement.totalEstimatedMinutes)}
                  </p>
                </div>
                <Clock className="size-6 text-muted-foreground opacity-20" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Concluído
                  </p>
                  <p className="font-bold text-green-600 text-lg dark:text-green-400">
                    {formatMinutes(stats.timeManagement.completedMinutes)}
                  </p>
                </div>
                <Check className="size-6 text-green-600 opacity-20 dark:text-green-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Pendente
                  </p>
                  <p className="font-bold text-blue-600 text-lg dark:text-blue-400">
                    {formatMinutes(stats.timeManagement.pendingMinutes)}
                  </p>
                </div>
                <Circle className="size-6 text-blue-600 opacity-20 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-muted-foreground text-sm">
                Distribuição por Prioridade
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400">
                      Alta
                    </Badge>
                  </div>
                  <span className="font-medium text-sm">
                    {formatMinutes(stats.timeManagement.byPriority.high)}
                  </span>
                </div>
                <Progress
                  className="h-2"
                  value={
                    stats.timeManagement.totalEstimatedMinutes > 0
                      ? (stats.timeManagement.byPriority.high /
                          stats.timeManagement.totalEstimatedMinutes) *
                        100
                      : 0
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                      Média
                    </Badge>
                  </div>
                  <span className="font-medium text-sm">
                    {formatMinutes(stats.timeManagement.byPriority.medium)}
                  </span>
                </div>
                <Progress
                  className="h-2"
                  value={
                    stats.timeManagement.totalEstimatedMinutes > 0
                      ? (stats.timeManagement.byPriority.medium /
                          stats.timeManagement.totalEstimatedMinutes) *
                        100
                      : 0
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      Baixa
                    </Badge>
                  </div>
                  <span className="font-medium text-sm">
                    {formatMinutes(stats.timeManagement.byPriority.low)}
                  </span>
                </div>
                <Progress
                  className="h-2"
                  value={
                    stats.timeManagement.totalEstimatedMinutes > 0
                      ? (stats.timeManagement.byPriority.low /
                          stats.timeManagement.totalEstimatedMinutes) *
                        100
                      : 0
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* D. Categorias e Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderKanban className="size-5" />
            Categorias e Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Categories */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
                <FolderKanban className="size-4" />
                Top 5 Categorias
              </h4>

              {stats.categoriesAndTags.topCategories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma categoria em uso
                </p>
              ) : (
                stats.categoriesAndTags.topCategories.map((cat) => {
                  const category = categories.find(
                    (c) => c.id === cat.categoryId
                  );
                  return (
                    <div
                      className="space-y-2 rounded-lg border p-3"
                      key={cat.categoryId}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {category?.icon || "📁"}
                          </span>
                          <span className="font-medium text-sm">
                            {category?.name || "Sem nome"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{cat.count}</p>
                          <p className="text-muted-foreground text-xs">
                            {cat.completionRate.toFixed(0)}% concluídas
                          </p>
                        </div>
                      </div>
                      <Progress className="h-1" value={cat.completionRate} />
                    </div>
                  );
                })
              )}

              <div className="flex items-center justify-between rounded-lg border p-3">
                <p className="font-medium text-muted-foreground text-sm">
                  Sem Categoria
                </p>
                <p className="font-bold text-lg">
                  {stats.categoriesAndTags.uncategorized}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
                <Tag className="size-4" />
                Tags Mais Usadas
              </h4>

              {stats.categoriesAndTags.topTags.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma tag em uso
                </p>
              ) : (
                stats.categoriesAndTags.topTags.map((tagItem) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={tagItem.tag}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="size-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{tagItem.tag}</span>
                    </div>
                    <Badge variant="secondary">{tagItem.count}</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E. Prazos e Pontualidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-5" />
            Prazos e Pontualidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Vence Hoje
                  </p>
                  <p className="font-bold text-2xl text-orange-600 dark:text-orange-400">
                    {stats.deadlines.dueToday}
                  </p>
                </div>
                <Calendar className="size-7 text-orange-600 opacity-20 dark:text-orange-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Vence Amanhã
                  </p>
                  <p className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">
                    {stats.deadlines.dueTomorrow}
                  </p>
                </div>
                <Calendar className="size-7 text-yellow-600 opacity-20 dark:text-yellow-400" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Vence Esta Semana
                  </p>
                  <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                    {stats.deadlines.dueThisWeek}
                  </p>
                </div>
                <Calendar className="size-7 text-blue-600 opacity-20 dark:text-blue-400" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground text-sm">
                    Taxa de Pontualidade
                  </p>
                  <p className="font-bold text-sm">
                    {stats.deadlines.onTimeRate.toFixed(0)}%
                  </p>
                </div>
                <Progress value={stats.deadlines.onTimeRate} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Média de Atraso
                  </p>
                  <p className="font-bold text-lg">
                    {stats.deadlines.averageDelayDays.toFixed(1)}
                    <span className="font-normal text-muted-foreground text-sm">
                      {" "}
                      dias
                    </span>
                  </p>
                </div>
                <AlarmClock className="size-6 text-red-600 opacity-20 dark:text-red-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* F. Subtarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-5" />
            Subtarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Total
                </p>
                <p className="font-bold text-2xl">{stats.subtasks.total}</p>
              </div>
              <ListChecks className="size-7 text-muted-foreground opacity-20" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Concluídas
                </p>
                <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                  {stats.subtasks.completed}
                </p>
              </div>
              <Check className="size-7 text-green-600 opacity-20 dark:text-green-400" />
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <p className="font-medium text-muted-foreground text-xs">
                Progresso
              </p>
              <p className="font-bold text-sm">
                {stats.subtasks.completionRate.toFixed(0)}%
              </p>
              <Progress className="h-2" value={stats.subtasks.completionRate} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Com Pendências
                </p>
                <p className="font-bold text-2xl text-orange-600 dark:text-orange-400">
                  {stats.subtasks.tasksWithIncompleteSubtasks}
                </p>
              </div>
              <Circle className="size-7 text-orange-600 opacity-20 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
