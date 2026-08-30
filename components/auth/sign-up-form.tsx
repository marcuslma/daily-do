"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import { FormFeedback } from "@/components/auth/form-feedback";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthActionState } from "@/lib/auth-action-state";

const inputClassName =
  "mt-1 h-9 w-full rounded-none border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="name">
          Nome
        </label>
        <input
          autoComplete="name"
          className={inputClassName}
          id="name"
          name="name"
          placeholder="Seu nome"
          required
          type="text"
        />
        <div className="mt-1">
          <FormFeedback errors={state.fieldErrors?.name} />
        </div>
      </div>
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
        <label className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200" htmlFor="password">
          Senha
        </label>
        <input
          autoComplete="new-password"
          className={inputClassName}
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
        <div className="mt-1">
          <FormFeedback errors={state.fieldErrors?.password} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Criando conta...">Criar conta</SubmitButton>
      <p className="text-center text-xs text-slate-600 group-data-[theme=dark]:text-slate-300">
        Já tem uma conta?{" "}
        <Link className="font-semibold text-slate-950 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50" href="/sign-in">
          Entrar
        </Link>
      </p>
    </form>
  );
}
