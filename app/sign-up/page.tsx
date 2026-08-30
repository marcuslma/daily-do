import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { redirectIfAuthenticated } from "@/lib/session";

export default async function SignUpPage() {
  await redirectIfAuthenticated();

  return (
    <AuthCard
      description="Crie sua conta e comece a organizar seu dia."
      title="Crie sua conta"
    >
      <SignUpForm />
    </AuthCard>
  );
}
