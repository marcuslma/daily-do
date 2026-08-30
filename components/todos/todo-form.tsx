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
  "mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 group-data-[theme=dark]:placeholder:text-slate-500 group-data-[theme=dark]:focus:border-slate-50 group-data-[theme=dark]:focus:ring-slate-700";

export function TodoForm({ action, description, submitLabel }: TodoFormProps) {
  const [state, formAction] = useActionState(action, initialTodoActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          className="text-sm font-medium text-slate-800 group-data-[theme=dark]:text-slate-200"
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
        <div className="mt-2">
          <FormFeedback errors={state.fieldErrors?.description} />
        </div>
      </div>
      <FormFeedback message={state.message} />
      <SubmitButton pendingLabel="Salvando...">{submitLabel}</SubmitButton>
    </form>
  );
}
