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
          className="inline-flex h-8 w-full items-center justify-center rounded-none bg-slate-950 px-3 text-xs font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200 group-data-[theme=dark]:focus-visible:outline-slate-50"
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
