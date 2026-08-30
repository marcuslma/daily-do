import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const metadata: Metadata = {
  title: "Daily Do",
  description: "Uma lista de tarefas objetiva.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className="group" lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-slate-950 antialiased group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50">
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
