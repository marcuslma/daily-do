import type { ReactNode } from "react";
import Link from "next/link";

type TodoPageProps = {
  backHref: string;
  children: ReactNode;
  title: string;
};

export function TodoPage({ backHref, children, title }: TodoPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:ring-slate-700">
        <Link
          className="text-sm font-medium text-slate-700 underline group-data-[theme=dark]:text-slate-300"
          href={backHref}
        >
          Voltar ao dashboard
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 group-data-[theme=dark]:text-slate-50">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
