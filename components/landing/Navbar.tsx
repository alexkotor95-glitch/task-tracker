import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
        aria-label="Главная навигация"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
          aria-label="Compass — на главную"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M11 6.5L13.5 11L11 15.5L8.5 11L11 6.5Z"
              fill="currentColor"
              opacity="0.8"
            />
            <circle cx="11" cy="11" r="1.5" fill="currentColor" />
          </svg>
          <span className="text-[15px] font-semibold tracking-tight">Compass</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#features"
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Возможности
          </a>
          <Link
            href="/login"
            className="inline-flex items-center px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Войти
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Начать
          </Link>
        </div>
      </nav>
    </header>
  );
}
