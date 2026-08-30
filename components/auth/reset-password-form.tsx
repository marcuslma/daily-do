"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/actions/auth";
import { FormFeedback } from "@/components/auth/form-feedback";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthActionState } from "@/lib/auth-action-state";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(
    resetPassword,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input name="token" type="hidden" value={token} />
      <div>
        <label
          className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200"
          htmlFor="password"
        >
          Nova senha
        </label>
        <input
          autoComplete="new-password"
          className="mt-1 h-9 w-full rounded-none border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50"
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
      <div>
        <label
          className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200"
          htmlFor="passwordConfirmation"
        >
          Confirmar nova senha
        </label>
        <input
          autoComplete="new-password"
          className="mt-1 h-9 w-full rounded-none border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50"
          id="passwordConfirmation"
          minLength={8}
          name="passwordConfirmation"
          required
          type="password"
        />
        <div className="mt-1">
          <FormFeedback errors={state.fieldErrors?.passwordConfirmation} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Redefinindo...">Redefinir senha</SubmitButton>
    </form>
  );
}
