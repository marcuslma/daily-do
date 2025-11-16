import { Command, Keyboard } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const shortcuts = [
  {
    keys: ["Ctrl", "K"],
    description: "Abrir modal de nova tarefa",
  },
  {
    keys: ["Ctrl", "/"],
    description: "Abrir painel de comandos",
  },
  {
    keys: ["/"],
    description: "Focar no campo de busca",
  },
  {
    keys: ["Shift", "?"],
    description: "Mostrar este painel de atalhos",
  },
  {
    keys: ["Esc"],
    description: "Fechar modais abertos",
  },
];

interface KeyboardShortcutsHelpProps {
  setIsCreateDialogOpen: (open: boolean) => void;
}

export function KeyboardShortcutsHelp({
  setIsCreateDialogOpen,
}: KeyboardShortcutsHelpProps) {
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts([
    {
      key: "k",
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
      key: "/",
      ctrl: true,
      description: "Painel de comandos",
      action: () => setOpen(true),
    },
    {
      key: "?",
      shift: true,
      description: "Mostrar atalhos",
      action: () => setOpen(true),
    },
  ]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setOpen(true)} size="icon" variant="outline">
              <Command className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Atalhos de Teclado (Ctrl+/)</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-4" />
            Atalhos de Teclado
          </DialogTitle>
          <DialogDescription>
            Use estes atalhos para navegar rapidamente pelo daily-do
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
              key={shortcut.keys.join("+")}
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span
                    className="flex items-center gap-1"
                    key={`${shortcut.keys.join("+")}-${key}`}
                  >
                    <Badge className="font-mono" variant="secondary">
                      {key}
                    </Badge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground text-xs">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-muted-foreground text-xs">
          <p>💡 Dica: No Mac, use ⌘ (Command) ao invés de Ctrl</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
