import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-md gap-0 p-0">
        <div className="relative">
          <img
            alt="Celebração de conclusão de tarefa"
            className="aspect-square w-full object-cover"
            height="400"
            src={gifUrl}
            width="400"
          />
          <Button
            aria-label="Fechar"
            className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress className="h-1 rounded-none" value={progress} />
      </DialogContent>
    </Dialog>
  );
}
