"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type TodoModalProps = {
  children: ReactNode;
  title: string;
};

export function TodoModal({ children, title }: TodoModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        router.back();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusedElementRef.current?.focus();
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 cursor-default bg-slate-950/40"
        onClick={() => router.back()}
      />
      <section
        aria-labelledby="todo-modal-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg border border-slate-200 bg-white p-4 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900"
        ref={dialogRef}
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            className="text-lg font-semibold tracking-tight text-slate-950 group-data-[theme=dark]:text-slate-50"
            id="todo-modal-title"
          >
            {title}
          </h2>
          <button
            aria-label="Fechar modal"
            className="inline-flex size-8 items-center justify-center rounded-none text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:hover:text-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50"
            onClick={() => router.back()}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
