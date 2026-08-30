import type { AuthActionState } from "@/lib/auth-action-state";

type FormFeedbackProps = {
  message?: AuthActionState["message"];
  errors?: string[];
};

export function FormFeedback({ message, errors }: FormFeedbackProps) {
  if (!message && !errors?.length) {
    return null;
  }

  return (
    <div
      className="space-y-1 text-xs text-rose-700 group-data-[theme=dark]:text-rose-300"
      role="alert"
    >
      {message ? <p>{message}</p> : null}
      {errors?.map((error) => <p key={error}>{error}</p>)}
    </div>
  );
}
