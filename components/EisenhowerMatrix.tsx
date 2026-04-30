"use client";

import { Task, Priority } from "./TaskTracker";
import { getDueDateInfo, isTaskUrgent, Category } from "@/lib/taskUtils";

interface Props {
  tasks: Task[];
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDueDateChange: (id: string, dueDate: string | undefined) => void;
}

function getQuadrant(task: Task): 1 | 2 | 3 | 4 {
  const isImportant = task.priority === "high" || task.priority === "medium";
  const urgent = isTaskUrgent(task);
  if (isImportant && urgent) return 1;
  if (isImportant && !urgent) return 2;
  if (!isImportant && urgent) return 3;
  return 4;
}

const QUADRANTS = [
  {
    id: 1 as const,
    label: "Сделать сейчас",
    sub: "Важно · Срочно",
    wrapClass: "bg-red-50 border-red-200",
    headClass: "text-red-700",
    subClass: "text-red-400",
    emptyClass: "text-red-300",
    numClass: "bg-red-100 text-red-500",
  },
  {
    id: 2 as const,
    label: "Запланировать",
    sub: "Важно · Не срочно",
    wrapClass: "bg-blue-50 border-blue-200",
    headClass: "text-blue-700",
    subClass: "text-blue-400",
    emptyClass: "text-blue-300",
    numClass: "bg-blue-100 text-blue-500",
  },
  {
    id: 3 as const,
    label: "Делегировать",
    sub: "Не важно · Срочно",
    wrapClass: "bg-amber-50 border-amber-200",
    headClass: "text-amber-700",
    subClass: "text-amber-400",
    emptyClass: "text-amber-300",
    numClass: "bg-amber-100 text-amber-600",
  },
  {
    id: 4 as const,
    label: "Исключить",
    sub: "Не важно · Не срочно",
    wrapClass: "bg-gray-50 border-gray-200",
    headClass: "text-gray-600",
    subClass: "text-gray-400",
    emptyClass: "text-gray-300",
    numClass: "bg-gray-200 text-gray-500",
  },
];

export default function EisenhowerMatrix({ tasks, categories, onToggle, onDelete }: Props) {
  const byQuadrant = QUADRANTS.map((q) => ({
    ...q,
    tasks: tasks.filter((t) => getQuadrant(t) === q.id),
  }));

  return (
    <div className="flex flex-col gap-3">
      {/* Axis labels */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">← Важность →</span>
        <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">← Срочность →</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {byQuadrant.map((q) => (
          <div
            key={q.id}
            className={`rounded-2xl border ${q.wrapClass} overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="px-3 pt-2.5 pb-2 flex items-start gap-2">
              <span className={`flex-shrink-0 text-[11px] font-bold w-5 h-5 rounded-md flex items-center justify-center ${q.numClass}`}>
                {q.id}
              </span>
              <div>
                <div className={`text-xs font-semibold leading-tight ${q.headClass}`}>{q.label}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${q.subClass}`}>{q.sub}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-3 border-t border-black/5" />

            {/* Tasks */}
            <div className="p-2 flex flex-col gap-1.5 min-h-[100px] flex-1">
              {q.tasks.length === 0 ? (
                <div className={`flex-1 flex items-center justify-center text-[11px] italic py-6 ${q.emptyClass}`}>
                  Нет задач
                </div>
              ) : (
                q.tasks.map((task) => {
                  const due = getDueDateInfo(task.dueDate);
                  const cat = categories.find((c) => c.id === task.categoryId);
                  return (
                    <div
                      key={task.id}
                      className="group flex items-start gap-2 bg-white/80 hover:bg-white rounded-xl p-2 shadow-sm border border-transparent hover:border-gray-200 transition-all duration-150"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => onToggle(task.id)}
                        aria-label="Выполнить задачу"
                        className="flex-shrink-0 w-3.5 h-3.5 mt-0.5 rounded-full border-2 border-gray-300 hover:border-emerald-400 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />

                      {/* Text + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-700 leading-snug line-clamp-3">{task.text}</p>

                        {/* Due date */}
                        {due.label && (
                          <span className={`text-[10px] font-medium mt-1 inline-block ${due.isUrgent ? "text-red-500" : "text-gray-400"}`}>
                            {due.label}
                          </span>
                        )}

                        {/* Category dot + name */}
                        {cat && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium mt-1 px-1.5 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${cat.color}15`,
                              color: cat.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(task.id)}
                        aria-label="Удалить задачу"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all duration-150 mt-0.5 focus:outline-none focus:opacity-100"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
