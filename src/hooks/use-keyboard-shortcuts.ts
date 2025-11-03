import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input, textarea ou contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Permitir Esc mesmo em inputs
        // biome-ignore lint/style/useCollapsedIf: Not collapsed for clarity
        if (event.key !== "Escape") {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !(event.ctrlKey || event.metaKey);
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const SHORTCUT_DESCRIPTIONS = {
  NEW_TASK: { key: "N", ctrl: true, description: "Nova tarefa" },
  SEARCH: { key: "/", description: "Buscar tarefas" },
  HELP: { key: "?", shift: true, description: "Mostrar atalhos" },
  ESCAPE: { key: "Escape", description: "Fechar modal" },
};
