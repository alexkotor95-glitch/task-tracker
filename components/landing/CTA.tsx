import Link from "next/link";

export default function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
    >
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-8 py-16 text-center">
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50 mb-4"
        >
          Готовы начать?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-base mb-8 max-w-sm mx-auto">
          Создайте аккаунт за 30 секунд — через email или номер телефона.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-950 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Создать аккаунт
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
