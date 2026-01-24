interface CelebrationGifProps {
  isVisible: boolean;
  gifUrl: string;
  onClose?: () => void;
}

export function CelebrationGif({
  isVisible,
  gifUrl,
  onClose,
}: CelebrationGifProps) {
  if (!isVisible) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Fechar celebração"
        className="fade-in zoom-in-95 pointer-events-auto relative animate-in cursor-pointer border-none bg-transparent p-0 duration-500"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <img
          alt="Celebração de conclusão de tarefa"
          className="max-h-96 max-w-sm rounded-lg shadow-2xl"
          height="384"
          src={gifUrl}
          width="384"
        />
      </button>
    </div>
  );
}
