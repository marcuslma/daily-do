"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { FormFeedback } from "@/components/auth/form-feedback";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthActionState } from "@/lib/auth-action-state";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordReset,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="email">
          E-mail
        </label>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus:ring-slate-700"
          id="email"
          name="email"
          placeholder="voce@exemplo.com"
          required
          type="email"
        />
        <div className="mt-2">
          <FormFeedback errors={state.fieldErrors?.email} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Enviando...">Enviar instruções</SubmitButton>
      <p className="text-center text-sm text-slate-600 group-data-[theme=dark]:text-slate-300">
        <Link className="font-semibold text-slate-950 underline group-data-[theme=dark]:text-slate-50" href="/sign-in">
          Voltar para entrar
        </Link>
      </p>
    </form>
  );
}
