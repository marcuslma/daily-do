import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-950 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 group-data-[theme=dark]:bg-slate-900 group-data-[theme=dark]:ring-slate-700">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 group-data-[theme=dark]:text-slate-300">
          {description}
        </p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
