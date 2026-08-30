import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/session";

export default async function Home() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-950 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:ring-slate-700 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 group-data-[theme=dark]:text-slate-400">
          Daily Do
        </p>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Sua lista de tarefas, sem distrações.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 group-data-[theme=dark]:text-slate-300">
          Organize o que importa e avance uma tarefa de cada vez.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 group-data-[theme=dark]:bg-slate-50 group-data-[theme=dark]:text-slate-950 group-data-[theme=dark]:hover:bg-slate-200"
            href="/sign-up"
          >
            Criar conta
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 transition hover:bg-slate-100 group-data-[theme=dark]:text-slate-100 group-data-[theme=dark]:ring-slate-700 group-data-[theme=dark]:hover:bg-slate-800"
            href="/sign-in"
          >
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}
