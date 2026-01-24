import { useCallback, useEffect, useRef, useState } from "react";

// Lista de 10 GIFs de celebração do Giphy
const CELEBRATION_GIFS = [
  "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif", // Confetti explosion
  "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif", // Party popper
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Dancing celebration
  "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif", // Fireworks
  "https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif", // Trophy success
  "https://media.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif", // High five
  "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", // Thumbs up celebration
  "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif", // Stars and sparkles
  "https://media.giphy.com/media/2xIOiAPXonois/giphy.gif", // Clapping hands
  "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif", // Victory dance
];

const CELEBRATION_DURATION = 5000; // 5 segundos

interface CelebrationGifState {
  isVisible: boolean;
  gifUrl: string;
  progress: number;
}

export function useCelebrationGif() {
  const [state, setState] = useState<CelebrationGifState>({
    isVisible: false,
    gifUrl: "",
    progress: 100,
  });

  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const showCelebrationGif = useCallback(() => {
    // Limpa timers anteriores
    clearTimers();

    // Seleciona um GIF aleatório da lista
    const randomIndex = Math.floor(Math.random() * CELEBRATION_GIFS.length);
    const selectedGif = CELEBRATION_GIFS[randomIndex];

    // Exibe o GIF com progresso em 100%
    setState({
      isVisible: true,
      gifUrl: selectedGif,
      progress: 100,
    });

    // Registra o tempo de início
    startTimeRef.current = Date.now();

    // Atualiza a barra de progresso a cada 50ms
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, CELEBRATION_DURATION - elapsed);
      const progress = (remaining / CELEBRATION_DURATION) * 100;

      setState((prev) => ({
        ...prev,
        progress,
      }));
    }, 50);

    // Esconde o GIF após 5 segundos
    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setState({
        isVisible: false,
        gifUrl: "",
        progress: 100,
      });
    }, CELEBRATION_DURATION);
  }, [clearTimers]);

  const hideCelebrationGif = useCallback(() => {
    clearTimers();
    setState({
      isVisible: false,
      gifUrl: "",
      progress: 100,
    });
  }, [clearTimers]);

  // Limpa timers ao desmontar o componente
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    isVisible: state.isVisible,
    gifUrl: state.gifUrl,
    progress: state.progress,
    showCelebrationGif,
    hideCelebrationGif,
  };
}
