import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/session";

export default async function Home() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-950 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 sm:px-6">
      <section className="w-full max-w-2xl border border-slate-200 bg-white p-5 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 group-data-[theme=dark]:text-slate-400">
          Daily Do
        </p>
        <h1 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Sua lista de tarefas, sem distrações.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 group-data-[theme=dark]:text-slate-300">
          Organize o que importa e avance uma tarefa de cada vez.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-8 items-center justify-center rounded-none bg-slate-950 px-3 text-xs font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200 group-data-[theme=dark]:focus-visible:outline-slate-50"
            href="/sign-up"
          >
            Criar conta
          </Link>
          <Link
            className="inline-flex h-8 items-center justify-center rounded-none border border-slate-300 px-3 text-xs font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:border-slate-700 group-data-[theme=dark]:text-slate-100 group-data-[theme=dark]:hover:bg-slate-800 group-data-[theme=dark]:focus-visible:outline-slate-50"
            href="/sign-in"
          >
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}
