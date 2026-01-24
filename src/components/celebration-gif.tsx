interface CelebrationGifProps {
  gifUrl: string;
  description: string;
}

export function CelebrationGif({ gifUrl, description }: CelebrationGifProps) {
  return (
    <div className="flex items-start gap-3">
      <img
        alt="Celebração"
        className="h-16 w-16 rounded-md object-cover"
        height="64"
        src={gifUrl}
        width="64"
      />
      <div className="flex-1">
        <p className="font-medium">Tarefa concluída! 🎉</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
