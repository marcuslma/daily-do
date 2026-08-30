import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Azeret_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Daily Do",
  description: "Uma lista de tarefas objetiva.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className="group" lang="pt-BR" suppressHydrationWarning>
      <body
        className={
          azeretMono.className +
          " min-h-screen bg-white text-slate-950 antialiased group-data-[theme=dark]:bg-slate-950 group-data-[theme=dark]:text-slate-50"
        }
      >
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
