// Static task-list mockup — purely decorative, no real data

const tasks = [
  {
    id: 1,
    text: "Подготовить квартальный отчёт",
    done: false,
    priority: "high",
    due: "Сегодня",
    dueUrgent: true,
    category: { name: "Рабочие", color: "#4F46E5" },
  },
  {
    id: 2,
    text: "Созвониться с командой",
    done: false,
    priority: "medium",
    due: "Завтра",
    dueUrgent: false,
    category: { name: "Рабочие", color: "#4F46E5" },
  },
  {
    id: 3,
    text: "Записаться к стоматологу",
    done: false,
    priority: "low",
    due: "15 мая",
    dueUrgent: false,
    category: { name: "Личные", color: "#8b5cf6" },
  },
  {
    id: 4,
    text: "Купить подарок на день рождения",
    done: true,
    priority: "medium",
    due: null,
    dueUrgent: false,
    category: { name: "Семья", color: "#22c55e" },
  },
];

const PRIORITY_DOT: Record<string, string> = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-blue-400",
};

export default function TaskMockup() {
  return (
    <div
      className="
        w-full max-w-[420px] rounded-2xl border border-zinc-200
        bg-white shadow-2xl shadow-zinc-200/60
        dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-900/60
        overflow-hidden select-none
      "
      aria-hidden="true"
      role="img"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="ml-3 text-xs text-zinc-400 font-medium">Мои задачи</span>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
          <span>25% выполнено</span>
          <span>3 осталось</span>
        </div>
        <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-emerald-400 rounded-full" />
        </div>
      </div>

      {/* Task list */}
      <ul className="p-3 flex flex-col gap-1.5">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`
              flex items-center gap-2.5 pl-3 pr-3 py-2.5 rounded-xl
              border border-l-4 text-sm transition-colors
              ${task.done
                ? "bg-zinc-50 border-zinc-100 dark:bg-zinc-800/40 dark:border-zinc-800"
                : "bg-white border-zinc-100 shadow-sm dark:bg-zinc-800 dark:border-zinc-700"
              }
              ${!task.done ? (
                task.priority === "high"   ? "border-l-red-400" :
                task.priority === "medium" ? "border-l-amber-400" :
                                             "border-l-transparent"
              ) : "border-l-transparent"}
            `}
          >
            {/* Checkbox */}
            <span
              className={`
                flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${task.done
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-zinc-300 dark:border-zinc-600"
                }
              `}
            >
              {task.done && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                  <path d="M2 5l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>

            {/* Text */}
            <span
              className={`flex-1 min-w-0 truncate ${
                task.done
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {task.text}
            </span>

            {/* Due date */}
            {task.due && !task.done && (
              <span
                className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                  task.dueUrgent
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {task.due}
              </span>
            )}

            {/* Category */}
            {task.category && !task.done && (
              <span
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${task.category.color}18`,
                  color: task.category.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: task.category.color }}
                />
                {task.category.name}
              </span>
            )}

            {/* Priority dot */}
            {!task.done && (
              <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            )}
          </li>
        ))}
      </ul>

      {/* Add task input stub */}
      <div className="mx-3 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
        <svg className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 14 14">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-xs text-zinc-300 dark:text-zinc-600">Новая задача...</span>
      </div>
    </div>
  );
}
