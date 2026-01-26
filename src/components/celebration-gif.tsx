import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "./ui/progress";

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
      <DialogContent
        className="gap-0 border-0 p-0 sm:max-w-xs"
        showCloseButton={false}
      >
        <div className="relative">
          <img
            alt="Celebração de conclusão de tarefa"
            className="aspect-square w-full rounded-sm object-cover"
            height="300"
            src={gifUrl}
            width="300"
          />
          <Progress
            className="absolute bottom-1.5 h-1 rounded-none"
            value={progress}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
