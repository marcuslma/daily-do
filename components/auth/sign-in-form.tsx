"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { FormFeedback } from "@/components/auth/form-feedback";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthActionState } from "@/lib/auth-action-state";

const inputClassName =
  "mt-1 h-9 w-full rounded-none border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50";

export function SignInForm() {
  const [state, formAction] = useActionState(signIn, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="email">
          E-mail
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email"
          name="email"
          placeholder="voce@exemplo.com"
          required
          type="email"
        />
        <div className="mt-1">
          <FormFeedback errors={state.fieldErrors?.email} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-4">
          <label className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="password">
            Senha
          </label>
          <Link
            className="text-xs font-medium text-slate-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:focus-visible:outline-slate-50"
            href="/forgot-password"
          >
            Esqueci minha senha
          </Link>
        </div>
        <input
          autoComplete="current-password"
          className={inputClassName}
          id="password"
          name="password"
          required
          type="password"
        />
        <div className="mt-1">
          <FormFeedback errors={state.fieldErrors?.password} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
      <p className="text-center text-xs text-slate-600 group-data-[theme=dark]:text-slate-300">
        Ainda não tem uma conta?{" "}
        <Link className="font-semibold text-slate-950 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50" href="/sign-up">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
