import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirectIfAuthenticated } from "@/lib/session";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  await redirectIfAuthenticated();
  const { token } = await searchParams;

  if (typeof token !== "string") {
    return (
      <AuthCard
        description="Solicite uma nova redefinição de senha para receber um link válido."
        title="Link inválido"
      >
        <Link
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200"
          href="/forgot-password"
        >
          Solicitar novo link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      description="Escolha uma senha com ao menos 8 caracteres."
      title="Defina uma nova senha"
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
