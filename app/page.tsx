import type { Metadata } from "next";
import Navbar   from "@/components/landing/Navbar";
import Hero     from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA      from "@/components/landing/CTA";
import Footer   from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Compass — простой таск-трекер",
  description:
    "Compass помогает расставить приоритеты, отследить сроки и видеть полную картину. Матрица Эйзенхауэра, категории и авторизация через Telegram.",
  openGraph: {
    title:       "Compass — простой таск-трекер",
    description: "Задачи, которые делаются.",
    type:        "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main>
        <Hero />

        <div className="mx-auto max-w-6xl px-6">
          <div className="border-t border-zinc-100 dark:border-zinc-800/60" />
        </div>

        <Features />

        <div className="mx-auto max-w-6xl px-6">
          <div className="border-t border-zinc-100 dark:border-zinc-800/60" />
        </div>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
