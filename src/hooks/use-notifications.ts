import { useCallback, useEffect } from "react";
import type { Todo } from "@/types/todo";
import { useLocalStorage } from "./use-local-storage";

interface NotificationSettings {
  enabled: boolean;
  minutesBefore: number;
}

export function useNotifications(todos: Todo[]) {
  const [settings, setSettings] = useLocalStorage<NotificationSettings>(
    "daily-do-notifications",
    {
      enabled: false,
      minutesBefore: 30,
    }
  );

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta notificações");
      return false;
    }

    if (Notification.permission === "granted") {
      setSettings({ ...settings, enabled: true });
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setSettings({ ...settings, enabled: true });
        return true;
      }
    }

    return false;
  }, [settings, setSettings]);

  const showNotification = useCallback(
    (title: string, body: string, icon?: string) => {
      if (Notification.permission === "granted" && settings.enabled) {
        new Notification(title, {
          body,
          icon: icon || "/vite.svg",
          badge: "/vite.svg",
        });
      }
    },
    [settings.enabled]
  );

  // Verificar tarefas com vencimento próximo
  useEffect(() => {
    if (!(settings.enabled && "Notification" in window)) {
      return;
    }

    const checkInterval = setInterval(() => {
      const now = new Date();

      for (const todo of todos) {
        if (todo.completed || !todo.dueDate) {
          continue;
        }

        const dueDate = new Date(todo.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));

        // Notificar se está dentro do período configurado
        if (minutesDiff > 0 && minutesDiff <= settings.minutesBefore) {
          const storageKey = `notified-${todo.id}-${dueDate.getTime()}`;
          const alreadyNotified = localStorage.getItem(storageKey);

          if (!alreadyNotified) {
            const emoji = todo.emoji || "⏰";
            showNotification(
              `${emoji} Tarefa vencendo em breve!`,
              `"${todo.text}" vence em ${minutesDiff} minuto${minutesDiff !== 1 ? "s" : ""}`
            );

            localStorage.setItem(storageKey, "true");
          }
        }

        // Notificar se já venceu
        if (minutesDiff < 0 && minutesDiff > -5) {
          const storageKey = `overdue-${todo.id}-${dueDate.getTime()}`;
          const alreadyNotified = localStorage.getItem(storageKey);

          if (!alreadyNotified) {
            const emoji = todo.emoji || "🚨";
            showNotification(
              `${emoji} Tarefa vencida!`,
              `"${todo.text}" já passou do prazo`
            );
            localStorage.setItem(storageKey, "true");
          }
        }
      }
    }, 60_000); // Verificar a cada minuto

    return () => clearInterval(checkInterval);
  }, [todos, settings, showNotification]);

  const updateSettings = useCallback(
    (newSettings: Partial<NotificationSettings>) => {
      setSettings({ ...settings, ...newSettings });
    },
    [settings, setSettings]
  );

  const hasPermission = Notification.permission === "granted";
  const isSupported = "Notification" in window;

  return {
    settings,
    updateSettings,
    requestPermission,
    showNotification,
    hasPermission,
    isSupported,
  };
}
