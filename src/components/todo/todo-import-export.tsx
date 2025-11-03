import { Download, FileJson, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Todo } from "@/types/todo";

interface TodoImportExportProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

export function TodoImportExport({ todos, onImport }: TodoImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daily-do-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTodos = JSON.parse(content) as Todo[];

        // Validate the imported data
        if (!Array.isArray(importedTodos)) {
          throw new Error("Formato de arquivo inválido");
        }

        // Validate each todo has required fields
        const validatedTodos = importedTodos.map((todo) => ({
          id: todo.id || crypto.randomUUID(),
          text: todo.text || "",
          completed: todo.completed ?? false,
          createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(),
          priority: todo.priority || "medium",
          tags: Array.isArray(todo.tags) ? todo.tags : [],
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          subTasks: Array.isArray(todo.subTasks) ? todo.subTasks : [],
          emoji: todo.emoji || undefined,
        }));

        onImport(validatedTodos);
      } catch (error) {
        console.error("Error importing file:", error);
        toast.error(
          "Erro ao importar arquivo. Certifique-se de que é um arquivo JSON válido."
        );
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <FileJson className="size-4" />
            <span className="sr-only">Exportar/Importar tarefas</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 size-4" />
            Exportar Tarefas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick}>
            <Upload className="mr-2 size-4" />
            Importar Tarefas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </>
  );
}
