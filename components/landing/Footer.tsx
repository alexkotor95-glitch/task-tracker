export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
          Compass
        </span>
        <nav aria-label="Дополнительные ссылки" className="flex items-center gap-5">
          <a
            href="https://github.com/alexkotor95-glitch/task-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
          >
            Конфиденциальность
          </a>
          <a
            href="#"
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
          >
            Условия
          </a>
        </nav>
      </div>
    </footer>
  );
}
