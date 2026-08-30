import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { redirectIfAuthenticated } from "@/lib/session";

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <AuthCard
      description="Informe seu e-mail para receber as instruções de redefinição."
      title="Redefinir senha"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
