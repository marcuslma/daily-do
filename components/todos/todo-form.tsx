"use client";

import { useActionState } from "react";
import { FormFeedback } from "@/components/auth/form-feedback";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  initialTodoActionState,
  type TodoActionState,
} from "@/lib/todo-action-state";

type TodoFormProps = {
  action: (
    previousState: TodoActionState,
    formData: FormData,
  ) => Promise<TodoActionState>;
  description: string;
  submitLabel: string;
};

const inputClassName =
  "mt-1 min-h-24 w-full resize-y rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus-visible:outline-slate-50";

export function TodoForm({ action, description, submitLabel }: TodoFormProps) {
  const [state, formAction] = useActionState(action, initialTodoActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          className="text-xs font-medium text-slate-800 group-data-[theme=dark]:text-slate-200"
          htmlFor="description"
        >
          Descrição
        </label>
        <textarea
          className={inputClassName}
          defaultValue={description}
          id="description"
          maxLength={500}
          name="description"
          placeholder="O que você precisa fazer?"
          required
          rows={4}
        />
        <div className="mt-1">
          <FormFeedback errors={state.fieldErrors?.description} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Salvando...">{submitLabel}</SubmitButton>
    </form>
  );
}
