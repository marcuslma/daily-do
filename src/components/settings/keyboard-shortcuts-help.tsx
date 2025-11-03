import { Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  {
    keys: ["Ctrl", "N"],
    description: "Abrir modal de nova tarefa",
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

export function KeyboardShortcutsHelp({
  open,
  onOpenChange,
}: KeyboardShortcutsHelpProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5" />
            Atalhos de Teclado
          </DialogTitle>
          <DialogDescription>
            Use estes atalhos para navegar rapidamente pelo daily-do
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
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
