interface CelebrationGifProps {
  gifUrl: string;
  description: string;
}

export function CelebrationGif({ gifUrl, description }: CelebrationGifProps) {
  return (
    <div className="flex flex-col gap-3">
      <img
        alt="Celebração"
        className="aspect-square w-full rounded-md object-cover"
        height="256"
        src={gifUrl}
        width="256"
      />
      <div>
        <p className="font-medium">Tarefa concluída! 🎉</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
