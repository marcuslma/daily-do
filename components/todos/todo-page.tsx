import type { ReactNode } from "react";
import Link from "next/link";

type TodoPageProps = {
  backHref: string;
  children: ReactNode;
  title: string;
};

export function TodoPage({ backHref, children, title }: TodoPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-8 sm:px-6">
      <section className="w-full border border-slate-200 bg-white p-4 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900">
        <Link
          className="text-xs font-medium text-slate-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 group-data-[theme=dark]:text-slate-300 group-data-[theme=dark]:focus-visible:outline-slate-50"
          href={backHref}
        >
          Voltar ao dashboard
        </Link>
        <h1 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 group-data-[theme=dark]:text-slate-50">
          {title}
        </h1>
        <div className="mt-4">{children}</div>
      </section>
    </main>
  );
}
