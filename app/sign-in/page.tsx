import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { redirectIfAuthenticated } from "@/lib/session";

export default async function SignInPage() {
  await redirectIfAuthenticated();

  return (
    <AuthCard
      description="Entre para acessar sua lista de tarefas."
      title="Boas-vindas de volta"
    >
      <SignInForm />
    </AuthCard>
  );
}
