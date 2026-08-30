import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-950 group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50 sm:px-6">
      <section className="w-full max-w-md border border-slate-200 bg-white p-5 group-data-[theme=dark]:border-slate-800 group-data-[theme=dark]:bg-slate-900">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-xs leading-5 text-slate-600 group-data-[theme=dark]:text-slate-300">
          {description}
        </p>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
