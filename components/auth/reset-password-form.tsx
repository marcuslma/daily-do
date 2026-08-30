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
    <form action={formAction} className="space-y-5">
      <input name="token" type="hidden" value={token} />
      <div>
        <label
          className="text-sm font-medium text-slate-800 group-data-[theme=dark]:text-slate-200"
          htmlFor="password"
        >
          Nova senha
        </label>
        <input
          autoComplete="new-password"
          className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus:ring-slate-700"
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
        <div className="mt-2">
          <FormFeedback errors={state.fieldErrors?.password} />
        </div>
      </div>
      <div>
        <label
          className="text-sm font-medium text-slate-800 group-data-[theme=dark]:text-slate-200"
          htmlFor="passwordConfirmation"
        >
          Confirmar nova senha
        </label>
        <input
          autoComplete="new-password"
          className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus:ring-slate-700"
          id="passwordConfirmation"
          minLength={8}
          name="passwordConfirmation"
          required
          type="password"
        />
        <div className="mt-2">
          <FormFeedback errors={state.fieldErrors?.passwordConfirmation} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Redefinindo...">Redefinir senha</SubmitButton>
    </form>
  );
}
