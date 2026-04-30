import Link from "next/link";
import TaskMockup from "./TaskMockup";

export default function Hero() {
  return (
    <section className="relative pt-14">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-12">

          {/* Left: text */}
          <div className="flex-1 max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 dark:border-indigo-900/50 dark:bg-indigo-950/40">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 tracking-wide">
                Бесплатно · Без рекламы
              </span>
            </div>

            <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-zinc-50 mb-6">
              Задачи,<br />
              которые{" "}
              <span className="text-indigo-600 dark:text-indigo-400">делаются</span>
            </h1>

            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-lg">
              Compass помогает расставить приоритеты, отследить сроки
              и видеть полную картину — без лишней сложности.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-950 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Начать бесплатно
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Войти
              </Link>
            </div>
          </div>

          {/* Right: mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px]">
              <TaskMockup />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
