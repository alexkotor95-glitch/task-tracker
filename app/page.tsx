import type { Metadata } from "next";
import Navbar    from "@/components/landing/Navbar";
import Hero      from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Features  from "@/components/landing/Features";
import Journey   from "@/components/landing/Journey";
import Compare   from "@/components/landing/Compare";
import FinalCTA  from "@/components/landing/FinalCTA";
import Footer    from "@/components/landing/Footer";

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
    <div className="lp-page">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <Journey />
        <Compare />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
