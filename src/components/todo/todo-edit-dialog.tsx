import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Info, Plus, Smile, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCategories } from "@/hooks/use-categories";
import type { Priority, RecurrenceConfig, SubTask, Todo } from "@/types/todo";

interface TodoEditDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Todo>) => void;
}

export function TodoEditDialog({
  todo,
  open,
  onOpenChange,
  onSave,
}: TodoEditDialogProps) {
  const { categories } = useCategories();
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [subTaskInput, setSubTaskInput] = useState("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [recurrenceType, setRecurrenceType] =
    useState<RecurrenceConfig["type"]>("none");
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setPriority(todo.priority);
      setTags(todo.tags);
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
      setSubTasks(todo.subTasks || []);
      setEmoji(todo.emoji);
      setDescription(todo.description || "");
      setCategoryId(todo.categoryId || "");
      setStartTime(todo.startTime ? new Date(todo.startTime) : undefined);
      setEndTime(todo.endTime ? new Date(todo.endTime) : undefined);

      if (todo.recurrence) {
        setRecurrenceType(todo.recurrence.type);
        setRecurrenceInterval(todo.recurrence.interval);
        setRecurrenceDays(todo.recurrence.daysOfWeek || []);
      } else {
        setRecurrenceType("none");
        setRecurrenceInterval(1);
        setRecurrenceDays([]);
      }
    }
  }, [todo]);

  const handleSave = () => {
    if (todo && text.trim()) {
      const recurrence: RecurrenceConfig | undefined =
        recurrenceType !== "none"
          ? {
              type: recurrenceType,
              interval: recurrenceInterval,
              daysOfWeek:
                recurrenceType === "weekly" ? recurrenceDays : undefined,
            }
          : undefined;

      onSave(todo.id, {
        text: text.trim(),
        priority,
        tags,
        dueDate,
        subTasks,
        emoji,
        description: description || undefined,
        categoryId: categoryId || undefined,
        recurrence,
        startTime,
        endTime,
      });
      onOpenChange(false);
    }
  };

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    setEmoji(emojiData.emoji);
    setEmojiPickerOpen(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addSubTask = () => {
    const subTaskText = subTaskInput.trim();
    if (subTaskText) {
      const newSubTask: SubTask = {
        id: crypto.randomUUID(),
        text: subTaskText,
        completed: false,
      };
      setSubTasks([...subTasks, newSubTask]);
      setSubTaskInput("");
    }
  };

  const removeSubTask = (idToRemove: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== idToRemove));
  };

  const toggleSubTask = (id: string) => {
    setSubTasks(
      subTasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const handleSubTaskInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubTask();
    }
  };

  // Calcula o tema efetivo (respeita a preferência do sistema se theme === "system")
  const getEffectiveTheme = (): Theme => {
    if (theme === "system") {
      return Theme.AUTO;
    }
    return theme === "dark" ? Theme.DARK : Theme.LIGHT;
  };

  if (!todo) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Faça alterações na sua tarefa aqui.
          </DialogDescription>
        </DialogHeader>

        <Tabs className="py-4" defaultValue="general">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="general">
              Geral
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="organization">
              Organização
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="recurrence">
              Recorrência
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4 space-y-4" value="general">
            <div className="space-y-2">
              <Label htmlFor="text">Descrição</Label>
              <div className="flex gap-2">
                <Popover
                  onOpenChange={setEmojiPickerOpen}
                  open={emojiPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      className="shrink-0"
                      size="icon"
                      type="button"
                      variant="outline"
                    >
                      {emoji || <Smile className="size-4" />}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <EmojiPicker
                      emojiStyle={EmojiStyle.NATIVE}
                      onEmojiClick={handleEmojiSelect}
                      previewConfig={{ showPreview: false }}
                      searchPlaceHolder="Buscar emoji..."
                      theme={getEffectiveTheme()}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  className="flex-1"
                  id="text"
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Descrição da tarefa"
                  value={text}
                />
                {emoji && (
                  <Button
                    className="shrink-0"
                    onClick={() => setEmoji(undefined)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <ToggleGroup
                onValueChange={(value) =>
                  value && setPriority(value as Priority)
                }
                spacing={0}
                type="single"
                value={priority}
                variant="outline"
              >
                <ToggleGroupItem value="low">Baixa</ToggleGroupItem>
                <ToggleGroupItem value="medium">Média</ToggleGroupItem>
                <ToggleGroupItem value="high">Alta</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <DatePicker
                className="w-full"
                date={dueDate}
                onDateChange={setDueDate}
                placeholder="Selecione uma data"
              />
            </div>

            <div className="space-y-2">
              <Label>Horário de Início</Label>
              <TimePicker
                className="w-full"
                onTimeChange={setStartTime}
                placeholder="Selecione o horário de início"
                time={startTime}
              />
            </div>

            <div className="space-y-2">
              <Label>Horário de Fim</Label>
              <TimePicker
                className="w-full"
                onTimeChange={setEndTime}
                placeholder="Selecione o horário de fim"
                time={endTime}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detalhes</Label>
              <Textarea
                className="min-h-20"
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione detalhes sobre esta tarefa..."
                value={description}
              />
            </div>
          </TabsContent>

          <TabsContent className="mt-4 space-y-4" value="organization">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                onValueChange={(value) =>
                  setCategoryId(value === "none" ? "" : value)
                }
                value={categoryId || "none"}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-input">Etiquetas</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    className="pr-8"
                    id="tag-input"
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Adicionar etiqueta..."
                    value={tagInput}
                  />
                  <Tag className="-translate-y-1/2 absolute top-1/2 right-2 size-4 text-muted-foreground" />
                </div>
                <Button onClick={addTag} type="button" variant="outline">
                  <Plus className="size-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge className="gap-1" key={tag} variant="secondary">
                      {tag}
                      <button
                        className="hover:text-destructive"
                        onClick={() => removeTag(tag)}
                        type="button"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtask-input">Subtarefas</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="subtask-input"
                  onChange={(e) => setSubTaskInput(e.target.value)}
                  onKeyDown={handleSubTaskInputKeyDown}
                  placeholder="Adicionar subtarefa..."
                  value={subTaskInput}
                />
                <Button onClick={addSubTask} type="button" variant="outline">
                  <Plus className="size-4" />
                </Button>
              </div>

              {subTasks.length > 0 && (
                <div className="mt-2 space-y-1.5 pl-2">
                  {subTasks.map((subTask) => (
                    <div
                      className="group flex items-center gap-2"
                      key={subTask.id}
                    >
                      <Checkbox
                        checked={subTask.completed}
                        onCheckedChange={() => toggleSubTask(subTask.id)}
                      />
                      <span
                        className={`flex-1 text-sm ${
                          subTask.completed
                            ? "text-muted-foreground line-through"
                            : ""
                        }`}
                      >
                        {subTask.text}
                      </span>
                      <Button
                        className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        onClick={() => removeSubTask(subTask.id)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent className="mt-4 space-y-4" value="recurrence">
            <div className="space-y-2">
              <Label htmlFor="recurrence-type">Tipo de Recorrência</Label>
              <Select
                onValueChange={(value) =>
                  setRecurrenceType(value as RecurrenceConfig["type"])
                }
                value={recurrenceType}
              >
                <SelectTrigger id="recurrence-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não repetir</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recurrenceType !== "none" && (
              <>
                {(recurrenceType === "daily" ||
                  recurrenceType === "monthly") && (
                  <div className="space-y-2">
                    <Label htmlFor="interval">
                      A cada {recurrenceType === "daily" && "dia(s)"}
                      {recurrenceType === "monthly" && "mês(es)"}
                    </Label>
                    <Input
                      id="interval"
                      min={1}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value, 10);
                        setRecurrenceInterval(Number.isNaN(val) ? 1 : val);
                      }}
                      type="number"
                      value={recurrenceInterval.toString()}
                    />
                  </div>
                )}

                {recurrenceType === "weekly" && (
                  <div className="space-y-2">
                    <Label>Dias da semana</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Dom", value: 0 },
                        { label: "Seg", value: 1 },
                        { label: "Ter", value: 2 },
                        { label: "Qua", value: 3 },
                        { label: "Qui", value: 4 },
                        { label: "Sex", value: 5 },
                        { label: "Sáb", value: 6 },
                      ].map((day) => (
                        <Button
                          key={day.value}
                          onClick={() => {
                            if (recurrenceDays.includes(day.value)) {
                              setRecurrenceDays(
                                recurrenceDays.filter((d) => d !== day.value)
                              );
                            } else {
                              setRecurrenceDays([...recurrenceDays, day.value]);
                            }
                          }}
                          size="sm"
                          type="button"
                          variant={
                            recurrenceDays.includes(day.value)
                              ? "default"
                              : "outline"
                          }
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-muted/50 p-3 text-muted-foreground text-sm">
                  <Info className="mr-2 inline-block size-4" /> A tarefa será
                  automaticamente recriada quando você marcá-la como concluída.
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
