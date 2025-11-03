import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Plus, Smile, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Priority, SubTask, Todo } from "@/types/todo";

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
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [subTaskInput, setSubTaskInput] = useState("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setPriority(todo.priority);
      setTags(todo.tags);
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
      setSubTasks(todo.subTasks || []);
      setEmoji(todo.emoji);
    }
  }, [todo]);

  const handleSave = () => {
    if (todo && text.trim()) {
      onSave(todo.id, {
        text: text.trim(),
        priority,
        tags,
        dueDate,
        subTasks,
        emoji,
      });
      onOpenChange(false);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setEmoji(emoji.native);
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

  if (!todo) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Faça alterações na sua tarefa aqui.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text">Descrição</Label>
            <div className="flex gap-2">
              <Popover onOpenChange={setEmojiPickerOpen} open={emojiPickerOpen}>
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
                  <Picker
                    data={data}
                    locale="pt"
                    onEmojiSelect={handleEmojiSelect}
                    theme="auto"
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
              onValueChange={(value) => value && setPriority(value as Priority)}
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
            <Label htmlFor="tag-input">Tags</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  className="pr-8"
                  id="tag-input"
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Adicionar tag..."
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
                Adicionar
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
        </div>

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
