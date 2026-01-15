import { useCallback, useRef } from "react";

export function useCelebrationSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playSuccessSound = useCallback(() => {
    const context = getAudioContext();

    // Resume context if suspended (browser autoplay policy)
    if (context.state === "suspended") {
      context.resume();
    }

    const now = context.currentTime;

    // Create a pleasant "success" chime with multiple notes
    const notes = [
      { frequency: 523.25, start: 0, duration: 0.15 }, // C5
      { frequency: 659.25, start: 0.1, duration: 0.15 }, // E5
      { frequency: 783.99, start: 0.2, duration: 0.25 }, // G5
    ];

    for (const note of notes) {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(note.frequency, now + note.start);

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, now + note.start);
      gainNode.gain.linearRampToValueAtTime(0.3, now + note.start + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        now + note.start + note.duration
      );

      oscillator.start(now + note.start);
      oscillator.stop(now + note.start + note.duration);
    }
  }, [getAudioContext]);

  return { playSuccessSound };
}
