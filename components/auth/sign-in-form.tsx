"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { FormFeedback } from "@/components/auth/form-feedback";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthActionState } from "@/lib/auth-action-state";

const inputClassName =
  "mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus:ring-slate-700";

export function SignInForm() {
  const [state, formAction] = useActionState(signIn, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="email">
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
        <div className="mt-2">
          <FormFeedback errors={state.fieldErrors?.email} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="password">
            Senha
          </label>
          <Link
            className="text-sm font-medium text-slate-700 underline group-data-[theme=dark]:text-slate-300"
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
        <div className="mt-2">
          <FormFeedback errors={state.fieldErrors?.password} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
      <p className="text-center text-sm text-slate-600 group-data-[theme=dark]:text-slate-300">
        Ainda não tem uma conta?{" "}
        <Link className="font-semibold text-slate-950 underline group-data-[theme=dark]:text-slate-50" href="/sign-up">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
