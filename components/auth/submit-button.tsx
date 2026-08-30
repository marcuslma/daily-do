"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Enviando...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200 group-data-[theme=dark]:disabled:bg-slate-600 group-data-[theme=dark]:disabled:text-slate-300"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
