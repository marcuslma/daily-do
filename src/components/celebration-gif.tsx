import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface CelebrationGifProps {
  isVisible: boolean;
  gifUrl: string;
  progress: number;
  onClose?: () => void;
}

export function CelebrationGif({
  isVisible,
  gifUrl,
  progress,
  onClose,
}: CelebrationGifProps) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose?.()} open={isVisible}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Tarefa Concluída! 🎉</span>
            <Button
              aria-label="Fechar"
              className="h-6 w-6"
              onClick={onClose}
              size="icon"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Parabéns por completar sua tarefa!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <img
            alt="Celebração de conclusão de tarefa"
            className="aspect-square w-full rounded-lg object-cover"
            height="400"
            src={gifUrl}
            width="400"
          />

          <div className="space-y-2">
            <Progress className="h-2" value={progress} />
            <p className="text-center text-muted-foreground text-xs">
              Fechando automaticamente em {Math.ceil((progress / 100) * 5)}s
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
