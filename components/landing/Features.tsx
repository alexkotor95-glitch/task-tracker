import { LayoutGrid, CalendarClock, Tag } from "lucide-react";

const features = [
  {
    Icon: CalendarClock,
    title: "Приоритеты и сроки",
    description:
      "Назначайте уровень важности и дедлайны. Compass сортирует список сам — срочное всегда сверху.",
  },
  {
    Icon: LayoutGrid,
    title: "Матрица Эйзенхауэра",
    description:
      "Переключитесь в режим матрицы: задачи автоматически раскладываются по квадрантам срочности и важности.",
  },
  {
    Icon: Tag,
    title: "Категории",
    description:
      "Разделяйте личное, рабочее и другие сферы. Фильтруйте список одним нажатием.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
    >
      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-12 text-center">
        Возможности
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
        {features.map(({ Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-4">
            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-50 mb-1.5">
                {title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
